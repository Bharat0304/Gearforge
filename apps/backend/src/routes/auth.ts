import {Router } from 'express';
import {prisma  } from '@repo/db'
import { SigninSchema, SignupSchema } from '../config/types.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"
import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET=process.env.JWT_SECRET || 'default-secret-key' 
export const  authrouter: Router  = Router();
authrouter.post('/signup', async(req , res)=>{
    const result = SignupSchema.safeParse(req.body);
        if(!result.success){
            return res.status(400).json({message : 'Invalid input'});
        }
        const data = result.data
    try{
            const user = await prisma.user.findUnique({
                where:{
                    email: data.email
                }
            })
            if(user){
                return res.status(400).json({message : 'User already exists'});
            }
            
            const hashedpassword= await bcrypt.hash(data.password, 10)
            const account=await prisma.user.create({
                data:{
                    email:data.email,
                    password:hashedpassword,
                    name:data.name
                }
            })
            return res.status(201).json({message : 'User created successfully'});
    }catch(error){
        return res.status(500).json({message : 'Internal server error'});
    }
})
authrouter.post("/signin", async(req,res)=>{
    const result = SigninSchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({message : 'Invalid input'});
    }
    const data = result.data
    try{
        const user=await prisma.user.findUnique({
            where:{
                email: data.email,
               
            }
        })
        if(!user){
            return res.status(400).json({message : 'Invalid credentials'});
        }
        const isPasswordValid = await bcrypt.compare(data.password, user.password)
        if(!isPasswordValid){
            return res.status(400).json({message : 'Invalid credentials'});
        }
        const token=jwt.sign({
         userId:user.id
        }, JWT_SECRET, {
            expiresIn: '1h'
        })
        return res.status(200).json({message : 'User signed in successfully', token});
    }catch(error){
        return res.status(500).json({message : 'Internal server error'});
    }
})
export default authrouter; 