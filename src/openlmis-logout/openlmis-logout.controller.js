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
     * @ngdoc controller
     * @name openlmis-logout.controller:LogoutController
     *
     * @description
     * Adds functionality that makes it possible for user to log out.
     */
    angular
        .module('openlmis-logout')
        .controller('LogoutController', LogoutController);

    LogoutController.$inject = [
        '$state', 'loginService', 'offlineService', 'confirmService', '$rootScope'
    ];

    function LogoutController($state, loginService, offlineService, confirmService, $rootScope) {
        var vm = this;

        vm.logout = logout;

        /**
         * @ngdoc method
         * @methodOf openlmis-navigation.controller:NavigationController
         * @name logout
         *
         * @description
         * Log outs user from application and redirects to login screen.
         */
        function logout() {
            if (offlineService.isOffline()) {
                confirmService.confirm('openlmisLogout.offlineWarning',
                    'openlmisLogout.logout')
                    .then(doLogout);
            } else {
                doLogout();
            }
        }

        function doLogout() {
            loginService.logout()
                .then(function() {
                    $rootScope.$emit('openlmis-auth.logout');
                    $state.go('auth.login');
                });
        }
    }

})();
