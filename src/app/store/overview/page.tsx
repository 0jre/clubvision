import { ContainerN,Containercenter } from '@/styles/styled.view';
export const runtime = 'edge';
import { getPackages, getWebstoreData } from '@/lib/oauth/tebex';
import Grid from 'shopping/grid';
import PackageGridItems from 'shopping/layout/package-grid-items';
import Image from 'next/image';
import Event from '@/public/icons/search-engine.png'

export const metadata = {
  title: 'Store',
  description: 'Compre vantagens & items em shopvision. Se divirta com items exclusivos!'
};

interface Prop {
  searchParams: any
}

export default async function Page({
  searchParams
}: Prop) {
  const { q: searchValue } = searchParams as { [key: string]: string };
  const webstoreData = await getWebstoreData();
  const currency = webstoreData ? webstoreData.currency : 'BRL';
  const packages = await getPackages(searchValue);
  const resultsText = packages.length > 1 ? 'results' : 'result';
  return (
    <>
     <ContainerN>
     {searchValue && ( 
      <>
      {packages.length === 0 && 
      (
      <> 
      <ContainerN>
      <Image src={Event} alt="event" height={165} width={165}/>
      <li>
      <p>
      'Não há produtos que correspondam'
      </p>
      <span className="font-bold">&quot;{searchValue}&quot;</span>
      </li>
    </ContainerN>
      </> 
      )}
      </> 
     )}
      
       
      <Containercenter>
    
      {packages.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <PackageGridItems packages={packages} currency={currency} />
        </Grid>
      ) : null}
      </Containercenter>
     </ContainerN>
    </>
  );
}
