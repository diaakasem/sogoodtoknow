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

  analyze: (text)->
    text = text.toLowerCase()
    textArr = text.split(' ')
    textArr = _.map textArr, (word)->
      word = word.replace /[,\.]/, ''
    words = {}
    _.each textArr, (word)->
      return  if word.length < 5
      words[word] = if words[word] isnt undefined  then words[word] + 1 else 0
    words = _.map words, (value, key)->
      name: key
      rank: value
    words = _.omit words, ['this', 'that', 'south', 'north', 'east', 'west',
    'southern', 'northen', 'between', 'after', 'before', 'then', 'there', 'here',
    'against', 'their', 'other', 'where']
    words

  best: (dict, count=10)->
    _.chain(dict).sortBy('rank').reverse().first(count).value()

  keywords: (text)->
    words = @analyze text
    ranks = @best words
    keywords = _.map(ranks, 'name').join(', ')
    console.log "Keywords: #{keywords}"
    keywords

  dailyArticle: (lang, callback) ->
    lang = "en"  if lang?
    base_url = "http://" + lang + ".wikipedia.org"
    jqueryify base_url, (err, html) =>
      $ = html.$
      link = $(lang_selector[lang]).first()
      if link.length
        url = base_url + link.attr("href")
        @scrape url, callback

  randomEn: (callback) ->
    base_url = "http://en.wikipedia.org/wiki/Special:Random"
    console.log base_url
    jqueryify base_url, (err, window) =>
      throw err  if err
      $ = window.$
      link = window.location.href
      console.log link
      @getImages window, (images)=>
        if images.length > 2
          @scrape link, callback
        else
          @randomEn callback

  scrape: (url, callback) ->
    console.log "Wikipedia: #{url}"
    jqueryify url, (err, window)=>
      $ = window.$
      title = $('#firstHeading').find('span').text()
      console.log "Title: #{title}"
      @getText window, (text)=>
        keywords = @keywords text
        description = _.first(text.split('. '), 3).join('. ')
        console.log "Description: #{description}"
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
    #text = $('#mw-content-text>p').text()
    $.fn.reverse = [].reverse
    emptyP = $('#mw-content-text p:empty')
    if emptyP.length > 0
      all = emptyP.first().prevAll('p, ul, dl').reverse()
    else
      secondParagraph = $('#mw-content-text h2')

      # When there is no empty p and only h2
      if secondParagraph.length > 0
        all = secondParagraph.first().prevAll('p, ul, dl').reverse()
      else
        all = $('#mw-content-text>p')

    all = all.filter(":not(:contains('Coordinates'))")
    all.find('li').text (i, text)->
      if text[-1..] isnt '.'
        text = text + ". "
      text
    text = all.text()
    # Removing [1] reference numbers
    text = text.replace /\[\d+\]/g, ''
    text = text.replace /\.([A-Z])/g, '. $1'
    text = text.replace '[citation needed]', ''
    callback text

