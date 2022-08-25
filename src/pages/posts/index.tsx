import Head from 'next/head';
import styles from './styles.module.scss';

export default function Posts(){
  return(
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="">
            <time>25 de agosto de 2021</time>
            <strong>NextJs ou NuxtJs</strong>
            <p>Qual destes dois é o melhor para o meu projeto? E eu digo... depende, sempre depende.</p>
          </a>

          <a href="">
            <time>25 de agosto de 2021</time>
            <strong>NextJs ou NuxtJs</strong>
            <p>Qual destes dois é o melhor para o meu projeto? E eu digo... depende, sempre depende.</p>
          </a>

          <a href="">
            <time>25 de agosto de 2021</time>
            <strong>NextJs ou NuxtJs</strong>
            <p>Qual destes dois é o melhor para o meu projeto? E eu digo... depende, sempre depende.</p>
          </a>
        </div>
      </main>
    </>
  );
}