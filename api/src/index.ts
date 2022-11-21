import logger from 'jet-logger'
import server from './server'
import {Client} from 'pg'
import { TODOS_CREATE, USERS_CREATE } from './sql/TABLE';

// **** Start server **** //

export const dataBase = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '12345',
    port: 5432
})

const msg = ('Express server started on port: ' + (process.env.PORT || 3000).toString());

dataBase.connect((err) => {
    if(err) throw err
    console.log(`Connected to Data Base with port: ${dataBase.port}`)
    dataBase.query(USERS_CREATE, (err, res) => {
        
    })
    dataBase.query(TODOS_CREATE, (err, res) => {
        
    })
    server.listen(process.env.PORT || 3000, () => logger.info(msg));
})


