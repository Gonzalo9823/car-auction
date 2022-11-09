import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { SWRConfig } from 'swr';
import { fetcher } from '../http';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Toaster position="top-right" />
      <SWRConfig value={{ fetcher }}>
        <Component {...pageProps} />
      </SWRConfig>
    </>
  );
}
