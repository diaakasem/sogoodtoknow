import axios from 'axios';
import path from 'path';
import _ from 'lodash';
import mkdirp from 'mkdirp';
import im from 'imagemagick';
import fs from 'fs';
import Promise from 'bluebird';
import { promisify } from 'util';
const unlink = promisify(fs.unlink)
const writeFile = promisify(fs.writeFile)

import Wikipedia from './wikipedia.js';
import GSay from './gsay.js';

const gspeaker = new GSay();

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

async function download (uri, filename) {
  const response = await axios({
      method: "get",
      url: uri,
      responseType: "stream"
  });
  response.data.pipe(fs.createWriteStream(filename));
  // return a promise and resolve when download finishes
  return new Promise((resolve, reject) => {
    response.data.on('end', () => {
      resolve();
    });
    response.data.on('error', () => {
      reject();
    });
  });
};

const langs = ['en'];
export default class Manager {

  constructor() {
    this.wiki = new Wikipedia();
  }

  pathOf(title){
    return path.join(process.cwd(), 'app', 'projects', title);
  }

  structure(title){
    const p = this.pathOf(title);
    mkdirp.sync(p);
    mkdirp.sync(path.join(p, 'images'));
    return {
      root: p,
      images: path.join(p, 'images'),
      audio: path.join(p, 'audio.aiff.mp3'),
      text: path.join(p, 'text.txt')
    };
  }

  /**
   * @param {text} The text to speak
   * @param {audioFile} The audio file path to save mp3 to
   *
   * @returns {undefined}
   */
  async speak(text, audioFile){
      await gspeaker.produce(audioFile, text)
      return audioFile
  }

  async downloadImages(uri, images, callback){
    // For now we do not work with svg
    images = _.filter(images, image=> image.name.indexOf('svg') < 0);
    let i = 0;
    return Promise.mapSeries(images, async function(img) {
        i++;
        // Return new images when done
        if (!img.name) {
            // console.log('ERROR in img object');
            // console.log(img);
            // console.log(' -- ');
            throw new Error('No Image Name Found.');
        }
        const dot = img.name.lastIndexOf('.');
        const padded = pad(i);
        const ext = img.name.substring(dot);
        const out = path.join(uri, padded + ext);
        await download(img.url, out)
        const name = padded + '_resized' + ext;
        const local = path.join(uri, name);
        return new Promise((resolve, reject) => {
            im.resize({
                srcPath: out,
                dstPath: local,
                width: 500,
                height: 500
            }, function(err, stdout, stderr){
                img.name = name;
                img.status = 'success';
                const r = () => resolve(img)
                if (err) {
                    // console.error(err);
                    img.status = 'error';
                    return unlink(path.join(uri, name)).then(r).catch(r);
                }
                return unlink(out).then(r).catch(r);
            });
        });
    });
  }

  nameOf(title) {
    const name = title.toLowerCase();
    return name.replace(/\s/g, '_');
  }

  async build(meta) {
    if (!meta || !meta.text || _.isEmpty(meta.images)) {
        return {
            sound: null,
            images: [],
            text: ''
        };
    }
    meta.name = this.nameOf(meta.title);
    meta.images = _.map(meta.images, function(img){
        img.name = img.name.toLowerCase();
        return img;
    });
    const project = this.structure(meta.name);
    const sound = await this.speak(meta.text, project.audio);
    const images = await this.downloadImages(project.images, meta.images);
    const result = {
        sound,
        images,
        text: meta.text,
        name: meta.name,
        title: meta.title,
        keywords: meta.keywords,
        wikipedia: meta.wikipedia,
        description: meta.description,
        source: meta.source
    };
    return result;
  }

  async run(title) {
      if (!title || !_.isString(title)) {
          // metadata = await this.wiki.dailyArticle('en')
          // return this.build(metadata)
          return;
      }
      title = title.trim();
      let metadata;
      if (title === 'random') {
          metadata = await this.wiki.randomEn();
      } else { // I wrote a title manually
          metadata = await this.wiki.scrape(title);
      }
      return this.build(metadata)
  }
}
