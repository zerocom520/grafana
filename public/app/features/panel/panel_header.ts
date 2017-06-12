///<reference path="../../headers/common.d.ts" />

import $ from 'jquery';
import angular from 'angular';
import {coreModule} from 'app/core/core';

var template = `
<div class="panel-header drag-handle">
  <span class="panel-info-corner">
    <i class="fa"></i>
    <span class="panel-info-corner-inner"></span>
  </span>

  <span class="icon-gf panel-alert-icon"></span>
  <span class="panel-header__title drag-handle">{{panelCtrl.panel.title | interpolateTemplateVars:panelCtrl}}</span>
  <span class="panel-header__menu-container dropdown">
    <span class="fa fa-caret-down panel-menu-toggle" data-toggle="dropdown"></span>
    <ul class="dropdown-menu panel-menu" role="menu">
      <li>
        <a ng-click="panelCtrl.addDataQuery(datasource);">
          <i class="fa fa-cog"></i> Edit <span class="dropdown-menu-item-shortcut">e</span>
        </a>
      </li>
      <li><a ng-click="panelCtrl.addDataQuery(datasource);"><i class="fa fa-eye"></i> View</a></li>
      <li><a ng-click="panelCtrl.addDataQuery(datasource);"><i class="fa fa-share-square-o"></i> Share</a></li>
      <li class="dropdown-submenu">
        <a ng-click="panelCtrl.addDataQuery(datasource);"><i class="fa fa-cube"></i> Actions</a>
        <ul class="dropdown-menu panel-menu">
          <li><a ng-click="panelCtrl.addDataQuery(datasource);"><i class="fa fa-flash"></i> Add Annotation</a></li>
          <li><a ng-click="panelCtrl.addDataQuery(datasource);"><i class="fa fa-bullseye"></i> Toggle Legend</a></li>
          <li><a ng-click="panelCtrl.addDataQuery(datasource);"><i class="fa fa-download"></i> Export to CSV</a></li>
          <li><a ng-click="panelCtrl.addDataQuery(datasource);"><i class="fa fa-eye"></i> View JSON</a></li>
        </ul>
      </li>
      <li><a ng-click="panelCtrl.addDataQuery(datasource);"><i class="fa fa-trash"></i> Remove</a></li>
    </ul>
  </span>

  <span class="panel-time-info" ng-show="ctrl.timeInfo"><i class="fa fa-clock-o"></i> {{ctrl.timeInfo}}</span>

  <span class="panel-loading" ng-show="ctrl.loading">
    <i class="fa fa-spinner fa-spin"></i>
  </span>
</div>
`;

/** @ngInject **/
function panelHeader() {
  return {
    restrict: 'E',
    template: template,
    scope: {
      "panelCtrl": "=",
    },
    link: function(scope, elem, attrs) {

      elem.click(function(evt) {
        const targetClass = evt.target.className;

        if (targetClass.indexOf('drag-handle') !== -1) {
          evt.stopPropagation();
          elem.find('[data-toggle=dropdown]').dropdown('toggle');
        }

        // var toggleAttribute = evt.getAttribute('data-toggle');
        // if (!toggleAttribute) {
        //   elem.find('[data-toggle=dropdown]').click();
        // }
      });
    }
  };
}

coreModule.directive('panelHeader', panelHeader);
