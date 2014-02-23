twitter = require('twitter')

class exports.Twitter

  constructor: ->
    @twit = new twitter
      consumer_key: 'KgLkVLRo23gI6qBxqT4jHg',
      consumer_secret: 'cZTlz992CZG8owjbe2DKwTf1WQEodxlcC2EkzJGvOI',
      access_token_key: '52365348-PcgjMasng4OOWYLBl09ofXTkfdCz2C9NRf9CPT7Ds',
      access_token_secret: 'rn6IY1UB5E57rWInDJcDsdTqakmPPPjCRUpO6BLNfyE1U'
    @twit.login()

  trendsFor: (woeid, callback)->
    @twit.get 'trends/place.json', {id: woeid}, (data) ->
      console.log(data)
      callback?(null, data)
