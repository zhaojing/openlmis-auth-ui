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
     * @ngdoc service
     * @name openlmis-permissions.userRightsFactory
     *
     * @description
     * Creates a list of rights for a user that can be used for quickly testing
     * user permissions.
     */
    angular
        .module('openlmis-permissions')
        .factory('userRightsFactory', factory);

    factory.$inject = ['$q', 'permissionService'];

    function factory($q, permissionService) {

        return buildRights;

        /**
         * @ngdoc method
         * @methodOf openlmis-permissions.userRightsFactory
         * @name buildRights
         *
         * @param {String} userId ID of user to build rights for
         * @return {Promise} Promise that will resolve into an arry of right objects
         *
         * @description
         * Loads permissions from the permission service, and turns them into a
         * collection of rights.
         *
         * Example right object:
         * ```
         * {
         *   name: "EXAMPLE_RIGHT",
         *   programIds: ["ABC-123"],
         *   supervisoryNodeIds: ["555-555-EFG"],
         *   warehouseIds: [], // Empty arrays are inserted into object as placeholder
         *   isDirect: false // Boolean that indicates that the right has no program or facility connections
         * }
         * ```
         */
        function buildRights(userId) {
            var deferred = $q.defer();

            if(!userId) {
                return $q.reject();
            }
            
            permissionService.load(userId)
            .then(buildRightsObject)
            .then(function(rights) {
                var rightsArray = [];

                Object.keys(rights).forEach(function(key) {
                    rightsArray.push(rights[key]);
                });

                deferred.resolve(rightsArray);
            });

            return deferred.promise;
        }
    }

    /**
     * @ngdoc method
     * @methodOf openlmis-permissions.userRightsFactory
     * @name  buildRightsObject
     * 
     * @param  {Array} permissions List of user permissions
     * @return {Object} Object of user rights
     *
     * @description
     * Transforms a list of permissions into an object with each key matching a
     * user right object.
     */
    function buildRightsObject(permissions) {
        var rights = {};

        function getRight(permission) {
            if(!rights.hasOwnProperty(permission.right)){
                rights[permission.right] = {
                    name: permission.right,
                    programIds: [],
                    facilityIds: [],
                    isDirect: true
                };
            }

            return rights[permission.right];
        }

        permissions.forEach(function(permission) {
            var right = getRight(permission);

            if(permission.programId && right.programIds.indexOf(permission.programId) === -1) {
                right.programIds.push(permission.programId);
                right.isDirect = false;
            }
            if(permission.facilityId && right.facilityIds.indexOf(permission.facilityId) === -1) {
                right.facilityIds.push(permission.facilityId);
                right.isDirect = false;
            }
        });

        return rights;
    }

})();
