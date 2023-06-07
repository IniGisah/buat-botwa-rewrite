const wppconnect = require('@wppconnect-team/wppconnect');
const Handler = require("./handler");

wppconnect.defaultLogger.level = 'info';

wppconnect
  .create({
    session: 'luii-wa-bot',
    puppeteerOptions: {
        userDataDir: './session', // or your custom directory
    },
    headless: true,
    debug: false,})
  .then((client) => start(client))
  .catch((error) => console.log(error));

function start(client) {
  client.onMessage((message) => {
    Handler.messageHandler(client, message);
  });
}