///<reference path="../../../headers/common.d.ts" />

import _ from 'lodash';
import moment from 'moment';
import {PanelCtrl} from 'app/plugins/sdk';

class ScrollBugPanelCtrl extends PanelCtrl {
  static templateUrl = `module.html`;
  startTime: string;
  httpGet1 = '';
  httpGet2 = '';
  httpGet3 = '';

  /** @ngInject **/
  constructor($scope, $injector, private backendSrv) {
    super($scope, $injector);
    this.events.on('refresh', this.onRefresh.bind(this));
    this.events.on('render', this.onRender.bind(this));
  }

  onRefresh() {
    this.render();
  }

  onRender() {
    const options = {
      "url": "api/search",
      "method": "GET",
      "requestId": "8A",
      "retry": 0,
      "timeout": {
        "$$state": {
          "status": 0
        }
      },
      "headers": {
        "X-Grafana-Org-Id": 1
      }
    };

    this.startTime = moment();
    this.backendSrv.datasourceRequest(options).then((data) => {
      this.httpGet1 += '<p>Http Get Call1 completed: ' + moment().diff(this.startTime).toString() + '</p>';
    });
    this.backendSrv.datasourceRequest(options).then(() => {
      this.httpGet2 += '<p>Http Get Call2 completed: ' + moment().diff(this.startTime).toString() + '</p>';
    });

    this.backendSrv.datasourceRequest(options).then(() => {
      this.httpGet3 += '<p>Http Get Call3 completed: ' + moment().diff(this.startTime).toString() + '</p>';
    });

    this.renderingCompleted();
  }
}

export {ScrollBugPanelCtrl as PanelCtrl};
