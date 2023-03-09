import { render, screen } from '@testing-library/react'

import Post, { getServerSideProps } from '../../pages/posts/[slug]'

import { createClient } from '../../../prismicio'
import { getSession } from 'next-auth/react'

import { asHTML, asText } from '@prismicio/helpers'

jest.mock('next-auth/react')
jest.mock('../../../prismicio')

const post = {
  slug: 'my-new-post',
  title: 'My New Post',
  content: '<p>Post excerpt</p>',
  updatedAt: '08 de Março',
}

jest.mock('@prismicio/helpers')

describe('Post page', () => {
  it('renders correctly', () => {
    render(<Post post={post} />)

    expect(screen.getByText('My New Post')).toBeInTheDocument()
    expect(screen.getByText('Post excerpt')).toBeInTheDocument()
  })

  it('redirects user if no subscription is found initial data', async () => {
    const getSessionMocked = jest.mocked(getSession)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: null,
    } as any)

    const response = await getServerSideProps({
      params: {
        slug: 'my-new-post',
      },
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/',
        }),
      }),
    )
  })

  it('loads initial data', async () => {
    const getSessionMocked = jest.mocked(getSession)
    const createClientMocked = jest.mocked(createClient)

    const asTextMocked = jest.mocked(asText)
    const asHTMLMocked = jest.mocked(asHTML)

    asTextMocked.mockReturnValueOnce('My New Post')
    asHTMLMocked.mockReturnValueOnce('<p>Post Content</p>')

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription',
    } as any)

    createClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
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
                text: 'Post Content',
              },
            ],
          },
        },
        last_publication_date: '2023-05-16T18:17:48+0000',
      }),
    } as any)

    const response = await getServerSideProps({
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
            content: '<p>Post Content</p>',
            updatedAt: '16 de maio de 2023',
          },
        },
      }),
    )
  })
})
