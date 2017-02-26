"use strict";

angular.module("nodeExecuterApp")
.controller('UploaddataCtrl',
 function($scope, $http, $routeParams) {

  $scope.project = {};

  const promise = $http({
    method: 'get',
    url: `/project/${routeParams.name}`
  });
  return promise.then(result=> {
    return $scope.project = result.data;
  });
});
