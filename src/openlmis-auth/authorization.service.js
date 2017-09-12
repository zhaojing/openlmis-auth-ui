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
     * @name openlmis-auth.authorizationService
     *
     * @description
     * This service is responsible for storing user authentication details,
     * such as the current user's id, name, and access token.
     * 
     * This service only stores information, other services and factories are
     * responsible for writing user information to the authorizationService.
     *
     * This is meant to be the primary source of user authentication
     * information.
     */
    angular
        .module('openlmis-auth')
        .service('authorizationService', service)

    var storageKeys = {
        'ACCESS_TOKEN': 'ACCESS_TOKEN',
        'USER_ID': 'USER_ID',
        'USERNAME': 'USERNAME'
    };

    service.$inject = ['$q', 'localStorageService', '$injector', '$filter'];

    function service($q, localStorageService, $injector, $filter) {

        this.clearAccessToken = clearAccessToken;
        this.clearUser = clearUser;
        this.getAccessToken = getAccessToken;
        this.getUser = getUser;
        this.setUser = setUser;
        this.isAuthenticated = isAuthenticated;
        this.setAccessToken = setAccessToken;

        /**
         * @ngdoc method
         * @methodOf openlmis-auth.authorizationService
         * @name getAccessToken
         *
         * @description
         * Retrieves the current access token.
         *
         * @return {String} the current access token
         */
        function getAccessToken() {
            return localStorageService.get(storageKeys.ACCESS_TOKEN);
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-auth.authorizationService
         * @name setAccessToken
         *
         * @description
         * Sets the access token.
         *
         * @param {String} token the token to be stored
         */
        function setAccessToken(token) {
            localStorageService.add(storageKeys.ACCESS_TOKEN, token);
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-auth.authorizationService
         * @name clearAccessToken
         *
         * @description
         * Removed the stored token from the local storage.
         */
        function clearAccessToken() {
            return localStorageService.remove(storageKeys.ACCESS_TOKEN);
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-auth.authorizationService
         * @name isAuthenticated
         *
         * @description
         * Checks whether user is authenticated.
         *
         * @return {Boolean} true if the user is authenticated, false otherwise
         */
        function isAuthenticated() {
            return !!getAccessToken();
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-auth.authorizationService
         * @name getUser
         *
         * @description
         * Retrieves basic information(username and user ID) about the user.
         *
         * @return {Object} the basic information about the user
         */
        function getUser() {
            return {
                username: localStorageService.get(storageKeys.USERNAME),
                user_id: localStorageService.get(storageKeys.USER_ID)
            };
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-auth.authorizationService
         * @name setUser
         *
         * @description
         * Saves the given user ID and username to the local storage.
         *
         * @param {String} username Username for the current user
         * @param {String} user_id  User ID for the current user
         */
        function setUser(user_id, username) {
            localStorageService.add(storageKeys.USERNAME, username);
            localStorageService.add(storageKeys.USER_ID, user_id);
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-auth.authorizationService
         * @name clearUser
         *
         * @description
         * Removes the username and user ID from the local storage.
         */
        function clearUser() {
            localStorageService.remove(storageKeys.USERNAME);
            localStorageService.remove(storageKeys.USER_ID);
        }

    }

})();
