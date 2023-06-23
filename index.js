require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const amqp = require('amqplib');

// for body parser: to collect data that sent from the client
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// serve static files: css, js, images
app.use(express.static(path.join(__dirname, './public')));

// routes
app.use('/', require('./routes/adminRoute'));

// errors: page not found 404;
app.use((req, res, next) => {
    var err = new Error("Page not found");
    err.status = 404;
    next(err);
});

// handling errors: send them to the client
app.use((err, req, nex) => {
    res.status(err.status || 500);
    res.send(err.message);
});


async function connect() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    // Déclarer une file d'attente
    const queue = 'myQueue';
    await channel.assertQueue(queue, { durable: true });

    // Envoyer un message à la file d'attente
    const message = 'Hello, RabbitMQ!';
    channel.sendToQueue(queue, Buffer.from(message));

    // Consommer les messages de la file d'attente
    channel.consume(queue, (msg) => {
      console.log('Message reçu:', msg.content.toString());
      // Faire quelque chose avec le message

      // Acknowledge du message pour le supprimer de la file d'attente
      channel.ack(msg);
    });
  } catch (error) {
    console.error('Erreur de connexion à RabbitMQ:', error);
  }
}

// Appeler la fonction connect pour établir la connexion à RabbitMQ
connect();




// setting up the server
app.listen(port, () => {
    console.log(`Server is running on port:${port}`);
});

module.exports = app;