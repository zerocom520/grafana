///<reference path="../../headers/common.d.ts" />

import coreModule from 'app/core/core_module';

const  template = `
<div class="modal-body">
	<div class="modal-header">
		<h2 class="modal-header-title">
			<i class="fa fa-save"></i>
			<span class="p-l-1">Save changes</span>
		</h2>

		<a class="modal-header-close" ng-click="ctrl.dismiss();">
			<i class="fa fa-remove"></i>
		</a>
	</div>

	<form name="ctrl.saveForm" ng-submit="ctrl.save()" class="modal-content" novalidate>
    <div class="gf-form-inline">
      <gf-form-switch class="gf-form"
                        label="Save Time Range"
                        tooltip="Uncheck, then save and reload to disable all dashboard editing"
                        checked="dashboard.editable">
      </gf-form-switch>
			<gf-form-switch class="gf-form"
                      label="Save Variable State"
                      tooltip="Hide row controls. Shortcut: CTRL+H or CMD+H"
                      checked="dashboard.hideControls">
      </gf-form-switch>
	  </div>
		<div class="p-t-2">
			<div class="gf-form">
				<label class="gf-form-hint">
					<input
						type="text"
						name="message"
						class="gf-form-input"
						placeholder="Add a note to describe your changes"
						give-focus="true"
						ng-model="ctrl.message"
						ng-model-options="{allowInvalid: true}"
						ng-maxlength="this.max"
						autocomplete="off" />
					<small class="gf-form-hint-text muted" ng-cloak>
						<span ng-class="{'text-error': ctrl.saveForm.message.$invalid && ctrl.saveForm.message.$dirty }">
							{{ctrl.message.length || 0}}
						</span>
						/ {{ctrl.max}} characters
					</small>
				</label>
			</div>
    </div>

		<div class="gf-form-button-row text-center">
			<button type="submit" class="btn btn-success" ng-disabled="ctrl.saveForm.$invalid">Save</button>
			<button class="btn btn-inverse" ng-click="ctrl.dismiss();">Cancel</button>
		</div>
	</form>
</div>
`;

export class SaveDashboardModalCtrl {
  message: string;
  max: number;
  saveForm: any;
  dismiss: () => void;

  /** @ngInject */
  constructor(private $scope, private dashboardSrv) {
    this.message = '';
    this.max = 64;
  }

  save() {
    if (!this.saveForm.$valid) {
      return;
    }

    var dashboard = this.dashboardSrv.getCurrent();
    var saveModel = dashboard.getSaveModelClone();
    var options = {message: this.message};

    return this.dashboardSrv.save(saveModel, options).then(this.dismiss);
  }
}

export function saveDashboardModalDirective() {
  return {
    restrict: 'E',
    template: template,
    controller: SaveDashboardModalCtrl,
    bindToController: true,
    controllerAs: 'ctrl',
    scope: {dismiss: "&"}
  };
}

coreModule.directive('saveDashboardModal',  saveDashboardModalDirective);
