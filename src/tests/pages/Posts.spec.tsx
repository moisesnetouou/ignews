import { render, screen } from '@testing-library/react'

import Posts, { getStaticProps } from '../../pages/posts'

import { createClient } from '../../../prismicio'

jest.mock('../../../prismicio')

const posts = [
  {
    slug: 'my-new-post',
    title: 'My New Post',
    excerpt: 'Post excerpt',
    updatedAt: '08 de Março',
  },
]

describe('Home page', () => {
  it('renders correctly', () => {
    render(<Posts posts={posts} />)

    expect(screen.getByText('My New Post')).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const createClientMocked = jest.mocked(createClient)

    createClientMocked.mockReturnValueOnce({
      getByType: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'fake-slug',
            last_publication_date: '2023-05-16T20:31:44+0000',
            data: {
              title: [
                {
                  type: 'heading1',
                  text: 'Fake title 1',
                },
              ],
              content: [
                {
                  type: 'paragraph',
                  text: 'Fake excerpt 1',
                },
              ],
            },
          },
        ],
      }),
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'fake-slug',
              title: 'Fake title 1',
              excerpt: 'Fake excerpt 1',
              updatedAt: '16 de maio de 2023',
            },
          ],
        },
      }),
    )
  })
})
