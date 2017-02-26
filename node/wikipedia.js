const _ = require('lodash');
const jsdom = require('jsdom');
const Say = require('./say');

const jqueryify = (url, callback)=>
  jsdom.env({
    url,
    scripts: ["http://code.jquery.com/jquery-2.0.2.min.js"],
    done: callback
  })
;

const lang_selector =
  //fr: "div#mf-lumieresur p a"

  {en: "div#mp-tfa b>a"};

  //nl: () ->
    //$(".radius").first().find('a').last()

  //ar: "div#mf-fa p>b>a"

exports.Wikipedia = class Wikipedia {

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

  best(dict, count){
    if (count == null) { count = 10; }
    return _.chain(dict).sortBy('rank').reverse().take(count).value();
  }

  keywords(text){
    const words = this.analyze(text);
    const ranks = this.best(words);
    return _.map(ranks, 'name').join(', ');
  }

  dailyArticle(lang, callback) {
    if (lang != null) { lang = "en"; }
    const base_url = `http://${lang}.wikipedia.org`;
    return jqueryify(base_url, (err, html) => {
      const { $ } = html;
      const link = $(lang_selector[lang]).first();
      if (link.length) {
        const url = base_url + link.attr("href");
        return this.scrape(url, callback);
      }
    }
    );
  }

  randomEn(callback) {
    const base_url = "http://en.wikipedia.org/wiki/Special:Random";
    return jqueryify(base_url, (err, window) => {
      if (err) { return (typeof callback === 'function' ? callback('error') : undefined); }
      const { $ } = window;
      const link = window.location.href;
      return this.getImages(window, images=> {
        if (images.length > 2) {
          return this.scrape(link, callback);
        } else {
          return this.randomEn(callback);
        }
      }
      );
    }
    );
  }

  scrape(url, callback) {
    const metadata = { wikipedia: url };
    return jqueryify(url, (err, window)=> {
      const { $ } = window;
      const title = $('#firstHeading').text();
      metadata.title = title;
      return this.getText(window, text=> {
        const keywords = this.keywords(text);
        metadata.text = text;
        metadata.keywords = keywords;
        const description = _.take(text.split('. '), 3).join('. ');
        metadata.description = description;
        return this.getImages(window, function(images){
          metadata.images = _.map(images, function(obj, key){
            if (_.isNumber(key)) {
              return obj;
            }
            return null;
          });
          metadata.images = _.compact(metadata.images);
          return callback(metadata);
        });
      }
      );
    }
    );
  }

  getImages(window, callback) {
    const { $ } = window;
    const imagesFilter = function() { return $(this).attr('width') > 100; };
    const map = function() {
      const arr = $(this).attr('src').split('/');
      const name = arr.splice(-1);
      return {
        name: arr[arr.length - 1] + "",
        url: (`http:${arr.join('/')}`).replace(/\/thumb/, '')
      };
    };
    const images = $('img[src*="//upload"]').filter(imagesFilter).map(map);
    return callback(images);
  }

  getText(window, callback) {
    let all;
    const { $ } = window;
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
      } else {
        all = $('#mw-content-text>p');
      }
    }

    all = all.filter(":not(:contains('Coordinates'))");
    all.find('li').text(function(i, text){
      if (text.slice(-1) !== '.') {
        text = text + ". ";
      }
      return text;
    });
    let text = all.text();
    // Removing [1] reference numbers
    text = text.replace(/\[\d+\]/g, '');
    text = text.replace(/\.([A-Z])/g, '. $1');
    text = text.replace('[citation needed]', '');
    console.log(text);
    return callback(text);
  }
};

