import mongoose from 'mongoose';
import config from './config';

(async()=>{
    try {
        // FUNCION QUE CONECTA A LA DB 
       const db = await mongoose.connect(config.DB_URL);

       console.log('database is connect to:',db.connection.name);
        
    } catch (error) {
        console.log(error);
    }
})();

