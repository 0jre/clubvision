import ROUTENVX from '@/routes/routes';
import Head from 'next/head';

interface MetaProps {
  title: string | undefined;
  description: string | undefined;
  thumbnailUrl: string | undefined;
  videoPath: string | undefined;
  _id: string | undefined; 
}
const Meta: React.FC<MetaProps> = ({
  title,
  description,
  thumbnailUrl,
  videoPath,
  _id,
}) => {
  const pageUrl = `${ROUTENVX.TheNoVision}/club/watch?v=${_id}`;
   const ption = 'Mergulhe em um ambiente ricamente detalhado e repleto de desafios emocionantes. Nossa prioridade é proporcionar a você a melhor experiência possível, e é por isso que nossos produtos foram desenvolvidos com cuidado meticuloso para garantir que você encontre exatamente o que procura. Prepare-se para uma experiência de jogo verdadeiramente imersiva e cativante. Nossa missão é garantir que você desfrute de momentos inesquecíveis enquanto explora os confins deste universo virtual'
   const tilt = 'NVRP + Clubvision | Sua experiencia aqui é totalmente unica!'
   const ImageUrl = `https://i.imgur.com/LUMLxBn.png`
  const Url = "https://thenovision.com"
  return (
    <Head>
    <title>{title ? title : tilt}</title>
    <meta name="description" content={description ? description : ption} />

    {/* Open Graph */}
    <meta property="og:type" content="video.mp4" />
    <meta property="og:title" content={title ? title : tilt} />
    <meta property="og:description" content={description ? description : ption} />
    <meta property="og:image" content={thumbnailUrl ? thumbnailUrl : ImageUrl} />
    <meta property="og:url" content={pageUrl ? pageUrl : Url} />
    <meta property="og:site_name" content="VisionTv" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:video" content={videoPath} />
    <meta property="og:video:secure_url" content={videoPath} />
    <meta property="og:video:type" content="video/mp4" />
    <meta property="og:video:width" content="1280" />
    <meta property="og:video:height" content="720" />
  
    {/* Twitter Cards */}
    <meta name="twitter:card" content="player" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={thumbnailUrl} />
    <meta name="twitter:player" content={videoPath} />
    <meta name="twitter:player:width" content="1280" />
    <meta name="twitter:player:height" content="720" />
  </Head>
  
  );
};

export default Meta;
