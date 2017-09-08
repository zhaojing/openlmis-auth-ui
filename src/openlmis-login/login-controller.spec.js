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

describe("LoginController", function() {

    var $rootScope, $state, vm, modalDeferred;

    beforeEach(function() {

        module('openlmis-login');

        module(function($provide){
            // Turn off AuthToken
            $provide.factory('accessTokenInterceptor', function(){
                return {};
            });
        });

        inject(function(_$rootScope_, $controller, $q, loginService, _$state_, _loadingModalService_) {
            $rootScope = _$rootScope_;
            $state = _$state_;

            spyOn($rootScope, '$emit');

            modalDeferred = $q.defer();

            vm = $controller("LoginController", {
                modalDeferred: modalDeferred
            });

            spyOn(loginService, 'login').andCallFake(function(username, password) {
                if (password == "bad-password") {
                    return $q.reject("error");
                } else {
                    return $q.when();
                }
            });

            loadingModalService = _loadingModalService_;
            spyOn(loadingModalService, 'open');
            spyOn(loadingModalService, 'close');
        });
    });

    it('should not login and show error when server returns error', function() {
        vm.username = "john";
        vm.password = "bad-password";

        spyOn(location, 'reload');

        vm.doLogin();
        $rootScope.$apply();

        expect(vm.loginError).toEqual('error');
    });

    it('should clear password on failed login attempt', function() {
        vm.username = "john";
        vm.password = "bad-password";

        vm.doLogin();
        $rootScope.$apply();

        expect(vm.password).toBe(undefined);
    });

    it('should not clear password on successful login attempt', function() {
        vm.username = "john";
        vm.password = "good-password";

        vm.doLogin();
        $rootScope.$apply();

        expect(vm.password).toBe('good-password');
    });

    it('shows a loading modal when attempting to login', function(){
        vm.doLogin();
        $rootScope.$apply();

        expect(loadingModalService.open).toHaveBeenCalled();
        expect(loadingModalService.close).toHaveBeenCalled();
    });
});
