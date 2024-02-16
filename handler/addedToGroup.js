const set = require('../settings');
const text = require('../lib/text/text_id');

module.exports = async (client, chat) => {
  //const { id, groupMetadata } = event;
  //const { owner, participants } = groupMetadata;
  const {id} = chat;
  await client
          .sendText(id, `Maaf, untuk saat ini bot tidak akan masuk ke grup, dikarenakan terlalu banyaknya chat yang menyebabkan server overload.\n\n Silahkan chat Owner untuk menambahkan bot ini ke grup`)
          .then(async () => await client.leaveGroup(id))
          .catch((error) => console.log('kickbot error'));
  /*
  if (participants.length < 10 && !set.owner.includes(owner)) {
    await client.sendText(id, `_⚠️ Ooppss.. maaf Member grup kamu ${participants.length}, Bot hanya dapat digunakan pada grup yang membernya berjumlah 10 Orang atau lebih!_`);
    return await client.leaveGroup(id);
  }
  */

  //return await client.sendText(id, text.menu);
};
