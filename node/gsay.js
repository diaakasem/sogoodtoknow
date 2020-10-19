import _ from 'lodash';
import fs from 'fs';
import util from 'util';

import textToSpeech from '@google-cloud/text-to-speech';

const writeFile = util.promisify(fs.writeFile);
const client = new textToSpeech.TextToSpeechClient();

const voices = [
    "en-US-Wavenet-G",    // Really nice - male
    "en-US-Wavenet-H",    // Really nice - male
    "en-US-Wavenet-D",    // Amazing - Male
    "en-US-Wavenet-C",    // SUPER - Female
    "en-US-Wavenet-E",    // The best ever - Female
    "en-US-Wavenet-F",    // More than super - Female
];
export default class GSay {

    //TODO take save place to save audio file

  /**
   * Produces an audio file MP3, from the text passed
   *
   * @param {string} audioFile the path to the audio file to be produced
   * @param {string} text the text to speak
   *
   * NOTE: should set GOOGLE_APPLICATION_CREDENTIALS
   *
   * @returns {string} The audio file path
   */
  async produce(audioFile, text){
    // Construct the request
    const request = {
        input: {
            text: text
        },
        // Select the language and SSML voice gender (optional)
        voice: {
            languageCode: 'en-US',
            // ssmlGender: 'NEUTRAL'
            name: _.sample(voices)
        },
        // select the type of audio encoding
        audioConfig: {
            audioEncoding: 'MP3'
        },
    };
    console.info(`VOICE == ( ${audioFile} ) ==> ( ${request.voice.name} )`);
    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    await writeFile(audioFile, response.audioContent, 'binary');
    return audioFile;
  }

};
