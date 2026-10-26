import { NextIronRequest, withSession } from "@/lib/session";
import {  NextApiResponse } from 'next';
import { serialize } from 'cookie';

const handler = async (req: NextIronRequest, res: NextApiResponse) => {
  try {
    const user = req.session.get('user');

    if (!user || !user.id) {
      res.redirect('/club/account');
      return;
    }
  
    // Configurar o cookie usando a biblioteca 'cookie'
    const userIdCookie = serialize('userId', user.id, {
      httpOnly: true,
      maxAge: 604800000, // Expira em 7 dias (em milissegundos)
    });
  
    res.setHeader('Set-Cookie', userIdCookie); // Configure o cabeçalho 'Set-Cookie'

    const htmlResponse = `
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <link rel="icon" type="image/png"
            href="/favicon.ico">
        <title>Connect Steam</title>
        <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/2.1.0/uicons-solid-rounded/css/uicons-solid-rounded.css'>
        <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/2.1.0/uicons-bold-rounded/css/uicons-bold-rounded.css'>
        <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/2.1.0/uicons-regular-rounded/css/uicons-regular-rounded.css'>
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

          background: linear-gradient(204deg,  rgb(12, 12, 12) -7%, #b85cff00 33%), linear-gradient(162deg, rgb(12, 12, 12) -10%, #2c88dd00 25%), linear-gradient(0deg, rgb(5, 5, 5), rgb(5, 5, 5));
 
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
             border-radius: 14px;
            max-width: 400px;
            padding: var(--q) var(--q2);
             background: linear-gradient(204deg,  rgb(12, 12, 12) -7%, #b85cff00 33%), linear-gradient(162deg, #2fce84 -10%, #2c88dd00 25%), linear-gradient(0deg, rgb(5, 5, 5), rgb(12, 12, 12));
     border: 1px solid #454745;

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
      z-index: 9999;
    
    }
        </style>
    </head>
    
    <body>
       <svg width="100%" fill="none" style="bottom: 0px; left: 0px; position: absolute;" viewBox="0 0 1440 679"  ><g filter="url(#filter0_f_1453_15057)" opacity=".4"><g filter="url(#filter1_f_1453_15057)" opacity=".5"><ellipse cx="1293" cy="1091.5" fill="url(#filter2_f_1453_15057)" rx="862" ry="702.5"></ellipse></g><g filter="url(#filter4_f_1453_15057)"><path fill="#EE00FD" fill-opacity="0.2" d="M714.591 846.703C77.001 813.057-119.365 212.257-341.108 229.358c-278.746 21.497-226.809 585.037 0 799.752 267.345 253.1 1487.788-159.606 1055.699-182.407Z"></path></g></g><defs><filter id="filter0_f_1453_15057" width="3086.19" height="1965" x="-731.188" y="29" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur result="effect1_foregroundBlur_3109_16915" stdDeviation="100"></feGaussianBlur></filter><filter id="filter1_f_1453_15057" width="2408.04" height="2089.04" x="88.98" y="46.981" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur result="effect1_foregroundBlur_3109_16915" stdDeviation="171.01"></feGaussianBlur></filter><filter id="filter3_f_1453_15057" width="1793.51" height="1337.97" x="-759.201" y=".987" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur result="effect1_foregroundBlur_3109_16915" stdDeviation="114.006"></feGaussianBlur></filter><linearGradient id="filter2_f_1453_15057" x1="144.821" x2="2327.72" y1="192.427" y2="1121.18" gradientUnits="userSpaceOnUse"><stop offset="23%" stop-color="#2fc45b"></stop><stop offset="27%" stop-color="#2fc45b"></stop><stop offset="34%" stop-color="#2fc45b"></stop><stop offset="41%" stop-color="#2fc45b"></stop><stop offset="51%" stop-color="#2fc45b"></stop><stop offset="61%" stop-color="#3aa34b"></stop><stop offset="66%" stop-color="#00ff6a"></stop><stop offset="70%" stop-color="#0cffa2"></stop><stop offset="82%" stop-color="#298b5a"></stop><stop offset="92%" stop-color="#3effa5"></stop><stop offset="98%" stop-color="#239154"></stop></linearGradient></defs></svg>
    <div class="margin">
        <div class="login-card">
        <img class="logo" src="/nvrp/20221001_185012.png" alt="Discord Logo" style="width: 110px; height: 35px;">
            <div class="login-client-image">
                    ${
                      user && !user.accessToken
                        && `
                        <h1>
                        Authorize Steam
                    </h1>
                     
                     <div class="cardprofile">
                       <img src="${user.avatar}" alt="User Avatar" style="border-radius: 13%; width: 80px; height: 80px;">
                       <span>
                       <i class="fi fi-br-arrow-left"></i>
                       <i class="fi fi-br-arrow-right"></i>
                       </span>
                       <img src="https://i.imgur.com/8alVoqT.jpeg" alt="User Avatar" style="border-radius: 13%; width: 80px; height: 80px;">
                       
                     </div>
                    
                     <div class="aboutrequest">
                     
                        <span>
                        <h5>Clubvision quer acessar:</h5>
                        <section>
                        <i class="fi fi-sr-passport"></i>
                        <h6>Identificador único atribuído à sua conta steam</h6>
                        </section>

                        <section>
                        <i class="fi fi-sr-id-card-clip-alt"></i>
                        <h6>O nome que você usa publicamente na plataforma steam</h6>
                        </section>
                     
                          <p>
                        Ao prosseguir com o login, você confirma que leu, compreendeu e concorda com nossos Termos de Serviço e Regras da Comunidade.
                        </p>
                        </div>
                        <div class="marginbottom">
                        <button class="return" id="authorizeButtonreturn">Cancelar</button>
                        <button 
                        class="login login-submit" 
                        id="authorizeButton"><i class="fi fi-br-arrow-right"> </i></button>
                      </div>
 
                        `    
                    }
                    ${/* Adicione a componente NotificationUI para exibir qualquer mensagem */ ''}
                    <NotificationUI message="${req.query.message || ''}" /> 
                        
                    <script>
                    document.getElementById('authorizeButton').addEventListener('click', function() {
                      const authUrl = '${process.env.DOMAIN}/api/auth/steam/connect';
                      window.location.href = authUrl;
                    });

                    document.getElementById('authorizeButtonreturn').addEventListener('click', function() {
                      javascript:history.back()
                    });
                  </script>
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


