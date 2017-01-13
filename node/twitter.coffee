twitter = require('twitter')

class exports.Twitter

  constructor: ->
    @auth()

  auth: ->
    @twit = new twitter
      consumer_key: 'RvbT0qnx25NLtoez7M9Lq2gBB',
      consumer_secret: 'fmpb8aDgI8hckvvGk7uPozM4C672HBGbbPATbbuJNU5bhiiYgR',
      access_token_key: '52365348-crI292ocHUqQShx0UvoSd4TqAIVZHJIMxxqfoPuQg',
      access_token_secret: 'pxpOgJm3FyDJOka1rkQ9okEQw0rDsXpITZ6EgkChCegaX'
    @twit.login()

  trendsFor: (woeid, callback)->
    @auth()
    console.log woeid
    @twit.get 'trends/place.json', {id: woeid}, (data) ->
      console.log(data)
      callback?(null, data)
