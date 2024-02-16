const wppconnect = require('@wppconnect-team/wppconnect');
const Handler = require("./handler");
const express = require('express');
const bodyParser = require('body-parser');
const cronjob = require('cron')
const axios = require('axios')

const app = express();
const PORT = process.env.PORT || 6543;

const botPrefix = "#"

app.use(bodyParser.json());

wppconnect.defaultLogger.level = 'http', 'info';

wppconnect
  .create({
    session: 'luii-wa-bot',
    puppeteerOptions: {
        userDataDir: './session', // or your custom directory
        executablePath: '/usr/bin/chromium-browser',
    },
    onLoadingScreen: (percent, message) => {
      console.log('LOADING_SCREEN', percent, message);
    },
    statusFind: async (statusSession, session) => {
      console.log('Status Session: ', statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
      const response = await axios.post(
        'https://api.telegram.org/bot2057260037:AAG3y516eJYSx3boYuPxkbHUbbM4WDt23QE/sendMessage',
        // '{"chat_id": "846713155", "text": "This is a test from curl", "disable_notification": true}',
        {
          'chat_id': '846713155',
          'text': `Whatsapp Bot Status : ${statusSession}`
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      //Create session wss return "serverClose" case server for close
      console.log('Session name: ', session);
    },
    headless: true,
    useChrome: true,
    debug: false,})
  .then((client) => {
      client.onMessage((message) => {
        if (message.type == "list_response" || message.type == "buttons_response") {
          console.log(message)
        }
        const validMessage = message.caption ? message.caption : message.body;
        if (!validMessage || validMessage[0] != botPrefix) return;
        Handler.messageHandler(client, message);
      });
    
      client.onAddedToGroup(async (chat) => {
        await client.sendText("6285156132721@c.us", `*Seseorang telah memasukkan bot kedalam grup!*\n\nNama Grup : ${chat.name}`)
        //Handler.addedToGroup(client, chat)
      })

      client.onIncomingCall(async (call) => {
        client.rejectCall()
      })
      const job = new cronjob.CronJob(
        '0 */12 * * *',
        async function () {
          await client.sendText("6285156132721@c.us", 'Deleting chats...')
          const chats = await client.listChats();
          //await client.sendText("6285156132721@c.us", chats)
          chats.forEach(async function(item) {
              await client.deleteChat(item.id)
            })
          await client.sendText("6285156132721@c.us", 'All Chats Deleted!')
          console.log('Message Cleared!');
        }, // onTick
        null, // onComplete
        true, // start
      )
    })
  .catch((error) => console.log(error));

function start(client) {
  app.post('/webhook', (req, res) => {
    console.log('Received webhook:', req.body);
    res.sendStatus(200);
  });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
