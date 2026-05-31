import z from 'zod';
export const SignupSchema= z.object({
    email: z.email({message: 'Invalid email address'}),
    password: z.string().min(8),
    name: z.string().min(3),
})
export const SigninSchema= z.object({
    email :z.email({message : 'Invalid email address '}),
    password:z.string().min(8)
})
export const aiInputSchema= z.object({
    message: z.string().max(1000),
    model: z.string().optional(),
    projectId: z.string().optional() // Allow optional for testing
})
