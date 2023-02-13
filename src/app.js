import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import productRoute from './routes/products.js'
import { Server } from 'socket.io';

const app = express();

const httpServer = app.listen(8080, () => {
  console.log('server runing in port 8080')
});

export const socketServer = new Server(httpServer)

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+'/public'));
app.use('/', viewsRouter)
app.use('/api/products', productRoute);



socketServer.on('connection', socket => {
  console.log(`Nuevo Cliente`);

  socket.on('message', data => {
    console.log(data);
  })
})