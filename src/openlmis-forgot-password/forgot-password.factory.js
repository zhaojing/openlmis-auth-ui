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
     * @name openlmis-forgot-password.forgotPasswordFactory
     *
     * @description
     * Factory that connects to OpenLMIS Auth Service to reset password.
     */
    angular
        .module('openlmis-forgot-password')
        .factory('forgotPasswordFactory', factory);

    factory.$inject = ['openlmisUrlFactory', '$http'];

    function factory(openlmisUrlFactory, $http) {
        return forgotPassword;
        
        /**
         * @ngdoc method
         * @methodOf openlmis-forgot-password.forgotPasswordFactory
         * @name forgotPasswordFactory
         *
         * @param  {String}  email Mail address where reset password link will be sent
         * @return {Promise}       Forgot password promise
         *
         * @description
         * Calls the server that sends message with reset password link to given
         * email address.
         */
        function forgotPassword(email) {
            var forgotPasswordURL = openlmisUrlFactory('/api/users/auth/forgotPassword?email=' + email);

            return $http({
                method: 'POST',
                url: forgotPasswordURL,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }

})();
