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
     * @name openlmis-currency.currencyCacheService
     *
     * @description
     * Manages saved currency settings for the current user.
     */
    angular.module('openlmis-currency-cache')
        .service('currencyCacheService', service)
        .run(initCurrencyCache);

    initCurrencyCache.$inject = ['currencyCacheService'];

    function initCurrencyCache(currencyCacheService) {
        currencyCacheService.initialize();
    };

    service.$inject = ['$q', '$rootScope', 'currencyService', '$urlRouter'];

    function service($q, $rootScope, currencyService, $urlRouter) {
        var cachingPromise;

        this.initialize = initialize;
        this.setCurrencySettings = setCurrencySettings;

        /**
         * @ngdoc method
         * @methodOf openlmis-currency.currencyCacheService
         * @name initialize
         *
         * @description
         * Sets up listenters for events in the service.
         */
        function initialize() {
            $rootScope.$on('openlmis-auth.login', this.setCurrencySettings);
            $rootScope.$on('$stateChangeStart', pauseIfLoading);
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-currency.currencyCacheService
         * @name setCurrencySettings
         *
         * @description
         * Runs facilityService.getAllMinimal, which has been modified to store
         * the recieved list in the browsers cache.
         *
         * The main part of this function manages a promise, which is used to
         * block state changes while the facility list is being downloaded.
         */
        function setCurrencySettings() {
            if(!cachingPromise) {
                var deferred = $q.defer();
                cachingPromise = deferred.promise;

                currencyService.getCurrencySettings()
                .catch(function(){
                    currencyService.getCurrencySettingsFromConfig();
                })
                .finally(function() {
                    deferred.resolve();
                    cachingPromise = undefined;
                });
            }
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-currency.currencyCacheService
         * @name pauseIfLoading
         *
         * @param {Object} event State change event from $stateChangeStart
         *
         * @description
         * Cancels any state changes while the caching promise is loading. After
         * loading is complete, the browser is directed to the current state.
         */
        function pauseIfLoading(event) {
            if(cachingPromise) {
                event.preventDefault();

                cachingPromise.then(function() {
                    $urlRouter.sync();
                });
            }
        }
    }

})();
