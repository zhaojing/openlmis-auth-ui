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

    angular
        .module('openlmis-forgot-password')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {

        $stateProvider.state('auth.forgotPassword', {
            url: '/forgotPassword',
            onEnter: onEnter,
            onExit: onExit
        });

        onEnter.$inject = ['$state', 'forgotPasswordModalService'];
        function onEnter($state, forgotPasswordModalService) {
            forgotPasswordModalService.open().finally(function() {
                $state.go('openlmis.home');
            });
        }

        onExit.$inject = ['forgotPasswordModalService'];
        function onExit(forgotPasswordModalService) {
            forgotPasswordModalService.close();
        }

    }

})();
