request = require "request"
class exports.Google
  longlat: (place, callback)->
    console.log place
    url = "http://maps.googleapis.com/maps/api/geocode/json?address=#{place}&sensor=false"
    console.log url
    request url, (err, res, body)->
      callback?(err, res)
