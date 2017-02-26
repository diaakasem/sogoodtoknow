'use strict';

angular.module('nodeExecuterApp')
.controller('VideoedCtrl',
 function($scope, $http) {
  const promise = $http({
    method: 'post',
    url: '/project/',
    data: {
      status: 'videoed'
    }
  });

  $scope.by_name = '';
  return promise.then(result=> $scope.articles = result.data);
});
