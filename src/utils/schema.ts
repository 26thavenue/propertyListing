import { z } from 'zod';
import { ZodMiddleware } from '../middlewares/errorMiddleware';

const userSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const userValidator= new ZodMiddleware(userSchema);

