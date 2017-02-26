'use strict';

angular.module('nodeExecuterApp')
  .controller('NewCtrl', function($scope, $http, $location){

  $scope.wikipedia = '';
  $scope.continus = false;
  $scope.inprogress = false;

  const exe = function(url, data){
    $scope.inprogress = true;
    const promise = $http({
      method: 'post',
      url,
      data
    });

    promise.then(function(result){
      $scope.inprogress = false;
      if ($scope.continus && (url.indexOf('random') > 0)) {
        return $scope.random();
      } else {
        return $location.path('/');
      }
    });

    return promise.catch(function(error){
      $scope.inprogress = false;
      return console.log(error);
    });
  };

  $scope.process = () => exe('/build/url/', {url: $scope.wikipedia});

  $scope.today = () => exe('/build/today/');

  return $scope.random = () => exe('/build/random/');
});
