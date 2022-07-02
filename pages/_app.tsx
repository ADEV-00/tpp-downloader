import "../styles/globals.css";
import type { AppProps } from "next/app";
import Script from "next/script";
import * as gtag from "../lib/gtag";
import { ThemeProvider } from "next-themes";
import { DefaultSeo } from "next-seo";
import SEO from "../next-seo.config";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_AD}`}
        crossOrigin="anonymous"
      />
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <DefaultSeo {...SEO} />
      <ThemeProvider attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default MyApp;
