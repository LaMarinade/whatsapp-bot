// Importation des bibliothèques nécessaires
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');
const express = require('express'); 
const app = express(); 

const port = process.env.PORT || 3000; 

app.get('/', (req, res) => {
    res.send('Bot WhatsApp en cours d\'exécution 🚀');
});

// Démarre le serveur Express
app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://0.0.0.0:${port}`);
});


// Initialisation du client WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(),
});

// Affiche le QR code pour se connecter
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Scan le QR Code avec l\'application WhatsApp');
});

// Vérifie que le client est prêt
 client.on('ready', () => {
     console.log('Client prêt !');

     // ID du groupe récupéré lors de l'étape précédente
     const groupeId = '@g.us';

     //Planifie une tâche pour envoyer un message automatiquement
    cron.schedule('30 16 * * 2', async () => {
         try {
             const message = 'Ceci est un message de test envoyé un mardi à 16h30.';
             await client.sendMessage(groupId, message);
             console.log('Message envoyé au groupe !');
         } catch (err) {
            console.error('Erreur lors de l\'envoi du message :', err);
         }
     })});


// Gestion des erreurs globales
client.on('auth_failure', (msg) => {
    console.error('Échec d\'authentification :', msg);
});

client.on('disconnected', (reason) => {
    console.log('Client déconnecté :', reason);
});

// Initialisation du client WhatsApp
client.initialize();