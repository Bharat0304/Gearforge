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
    const {message , model }= result.data;
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
          console.log(JSON.stringify(content))
        try{
          const data = await prisma.codeSnippet.create({
            data: {
              code: content,
            }
          });
         
        }
        catch(e){
          console.error("Failed to parse content as JSON or save to database:", e instanceof Error ? e.message : e);
        }
        return res.status(200).json({ response: content });
    }
    catch(e){
        return res.status(400).json({error: e instanceof Error ? e.message : e})
    }  
  
})
airouter.post('/send', async(req ,res )=>{
  const product =await prisma.codeSnippet.findUnique({
    where:{
      id: req.body.id
    }
  })
  const result =  await fetchData({
    code: product?.code
  })
  return res.status(200).json({result})
})


