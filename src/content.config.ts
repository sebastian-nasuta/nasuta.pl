import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

const projects = defineCollection({
  loader: file('src/data/projects.json'),
  schema: z.object({
    id: z.string(),
    date: z.string().optional(),
    titleKey: z.string(),
    descKey: z.string(),
    tags: z.array(z.string()),
    link: z.string().optional(),
    image: z.string().optional(),
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

export const collections = { projects, contacts };
