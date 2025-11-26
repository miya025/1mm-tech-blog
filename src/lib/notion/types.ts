import { z } from 'zod';

// Notion Database Property Schema
export const NotionPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  status: z.enum(['Draft', 'Published']),
  publishedDate: z.string().nullable(),
  tags: z.array(z.string()),
  excerpt: z.string().nullable(),
  coverImage: z.string().nullable(),
  author: z.string().nullable(),
});

export type NotionPost = z.infer<typeof NotionPostSchema>;

// Block types for rendering
export type NotionBlock = {
  id: string;
  type: string;
  [key: string]: any;
};
