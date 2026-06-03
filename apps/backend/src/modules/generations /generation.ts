import { prisma } from '@repo/db';
import {Router } from 'express'
import { usermiddleware } from '../../common/middleware/auth.js';
const genrouter:Router= Router();
genrouter.get('/generations',usermiddleware,  async(req ,res )=>{
    try{
        const result = await prisma.generation.findMany({
            select:{
                id : true,
                
            }
        })
        res.status(200).json(result)
        
    }
    catch(e ){
        res.status(500).json({message:e})
    }
})
genrouter.get('/generation/:id', async(req ,res)=>{
    const id = req.params.id;
    try{
        const result = await prisma.generation.findUnique({
            where:{
                id :id
            }
        })
        res.status(200).json(result)
        
    }
    catch(e ){
        res.status(500).json({message:e})
    }
})
genrouter.delete('/generation/:id', async(req ,res)=>{
    const id = req.params.id;

    try{
        const result = await prisma.generation.delete({
            where:{
                id :id
            }
        })
        res.status(200).json(result)
        
    }
    catch(e ){
        res.status(500).json({message:e})
    }
})
