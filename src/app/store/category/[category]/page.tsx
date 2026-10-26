import { getCategory, getWebstoreData } from '@/lib/oauth/tebex';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Grid from '@club/shop/grid';
import PackageGridItems from '@club/shop/layout/package-grid-items';

export const runtime = 'edge';

interface Prop {
  params: any;
}
export async function generateMetadata({ params}: Prop){
  const category = await getCategory(Number(params.category));

  if (!category) return notFound();

  return {
    title: category.name,
    description: category.description
  };
}

export default async function CategoryPage({params}: Prop) {
  const category = await getCategory(Number(params.category), true);
  const webstoreData = await getWebstoreData();
  const currency = webstoreData ? webstoreData.currency : 'BRL';

  if (!category) {
    return notFound;
  }
  return (
    <>
 
    <div className="flex   flex-wrap p-1 w-full items-center justify-center gap-2">
      {category.packages.length === 0 ? (
        <p className="py-3 text-lg">{`Nenhum produto encontrado nesta coleção`}</p>
      ) : (
        <>
          <PackageGridItems packages={category.packages} currency={currency} />
       
        </>
      )}
    </div>

          
    </>
  );
}
