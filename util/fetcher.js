const fetch = require('node-fetch')
const FormData = require('form-data')
const fs = require('fs')
const fileType = require('file-type')
const resizeImage = require('./imageProcessing')
//const { media } = require('wikipedia/dist/page')

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      response = {};
  
    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }
  
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
  
    return response;
  }

/**
 *Fetch Json from Url
 *
 *@param {String} url
 *@param {Object} options
 */

const fetchJson = (url, options) =>
    new Promise((resolve, reject) =>
        fetch(url, options)
            .then(response => response.json())
            .then(json => resolve(json))
            .catch(err => {
                console.error(err)
                reject(err)
            })
    )

/**
 * Fetch Text from Url
 *
 * @param {String} url
 * @param {Object} options
 */

const fetchText = (url, options) => {
    return new Promise((resolve, reject) => {
        return fetch(url, options)
            .then(response => response.text())
            .then(text => resolve(text))
            .catch(err => {
                console.error(err)
                reject(err)
            })
    })
}

/**
 * Fetch base64 from url
 * @param {String} url
 */

const fetchBase64 = (url, mimetype) => {
    return new Promise((resolve, reject) => {
        console.log('Get base64 from:', url)
        return fetch(url)
            .then((res) => {
                const _mimetype = mimetype || res.headers.get('content-type')
                res.buffer()
                    .then((result) => resolve(`data:${_mimetype};base64,` + result.toString('base64')))
            })
            .catch((err) => {
                console.error(err)
                reject(err)
            })
    })
}

/**
 * Upload images to telegra.ph server.
 * @param {string} buffData 
 * @param {string} fileName
 * @returns {Promise<string>}
 *  { encoding: 'base64' }
 */
const uploadImages = (buffData, fileName) => {
    return new Promise(async (resolve, reject) => {
        let extension = buffData.split(';')[0].split('/')[1]
        //const result = await fileType.fromBuffer(buffData)
        //console.log(result)
        var imageBuffer = decodeBase64Image(buffData);
        const filePath = `media/${fileName}.${extension}`
        fs.writeFile(filePath, imageBuffer.data, (err) => {
            if (err) reject(err)
            console.log('Uploading image to telegra.ph server...')
            const fileData = fs.readFileSync(filePath)
            const form = new FormData()
            form.append('file', fileData, `${fileName}.${extension}`)
            fetch('https://telegra.ph/upload', {
                method: 'POST',
                body: form
            })
                .then((response) => response.json())
                .then((result) => {
                    if (result.error) reject(result.error)
                    resolve('https://telegra.ph' + result[0].src)
                })
                .then(() => fs.unlinkSync(filePath))
                .catch((err) => reject(err))
        })
    })
}
/**
 * Save mediabuffer to file
 * @param {Buffer} buffData 
 * @param {string} fileName
 * @returns {Promise<string>}
 */
const saveFile = (buffData, fileName) => {
    return new Promise(async (resolve, reject) => {
        const { ext } = await fileType.fromBuffer(buffData)
        const filePath = `media/${fileName}.${ext}`
        fs.writeFile(filePath, buffData, { encoding: 'base64' }, (err) => {
            if (err) reject(err)
            console.log(`File with filename ${filePath} saved`)
            resolve(filePath)
        })
    })
}
module.exports = {
    fetchJson,
    fetchText,
    fetchBase64,
    uploadImages,
    saveFile
}
