YQL = require 'yql'
class exports.Yahoo
  yahoo_app_id = 'vCu4FUjV34HSXktB0RHLPOjtgQPm3vnh0zchQcgX.ow8THogzl3Nta_rAC4-'

  woeid: (place, callback)->
    #url = "http://where.yahooapis.com/v1/places.q('#{place}')?format=json&appid=#{yahoo_app_id}"

    #query = "select locations.woe.timezone.woeid from ugeo.geocode where text='#{place}' and appname='#{yahoo_app_id}'"
    query = "SELECT locations.woe.timezone.woeid FROM ugeo.geocode where text='#{place}' and appname='#{yahoo_app_id}'"
    console.log query
    yql = new YQL query
    yql.exec (error, response) ->
      if error
        console.error error
      ret = response.query.results.result[0].locations.woe.timezone.woeid
      console.log ret
      callback?(error, ret)
