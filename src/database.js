import mongoose from 'mongoose';
import config from './config';

(async()=>{
    try {
        // FUNCION QUE CONECTA A LA DB 
        const db = mongoose.createConnection(config.DB_URL);

       
        db.on('open',()=>{
            console.log('database is connect to:',db.db.databaseName);
        })  
    } catch (error) {
        console.log(error);
    }
})();

