path = require 'path'
wikipedia = require path.join(__dirname, '..', '..', 'node', 'wikipedia')

describe 'Wikipedia', ->

  it 'shoule be defined', ->
    expect(wikipedia).toBeDefined()

  it 'Should scrape starbucks', ->
    url = 'http://en.wikipedia.org/wiki/Starbucks'
    runs ->
      wikipedia.scrape url, (res)->
        console.log res
        expect(res).toBeDefined()
