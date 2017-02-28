'use strict';

const twitter = require('twitter');
const _ = require('lodash');
const jsdom = require('jsdom');
const Say = require('./say');

const jqueryify = (url, callback)=> {
  if (!url) {
    return callback('No URL');
  }
  jsdom.env({
    url,
    scripts: ['http://code.jquery.com/jquery-2.0.2.min.js'],
    done: callback
  });
};


const CONSUMER_KEY = '7kLdyMV97dFlwsE5WPG7J8kzE';
const CONSUMER_SECRET =  'z0VKtLBM5GHDmnKnXj8wZUcQhnyVQ54a2YaIYYw8PNIaqymo0Q';
const BEARER_TOKEN = new Buffer('${CONSUMER_KEY}:${CONSUMER_SECRET}').toString('base64');

const urls = {
  'New York': 'https://trends24.in/united-states/new-york/~cloud',
  'California': 'https://trends24.in/united-states/san-francisco/~cloud',
  'London': 'https://trends24.in/united-kingdom/london/~cloud',
  'United States': 'https://trends24.in/united-states/~cloud'
};

exports.Twitter = class Twitter {

  constructor() {
    this.auth();
  }

  auth() {
    console.info(BEARER_TOKEN);
    this.twit = new twitter({
      consumer_key: CONSUMER_KEY,
      consumer_secret: CONSUMER_SECRET,
      //access_token_key: '52365348-crI292ocHUqQShx0UvoSd4TqAIVZHJIMxxqfoPuQg',
      //access_token_secret: 'pxpOgJm3FyDJOka1rkQ9okEQw0rDsXpITZ6EgkChCegaX'
      bearer_token: BEARER_TOKEN
    });
    return this.twit;
  }

  trendsFor(woeid, callback){
    return this.auth().get('trends/place.json', {id: woeid, exclude: true}, function(data) {
      console.log(data);
      return (typeof callback === 'function' ? callback(null, data) : undefined);
    });
  }

  placeTrends(place, callback){
    return jqueryify(urls[place], (err, window)=> {
      if (err) {
        console.error(err);
        return callback(err);
      }
      let $ = window.$;
      let tags = _.map($('ol#cloud-ol li a'), item=> $(item).text().trim());
      tags = _.filter(tags, tag=> tag.indexOf('#') < 0);
      console.log(tags);
      return callback(null, tags);
    }
    );
  }
};

