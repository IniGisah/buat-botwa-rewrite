const wppconnect = require('@wppconnect-team/wppconnect');
const Handler = require("./handler");
const express = require('express');
const bodyParser = require('body-parser');
const cronjob = require('cron')
const axios = require('axios')

const app = express();
const PORT = process.env.PORT || 6543;

const botPrefix = "#"

function repairMalformedJson(jsonString) {
  let repairedString = jsonString;
  try {
    // Replace HTML entities and ensure proper escaping
    repairedString = repairedString.replace(/&quot;/g, '\"');
    repairedString = repairedString.replace(/&lt;/g, '<');
    repairedString = repairedString.replace(/&gt;/g, '>');
    repairedString = repairedString.replace(/&amp;/g, '&');
    repairedString = repairedString.replace(/&apos;/g, '\'');
    repairedString = repairedString.replace(/<br>/g, '\\n'); // Assuming <br> is used for line breaks

    // Debugging line to check the repaired string
    console.log('Repaired JSON String:', repairedString);
  } catch (error) {
    console.error('Error repairing JSON string:', error);
  }
  return repairedString;
}

wppconnect.defaultLogger.level = 'http', 'info';

wppconnect
  .create({
    session: 'luii-wa-bot',
    puppeteerOptions: {
      userDataDir: './session', // or your custom directory 
      timeout: 0,
      headless: "new"
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
    debug: false,
  })
  .then((client) => {
    client.onMessage((message) => {
      if (message.type == "list_response" || message.type == "buttons_response" || message.type == "template_button_reply") {
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

    client.onAck

    const job = new cronjob.CronJob(
      '0 */12 * * *',
      async function () {
        await client.sendText("6285156132721@c.us", 'Deleting chats...')
        const chats = await client.listChats();
        //await client.sendText("6285156132721@c.us", chats)
        chats.forEach(async function (item) {
          await client.deleteChat(item.id)
        })
        await client.sendText("6285156132721@c.us", 'All Chats Deleted!')
        console.log('Message Cleared!');
      }, // onTick
      null, // onComplete
      true, // start
    )

    app.post('/webhook', bodyParser.json(), async (req, res) => {
      //console.log('Received webhook:', req.body);
      let strsend

      if (req.body.episodes && req.body.episodes.length > 0) {
        // Series and episode details are available
        strsend = `_*New Sonarr Notification!*_

Series : *${req.body.series.title}*

Title : ${req.body.episodes[0].title}
Number : S${req.body.episodes[0].seasonNumber}E${req.body.episodes[0].episodeNumber}

Release : ${req.body.release?.releaseTitle}
Size : ${req.body.release?.size ? (req.body.release.size / (1024 * 1024)) + " MB" : "Unknown"}

Sonarr Event type : ${req.body.eventType}
        `;
    } else {
        // Only series details are available
        strsend = `_*New Sonarr Notification!*_

Series : *${req.body.series.title}*
Type : ${req.body.series.type}
Year : ${req.body.series.year}
Tags : ${req.body.series.tags.join(', ')}

Sonarr Event type : ${req.body.eventType}
        `;
    }
      await client.sendImage("120363326890011451@g.us", `http://media.luii.my.id/sonarr/api/v3/mediacover/${req.body.series.id}/poster-500.jpg?apikey=dc01ed6bdecc4ae5be4593b6cb7293ca`, "fanart.jpg", strsend)
      //await client.sendText("6285156132721@c.us", strsend)
      res.sendStatus(200);
    });

    app.post('/webhookmedia', express.raw({ type: 'application/json' }), async (req, res) => {
      try {
        const rawBody = req.body.toString();
        const repairedBody = repairMalformedJson(rawBody);
    
        const parsedBody = JSON.parse(repairedBody);
    
        // console.log('Received webhook:', parsedBody);
    
        await client.sendImage("120363326890011451@g.us", parsedBody.photo, "notifmedia.jpg", parsedBody.caption);
        res.sendStatus(200);
      } catch (error) {
        console.error('Failed to repair and parse JSON:', error, '\nOriginal Body:', req.body.toString());
        res.status(400).send('Bad JSON');
      }
    });
  })
  .catch((error) => console.log(error));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
