const wppconnect = require('@wppconnect-team/wppconnect');
const Handler = require("./handler");

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
}