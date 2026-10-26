import Head from "next/head";

interface Pro {
    Porcentagem: React.ReactNode;
}
export default function HedS ({Porcentagem} : Pro) {
    return(
        <>
        <Head>
        <meta charSet="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{Porcentagem}% | Aguarde... </title>
<meta name="description" content="The NoVision, servidor fiveM roleplay, é um projeto inovador desenvolvido e gerenciado com dedicação e paixão pela equipe da novision. Com um nome que reflete sua abordagem única, o servidor oferece aos jogadores uma experiência de roleplay imersiva e envolvente, onde a criatividade e a interação são valorizadas." />

        </Head>
        </>
    )
}