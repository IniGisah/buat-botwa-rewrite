const moment = require('moment');
const set = require('../settings');
const fs = require('fs-extra')
const config = require('../config.json')
const axios = require("axios").default;
const { translate } = require('bing-translate-api');
const client = require('nekos.life');
const neko = new client();
const sagiri = require('sagiri');
const saus = sagiri(config.nao, { results: 5 });
const sharp = require('sharp');
//const parseMilliseconds = require('parse-ms')
//const toMs = require('ms')
//const { spawn } = require('child_process')
const momentt = require('moment-timezone')
momentt.tz.setDefault('Asia/Jakarta').locale('id')
//const tanggal = momentt.tz('Asia/Jakarta').format('DD-MM-YYYY')
//const uaOverride = config.uaOverride
const { closestMatch } = require("closest-match");
const google = require('googlethis');
//const genshindb = require('genshin-db');
//const { getChart } = require('billboard-top-100');
//const { exec } = require("child_process");
const winkNLP = require( 'wink-nlp' );
const model = require( 'wink-eng-lite-web-model' );
var ffmpeg = require('fluent-ffmpeg');
//var ffmpeg = new FfmpegCommand();

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
//const { translate } = require('@vitalets/google-translate-api');
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
  const {from, body, sender} = message;
  const { formattedTitle, isGroup, contact, groupMetadata } = await client.getChatById(from);
  try {
    const { id, body, mimetype, type, t, from, sender, content, caption, author, quotedMsgId, isGroupMsg, isMedia, quotedMsgObj, mentionedJidList } = message;
    //const { pushname, formattedName } = sender || {}
    let pushname = sender?.pushname
    let formattedName = sender?.formattedName
    let quotedMsg = await client.getMessageById(quotedMsgId)

    const { ind } = require('../message/text/lang/')

    const botOwner = set.owner;
    const botGroup = set.support;
    const botPrefix = set.prefix;
    const botNumber = "62859106564106" + '@c.us';
    let isOwner, isAdmin, isGroupAdmins, isBotAdmin, isBanned, groupAdmins, Admins, checkUsername, checkBotUser
    
    //let isBotAdmin = groupMetadata ? groupMetadata.participants.find((res) => res.id === botNumber)?.isAdmin : undefined;

    const groupId = isGroupMsg ? groupMetadata.id._serialized : ''

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

    //global.voterslistfile = '/poll_voters_Config_' + chat.id + '.json'
    //global.pollfile = '/poll_Config_' + chat.id + '.json'

    //const blockNumber = await client.getBlockList()

    const validMessage = caption ? caption : body;
    if (!validMessage || validMessage[0] != botPrefix) return;

    const command = validMessage.trim().split(' ')[0].slice(1);
    const arguments = validMessage.trim().split(' ').slice(1);
    const arg = validMessage.substring(validMessage.indexOf(' ') + 1)
    const q = arguments.join(' ')
    //const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

    //const url = arguments.length !== 0 ? arguments[0] : ''
    // debug
    console.debug(color('green', '➜'), color('yellow', isGroup ? '[GROUP]' : '[PERSONAL]'), `${botPrefix}${command} | ${sender?.id} ${isGroup ? 'FROM ' + groupMetadata.subject : ''}`, color('yellow', moment().format()));

    //const allChats = await client.getAllChats();
    let commandlower = command.toLowerCase()
    switch (commandlower) {
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
        //console.log(quotedMsgId)
        //console.log(quotedMsg)
        if (quotedMsg){
          console.log(await client.getMessageById(quotedMsgId))
        } else {
          console.log(message)
        }
        break

      case 'debugchat':
        console.log(await client.getChatById(from))
        break

      case 'debuggrup':
        console.log(await client.getGroupAdmins(from))
        break

      case 'menu':
      case 'help':
        //await client.reply(from, `Maaf, bot ini sedang dalam pengkodingan ulang dikarenakan matinya aplikasi yang mendasarkan bot ini. Fitur yang ada pada list ini belum semuanya dikembalikan. Secara perlahan fitur akan dikembalikan\n\n\nJika ada fitur yang ingin digunakan namun belum ada, silahkan hubungi owner dengan perintah ${botPrefix}owner. Terima kasih`, id, true)
        await client.sendText(from, _txt.menu.join(''));
      break;

      case 'info':
        return await client.reply(from, _txt.info, id, true);

      case 'source':
        return await client.reply(from, _txt.source, id, true);

      case 'rules':
        return await client.reply(from, _txt.rules, id, true);
        break;

      case 'faq':
        return await client.reply(from, _txt.faq, id, true);
        break;

      case 'donate':
      case 'donasi':
        return await client.reply(from, _txt.donate, id, true);
        break;

      case 'sticker':
      case 'stiker':
        if (!isImage && !isQuotedImage) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : kirim atau reply sebuah gambar yang ingin dijadikan stiker lalu berikan caption ${botPrefix}stiker_`, id, true);
        const mediaData = isQuotedImage ? quotedMsgId : id
        let mediabuffstr = await client.downloadMedia(mediaData)
        sharp(Buffer.from(mediabuffstr.split(';base64,').pop(), 'base64'))
        .resize(500, 500, {
          fit: 'contain',
          background: {r:0, b:0, g:0, alpha:0}
        })
        .toFile(`./media/stiker.${id}.png`)
        .then(async data => {
          await client.sendImageAsSticker(from, `./media/stiker.${id}.png`);
          fs.unlink(`./media/stiker.${id}.png`, (err) => {
            if (err) {
                console.log(err)
            }
            console.log(`Delete File stiker.${id}.png successfully.`);
        })
        })
        
        break;

      case 'gifsticker':
      case 'gifstiker':
        if (!isVideo && !isQuotedVideo) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : kirim sebuah video pendek yang ingin dijadikan stiker lalu berikan caption ${botPrefix}gifstiker_`, id, true);
        const encryptMedia2 = isQuotedVideo ? quotedMsgId : id
        let buffstr = await client.downloadMedia(encryptMedia2)
        await saveFile(Buffer.from(buffstr.split(';base64,').pop(), 'base64'), `gifstiker.${sender.id}`)
        ffmpeg(`./media/gifstiker.${sender.id}.mp4`).format('gif').duration(15).aspect('1:1').size('512x512').autoPad().save(`./media/gifconvert.${sender.id}.gif`)
            .on('end', async function() {
              const stikerresult = await client.sendImageAsStickerGif(from, `./media/gifconvert.${sender.id}.gif`);
              console.log(stikerresult)
              /*
              fs.unlink(`./media/gifconvert.${sender.id}.gif`, (err) => {
                  if (err) {
                      console.log(err)
                  }
                  console.log(`Delete File gifconvert.${sender.id}.gif successfully.`);
              })
              */
            })
            .on('error', function(err) {
              console.log('an error ffmpeg happened: ' + err.message);
            });
        //const _mimetype2 = isQuotedVideo ? quotedMsg.mimetype : mimetype
        //const vidmediadata = await decryptMedia(encryptMedia2);
        //const vidb64 = `data:${_mimetype2};base64,${vidmediadata.toString('base64')}`;
        //await client.sendMp4AsSticker(from, vidb64, { fps: 10, startTime: `00:00:00.0`, endTime: `00:00:10.0`, loop: 0, crop:false});
        break;

      case 'join':
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}join <grup link>_`, id, true);
        const joinStatus = await client.joinGroup(arguments[0]);
        if (joinStatus === 406) return await client.reply(from, '_⚠️ Pastikan yang kamu masukkan adalah URL grup yang benar!_', id, true);
        if (joinStatus === 401) return await client.reply(from, '_⚠️ Bot Tidak dapat Join, karena baru-baru ini bot baru saja di kick dari grup tersebut!_', id, true);
        await client.reply(from, '_🚀 Meluncur! Bot berhasil masuk grup!_', id, true);
        break;

      case 'extract':
        if (!isImage && !isQuotedImage) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : reply sebuah gambar view once yang ingin diekstrak_`, id, true);
        const mediaDataExtract = isQuotedImage ? quotedMsgId : id
        await client.sendImageFromBase64(from, await client.downloadMedia(mediaDataExtract), `extract_${id}.jpg`);
		  break;

      case 'owner':
      case 'contact':
      case 'ownerbot':
        return await client.reply(from, '👋 Hai, kalo mau lapor atau req fitur bisa pc ke *https://wa.me/6285156132721*', id, true);
        break;

      case 'bc':
        if (!botOwner.includes(sender.id)) return await client.reply(from, ind.ownerOnly(), id, true);
        if (arguments.length < 1) return;
        const allChats = await client.listChats();
        await allChats.forEach(async (chat) => {
          await client.sendText(chat.id, arguments.join(' '));
        });
        return await client.reply(from, '_🟢 Berhasil Broadcast kesemua Chat List Bot!_', id, true);
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
        isOwner = groupMetadata.owner == sender?.id ? true : false
        Admins = await client.getGroupAdmins(from)  
        checkUsername = obj => obj._serialized === sender?.id;
        checkBotUser = obj => obj._serialized === botNumber;
        isAdmin = Admins.some(checkUsername)
        isBotAdmin = Admins.some(checkBotUser)
        if (!isBotAdmin) return await client.reply(from, '_⚠️ Perintah ini hanya dapat digunakan ketika *Bot berstatus Admin* di grup ini!_', id, true);
        if (!isGroup) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan didalam grup!_', id, true);
        if (isOwner) return await client.reply(from, '_⛔ Owner grup/Orang ganteng tidak dapat dikick!_', id, true);
        await client.reply(from, '_😏 Aku harap kamu tau apa yang kamu lakukan!_', id, true);
        await client.removeParticipant(from, sender.id);
        break;

      case 'add':
        if (!isGroup) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan didalam grup!_', id, true);
        Admins = await client.getGroupAdmins(from)  
        checkUsername = obj => obj._serialized === sender?.id;
        checkBotUser = obj => obj._serialized === botNumber;
        isAdmin = Admins.some(checkUsername)
        isBotAdmin = Admins.some(checkBotUser)
        if (arguments.length !== 1) client.reply(from, `_⚠️ Contoh Penggunaan perintah : ${botPrefix}add 62812....._`, id, true);
        if (!isBotAdmin) return await client.reply(from, '_⚠️ Perintah ini hanya dapat digunakan ketika *Bot berstatus Admin* di grup ini!_', id, true);
        const isNumberValid = await client.checkNumberStatus(arguments[0] + '@c.us');
        if (isNumberValid.status === 200)
          await client
            .addParticipant(from, `${arguments[0]}@c.us`)
            .then(async () => await client.reply(from, '_🎉 Berhasil menambahkan Member, Berikan ucapan Selamat datang!_', id), true)
            .catch(async (error) => await client.reply(from, '_🥺 Gagal menambahkan member! kemungkinan member sudah diblock oleh Bot! untuk unblockir silahkan DM ke *https://wa.me/6285156132721*_', id), true);
        break;

      case 'kick':
        Admins = await client.getGroupAdmins(from)  
        checkUsername = obj => obj._serialized === sender?.id;
        checkBotUser = obj => obj._serialized === botNumber;
        isAdmin = Admins.some(checkUsername)
        isBotAdmin = Admins.some(checkBotUser)
        if (!isGroup) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan didalam grup!_', id, true);
        if (!isAdmin) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan oleh *Admin* grup saja!_', id, true);
        if (mentionedJidList.length !== 1) return await client.reply(from, `_⚠️ Contoh Penggunaan perintah : ${botPrefix}kick @mention_`, id, true);
        if (!isBotAdmin) return await client.reply(from, '_⚠️ Perintah ini hanya dapat digunakan ketika *Bot berstatus Admin* di grup ini!_', id, true);
        const isKicked = await client.removeParticipant(from, mentionedJidList[0]);
        if (isKicked) return await client.reply(from, '_🎉 Berhasil Kick member Berikan Ucapan Selamat Tinggal!_', id, true);
        break;

      case 'disconnect':
      case 'kickbot':
      case 'leave':
        Admins = await client.getGroupAdmins(from)  
        checkUsername = obj => obj._serialized === sender?.id;
        isAdmin = Admins.some(checkUsername)
        if (!isGroup) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan didalam grup!_', id, true);
        if (!isAdmin) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan oleh *Admin* grup saja!_', id, true);
        client          
          .reply(from, '_👋 Terimakasih, atas kenangan selama ini yang kita lalui, kalau kamu rindu gpp masukin aku lagi ke grup kamu! aku akan selalu ada buat kamu!_', id)
          .then(async () => await client.leaveGroup(from))
          .catch((error) => console.log('kickbot error'));
        break;

      case 'promote':
        Admins = await client.getGroupAdmins(from)  
        checkUsername = obj => obj._serialized === sender?.id;
        checkBotUser = obj => obj._serialized === botNumber;
        isAdmin = Admins.some(checkUsername)
        isBotAdmin = Admins.some(checkBotUser)
        if (!isGroup) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan didalam grup!_', id, true);
        if (!isAdmin) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan oleh *Admin* grup saja!_', id, true);
        if (mentionedJidList.length !== 1) client.reply(from, `_⚠️ Contoh Penggunaan perintah : ${botPrefix}promote @mention_`, id, true);
        if (!isBotAdmin) return await client.reply(from, '_⚠️ Perintah ini hanya dapat digunakan ketika *Bot berstatus Admin* di grup ini!_', id, true);
        const isPromoted = await client.promoteParticipant(from, mentionedJidList[0]);
        if (isPromoted) return await client.reply(from, '_🎉 Berhasil promote member menjadi Admin/Pengurus Grup! Berikan Ucapan Selamat_', id, true);
        break;

      case 'demote':
        Admins = await client.getGroupAdmins(from)  
        checkUsername = obj => obj._serialized === sender?.id;
        checkBotUser = obj => obj._serialized === botNumber;
        isAdmin = Admins.some(checkUsername)
        isBotAdmin = Admins.some(checkBotUser)
        if (!isGroup) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan didalam grup!_', id, true);
        if (!isAdmin) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan oleh *Admin* grup saja!_', id, true);
        if (mentionedJidList.length !== 1) client.reply(from, `_⚠️ Contoh Penggunaan perintah : ${botPrefix}demote @mention_`, id, true);
        if (!isBotAdmin) return await client.reply(from, '_⚠️ Perintah ini hanya dapat digunakan ketika *Bot berstatus Admin* di grup ini!_', id, true);
        const isDemoted = await client.demoteParticipant(from, mentionedJidList[0]);
        if (isDemoted) return await client.reply(from, '_🎉 Berhasil demote Admin menjadi Member! Ucapkan Kasihan!_', id, true);
        break;

      case 'mystats':
        Admins = await client.getGroupAdmins(from)  
        checkUsername = obj => obj._serialized === sender?.id;
        isAdmin = Admins.some(checkUsername)
        isOwner = groupMetadata ? groupMetadata.participants.find((res) => res.id === sender?.id || '')?.isSuperAdmin : undefined;
        if (!isGroup) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan didalam grup!_', id, true);
        const senderPicture = sender.profilePicThumbObj.eurl ? sender.profilePicThumbObj.eurl : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
        await client.sendImage(from, senderPicture, formattedName, `_🎉 Group Member [ *${formattedTitle}* ]_\n\n_Nama : ${pushname ? pushname : 'Tidak Diketahui'}_\n_Owner Status : ${isOwner ? 'Ya' : 'Tidak'}_\n_Admin Status : ${isAdmin ? 'Ya' : 'Tidak'}_`, id);
        break;

      case 'profile':
      case 'profil':
      case 'me':
        groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        isGroupAdmins = groupAdmins.includes(sender?.id) || false
        isBanned = _ban.includes(sender?.id)
            if (quotedMsg) {
                const getQuoted = quotedMsgObj.sender.id
                const profilePic = await client.getProfilePicFromServer(getQuoted)
                const username = quotedMsgObj.sender.name
                const statuses = await client.getStatus(getQuoted)
                const benet = _ban.includes(getQuoted) ? 'Yes' : 'No'
                const adm = groupAdmins.includes(getQuoted) ? 'Yes' : 'No'
                const { status } = statuses
                if (profilePic === undefined) {
                    var pfp = errorImg
                } else {
                    pfp = profilePic
                }
                await client.sendImage(from, pfp, `${username}.jpg`, ind.profile(username, status, benet, adm), id)
            } else {
                const profilePic = await client.getProfilePicFromServer(sender.id)
                const username = pushname
                const statuses = await client.getStatus(sender.id)
                const benet = isBanned ? 'Yes' : 'No'
                const adm = isGroupAdmins ? 'Yes' : 'No'
                const { status } = statuses
                if (profilePic === undefined) {
                    var pfps = errorImg
                } else {
                    pfps = profilePic
                }
                await client.sendImage(from, pfps, `${username}.jpg`, ind.profile(username, status, benet, adm), id)
            }
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

      case 'stickertottext':
      case 'stickerteks':
      case 'stikerteks':
        let teksLink
        if (arguments.length < 1 && !quotedMsg) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}stikerteks <kalimat>_`, id, true);
        if (quotedMsg) {
          let teks = quotedMsg.content.trim().split(' ');
          teks.push(`-${quotedMsg.sender.pushname}`)
          teksLink = _function.tosticker(teks);
        } else {
          teksLink = _function.tosticker(arguments);
        }
        await client.sendImageAsSticker(from, teksLink);
        break

      case 'analisis':
      case 'sentiment':
        if (arguments.length < 1 && !quotedMsg) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}analisis <kalimat>, atau reply pesan yang ingin di analisis._`, id);
        if (isImage || isVideo || isQuotedImage || isQuotedVideo) {
          return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}analisis <kalimat>, atau reply pesan yang ingin di analisis._`, id)
        }
        const nlp = winkNLP( model );
        const its = nlp.its;
        let teksanalisis = ''
        if (quotedMsg){
          //let quotedMsg = await client.getMessageById(quotedMsgId)
          teksanalisis = quotedMsg.content.trim().split(' ');
        } else {
          teksanalisis = arguments.join(' ')
        }
        console.log(`translate "${teksanalisis}" to eng`)
        let hasil = await translate(teksanalisis, null, 'en')
        const doc = nlp.readDoc(hasil.translation);
        let hasilraw = doc.out(its.sentiment)
        let hasilanalisis
        if (hasilraw >= -1 && hasilraw < 0){
          hasilanalisis = "Negatif"
        } else if (hasilraw == 0){
          hasilanalisis = "Netral"
        } else if (hasilraw > 0 && hasilraw <= 1){
          hasilanalisis = "Positif"
        } else {
          return await client.reply(from, "Sentiment error!", id)
        }

        await client.reply(from, `*Hasil analisis*
