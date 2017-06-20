///<reference path="../../headers/common.d.ts" />

import config from 'app/core/config';
import store from 'app/core/store';
import _ from 'lodash';
import angular from 'angular';
import $ from 'jquery';

import coreModule from 'app/core/core_module';
import {profiler} from 'app/core/profiler';
import appEvents from 'app/core/app_events';

export class GrafanaCtrl {

  /** @ngInject */
  constructor($scope, alertSrv, utilSrv, $rootScope, $controller, contextSrv) {

    $scope.init = function() {
      $scope.contextSrv = contextSrv;

      $rootScope.appSubUrl = config.appSubUrl;
      $scope._ = _;

      profiler.init(config, $rootScope);
      alertSrv.init();
      utilSrv.init();

      $scope.dashAlerts = alertSrv;
    };

    $scope.initDashboard = function(dashboardData, viewScope) {
      $scope.appEvent("dashboard-fetch-end", dashboardData);
      $controller('DashboardCtrl', { $scope: viewScope }).init(dashboardData);
    };

    $rootScope.onAppEvent = function(name, callback, localScope) {
      var unbind = $rootScope.$on(name, callback);
      var callerScope = this;
      if (callerScope.$id === 1 && !localScope) {
        console.log('warning rootScope onAppEvent called without localscope');
      }
      if (localScope) {
        callerScope = localScope;
      }
      callerScope.$on('$destroy', unbind);
    };

    $rootScope.appEvent = function(name, payload) {
      $rootScope.$emit(name, payload);
      appEvents.emit(name, payload);
    };

    $scope.init();
  }
}

/** @ngInject */
export function grafanaAppDirective(playlistSrv, contextSrv) {
  return {
    restrict: 'E',
    controller: GrafanaCtrl,
    link: (scope, elem) => {
      var ignoreSideMenuHide;
      var body = $('body');

      // see https://github.com/zenorocha/clipboard.js/issues/155
      $.fn.modal.Constructor.prototype.enforceFocus = function() {};

      // handle sidemenu open state
      scope.$watch('contextSrv.sidemenu', newVal => {
        if (newVal !== undefined) {
          body.toggleClass('sidemenu-open', scope.contextSrv.sidemenu);
          if (!newVal) {
            contextSrv.setPinnedState(false);
          }
        }
        if (contextSrv.sidemenu) {
          ignoreSideMenuHide = true;
          setTimeout(() => {
            ignoreSideMenuHide = false;
          }, 300);
        }
      });

      scope.$watch('contextSrv.pinned', newVal => {
        if (newVal !== undefined) {
          body.toggleClass('sidemenu-pinned', newVal);
        }
      });

      // tooltip removal fix
      // manage page classes
      var pageClass;
      scope.$on("$routeChangeSuccess", function(evt, data) {
        if (pageClass) {
          body.removeClass(pageClass);
        }

        if (data.$$route) {
          pageClass = data.$$route.pageClass;
          if (pageClass) {
            body.addClass(pageClass);
          }
        }

        $("#tooltip, .tooltip").remove();

        // check for kiosk url param
        if (data.params.kiosk) {
          appEvents.emit('toggle-kiosk-mode');
        }
      });

      // handle kiosk mode
      appEvents.on('toggle-kiosk-mode', () => {
        body.toggleClass('page-kiosk-mode');
      });

      // handle in active view state class
      var lastActivity = new Date().getTime();
      var activeUser = true;
      var inActiveTimeLimit = 60 * 1000;

      function checkForInActiveUser() {
        if (!activeUser) {
          return;
        }
        // only go to activity low mode on dashboard page
        if (!body.hasClass('page-dashboard')) {
          return;
        }

        if ((new Date().getTime() - lastActivity) > inActiveTimeLimit) {
          activeUser = false;
          body.addClass('user-activity-low');
        }
      }

      function userActivityDetected() {
        lastActivity = new Date().getTime();
        if (!activeUser) {
          activeUser = true;
          body.removeClass('user-activity-low');
        }
      }

      // mouse and keyboard is user activity
      body.mousemove(userActivityDetected);
      body.keydown(userActivityDetected);
      // treat tab change as activity
      document.addEventListener('visibilitychange', userActivityDetected);

      // check every 2 seconds
      setInterval(checkForInActiveUser, 2000);

      appEvents.on('toggle-view-mode', () => {
        lastActivity = 0;
        checkForInActiveUser();
      });

      // handle document clicks that should hide things
      body.click(function(evt) {
        var target = $(evt.target);
        if (target.parents().length === 0) {
          return;
        }

        // for stuff that animates, slides out etc, clicking it needs to
        // hide it right away
        var clickAutoHide = target.closest('[data-click-hide]');
        if (clickAutoHide.length) {
          var clickAutoHideParent = clickAutoHide.parent();
          clickAutoHide.detach();
          setTimeout(function() {
            clickAutoHideParent.append(clickAutoHide);
          }, 100);
        }

        if (target.parents('.dash-playlist-actions').length === 0) {
          playlistSrv.stop();
        }

        // hide search
        if (body.find('.search-container').length > 0) {
          if (target.parents('.search-container').length === 0) {
            scope.$apply(function() {
              scope.appEvent('hide-dash-search');
            });
          }
        }

        // hide menus
        var openMenus = body.find('.navbar-page-btn--open');
        if (openMenus.length > 0) {
          if (target.parents('.navbar-page-btn--open').length === 0) {
            openMenus.removeClass('navbar-page-btn--open');
          }
        }

        // hide sidemenu
        if (!ignoreSideMenuHide && !contextSrv.pinned && body.find('.sidemenu').length > 0) {
          if (target.parents('.sidemenu').length === 0) {
            scope.$apply(function() {
              scope.contextSrv.toggleSideMenu();
            });
          }
        }

        // hide popovers
        var popover = elem.find('.popover');
        if (popover.length > 0 && target.parents('.graph-legend').length === 0) {
          popover.hide();
        }
      });
    }
  };
}

coreModule.directive('grafanaApp', grafanaAppDirective);
