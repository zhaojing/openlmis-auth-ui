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

(function(){

    'use strict';

    /**
     * @ngdoc controller
     * @name openlmis-forgot-password.controller:ForgotPasswordController
     *
     * @description
     * Controller that drives the forgot password form.
     */
    angular
        .module('openlmis-forgot-password')
        .controller('ForgotPasswordController', controller);

    controller.$inject = ['forgotPasswordFactory', 'alertService', 'modalDeferred'];

    function controller(forgotPasswordFactory, alertService, modalDeferred) {
        var vm = this;

        vm.forgotPassword = forgotPassword;
        vm.cancel = modalDeferred.reject;

        /**
         * @ngdoc method
         * @methodOf openlmis-forgot-password.controller:ForgotPasswordController
         * @name forgotPassword
         *
         * @description
         * Requests sending reset password token to email address given in form.
         */
        function forgotPassword() {
            forgotPasswordFactory.sendResetEmail(vm.email)
            .then(function() {
                alertService.success(
                    'openlmisForgotPassword.resetPasswordAlert.title',
                    'openlmisForgotPassword.resetPasswordAlert.message'
                )
                .then(modalDeferred.resolve);
            })
            .catch(function() {
                vm.error = 'openlmisForgotPassword.passwordResetFailure';
            });
        }
    }
}());
