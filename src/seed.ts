import type { Payload } from 'payload'

export const devUser = {
  email: 'dev@payloadcms.com',
  password: 'test',
}

// Runs on init: one user and 15 posts (more than the list's default limit of 10, so it paginates).
export const seed = async (payload: Payload): Promise<void> => {
  const { totalDocs } = await payload.count({ collection: 'users' })
  if (totalDocs > 0) return

  const user = await payload.create({ collection: 'users', data: devUser })

  for (let i = 1; i <= 15; i++) {
    await payload.create({
      collection: 'posts',
      data: {
        title: `Post ${i}`,
        author: user.id,
        publishedAt: new Date(Date.UTC(2026, 0, i)).toISOString(),
      },
    })
  }
}
