'use strict';

const {Wikipedia} = require('./wikipedia');
const {Say} = require('./say');
const path = require('path');
const mkdirp = require('mkdirp');
const _ = require('lodash');
const async = require('async');
const im = require('imagemagick');

const speaker = new Say('en');

const cmdString = function(text){
  text = text.replace(/"/g, ' ');
  text = text.replace(/'/g, '');
  text = text.replace(/\(/g, '\\(');
  text = text.replace(/\)/g, '\\)');
  text = text.replace(/\|/g, '\\| ');
  text = text.replace(/\[/g, '\\[');
  text = text.replace(/\]/g, '\\]');
  return text;
};

const pad = function(num, size) {
  if (isNaN(size)) {
    size = 2;
  }
  let s = num + '';
  while (s.length < size) {
    s = `0${s}`;
  }
  return s;
};


const fs = require('fs');
const request = require('request');

const download = function(uri, filename, callback) {
  try {
    const r = request(uri);
    r.pipe(fs.createWriteStream(filename));
    return r.on('end', callback);
  } catch (e) {
    let msg = `Error while downloading ${uri}`;
    console.log(msg);
    return _.isFunction(callback) ? callback(msg) : undefined;
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
    speaker.produce(audioFile, textFile, function(file){
      fs.unlink(audioFile, function(err) {
        callback(null, file);
      });
    });
  }

  downloadImages(uri, images, callback){
    // For now we do not work with svg
    images = _.filter(images, image=> image.name.indexOf('svg') < 0);
    let i = 0;
    async.mapSeries(images, function(img, cb) {
      i++;
      // Return new images when done
      if (!img.name) {
        console.log('ERROR in img object');
        console.log(img);
        console.log(' -- ');
        return cb('No Image Name Found.');
      }
      const dot = img.name.lastIndexOf('.');
      const padded = pad(i);
      const ext = img.name.substring(dot);
      const out = path.join(uri, padded + ext);
      return download(img.url, out, function(err, res){
        console.log(arguments);
        if (err) {
          console.log(arguments);
          console.error('No Image Result', img);
          return cb();
        }
        const name = padded + '_resized' + ext;
        const local = path.join(uri, name);
        return im.resize({
          srcPath: out,
          dstPath: local,
          width: 500,
          height: 500
        }, function(err, stdout, stderr){
          img.name = name;
          img.status = 'success';
          if (err) {
            img.status = 'error';
            return fs.unlink(path.join(uri, name), cb);
          }
          fs.unlink(out, function() {
            cb(null, img);
          });
        });
      });
    }, callback);
  }

  nameOf(title) {
    const name = title.toLowerCase();
    return name.replace(/\s/g, '_');
  }

  build(meta, onEnd) {
    let that = this;
    meta.name = this.nameOf(meta.title);
    const project = this.structure(meta.name);
    async.parallel({
      sound: function(cb) {
        that.speak(meta.title, project.text, project.audio, function(err, audio) {
          meta.audio = audio;
          cb();
        });
      },
      images: function(cb) {
        meta.images = _.filter(meta.images, img=> !img.name.toLowerCase().match(/.+\.svg/));
        meta.images = _.map(meta.images, function(img){
          img.name = img.name.toLowerCase();
          return img;
        });
        that.downloadImages(project.images, meta.images, cb);
      },
      text: function(cb) {
        fs.writeFile(project.text, meta.text, cb);
      }
    }, (err, res)=> {
      if (err) {
        console.error(err);
      }
      console.log(`Done building : ${meta.name}`);
      return onEnd(err, meta);
    });
  }

  run(url, onEnd) {
    let that = this;
    //callback = (title, text, images)=>
    const callback = (err, metadata)=> {
      if (err) {
        console.error(err);
        return onEnd('error');
      }
      return that.build(metadata, onEnd);
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
