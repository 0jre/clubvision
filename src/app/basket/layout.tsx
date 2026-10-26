import { ensureStartsWith } from '@/lib/oauth/tebex/utils';
import { ReactNode, Suspense } from 'react';
import Topbarstore from 'shopping/topbar/top.view';
import Footerx from 'shopping/topbar/footer';
import { StyleStore } from '@/styles/styled.view';
  
const { TWITTER_CREATOR, TWITTER_SITE, SITE_NAME } = process.env;
const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';
const twitterCreator = TWITTER_CREATOR ? ensureStartsWith(TWITTER_CREATOR, '@') : undefined;
const twitterSite = TWITTER_SITE ? ensureStartsWith(TWITTER_SITE, 'https://') : undefined;

export const metadata = {
  metadataBase: new URL(baseUrl),

  title: { 
    default: 'Store ',
    template: `%s | Shopvision `
  },
  robots: {
    follow: true,
    index: true
  },
  ...(twitterCreator &&
    twitterSite && {
      twitter: {
        card: 'summary_large_image',
        creator: twitterCreator,
        site: twitterSite
      }
    })
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    
      <div>
        <StyleStore />
        <Topbarstore />
        {children}
        <Footerx />
      </div>
    
  );
}
