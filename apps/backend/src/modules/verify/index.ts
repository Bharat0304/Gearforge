import {Router } from 'express';
import { usermiddleware } from '../../common/middleware/auth.js';
import multer from 'multer';
import Multer from 'multer';

import { prisma } from '@repo/db';
import { OpenRouter } from '@openrouter/sdk';
import { VerficationPrompt } from './prompt.js';
import { SystemPrompt } from '../ai/template.js';
export const vRouter:Router=Router();
const model = "gemini/gemini-2.5-flash-image-preview"  


const Storage = multer.diskStorage({
    destination:function(req ,res ,cb ){
        cb(null,"./verify");
    },
    filename: function(req ,file, cb){
        cb(null , file.fieldname + '-'+ Date.now() + ".jpg")
    }
})
const fileFilter = (req:Express.Request, file:Express.Multer.File , cb:any  ) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Only JPG, JPEG, and PNG are allowed!'), false);
  }
};
const upload=multer({
    storage:Storage,
    limits:{fileSize:1024 *1024 * 10},
    fileFilter:fileFilter
})


vRouter.post('/upload',upload.single('image'), usermiddleware, async(req ,res)=>{
        try{
            if(!req.files){
                return res.status(400).json({error : "file is required "})
            }
            res.status(200).json({
                message : "file uploaded successfully",
                filepath : `./verify/${req.file?.filename}`
            })
        }
        catch(e){
            console.log(e);
            return res.status(500).json({error : "Internal Server Error"})
        }
})
vRouter.post('/verify',usermiddleware,  async(req ,res)=>{
    try{
        const data= await prisma.generation.findFirst({
            where:
            {
                id : req.body.id
            }})
            
        if (!data) {
            return res.status(404).json({error: "Generation not found"});
        }

        let userContent: any[] = [
            {
                type: "text",
                text: `Project context:\nPrompt: ${data.prompt}\nComponents: ${JSON.stringify(data.components)}\nSteps: ${JSON.stringify(data.assemblySteps)}\n\nCurrent Step: ${req.body.step || 'Please verify the build progress.'}`
            }
        ];

        if (req.body.filepath) {
            const fs = await import('fs');
            const path = await import('path');
            // Ensure the path is within the verify directory for security
            const fullPath = path.resolve(req.body.filepath);
            if (fs.existsSync(fullPath)) {
                const base64Image = fs.readFileSync(fullPath).toString('base64');
                let ext = path.extname(fullPath).substring(1);
                if (ext === 'jpg') ext = 'jpeg';
                userContent.push({
                    type: "image_url",
                    image_url: {
                        url: `data:image/${ext};base64,${base64Image}`
                    }
                });
            }
        } else if (req.body.imageUrl) {
            userContent.push({
                type: "image_url",
                image_url: {
                    url: req.body.imageUrl
                }
            });
        }

        const client = new OpenRouter({
            apiKey:process.env.OPENROUTER_API_KEY
        })
        const response = await client.chat.send({
            chatRequest:{
                model: model ,
                maxTokens: 4500,
                messages:[
                    {role:"system", content:VerficationPrompt},
                    {role:"user", content: userContent}
                ]
            }   
        });
        
        return res.status(200).json({message:"Verification done", response}) 

    }
    catch(e){
        return res.status(400).json({error : e instanceof Error ? e.message : e})
    }
})