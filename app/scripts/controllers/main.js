"use strict";

angular.module("nodeExecuterApp")
  .controller("MainCtrl", function($scope, $http) {
    const promise = $http({
      method: 'post',
      url: '/project/',
      data: {
        status: 'created'
      }
    });

    $scope.by_name = '';
    return promise.then(function(result){
      console.log(result);
      return $scope.articles = result.data;
    });
  });
