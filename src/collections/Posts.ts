import type { CollectionConfig } from 'payload'

// One field of each kind the report covers: relationship (react-select), date (react-datepicker), Lexical.
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'author', type: 'relationship', relationTo: 'users' },
    { name: 'publishedAt', type: 'date' },
    { name: 'content', type: 'richText' },
  ],
}
