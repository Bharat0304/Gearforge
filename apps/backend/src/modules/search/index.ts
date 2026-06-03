import { Router } from 'express';
import { tavily } from '@tavily/core';

export const searchRouter: Router = Router();

searchRouter.post('/items-search', async (req, res) => {
   try {
        const prompt = req.body.prompt;
        if (!prompt) {
             return res.status(400).json({ error: "Prompt is required" });
        }
        const tavilyApiKey = process.env.TAVILY_API_KEY || process.env.Tavily_API;
        if (!tavilyApiKey) {
            throw new Error("TAVILY_API_KEY is not defined");
        }
        const client = tavily({ apiKey: tavilyApiKey });
        const response = await client.search(prompt, {
          searchDepth: "advanced"
        });
        
        return res.status(200).json(response);
   } 
   catch (e) {
        console.error("Tavily search error:", e);
        return res.status(500).json({ error: e instanceof Error ? e.message : e });
   }
});