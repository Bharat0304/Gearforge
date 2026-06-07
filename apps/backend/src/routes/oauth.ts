import { Router } from "express";
import axios from "axios";
import { prisma } from "@repo/db";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key";
export const oauthRouter: Router = Router();

oauthRouter.get("/github", (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}&scope=user:email`;
  res.redirect(githubAuthUrl);
});

oauthRouter.get("/github/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ message: "No code provided" });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
      return res.status(400).json({ message: "Failed to get access token" });
    }

    // Get user info
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const emailResponse = await axios.get("https://api.github.com/user/emails", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const userData = userResponse.data;
    const emails = emailResponse.data;
    const primaryEmail = emails.find((email: any) => email.primary)?.email || emails[0]?.email;
    
    if (!primaryEmail) {
        return res.status(400).json({ message: "No public email associated with GitHub account" });
    }

    // Check if user exists in db
    let user = await prisma.user.findUnique({
      where: {
        email: primaryEmail,
      },
    });

    if (!user) {
      // Create a random password for OAuth users since it's required in schema
      user = await prisma.user.create({
        data: {
          email: primaryEmail,
          name: userData.name || userData.login,
          password: Math.random().toString(36).slice(-8), // random dummy password
        },
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Redirect to frontend with token, or send JSON
    // Adjust FRONTEND_URL to match your frontend domain
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    res.redirect(`${frontendUrl}/signin?token=${token}`);
  } catch (error: any) {
    console.error("GitHub OAuth Error:", error.response?.data || error.message);
    res.status(500).json({ 
      message: "Internal server error during GitHub OAuth", 
      error: error.response?.data || error.message,
      stack: error.stack
    });
  }
});

oauthRouter.get("/google", (req, res) => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=email profile`;
  res.redirect(googleAuthUrl);
});

oauthRouter.get("/google/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ message: "No code provided" });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    });

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
      return res.status(400).json({ message: "Failed to get access token" });
    }

    // Get user info
    const userResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = userResponse.data;
    const primaryEmail = userData.email;
    
    if (!primaryEmail) {
        return res.status(400).json({ message: "No email associated with Google account" });
    }

    // Check if user exists in db
    let user = await prisma.user.findUnique({
      where: {
        email: primaryEmail,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: primaryEmail,
          name: userData.name || primaryEmail.split('@')[0],
          password: Math.random().toString(36).slice(-8), // random dummy password
        },
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    res.redirect(`${frontendUrl}/signin?token=${token}`);
  } catch (error: any) {
    console.error("Google OAuth Error:", error.response?.data || error.message);
    res.status(500).json({ 
      message: "Internal server error during Google OAuth", 
      error: error.response?.data || error.message,
      stack: error.stack
    });
  }
});

export default oauthRouter;