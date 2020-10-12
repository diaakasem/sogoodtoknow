'use strict';

angular.module('nodeExecuterApp')
.controller('UploadedCtrl',
 function($scope, $http) {
  const promise = $http({
    method: 'post',
    url: 'http://localhost:4000/project/',
    data: {
      status: 'uploaded'
    }
  });

  $scope.by_name = '';
  return promise.then(result=> $scope.articles = result.data);
});
