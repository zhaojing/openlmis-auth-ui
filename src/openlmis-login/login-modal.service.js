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
     * @name openlmis-login.loginModalService
     *
     * @description
     * Responsible for handling login modal. Controls that there is only one modal open at any given
     * time.
     */
    angular
        .module('openlmis-login')
        .service('loginModalService', loginModalService);

    loginModalService.$inject = ['openlmisModalService'];

    function loginModalService(openlmisModalService) {
        var dialog;

        this.open = open;
        this.close = close;

        /**
         * @ngdoc method
         * @methodOf openlmis-login.loginModalService
         * @name open
         *
         * @description
         * Opens the login modal.
         *
         * @return {Promise}    the promise that is resolved when user successfully logged in
         */
        function open() {
            if (dialog) return dialog.promise;

            dialog = openlmisModalService.createDialog({
                backdrop  : 'static',
                keyboard  : false,
                controller: 'LoginController',
                controllerAs: 'vm',
                templateUrl: 'openlmis-login/login-form.html',
                show: true
            });

            dialog.promise.finally(function() {
                dialog = undefined;
            });

            return dialog.promise;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-login.loginModalService
         * @name close
         *
         * @description
         * Closes the login modal if it is open.
         */
        function close() {
            if (dialog) {
                dialog.hide();
            }
        }

    }

})();
