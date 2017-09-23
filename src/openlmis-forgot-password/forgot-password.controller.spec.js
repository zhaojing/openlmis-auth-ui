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

describe('ForgotPasswordController', function() {

    var vm, $q, $controller, modalDeferred, forgotPasswordFactory;

    beforeEach(function() {
        module('openlmis-forgot-password', function($provide) {
            forgotPasswordFactory = jasmine.createSpy();
            $provide.factory('forgotPasswordFactory', function(){
                return forgotPasswordFactory;
            });
        });

        inject(function($injector) {
            $q = $injector.get('$q');
            $controller = $injector.get('$controller');
        });

        modalDeferred = $q.defer();

        vm = $controller('ForgotPasswordController', {
            modalDeferred: modalDeferred
        });
    });

    describe('forgotPassword', function() {

        var $rootScope, alertService, forgotPasswordDeferred, email;

        beforeEach(function() {
            inject(function($injector) {
                $rootScope = $injector.get('$rootScope');
                alertService = $injector.get('alertService');
            });

            forgotPasswordDeferred = $q.defer();

            forgotPasswordFactory.andReturn(forgotPasswordDeferred.promise);
            spyOn(alertService, 'success').andReturn($q.when());

            email = 'some-valid@email.com';
            vm.email = email;
        });

        it('should call forgotPasswordFactory', function() {
            vm.forgotPassword();

            expect(forgotPasswordFactory).toHaveBeenCalledWith(email);
        });

        it('should show alert if password reset succeeded', function() {
            vm.forgotPassword();
            forgotPasswordDeferred.resolve();
            $rootScope.$apply();

            expect(alertService.success).toHaveBeenCalled();
        });

        it('should close modal if alert was dismissed', function() {
            spyOn(modalDeferred, 'resolve').andCallThrough();

            vm.forgotPassword();
            forgotPasswordDeferred.resolve();
            $rootScope.$apply();

            expect(modalDeferred.resolve).toHaveBeenCalled();
        });

        it('should not show alert if password reset failed', function() {
            vm.forgotPassword();
            forgotPasswordDeferred.reject();
            $rootScope.$apply();

            expect(alertService.success).not.toHaveBeenCalled();
        });

        it('should set error if password reset failed', function() {
            vm.forgotPassword();
            forgotPasswordDeferred.reject();
            $rootScope.$apply();

            expect(vm.error).not.toBeUndefined();
        });

    });

    it('cancel should expose modal reject method', function() {
        expect(vm.cancel).toBe(modalDeferred.reject);
    });

});
