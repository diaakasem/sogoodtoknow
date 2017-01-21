twitter = require('twitter')
_ = require 'lodash'
jsdom = require 'jsdom'
Say = require './say'

jqueryify = (url, callback)->
  jsdom.env
    url:  url
    scripts: ["http://code.jquery.com/jquery-2.0.2.min.js"]
    done: callback


CONSUMER_KEY = '7kLdyMV97dFlwsE5WPG7J8kzE'
CONSUMER_SECRET =  'z0VKtLBM5GHDmnKnXj8wZUcQhnyVQ54a2YaIYYw8PNIaqymo0Q'
BEARER_TOKEN = new Buffer("${CONSUMER_KEY}:${CONSUMER_SECRET}").toString('base64')

urls =
  'New York': 'https://trends24.in/united-states/new-york/~cloud'
  'California': 'https://trends24.in/united-states/san-francisco/~cloud'
  'London': 'https://trends24.in/united-kingdom/london/~cloud'
  'United States': 'https://trends24.in/united-states/~cloud'

class exports.Twitter

  constructor: ->
    @auth()

  auth: ->
    console.info BEARER_TOKEN
    @twit = new twitter
      consumer_key: CONSUMER_KEY,
      consumer_secret: CONSUMER_SECRET,
      #access_token_key: '52365348-crI292ocHUqQShx0UvoSd4TqAIVZHJIMxxqfoPuQg',
      #access_token_secret: 'pxpOgJm3FyDJOka1rkQ9okEQw0rDsXpITZ6EgkChCegaX'
      bearer_token: BEARER_TOKEN
    @twit

  trendsFor: (woeid, callback)->
    @auth().get 'trends/place.json', {id: woeid, exclude: true}, (data) ->
      console.log(data)
      callback?(null, data)

  placeTrends: (place, callback)->
    jqueryify urls[place], (err, window)=>
      $ = window.$
      tags = _.map $('ol#cloud-ol li a'), (item)->
        $(item).text().trim()
      tags = _.filter tags, (tag)->
        tag.indexOf('#') < 0
      console.log tags
      callback null, tags

