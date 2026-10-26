
import { dbConnect } from "@/core/integration/connect";
import PostVisionModel, { PostVisionDocument } from '@/types/vop/PostVision';

// Conecta ao banco de dados
dbConnect();

// Função para criar uma nova postagem de visão
export async function createPostVision(postVisionData: PostVisionDocument): Promise<PostVisionDocument> {
  try {
    // Crie uma nova instância do modelo com os dados fornecidos
    const newPostVision = new PostVisionModel(postVisionData);

    // Salve a instância no MongoDB
    const savedPostVision = await newPostVision.save();

    return savedPostVision;
  } catch (error) {
    throw error;
  }
}