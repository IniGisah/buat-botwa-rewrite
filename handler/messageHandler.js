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
      case 'commandswitch':
        if (!botOwner.includes(sender.id)) return await client.reply(from, ind.ownerOnly(), id, true)
        if (disablecommand){
          disablecommand = false
        } else {
          disablecommand = true
        }
        await client.sendText(from, `_Blocked command telah di switch!_\nDisabled command status : *${disablecommand}*`)
        break

      case 'speed':
      case 'ping':
        let pmsg = `Someone ping!\n\n*From* : ${from}\n*Name* : ${pushname}`
        await client.sendText(from, `Pong!!!!\nSpeed: ${_function.processTime(t, moment())} _Second_`)
        console.log(`from : ${from}`)
        if (isGroup) pmsg += `\n*Group* : ${groupMetadata.subject}`
        await client.sendText("6285156132721@c.us", pmsg)
        break

      case 'debugmessage':
        if (quotedMsg){
          console.log(await client.getMessageById(quotedMsgId))
        } else {
          console.log(message)
        }
        break

      case 'debugchat':
        console.log(await client.getChatById(from))
        break

      case 'owner':
      case 'contact':
      case 'ownerbot':
        return await client.reply(from, '_👋 Hai, kalo mau req fitur bisa pc ke *https://wa.me/6285156132721*_', id, true);
        break;

      case 'jodohku':
      case 'matchme':
        if (!isGroup) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan didalam grup!_', id, true);
        let countMember = groupMetadata.participants.length;
        let randomNumber = Math.floor(Math.random() * (countMember - 1) + 1);
        const randomMembers = groupMetadata.participants[randomNumber];
        const isSenderNumber = randomMembers.id._serialized === sender.id;
        await client.sendMentioned(from, isSenderNumber ? `_👬🏼 Yha! jodoh kamu gak ada ditemukan di grup ini, nge-gay aja ya_` : `_❤️ Jodoh @${sender.id.split('@')[0]} kamu digrup ini adalah @${randomMembers.id.user}_`, [`${sender.id.split('@')[0]}`, `${randomMembers.id.user}`]);
        break;

      case 'kickme':
        if (!isBotAdmin) return await client.reply(from, '_⚠️ Perintah ini hanya dapat digunakan ketika *Bot berstatus Admin* di grup ini!_', id, true);
        if (!isGroup) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan didalam grup!_', id, true);
        if (isOwner) return await client.reply(from, '_⛔ Owner grup/Orang ganteng tidak dapat dikick!_', id, true);
        await client.reply(from, '_😏 Aku harap kamu tau apa yang kamu lakukan!_', id, true);
        await client.removeParticipant(from, sender.id);
        break;

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
        await client.sendImageAsSticker(from, await client.downloadMedia(mediaData));
        break;

      case 'voice':
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah: ${botPrefix}voice <kode> <kalimat>_\n_atau ${botPrefix}voice help`, id, true);
        if (arguments[0] === "help") return await client.reply(from, `_Daftar bahasa voice, true_
indonesia: "id",
arabic: "ar",
russia: "ru",
japan: "ja",
thailand: "th",
china: "zh-CN",
france: "fr",
german: "ge",
korea: "ko",
polish: "pl",
chinese: "zh-TW",
english: "en"

