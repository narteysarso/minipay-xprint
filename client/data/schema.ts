import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string()
})

export const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
export const ACCEPTED_FILE_TYPES = ['image/png'];

export const printerSchema = z.object({
  hash: z.string(),
  name: z.string(),
  description: z.string().optional(),
  longitude: z.number(),
  latitude: z.number()
})

export const PrintFormSchema = z.object({
  name: z.string().min(2, {
      message: "Username must be at least 2 characters.",
  }).optional(),
  printType: z.string(),
  bindType: z.string(),
  file: typeof window === 'undefined' ? z.any() : z
      .instanceof(File),
  deliveryType: z.string().optional(),
  pickup: z.array().optional(),
  cost: z.string().optional(),
  deliveryFee: z.number().optional()
})

export const printSchema = z.object({
  name: z.string().min(2, {
      message: "Username must be at least 2 characters.",
  }).optional(),
  printType: z.string(),
  bindType: z.string(),
  file: typeof window === 'undefined' ? z.any() : z
  .instanceof(File)
  .optional()
  .refine((file) => {
    return !file || file.size <= MAX_UPLOAD_SIZE;
  }, 'File size must be less than 3MB')
  .refine((file) => {
    return ACCEPTED_FILE_TYPES.includes(file.type);
  }, 'File must be a PDF'),
  deliveryType: z.string().optional(),
  pickup: z.array().optional(),
  deliveryFee: z.number().optional(),
  cost: z.string().optional(),
  pageCount: z.number().optional(),
  printer: printerSchema
})

export type Printer = z.infer<typeof printerSchema>

export type Print = z.infer<typeof printSchema>

export type Task = z.infer<typeof taskSchema>