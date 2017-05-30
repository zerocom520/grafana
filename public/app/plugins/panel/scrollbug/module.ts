///<reference path="../../../headers/common.d.ts" />

import _ from 'lodash';
import moment from 'moment';
import {PanelCtrl} from 'app/plugins/sdk';

class ScrollBugPanelCtrl extends PanelCtrl {
  static templateUrl = `module.html`;
  startTime: string;
  httpGet1: string;
  httpGet2: string;
  httpGet3: string;

  /** @ngInject **/
  constructor($scope, $injector, private backendSrv) {
    super($scope, $injector);
    this.events.on('refresh', this.onRefresh.bind(this));
    this.events.on('render', this.onRender.bind(this));
    this.onRender();
  }

  onRefresh() {
    this.render();
  }

  onRender() {
    this.startTime = moment();
    this.backendSrv.get('/api/search').then(() => {
      this.httpGet1 = 'Http Get Call1 completed: ' + moment().diff(this.startTime).toString();
    });
    this.backendSrv.get('/api/search').then(() => {
      this.httpGet2 = 'Http Get Call2 completed: ' + moment().diff(this.startTime).toString();
    });

    this.backendSrv.get('/api/search').then(() => {
      this.httpGet3 = 'Http Get Call3 completed: ' + moment().diff(this.startTime).toString();
    });

    this.renderingCompleted();
  }
}

export {ScrollBugPanelCtrl as PanelCtrl};
