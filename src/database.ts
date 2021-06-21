import mongoose from 'mongoose';
import { dbUrl } from './config';


(async()=>{

    try {
        // FUNCION QUE CONECTA A LA DB 
        const db = await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });

        console.log('database is connect to:',db.connection.name);
    } catch (error) {
        
        console.log(error);
    }
})();

