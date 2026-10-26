import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPackage, getWebstoreData } from '@/lib/oauth/tebex';
import { Gallery } from 'shopping/package/gallery';
import { PackageDescription } from 'shopping/package/package-description';
import { Suspense } from 'react';
import { CardPackage, Imagepackage } from '@/styles/styled.view';
 
export const runtime = 'edge';

 interface Prop {
   params: any;
 }

export async function generateMetadata({
  params
}: Prop): Promise<Metadata> {
  const packageData = await getPackage(Number(params.handle));

  if (!packageData) return notFound();

  return {
    
    title: packageData.name,
    description: packageData.description,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true
      }
    },
    openGraph: packageData.image
      ? {
          images: [
            {
              url: packageData.image,
              // width,
              // height,
              alt: packageData.name
            }
          ]
        }
      : null
  };
}

export default async function PackagePage({ params }: Prop) {
  const packageData = await getPackage(Number(params.handle));
  const webstoreData = await getWebstoreData();
  const currency = webstoreData ? webstoreData.currency : 'BRL';

  if (!packageData) return notFound();

  const packageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: packageData.name,
    description: packageData.description,
    image: packageData.image,
    offers: {
      '@type': 'AggregateOffer',
      availability: 'https://schema.org/InStock',
      priceCurrency: currency,
      price: packageData.total_price
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(packageJsonLd)
        }}
      />
      <div className="mx-auto max-w-screen-2xl px-4 pb-4">
        <CardPackage>
          
          <Imagepackage>
            <Gallery
              images={
                packageData.image
                  ? [
                      {
                        src: packageData.image,
                        altText: packageData.name
                      }
                    ]
                  : []
              }
            />
          </Imagepackage>
       
          <div className="basis-full lg:basis-2/6">
            <PackageDescription packageData={packageData} currency={currency} />
          </div>
        </CardPackage>
      </div>
      <Suspense>
  
      </Suspense>
    </>
  );
}
