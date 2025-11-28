import { z } from 'zod';

// CTA Schema (Pro版: RelatedCTAリレーションから取得)
export const CTASchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  buttonText: z.string(),
  buttonUrl: z.string(),
  backgroundColor: z.string().nullable(),
});

export type CTA = z.infer<typeof CTASchema>;

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
  // Pro版専用プロパティ
  isAdSense: z.boolean().default(false),
  relatedCTA: z.array(CTASchema).default([]),
});

export type NotionPost = z.infer<typeof NotionPostSchema>;

// Block types for rendering
export type NotionBlock = {
  id: string;
  type: string;
  [key: string]: any;
};
