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


describe('LogoutController', function() {

    var loginService, $state, $rootScope, $q, vm;

    beforeEach(function() {
        module('openlmis-logout');

        inject(function($injector) {
            $state = $injector.get('$state');
            loginService = $injector.get('loginService');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');

            vm = $injector.get('$controller')('LogoutController', {});
        });
    });

    describe('logout', function() {

        beforeEach(function() {
            spyOn(loginService, 'logout').andReturn($q.when(true));
            spyOn($state, 'go').andReturn();

            vm.logout();
            $rootScope.$apply();
        });

        it('should expose logout method', function() {
            expect(angular.isFunction(vm.logout)).toBe(true);
        });

        it('should call login service', function() {
            expect(loginService.logout).toHaveBeenCalled();
        });

        it('should redirect to login page', function() {
            expect($state.go).toHaveBeenCalledWith('auth.login');
        });
    });
});
