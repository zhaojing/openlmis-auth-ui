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

    var vm, loginService, $state, $rootScope, $q, confirmService, offlineService, $controller;

    beforeEach(function() {
        module('openlmis-logout');

        inject(function($injector) {
            $q = $injector.get('$q');
            $state = $injector.get('$state');
            $rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');
            loginService = $injector.get('loginService');
            offlineService = $injector.get('offlineService');
            confirmService = $injector.get('confirmService');
        });

        vm = $controller('LogoutController', {});
    });

    describe('logout', function() {

        beforeEach(function() {
            spyOn($state, 'go');
            spyOn($rootScope, '$emit');
            spyOn(loginService, 'logout');
            spyOn(confirmService, 'confirm');
            spyOn(offlineService, 'isOffline');
        });

        it('should be able to log out when online', function() {
            offlineService.isOffline.andReturn(false);
            loginService.logout.andReturn($q.resolve());

            vm.logout();
            $rootScope.$apply();

            expect(offlineService.isOffline).toHaveBeenCalled();
            expect(confirmService.confirm).not.toHaveBeenCalled();
            expect(loginService.logout).toHaveBeenCalled();
            expect($rootScope.$emit).toHaveBeenCalledWith('openlmis-auth.logout');
            expect($state.go).toHaveBeenCalledWith('auth.login');
        });

        it('should fail to log out online if login service rejects', function() {
            offlineService.isOffline.andReturn(false);
            loginService.logout.andReturn($q.reject());

            vm.logout();
            $rootScope.$apply();

            expect(offlineService.isOffline).toHaveBeenCalled();
            expect(confirmService.confirm).not.toHaveBeenCalled();
            expect(loginService.logout).toHaveBeenCalled();
            expect($rootScope.$emit).not.toHaveBeenCalled();
            expect($state.go).not.toHaveBeenCalled();
        });

        it('should be able to log out when offline', function() {
            offlineService.isOffline.andReturn(true);
            confirmService.confirm.andReturn($q.resolve());
            loginService.logout.andReturn($q.resolve());

            vm.logout();
            $rootScope.$apply();

            expect(offlineService.isOffline).toHaveBeenCalled();
            expect(confirmService.confirm).toHaveBeenCalledWith(
                'openlmisLogout.offlineWarning',
                'openlmisLogout.logout'
            );
            expect(loginService.logout).toHaveBeenCalled();
            expect($rootScope.$emit).toHaveBeenCalledWith('openlmis-auth.logout');
            expect($state.go).toHaveBeenCalledWith('auth.login');
        });

        it('should fail to log out offline if login service rejects', function() {
            offlineService.isOffline.andReturn(true);
            confirmService.confirm.andReturn($q.resolve());
            loginService.logout.andReturn($q.reject());

            vm.logout();
            $rootScope.$apply();

            expect(offlineService.isOffline).toHaveBeenCalled();
            expect(confirmService.confirm).toHaveBeenCalledWith(
                'openlmisLogout.offlineWarning',
                'openlmisLogout.logout'
            );
            expect(loginService.logout).toHaveBeenCalled();
            expect($rootScope.$emit).not.toHaveBeenCalled();
            expect($state.go).not.toHaveBeenCalled();
        });

        it('should fail to log out offline without confirmation', function() {
            offlineService.isOffline.andReturn(true);
            confirmService.confirm.andReturn($q.reject());

            vm.logout();
            $rootScope.$apply();

            expect(offlineService.isOffline).toHaveBeenCalled();
            expect(confirmService.confirm).toHaveBeenCalledWith(
                'openlmisLogout.offlineWarning',
                'openlmisLogout.logout'
            );
            expect(loginService.logout).not.toHaveBeenCalled();
            expect($rootScope.$emit).not.toHaveBeenCalled();
            expect($state.go).not.toHaveBeenCalled();
        });
    });
});
