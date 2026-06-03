import type  {Request, Response , NextFunction} from 'express'
import jwt from 'jsonwebtoken';
const JWT_SECRET =''
export  function usermiddleware(req :Request, res:Response, next :NextFunction){
    const token = req.headers.authorization;
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(403).json({message :"invalid token"})
    }
try{    const authtoken = token.split(' ')[1];
            if (!authtoken) return res.status(403).json({message :"invalid token"})
    const verify = jwt.verify(authtoken, JWT_SECRET) as jwt.JwtPayload
   
    req.userId = verify.userId as string ;
    next()
}
catch (e){

}
}