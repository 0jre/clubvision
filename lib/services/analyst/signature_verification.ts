import { NextApiRequest, NextApiResponse } from 'next';
import { withSession, NextIronRequest } from '@/lib/session';
import { dbConnect } from '@/core/integration/connect';

function extractSignatureComponents(signatureUserId: string) {
  const regex = /^novision:(\d{3})(\d{3})-([A-Za-z]{3})_([A-Za-z0-9]{4})-([A-Za-z0-9]{5})-([A-Z]{2})$/;
  const match = signatureUserId.match(regex);
  if (!match) return null;

  return {
    first3: match[1],
    last3: match[2],
    iipcLetters: match[3],
    visionHash4: match[4],
    uuidSuffix: match[5],
    locale: match[6],
  };
}

function validateVisionSignature(visionId: string, signature: string, components: any): boolean {
  const { iipcLetters, visionHash4, uuidSuffix, locale } = components;

  const hashMatch = visionId.match(/visionid:([A-Za-z0-9:-]+)/);
  const hash = hashMatch ? hashMatch[1].replace(/[-:]/g, '') : '';

  const sigUuidMatch = signature.match(/V-ID\^gICnb-[^-]+-[^-]+-[^-]+-([A-Za-z0-9]{5}):/);
  const iipcMatch = signature.match(/IIPC[0-9a-zA-Z]{4}[0-9]{2}([A-Za-z]{3})/);
  const localeMatch = signature.match(/0055\^([A-Z]{2})/);

  return (
    hash.includes(visionHash4) &&
    sigUuidMatch?.[1] === uuidSuffix &&
    iipcMatch?.[1] === iipcLetters &&
    localeMatch?.[1] === locale
  );
}

const SignatureIn = async (req: NextIronRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const sessionUser = req.session?.get('user');
  if (!sessionUser) {
    return res.status(401).json({ message: 'Usuário não autenticado' });
  }

  const { signatureUserId } = req.body;
  if (!signatureUserId) {
    return res.status(400).json({ error: 'signatureUserId ausente' });
  }

  const components = extractSignatureComponents(signatureUserId);
  if (!components) {
    return res.status(400).json({ error: 'Formato inválido de signatureUserId' });
  }

  const { db } = await dbConnect();
  const usersCollection = db.collection('users');
  const user = await usersCollection.findOne({ vid: signatureUserId });

  if (!user || !Array.isArray(user.vision)) {
    return res.status(404).json({ error: 'Usuário ou visões não encontrados' });
  }

  const valid = user.vision.some(v => validateVisionSignature(v.visionId, v.signature, components));

  if (!valid) {
    return res.status(403).json({ valid: false, message: 'signatureUserId não corresponde a nenhuma combinação válida.' });
  }

  return res.status(200).json({ valid: true, user: sessionUser });
};

export default withSession(SignatureIn);