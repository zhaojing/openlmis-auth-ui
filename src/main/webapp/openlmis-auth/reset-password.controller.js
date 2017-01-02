/*
* This program is part of the OpenLMIS logistics management information system platform software.
* Copyright © 2013 VillageReach
*
* This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
*
* This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
* You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
*/

(function(){
    'use strict';

    /**
     * @ngdoc controller
     * @name openlmis-auth.ResetPasswordCtrl
     *
     * @description
     * Controller that drives the forgot password form.
     */
    angular.module('openlmis-auth')
    .controller('ResetPasswordCtrl', ResetPasswordCtrl);

    ResetPasswordCtrl.$inject = ['$state', '$stateParams', 'LoginService', 'Alert'];

    function ResetPasswordCtrl($state, $stateParams, LoginService, Alert) {

        var vm = this;

        vm.changePassword = changePassword;

        vm.token = $stateParams.token;

        /**
         * @ngdoc function
         * @name changePassword
         * @methodOf openlmis-auth.ResetPasswordCtrl
         *
         * @description
         * Checks if both passwords are valid and sends change password request to server.
         */
        function changePassword() {
            if(arePasswordsValid()) {
                LoginService.changePassword(vm.password, vm.token).then(function() {
                    Alert.success('password.reset.success', null, redirectToLogin);
                }, function() {
                    vm.error = 'msg.change.password.failed';
                });
            }
        }

        function arePasswordsValid() {
            var regex = /\d/g;

            if(vm.password !== vm.reenteredPassword) {
                vm.error = 'error.password.mismatch';
                return false;
            } else if(vm.password.length < 8) {
                vm.error = 'error.password.short';
                return false;
            } else if(!regex.test(vm.password)) {
                vm.error = 'error.password.number';
                return false;
            }
            return true;
        }

        function redirectToLogin() {
            $state.go('auth.login');
        }
    }
}());