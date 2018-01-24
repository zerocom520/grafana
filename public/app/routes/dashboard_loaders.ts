import coreModule from 'app/core/core_module';

export class LoadDashboardCtrl {
  /** @ngInject */
  constructor($scope, $routeParams, dashboardLoaderSrv, backendSrv, $location) {
    $scope.appEvent('dashboard-fetch-start');

    if (!$routeParams.slug) {
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

    // if no id redirect to new route
    if (!$routeParams.id) {
      backendSrv.get(`/api/dashboards/db/${$routeParams.slug}/id`).then(res => {
        if (res.id) {
          $location.path(`d/${res.id}/${$routeParams.slug}`);
        }
      });
      return;
    }

    dashboardLoaderSrv.loadDashboard($routeParams.type, $routeParams.slug, $routeParams.id).then(function(result) {
      $scope.initDashboard(result, $scope);
    });
  }
}

export class NewDashboardCtrl {
  /** @ngInject */
  constructor($scope, $routeParams) {
    $scope.initDashboard(
      {
        meta: {
          canStar: false,
          canShare: false,
          isNew: true,
          folderId: Number($routeParams.folderId),
        },
        dashboard: {
          title: 'New dashboard',
          panels: [
            {
              type: 'add-panel',
              gridPos: { x: 0, y: 0, w: 12, h: 9 },
              title: 'Panel Title',
            },
          ],
        },
      },
      $scope
    );
  }
}

coreModule.controller('LoadDashboardCtrl', LoadDashboardCtrl);
coreModule.controller('NewDashboardCtrl', NewDashboardCtrl);
