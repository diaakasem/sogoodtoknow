import _ from 'lodash';
// import { JSDOM } from 'jsdom';
import cheerio from 'cheerio';
import axios from 'axios';

import Say from './say.js';

/**
 * jqueryify
 *
 * @param url
 * @param callback
 * @returns {undefined}
 */
async function jqueryify(url, callback) {
  const { data } = await axios.get(url)
  const $ = cheerio.load(data);
  return $;
}

const langSelector =
  //fr: "div#mf-lumieresur p a"

  {en: 'div#mp-tfa b>a'};

  //nl: () ->
    //$('.radius').first().find('a').last()

  //ar: 'div#mf-fa p>b>a'

export default class Wikipedia {

  analyze(text){
    text = text.toLowerCase();
    let textArr = text.split(' ');
    textArr = _.map(textArr, word=> word = word.replace(/[,\.\)\(]/, ''));
    let words = {};
    _.each(textArr, function(word){
      if (word.length < 5) { return; }
      return words[word] = words[word] !== undefined  ? words[word] + 1 : 0;
    });
    words = _.map(words, (value, key)=>
      ({
        name: key,
        rank: value
      })
    );
    words = _.omit(words, ['this', 'that', 'south', 'north', 'east', 'west',
    'southern', 'northen', 'between', 'after', 'before', 'then', 'there', 'here',
    'against', 'their', 'other', 'where', 'which']);
    return words;
  }

  best(dict, count) {
    if (isNaN(count)) {
      count = 10;
    }
    return _.chain(dict).sortBy('rank').reverse().take(count).value();
  }

  keywords(text) {
    const words = this.analyze(text);
    const ranks = this.best(words);
    return _.map(ranks, 'name').join(', ');
  }

  async dailyArticle(lang) {
    let that = this;
    if (lang) {
      lang = 'en';
    }
    const baseUrl = `http://${lang}.wikipedia.org`;
    const $ = await jqueryify(baseUrl)
    const link = $(langSelector[lang]).first();
    if (link.length) {
        const url = baseUrl + link.attr('href');
        return that.scrape(url);
    }
    return [];
  }

  async randomEn() {
    let that = this;
    const baseUrl = 'http://en.wikipedia.org/wiki/Special:Random';
    const $ = await jqueryify(baseUrl)
    const images = await this.getImages($)
    if (images.length > 2) {
        return that.scrape(baseUrl);
    }
    return that.randomEn();
  }

  async scrape(url) {
    const metadata = {
      wikipedia: url
    };
    const $ = await jqueryify(url)
    const title = $('#firstHeading').text();
    metadata.title = title;
    const text = await this.getText($)
    const keywords = this.keywords(text);
    metadata.text = text;
    metadata.keywords = keywords;
    const description = _.take(text.split('. '), 3).join('. ');
    metadata.description = description;
    const images = await this.getImages($)
    metadata.images = _.map(images, function(obj, key){
        return _.isNumber(key) || null;
    });
    metadata.images = _.compact(metadata.images);
    return metadata
  }

  async getImages($) {
    const imagesFilter = function() { return $(this).attr('width') > 100; };
    function map() {
      const arr = $(this).attr('src').split('/');
      const name = arr.splice(-1);
      return {
        name: arr[arr.length - 1] + '',
        url: (`http:${arr.join('/')}`).replace(/\/thumb/, '')
      };
    }
    const images = $('img[src*="//upload"]').filter(imagesFilter).map(map);
    return images;
  }

  async getText($) {
    let all;
    //text = $('#mw-content-text>p').text()
    $.fn.reverse = [].reverse;
    const emptyP = $('#mw-content-text p:empty');
    if (emptyP.length > 0) {
      all = emptyP.first().prevAll('p, ul, dl').reverse();
    } else {
      const secondParagraph = $('#mw-content-text h2');

      // When there is no empty p and only h2
      if (secondParagraph.length > 0) {
        all = secondParagraph.first().prevAll('p, ul, dl').reverse();
        if (!all.length) {
          all = $('#mw-content-text>p');
        }
      } else {
        all = $('#mw-content-text>p');
      }
    }
    all = all.filter(":not(:contains('Coordinates'))");
    all.find('li').text(function(i, text){
      if (text.slice(-1) !== '.') {
        text = text + '. ';
      }
      return text;
    });
    let text = all.text();
    // Removing [1] reference numbers
    text = text.replace(/\[\d+\]/g, '');
    text = text.replace(/\.([A-Z])/g, '. $1');
    text = text.replace('[citation needed]', '');
    text = text.replace('[clarification needed]', '');
    text = text.replace('[clarification needed],', '');
    console.log(text);
    return text
  }

};

