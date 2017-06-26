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
     * @name openlmis-forgot-password.forgotPasswordModalService
     *
     * @description
     * Responsible for handling forgot password modal. Controls that there is only one modal open at
     * any given time.
     */
    angular
        .module('openlmis-forgot-password')
        .service('forgotPasswordModalService', forgotPasswordModalService);

    forgotPasswordModalService.$inject = ['openlmisModalService'];

    function forgotPasswordModalService(openlmisModalService) {
        var dialog;

        this.open = open;
        this.close = close;

        /**
         * @ngdoc method
         * @methodOf openlmis-forgot-password.forgotPasswordModalService
         * @name open
         *
         * @description
         * Opens the forgot password modal.
         *
         * @return {Promise}    the promise that is resolved when user successfully reset password
         */
        function open() {
            if (dialog) return dialog.promise;

            dialog = openlmisModalService.createDialog({
                backdrop  : 'static',
                keyboard  : false,
                templateUrl: 'openlmis-forgot-password/forgot-password.html',
                controller: 'ForgotPasswordController',
                controllerAs: 'vm',
                show: true
            });

            dialog.promise.finally(function() {
                dialog = undefined;
            });

            return dialog.promise;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-forgot-password.forgotPasswordModalService
         * @name close
         *
         * @description
         * Closes the forgot password modal if it is open.
         */
        function close() {
            if (dialog) {
                dialog.hide();
            }
        }

    }

})();
