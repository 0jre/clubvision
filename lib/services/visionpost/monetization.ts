export async function updateMonetization(post: any, userId: string, db: any) {
    const monetizationsCollection = db.collection('monetizations');
    const usersCollection = db.collection('reforms');

    if (post.userId !== userId) {
        const user = await usersCollection.findOne({ userId: post.userId });
        const isPrime = user?.prime || false;

        const comments = Array.isArray(post.comments) ? post.comments.length : 0;
        const likes = Array.isArray(post.likedBy) ? post.likedBy.length : 0;
        const views = Number(post.views) || 0;

        const primeBonus = isPrime ? 1.5 : 1;
        const postTypeWeight = post.type === 'video' ? 1.2 : 1;

        const totalRescue = (comments * 40) + (likes * 20) + (views * 80);

        const postAgeInDays = Math.floor((Date.now() - new Date(post.createdAt).getTime()) / (1000 * 3600 * 24));
        const peakEngagementWindow = 7;

        let adjustedRescue = totalRescue;
        if (postAgeInDays <= peakEngagementWindow) {
            adjustedRescue = totalRescue * 1.2;
        }

        adjustedRescue *= primeBonus * postTypeWeight;

        // Recupera a monetização atual do autor para calcular amortecimento
        const currentMonetization = await monetizationsCollection.findOne({ userId: post.userId }) || { rescue: 0 };
        const currentRescue = currentMonetization.rescue || 0;

        // Função de amortecimento para ganhos elevados (logarítmica ou exponencial inversa)
        const dampingFactor = 1 / (1 + Math.log10(1 + currentRescue / 1000));
        adjustedRescue *= dampingFactor;

        // Redução de 40% nos ganhos
        adjustedRescue *= 0.6;

        // Arredonda o valor final de resgate
        adjustedRescue = Math.round(adjustedRescue);

        // Atualiza a monetização
        await monetizationsCollection.updateOne(
            { userId: post.userId },
            { $inc: { rescue: adjustedRescue } },
            { upsert: true }
        );
    }
}
