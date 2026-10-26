
import * as crypto from 'crypto';
import * as CryptoJS from 'crypto-js';

// Função para gerar chave e IV
const generateAESKeyAndIV = (): { key: CryptoJS.lib.WordArray; iv: CryptoJS.lib.WordArray } => {
  const key = CryptoJS.enc.Hex.parse(crypto.randomBytes(32).toString('hex'));  // AES-256
  const iv = CryptoJS.enc.Hex.parse(crypto.randomBytes(16).toString('hex'));   // IV de 128 bits
  return { key, iv };
};

// Função de criptografia AES com GCM (Autenticação incluída)
const encryptAES = (text: string): string => {
  const { key, iv } = generateAESKeyAndIV();

  // Converte key e iv de CryptoJS para Buffer e depois para Uint8Array
  const keyBuffer = new Uint8Array(Buffer.from(key.toString(CryptoJS.enc.Hex), 'hex'));
  const ivBuffer = new Uint8Array(Buffer.from(iv.toString(CryptoJS.enc.Hex), 'hex'));

  // Criptografar o texto com AES-GCM (autenticação de dados)
  const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, ivBuffer);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Gerar o AuthTag
  const authTag = cipher.getAuthTag();

  // Retornando o texto criptografado junto com o IV, AuthTag e chave (Base64)
  return JSON.stringify({
  novision: encrypted,
  _: key.toString(CryptoJS.enc.Base64),  // Convertendo chave para Base64
  __: iv.toString(CryptoJS.enc.Base64),    // Convertendo IV para Base64
  nvxre: authTag.toString('base64'),    // Tag de autenticação
  });
};

// Função de descriptografia AES com GCM (verificando AuthTag)
const decryptAES = (cipherData: string): string => {
  const { novision, _, __, nvxre } = JSON.parse(cipherData);

  // Convertendo a chave, IV e AuthTag de Base64 para Buffer
  const keyParsed = Buffer.from(_, 'base64');
  const ivParsed = Buffer.from(__, 'base64');
  const authTagParsed = Buffer.from(nvxre, 'base64');
 
 
  if (keyParsed.length !== 32) {
    throw new Error('A chave precisa ter exatamente 32 bytes para AES-256-GCM.');
  }
  // Descriptografar o texto com AES-GCM e verificar o AuthTag
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Uint8Array.from(keyParsed), // Converta o Buffer para Uint8Array
    ivParsed as unknown as Uint8Array,
  );
  
  
    // Converta o authTagParsed para Uint8Array
    decipher.setAuthTag(Uint8Array.from(authTagParsed));  
    // Convertendo o texto cifrado de hexadecimal para Buffer
    const encryptedBuffer = Buffer.from(novision, 'hex');
    // Decifrando diretamente com o Buffer
    let decrypted = decipher.update(encryptedBuffer as unknown as Uint8Array, undefined, 'utf8');
    // Finalizando a decifração
    decrypted += decipher.final('utf8');
  return decrypted;  // Retorna o texto original
};

// Função de criptografia principal
export const encrypt = (text: string): string => {
  return encryptAES(text);  // A criptografia continua sendo AES com GCM
};

// Função de descriptografia principal
export const decrypt = (cipherData: string): string => {
  return decryptAES(cipherData);  // Descriptografando com AES-GCM
};


export class AdvancedEncryptionManager {
  private static instance: AdvancedEncryptionManager
  private masterKey: Buffer
  private keyDerivationSalt: Buffer
  private encryptionKeys: Map<string, Buffer>
  private keyRotationInterval: number
  private lastKeyRotation: number

  private constructor() {
    this.masterKey = this.generateMasterKey()
    this.keyDerivationSalt = crypto.randomBytes(32)
    this.encryptionKeys = new Map()
    this.keyRotationInterval = 24 * 60 * 60 * 1000 // 24 hours
    this.lastKeyRotation = Date.now()

    this.initializeKeys()
    this.startKeyRotation()
  }

  static getInstance(): AdvancedEncryptionManager {
    if (!AdvancedEncryptionManager.instance) {
      AdvancedEncryptionManager.instance = new AdvancedEncryptionManager()
    }
    return AdvancedEncryptionManager.instance
  }

  private generateMasterKey(): Buffer {
    // In production, this should come from a secure key management service
    const keyMaterial = process.env.MASTER_KEY || crypto.randomBytes(32).toString("hex")
    return crypto.scryptSync(keyMaterial, "vortexor-salt", 32)
  }

  private initializeKeys(): void {
    // Generate initial encryption keys
    this.encryptionKeys.set("data", this.deriveKey("data-encryption"))
    this.encryptionKeys.set("session", this.deriveKey("session-encryption"))
    this.encryptionKeys.set("cache", this.deriveKey("cache-encryption"))
    this.encryptionKeys.set("logs", this.deriveKey("logs-encryption"))
  }

