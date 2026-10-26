import fetch from 'node-fetch';
import { dbConnect, InformationsUsers, reformsCollectionName } from '@/core/integration/connect';
import { Session } from 'next-iron-session';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { withSession, NextIronRequest, NextIronHandler } from '@/lib/session';

// Role Mapping para os dois servidores
const roleMapping: Record<string, { [serverId: string]: string }> = {

  // Cargos do Servidor 1 
  "contributor": { "1234364587424485467": "1234366156110954528" },
  "developer3d": { "1234364587424485467": "1234366295772893204" },
  "havocac": { "1234364587424485467": "1234681039608348786" },
  "leader": { "1234364587424485467": "1234365851998617640" },
  "modder3d": { "1234364587424485467": "1234680738163720283" },
  "qa": { "1234364587424485467": "1234678643368792198" },
  "vehicledev": { "1234364587424485467": "1234366939829375056" },
  "developer": {"1234364587424485467": "1234366078201761812"},
  
  // Cargos do Servidor 2 
  "nvxre": { "1175857498687807560": "1276038716263239743"},
  "manager": {"1175857498687807560": "1299619919641575494"},
  "bod": { "1234364587424485467": '1280176620845400105' },
  "ceo": { "1234364587424485467": '1276032557313429578'},
  "coo": { "1234364587424485467": '1280590715495387180'},
  "cto": { "1234364587424485467": '1247408041251569716'},
  "cmo": { "1234364587424485467": '1280175984015970466'},
  "cdo": { "1234364587424485467": '1280176023476113431' },
  
 
};

const DISCORD_TOKEN = process.env.BOT_TOKEN;

// Função para adicionar cargo em um usuário em um servidor específico
async function addRoleToUser(userId: string, role: string, guildId: string) {
  if (!DISCORD_TOKEN) throw new Error('Discord bot token is not defined');
  const roleId = roleMapping[role][guildId];
  if (!roleId) throw new Error(`Role not found in mapping for guild ${guildId}`);

  const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${userId}/roles/${roleId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bot ${DISCORD_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to add role in guild ${guildId}: ${error}`);
  }
}

 
export type NextIronRequestWithSession = NextApiRequest & { session?: Session };

const checkAuth: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {

    const sessionUser = req.session?.get('user');
    // Verifique se o usuário está autenticado
    if (!req.session || !req.session.get('user')) {
      return res.status(401).json({ isAuthenticated: false, message: 'Usuário não autenticado.' });
    }
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
   


  const { userId } = req.body;
  
  const requestId  = (
     sessionUser.id == userId && userId 
  )

  if (!requestId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const { db } = await dbConnect();

    // Buscar dados do usuário
    const user = await db.collection(InformationsUsers).findOne({ id: requestId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

   // Buscar dados do usuário na coleção de reformas
   const reform = await db.collection(reformsCollectionName).findOne({ userId: requestId });

   // Verificar se o usuário tem 'nvxre' com valor true
   if (reform && reform.nvxre === true) {
     // Adicionar cargo 'nvxre' no Servidor 2
     await addRoleToUser(user.discord_id, 'nvxre',  '1175857498687807560');
   }

// Verificar se o usuário tem 'nvxre' com valor true
if (user && user.manager === true) {
  // Adicionar cargo 'nvxre' no Servidor 2
  await addRoleToUser(user.discord_id,  'manager', '1175857498687807560');
}

    // Determinar cargos a serem atribuídos no Servidor 1
    const rolesToAssignServer1 = Object.keys(user)
      .filter(key => user[key] === true && roleMapping[key] && roleMapping[key]['1234364587424485467']);
    
    // Determinar cargos a serem atribuídos no Servidor 2
    const rolesToAssignServer2 = Object.keys(user)
      .filter(key => user[key] === true && roleMapping[key] && roleMapping[key]['1175857498687807560']);

    // Adicionar cargos no Servidor 1
    for (const role of rolesToAssignServer1) {
      await addRoleToUser(user.discord_id, role, '1234364587424485467');
    }

    // Adicionar cargos no Servidor 2
    for (const role of rolesToAssignServer2) {
      await addRoleToUser(user.discord_id, role, '1175857498687807560');
    }

    return res.status(200).json({ message: 'Permissões sincronizadas com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro do Servidor Interno' });
  }
}


const SyncPermission: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  // Use o await para chamar a função original checkAuth
  await checkAuth(req, res);
};

export default withSession(SyncPermission);