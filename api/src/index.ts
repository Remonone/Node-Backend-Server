import logger from 'jet-logger';
import server from './server';


// **** Start server **** //

const msg = ('Express server started on port: ' + (process.env.PORT || 3000).toString());
server.listen(process.env.PORT || 3000, () => logger.info(msg));
