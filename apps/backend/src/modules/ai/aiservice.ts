import {OpenRouter} from '@openrouter/sdk';
import {Router } from 'express'
import { aiInputSchema } from '../../config/types.js';
import { SystemPrompt } from './template.js';
export const airouter:Router = Router()
import dotenv from 'dotenv';
import { prisma } from '@repo/db';
import { fetchData } from '../services/data.js';
dotenv.config()
const Model = "anthropic/claude-sonnet-4"

airouter.post('/ask', async(req ,res)=>{
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
        
        let generationId;
        try{
          const data = await prisma.generation.create({
            data: {
              prompt: message,
              generatedCode: content,
              ...(projectId ? { projectId } : {})
            }
          });
          generationId = data.id;
        }
        catch(e){
          console.error("Failed to save to database:", e instanceof Error ? e.message : e);
          return res.status(500).json({error: "Failed to save generation"});
        }
        return res.status(200).json({ response: content, id: generationId });
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
    
    // Update generation status based on result
    await prisma.generation.update({
      where: { id: generation.id },
      data: {
        status: result.success ? "COMPLETED" : "FAILED",
        renderPath: result.renderPath,
        error: result.stderr || null
      }
    });

    return res.status(200).json({result})
  } catch (e) {
    return res.status(500).json({error: e instanceof Error ? e.message : e})
  }
})
