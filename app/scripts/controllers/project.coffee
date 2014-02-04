"use strict"
controller = (root, scope, http, params, timeout, location) ->

  scope.project = {}
  scope.project.images = []
  scope.pathOf = (img)->
    "projects/#{scope.project.name}/images/#{img}"

  scope.isSvg = (name)->
    return false  unless name
    name = name.toLowerCase()
    res = _.str.endsWith(name, 'svg') or _.str.endsWith(name, 'gif')
    res

  scope.remove = ->
    h = http
      method: 'delete'
      url: "/project/#{scope.project.name}"

    h.success (res)->
      console.log res
      location.path '/'

    h.error (err)->
      console.log err

  scope.markVideoed = ->
    h = http
      method: 'post'
      url: "/project/#{scope.project.name}"
      data:
        status: 'videoed'

    h.success (res)->
      console.log res

    h.error (err)->
      console.log err

  promise = http method: 'get', url: "/project/#{params.name}"
  promise.success (result)=>
    scope.project = result
    scope.project.images = _.filter scope.project.images, (image)->
      !scope.isSvg(image.name)
    i = 0
    imgPath = scope.pathOf(scope.project.images[i++].name)
    $('.image img').attr 'src', imgPath

    # Fitting before speaking
    timeout ->
      fit($('.image img')[0], $('.image')[0], { vAlign: fit.CENTER })
    , 1000

    scope.start = _.once ->
      root.audioElement.src = "projects/#{scope.project.name}/audio.aiff.mp3"
      root.audioElement.play()
      onAudio = (event)=>
        scope.duration = root.audioElement.duration
        time = Math.floor(scope.duration * 1000 /scope.project.images.length)
        imgCount = scope.project.images.length
        splits = if imgCount < 5 then imgCount else imgCount + 1
        scroll = $('.text')[0].scrollHeight / splits

        scrollFn = ->
          scrollTo = scroll * i
          $('.text').animate({ scrollTop: scrollTo }, 1000)

        changeImage = ->
          if i >= imgCount
            scrollFn()
            scope.markVideoed()
            return

          $('.image img').fadeOut 500, =>
            $('.image img').attr 'src', scope.pathOf(scope.project.images[i].name)
            $('.image img').fadeIn 500
            timeout ->
              fit($('.image img')[0], $('.image')[0], { vAlign: fit.CENTER })
            , 80
            scrollFn()
            i++
            scope.imageTimer = timeout changeImage, time
        scope.imageTimer = timeout changeImage, time

      root.audioElement.addEventListener "loadedmetadata", onAudio
      root.$on '$routeChangeStart', ->
        timeout.cancel(scope.imageTimer)
        root.audioElement.removeEventListener "loadedmetadata", onAudio

    
    # To have a space to cut the movie when everything is loaded
    #timeout start, 2000


angular.module("nodeExecuterApp")
.controller "ProjectCtrl",
['$rootScope', '$scope', '$http', '$routeParams', '$timeout', '$location',
controller]
