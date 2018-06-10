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
     * @name openlmis-reset-password.changePasswordFactory
     *
     * @description
     * Factory that connects to OpenLMIS Auth Service and resets a user's
     * password.
     */
    angular
        .module('openlmis-reset-password')
        .factory('changePasswordFactory', factory);

    factory.$inject = ['openlmisUrlFactory', '$http'];

    function factory(openlmisUrlFactory, $http) {
        return {
            changePassword: changePassword
        };

        /**
         * @ngdoc method
         * @methodOf openlmis-reset-password.changePasswordFactory
         * @name changePasswordFactory
         *
         * @description
         * Calls the server that changes user account password.
         *
         * @param  {String}  newPassword New password for user account
         * @param  {String}  token       Token that identifies user
         * @return {Promise}             Resolves when password is changed successfully.
         */
        function changePassword(newPassword, token) {
            var changePasswordURL = openlmisUrlFactory('/api/users/auth/changePassword'),
                data = {
                    token: token,
                    newPassword: newPassword
                };

            return $http({
                method: 'POST',
                url: changePasswordURL,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }

})();
