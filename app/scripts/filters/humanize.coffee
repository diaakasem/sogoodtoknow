'use strict'

angular.module('nodeExecuterApp')
  .filter 'str', () ->
    (input, method) ->
      _.str[method] input
