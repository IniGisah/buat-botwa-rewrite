const moment = require('moment');
const set = require('../settings');
const fs = require('fs-extra')
//const axios = require("axios").default;
//const Nekos = require('nekos.life');
//const neko = new Nekos();
//const sagiri = require('sagiri');
//const saus = sagiri(config.nao, { results: 5 });
const config = require('../config.json')
//const parseMilliseconds = require('parse-ms')
//const toMs = require('ms')
//const { spawn } = require('child_process')
const momentt = require('moment-timezone')
momentt.tz.setDefault('Asia/Jakarta').locale('id')
//const tanggal = momentt.tz('Asia/Jakarta').format('DD-MM-YYYY')
//const uaOverride = config.uaOverride
//const { closestMatch } = require("closest-match");
//const google = require('googlethis');
//const genshindb = require('genshin-db');
//const { getChart } = require('billboard-top-100');
//const { exec } = require("child_process");

const errorImg = 'https://i.ibb.co/jRCpLfn/user.png'

// Library
const _function = require('../lib/function');
const _txt = require('../lib/text');
const color = require('../util/colors');
const { uploadImages, saveFile } = require('../util/fetcher');
const { prefix } = require('../settings');
const tugas = JSON.parse(fs.readFileSync('./database/tugas.json'));
const _reminder = JSON.parse(fs.readFileSync('./database/reminder.json'))
const _ban = JSON.parse(fs.readFileSync('./database/banned.json'))
const _artdots = require('../database/artdots')
const judullist = [];
const daftarlist = [];
//let gptwait = false;


var disablecommand = true;

const handler = require ('../handler');
//const { query } = require('express');
//const { count } = require('console');

const isUrl = (url) => {
  return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi))
}
/*
function arrayRemove(arr, value) {   
  return arr.filter(function(ele){ 
      return ele != value; 
  });
}
*/
function ngelistisi(){
  let list = '';
  list += `${judullist[0]}\n`;
  daftarlist.forEach(function (item, index){
    index = index+1;
    list += `${index}. ${item}\n`
    //client.sendText(from, (index+1) + ". " + item);
  });
  return list;
}

function ngelisttugas(){
  let list = '';
  list += "Daftar tugas : \n"
  tugas.forEach(function (item, index){
    index = index+1;
    list += `${index}. ${item}\n`
    //client.sendText(from, (index+1) + ". " + item);
  });
  return list;
}

