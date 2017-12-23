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
     * @name auth-api-keys.apiKeysService
     *
     * @description
     * Responsible for retrieving API Keys from the server.
     */
    angular
        .module('auth-api-keys')
        .factory('apiKeysService', service);

    service.$inject = ['$resource', 'authUrl'];

    function service($resource, authUrl) {

        var resource = $resource(authUrl('/api/apiKeys/:token'), {}, {
            query: {
                method: 'GET',
                isArray: false,
                url: authUrl('/api/apiKeys')
            }
        });

        return {
            create: create,
            query: query,
            remove: remove
        };

        /**
         * @ngdoc method
         * @methodOf auth-api-keys.apiKeysService
         * @name create
         *
         * @description
         * Creates new API Key.
         *
         * @return {Promise} new API Key
         */
        function create() {
            return resource.save().$promise;
        }

        /**
         * @ngdoc method
         * @methodOf auth-api-keys.apiKeysService
         * @name remove
         *
         * @description
         * Removes API keys.
         *
         * @param  {String}  token the API key that will be removed
         * @return {Promise}       resolves if API Key was removed successfully
         */
        function remove(token) {
            return resource.remove({
                token: token
            }).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf auth-api-keys.apiKeysService
         * @name query
         *
         * @description
         * Gets page of API Keys.
         *
         * @param  {Object}  params the search params
         * @return {Promise}        the API Keys page
         */
        function query(params) {
            return resource.query(params).$promise;
        }
    }
})();
