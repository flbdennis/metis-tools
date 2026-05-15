import { z, defineCollection } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string().default('MetisTools Team'),
    category: z.string(),
    tags: z.array(z.string()).optional(),
    readingTime: z.string().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};