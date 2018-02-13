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
        .service('authorizationService', service);

    var storageKeys = {
        'ACCESS_TOKEN': 'ACCESS_TOKEN',
        'USER_ID': 'USER_ID',
        'USERNAME': 'USERNAME',
        'USER_ROLE_ASSIGNMENTS': 'ROLE_ASSIGNMENTS'
    };

    service.$inject = ['localStorageService', '$filter', 'AuthUser'];

    function service(localStorageService, $filter, AuthUser) {

        this.isAuthenticated = isAuthenticated;

        this.getAccessToken = getAccessToken;
        this.setAccessToken = setAccessToken;
        this.clearAccessToken = clearAccessToken;

        this.getUser = getUser;
        this.setUser = setUser;
        this.clearUser = clearUser;

        this.getRights = getRights;
        this.setRights = setRights;
        this.clearRights = clearRights;

        this.hasRight = hasRight;
        this.hasRights = hasRights;
        this.getRightByName = getRightByName;

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
            if(this.getAccessToken()) {
                return true;
            } else {
                return false;
            }
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-auth.authorizationService
         * @name getAccessToken
         *
         * @description
         * Retrieves the current access token.
         *
         * @return {String} the current access token, or false if not set
         */
        function getAccessToken() {
            var accessToken = localStorageService.get(storageKeys.ACCESS_TOKEN);

            if(accessToken) {
                return accessToken;
            } else {
                return false;
            }
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-auth.authorizationService
         * @name setAccessToken
         *
         * @description
         * Sets the access token.
         *
         * @param  {String} token the token to be stored
         * @return {Boolean}      true if successfully stored
         */
        function setAccessToken(token) {
            if(token) {
                return localStorageService.add(storageKeys.ACCESS_TOKEN, token);
            } else {
                return false;
            }
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-auth.authorizationService
         * @name clearAccessToken
         *
         * @description
         * Removed the stored token from the local storage.
         *
         * @return {Boolean} true if successfully removed
         */
        function clearAccessToken() {
            return localStorageService.remove(storageKeys.ACCESS_TOKEN);
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
            var username = localStorageService.get(storageKeys.USERNAME),
                user_id = localStorageService.get(storageKeys.USER_ID);

            if(user_id && username) {
                return new AuthUser(user_id, username);
            } else {
                return false;
            }
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
         *
         * @return {Boolean} true if values are provided and stored successfully
         */
        function setUser(user_id, username) {
            var savedUserID,
                savedUsername;
            if(!user_id || !username) {
                return false;
            } else {
                savedUserID = localStorageService.add(storageKeys.USER_ID, user_id);
                savedUsername = localStorageService.add(storageKeys.USERNAME, username);

                return savedUserID && savedUsername;
            }
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-auth.authorizationService
         * @name clearUser
         *
         * @description
         * Removes the username and user ID from the local storage.
         *
         * @return {Boolean} true if user information successfully removed
         */
        function clearUser() {
            var usernameRemoved = localStorageService.remove(storageKeys.USERNAME),
                userIdRemoved = localStorageService.remove(storageKeys.USER_ID);

            return usernameRemoved && userIdRemoved;
        }


        /**
         * @ngdoc method
         * @methodOf openlmis-auth.authorizationService
         * @name getRights
         *
         * @description
         * Retrieves the list of user rights from the local storage.
         *
         * @return {Array} the list of user rights
         */
        function getRights() {
            return angular.fromJson(localStorageService.get(storageKeys.USER_ROLE_ASSIGNMENTS));
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-auth.authorizationService
         * @name setRights
         *
         * @description
         * Saves the given rights to the local storage.
         *
         * @param {Array} rights the list of rights
         */
        function setRights(rights) {
            localStorageService.add(
                storageKeys.USER_ROLE_ASSIGNMENTS,
                angular.toJson(rights)
            );
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-auth.authorizationService
         * @name clearRights
         *
         * @description
         * Removes user rights from the local storage.
         */
        function clearRights() {
            localStorageService.remove(storageKeys.USER_ROLE_ASSIGNMENTS);
        }


        /**
         * @ngdoc method
         * @methodOf openlmis-auth.authorizationService
         * @name hasRight
         *
         * @description
         * Checks whether user has the given right. If the details object is passed the validation
         * will be more strict.
         *
         * @param  {String}  rightName the name of the right
         * @param  {Object}  details   (optional) the details about the right
         * @return {Boolean}           true if the user has the right, false Otherwise
         */
        function hasRight(rightName, details) {
            if (!rightName) {
               throw "Right name is required";
            }

            var rights = $filter('filter')(getRights(), {
                name: rightName
            }, true);

            if (!rights) return false;

            if (rights.length) {
                var right = rights[0],
                    hasRight = true;

                if (rightName && details) {

                    if (details.programCode) {
                        hasRight = hasRight && right.programCodes.indexOf(details.programCode) > -1;
                    }

                    if (details.programId) {
                        hasRight = hasRight && right.programIds.indexOf(details.programId) > -1;
                    }

                    if (details.warehouseCode) {
                        hasRight = hasRight && right.warehouseCodes.indexOf(details.warehouseCode) > -1;
                    }

                    if (details.warehouseId) {
                        hasRight = hasRight && right.warehouseIds.indexOf(details.warehouseId) > -1;
                    }

                    if (details.supervisoryNodeCode) {
                        hasRight = hasRight && right.supervisoryNodeCodes.indexOf(details.supervisoryNodeCode) > -1;
                    }

                    if (details.supervisoryNodeId) {
                        hasRight = hasRight && right.supervisoryNodeIds.indexOf(details.supervisoryNodeId) > -1;
                    }

                    if (details.facilityId) {
                        hasRight = hasRight && right.facilityIds.indexOf(details.facilityId) > -1;
                    }
                }

                return hasRight;
            }

            return false;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-auth.authorizationService
         * @name hasRights
         *
         * @description
         * Checks whether user has the given rights.
         *
         * @param  {Array}   rightName the name of the right
         * @param  {Boolean} areAllRightsRequired indicates if all given rights are required
         * @return {Boolean}                      true if user has at least one/all of rights
         */
        function hasRights(rights, areAllRightsRequired) {
            var hasPermission;
            if(areAllRightsRequired) {
                hasPermission = true;
                angular.forEach(rights, function(right) {
                    if(!hasRight(right)) hasPermission = false;
                });
                return hasPermission;
            } else {
                hasPermission = false;
                angular.forEach(rights, function(right) {
                    if(hasRight(right)) hasPermission = true;
                });
                return hasPermission;
            }
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-auth.authorizationService
         * @name  getRightByName
         *
         * @description
         * Returns id of right with given name.
         *
         * @param  {String} rightName name of right which we want to get
         * @return {Object}           id of right which has the given name
         */
        function getRightByName(rightName) {
            var rights = $filter('filter')(getRights(), {
                name: rightName}, true);
            return angular.copy(rights[0]);
        }

    }

})();
