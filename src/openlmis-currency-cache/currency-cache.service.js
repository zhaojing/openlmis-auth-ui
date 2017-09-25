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

    initCurrencyCache.$inject = ['$rootScope', 'currencyCacheService'];

    function initCurrencyCache($rootScope, currencyCacheService) {
        $rootScope.$on('openlmis-auth.login', currencyCacheService.setCurrencySettings);
    };

    service.$inject = ['currencyService', 'loadingService'];

    function service(currencyService, loadingService) {
        this.setCurrencySettings = setCurrencySettings;

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
            var promise = currencyService.getCurrencySettings()
            .catch(function(){
                return currencyService.getCurrencySettingsFromConfig();
            });

            loadingService.register('openlmis-currency-cache.set', promise)
        }
    }

})();
