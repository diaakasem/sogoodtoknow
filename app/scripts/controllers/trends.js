'use strict';


angular.module('nodeExecuterApp')
  .controller('TrendsCtrl', function($scope, $http){
    $scope.trendsFor = function(place){
      debugger;
      const promise = $http.get(`/trends/${place}`);
      promise.then(function(res){
        console.log(res);
        res = res.data;
        if (!res || !res.length) {
          console.log(`No result for ${place}`);
          return $scope.trends = [];
        } else {
          return $scope.trends = res;
        }
      });

      return promise.catch(res=> console.error(res));
    }
  });
