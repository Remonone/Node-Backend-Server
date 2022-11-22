import logger from 'jet-logger'
import server from './server'
import {Client} from 'pg'
import { TODOS_CREATE, USERS_CREATE } from './sql/TABLE';

// **** Start server **** //

export const dataBase = new Client({
    user: 'postgres',
    host: '172.21.0.2',
    database: 'postgres',
    password: '12345',
    port: 5432
})

const msg = ('Express server started on port: ' + (8000).toString());

dataBase.connect((err) => {
    if(err) throw err
    console.log(`Connected to Data Base with port: ${dataBase.port}`)
    dataBase.query(USERS_CREATE, (err, result) => {
        dataBase.query(TODOS_CREATE)
    })
    server.listen(8000, () => logger.info(msg));
})


