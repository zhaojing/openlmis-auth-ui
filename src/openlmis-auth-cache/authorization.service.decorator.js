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
     * @name openlmis-auth-cache.authorizationService
     *
     * @description
     * Decorates authService with clearing cache method and caching user while getting by id.
     */
    angular.module('openlmis-auth-cache')
        .config(config);

    config.$inject = ['$provide'];

    function config($provide) {
        $provide.decorator('authorizationService', decorator);
    }

    decorator.$inject = ['$delegate', '$q', 'localStorageFactory', 'referencedataUserService'];
    function decorator($delegate, $q, localStorageFactory, referencedataUserService) {
        var originalGetUser = $delegate.getUser,
            userCache = localStorageFactory('user');

        $delegate.getUserInfo = getUserInfo;
        $delegate.clearUserCache = clearCache;

        return $delegate;

        /**
         * @ngdoc method
         * @methodOf openlmis-auth-cache.authorizationService
         * @name getUserInfo
         *
         * @description
         * Gets current user details from the
         * referencedata service, which is then stored and only retrieved from
         * the user's browser.
         *
         * @return {Promise}    promise that resolves with user info
         */
        function getUserInfo() {
            originalGetUser.apply($delegate, arguments)
                .then(function(user) {
                    var cachedUser = userCache.getBy('id', user.user_id);

                    if (cachedUser) {
                        return $q.resolve(cachedUser);
                    } else {
                        return referencedataUserService.get(user.user_id)
                            .then(function (refUser) {
                                userCache.put(refUser);
                                return user;
                            });
                    }
                });
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-auth-cache.authorizationService
         * @name clearUserCache
         *
         * @description
         * Deletes users stored in the browser cache.
         */
        function clearCache() {
            userCache.clearAll();
        }

    }
})();
