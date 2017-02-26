const {Executer} = require('./executer');
const fs = require('fs');
const voices = {
  //en: ['tom', 'ava', 'karen', 'lee', 'serena']
  en: ['tom', 'ava'],
  ar: ['tarik']
};

exports.Say = class Say extends Executer {
  constructor(defaultlang){
    super();
    this.defaultlang = defaultlang;
  }

  voice(lang){
    if (lang == null) { lang = this.defaultlang; }
    const arr = lang ? voices[lang] : [];
    if (!arr.length) { return null; }
    return arr[Math.floor(Math.random() * arr.length)];
  }

  arSay(something, callback){
    const v = this.voice('ar');
    const cmd = {
      name: 'say',
      command: `say ${something}`
    };
    if (v) {
      cmd.command += ` -v ${v}`;
    }
    return this.execute(cmd, callback);
  }

  say(something, callback){
    const v = this.voice();
    const cmd = {
      name: 'say',
      command: `say ${something}`
    };
    if (v) {
      cmd.command += ` -v ${v}`;
    }
    return this.execute(cmd, callback);
  }

  produce(audioFile, textFile, callback){
    const audio = {};
    const v = this.voice();
    audio.voice = v;
    const cmd = {
      name:  `say -o \"${audioFile}\" -f \"${textFile}\" `,
      command: `say -o \"${audioFile}\" -f \"${textFile}\" `
    };
    if (v) {
      cmd.command += `-v ${v} `;
    }

    return this.execute(cmd, () => {
      return this.toMp3(audioFile, file=> {
        audio.file = file;
        return (typeof callback === 'function' ? callback(audio) : undefined);
      }
      );
    }
    );
  }

  toMp3(file, callback){
    return fs.unlink(`${file}.mp3`, () => {
      const cmd = {
        name:  `ffmpeg -i \"${file}\" -f mp3 -acodec libmp3lame -ab 192000 -ar 44100 \"${file}\".mp3`,
        command: `ffmpeg -i \"${file}\" -f mp3 -acodec libmp3lame -ab 192000 -ar 44100 \"${file}\".mp3`
      };

      return this.execute(cmd, () => typeof callback === 'function' ? callback(file + ".mp3") : undefined);
    }
    );
  }
};
