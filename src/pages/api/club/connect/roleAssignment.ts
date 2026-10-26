import type { NextApiResponse } from "next"
import { type NextIronRequest, withSession } from "@/lib/session"
import { dbConnect, reformsCollectionName, Visioncla } from "@/core/integration/connect"
import { Client, type ClientOptions, type Guild } from "discord.js"

// IDs dos cargos do Discord
const tagId = "1175858552687050962"
const guestId = "1186171778565951579"
const banTagId = "1175866118741704837"
const tagnvxre = "1403422271049044098"
const Primetag = "1403420479183650867"
const tagAdmin = "1375904937833267221"
const tagcla = "1237194145567735809"
const tagclaowner = "1238192857790021705"
const eventag = "1175893254479286333"
const support = "1259934003239063644"
const leadtag = "1382923466079997952"
const tagIdverified = "1186114400193617990"

 
const handler = async (req: NextIronRequest, res: NextApiResponse) => {
  try {
    // Obter dados da sessão
    const oauthData = await req.session.get("oauth_temp")

   if (!oauthData || !oauthData.access_token) {
      return res.status(401).json({ error: "Sessão expirada ou inválida. Faça login novamente." })
    }

    // userId agora é o VID
    const vid = String(req.query.userId)
    const accessToken = oauthData.access_token

    if (!vid) {
      return res.status(400).json({ error: "Parâmetro userId (VID) ausente na query." })
    }

    // Buscar o discord_id correspondente ao VID
   const { db } = await dbConnect()
    
    const discordId = vid
   
    
    // Inicializar cliente Discord
    const discordOptions: ClientOptions = {
      intents: 9,
    }
    const discordClient = new Client(discordOptions)
    await discordClient.login(process.env.BOT_TOKEN)

    // Função para adicionar membro ao servidor e gerenciar cargos
    async function addMemberToGuild(guild: Guild | undefined, userId: any, userAccessToken: any) {
      try {
       if (userId === "701975084239159328") {
          return
        }
         
        if (!guild) {
          console.error("Guild not found.")
          return
        }

        // Verificar status do usuário no banco de dados
         const user = await db.collection("users").findOne({ discord_id: discordId})
        const Leads = await db.collection("users").findOne({ discord_id: discordId, type: "ADMIN" })
        const reform = await db.collection(reformsCollectionName).findOne({ userId: user?.id, type: "Authorized" })
        const Clamev = await db.collection(Visioncla).findOne({
          $or: [
            { Members: { $in: [user?.id] } }, 
            { userId: user?.id },  
          ],
        })
        const Clamevowner = await db.collection(Visioncla).findOne({ userId: user?.id })
        const Verified = await db.collection(reformsCollectionName).findOne({ userId: user?.id, verified: true })
        const Admin = await db.collection(reformsCollectionName).findOne({ userId: user?.id, nvrp: true })
        const Support = user?.team?.support === true;
        const Prime = await db.collection(reformsCollectionName).findOne({ userId: user?.id, prime: true })
        const Event = await db.collection(reformsCollectionName).findOne({ userId: user?.id, event: true })
        const Nvxre = await db.collection(reformsCollectionName).findOne({ userId: user?.id, nvxre: true })
        const guestUser = await db.collection(reformsCollectionName).findOne({ userId: user?.id, guest: true })
        const modLogs = await db.collection("mod-logs").findOne({
          guild_id: "1175857498687807560",
          member_id: user?.id,
          type: "BAN",
        })

        // Obter membro do servidor
        const member = await guild.members.fetch(userId)

        // Processar usuário banido
        if (modLogs) {
          // Adicione a tag de ban ao perfil do Discord se o usuário não tiver
          if (member && !member.roles.cache.has(banTagId)) {
            await member.roles.add(banTagId)
            await member.roles.remove(support)
            await member.roles.remove(tagId)
            await member.roles.remove(leadtag)
            await member.roles.remove(tagcla)
            await member.roles.remove(tagclaowner)
            await member.roles.remove(Primetag)
            await member.roles.remove(tagIdverified)
            await member.roles.remove(tagAdmin)
            await member.roles.remove(tagnvxre)
            console.log(`Added ban tag ${banTagId} to user ${userId}`)
          } else {
            console.log(`User ${userId} already has ban tag ${banTagId}`)
          }

          // Remova o Type 'Authorized' do collection reforms
          await db.collection(reformsCollectionName).findOneAndUpdate(
            { userId: user?.id, type: "Authorized" },
            { $unset: { type: 1 } }, // Remove o campo Type do documento
          )

          // Remova o Type 'Authorized' do collection reforms
          await db.collection("users").findOneAndUpdate(
            { id: user?.id, type: "ADMIN" },
            { $unset: { type: 1 } }, // Remove o campo Type do documento
          )

          // Remova o Type support do collection reforms
          await db.collection(reformsCollectionName).findOneAndUpdate(
            { userId: user?.id, support: true },
            { $unset: { support: 1 } }, // Remove o campo Type do documento
          )
          // Remova o Type 'Authorized' do collection reforms
          await db.collection(reformsCollectionName).findOneAndUpdate(
            { userId: user?.id, verified: true },
            { $unset: { verified: 1 } }, // Remove o campo Type do documento
          )
          // Remova o Type 'Admin' do collection reforms
          await db.collection(reformsCollectionName).findOneAndUpdate(
            { userId: user?.id, nvrp: true },
            { $unset: { nvrp: 1 } }, // Remove o campo Type do documento
          )

          // Remova o Type 'Nvxre' do collection reforms
          await db.collection(reformsCollectionName).findOneAndUpdate(
            { userId: user?.id, nvxre: true },
            { $unset: { nvxre: 1 } }, // Remove o campo Type do documento
          )

          // Remova o Type 'Event' do collection reforms
          await db.collection(reformsCollectionName).findOneAndUpdate(
            { userId: user?.id, event: true },
            { $unset: { event: 1 } }, // Remove o campo Type do documento
          )

          // Remova o Type 'prime' do collection reforms
          await db.collection(reformsCollectionName).findOneAndUpdate(
            { userId: user?.id, prime: true },
            { $unset: { prime: 1 } }, // Remove o campo Type do documento
          )
        } else if (reform) {
          // Adicione a tag ao perfil do Discord se o usuário não tiver
          if (member && !member.roles.cache.has(tagId)) {
            await member.roles.add(tagId)
            await member.roles.remove(banTagId)
            console.log(`Added tagId ${tagId} to user ${userId}`)
          } else {
            console.log(`User ${userId} already has tagId ${tagId}`)
          }

          // Verifique se há um nickname definido no reforms e atualize o nickname do Discord
          const reformNickname = reform.nickname || user?.name
          if (reformNickname) {
            await member.setNickname(reformNickname)
            console.log(`Updated Discord nickname to ${reformNickname} for user ${userId}`)
          }
        }

        // Processar remoção de cargos para usuários que não têm mais o status
        if (!Support && member.roles.cache.has(support)) {
          await member.roles.remove(support)
          console.log(`removed leadtag ${support} to user ${userId}`)
        }

        if (!Clamev && member.roles.cache.has(tagcla)) {
          await member.roles.remove(tagcla)
          console.log(`removed leadtag ${tagcla} to user ${userId}`)
        }

        if (!Clamevowner && member.roles.cache.has(tagclaowner)) {
          await member.roles.remove(tagclaowner)
          console.log(`removed leadtag ${tagclaowner} to user ${userId}`)
        }

        if (!Leads && member.roles.cache.has(leadtag)) {
          await member.roles.remove(leadtag)
          console.log(`removed leadtag ${leadtag} to user ${userId}`)
        }

        if (!guestUser && member.roles.cache.has(guestId)) {
          await member.roles.remove(guestId)
          console.log(`removed guestId ${guestId} to user ${userId}`)
        }

        if (!Event && member.roles.cache.has(eventag)) {
          await member.roles.remove(eventag)
          console.log(`Removed tagId ${eventag} from user ${userId}`)
        }

        if (!Verified && member.roles.cache.has(tagIdverified)) {
          await member.roles.remove(tagIdverified)
          console.log(`Removed tagId ${tagIdverified} from user ${userId}`)
        }

        if (!Admin && member.roles.cache.has(tagAdmin)) {
          await member.roles.remove(tagAdmin)
          console.log(`Removed tagId ${tagAdmin} from user ${userId}`)
        }

        if (!Nvxre && member.roles.cache.has(tagnvxre)) {
          await member.roles.remove(tagnvxre)
          console.log(`Removed tagId ${tagnvxre} from user ${userId}`)
        }

        if (!Prime && member.roles.cache.has(Primetag)) {
          await member.roles.remove(Primetag)
          console.log(`removed Prime ${Primetag} to user ${userId}`)
        }

        // Se o usuário não tiver o tipo 'Authorized', remova a tagId
        if (!reform && member.roles.cache.has(tagId)) {
          await member.roles.remove(tagId)
          console.log(`Removed tagId ${tagId} from user ${userId}`)
        }

        // Adicionar cargos para usuários com status
        if (guestUser && !member.roles.cache.has(guestId)) {
          await member.roles.add(guestId)
          console.log(`Added guestId ${guestId} to user ${userId}`)
        }

        if (Leads && !member.roles.cache.has(leadtag)) {
          await member.roles.add(leadtag)
          console.log(`Added guestId ${leadtag} to user ${userId}`)
        }

        if (Support && !member.roles.cache.has(support)) {
          await member.roles.add(support)
          console.log(`Added guestId ${support} to user ${userId}`)
        }

        if (Clamev && !member.roles.cache.has(tagcla)) {
          await member.roles.add(tagcla)
          console.log(`Added guestId ${tagcla} to user ${userId}`)
        }

        if (Clamevowner && !member.roles.cache.has(tagclaowner)) {
          await member.roles.add(tagclaowner)
          console.log(`Added guestId ${tagclaowner} to user ${userId}`)
        }

        if (Verified && !member.roles.cache.has(tagIdverified)) {
          await member.roles.add(tagIdverified)
          console.log(`Added guestId ${tagIdverified} to user ${userId}`)
        }

        if (Event && !member.roles.cache.has(eventag)) {
          await member.roles.add(eventag)
          console.log(`Added guestId ${eventag} to user ${userId}`)
        }

        if (Admin && !member.roles.cache.has(tagAdmin)) {
          await member.roles.add(tagAdmin)
          console.log(`Added guestId ${tagAdmin} to user ${userId}`)
        }

        if (Nvxre && !member.roles.cache.has(tagnvxre)) {
          await member.roles.add(tagnvxre)
          console.log(`Added guestId ${tagnvxre} to user ${userId}`)
        }

        if (Prime && !member.roles.cache.has(Primetag)) {
          await member.roles.add(Primetag)
          console.log(`Added Primetag ${Primetag} to user ${userId}`)
        }

        console.log(`Adding user ${userId} to the server...`)

        // Use o método addMember ao invés de fetch para adicionar o usuário ao servidor
        await guild.members.add(userId, { accessToken: userAccessToken })

        console.log(`User ${userId} added to the server.`)
      } catch (error) {
        console.error("Error adding member to the server:", error)
      }
    }

    // Executar a função de adicionar membro e gerenciar cargos
    const guild = discordClient.guilds.cache.get("1175857498687807560")
    await addMemberToGuild(guild, discordId, accessToken)

    // Fechar a conexão do cliente Discord
    await discordClient.destroy()

    res.status(200).json({ success: true })
  } catch (error) {
    console.error("Error assigning roles:", error)
    res.status(500).json({ error: "An error occurred while assigning roles." })
  }
}

export default withSession(handler)
