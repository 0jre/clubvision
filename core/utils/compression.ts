import { gzip as nodeGzip, gunzip as nodeGunzip } from "zlib"
import { promisify } from "util"

const gzipAsync = promisify(nodeGzip)
const gunzipAsync = promisify(nodeGunzip)

export class CompressionManager {
  private static instance: CompressionManager
  private compressionThreshold: number

  private constructor(threshold = 2000) { 
    //// Default threshold set to 2000 bytes OR 1024 Bytes
    this.compressionThreshold = threshold
  }

  static getInstance(threshold?: number): CompressionManager {
    if (!CompressionManager.instance) {
      CompressionManager.instance = new CompressionManager(threshold)
    }
    return CompressionManager.instance
  }

  async compress(
    data: any,
  ): Promise<{ data: Buffer | string; compressed: boolean; originalSize: number; compressedSize: number }> {
    const serialized = JSON.stringify(data)
    const originalSize = Buffer.byteLength(serialized, "utf8")

    if (originalSize < this.compressionThreshold) {
      return {
        data: serialized,
        compressed: false,
        originalSize,
        compressedSize: originalSize,
      }
    }

    try {
      const compressed = await gzipAsync(serialized)
      const compressedSize = compressed.length

      return {
        data: compressed,
        compressed: true,
        originalSize,
        compressedSize,
      }
    } catch (error) {
      console.error("Compression failed:", error)
      return {
        data: serialized,
        compressed: false,
        originalSize,
        compressedSize: originalSize,
      }
    }
  }

  async decompress(data: Buffer | string, isCompressed: boolean): Promise<any> {
    if (!isCompressed) {
      return JSON.parse(data as string)
    }
    try {
      const bufferData = Buffer.isBuffer(data) ? data : Buffer.from(data as string)
      const decompressed = await gunzipAsync(bufferData as any)
      return JSON.parse(decompressed.toString())
    } catch (error: any) {
      console.error("Decompression failed:", error)
      throw new Error("Failed to decompress cache data")
    }
  }
}