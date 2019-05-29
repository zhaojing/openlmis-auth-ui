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

    beforeEach(function() {
        module('openlmis-logout');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$state = $injector.get('$state');
            this.$rootScope = $injector.get('$rootScope');
            this.$controller = $injector.get('$controller');
            this.loginService = $injector.get('loginService');
            this.offlineService = $injector.get('offlineService');
            this.confirmService = $injector.get('confirmService');
        });

        this.vm = this.$controller('LogoutController', {});
    });

    describe('logout', function() {

        beforeEach(function() {
            spyOn(this.$state, 'go');
            spyOn(this.$rootScope, '$emit');
            spyOn(this.loginService, 'logout');
            spyOn(this.confirmService, 'confirm');
            spyOn(this.offlineService, 'isOffline');
        });

        it('should be able to log out when online', function() {
            this.offlineService.isOffline.andReturn(false);
            this.loginService.logout.andReturn(this.$q.resolve());

            this.vm.logout();
            this.$rootScope.$apply();

            expect(this.offlineService.isOffline).toHaveBeenCalled();
            expect(this.confirmService.confirm).not.toHaveBeenCalled();
            expect(this.loginService.logout).toHaveBeenCalled();
            expect(this.$rootScope.$emit).toHaveBeenCalledWith('openlmis-auth.logout');
            expect(this.$state.go).toHaveBeenCalledWith('auth.login');
        });

        it('should fail to log out online if login service rejects', function() {
            this.offlineService.isOffline.andReturn(false);
            this.loginService.logout.andReturn(this.$q.reject());

            this.vm.logout();
            this.$rootScope.$apply();

            expect(this.offlineService.isOffline).toHaveBeenCalled();
            expect(this.confirmService.confirm).not.toHaveBeenCalled();
            expect(this.loginService.logout).toHaveBeenCalled();
            expect(this.$rootScope.$emit).not.toHaveBeenCalled();
            expect(this.$state.go).not.toHaveBeenCalled();
        });

        it('should be able to log out when offline', function() {
            this.offlineService.isOffline.andReturn(true);
            this.confirmService.confirm.andReturn(this.$q.resolve());
            this.loginService.logout.andReturn(this.$q.resolve());

            this.vm.logout();
            this.$rootScope.$apply();

            expect(this.offlineService.isOffline).toHaveBeenCalled();
            expect(this.confirmService.confirm).toHaveBeenCalledWith(
                'openlmisLogout.offlineWarning',
                'openlmisLogout.logout'
            );

            expect(this.loginService.logout).toHaveBeenCalled();
            expect(this.$rootScope.$emit).toHaveBeenCalledWith('openlmis-auth.logout');
            expect(this.$state.go).toHaveBeenCalledWith('auth.login');
        });

        it('should fail to log out offline if login service rejects', function() {
            this.offlineService.isOffline.andReturn(true);
            this.confirmService.confirm.andReturn(this.$q.resolve());
            this.loginService.logout.andReturn(this.$q.reject());

            this.vm.logout();
            this.$rootScope.$apply();

            expect(this.offlineService.isOffline).toHaveBeenCalled();
            expect(this.confirmService.confirm).toHaveBeenCalledWith(
                'openlmisLogout.offlineWarning',
                'openlmisLogout.logout'
            );

            expect(this.loginService.logout).toHaveBeenCalled();
            expect(this.$rootScope.$emit).not.toHaveBeenCalled();
            expect(this.$state.go).not.toHaveBeenCalled();
        });

        it('should fail to log out offline without confirmation', function() {
            this.offlineService.isOffline.andReturn(true);
            this.confirmService.confirm.andReturn(this.$q.reject());

            this.vm.logout();
            this.$rootScope.$apply();

            expect(this.offlineService.isOffline).toHaveBeenCalled();
            expect(this.confirmService.confirm).toHaveBeenCalledWith(
                'openlmisLogout.offlineWarning',
                'openlmisLogout.logout'
            );

            expect(this.loginService.logout).not.toHaveBeenCalled();
            expect(this.$rootScope.$emit).not.toHaveBeenCalled();
            expect(this.$state.go).not.toHaveBeenCalled();
        });
    });
});
