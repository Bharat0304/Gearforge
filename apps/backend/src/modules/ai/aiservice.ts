import {OpenRouter} from '@openrouter/sdk';
import {Router } from 'express'
import { aiInputSchema } from '../../config/types.js';
import { SystemPrompt } from './template.js';
import { usermiddleware } from '../../common/middleware/auth.js';
export const airouter:Router = Router()
import dotenv from 'dotenv';
import { prisma } from '@repo/db';
import { fetchData, generateVideo } from '../services/data.js';
dotenv.config()
const Model = "anthropic/claude-sonnet-4"

airouter.post('/ask', usermiddleware, async(req ,res)=>{
    const userId = (req as any).userId;
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const generationCount = await prisma.generation.count({
            where: { userId }
        });

        if (generationCount >= 3) {
            const successfulBilling = await prisma.billing.findFirst({
                where: {
                    userId: userId,
                    status: "success" // Or "paid", depending on webhook implementation
                }
            });

            if (!successfulBilling) {
                return res.status(402).json({ error: "Subscription required. You have exhausted your free prompt." });
            }
        }
    } catch (e) {
        console.error("Error checking subscription:", e);
        return res.status(500).json({ error: "Internal server error" });
    }

    const result = aiInputSchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({error:result.error.issues});
    }
    const {message, model, projectId}= result.data;
    try{
        const client = new OpenRouter({
          apiKey: process.env.OPENROUTER_API_KEY
        });
        const response = await client.chat.send({
          chatRequest:{
            model: model || Model,
            maxTokens: 4500,
            messages:[
              {role:"system", content:SystemPrompt},
              {role:"user", content:message}
            ]
          }   
        });
        const content = response.choices?.[0]?.message?.content || "";
        console.log("Generated Content", content)
        
        let parsedData: any = { blenderCode: content, components: [], assemblySteps: [] };
        try {
          // Extract JSON block using regex to ignore any surrounding conversational text
          const match = content.match(/\{[\s\S]*\}/);
          if (match) {
            parsedData = JSON.parse(match[0]);
          } else {
            parsedData = JSON.parse(content);
          }
        } catch (e) {
          console.warn("Failed to parse JSON, falling back to raw content");
        }
        
        let generationId;
        try{
          const data = await prisma.generation.create({
            data: {
              prompt: message,
              generatedCode: parsedData.blenderCode || content,
              components: parsedData.components ? parsedData.components : [],
              assemblySteps: parsedData.assemblySteps ? parsedData.assemblySteps : [],
              userId: userId,
              ...(projectId ? { projectId } : {})
            }
          });
          generationId = data.id;
        }
        catch(e){
          console.error("Failed to save to database:", e instanceof Error ? e.message : e);
          return res.status(500).json({error: "Failed to save generation"});
        }
        return res.status(200).json({ response: parsedData, id: generationId });
    }
    catch(e){
        return res.status(400).json({error: e instanceof Error ? e.message : e})
    }  
})

airouter.post('/send', async(req, res)=>{
  try {
    const generation = await prisma.generation.findUnique({
      where:{
        id: req.body.id
      }
    })
    
    if (!generation || !generation.generatedCode) {
      return res.status(404).json({error: "Generation not found or no code generated"});
    }

    const result = await fetchData({
      id: generation.id,
      code: generation.generatedCode
    })
    
    let videoResult = null;
    if (result.success) {
      videoResult = await generateVideo({
        id: generation.id,
        code: generation.generatedCode
      })
    }
    
    // Update generation status based on result
    await prisma.generation.update({
      where: { id: generation.id },
      data: {
        status: result.success ? "COMPLETED" : "FAILED",
        imageUrl: result.renderPath,
        videoUrl: videoResult?.videoPath || null,
        error: result.stderr || videoResult?.stderr || null
      }
    });

    return res.status(200).json({ result, videoResult })
  } catch (e) {
    return res.status(500).json({error: e instanceof Error ? e.message : e})
  }
})
