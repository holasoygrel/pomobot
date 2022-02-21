import mongoose from 'mongoose';
import { dbUrl } from './config';


(async()=>{
    try {
        // FUNCION QUE CONECTA A LA DB 

        const db = mongoose.createConnection(dbUrl);

        db.on('open',()=>{
            console.log('database is connect to:',db.db.databaseName);
        })

        
    } catch (error) {
        
        console.log(error);
    }
})();

