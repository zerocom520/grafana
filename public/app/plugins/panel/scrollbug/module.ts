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
  loading = false;

  /** @ngInject **/
  constructor($scope, $injector, private backendSrv, private $q, private datasourceSrv, private timeSrv) {
    super($scope, $injector);
    this.events.on('refresh', this.onRefresh.bind(this));
  }

  onRefresh() {
    this.loading = true;
    return this.makeRequest(1).then(() => {
      console.log('all completed');
    }).finally(() => {
      this.loading = false;
    });
  }

  makeRequest(nr) {
    const options = {
      "url": "api/search",
      "method": "GET",
      "requestId": this.panel.id + '-' + nr,
    };

    let range = this.timeSrv.timeRange();
    let rangeRaw = range.raw;

    this.startTime = moment();
    return this.datasourceSrv.get(null).then(ds => {
      return ds.query({
        panelId: this.panel.id,
        range: range,
        rangeRaw: rangeRaw,
        interval: '10s',
        intervalMs: 10000,
        targets: [
          {target: 'apps.*.*.counters.requests.count'}
        ],
        maxDataPoints: 2000,
        scopedVars: {},
      });

      // return this.backendSrv.datasourceRequest(options).then(data => {
      //   this['httpGet' + nr] += `<p>Http Get ${nr} completed: ${moment().diff(this.startTime).toString()}</p>`;
      //   if (nr === 1) {
      //     return this.$q.all([
      //       this.makeRequest(2),
      //       this.makeRequest(3),
      //     ]);
      //   }
      // });
    });
  }
}

export {ScrollBugPanelCtrl as PanelCtrl};
