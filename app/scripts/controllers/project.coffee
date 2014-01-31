"use strict"
controller = (scope, http, params, timeout) ->

  scope.pathOf = (img)->
    "projects/#{scope.project.name}/images/#{img}"

  scope.isSvg = (name)->
    return false  unless name
    name = name.toLowerCase()
    res = _.str.endsWith(name, 'svg')
    res

  promise = http method: 'get', url: "/project/#{params.name}"
  promise.success (result)=>
    scope.project = result
    i = 0
    $('.image img').attr 'src', scope.pathOf(scope.project.images[i++])

    audioElement = document.createElement('audio')
    audioElement.src = result.audio
    audioElement.play()
    audioElement.addEventListener "loadedmetadata", (event)=>
      scope.duration = audioElement.duration
      time = Math.floor(scope.duration * 1000 /scope.project.images.length)
      scroll = $('.text')[0].scrollHeight / scope.project.images.length
      changeImage = ->
        $('.image img').fadeOut 500, =>
          $('.image img').attr 'src', scope.pathOf(scope.project.images[i++])
          $('.image img').fadeIn 500
          scrollTo = scroll * (i - 1)
          console.log scroll
          console.log i
          console.log "Scroll to #{scrollTo}"
          $('.text').animate({
            scrollTop: scrollTo - 60
          }, 1000)

          timeout changeImage, time

      timeout changeImage, time

angular.module("nodeExecuterApp")
.controller "ProjectCtrl", ['$scope', '$http', '$routeParams', '$timeout', controller]
