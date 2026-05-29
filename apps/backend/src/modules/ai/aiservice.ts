import {Router} from 'express'
import { aiInputSchema } from '../../config/types.js';
 export const airouter:Router = Router();
 airouter.post('/ask', async(req, res)=>{
    const  request = aiInputSchema.safeParse(req.body)
    if(!request.success){
      return res.status(400).json({error:"invalid input"})
   }
    try {
        
    } catch (error) {
        
    }
 })