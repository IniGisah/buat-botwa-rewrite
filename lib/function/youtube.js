const { Client } = require("youtubei");
const scrape = new Client();
const axios = require('axios');

const { fetchJson, fetchText } = require('../../util/fetcher')

function is_url(str)
{
  regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        if (regexp.test(str)) { return true; } else { return false; }
}

const youtubeMusic = async (title) => {
  return new Promise(async (resolve, reject) => {
      console.log(`Getting video music from (${title}) with high quality...`);
      let videourl, thumb, dur, geturl
      try {
        if(!is_url(title)){
          const scraping = await scrape.search(title, { type: 'video', limit: 5 });
          const video = scraping.items.filter((vid) => vid.duration < 900)[0];
          if (!video) return resolve(false);
          title = video.title
          thumb = video.thumbnails.best;
          dur = video.duration;
    
          const videoid = video.id;
          videourl = `https://www.youtube.com/watch?v=${videoid}`;
          geturl = await mediadown(videourl, true)
    
          //console.log(videourl);
        } else if (is_url(title)){
          const video = await scrape.getVideo(title);
    
          thumb = video.thumbnails.best;
          dur = video.duration;
    
          videourl = title;
          geturl = await mediadown(videourl, true)
    
          //console.log(videourl);
        }
        resolve({
         //result : res,
          title: title,
          duration : dur,
          thumbnail : thumb,
          link2 : geturl})
      } catch (ex) {
        reject(ex);
      }
      /*
      await fetchJson(`http://priv.luii.my.id:2233/convert.php?youtubelink=${videourl}`)
          .then((res) => resolve({
            result : res,
            title: title,
            duration : dur,
            thumbnail : thumb,
            link2 : geturl}))
          .catch((err) => reject(err))
      */
  });
};

const youtubeVideo = async (title) => {
  return new Promise(async (resolve, reject) => {
    console.log(`Getting video from (${title})...`);
    let videourl, thumb, dur, geturl
    try {
      if(!is_url(title)){
        const scraping = await scrape.search(title, { type: 'video', limit: 5 });
        const video = scraping.items.filter((vid) => vid.duration < 900)[0];
        if (!video) return resolve(false);

        title = video.title;
        thumb = video.thumbnails.best;
        dur = video.duration;

        const videoid = video.id;
        videourl = `https://www.youtube.com/watch?v=${videoid}`;
        geturl = await mediadown(videourl, false)

        //console.log(videourl);
      } else if (is_url(title)){
        const video = await scrape.getVideo(title);

        thumb = video.thumbnails.best;
        dur = video.duration;

        videourl = title;
        geturl = await mediadown(videourl, false)

        //console.log(videourl);
      }
      resolve({
        //result : res,
        title: title,
        duration : dur,
        thumbnail : thumb,
        link2: geturl})
    } catch (ex) {
      reject(ex)
    }
    /*
    //await fetchJson(`https://st4rz.herokuapp.com/api/ytv2?url=${videourl}`)
    await fetchJson(`http://priv.luii.my.id:2233/convert.php?youtubelink=${videourl}&format=mp4`)
        .then((res) => resolve({
          result : res,
          duration : dur,
          thumbnail : thumb,
          link2: geturl}))
        .catch((err) => reject(err))
    */
  });
}

const youtubeSearch = async (title) => {
  return new Promise(async (resolve, reject) => {
      try {
      console.log(`Searching video from (${title})...`);
      const video = await scrape.search(title, { type: 'video', limit: 5 });
      //const video = scraping.filter((vid) => vid.duration < 900);
      if (!video) return resolve(false);

      const dur = []
      const titlevid = []
      const videoid = []
      const videourl = []
      for (let index = 0; index <= 5; index++) {
        dur.push(video[index].duration)
      }
      for (let index = 0; index <= 5; index++) {
        titlevid.push(video[index].title)
      }
      for (let index = 0; index <= 5; index++) {
        videoid.push(video[index].id)
      }
      for (let index = 0; index <= 5; index++) {
        videourl.push(`https://www.youtube.com/watch?v=${videoid[index]}`)
      }
      resolve({
        url : videourl,
        title : titlevid,
        duration : dur
      })
    } catch (ex) {
      reject(ex)
    }
  });
};

const youtubeMusic2 = async (title) => {
  return new Promise(async (resolve, reject) => {
    console.log(`Getting video music from (${title}) with medium quality...`);
    const scraping = await scrape.search(title, { type: 'video', limit: 5 });
    const video = scraping.filter((vid) => vid.duration < 600)[0];
    if (!video) return resolve(false);

    const thumb = video.thumbnails.best;
    const dur = video.duration;

    const videoid = video.id;
    const videourl = `https://www.youtube.com/watch?v=${videoid}`;

    //console.log(videourl);

    await fetchJson(`https://st4rz.herokuapp.com/api/yta2?url=${videourl}`)
        .then((res) => resolve({
          result : res,
          duration : dur,
          thumbnail : thumb}))
        .catch((err) => reject(err))
});
}

const mediadown = async (url, audio) => new Promise((resolve, reject) => {
	var api = "https://co.wuk.sh/api/json";
	//var cURL = extractURL(x);
	//var url = encodeURIComponent(cURL);

	var vQuality = 720;
	var isAudioOnly = audio;
	var aFormat = 'best';

	const requestBody = {
		url: url,
		vQuality: vQuality,
		isAudioOnly: isAudioOnly,
		aFormat: aFormat
	};


	const requestOptions = {
		method: 'POST',
    url: api, 
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		data: requestBody
	};

axios(requestOptions)
		.then(response => {
      resolve(response.data.url)
		})
		.catch(error => {
			reject(error)
		});
})

module.exports = {
  youtubeMusic,
  youtubeVideo,
  youtubeMusic2,
  youtubeSearch
};
