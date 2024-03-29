import { createClient } from '../../../prismicio';
import { GetStaticProps } from 'next';
import {asText} from '@prismicio/helpers';
import Head from 'next/head';
import styles from './styles.module.scss';
import Link from 'next/link';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

interface PostProps {
  posts: Post[]
}

export default function Posts({posts}: PostProps){
  return(
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = createClient();

  const response = await prismic.getByType('publication', {
    fetch: ['publication.title', 'publication.content'],
    pageSize: 100
  })

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: asText(post.data.title),
      excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  })

  return{
    props: {
      posts
    }
  }
}