import path from 'path';
import _ from 'lodash';
import mkdirp from 'mkdirp';
import async from 'async';
import im from 'imagemagick';
import fs from 'fs';
import request from 'request';
import Promise from 'bluebird';
import { promisify } from 'util';
const unlink = promisify(fs.unlink)
const writeFile = promisify(fs.writeFile)

import Wikipedia from './wikipedia.js';
import Say from './say.js';

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

function pad(num, size) {
  if (isNaN(size)) {
    size = 2;
  }
  let s = num + '';
  while (s.length < size) {
    s = `0${s}`;
  }
  return s;
};

function download (uri, filename, callback) {
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
export default class Manager {

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

  async speak(title, textFile, audioFile){
    const file = await speaker.produce(audioFile, textFile)
    await unlink(audioFile)
    return file;
  }

  async downloadImages(uri, images, callback){
    // For now we do not work with svg
    images = _.filter(images, image=> image.name.indexOf('svg') < 0);
    let i = 0;
    return Promise.mapSeries(images, async function(img) {
        i++;
        // Return new images when done
        try {
            if (!img.name) {
                console.log('ERROR in img object');
                console.log(img);
                console.log(' -- ');
                throw new Error('No Image Name Found.');
            }
            const dot = img.name.lastIndexOf('.');
            const padded = pad(i);
            const ext = img.name.substring(dot);
            const out = path.join(uri, padded + ext);
            const res = await download(img.url, out)
            const name = padded + '_resized' + ext;
            const local = path.join(uri, name);
            return im.resize({
                srcPath: out,
                dstPath: local,
                width: 500,
                height: 500
            }, async function(err, stdout, stderr){
                img.name = name;
                img.status = 'success';
                if (err) {
                    img.status = 'error';
                    return unlink(path.join(uri, name));
                }
                await unlink(out)
                return img
            });
        } catch (e) {
            console.log(arguments);
            console.error('No Image Result', img);
        }
    });
  }

  nameOf(title) {
    const name = title.toLowerCase();
    return name.replace(/\s/g, '_');
  }

  async build(meta) {
    meta.name = this.nameOf(meta.title);
    meta.images = _.filter(meta.images, img => !img.name.toLowerCase().match(/.+\.svg/));
    meta.images = _.map(meta.images, function(img){
        img.name = img.name.toLowerCase();
        return img;
    });
    const project = this.structure(meta.name);
    const data = await Promise.map([
      this.speak(meta.title, project.text, project.audio),
      this.downloadImages(project.images, meta.images),
      writeFile(project.text, meta.text)
    ]);
    return {
        sound: data[0],
        images: data[1],
        text: data[2]
    }
  }

  async run(url) {
      let metadata;
      if (url && (url === 'random')) {
          metadata = await this.wiki.randomEn();
          return this.build(metadata)
      } else if (url && (url !== 'random')) {
          metadata = await this.wiki.scrape(url);
      } else {
          const result = await Promise.map(lang, (lang) => {
              this.wiki.dailyArticle(lang)
              metadata = _.first(_.compact(result))
          })
      }
      return this.build(metadata)
  }
};
