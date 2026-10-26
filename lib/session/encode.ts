import Hashids from "hashids"

const hashids = new Hashids(process.env.HASHIDS_SALT || "visionelevada", 8) 
export function encodeUserId(id: string | number) {
  return hashids.encodeHex(id.toString()) 
}

export function decodeUserId(hash: string) {
  return hashids.decodeHex(hash)
}
