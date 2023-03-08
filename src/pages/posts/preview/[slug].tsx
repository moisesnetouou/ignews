import { asHTML, asText } from '@prismicio/helpers'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { createClient } from '../../../../prismicio'

import styles from '../post.module.scss'

interface PostPreviewProps {
  post: {
    slug: string
    title: string
    content: string
    updatedAt: string
  }
}

export default function PostPreview({ post }: PostPreviewProps) {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [session])

  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>

          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 😀</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [
      {
        params: {
          slug: 'prisma-uma-das-melhores-coisas-que-ja-aconteceu-no',
        },
      },
    ],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params

  const prismic = createClient()
  const response = await prismic.getByUID('publication', String(slug), {})

  const post = {
    slug,
    title: asText(response.data.title),
    content: asHTML(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      },
    ),
  }

  return {
    props: {
      post,
    },
    revalidate: 60 * 30, // Quando vai ser atualizado novamente. 1 vez a cada 30 minutos
  }
}
