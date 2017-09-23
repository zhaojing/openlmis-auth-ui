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
     * @name openlmis-permissions.permissionService
     *
     * @description
     * Gets and stores a user's permissions from OpenLMIS. The permissions are
     * permission strings, which can be reformatted into different types of user
     * data.
     *
     * If there are permission strings stored locally, the OpenLMIS Auth
     * Service will not be queried for permission strings.
     *
     * A permission object is formatted like this
     *
     * ```
     *{
     *  right: 'EXAMPLE_RIGHT',
     *  facilityId: 'ABC-1234',
     *  programId: '9876-XYZ'
     *}
     * ```
     *
     * Permission strings are expected to be formatted like this
     * ```
     * EXAMPLE_RIGHT|ABC-1234|9876-XYZ
     * ```
     */
    angular
        .module('openlmis-permissions')
        .service('permissionService', service);

    service.$inject = ['$q', '$http', 'openlmisUrlFactory', 'localStorageService'];

    function service($q, $http, openlmisUrlFactory, localStorageService) {
        var savedUserId;  // Used in service.load

        this.hasPermission = hasPermission;
        this.load = load;
        this.empty = empty;

        /**
         * @ngdoc method
         * @methodOf openlmis-permissions.permissionService
         * @name hasPermission
         *
         * @param  {String} userId User to get test permission for
         * @param  {Object} permission Object representing a permission
         * @return {Promise} A promise that resolves a if there is a match
         *
         * @description
         * The returned promise will resolve if the browser has a matching 
         * permission. If there is no permission that EXACTLY matches, then
         * the promise is rejected.
         *
         * If the permission object that is tested against doesn't have a
         * 'right' property, then it is immedately rejected.
         */
        function hasPermission(userId, permission) {
            if(!permission) {
                return $q.reject();
            }

            if(!permission.hasOwnProperty('right')) {
                return $q.reject();
            }

            var deferred = $q.defer();

            this.load(userId)
            .then(function(permissionsList) {
                if(testPermissions(permissionsList, permission)) {
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            })
            .catch(function() {
                deferred.reject()
            });

            return deferred.promise;
        }

        function testPermissions(permissionsList, permission) {
            var i = 0;
            for(i; i < permissionsList.length; i++) {
                if(permissionMatch(permissionsList[i], permission.right, permission.facilityId, permission.programId)) {
                    return true;
                }
            }

            return false;
        }

        function permissionMatch(permission, right, facilityId, programId) {
            if(permission.right === right
                    && permission.facilityId === facilityId
                    && permission.programId === programId) {
                return true;
            } else {
                return false;
            }
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-permissions.permissionService
         * @name load
         *
         * @param {String} userId ID of user to get permissions for
         * 
         * @return {Promise} A promise with an Array of permission objects
         *
         * @description
         * This method returns a list of permission. If there is a list of
         * permissions cached in the browser, those permissions are returned.
         * Otherwise, the OpenLMIS Auth service will be queried for the
         * permission strings of the currently logged in user.
         *
         * The promise will be rejected if:
         * - The user isn't authenticated
         */
        function load(userId) {
            if(!userId) {
                savedUserId = undefined;
                this.empty();
                return $q.reject();
            }

            if(userId !== savedUserId) {
                savedUserId = userId;
                this.empty();
            }
            
            return getCachedPermissions()
            .catch(function() {
                return getPermissionStringsFromServer(userId)
                .then(parsePermissionStrings)
                .then(savePermissions);
            });
        }

        function parsePermissionStrings(permissionStrings) {
            var permissions = [];

            permissionStrings.forEach(function(string) {
                var parts = string.split('|');
                permissions.push({
                    right: parts[0],
                    facilityId: parts[1],
                    programId: parts[2]
                });
            });

            return $q.resolve(permissions);
        }

        function getPermissionStringsFromServer(userId) {
            if(!userId) {
                return $q.reject();
            }

            var deferred = $q.defer();

            $http.get(openlmisUrlFactory('/api/users/' + userId + '/permissionStrings'))
            .then(function(response) {
                deferred.resolve(response.data);
            })
            .catch(function() {
                deferred.reject();
            });

            return deferred.promise;           
        }

        function getCachedPermissions() {
            var permissions = angular.fromJson(localStorageService.get('permissions'));
            if(permissions && Array.isArray(permissions)) {
                return $q.resolve(permissions);
            } else {
                return $q.reject();
            }
        }

        function savePermissions(permissions) {
            localStorageService.add('permissions', angular.toJson(permissions));
            return $q.resolve(permissions);
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-permissions.permissionService
         * @name empty
         * 
         * @return {Promise} Promise resolves once cache is cleared
         *
         * @description
         * Clears the browser cache of any stored permissions.
         */
        function empty() {
            localStorageService.remove('permissions');
            return $q.resolve();
        }
    }

})();