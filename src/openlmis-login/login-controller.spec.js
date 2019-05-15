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

describe('LoginController', function() {

    var vm, $q, $rootScope, $controller, loginService, modalDeferred, loadingModalService;

    beforeEach(function() {

        module('openlmis-login', function($provide) {
            // Turn off AuthToken
            $provide.factory('accessTokenInterceptor', function() {
                return {};
            });
        });

        inject(function($injector) {
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');
            loginService = $injector.get('loginService');
            loadingModalService = $injector.get('loadingModalService');
        });

        modalDeferred = $q.defer();

        vm = $controller('LoginController', {
            modalDeferred: modalDeferred
        });
    });

    describe('doLogin', function() {

        var username, validPassword, invalidPassword;

        beforeEach(function() {
            spyOn(loginService, 'login');
            spyOn(loadingModalService, 'open');
            spyOn(loadingModalService, 'close');

            username = 'john';
            validPassword = 'good-password';
            invalidPassword = 'bad-password';
        });

        it('should not login and show error when server returns error', function() {
            loginService.login.andReturn($q.reject('error'));

            vm.username = username;
            vm.password = invalidPassword;

            vm.doLogin();
            $rootScope.$apply();

            expect(loginService.login).toHaveBeenCalledWith(username, invalidPassword);
            expect(vm.loginError).toEqual('error');
        });

        it('should clear password on failed login attempt', function() {
            loginService.login.andReturn($q.reject());

            vm.username = username;
            vm.password = invalidPassword;

            vm.doLogin();
            $rootScope.$apply();

            expect(loginService.login).toHaveBeenCalledWith(username, invalidPassword);
            expect(vm.password).toBe(undefined);
        });

        it('should not clear password on successful login attempt', function() {
            loginService.login.andReturn($q.resolve());

            vm.username = username;
            vm.password = validPassword;

            vm.doLogin();
            $rootScope.$apply();

            expect(loginService.login).toHaveBeenCalledWith(username, validPassword);
            expect(vm.password).toBe(validPassword);
        });

        it('should open loading modal', function() {
            loginService.login.andReturn($q.resolve());

            vm.doLogin();
            $rootScope.$apply();

            expect(loadingModalService.open).toHaveBeenCalled();
        });

        it('should close loading modal after successful login', function() {
            loginService.login.andReturn($q.resolve());

            vm.doLogin();
            $rootScope.$apply();

            expect(loadingModalService.close).toHaveBeenCalled();
        });

        it('should close loading modal after failed login', function() {
            loginService.login.andReturn($q.reject());

            vm.doLogin();
            $rootScope.$apply();

            expect(loadingModalService.close).toHaveBeenCalled();
        });

        it('will resolve modalDeferred promise if login is successful', function() {
            var resolved;
            modalDeferred.promise.then(function() {
                resolved = true;
            });

            loginService.login.andReturn($q.reject());
            vm.username = username;
            vm.password = invalidPassword;

            vm.doLogin();
            $rootScope.$apply();

            expect(resolved).not.toBe(true);

            loginService.login.andReturn($q.resolve());
            vm.password = validPassword;

            vm.doLogin();
            $rootScope.$apply();

            expect(resolved).toBe(true);
        });

        it('should emit "openlmis-auth.login" event when successfully logged in', function() {
            var success = false;
            $rootScope.$on('openlmis-auth.login', function() {
                success = true;
            });

            loginService.login.andReturn($q.resolve());
            vm.username = username;
            vm.password = validPassword;

            vm.doLogin();
            $rootScope.$apply();

            expect(success).toBe(true);
        });

        it('should not emit "openlmis-auth.login" event when login failed', function() {
            var success = true;
            $rootScope.$on('openlmis-auth.login', function() {
                success = false;
            });

            loginService.login.andReturn($q.reject());
            vm.username = username;
            vm.password = invalidPassword;

            vm.doLogin();
            $rootScope.$apply();

            expect(success).toBe(true);
        });
    });
});
