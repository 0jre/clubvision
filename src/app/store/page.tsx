import { ContainerN,Containercenter } from '@/styles/styled.view';
import Whehere from 'shopping/home/where-go';
import AnnounceStore from 'shopping/home/announces';
import Homestoreview from 'shopping/home';
export const runtime = 'edge';

export const metadata = {
  title: 'Store',
  description: 'Compre vantagens & items em shopvision. Se divirta com items exclusivos!'
};

export default async function Page() {

  return (
    <>
    <AnnounceStore />
     <ContainerN>
     <Homestoreview />
      <Containercenter>
      <Whehere />
      
      </Containercenter>
     </ContainerN>
    </>
  );
}
