import { z } from 'zod'

const signupScema = z.object({
    name: z
        .string()
        .min(5, {
            message: 'At least 5 characters required',
        })
        .max(20, {
            message: 'Maximum length is 20 characters',
        }),
    email: z.string().email(),
    password: z
        .string()
        .min(5, {
            message: 'At least 5 characters required',
        })
        .max(100, {
            message: 'Maximum length is 100 characters',
        }),
})

export default signupScema
