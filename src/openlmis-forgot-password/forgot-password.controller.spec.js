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

    beforeEach(function() {
        module('openlmis-forgot-password');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$controller = $injector.get('$controller');
            this.forgotPasswordFactory = $injector.get('forgotPasswordFactory');
            this.loadingModalService = $injector.get('loadingModalService');
            this.$rootScope = $injector.get('$rootScope');
            this.alertService = $injector.get('alertService');
        });

        this.modalDeferred = this.$q.defer();
        this.forgotPasswordDeferred = this.$q.defer();
        this.email = 'some-valid@email.com';

        spyOn(this.forgotPasswordFactory, 'sendResetEmail').andReturn(this.forgotPasswordDeferred.promise);
        spyOn(this.loadingModalService, 'open').andReturn(true);
        spyOn(this.loadingModalService, 'close').andReturn(true);
        spyOn(this.alertService, 'success').andReturn(this.$q.when());

        this.vm = this.$controller('ForgotPasswordController', {
            modalDeferred: this.modalDeferred
        });
        this.vm.email = this.email;
    });

    describe('forgotPassword', function() {

        beforeEach(function() {

        });

        it('should open loading modal', function() {
            this.vm.forgotPassword();

            expect(this.loadingModalService.open).toHaveBeenCalled();
        });

        it('should call this.forgotPasswordFactory', function() {
            this.vm.forgotPassword();

            expect(this.forgotPasswordFactory.sendResetEmail).toHaveBeenCalledWith(this.email);
        });

        it('should show alert if password reset succeeded', function() {
            this.vm.forgotPassword();
            this.forgotPasswordDeferred.resolve();
            this.$rootScope.$apply();

            expect(this.alertService.success).toHaveBeenCalled();
        });

        it('should close modal if alert was dismissed', function() {
            spyOn(this.modalDeferred, 'resolve').andCallThrough();

            this.vm.forgotPassword();
            this.forgotPasswordDeferred.resolve();
            this.$rootScope.$apply();

            expect(this.modalDeferred.resolve).toHaveBeenCalled();
        });

        it('should not show alert if password reset failed', function() {
            this.vm.forgotPassword();
            this.forgotPasswordDeferred.reject();
            this.$rootScope.$apply();

            expect(this.alertService.success).not.toHaveBeenCalled();
        });

        it('should set error if password reset failed', function() {
            this.vm.forgotPassword();
            this.forgotPasswordDeferred.reject();
            this.$rootScope.$apply();

            expect(this.vm.error).not.toBeUndefined();
        });

        it('should close loading modal on reject', function() {
            this.vm.forgotPassword();
            this.forgotPasswordDeferred.resolve();
            this.$rootScope.$apply();

            expect(this.loadingModalService.close).toHaveBeenCalled();
        });

        it('should close loading modal on resolve', function() {
            this.vm.forgotPassword();
            this.forgotPasswordDeferred.reject();
            this.$rootScope.$apply();

            expect(this.loadingModalService.close).toHaveBeenCalled();
        });
    });

    it('cancel should expose modal reject method', function() {
        expect(this.vm.cancel).toBe(this.modalDeferred.reject);
    });

});