  private deriveKey(purpose: string): Buffer {
    return crypto.scryptSync(this.masterKey.toString("hex"), `${this.keyDerivationSalt.toString("hex")}-${purpose}`, 32)
  }

  private startKeyRotation(): void {
    setInterval(() => {
      this.rotateKeys()
    }, this.keyRotationInterval)
  }

  private rotateKeys(): void {
    // Generate new salt
    this.keyDerivationSalt = crypto.randomBytes(32)

    // Regenerate all keys
    this.initializeKeys()

    this.lastKeyRotation = Date.now()
  }

  encrypt(
    data: string | Buffer,
    purpose = "data",
  ): {
    encrypted: string
    iv: string
    tag: string
    keyVersion: number
  } {
    const key = this.encryptionKeys.get(purpose)
    if (!key) {
      throw new Error(`No encryption key found for purpose: ${purpose}`)
    }

    const iv = crypto.randomBytes(16)
    // Convert key and iv to Uint8Array for compatibility
    const keyUint8 = new Uint8Array(key.buffer, key.byteOffset, key.byteLength)
    const ivUint8 = new Uint8Array(iv.buffer, iv.byteOffset, iv.byteLength)
    const cipher = crypto.createCipheriv("aes-256-gcm", keyUint8, ivUint8)

    // Ensure data is a string
    const dataStr = typeof data === "string" ? data : data.toString()
    let encrypted = cipher.update(dataStr, "utf8", "hex")
    encrypted += cipher.final("hex")

    const tag = cipher.getAuthTag()

    return {
      encrypted,
      iv: iv.toString("hex"),
      tag: tag.toString("hex"),
      keyVersion: this.getKeyVersion(),
    }
  }

  decrypt(
    encryptedData: {
      encrypted: string
      iv: string
      tag: string
      keyVersion?: number
    },
    purpose = "data",
  ): string {
    const key = this.encryptionKeys.get(purpose)
    if (!key) {
      throw new Error(`No encryption key found for purpose: ${purpose}`)
    }

    const iv = Buffer.from(encryptedData.iv, "hex")
    const tag = Buffer.from(encryptedData.tag, "hex")

    const decipher = crypto.createDecipheriv("aes-256-gcm", Uint8Array.from(key), Uint8Array.from(iv))
    decipher.setAuthTag(Uint8Array.from(tag))

    let decrypted = decipher.update(encryptedData.encrypted, "hex", "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
  }

  hashPassword(password: string, saltRounds = 12): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.scrypt(password, crypto.randomBytes(16).toString("hex"), 64, (err, derivedKey) => {
        if (err) reject(err)
        resolve(derivedKey.toString("hex"))
      })
    })
  }

  verifyPassword(password: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const [salt, key] = hash.split(":")
      crypto.scrypt(password, new Uint8Array(Buffer.from(salt, "hex")), 64, (err, derivedKey) => {
        if (err) reject(err)
        resolve(derivedKey.toString("hex") === key)
      })
    })
  }

  generateSecureToken(length = 32): string {
    return crypto.randomBytes(length).toString("hex")
  }

  generateHMAC(data: string, secret?: string): string {
    const key = secret || this.masterKey.toString("hex")
    return crypto.createHmac("sha256", key).update(data).digest("hex")
  }

  verifyHMAC(data: string, signature: string, secret?: string): boolean {
    const expectedSignature = this.generateHMAC(data, secret)
    return crypto.timingSafeEqual(
      new Uint8Array(Buffer.from(signature, "hex")),
      new Uint8Array(Buffer.from(expectedSignature, "hex"))
    )
  }

  private getKeyVersion(): number {
    return Math.floor(this.lastKeyRotation / this.keyRotationInterval)
  }

  // Advanced cryptographic functions
  generateKeyPair(): { publicKey: string; privateKey: string } {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    })

    return { publicKey, privateKey }
  }

  signData(data: string, privateKey: string): string {
    const sign = crypto.createSign("SHA256")
    sign.update(data)
    sign.end()
    return sign.sign(privateKey, "hex")
  }

  verifySignature(data: string, signature: string, publicKey: string): boolean {
    const verify = crypto.createVerify("SHA256")
    verify.update(data)
    verify.end()
    return verify.verify(publicKey, signature, "hex")
  }

  encryptWithPublicKey(data: string, publicKey: string): string {
    return crypto.publicEncrypt(publicKey, Buffer.from(data) as any).toString("base64")
  }

  decryptWithPrivateKey(encryptedData: string, privateKey: string): string {
    return crypto.privateDecrypt(privateKey, new Uint8Array(Buffer.from(encryptedData, "base64"))).toString()
  }
}
