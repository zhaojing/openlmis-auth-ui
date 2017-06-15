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

    var loginService, $state, $rootScope, $q, vm, isOffline, confirmService;

    beforeEach(function() {
        module('openlmis-logout');

        inject(function($injector) {
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');

            loginService = $injector.get('loginService');
            spyOn(loginService, 'logout').andReturn($q.when(true));
            
            $state = $injector.get('$state');
            spyOn($state, 'go').andReturn();

            isOffline = false;
            offlineService = $injector.get('offlineService');
            spyOn(offlineService, 'isOffline').andCallFake(function(){
                return isOffline;
            });

            confirmService = $injector.get('confirmService');

            vm = $injector.get('$controller')('LogoutController', {});
        });
    });

    describe('logout', function() {

        beforeEach(function() {
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

    describe('logout offline', function() {
        var doesConfirm;

        beforeEach(function(){
            isOffline = true;

            spyOn(confirmService, 'confirm').andCallFake(function(){
                if(doesConfirm) {
                    return $q.resolve();
                } else {
                    return $q.reject();
                }
            });

        });

        it('will show a confirmation modal if attempting to logout while offline', function(){
            vm.logout();
            $rootScope.$apply();

            expect(confirmService.confirm).toHaveBeenCalled();
        });

        it('user will be logged out only if they confirm', function(){
            
            doesConfirm = false;
            vm.logout();
            $rootScope.$apply();
            
            expect(loginService.logout).not.toHaveBeenCalled();

            doesConfirm = true;
            vm.logout();
            $rootScope.$apply();

            expect(loginService.logout).toHaveBeenCalled();
        });


    });
});
