"use strict";

    // To have a space to cut the movie when everything is loaded
    //timeout start, 2000


angular.module("nodeExecuterApp")
.controller("ProjectCtrl",function(
    $rootScope, $scope, $http, $routeParams, $timeout, $location
) {

  $scope.project = {};
  $scope.project.images = [];
  $scope.pathOf = img=> `projects/${$scope.project.name}/images/${img}`;

  const imageExtensions = ['png', 'jpg', 'jpeg'];
  $scope.isEmpty = function(name){
    if (!name) { return true; }
    for (let ext of imageExtensions) {
      if (_.str.endsWith(name.toLowerCase(), ext)) {
        return false;
      }
    }
    return true;
  };

  $scope.isSvg = function(name){
    if (!name) { return false; }
    return _.str.endsWith(name.toLowerCase(), 'svg');
  };

  $scope.setBackgroundTheme = function() {
      if ($scope.backgroundThemeName != 'background') {
          $timeout(function() {
              $rootScope.backgroundTheme = $scope.backgroundThemeName || 'background';
          }, 100);
      }
      $rootScope.backgroundTheme = 'background';
  };

  $scope.remove = function(){
    const h = $http({
      method: 'delete',
      url: `http://localhost:4000/project/${$scope.project._id}`
    });
    h.then(function(res){
      console.log(res);
      return $location.path('/');
    });
    return h.catch(err=> console.log(err));
  };

  $scope.rebuild = function() {
    const url = $scope.project.name;
    const promise = $http({
      method: 'post',
      url: `http://localhost:4000/build/url/${url}`,
      data: {
        url
      }
    });

    promise.then(function(result){
      console.log(result);
      return $location.path('/');
    });

    return promise.catch(error=> console.log(error));
  };

  $scope.selectImage = function(image) {
      $scope.project.selectedImage = image;
      if (!$rootScope.backgroundAudio) {
          $rootScope.backgroundAudio = document.createElement('audio');
          $rootScope.backgroundAudio.setAttribute("loop", "");
      }
      $rootScope.backgroundAudio.src = 'sounds/1.mp3';
      $rootScope.backgroundAudio.volume = 0.03;
      $rootScope.backgroundAudio.play();
  };

  $scope.mark = function(status, stay){
    const h = $http({
      method: 'post',
      url: `http://localhost:4000/project/${$scope.project._id}`,
      data: {
        status
      }
    });

    h.then(function(res){
      console.log(res);
      if (!stay) {
        return $location.path('/');
      }
    });

    return h.catch(err=> console.log(err));
  };

  const promise = $http({
      method: 'get',
      url: `http://localhost:4000/project/${$routeParams.id}`
  });
  return promise.then(result=> {
    $scope.project = result.data;
    $scope.project.images = _.filter($scope.project.images, image=>
      // if svg or incorrect extension ( remove it )
      !$scope.isSvg(image.name) && !$scope.isEmpty(image.name)
    );
    let i = 0;
    const pImage = $scope.project.images[i++];
    if (pImage) {
        const imgPath = $scope.pathOf(pImage.name);
        $('.image img').attr('src', imgPath);

        // Fitting before speaking
        $timeout(() => fit($('.image img')[0], $('.image')[0], { vAlign: fit.CENTER }) , 1000);
    }

    $scope.start = _.once(function() {
      $rootScope.audioElement.src = `projects/${$scope.project.name}/audio.aiff.mp3`;
      $rootScope.audioElement.play();
      const onAudio = (event) => {
        $scope.duration = $rootScope.audioElement.duration;
        const time = Math.floor(($scope.duration * 1000) /$scope.project.images.length);
        const imgCount = $scope.project.images.length;
        // const splits = imgCount < 5 ? imgCount : imgCount + 1;

        var changeImage = function() {
          if (i >= imgCount) {
              $('.image img').fadeOut(500);
              $timeout(()=> $scope.project.done = true, 500);
              return;
          }
          $scope.subscribe = false;
          if (i === 3) {
              $scope.subscribe = true;
          }
          i++;
          return $('.image img').fadeOut(500, () => {
              const image = $scope.project.images[i];
              if (image) {
                  $('.image img').attr('src', $scope.pathOf(image.name));
              }
              $('.image img').fadeIn(500);
              $timeout(() => fit($('.image img')[0], $('.image')[0], {
                  vAlign: fit.CENTER
              }) , 80);
              $timeout.cancel($scope.imageTimer);
              return $scope.imageTimer = $timeout(changeImage, time);
          });
        };
        $timeout.cancel($scope.imageTimer);
        return $scope.imageTimer = $timeout(changeImage, time);
      };

      $rootScope.audioElement.addEventListener("loadedmetadata", onAudio);
      return $rootScope.$on('$routeChangeStart', function() {
        $timeout.cancel($scope.imageTimer);
        return $rootScope.audioElement.removeEventListener("loadedmetadata", onAudio);
      });
    });

    $scope.begin = function() {
      $scope.project.ready = true;
      $scope.start();
      $timeout(() => fit($('.image img')[0], $('.image')[0], {
        vAlign: fit.CENTER
      }), 1);
    };
  }
  );
});
