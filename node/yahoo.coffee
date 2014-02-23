request = require "request"
class exports.Yahoo
  yahoo_app_id = 'vCu4FUjV34HSXktB0RHLPOjtgQPm3vnh0zchQcgX.ow8THogzl3Nta_rAC4-'

  woeid: (place, callback)->
    url = "http://where.yahooapis.com/v1/places.q('#{place}')?format=json&appid=#{yahoo_app_id}"
    request url, (err, res, body)->
      callback?(err, res)
