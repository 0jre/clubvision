import { NextIronRequest, withSession } from "@/lib/session";
import { NextApiResponse } from 'next';
 

const OAuthScope = ["identify", "guilds", "email"].join(" ");
const OAuthData = new URLSearchParams({
  response_type: "code",
  client_id: process.env.CLIENT_ID as string,
  redirect_uri: `${process.env.DOMAIN}/api/club/connect/callback`,
  scope: OAuthScope,
});

const handler = async (req: NextIronRequest, res: NextApiResponse) => {
  try {
    const user = req.session.get("user");

     
    // Redirecionar para o Discord para autorização
    const htmlResponse = `
    <html>

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <link rel="icon" type="image/png"
            href="/favicon.ico">
        <title>Oauth Discord - for clubvision</title>
        <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/2.1.0/uicons-solid-rounded/css/uicons-solid-rounded.css'>
        <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/2.1.0/uicons-bold-rounded/css/uicons-bold-rounded.css'>
        <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;500&family=Rubik:ital,wght@0,300;0,400;1,300;1,400"
            rel="stylesheet">
            <style>
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
    
            @keyframes bganim {
                0% {
                    background-position: 0px 0px;
                }
                50% {
                    background-position: 500px -500px;
                }
                100% {
                    background-position: 1000px -1000px;
                }
            }
    
            html {
                --color-bg: hsl(226, 23%, 11%);
                --color-bg-a25: hsla(222, 23%, 11%, .25);
                --color-bg-a50: hsla(222, 23%, 11%, .5);
                --color-bg-a80: hsla(222, 23%, 11%, .8);
                --color-text: hsl(60, 100%, 97%);
                --color-text-a10: hsla(60, 93%, 94%, .1);
                --color-text-a20: hsla(60, 93%, 94%, .2);
                --color-text-a50: hsla(60, 93%, 94%, .5);
                --color-text-a75: hsla(60, 93%, 94%, .75);
                --color-shadow: rgba(54, 20, 0, 0.2);
                --color-accent-1: rgba(17,19,28,1);
                --color-accent-1-a75: rgba(17,19,28,1);
                --color-accent-1-a50: rgba(17,19,28,1);
                --color-accent-1-a10: rgba(17,19,28,1);
                --color-accent-1-s90: #e7064f;
                --color-accent-2: #007892;
                --color-accent-2-a10: rgba(0, 120, 146, .1);
    
                --f1: 'Rubik';
                --f2: 'Montserrat';
    
                --fs08: 0.8rem;
                --fs1: 1rem;
                --fs2: 1.2rem;
                --fs3: 1.5rem;
                --fs4: 1.75rem;
                --fs5: 2rem;
    
                --q: 1rem;
                --qh: .5rem;
                --q2: calc(var(--q) * 2);
   
                background-position-y: 100%;
              
  height: 100%;
  width: 100%;
  background-size: cover;
  background-repeat: no-repeat;
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    justify-content: center;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
            }
    
            body {
                display: grid;
                place-items: center;
    
                width: 100%;
                height: 100%;
             
                
                font-family: 'Rubik', sans-serif;
                font-weight: 300;
                color: white;
                font-size: 16px; 
                overflow-y: hidden;
               
            
                
                ::-webkit-scrollbar {
                  display: none;
                  
                  }
                
                 ::selection{
                  display: none;
                 }
            }
    
            .login-card {
                flex-grow: 0;
                /* flex-shrink: 0; */
    
                display: flex;
                flex-direction: column;
                align-items: stretch;
                justify-content: stretch;
                 border-radius: 24px;
                max-width: 400px;
                padding: var(--q) var(--q2);
               

            }
    
            .login-card .logo {
                width: calc(var(--q) * 6);
    
                margin: var(--q) auto 0 auto;
    
                fill: var(--color-text);
            }
    
            .login-card h1 {
                font-family: var(--f2);
                font-weight: 300;
                text-align: center;
                font-size: 2rem;
    
                margin-top: var(--qh);
                margin-bottom: var(--q);
            }
    
            .login-submit {
               
        
                padding: 0.6em 1em 0.6em;
                border-radius: 12px;
                border: 2px solid transparent;
                color: white;
                background: rgba(225,228,235,0.14609593837535018);
                
                font-family: var(--f1);
                font-size: var(--fs1);
                font-weight: 300;
                text-transform: uppercase;
                line-height: 1;
                letter-spacing: 1px;
    
                outline: none;
    
                transition: all .2s ease;
            }
            .login-submit:hover {
                background-color: rgba(225,228,235,0.05646008403361347);
                transition: none;
                border: 2px solid rgba(17,19,28,1);
            }
    
            .login-card a {
                text-decoration: none;
                font-weight: 400;
                text-align: center;
                display: inline-block;
                color: white;
            }
    
            .login-card a.logout {
                color: white;
                text-decoration: underline;
            }
    
           
            ul {
                margin-top: var(--q);
                list-style: none;
            }
            ul li + ul {
                margin-top: calc(var(--qh) / 2);
            }

            strong{
              color: white;
              font-weight: 500;
            }
            ul li {
                display: flex;
                align-items: flex-start;
                justify-content: flex-start;
    
                letter-spacing: .5px;
                margin-bottom: 4em;
                margin-top: var(--qh);
            }
            ul li.as {
                display: block;
            }
            ul ul li::before {
                content: '•';
                display: block;
    
                margin-left: calc(-1 * var(--q));
                margin-right: var(--qh);
            }

            span{
              padding: 0.5em;
            }

            h5{
              margin-bottom: 0.6em;
              font-weight: 500;
              font-size: 17px;
            }

            i{
             display: flex;
              align-items: center;
              margin-left: -0.2em;
              color: rgba(94,99,96,0.7903536414565826);
            }

            section{
              display: inline-flex;
            }

            h6{
              margin: 0.3em;
              margin-left: 0.6em;
              color: rgba(154,164,157,0.7903536414565826);
              font-size: 0.8rem;
              font-weight: 500;
            }
            ul li:first-child {
                margin-top: 0;
            }
            ul ul {
                margin-left: var(--q);
            }

            p{
              margin-top: 0.3em;
              color: rgba(125,133,128,0.7903536414565826);
              font-size: 11px;
              max-width: 100%;
            }
    
            button {
                cursor: pointer;
            }
            
            
            .cardprofile{
               display: flex;
               flex-direction: center;
               justify-content: center;
                align-items: center;
            }

            .cardprofile span{
              display: flex;
              flex-direction: column;
              margin: 0.5em;
            }

            .marginbottom{
              margin-top: 3%;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
            }
            
            .aboutrequest{
              background-color: rgba(79,86,101,0.05646008403361347);
              padding: 0.2em 1em 0.2em;
              border-radius: 10px;
              margin-top: 1em;
              margin-top: 5%;
            }

             .return{
              color: white;
              font-family: var(--f1);
              font-size: 12px;
              line-height: 1;
              letter-spacing: 1px;
              outline: none;
              transition: all .2s ease;
              background: transparent;
              border: none;
            }
            .material-icons-outlined {
                font-size: var(--fs08);
            }
        .login-help{
          text-align: center;
        }

        .margin{
          heigth: 100%;
          overflow-y: auto;
        
        }
        </style>
    </head>
    
    <body>
    <div class="margin">
        <div class="login-card">
            <img class="logo" src="/nvrp/20221001_185012.png" alt="Discord Logo" style="  width: 110px; height:45px;">
          
            <div class="login-client-image">
                    ${
                      user && !user.accessToken
                        ? `
                        <h1>
                        Authorized
                    </h1>

                    <div class="cardprofile">
                    <img src="${user.avatar}" alt="User Avatar" style="border-radius: 13%; width: 80px; height: 80px;">
                    <span>
                    <i class="fi fi-br-arrow-left"></i>
                    <i class="fi fi-br-arrow-right"></i>
                    </span>
                    <img src="/nvrp/20221102_165951.jpg" alt="User Avatar" style="border-radius: 13%; width: 80px; height: 80px;">
                    
                  </div>
                        <ul>
                </ul>
                <li class="as">Logado como&nbsp;<strong>${user.username}</strong></li>

                <p>
                Antes de prosseguir, é importante que você esteja ciente e concorde com nossos Termos de Serviço e Regras da Comunidade. Ao acessar e utilizar nossos serviços, você está comprometido em seguir as diretrizes estabelecidas para manter um ambiente seguro e respeitoso para todos os usuários.
                </p>

                <p>
                Agradecemos por fazer parte da nossa comunidade e por contribuir para um ambiente positivo e colaborativo. Se tiver alguma dúvida ou preocupação, não hesite em entrar em contato com nossa equipe.
                </p>

                </ul>
                </ul>
                <div id="countdown" style="display:none;"></div>

               <script>
                // Envia a mensagem ao parent após a autenticação
                window.parent.postMessage('userLoggedIn', window.location.origin);
              </script>
      
                        ` // Se o usuário estiver logado, não exiba o botão de login
                        : `
                        <h1>
                        Authorize Discord
                    </h1>

                    <div class="cardprofile">
                    <img src="/nvrp/20221102_165951.jpg" alt="User Avatar" style="border-radius: 13%; width: 80px; height: 80px;">
                    <span>
                    <i class="fi fi-br-arrow-left"></i>
                    <i class="fi fi-br-arrow-right"></i>
                    </span>
                    <img src="https://i.imgur.com/nL6q2TQ.png" alt="User Avatar" style="border-radius: 13%; width: 80px; height: 80px;">
                    
                  </div>
                  <div class="aboutrequest">
                        <span>
                        <h5>Clubvision quer acessar:</h5>
                        <section>
                        <i class="fi fi-sr-envelope"></i>
                        <h6> O acesso ao e-mail do usuário permite ao Discord garantir a autenticidade da conta e facilitar a comunicação e notificações importantes.</h6>
                        </section>
         
                        <section>
                        <i class="fi fi-br-at"></i>
                        <h6>  Ao conceder acesso ao username, avatar, faixa (banner) e informações do servidor, você permite uma experiência personalizada na plataforma.</h6>
                        </section>

                        <section>
                        <i class="fi fi-sr-eye"></i>
                        <h6> Esta permissão permite ao Discord identificar se o usuario esta presente na comunidade..</h6>
                        </section>
                       
                    <p>
                    Ao prosseguir com o login, você confirma que leu, compreendeu e concorda com nossos Termos de Serviço e Regras da Comunidade.
                    </p>
                    </div>
                    <div class="marginbottom">
                    <div class="login-help">
                    <a><div id="countdos" style="font-size: 2rem; margin-bottom: 1rem; display:none;"></div>
                    </a>
    
                </div>
                  </div>


                  <script>
  window.onload = function () {
    const oauthUrl = "https://discord.com/oauth2/authorize?${OAuthData}";
    const newTab = window.open(oauthUrl, '_blank');

    if (!newTab) {
      console.error("Não foi possível abrir a nova aba. Pop-ups estão provavelmente bloqueados.");
    } else {
      console.log("Nova aba de autenticação aberta.");
    }
  };
</script>

                        `
                    }
                    ${/* Adicione a componente NotificationUI para exibir qualquer mensagem */ ''}
                    <NotificationUI message="${req.query.message || ''}" /> 
                        
        
                    </div>
        </div>
      
          </div>


        </body>
      </html>
    `;

    res.send(htmlResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};

export default withSession(handler);