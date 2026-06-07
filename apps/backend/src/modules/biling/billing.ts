import type {  Request, Response } from 'express';
import {Router } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { prisma } from '@repo/db';
import { usermiddleware } from '../../common/middleware/auth.js';

export const bRouter: Router = Router();

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// Create an order
bRouter.post('/create-order', usermiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const options = {
      amount: amount * 100, // Razorpay uses subunits
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save billing record as pending
    await prisma.billing.create({
      data: {
        userId,
        amount,
        provider: "razorpay",
        orderId: order.id,
        status: "pending",
        currency: "INR",
        receipt: options.receipt
      }
    });

    return res.status(200).json({ orderId: order.id, amount: options.amount, currency: options.currency });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return res.status(500).json({ error: "Failed to create order" });
  }
});

// Verify the payment
bRouter.post('/verify-payment', usermiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      // Payment verification failed
      await prisma.billing.updateMany({
        where: { orderId: razorpay_order_id, userId },
        data: { status: "failed" }
      });
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // Payment verification successful
    await prisma.billing.updateMany({
      where: { orderId: razorpay_order_id, userId },
      data: { status: "success" }
    });

    return res.status(200).json({ message: "Payment verified successfully" });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({ error: "Failed to verify payment" });
  }
});
