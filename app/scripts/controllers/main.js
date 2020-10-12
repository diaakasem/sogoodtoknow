"use strict";

angular.module("nodeExecuterApp")
  .controller("MainCtrl", function($scope, $http) {
      const promise = $http.post('http://localhost:4000/project/', {
          status: 'created'
      });

    $scope.by_name = '';
    return promise.then(function(result){
      console.log(result.data);
      return $scope.articles = result.data;
    }).catch(function (e){
        console.error(e);
    });
  });
