import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

const tracks = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/data/tracks' }),
  schema: z.object({
    order: z.number(),
    codeKey: z.string(),
    spec: z.string(),
    titleKey: z.string(),
    nodes: z.array(
      z.object({
        id: z.string(),
        date: z.string().optional(),
        titleKey: z.string(),
        descKey: z.string(),
        tags: z.array(z.string()),
        link: z.string().optional(),
        image: z.string().optional(),
      }),
    ),
  }),
});

const contacts = defineCollection({
  loader: file('src/data/contacts.json'),
  schema: z.object({
    id: z.string(),
    label: z.string(),
    href: z.string(),
    external: z.boolean().optional(),
  }),
});

export const collections = { tracks, contacts };
