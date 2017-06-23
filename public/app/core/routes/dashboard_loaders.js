define([
  '../core_module',
],
function (coreModule) {
  "use strict";

  coreModule.default.controller('LoadDashboardCtrl', function($scope, $routeParams, dashboardLoaderSrv, backendSrv, $location) {
    $scope.appEvent("dashboard-fetch-start");

    if (!$routeParams.slug  && !$routeParams.id) {
      backendSrv.get('/api/dashboards/home').then(function(homeDash) {
        if (homeDash.redirectUri) {
          $location.path('dashboard/' + homeDash.redirectUri);
        } else {
          var meta = homeDash.meta;
          meta.canSave = meta.canShare = meta.canStar = false;
          $scope.initDashboard(homeDash, $scope);
        }
      });
      return;
    }

    // // look up id by slug
    // if (!$routeParams.id) {
    //   return backendSrv.get('/api/dashboards/db/' + $routeParams.slug + '/id').then(function(res) {
    //     $location.path('dashboards/' + $routeParams.slug + '/' + res.id);
    //   });
    // }

    dashboardLoaderSrv.loadDashboard($routeParams.type, $routeParams.slug).then(function(result) {
      $scope.initDashboard(result, $scope);
    });

  });

  coreModule.default.controller('NewDashboardCtrl', function($scope) {
    $scope.initDashboard({
      meta: { canStar: false, canShare: false, isNew: true },
      dashboard: {
        title: "New dashboard",
        rows: [
          {
            title: 'Dashboard Row',
            height: '250px',
            panels:[],
            isNew: true,
          }
        ]
      },
    }, $scope);
  });

});
