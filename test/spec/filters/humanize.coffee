'use strict'

describe 'Filter: humanize', () ->

  # load the filter's module
  beforeEach module 'nodeExecuterApp'

  # initialize a new instance of the filter before each test
  humanize = {}
  beforeEach inject ($filter) ->
    humanize = $filter 'humanize'

  it 'should return the input prefixed with "humanize filter:"', () ->
    text = 'angularjs'
    expect(humanize text).toBe ('humanize filter: ' + text)