module.exports = async (client, message) => {
  const {from} = message;
  try {
    const { id, body, mimetype, type, t, from, sender, content, caption, author, quotedMsg, quotedMsgId, isGroupMsg, isMedia, quotedMsgObj, mentionedJidList } = message;
    const { pushname, formattedName } = sender;
    const { formattedTitle, isGroup, contact, groupMetadata } = await client.getChatById(from);

    const { ind } = require('../message/text/lang/')

    const botOwner = set.owner;
    const botGroup = set.support;
    const botPrefix = set.prefix;
    const botNumber = "6285947413061" + '@c.us';
    let isAdmin = groupMetadata ? groupMetadata.participants.find((res) => res.id === sender.id)?.isAdmin : undefined;
    let isOwner = groupMetadata ? groupMetadata.participants.find((res) => res.id === sender.id)?.isSuperAdmin : undefined;
    let isBotAdmin = groupMetadata ? groupMetadata.participants.find((res) => res.id === botNumber)?.isAdmin : undefined;

    const groupId = isGroupMsg ? groupMetadata.id._serialized : ''
    const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''

    const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
    const isQuotedVideo = quotedMsg && quotedMsg.type === 'video'
    const isQuotedSticker = quotedMsg && quotedMsg.type === 'sticker'
    //const isQuotedGif = quotedMsg && quotedMsg.mimetype === 'image/gif'
    //const isQuotedAudio = quotedMsg && quotedMsg.type === 'audio'
    //const isQuotedVoice = quotedMsg && quotedMsg.type === 'ptt'
    const isImage = type === 'image'
    const isVideo = type === 'video' 
    //const isAudio = type === 'audio'
    //const isVoice = type === 'ptt'

    const isBanned = _ban.includes(sender.id)
    const isGroupAdmins = groupAdmins.includes(sender.id) || false

    //global.voterslistfile = '/poll_voters_Config_' + chat.id + '.json'
    //global.pollfile = '/poll_Config_' + chat.id + '.json'

    const blockNumber = await client.getBlockList()

    const validMessage = caption ? caption : body;
    if (!validMessage || validMessage[0] != botPrefix) return;

    const command = validMessage.trim().split(' ')[0].slice(1);
    const arguments = validMessage.trim().split(' ').slice(1);
    const arg = validMessage.substring(validMessage.indexOf(' ') + 1)
    const q = arguments.join(' ')
    const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

    const url = arguments.length !== 0 ? arguments[0] : ''
    // debug
    console.debug(color('green', '➜'), color('yellow', isGroup ? '[GROUP]' : '[PERSONAL]'), `${botPrefix}${command} | ${sender.id} ${isGroup ? 'FROM ' + groupMetadata.subject : ''}`, color('yellow', moment().format()));

    //const allChats = await client.getAllChats();
    switch (command) {
      case 'speed':
      case 'ping':
        let pmsg = `Someone ping!\n\n*From* : ${from}\n*Name* : ${pushname}`
        await client.sendText(from, `Pong!!!!\nSpeed: ${_function.processTime(t, moment())} _Second_`)
        console.log(`from : ${from}`)
        if (isGroup) pmsg += `\n*Group* : ${groupMetadata.subject}`
        await client.sendText("6285156132721@c.us", pmsg)
        break

      case 'debugmessage':
        console.log(message)
        break

      case 'debugchat':
        console.log(await client.getChatById(from))
        break

      case 'pick':
        if (!isGroup) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan didalam grup!_', id, true);
        if (arguments.length < 1) return await client.reply(from, `_Contoh penggunaan perintah : ${botPrefix}pick <sifat>_`, id, true);
        const pickSomeone = groupMetadata.participants[Math.floor(Math.random() * groupMetadata.participants.length)];
        await client.sendMentioned(from, `_👦🏼 ${arguments.join(' ')} di grup ini adalah @${pickSomeone.id.user}_`, [`${pickSomeone.id.user}`]);
        break;

      case 'kerang':
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah: ${botPrefix}kerang <kalimat>_`, id, true);
        let resp = ['Ya', 'Tidak']
        const kerangresp = Math.floor(Math.random() * resp.length)
        await client.reply(from, `🐚 ${resp[kerangresp]} 🐚`, id, true)
        break;

      case 'sticker':
      case 'stiker':
        if (!isImage && !isQuotedImage) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : kirim atau reply sebuah gambar yang ingin dijadikan stiker lalu berikan caption ${botPrefix}stiker_`, id, true);
        const mediaData = isQuotedImage ? quotedMsgId : id
        //const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
        //const mediatostr = mediaData.toString('base64')
        //const imageBase64 = `data:${_mimetype};base64,${mediatostr}`
        //const imagemediadata = await decryptMedia(message);
        //const imageb64 = `data:${mimetype};base64,${imagemediadata.toString('base64')}`;
        await client.sendImageAsSticker(from, await client.downloadMedia(mediaData));
        break;

      case 'p':
      case 'spam':
        if (!isGroup) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan didalam grup!_', id, true);
        const allMembers = groupMetadata.participants.map((member) => `@${member.id.user}`);
        if ( groupMetadata.desc && groupMetadata.desc.includes("#noping") ) 
        { await client.sendText(from, '_*⚠️ Gaboleh spam disini yak*_') } 
        else {
          await client.sendMentioned(from, `_*Summon*_\n\n${allMembers.join('\n')}\n`, allMembers); }
        break;

      case 'loginvr':
        const vr = "Login vr dong \n yasman @6281285600258 \n hadid @6281329989383 \n junas @628978113198 \n barra @6281388088047 \n sean @6283818448972 \n ari @6281299115053 \n dito @6285155277438 \n murise @6281511529199";
        await client.sendMentioned(from, vr);
        break;

      case 'logingta':
        const gta =`Login gta dong
Aji @628888418207 
Junas @628978113198 
Gisah @6285156132721 
Dito @6285155277438 
Arip @6282299922988 
Hadid @6281329989383 
Willy @6282112378872 
Wahuy @6281413543830
Nopal @6289638065793
Murise @6281511529199`;
        await client.sendMentioned(from, gta);
        break;

      case 'loginml':
        const ml = `Login ml dong
aji @628888418207
wahyu @6281413543830
junas @628978113198
ikhsan @6281510026269
dito @6285155277438
jidni @62895330810346
titan @6287788087760`;
        await client.sendMentioned(from, ml);
        break;

      case 'loginamong':
        const among = `Login among us dong
Murise @6281511529199
Dito @6285155277438
Junas @628978113198
Arip @6282299922988
Hadid @6281329989383
Willy @6282112378872
Wahuy @6281413543830
Nopal @6289638065793
Ghyas @6281285600258
Zidny @62895330810346
Aji @628888418207
Barra @6281388088047
Titan @6287788087760
Aufa @6285893440925`;
        await client.sendMentioned(from, among);
        break;

      case 'loginmc':
        const mc =`Login minecraft dong
Gisah @6285156132721
Willy @6282112378872
Murise @6281511529199
Aufa @6285893440925
Nopal @6289638065793
Junas @628978113198
Barra @6281388088047
Wahyu @6281413543830
Dito @6285155277438`
        await client.sendMentioned(from, mc);
        break;

      case 'logindota':
        const dota =`Login Dota 2 dong
Junas @628978113198
Dito @6285155277438
Arip @6282299922988
Wahuy @6281413543830
Murise @6281511529199`;
        await client.sendMentioned(from, dota);
        break;

      case 'logingensin':
      case 'logingenshin':
      case 'login4no':
      const genshin =`Login Genshin dong
Aji @628888418207
Dito @6285155277438
Titan @6287788087760
Wahuy @6281413543830
Barra @6281388088047
Murise @6281511529199`;
        await client.sendMentioned(from, genshin);
        break;

      case 'loginl4d2':
      case 'loginl4d':
      case 'loginjombi':
      const l4d2 =`Login Left4Dead dong
Aji @628888418207
Gisah @6285156132721
Dito @6285155277438
Titan @6287788087760
Wahuy @6281413543830
Murise @6281511529199
Aufa @6285893440925
Nopal @6289638065793
ari @6281299115053
Hadid @6281329989383`;
        await client.sendMentioned(from, l4d2);
        break;

      case 'waifu':
        const modes = ['sfw', 'nsfw']
        const categories = ['waifu', 'neko', 'shinobu', 'megumin', 'bully', 'cuddle', 'cry', 'hug', 'awoo', 'kiss', 'lick', 'pat', 'smug', 'bonk', 'yeet', 'blush', 'smile', 'wave', 'highfive', 'handhold', 'nom', 'bite', 'glomp', 'kill', 'slap', 'happy', 'wink', 'poke', 'dance', 'cringe', 'blush']
        const categoriesnsfw = ['waifu', 'neko', 'blowjob']
        const categoriesrand = ['waifu', 'neko', 'shinobu', 'megumin', 'happy', 'blush']
        var mode,cat;
        const random = Math.floor(Math.random() * categoriesrand.length);
        const randomnsfw = Math.floor(Math.random() * categoriesnsfw.length);
        if (modes.includes(arguments[0]) && categories.includes(arguments[1])) {client.reply(from, ind.wait() + `\n\n_Mendapatkan gambar ${arguments[0]} dengan kategori ${arguments[1]}..._`, id), true}
        if (arguments[0] === 'nsfw' && disablecommand) {
          client.reply(from, "Fitur dimatikan sementara, tobat cok ", id, true)
          await client.sendImageAsSticker(from, 'https://i.ibb.co/8nZFsY9/ghyastobat.png')
          return 0
        }
        if (arguments.length == 0){ 
          client.reply(from, ind.wait() + `\n\n_Mendapatkan gambar random..._`, id, true)
          mode = "sfw"
          cat = "waifu"
        } else {
          mode = arguments[0]
          cat = arguments[1]
        }
        if (arguments.length == 1){
          if (arguments[0] === 'sfw'){
            client.reply(from, ind.wait() + `\n\n_Mendapatkan gambar sfw random..._`, id, true)
            mode = "sfw"
            cat = categories[random]
          } else if (arguments[0] === 'nsfw'){ 
            var i = true 
            mode = 'nsfw'
            cat = categoriesnsfw[randomnsfw]
          }
        }
        if (arguments[0] === 'help' && arguments.length == 1 && disablecommand) return await client.reply(from, ind.waifu(), id, true)
        if (arguments[0] === 'help' && arguments.length == 1) return await client.reply(from, ind.waifuex(), id, true)
        _function.weeaboo.waifu(mode, cat)
          .then(async ({ url }) => {
            console.log('Waifu image received!')
            if (i == true) {
              await client.sendText(from, `_⚠️Disclaimer⚠️_\n\nPastikan yang melihat ini berumur 18+++++++\nBot Owner tidak bertanggung jawab jika command ini disalahgunakan\n\nTerima kasih`)
            }
            if (url.includes("gif")){
              await client.sendGif(from, url, `${t}_${sender.id}.gif`, ''. id);
            } else {
              await client.sendImage(from, url, `${t}_${sender.id}.jpg`, ''. id);
            }
            
            //let filename = url.slice(21)
            //await _function.misc.downloadFile(url, `./media/${filename}`)
            //await client.sendImage(from, `./media/${filename}`, filename, '')
            //  .then(() => console.log('Success sending waifu!'))
            //  fs.unlink(`./media/${filename}`, (err) => {
            //    if (err) {console.log(`file delete error : ${err}`)}
            //  });
          })
            .catch(async (err) => {
              console.error(err)
              await client.reply(from, `Error!\nCoba lagi atau Lihat command ${botPrefix}waifu help`, id, true)
            })
        break

      default:
        //let matching = closestMatch(command, _txt.menulist);
        client.reply(from, `Maaf, bot ini sedang dalam pengkodingan ulang dikarenakan matinya aplikasi yang mendasarkan bot ini. Kemungkinan command atau perintah yang anda masukkan belum atau tidak ada \n\nSecara perlahan fitur akan dikembalikan. Terima kasih*_ ?`, id, true)
        return console.debug(color('red', '➜'), color('yellow', isGroup ? '[GROUP]' : '[PERSONAL]'), `${botPrefix}${command} | ${sender.id} ${isGroup ? 'FROM ' + groupMetadata.subject : ''}`, color('yellow', moment().format()));
    }

    return;
  } catch (err) {
    //client.sendText(from, 'Syid, Client error!\n\nTolong hubungi owner beserta error log')
    //client.sendText(from, `error log\n\n${err}`)
    console.log(err);
    //gptwait = false;
  }
};
