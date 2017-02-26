'use strict';

angular.module('nodeExecuterApp')
.controller('UploadedCtrl',
 function($scope, $http) {
  const promise = $http({
    method: 'post',
    url: '/project/',
    data: {
      status: 'uploaded'
    }
  });

  $scope.by_name = '';
  return promise.then(result=> $scope.articles = result.data);
});
