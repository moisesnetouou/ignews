import { render, screen } from '@testing-library/react'

import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'

import { createClient } from '../../../prismicio'
import { useSession } from 'next-auth/react'

import { asHTML, asText } from '@prismicio/helpers'
import { useRouter } from 'next/router'

jest.mock('next-auth/react')
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}))
jest.mock('../../../prismicio')

const post = {
  slug: 'my-new-post',
  title: 'My New Post',
  content: '<p>Post excerpt</p>',
  updatedAt: '08 de Março',
}

jest.mock('@prismicio/helpers')

describe('Post preview page', () => {
  it('renders correctly', () => {
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated',
    })

    render(<Post post={post} />)

    expect(screen.getByText('My New Post')).toBeInTheDocument()
    expect(screen.getByText('Post excerpt')).toBeInTheDocument()
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
  })

  it('redirects user to full post when user is subscribed', async () => {
    const useSessionMocked = jest.mocked(useSession)
    const useRouterMocked = jest.mocked(useRouter)
    const pushMock = jest.fn() // foi criada aqui para saber se foi chamada

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          name: 'Moisés',
        },
        activeSubscription: 'fake-active-subscription',
        expires: 'fake-expires',
      },
      status: 'authenticated',
    })

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any)

    render(<Post post={post} />)

    expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post')
  })

  it('loads initial data', async () => {
    const createClientMocked = jest.mocked(createClient)

    const asTextMocked = jest.mocked(asText)
    const asHTMLMocked = jest.mocked(asHTML)

    asTextMocked.mockReturnValueOnce('My New Post')
    asHTMLMocked.mockReturnValueOnce(
      '<p>Post Content 1</p><p>Post Content 2</p><p>Post Content 3</p>',
    )

    createClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            {
              type: 'heading1',
              text: 'My New Post',
            },
          ],
          content: [
            {
              type: 'paragraph',
              text: 'Post Content 1',
              spans: [{}],
            },
            {
              type: 'paragraph',
              text: 'Post Content 2',
              spans: [{}],
            },
            {
              type: 'paragraph',
              text: 'Post Content 3',
              spans: [{}],
            },
          ],
        },
        last_publication_date: '2023-05-16T18:17:48+0000',
      }),
    } as any)

    const response = await getStaticProps({
      params: {
        slug: 'my-new-post',
      },
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My New Post',
            content:
              '<p>Post Content 1</p><p>Post Content 2</p><p>Post Content 3</p>',
            updatedAt: '16 de maio de 2023',
          },
        },
      }),
    )
  })
})
