import Head from "next/head";
 

interface Props {
  Title?: string;
  Description?: string;
  ImageUrl?: string;
  Url?: string;
}

export default function HeadGlobal({
  Title,
  Description = "Mergulhe em um ambiente ricamente detalhado e repleto de desafios emocionantes. Nossa prioridade é proporcionar a você a melhor experiência possível, e é por isso que nossos produtos foram desenvolvidos com cuidado meticuloso para garantir que você encontre exatamente o que procura. Prepare-se para uma experiência de jogo verdadeiramente imersiva e cativante. Nossa missão é garantir que você desfrute de momentos inesquecíveis enquanto explora os confins deste universo virtual",
  ImageUrl = `https://i.imgur.com/LUMLxBn.png`, 
  Url = "https://thenovision.com",
}: Props) {
  return (
    <>
      <Head>
        {/* Meta Tags Gerais */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{Title ? Title : 'NVRP + Clubvision | Sua experiencia aqui é totalmente unica!'}</title>
        <meta name="description" content={Description} />
        <meta name="keywords" content="roleplay, fiveM, gtarp, gta v, gta ,servidor, imersão, interação, novision, clubvision" />
        <meta name="author" content="novision" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph Tags (OG) */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={Title} />
        <meta property="og:description" content={Description} />
        <meta property="og:image" content={ImageUrl} />
        <meta property="og:url" content={Url} />
        <meta property="og:site_name" content="novision" />
        <meta property="og:locale" content="pt_BR" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={Title} />
        <meta name="twitter:description" content={Description} />
        <meta name="twitter:image" content={ImageUrl} />
        <meta name="twitter:site" content="@novision" />
        <meta name="twitter:creator" content="@novision_team" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
       
        {/* Links para CSS de Ícones */}
        <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/uicons-brands/css/uicons-brands.css'/>
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/2.4.2/uicons-brands/css/uicons-brands.css" />
        <link 
rel='stylesheet' href='https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css'/>
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/2.4.0/uicons-bold-rounded/css/uicons-bold-rounded.css" />
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/2.6.0/uicons-bold-straight/css/uicons-bold-straight.css" />
        {/* <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/2.6.0/uicons-solid-rounded/css/uicons-solid-rounded.css'/> */}
      </Head>
    </>
  );
}
