const {Wikipedia} = require('./wikipedia');
const {Say} = require('./say');
const path = require('path');
const mkdirp = require('mkdirp');
const _ = require('lodash');
const gm = require('gm');
const im = require('imagemagick');

const speaker = new Say('en');

const cmdString = function(text){
  text = text.replace(/"/g, ' ');
  text = text.replace(/'/g, '');
  text = text.replace(/\(/g, '\\(');
  text = text.replace(/\)/g, '\\)');
  text = text.replace(/\|/g, '\\| ');
  text = text.replace(/\[/g, '\\[');
  return text = text.replace(/\]/g, '\\]');
};

const pad = function(num, size) {
  if (size == null) { size = 2; }
  let s = num + "";
  while (s.length < size) { s = `0${s}`; }
  return s;
};


const fs = require("fs");
const request = require("request");

const download = function(uri, filename, callback) {
  try {
    const r = request(uri);
    r.pipe(fs.createWriteStream(filename));
    return r.on('end', callback);
  } catch (e) {
    console.log(`Error while downloading ${uri}`);
    return (typeof callback === 'function' ? callback(null) : undefined);
  }
};


const langs = ['en'];
exports.Manager = class Manager {

  constructor() {
    this.wiki = new Wikipedia();
  }

  pathOf(title){
    return path.join(__dirname, '..', 'app', 'projects', title);
  }

  structure(title){
    const p = this.pathOf(title);
    mkdirp.sync(p);
    mkdirp.sync(path.join(p, 'images'));
    return {
      root: p,
      images: path.join(p, 'images'),
      audio: path.join(p, 'audio.aiff'),
      text: path.join(p, 'text.txt')
    };
  }

  speak(title, textFile, audioFile, callback){
    return speaker.produce(audioFile, textFile, function(file){
      fs.unlink(audioFile, function() {});
      return (typeof callback === 'function' ? callback(file) : undefined);
    });
  }

  downloadImages(uri, images, callback){
    // For now we do not work with svg
    images = _.filter(images, image=> image.name.indexOf('svg') < 0);
    let i = 0;
    const newImages = [];
    let afterAllDone = function() {};
    if (callback) {
      afterAllDone = _.after(images.length + 1, _.once(callback));
    }

    var downloadImage = function() {
      // Return new images when done
      console.log("calling after all");
      if (typeof afterAllDone === 'function') {
        afterAllDone(newImages);
      }

      const img = images[i++];
      if (!img) { return; }
      if (!img.name) {
        console.log("ERROR in img object");
        console.log(img);
        console.log(" -- ");
        return downloadImage();
      }
      const dot = img.name.lastIndexOf('.');
      const padded = pad(i);
      const ext = img.name.substring(dot);
      const out = path.join(uri, padded + ext);
      return download(img.url, out, function(res){
        if (res === null) {
          return downloadImage();
        }

        const name = padded + '_resized' + ext;
        const local = path.join(uri, name);
        return im.resize({
          srcPath: out,
          dstPath: local,
          width: 500,
          height: 500
        }
        , function(err, stdout, stderr){
          img.name = name;
          img.status = 'success';
          if (err) {
            img.status = 'error';
            fs.unlink(path.join(uri, name), function() {});
          }
          newImages.push(img);
          fs.unlink(out, function() {});
          return downloadImage();
        });
      });
    };
    return downloadImage();
  }

  nameOf(title){
    const name = title.toLowerCase();
    return name.replace(/\s/g, '_');
  }

  build(meta, onEnd){
    meta.name = this.nameOf(meta.title);
    const project = this.structure(meta.name);

    const callback = _.after(2, _.once(function() {
      console.log(`Done building : ${meta.name}`);
      return onEnd(meta);
    })
    );

    const imagesDownloaded = images=> callback();

    const speakDone = function(audio){
      meta.audio = audio;
      return callback();
    };

    meta.images = _.filter(meta.images, img=> !img.name.toLowerCase().match(/.+\.svg/));

    meta.images = _.map(meta.images, function(img){
      img.name = img.name.toLowerCase();
      return img;
    });

    this.downloadImages(project.images, meta.images, imagesDownloaded);
    fs.writeFileSync(project.text, meta.text);
    return this.speak(meta.title, project.text, project.audio, speakDone);
  }

  run(url, onEnd){
    //callback = (title, text, images)=>
    const callback = metadata=> {
      if (metadata === 'error') { return onEnd('error'); }
      return this.build(metadata, onEnd);
    };

    if (url && (url === 'random')) {
      return this.wiki.randomEn(callback);
    } else if (url && (url !== 'random')) {
      return this.wiki.scrape(url, callback);
    } else {
      return langs.map((lang) =>
        this.wiki.dailyArticle(lang, callback));
    }
  }
};
