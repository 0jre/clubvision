import { dbConnect, 
    Tickethelp, visionlevel, Visionclacd, Visioncla, InformationsUsers, 
    Guestlist, postVisionCollection, reformsCollectionName, iventory, itemsCollection, 
    searchmodlog, searchsteam, searchtwitch, subpayment, withdrawalHistory, 
    Subscription, tvlnovision, monetizations, notifications, checkoutsessions } from '@/core/integration/connect';
  
  // Função para encontrar o campo de identificação do usuário na coleção
  function findUserIdField(collectionName: string): string | null {
    switch (collectionName) {
      case InformationsUsers:
        return 'id';
      case subpayment:
        return 'customer_email';
      case Subscription:
        return 'userId';
      case Tickethelp:
        return 'userid';
      case visionlevel:
        return 'member_id';
      case Visioncla:
        return 'userId';
      case Visionclacd:
        return 'id';
      case reformsCollectionName:
        return 'userId';
      case postVisionCollection:
        return 'userId';
      case searchsteam:
        return 'userId';
      case searchtwitch:
        return 'userId';
      case Guestlist:
        return 'id';
      case searchmodlog:
        return 'member_id';
      case itemsCollection:
        return 'id';
      case iventory:
        return 'userId';
      case tvlnovision:
        return 'userId';
      case withdrawalHistory:
        return 'userId';
      case notifications:
        return 'userId';
      case monetizations:
        return 'userId';
      case checkoutsessions:
        return 'userid';
      default:
        return null;
    }
  }
  
  // Função de análise do status do usuário
  async function analyzeUserStatus(userId: string) {
    const { db } = await dbConnect();  // Conectar ao banco de dados
  
    const collections = [
      { collection: db.collection(visionlevel), name: visionlevel },
      { collection: db.collection(Tickethelp), name: Tickethelp },
      { collection: db.collection(subpayment), name: subpayment },
      { collection: db.collection(Subscription), name: Subscription },
      { collection: db.collection(InformationsUsers), name: InformationsUsers },
      { collection: db.collection(Visionclacd), name: Visionclacd },
      { collection: db.collection(Visioncla), name: Visioncla },
      { collection: db.collection(reformsCollectionName), name: reformsCollectionName },
      { collection: db.collection(postVisionCollection), name: postVisionCollection },
      { collection: db.collection(searchsteam), name: searchsteam },
      { collection: db.collection(searchtwitch), name: searchtwitch },
      { collection: db.collection(Guestlist), name: Guestlist },
      { collection: db.collection(searchmodlog), name: searchmodlog },
      { collection: db.collection(itemsCollection), name: itemsCollection },
      { collection: db.collection(iventory), name: iventory },
      { collection: db.collection(tvlnovision), name: tvlnovision },
      { collection: db.collection(withdrawalHistory), name: withdrawalHistory },
      { collection: db.collection(notifications), name: notifications },
      { collection: db.collection(monetizations), name: monetizations },
      { collection: db.collection(checkoutsessions), name: checkoutsessions },
    ];
  
    const userStatus: { [key: string]: string } = {};  // Objeto para armazenar o status de cada coleção
  
    for (const { collection, name } of collections) {
      const field = findUserIdField(name);
      
      if (field) {
        // Verifica se existe um registro com o ID do usuário na coleção
        const userRecord = await collection.findOne({ [field]: userId });
        
        if (userRecord) {
          // Se encontrar um registro, adiciona o nome da coleção e o status "Com registros"
          userStatus[name] = 'Com registros';
        } else {
          // Se não encontrar, adiciona o status "Sem registros"
          userStatus[name] = 'Sem registros';
        }
      }
    }
  
    return userStatus;  // Retorna o status de todas as coleções
  }
  
export default analyzeUserStatus