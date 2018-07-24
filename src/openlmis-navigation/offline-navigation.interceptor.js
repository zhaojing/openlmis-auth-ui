/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {
    'use strict';

    /**
     * @ngdoc service
     * @name openlmis-navigation.OfflineNavigation
     *
     * @description
     * Check if state being transitioned is able to be viewed offline, if the
     * browser is offline.
     */
    angular.module('openlmis-navigation')
        .run(offlineNavigationInterceptor);

    offlineNavigationInterceptor.$inject = ['$rootScope', 'alertService', 'loadingModalService', 'offlineService'];
    function offlineNavigationInterceptor($rootScope, alertService, loadingModalService, offlineService) {
        $rootScope.$on('$stateChangeStart', checkOffline);

        function checkOffline(event, toState, toStateParams, fromState, fromStateParams, options) {
            if (shouldPreventStateChange(toState, fromState, options)) {
                event.preventDefault();
                loadingModalService.close();
                alertService.error('openlmisNavigation.notAvailableOffline');
            }
        }

        function shouldPreventStateChange(toState, fromState, options) {
            if (!offlineService.isOffline()) {
                return false;
            }

            if (isGoingToParentState(toState, fromState, options)) {
                return false;
            }

            if (toState.isOffline) {
                return false;
            }

            return true;
        }

        function isGoingToParentState(toState, fromState, options) {
            return fromState.name.indexOf(toState.name) > -1 && !options.reload;
        }
    }

})();
