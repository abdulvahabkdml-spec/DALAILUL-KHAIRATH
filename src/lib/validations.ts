import { z } from 'zod';

// Input sanitization and validation schemas for the Admin Panel
// These prevent SQL Injection by strict type checking and XSS by stripping or restricting HTML tags
// Use these in your Server Actions or API routes before touching the database.

// Reusable regex to disallow `<script>` tags or raw HTML where it's not expected
const xssPreventionRegex = /^[^<>]*$/;

export const updateNewsSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title is too long")
    .regex(xssPreventionRegex, "HTML tags are not allowed in the title"),
  
  content: z
    .string()
    .min(10, "Content must be at least 10 characters long")
    // If you allow rich text, you should use a library like DOMPurify on the server instead of a regex
    // For plain text content, this regex prevents raw HTML:
    .regex(xssPreventionRegex, "HTML tags are not allowed in the content (use markdown if needed)"),
    
  isPublished: z.boolean().default(false),
});

export const updateDonationLinkSchema = z.object({
  provider: z.enum(["donorbox", "bank_transfer"]),
  paymentUrl: z
    .string()
    .url("Must be a valid URL")
    .startsWith("https://", "Payment URLs must use secure HTTPS routing"),
});

export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;
export type UpdateDonationLinkInput = z.infer<typeof updateDonationLinkSchema>;
