import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/core/integration/connect";
import ROUTENVX from "@/routes/routes";

const reformsCollectionName = 'steam';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query.userId as string;
  const displayName = req.query.displayName as string;
  const id = req.query.id as string;
  const provider = req.query.provider as string;
  const hexid = req.query.hexid as string;

  const { db } = await dbConnect();

  try {
    // Verificar se existe registro com o ID da Steam
    const existingSteamUser = await db.collection(reformsCollectionName).findOne({ id: id });
    const existingSteam = await db.collection('users').findOne({ steamId: id });
    const exists = await db.collection(reformsCollectionName).countDocuments({ userId: userId });
    
    
    if (existingSteamUser || existingSteam) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel='Stylesheet' href='/Css.Global.css' />
          <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/uicons-brands/css/uicons-brands.css'/>
          <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/2.4.2/uicons-brands/css/uicons-brands.css" />
          <link 
  rel='stylesheet' href='https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css'/>
          <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/2.4.0/uicons-bold-rounded/css/uicons-bold-rounded.css" />
          <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/2.6.0/uicons-bold-straight/css/uicons-bold-straight.css" />
          <title>Vincular  Twitch</title>
          <style>
          body{
          margin: 0 auto;
          }
            /* Estilo global para a tela */
  .error-screen {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; 
   
    padding: 20px;
  }
  
  .error-content {
    text-align: center;
    color: white; 
    padding: 30px;
    width: 100%;
  }
  
  .trash-icon {
    margin-bottom: 20px;
  }
  
  .trash-icon svg {
    fill: #F14343; /* Cor vermelha do ícone de lixo */
  }
  
  .error-message p {
    font-size: 1.1rem;
    font-weight: 500;
    color: #ccc;
    margin-top: 20px;
    text-align: center;
    line-height: 1.5;
    font-family: 'InterSemiBold', monospace;
    max-width: 90%;
    margin-left: auto;
    margin-right: auto;
  }
  
  /* Animação de fade-in para o conteúdo */
  .error-content {
    animation: fadeIn 0.6s ease-in-out;
  }
  
  /* Animação de fade-in */
  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Responsividade para telas menores */
  @media (max-width: 768px) {
    .error-content {
      padding: 20px;
      max-width: 90%;
    }
  
    .error-message p {
      font-size: 1rem; /* Ajuste do tamanho do texto em telas pequenas */
    }
  
    .trash-icon svg {
      width: 48px;
      height: 48px; /* Ajuste no tamanho do ícone em telas pequenas */
    }
  }
  
      .nav{
       position: fixed;
       width: 100%;
       padding: 0.6em 1em 0.6em;
       top: 1px;
     
      }
          </style>
        </head>
        <body>
          <svg width="100%" fill="none" style="bottom: 0px; left: 0px; position: absolute;" viewBox="0 0 1440 679"  ><g filter="url(#filter0_f_1453_15057)" opacity=".4"><g filter="url(#filter1_f_1453_15057)" opacity=".5"><ellipse cx="1293" cy="1091.5" fill="url(#filter2_f_1453_15057)" rx="862" ry="702.5"></ellipse></g><g filter="url(#filter4_f_1453_15057)"><path fill="#EE00FD" fill-opacity="0.2" d="M714.591 846.703C77.001 813.057-119.365 212.257-341.108 229.358c-278.746 21.497-226.809 585.037 0 799.752 267.345 253.1 1487.788-159.606 1055.699-182.407Z"></path></g></g><defs><filter id="filter0_f_1453_15057" width="3086.19" height="1965" x="-731.188" y="29" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur result="effect1_foregroundBlur_3109_16915" stdDeviation="100"></feGaussianBlur></filter><filter id="filter1_f_1453_15057" width="2408.04" height="2089.04" x="88.98" y="46.981" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur result="effect1_foregroundBlur_3109_16915" stdDeviation="171.01"></feGaussianBlur></filter><filter id="filter3_f_1453_15057" width="1793.51" height="1337.97" x="-759.201" y=".987" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur result="effect1_foregroundBlur_3109_16915" stdDeviation="114.006"></feGaussianBlur></filter><linearGradient id="filter2_f_1453_15057" x1="144.821" x2="2327.72" y1="192.427" y2="1121.18" gradientUnits="userSpaceOnUse"><stop offset="23%" stop-color="red"></stop><stop offset="27%" stop-color="red"></stop><stop offset="34%" stop-color="red"></stop><stop offset="41%" stop-color="red"></stop><stop offset="51%" stop-color="red"></stop><stop offset="61%" stop-color="#3aa34b"></stop><stop offset="66%" stop-color="red"></stop><stop offset="70%" stop-color="red"></stop><stop offset="82%" stop-color="red"></stop><stop offset="92%" stop-color="red"></stop><stop offset="98%" stop-color="red"></stop></linearGradient></defs></svg>
       <nav class="nav">
          <img src="/nvrp/20240520_081457.png" alt="novision" height="30px"/>
        </nav>
            
          <div class="error-screen">
    
    <div class="error-content">
      <div class="trash-icon">
        <!-- Ícone de Lixo (Trash) -->
    <img src="/nvrp/20240721_145926.webp"  alt='face' heigth="180px" width="180px" />
      </div>
      <div class="error-message">
        <p>Essa conta steam já esta vinculada no clubvision.</p>
      </div>
    </div>
  </div>
        </body>
        </html>
      `);
    }
    
    if (exists) {
      // Atualizar informações do usuário no MongoDB
      await db.collection(reformsCollectionName).updateOne(
        { userId: userId },
        {
          $set: {
            userId: userId,
            displayName: displayName,
            id: id,
            provider: provider,
          },
        },
        { upsert: true } // Upsert para inserir se não existir
      );
    } else {
      // Inserir informações do usuário no MongoDB
      await db.collection(reformsCollectionName).insertOne({
        userId: userId,
        displayName: displayName,
        id: id,
        provider: provider,
        hexid: hexid,
      });
    }

    // Redirecionar para a rota de login após sucesso
    res.redirect(ROUTENVX.login);
  } catch (error) {
    console.error("Erro ao salvar os dados do usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
}

 