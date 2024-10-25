import { connect } from 'mongoose';

const MONGO_URI="mongodb+srv://admin:admin@cluster0.kbqmp.mongodb.net/back1?retryWrites=true&w=majority&appName=Cluster0"
//const MONGO_URI='mongodb://localhost:27017/proyecto-back-i';

await connect(MONGO_URI)
  .then(() => { console.log("✅ Conectado al Servidor de MongoDB.") })
  .catch((error) => { console.log("❌ No Conectado al Servidor de MongoDB:\n" + error) });