*Contoh* : ${botPrefix}voice en hello
    ${botPrefix}voice japan こんにちは`, id)
        const voiceUrl = _function.voiceUrl(arguments);
        const encodeurl = encodeURI(voiceUrl)
        await client.sendPtt(from, encodeurl, id);
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

      case 'gay':
        if (mentionedJidList.length > 0 || arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah: ${botPrefix}gay <nama>_`, id, true);
        const gayPercentage = Math.floor(Math.random() * 100);
        await client.reply(from, `_👬🏻 Tingkat gay *${arguments.join(' ')}* sebesar ${gayPercentage}%_`, id, true);
        break;

      case 'jodoh':
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah: ${botPrefix}jodoh <nama kamu>&<nama seseorang>_`, true);
        const jodohSplit = arguments.join(' ').split('&');
        if (jodohSplit.length < 2) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah: ${botPrefix}jodoh <nama kamu>&<nama seseorang>_`, true);
        const jodohPersentase = Math.floor(Math.random() * 100);
        await client.reply(from, `_💖 Persentase kecocokan ${jodohSplit[0]} & ${jodohSplit[1]} sebesar ${jodohPersentase}_`, id, true);
        break;

      case 'anime':
        if (arguments.length < 1) return await client.reply(from, `_Penggunaan : ${botPrefix}anime <judul>_`, id, true);
        const getAnime = await _function.animesearch(arguments.join(' '));
        if (!getAnime) return await client.reply(from, `_*Error!*_\nAnime tidak ditemukan `, id, true)
        await client.sendImage(from, getAnime.picUrl, `${t}_${sender.id}.jpg`, getAnime.caption, id);
        break;

      case 'google':
        const gmodes = ['search', 'image', 'reverseimage']
        if (arguments.length <= 1 || arguments[0] == 'help'){
          return await client.reply(from, `*Fitur Pencarian Google*\n\n_Untuk mencari dengan Google_ : ${botPrefix}google search <judul>\n_Untuk mencari gambar_ : ${botPrefix}google image <judul>\n_Untuk mencari hasil google dengan gambar_ : kirim atau reply gambar yang ingin dicari, lalu berikan caption ${botPrefix}google reverseimage`, id, true)
        }
        else if (arguments[0] == 'search'){
         await client.reply(from, ind.wait() + `\n\n_Mendapatkan hasil dari Google Search..._`, id, true)
          const gres = await google.search(arguments.slice(1).join(' '), {
            page: 0,
            safe: disablecommand,
          });
          //console.log(gres);
          let ghasil = '*Hasil Pencarian Google*\n\n'
          if (gres.hasOwnProperty("did_you_mean")){
            ghasil += `Mungkin maksud anda, _*${gres.did_you_mean}*_?\n\n`
          }
          for (let i = 0; i < gres.results.length; i++) {
            ghasil += `${i}.\n*Judul* : ${gres.results[i].title}\n*Deskripsi* : ${gres.results[i].description}\n*Link* : ${gres.results[i].url}\n\n`
          }
          await client.reply(from, ghasil, id, true)
        }
        else if (arguments[0] == 'image'){
          client.reply(from, ind.wait() + `\n\n_Mendapatkan hasil dari Google Search..._`, id, true)
          const gimages = await google.image(arguments.slice(1).join(' '), { safe: disablecommand });
          if (gimages.length === 0) return await client.reply(from, `Maaf, hasil pencarian tidak ditemukan`, id, true)
          for (let i = 0; i < 4; i++) {
            await client.sendImage(from, gimages[i].url, 'hasilgambar.jpg', `${i}\n*Judul sumber* : ${gimages[i].origin.title}\n*Website sumber* : ${gimages[i].origin.website}\n*Link gambar* : ${gimages[i].url}` ,id) 
          }
        }
        else if (arguments[0] == 'reverseimage'){
          client.reply(from, ind.wait() + `\n\n_Mendapatkan hasil dari Google Search..._`, id, true)
          if(isMedia && isImage || isQuotedImage){
            const encryptMedia = isQuotedImage ? quotedMsgId : id
            const mediaData = await client.downloadMedia(encryptMedia)
            const imageLink = await uploadImages(mediaData, `greverse.${sender.id}`)
            console.log(imageLink)
            const greverse = await google.search(imageLink, { ris: true });

            let greversehasil = '*Hasil Pencarian Google Reverse Image Search*\n\n'
            for (let i = 0; i < greverse.results.length; i++) {
              greversehasil += `${i}.\n*Judul* : ${greverse.results[i].title}\n*Deskripsi* : ${greverse.results[i].description}\n*Link* : ${greverse.results[i].url}\n\n`
            }
            await client.reply(from, greversehasil, id, true)
          } else if (!isImage && !isQuotedImage) {
            await client.reply(from, `_⚠️ Mohon kirim atau reply gambar yang ingin dicari, lalu berikan caption ${botPrefix}google reverseimage_ `, true)
          }
        }
        break

      case 'translate':   
        if (arguments.length === 0 && !quotedMsg) return client.reply(from, `Maaf, format pesan salah.\nSilahkan reply sebuah pesan dengan caption ${botPrefix}translate <kode_bahasa>\ncontoh ${botPrefix}translate id\n\nAtau dengan perintah ${botPrefix}translate <bahasa> | <teks>`, id, true)
        if (q.includes('|')){
          const texto = arg.split('|')[1]
          const languaget = arg.split(' |')[0]
          _function.translate(texto, languaget).then((result) => client.sendText(from, result)).catch(() => client.sendText(from, 'Error noreply, Kode bahasa salah.\n\n Silahkan cek kode bahasa disini\nhttps://github.com/vitalets/google-translate-api/blob/master/languages.js'))
          //translate(texto, {to: languaget}).then(res => {client.reply(from, res.text, id)}).catch(() => client.sendText(from, 'Error, Kode bahasa salah.\n\n Silahkan cek kode bahasa disini\nhttps://github.com/vitalets/google-translate-api/blob/master/languages.js'), true)
        } else { const quoteText = quotedMsg.body
          _function.translate(quoteText, arguments[0])
              .then((result) => client.sendText(from, result))
              .catch(() => client.sendText(from, 'Error reply, Kode bahasa salah.\n\n Silahkan cek kode bahasa disini\nhttps://github.com/vitalets/google-translate-api/blob/master/languages.js'))}
        //if (!quotedMsg) return client.reply(from, `Maaf, format pesan salah.\nSilahkan reply sebuah pesan dengan caption ${botPrefix}translate <kode_bahasa>\ncontoh ${botPrefix}translate id`, id, true)
        break

      case 'kbbi':
        if (arguments.length === 0) return client.reply(from, `Mengirim detail arti kbbi dari pencarian \n\nContoh : ${botPrefix}kbbi <pencarian>`, id, true);
        await client.reply(from, ind.wait(), id, true)
          _function.misc.kbbi(q)
          .then(async ({ lema, arti })=> {
              let kbbi = '------*KBBI*------'
              kbbi += `\n\n*Kata*: ${lema}\n\n`
              kbbi += `*Arti*: \n`
              for (let i = 0; i < arti.length; i++){
                kbbi += `➸ ${arti[i]}\n`
              }
              await client.reply(from, kbbi, id, true)
              console.log('Success sending KBBI details!')
	        })
          .catch(err => {
            client.reply(from, `Sepertinya kata tersebut tidak ditemukan, mohon coba kata lain`, id, true)
            console.log('Failed sending KBBI details!')
            console.log(err)
          })
        break

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
            
          })
            .catch(async (err) => {
              console.error(err)
              await client.reply(from, `Error!\nCoba lagi atau Lihat command ${botPrefix}waifu help`, id, true)
            })
        break

      case 'sauce':
        if (!isImage && !isQuotedImage) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : kirim sebuah gambar artwork yang ingin dicari sumber link nya lalu berikan caption ${botPrefix}sauce_`, id, true);
        if (isMedia && isImage || isQuotedImage) {
          await client.reply(from, ind.wait(), id, true)
          const encryptMedia = isQuotedImage ? quotedMsgId : id
          const mediaData = await client.downloadMedia(encryptMedia)
          try {
              const imageLink = await uploadImages(mediaData, `sauce.${sender.id}`)
              console.log('Searching for source...')
              console.log('---> Image link : ' + imageLink)
              const results = await saus(imageLink)
              let teks = ''
              for (let i = 0; i < results.length; i++) {
                  if (results[i].similarity < 80) {
                      teks += `${i}.\n*Link*: ${results[i].url}\n*Site*: ${results[i].site}\n*Author name*: ${results[i].authorName}\n*Author link*: ${results[i].authorUrl}\n*Similarity*: ${results[i].similarity}%\n*Low similarity!*\n\n`
                  } else {
                      teks += `${i}.\n*Link*: ${results[i].url}\n*Site*: ${results[i].site}\n*Author name*: ${results[i].authorName}\n*Author link*: ${results[i].authorUrl}\n*Similarity*: ${results[i].similarity}%\n\n`
                  }
              }
              await client.reply(from, teks, id, true)
                    .then(() => console.log('Source sent! '))
          } catch (err) {
              console.error(err)
              await client.reply(from, 'Error!', id, true)
          }
        } else {
          await client.reply(from, ind.wrongFormat(), id, true)
        }
        break

      case 'wait':
      case 'traceanime':
        if (!isImage && !isQuotedImage) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : kirim atau reply sebuah gambar screenshot yang ingin dicari sumber anime nya lalu berikan caption ${botPrefix}wait_`, id, true);
        if (isMedia && isImage || isQuotedImage){
          await client.reply(from, ind.wait(), id, true)
          const encryptMedia = isQuotedImage ? quotedMsgId : id
          //const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
          const mediaData = await client.downloadMedia(encryptMedia)
          //const mediatostr = mediaData.toString('base64')
          //const imageBase64 = `data:${_mimetype};base64,${mediatostr}`
          const imageLink = await uploadImages(mediaData, `wait.${sender.id}`)
          _function.weeaboo.wait(imageLink)
            .then(async (result) => {
              if (result.result && result.result.length <= 2) {
                return await client.reply(from, 'Anime not found! :(', id, true)
              } else {
                const {native, romaji, english} = result.result[0].anilist.title
                const { episode, similarity, video} = result.result[0]
                let teks = ''
                console.log(imageLink)
                teks += `*Anime Result*\n\n`
                console.log('Anime found, please wait')
                if (similarity < 0.85) {
                  teks += `*Title*: ${native}\n*Romaji*: ${romaji}\n*English*: ${english}\n*Episode*: ${episode}\n*Similarity*: ${(similarity * 100).toFixed(1)}%\nLow similiarity!. \n\nHasil merupakan asal tebak saja.`
                  client.reply(from, teks, id, true)
                } else {
                  teks += `*Title*: ${native}\n*Romaji*: ${romaji}\n*English*: ${english}\n*Episode*: ${episode}\n*Similarity*: ${(similarity * 100).toFixed(1)}%`
                  try {
                    await client.sendFile(from, video, `result.mp4`, null, id)
                    await client.reply(from, teks, id, true)
                      .then(() => console.log('Success sending anime source!'))
                  } catch (error) {
                    await client.reply(from, teks, id, true)
                    console.log('Video send error, trying without video')
                    console.log(error.stack)
                  }
                }
              }
            })
              .catch(async (err) => {
              console.error(err)
              await client.reply(from, 'Error!', id, true)
            })
          }
        break

      default:
        //let matching = closestMatch(command, _txt.menulist);
        client.reply(from, `Maaf, bot ini sedang dalam pengkodingan ulang dikarenakan matinya aplikasi yang mendasarkan bot ini. Kemungkinan command atau perintah yang anda masukkan belum atau tidak ditemukan \n\nSecara perlahan fitur akan dikembalikan. Terima kasih`, id, true)
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
