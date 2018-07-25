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

    offlineNavigationInterceptor.$inject = [
        '$rootScope', 'alertService', 'loadingModalService', 'offlineService', '$state'
    ];

    function offlineNavigationInterceptor($rootScope, alertService, loadingModalService, offlineService, $state) {
        $rootScope.$on('$stateChangeStart', checkOffline);

        function checkOffline(event, toState, toStateParams, fromState, fromStateParams, options) {
            if (shouldPreventStateChange(toState, fromState, options)) {
                event.preventDefault();
                loadingModalService.close();
                alertService.error('openlmisNavigation.notAvailableOffline');
            }
        }

        function shouldPreventStateChange(toState, fromState, options) {
            return offlineService.isOffline() && !isAccessibleOffline(toState, fromState, options);
        }

        function isAccessibleOffline(toState, fromState, options) {
            return isGoingToParentState(toState, fromState, options) || hasOfflinePath(toState, fromState);
        }

        function isGoingToParentState(toState, fromState, options) {
            return fromState.name.indexOf(toState.name) > -1 && !options.reload;
        }

        function hasOfflinePath(toState, fromState) {
            if (toState.isOffline) {
                var toStateParents = getParentStates(toState),
                    fromStateParents = getParentStates(fromState);

                var accessibleOffline = true;
                toStateParents.forEach(function(parent) {
                    if (fromStateParents.indexOf(parent) === -1 && !$state.get(parent).isOffline) {
                        accessibleOffline = false;
                    }
                });

                return accessibleOffline;
            }

            return false;
        }

        function getParentStates(state) {
            var stateName = state.name;
            if (stateName.lastIndexOf('.') > -1) {
                stateName = stateName.slice(0, stateName.lastIndexOf('.'));
            }

            var parentStates = [];
            while (stateName.lastIndexOf('.') > -1) {
                parentStates.push(stateName);
                stateName = stateName.slice(0, stateName.lastIndexOf('.'));
            }

            return parentStates;
        }
    }

})();
