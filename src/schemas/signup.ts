import { z } from 'zod'

const signupScema = z.object({
    name: z
        .string()
        .min(5, {
            message: 'At least 5 characters required',
        })
        .max(20, {
            message: 'Maximum length is 20 characters',
        })
        .trim(),
    email: z.string().email().toLowerCase().trim(),
    password: z
        .string()
        .min(5, {
            message: 'At least 5 characters required',
        })
        .max(5000, {
            message: 'Maximum length is 5000 characters',
        }),
})

export default signupScema
