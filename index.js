const wppconnect = require('@wppconnect-team/wppconnect');
const Handler = require("./handler");
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 6543;

app.use(bodyParser.json());

wppconnect.defaultLogger.level = 'http', 'info';

wppconnect
  .create({
    session: 'luii-wa-bot',
    puppeteerOptions: {
        userDataDir: './session', // or your custom directory
        executablePath: '/usr/bin/chromium-browser',
    },
    headless: true,
    useChrome: true,
    debug: false,})
  .then((client) => start(client))
  .catch((error) => console.log(error));

function start(client) {
  client.onMessage((message) => {
    Handler.messageHandler(client, message);
  });

  app.post('/webhook', (req, res) => {
    console.log('Received webhook:', req.body);
    res.sendStatus(200);
});
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