Teks : ${teksanalisis}
Translate : ${hasil.translation}
Nilai hasil : ${hasilraw}
Sentiment : *${hasilanalisis}*`, id)
        break


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

      case 'quran':
      case 'quranayat':
        if (arguments.length != 2) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}quranayat <surat> <ayat>_\n\nContoh Al-Fatihah ayat 5 : \n${botPrefix}quranayat alfatihah 5\n\nJika tidak ditemukan, gunakan angka saja, contoh Al-Lail ayat 3\n${botPrefix}quranayat 92 3`, id, true);
        try {
          const ayah = await _function.quran.ayat(arguments);
          await client.reply(from, ayah, id, true);
        } catch (error) {
          await client.reply(from, `Ayat Surat Al-Quran tidak ditemukan!`, id, true);
        }
        break;
      
      case 'quransurat':
      case 'quransurah':
        if (arguments.length != 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}quransurah <surah>_\n\nContoh Al-Fatihah : ${botPrefix}quransurah alfatihah\nJika tidak ditemukan, gunakan angka saja, contoh Al-Qari'ah\n${botPrefix}quransurat 101`, id, true);
        try {
          const surah = await _function.quran.surah(arguments);
          await client.reply(from, surah, id, true);
        } catch (error) {
          await client.reply(from, `Ayat Surat Al-Quran tidak ditemukan!`, id, true);
        }
        break;

      case 'murotal':
      case 'murrotal':
      case 'murottal':
        if (arguments.length != 2) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}murrotal <surat> <ayat>_\n\nContoh Al-Fatihah ayat 5 : \n${botPrefix}murrotal alfatihah 5\n\nJika tidak ditemukan, gunakan angka saja, contoh Al-Lail ayat 3\n${botPrefix}murrotal 92 3`, id, true);
        try {
          const murottalAudio = await _function.quran.murottal(arguments);
          await client.sendPtt(from, murottalAudio, id);
        } catch (error) {
          await client.reply(from, `Ayat Surat Al-Quran tidak ditemukan!`, id, true);
        }
        break;

      case 'tafsir':
        if (arguments.length != 2) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}tafsir <surat> <ayat>_\n\nContoh Al-Fatihah ayat 5 : \n${botPrefix}tafsir alfatihah 5\n\nJika tidak ditemukan, gunakan angka saja, contoh Al-Lail ayat 3\n${botPrefix}tafsir 92 3`, id, true);
        const tafsir = await _function.quran.tafsir(arguments);
        await client.reply(from, tafsir, id, true);
        break;

      case 'jadwalsholat':
      case 'jadwalsolat':
            if (!q) return await client.reply(from, ind.wrongFormat(), id, true)
            await client.reply(from, ind.wait(), id, true)
            _function.misc.jadwalSholat(q)
                .then((data) => {
                    data.map(async ({isya, subuh, dzuhur, ashar, maghrib, terbit}) => {
                        const x = subuh.split(':')
                        const y = terbit.split(':')
                        const xy = x[0] - y[0]
                        const yx = x[1] - y[1]
                        const perbandingan = `${xy < 0 ? Math.abs(xy) : xy} jam ${yx < 0 ? Math.abs(yx) : yx} menit`
                        const msg = `Jadwal sholat untuk ${q} dan sekitarnya ( *${tanggal}* )\n\nDzuhur: ${dzuhur}\nAshar: ${ashar}\nMaghrib: ${maghrib}\nIsya: ${isya}\nSubuh: ${subuh}\n\nDiperkirakan matahari akan terbit pada pukul ${terbit} dengan jeda dari subuh sekitar ${perbandingan}`
                        await client.reply(from, msg, id, true)
                        console.log('Success sending jadwal sholat!')
                    })
                })
                .catch(async (err) => {
                    console.error(err)
                    await client.reply(from, 'Kota tidak ditemukan!', id, true)
                })
        break

      case 'hadis': // irham01
      case 'hadees':
          if (arguments.length <= 1) return await client.reply(from, ind.hadis(), id, true)
          await client.reply(from, ind.wait(), id, true)
          console.log('argumen 1 : ' + arguments[0]+ ' argumen 2 : ' + arguments[1])
          try {
              if (arguments[0] === 'darimi') {
                  const hdar = await axios.get(`https://api.hadith.gading.dev/books/darimi/${arguments[1]}`)
                  await client.sendText(from, `${hdar.data.data.contents.arab}\n${hdar.data.data.contents.id}\n\n*H.R. Darimi*`, id)
              } else if (arguments[0] === 'ahmad') {
                  const hmad = await axios.get(`https://api.hadith.gading.dev/books/ahmad/${arguments[1]}`)
                  await client.sendText(from, `${hmad.data.data.contents.arab}\n${hmad.data.data.contents.id}\n\n*H.R. Ahmad*`, id)
              } else if (arguments[0] === 'bukhari') {
                  const hbukh = await axios.get(`https://api.hadith.gading.dev/books/bukhari/${arguments[1]}`)
                  await client.sendText(from, `${hbukh.data.data.contents.arab}\n${hbukh.data.data.contents.id}\n\n*H.R. Bukhori*`, id)
              } else if (arguments[0] === 'muslim') {
                  const hmus = await axios.get(`https://api.hadith.gading.dev/books/muslim/${arguments[1]}`)
                  await client.sendText(from, `${hmus.data.data.contents.arab}\n${hmus.data.data.contents.id}\n\n*H.R. Muslim*`, id)
              } else if (arguments[0] === 'malik') {
                  const hmal = await axios.get(`https://api.hadith.gading.dev/books/malik/${arguments[1]}`)
                  await client.sendText(from, `${hmal.data.data.contents.arab}\n${hmal.data.data.contents.id}\n\n*H.R. Malik*`, id)
              } else if (arguments[0] === 'nasai') {
                  const hnas = await axios.get(`https://api.hadith.gading.dev/books/nasai/${arguments[1]}`)
                  await client.sendText(from, `${hnas.data.data.contents.arab}\n${hnas.data.data.contents.id}\n\n*H.R. Nasa'i*`, id)
              } else if (arguments[0] === 'tirmidzi') {
                  const htir = await axios.get(`https://api.hadith.gading.dev/books/tirmidzi/${arguments[1]}`)
                  await client.sendText(from, `${htir.data.data.contents.arab}\n${htir.data.data.contents.id}\n\n*H.R. Tirmidzi*`, id)
              } else if (arguments[0] === 'ibnumajah') {
                  const hibn = await axios.get(`https://api.hadith.gading.dev/books/ibnu-majah/${arguments[1]}`)
                  await client.sendText(from, `${hibn.data.data.contents.arab}\n${hibn.data.data.contents.id}\n\n*H.R. Ibnu Majah*`, id)
              } else if (arguments[0] === 'abudaud') {
                  const habud = await axios.get(`https://api.hadith.gading.dev/books/abu-daud/${arguments[1]}`)
                  await client.sendText(from, `${habud.data.data.contents.arab}\n${habud.data.data.contents.id}\n\n*H.R. Abu Daud*`, id)
              } else {
                  await client.sendText(from, ind.hadis(), id)
              }
          } catch (err) {
              console.error(err)
              await client.reply(from, 'Error!', id, true)
          }
      break

      case 'p':
      case 'spam':
        if (!isGroup) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan didalam grup!_', id, true);
        const allMembers = groupMetadata.participants.map((member) => `@${member.id.user}`);
        if ( groupMetadata.desc && groupMetadata.desc.includes("#noping") ) 
        { await client.sendText(from, '_*⚠️ Gaboleh spam disini yak*_') } 
        else {
          await client.sendMentioned(from, `_*Summon*_\n\n${allMembers.join('\n')}\n`, groupMetadata.participants.map((member) => `${member.id.user}`)); }
        break;

      case 'gay':
        if (mentionedJidList.length > 0 || arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah: ${botPrefix}gay <nama>_`, id, true);
        const gayPercentage = Math.floor(Math.random() * 100);
        await client.reply(from, `_👬🏻 Tingkat gay *${arguments.join(' ')}* sebesar ${gayPercentage}%_`, id, true);
        break;

      case 'gila':
        if (mentionedJidList.length > 0 || arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah: ${botPrefix}gila <nama>_`, id, true);
        const gilaPercentage = Math.floor(Math.random() * 100);
        await client.reply(from, `_👬🏻 Tingkat gila *${arguments.join(' ')}* sebesar ${gilaPercentage}%_`, id, true);
        break;

      case 'brainly':
        if (arguments.length < 1) return client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}brainly <pertanyaan>_`, id, true);
        const getBrainly = await _function.brainly(arguments.join(' '));
        await client.reply(from, getBrainly, id, true);
        break;

      case 'bucin':
        const katabucin = await _function.bucin();
        await client.reply(from, katabucin, id, true);
        break;

      case 'jodoh':
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah: ${botPrefix}jodoh <nama kamu>&<nama seseorang>_`, id, true);
        const jodohSplit = arguments.join(' ').split('&');
        if (jodohSplit.length < 2) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah: ${botPrefix}jodoh <nama kamu>&<nama seseorang>_`, id, true);
        const jodohPersentase = Math.floor(Math.random() * 100);
        await client.reply(from, `_💖 Persentase kecocokan ${jodohSplit[0]} & ${jodohSplit[1]} sebesar ${jodohPersentase}_`, id, true);
        break;

      case 'anime':
        if (arguments.length < 1) return await client.reply(from, `_Penggunaan : ${botPrefix}anime <judul>_`, id, true);
        const getAnime = await _function.animesearch(arguments.join(' '));
        if (!getAnime) return await client.reply(from, `_*Error!*_\nAnime tidak ditemukan `, id, true)
        await client.sendImage(from, getAnime.picUrl, `${t}_${sender.id}.jpg`, getAnime.caption, id);
        break;

      case 'lyrics':
      case 'lirik':
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}lirik <judul lagu>_`, id, true);
        const getLyrics = await _function.lirik(arguments.join(' '));
        if (!getLyrics) return await client.reply(from, `_🥺 Lirik *${arguments.join(' ')}* Tidak Ditemukan!_`, id, true);
        await client.reply(from, getLyrics, id, true);
        break;

      case 'short':
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}short <url/link yang ingin di perkecil>_`, id, true);
        const getShortener = await _function.short(arguments[0]);
        await client.reply(from, `${getShortener}`, id, true);
        break;

      case 'google':
        return await client.reply(from, "Maaf, untuk saat ini command google tidak berfungsi, dikarenakan aplikasi pencarian sedang rusak.")
        const gmodes = ['search', 'image', 'reverseimage']
        if (arguments.length <= 1 || arguments[0] == 'help'){
          return await client.reply(from, `*Fitur Pencarian Google*\n\n_Untuk mencari dengan Google_ : ${botPrefix}google search <judul>\n_Untuk mencari gambar_ : ${botPrefix}google image <judul>\n_Untuk mencari hasil google dengan gambar_ : kirim atau reply gambar yang ingin dicari, lalu berikan caption ${botPrefix}google reverseimage`, id, true)
        }
        else if (arguments[0] == 'search'){
         await client.reply(from, ind.wait() + `\n\n_Mendapatkan hasil dari Google Search..._`, id)
          const gres = await google.search(arguments.slice(1).join(' '), {
            page: 0,
            safe: disablecommand,
          });
          //console.log(gres);
          let ghasil = '*Hasil Pencarian Google*\n\n'
          if (gres.hasOwnProperty("did_you_mean") && gres?.did_you_mean != null){
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
        } else {
          return await client.reply(from, `*Fitur Pencarian Google*\n\n_Untuk mencari dengan Google_ : ${botPrefix}google search <judul>\n_Untuk mencari gambar_ : ${botPrefix}google image <judul>\n_Untuk mencari hasil google dengan gambar_ : kirim atau reply gambar yang ingin dicari, lalu berikan caption ${botPrefix}google reverseimage`, id, true)
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

      case 'ytmp3':
      case 'musik':
      case 'music':
        await client.reply(from, "Fitur ini memerlukan resource yang berat, dimohon untuk tidak menspam command ini", id, true);
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}music <title> / <url>_`, id, true);
        //if (ytwait == true) return await client.reply(from, '_⚠️ Mohon menunggu command music sebelumnya selesai diupload terlebih dahulu_', id, true);
        const musicLink2 = await _function.youtube.youtubeMusic(arguments.join(' '));
        if (!musicLink2) return await client.reply(from, '_⚠️ Pastikan music yang anda inginkan dibawah 10 menit!_', id, true);
        try {
          /*
            if (musicLink2.result.error == true) {
              console.log(musicLink2.result)
              return await client.reply(from, `⚠️ Error ! \n\nMessage error : \n${musicLink2.result.message}`,id, true)
            }
            */
            await client.reply(from, ind.wait() + "\nMusik sedang diupload...", id, true)
            //const mp3url = musicLink2.result.file;
            const mp3url = musicLink2.link2;
            const judul = musicLink2.title;
            const thumb = musicLink2.thumbnail;
            const durasi = musicLink2.duration;

            var menit = Math.floor(durasi / 60);
            var detik = durasi - menit * 60;

            const caption = `-------[ *Detail musik* ]-------\n\nJudul : ${judul}\nDurasi : ${menit} menit ${detik} detik`
            await client.sendImage(from, thumb, "thumb.jpg", caption, id)
            await _function.misc.downloadFile(mp3url, `./media/ytmusic.${sender.id}.opus`)
            ffmpeg(`./media/ytmusic.${sender.id}.opus`).audioCodec('libmp3lame').format('mp3').save(`./media/ytmusicconvert.${sender.id}.mp3`)
            .on('end', async function() {
              await client.sendFile(from, `./media/ytmusicconvert.${sender.id}.mp3`);
              fs.unlink(`./media/ytmusicconvert.${sender.id}.mp3`, (err) => {
                  if (err) {
                      console.log(err)
                  }
                  console.log(`Delete File ytmusicconvert.${sender.id}.mp3 successfully.`);
              })
              fs.unlink(`./media/ytmusic.${sender.id}.opus`, (err) => {
                if (err) {
                    console.log(err)
                }
                console.log(`Delete File ytmusicconvert.${sender.id}.mp3 successfully.`);
            })
            })
            .on('error', function(err) {
              console.log('an error ffmpeg happened: ' + err.message);
            });
            
            //await client.reply(from, `⚠️ Error !\nPastikan music yang anda inginkan dibawah 5 menit!\n\nMessage error : \n${musicLink.result.message}`, id, true);
        } catch (error) {
          await client.reply(from, `Sepertinya musik tidak bisa di upload, mon maap 🙏, silahkan gunakan perintah ${botPrefix}ytmp4 sebagai alternatif download video`, id, true);
          //console.log("music download error " + musicLink);
          console.log(error.stack);
        }
        break;

      
      case 'ytmp4':
        await client.reply(from, "Fitur ini memerlukan resource yang berat, dimohon untuk tidak menspam command ini\n\nCommand video ini membutuhkan waktu yang lama pada saat upload, mohon menunggu 3-6 menit", id, true);
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}ytmp4 <title> / <url>_`, id, true);
        //if (ytwait == true) return await client.reply(from, '_⚠️ Mohon menunggu command music/video sebelumnya selesai diupload terlebih dahulu_', id, true);
        const videoLink = await _function.youtube.youtubeVideo(arguments.join(' '));
        if (!videoLink) return await client.reply(from, '_⚠️ Pastikan video yang anda inginkan dibawah 10 menit!_', id, true);
        try {
          //if (videoLink.result.error == true){
          //   return await client.reply(from, `⚠️ Error ! \n\nMessage error : \n${videoLink.result.message}`, id, true);
          //} else {
            await client.reply(from, ind.wait()+ "\nVideo sedang diupload...", id, true)
            //const mp4url = musicLink2.result.file;
            const mp4url = videoLink.link2;
            const judul = videoLink.title;
            const thumb = videoLink.thumbnail;
            const durasi = videoLink.duration;

            var menit = Math.floor(durasi / 60);
            var detik = durasi - menit * 60;

            const caption = `-------[ *Detail Video* ]-------\n\nJudul : ${judul}\nDurasi : ${menit} menit ${detik} detik`

            await client.sendImage(from, thumb, "thumb.jpg", caption, id)
            await client.sendFile(from, mp4url);
          //}
        } catch (error) {
          await client.reply(from, "Sepertinya musik tidak bisa di upload, mon maap ", id, true);
          //console.log("music download error " + musicLink);
          console.log(error.stack);
        }
        break;

      case 'tiktok':
        if (arguments.length < 1 || !isUrl(arguments.join(' '))) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}tiktok *link*_`, id, true);
        await client.reply(from, ind.wait()+ "\nVideo sedang diupload...", id, true)
        let mediatesturl = await _function.mediadown(arguments.join(' '))
        //await _function.misc.downloadFile(`https://shailendramaurya.github.io/racoon/?url=${arguments.join(' ')}`, `./media/tiktok.${sender.id}.mp4`)
        console.log(mediatesturl)
        await client.sendFile(from, mediatesturl, false)
        break
        
      case 'wikipedia':
      case 'wiki':
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}wiki <keywords>_`, id, true);
        try {
          const getWiki = await _function.wiki.wiki(arguments.join(' '));
          if (getWiki.picUrl === undefined) {
            await client.sendText(from, getWiki.caption)
          } else {
            await client.sendImage(from, getWiki.picUrl, `${t}_${sender.id}.jpg`, getWiki.caption, id);
          }
          break;
        } catch (err){
          console.log(err)
          return await client.reply(from, `_⚠️ *${arguments.join(' ')}* pada Wikipedia tidak ditemukan_`, id, true);
        }
      
      case 'imagequote':
        const getImagequote = await _function.imgquote();
        await client.sendImage(from, getImagequote, `${t}_${sender.id}.jpg`, '', id);
        break;

      case 'roll':
        const rollNumber = Math.floor(Math.random() * (6 - 1) + 1);
        await client.sendImageAsSticker(from, `https://www.random.org/dice/dice${rollNumber}.png`);
        break;

      case 'weather':
      case 'cuaca':
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}cuaca <nama kota>_`, id, true);
        const getWeather = await _function.weather(arguments.join(' '));
        await client.reply(from, getWeather, id, true);
        break;

      case 'movie':
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}movie <judul>_`, id, true);
        const getMovie = await _function.movie(arguments.join(' '));
        if (!getMovie) return await client.reply(from, `_⚠️ ${arguments.join(' ')} Tidak ditemukan!_`, id, true);
        await client.sendImage(from, getMovie.moviePicture, `${t}_${sender.id}.jpeg`, getMovie.movieCaption, id);
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

      case 'halo':
        await client.sendPtt(from, './mediapreload/haloo.mp3', "halo.mp3", "Haloo", null, null, true);
        await client.sendImageAsSticker(from, 'https://i.ibb.co/StZTdND/haloo.png');
        await client.sendImageAsSticker(from, 'https://i.ibb.co/PNCvDNJ/halo2.jpg');
        break;

      case 'asep':
        await client.sendImageAsSticker(from, 'https://i.ibb.co/2yytWMt/asep1.png');
        await client.sendImageAsSticker(from, 'https://i.ibb.co/Nt1qc67/asep2.png');
        break;

      case 'tabah':
        await client.sendImageAsSticker(from, 'https://i.ibb.co/Xy5YQ9H/tabah1.jpg');
        await client.sendImageAsSticker(from, 'https://i.ibb.co/yS2zpFt/tabah2.jpg');
        break;

      case 'lutelat':
        await client.sendImageAsSticker(from, 'https://i.ibb.co/Y2mnHhm/lotelat.jpg');
        await client.sendPtt(from, './mediapreload/telat.mp3', "telat.mp3", "telaat", null, null, true);
        break;

      case 'bayu':
        await client.sendImageAsSticker(from, 'https://i.ibb.co/pK5Qs4J/bayu1.jpg');
        await client.sendImageAsSticker(from, 'https://i.ibb.co/kDfVq4h/bayu2.jpg');
        break;

      case 'payoy':
        await client.sendImageAsSticker(from, 'https://i.ibb.co/cxNvqz7/payoy.jpg');
        await client.sendImageAsSticker(from, 'https://i.ibb.co/cxNvqz7/payoy.jpg');
        await client.sendImageAsSticker(from, 'https://i.ibb.co/r6phywr/payoy2.jpg');
        break;

      case 'teja':
        await client.sendImageAsSticker(from, 'https://i.ibb.co/M5gfvfQ/teja1.jpg');
        await client.sendImageAsSticker(from, 'https://i.ibb.co/VSn3d8k/teja2.png');
        break;
      
      case 'indihome':
        await client.sendPtt(from, './mediapreload/indihome.mp3', "halo.mp3", "Haloo", null, null, true);
        await client.sendImageAsSticker(from, 'https://i.ibb.co/k8xwK8s/image.png');
        break;

      case 'palpale':
        await client.sendPtt(from, './mediapreload/pale.mp3', "halo.mp3", "Haloo", null, null, true);
        break;

      case 'yamete':
        await client.sendPtt(from, './mediapreload/masukin.mp3', "halo.mp3", "Haloo", null, null, true);
        break;
      
      case 'papepap':
        await client.sendPtt(from, './mediapreload/pap.mp3', "halo.mp3", "Haloo", null, null, true);
        break;

      case 'prank':
        await client.sendPtt(from, './mediapreload/prank.mp3', "halo.mp3", "Haloo", null, null, true);
        break;

      case 'goblok':
        await client.sendPtt(from, './mediapreload/goblok.mp3', "halo.mp3", "Haloo", null, null, true);
        break;

      case 'anjing':
        await client.sendPtt(from, './mediapreload/anjing.mp3', "halo.mp3", "Haloo", null, null, true);
        break;

      case 'cangkul':
        await client.sendPtt(from, './mediapreload/cangkul.mp3', "halo.mp3", "Haloo", null, null, true);
        break;
      
      case 'otak':
        await client.sendPtt(from, './mediapreload/otak.mp3', "halo.mp3", "Haloo", null, null, true);
        break;

      case 'bangsat':
        await client.sendPtt(from, './mediapreload/bangsat.mp3', "halo.mp3", "Haloo", null, null, true);
        break;
      
      case 'sange':
        await client.sendPtt(from, './mediapreload/sange.mp3', "halo.mp3", "Haloo", null, null, true);
        break;

      case 'failed':
        await client.sendPtt(from, './mediapreload/failed.mp3', "halo.mp3", "Haloo", null, null, true);
        break;

      case 'demituhan':
        await client.sendPtt(from, './mediapreload/demituhan.mp3', "halo.mp3", "Haloo", null, null, true);
        break;
      
      case 'asede':
      case 'asade':
        await client.sendPtt(from, './mediapreload/asade.mp3', "halo.mp3", "Haloo", null, null, true);
        break;

      case 'wikawika':
        await client.sendPtt(from, './mediapreload/wikawika.mp3', "halo.mp3", "Haloo", null, null, true);
        break;

      case 'panikga':
        await client.sendPtt(from, './mediapreload/panikga.mp3', "halo.mp3", "Haloo", null, null, true);
        break;
      
      case 'yntkts':
      case 'ygtkts':
      case 'yntkns':
        await client.sendPtt(from, './mediapreload/yntkts.mp3', 'yntkts.mp3', 'yntkts', null, null, true);
        break;

      case 'assalamualaikum':
      case 'asalamualaikum':
      case 'salam':
        await client.sendPtt(from, './mediapreload/salam.mp3', "halo.mp3", "Haloo", null, null, true);
        break;

      case 'removebg':
        if (!isImage && !isQuotedImage) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : kirim atau reply sebuah gambar yang ingin dihapus background nya lalu berikan caption ${botPrefix}removebg_`, id, true);
        if (isMedia && isImage || isQuotedImage){
          await client.reply(from, ind.wait(), id, true)
          const encryptMedia = isQuotedImage ? quotedMsg : message
          //const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
          //const mediaData = await decryptMedia(encryptMedia, uaOverride)
          //const mediatostr = mediaData.toString('base64')
          //const imageBase64 = `data:${_mimetype};base64,${mediatostr}`
          const imageLink = await uploadImages(client.downloadMedia(encryptMedia), `removebg.${sender.id}`)
          await _function.misc.downloadFile(`https://api.akuari.my.id/other/removebg2?link=${imageLink}`, `./media/removebg.${sender.id}.png`)
          await client.sendImage(from, `./media/removebg.${sender.id}.png`)
          await client.sendFile(from, `./media/removebg.${sender.id}.png`, '', '', null, null, null, true)
        }
        break

      case 'tafsirmimpi':
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}tafsirmimpi <pencarian>_`, id, true);
        _function.akuariapi.tafsirmimpi(arguments.join(' '))
          .then(async ({hasil}) => {
            await client.reply(from, `*Pencarian tafsir mimpi* : ${arguments.join(' ')}\n\n${hasil}`, id, true)
          })
          .catch(err => {
            console.log(err)
            client.reply(from, `Sepertinya kata tersebut tidak ditemukan, mohon coba kata lain`, id, true)
          })
        break
      
      case 'ramalanjodoh':
        if (arguments.length < 1 && arguments.length > 2) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}ramalanjodoh <nama> <jodoh>_`, id, true);
        _function.akuariapi.ramalanjodoh(arguments[0], arguments[1])
          .then(async ({hasil}) => {
            await client.sendText(from, `_*Ramalan Jodoh*_\n\n*Nama* : ${arguments[0]}\n*Pasangan* : ${arguments[1]}\n\n*Positif* : ${hasil.positif}\n*Pesan* : ${hasil.negatif}`)
          })
          .catch(err => {
            console.log(err)
            client.reply(from, `_Request Error!_ \nMohon coba sesaat lagi`, id, true)
          })
        break

      case 'ramalantgljadian':
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}ramalantgljadian <tanggal 'DD-MM-YYYY' : 21-09-2021>_`, id, true);
        _function.akuariapi.ramalantgljadian(arguments.join(' '))
          .then(async ({hasil}) => {
            await client.sendText(from, `_*Ramalan Makna Tanggal Jadian*_\n${hasil.substring(hasil.indexOf(";") + 1)}`)
          })
          .catch(err => {
            console.log(err)
            client.reply(from, `_Request Error!_ \nMohon coba sesaat lagi`,id, true)
          })
        break
      
      case 'ramalantanggal':
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}ramalantanggal <tanggal 'DD-MM-YYYY' : 21-09-2021>_`, id, true);
        _function.akuariapi.ramalantgl(arguments.join(' '))
          .then(async ({hasil}) => {
            await client.sendText(from, `_*Ramalan Tanggal*_\n${hasil.substring(hasil.indexOf(";") + 1)}`)
          })
          .catch(err => {
            console.log(err)
            client.reply(from, `_Request Error!_ \nMohon coba sesaat lagi`,id, true)
          })
        break

      case 'artinama':
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}artinama <nama>_`, id, true);
        _function.akuariapi.artinama(arguments.join(' '))
          .then(async (hasil) => {
            await client.sendText(from, `_*Arti Nama *_\n${hasil.substring(hasil.indexOf(";") + 1)}`)
          })
          .catch(err => {
            console.log(err)
            client.reply(from, `_Request Error!_ \nMohon coba sesaat lagi`,id, true)
          })
        break

      case 'faktaunik':
        //if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}artinama <nama>_`, id, true);
        _function.akuariapi.faktaunik()
          .then(async ({hasil}) => {
            await client.sendText(from, `*Fakta Unik Random*\n\n_"${hasil}"_`)
          })
          .catch(err => {
            console.log(err)
            client.reply(from, `_Request Error!_ \nMohon coba sesaat lagi`,id, true)
          })
        break

      case 'infogempa':
        await client.reply(from, ind.wait(), id, true)
        _function.akuariapi.gempa()
          .then(async ({result}) => {
            await client.sendFile(from, result.image, 'infogempa.jpg', `_*Info Gempa Terbaru*_\n\n*Tanggal* : ${result.tanggal}\n*Jam* : ${result.jam}\n*Lokasi* : \n  Lintang: ${result.lintang}\n  Bujur: ${result.bujur}\n*Magnitude* : ${result.magnitude}\n*Kedalaman* : ${result.kedalaman}\n*Potensi* : ${result.potensi}\n*Wilayah* : ${result.wilayah}`)
          })
          .catch(err => {
            console.log(err)
            client.reply(from, `_Request Error!_ \nMohon coba sesaat lagi`,id, true)
          })
        break

      case 'asahotak':
        _function.akuariapi.asahotak()
          .then(async ({hasil}) => {
            let idasah = await client.sendText(from, `*Soal Asah Otak*\n\nSoal : ${hasil.soal}`)
            await new Promise(resolve => setTimeout(resolve, 30000));
            await client.reply(from, `*Jawaban Asah Otak*\n\n${hasil.jawaban}`, idasah, true)
          })
          .catch(err => {
            console.log(err)
            client.reply(from, `_Request Error!_ \nMohon coba sesaat lagi`,id, true)
          })
        break

      case 'tebakgambar':
        await client.reply(from, ind.wait(), id, true)
        _function.akuariapi.tebakgambar()
          .then(async ({img, jawaban}) => {
            let idtebak = await client.sendImage(from, img, 'tebakgambar.jpg', `*Soal Tebak Gambar*`)
            await new Promise(resolve => setTimeout(resolve, 60000));
            await client.reply(from, `*Jawaban Tebak Gambar*\n\n${jawaban}`, idtebak.id, true)
          })
          .catch(err => {
            console.log(err)
            client.reply(from, `_Request Error!_ \nMohon coba sesaat lagi`,id, true)
          })
        break

      case 'hilih':
        if (arguments.length < 1 && !quotedMsg) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}hilih <kalimat>_`, id, true);
        if (quotedMsg) {
          _function.akuariapi.hilih(quotedMsg.body)
          .then(async ({message}) => {
            await client.reply(from, message, id, true)
          })
          .catch(err => {
            console.log(err)
            client.reply(from, `_Request Error!_ \nMohon coba sesaat lagi`,id , true)
          })
        } else {
          _function.akuariapi.hilih(arguments.join(' '))
          .then(async ({message}) => {
            await client.reply(from, message, id, true)
          })
          .catch(err => {
            console.log(err)
            client.reply(from, `_Request Error!_ \nMohon coba sesaat lagi`,id, true)
          })
        }
        break

      case 'aichatgpt':
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}aichatgpt <kalimat>_`, id, true);
        await client.reply(from, ind.wait()+ "\nRespon sedang diproses...", id, true)
        _function.akuariapi.chatgpt(arguments.join(' '))
          .then(async (hasil) => {
            await client.sendText(from, `_*Respon ChatGPT*_\n\nQuery : ${arguments.join(' ')}\n\n${hasil.respon}`)
          })
          .catch(err => {
            console.log(err)
            client.reply(from, `_Request Error!_ \nMohon coba sesaat lagi`,id, true)
          })
        break

      case 'aichatgoogle':
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}aichatgoogle <kalimat>_`, id, true);
        await client.reply(from, ind.wait()+ "\nRespon sedang diproses...", id, true)
        _function.akuariapi.googlebard(arguments.join(' '))
          .then(async (hasil) => {
            await client.sendText(from, `_*Respon Google Bard*_\n\nQuery : ${arguments.join(' ')}\n\n${hasil.respon}`)
          })
          .catch(err => {
            console.log(err)
            client.reply(from, `_Request Error!_ \nMohon coba sesaat lagi`,id, true)
          })
      break

      case 'qrcode':
        if (arguments.length < 1 && !quotedMsg) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}hilih <kalimat>_`, id, true);
        await _function.misc.downloadFile(`https://api.akuari.my.id/other/qrcode?text=${quotedMsg ? quotedMsg.body : arguments.join(' ')}`, `./media/qrcode.${sender.id}.png`)
        await client.sendImage(from, `./media/qrcode.${sender.id}.png`)
        break

      case 'neko':
        console.log('Getting neko image...')
        await client.reply(from, ind.wait(), id)
        await client.sendFile(from, (await neko.neko()).url)
          .then(() => console.log('Success sending neko image!'))
          .catch(async (err) => {
            console.error(err)
            await client.reply(from, 'Error!', id, true)
          })
        break

      case 'animewall':
        //if (disablecommand) return await client.reply(from, "_Sementara fitur dimatikan, dikarenakan tercampurnya library sfw dengan nsfw_", id, true)
        console.log('Getting wallpaper image...')
        await client.reply(from, ind.wait(), id)
        await client.sendFile(from, (await neko.wallpaper()).url)
          .then(() => console.log('Success sending wallpaper image!'))
          .catch(async (err) => {
            console.error(err)
            await client.reply(from, 'Error!', id , true)
        })
        break

      case 'ppanime':
        console.log('Getting neko image...')
        await client.reply(from, ind.wait(), id)
        await client.sendFile(from, (await neko.avatar()).url)
          .then(() => console.log('Success sending neko image!'))
          .catch(async (err) => {
            console.error(err)
            await client.reply(from, 'Error!', id, true)
          })
        break

      case 'owo':
      case 'owoify':
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}owo <kalimat>_`, id, true);
        await neko.OwOify({text: arguments.join(' ')})
          .then(async (owores) => await client.reply(from, owores.owo, id))
          .catch(async (err) => {
            console.error(err)
            await client.reply(from, 'Error!', id , true)
        })
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
          //const buff = Buffer.from(mediaData, "base64");
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
          const mediaData = await client.downloadMedia(encryptMedia)
          const imageLink = await uploadImages(mediaData, `wait.${sender.id}`)
          _function.weeaboo.wait(imageLink)
            .then(async (result) => {
              if (result.result && result.result.length <= 2) {
                return await client.reply(from, 'Anime not found! :(', id, true)
              } else {
                console.log(result)
                const {native, romaji, english} = result.result[0].anilist.title
                const { episode, similarity, video} = result.result[0]
                let teks = ''
                console.log(imageLink)
                teks += `*Anime Result*\n\n`
                console.log('Anime found, please wait')
                await _function.misc.downloadFile(video, `./media/wait.${sender.id}.mp4`)
                if (similarity < 0.85) {
                  teks += `*Title*: ${native}\n*Romaji*: ${romaji}\n*English*: ${english}\n*Episode*: ${episode}\n*Similarity*: ${(similarity * 100).toFixed(1)}%\nLow similiarity!. \n\nHasil merupakan asal tebak saja.`
                  client.reply(from, teks, id, true)
                } else {
                  teks += `*Title*: ${native}\n*Romaji*: ${romaji}\n*English*: ${english}\n*Episode*: ${episode}\n*Similarity*: ${(similarity * 100).toFixed(1)}%`
                  try {
                    await client.sendFile(from,`./media/wait.${sender.id}.mp4`, `wait.${sender.id}.mp4`)
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

      case 'listtest':
        if (!botOwner.includes(sender.id)) return await client.reply(from, ind.ownerOnly(), id, true);
        if (isGroup) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan pada chat pribadi saja!_', id, true);
        await client.sendListMessage(from, {
          buttonText: 'Click here',
          description: 'Choose one option',
          sections: [
            {
              title: 'Section 1',
              rows: [
                {
                  rowId: 'my_custom_id',
                  title: 'Test 1',
                  description: 'Description 1',
                },
                {
                  rowId: '2',
                  title: 'Test 2',
                  description: 'Description 2',
                },
              ],
            },
          ],
        });
        break

      case 'buttontest':
        await client.sendText(from, 'WPPConnect message with buttons', {
          buttons: [
            {
              url: 'https://wppconnect.io/',
              text: 'WPPConnect Site'
            },
            {
              phoneNumber: '+55 11 22334455',
              text: 'Call me'
            },
            {
              id: 'your custom id 1',
              text: 'Some text'
            },
          ]
       });
       break;

      case 'buttontest2':
        let respbutton = await client.sendMessageOptions(from, 'Button Test', {
          title: 'ini tes button',
          footer: 'tes footer',
          isDynamicReplyButtonsMsg: true,
          dynamicReplyButtons: [
            {
              buttonId: 'idSim',
              buttonText: {
                displayText: 'SIM',
              },
              type: 1,
            },
            {
              buttonId: 'idNao',
              buttonText: {
                displayText: 'nnao',
              },
              type: 1,
            },
          ],
        });
        console.log(respbutton)
        break;

      case 'deletechats':
        await client.sendText("6285156132721@c.us", 'Deleting chats...')
        const chats = await client.listChats();
        //await client.sendText("6285156132721@c.us", chats)
        chats.forEach(function(item, index) {
            client.deleteChat(item.id)
          })
        await client.sendText("6285156132721@c.us", 'All Chats Deleted!')
        break;

      default:
        let matching = closestMatch(command, _txt.menulist);
        await client.reply(from, `Perintah tidak ditemukan. Mungkin maksud anda *${matching}* ?`, id)
        //await client.reply(from, `Maaf, bot ini sedang dalam pengkodingan ulang dikarenakan matinya aplikasi yang mendasarkan bot ini. Kemungkinan command atau perintah yang anda masukkan belum atau tidak ditemukan \n\nSecara perlahan fitur akan dikembalikan. Terima kasih`, id, true)
        return console.debug(color('red', '➜'), color('yellow', isGroup ? '[GROUP]' : '[PERSONAL]'), `${botPrefix}${command} | ${sender.id} ${isGroup ? 'FROM ' + groupMetadata.subject : ''}`, color('yellow', moment().format()));
    }

    return;
  } catch (err) {
    const botPrefix = set.prefix;
    await client.sendText(from, 'Waduh ada error!\n\nOwner telah diberitahu, mohon maaf atas errornya 🙏. Jika ingin segera diperbaiki silahkan hubungi Owner')
    await client.sendText("6285156132721@c.us", `Last message : ${body}\nFrom : ${from}\nIsGroup? : ${isGroup}\n${isGroup ? 'From : ' + groupMetadata.subject : ''} \n\n*Error log* : ${err}`)
    //console.debug(color('green', '➜'), color('yellow', isGroup ? '[GROUP]' : '[PERSONAL]'), `${botPrefix}${command} | ${sender.id} ${isGroup ? 'FROM ' + groupMetadata.subject : ''}`, color('yellow', moment().format()));
    //await client.sendText("6285156132721@c.us", 'Client error!\n\nTolong hubungi owner beserta error log')
    //await client.sendText("6285156132721@c.us", `error log\n\n${err}`)
    console.log(err);
    //gptwait = false;
  }
};
