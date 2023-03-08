import { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { Header } from '../components/Header'

import { PrismicProvider } from '@prismicio/react'
import { PrismicPreview } from '@prismicio/next'
import { repositoryName } from '../../prismicio'

import '../styles/global.scss'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <PrismicProvider>
      <PrismicPreview repositoryName={repositoryName}>
        <SessionProvider session={session}>
          <Header />
          <Component {...pageProps} />
        </SessionProvider>
      </PrismicPreview>
    </PrismicProvider>
  )
}

export default MyApp
