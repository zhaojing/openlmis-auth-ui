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
     * @name openlmis-auth.permissionStringsService
     *
     * @description
     * Gets and locally stores a user's permission strings.
     */
    angular
        .module('openlmis-auth')
        .service('permissionStringsService', service);

    service.$inject = ['$q', '$http', 'authUrl', 'authorizationService', 'localStorageService'];

    function service($q, $http, authUrl, authorizationService, localStorageService) {
        var service = this;

        service.getAll = getStrings;
        service.set = saveStrings;

        function getStrings() {
            var deferred = $q.defer();

            getCachedPermissionStrings()
            .catch(function() {
                return getPermissionStringsFromServer()
                .then(service.set);
            })
            .then(function(permissionStrings){
                deferred.resolve(permissionStrings);
            })
            .catch(deferred.reject);
            
            return deferred.promise;
        }

        function saveStrings(strings) {
            localStorageService.add('permissionStrings', angular.toJson(strings));
            return $q.resolve(strings);
        }

        function getCachedPermissionStrings() {
            var permissionStrings = angular.fromJson(localStorageService.get('permissionStrings'));

            if(permissionStrings && Array.isArray(permissionStrings) && permissionStrings.length > 0) {
                return $q.resolve(permissionStrings);
            } else {
                return $q.reject();
            }
        }

        function getPermissionStringsFromServer() {
            var user = authorizationService.getUser(),
                deferred = $q.defer();

            $http.get(authUrl('/api/users/' + user.user_id + '/permissionStrings'))
            .then(function(response){
                deferred.resolve(response.data);
            })
            .catch(function(){
                deferred.reject();
            });

            return deferred.promise;           
        }
    }

})();