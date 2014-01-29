_ = require 'lodash'
jsdom = require 'jsdom'
Say = require './say'

jqueryify = (url, callback)->
  jsdom.env
    url:  url
    scripts: ["http://code.jquery.com/jquery-2.0.2.min.js"]
    done: callback

lang_selector =
  #fr: "div#mf-lumieresur p a"

  en: "div#mp-tfa b>a"

  #nl: () ->
    #$(".radius").first().find('a').last()

  #ar: "div#mf-fa p>b>a"

class exports.Wikipedia

  dailyArticle: (lang, callback) ->
    lang = "en"  if lang?
    base_url = "http://" + lang + ".wikipedia.org"
    jqueryify base_url, (err, html) =>
      $ = html.$
      link = $(lang_selector[lang]).first()
      if link.length
        title = link.text()
        url = base_url + link.attr("href")
        @scrape url, callback

  scrape: (url, callback) ->
    jqueryify url, (err, window)=>
      title = window.$('#firstHeading').find('span').text()
      @getText window, (text)=>
        @getImages window, (images)->
          callback title, text, images

  getImages: (window, callback) ->
    $ = window.$
    imagesFilter = -> $(this).attr('width') > 100
    map = ->
      arr = $(this).attr('src').split('/')
      name = arr.splice(-1)
      name: arr[arr.length - 1] + ""
      url: ('http:' + arr.join '/').replace /\/thumb/, ''
    images = $('img[src*="//upload"]').filter(imagesFilter).map(map)
    callback images

  getText: (window, callback) ->
    $ = window.$
    text = $('#mw-content-text>p').text()
    # Removing [1] reference numbers
    text = text.replace /\[\d+\]/g, ''
    callback text

