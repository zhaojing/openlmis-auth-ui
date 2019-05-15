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

describe('ResetPasswordController', function() {

    beforeEach(function() {

        module('openlmis-reset-password');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.$controller = $injector.get('$controller');
            this.changePasswordFactory = $injector.get('changePasswordFactory');
            this.alertService = $injector.get('alertService');
            this.$stateParams = $injector.get('$stateParams');
        });

        this.token = '1234';
        this.$stateParams.token = this.token;

        spyOn(this.changePasswordFactory, 'changePassword');
        spyOn(this.alertService, 'success');

        this.vm = this.$controller('ResetPasswordController', {
            modalDeferred: this.$q.defer()
        });
    });

    describe('changePassword', function() {

        it('should call change password factory', function() {
            var password = 'password123';

            this.vm.password = password;
            this.vm.reenteredPassword = password;

            this.changePasswordFactory.changePassword.andReturn(this.$q.when(true));

            this.vm.changePassword();
            this.$rootScope.$apply();

            expect(this.changePasswordFactory.changePassword).toHaveBeenCalledWith(password, this.token);
            expect(this.alertService.success).toHaveBeenCalled();
        });

        it('should set error message after rejecting change password call', function() {
            var password = 'password123';

            this.vm.password = password;
            this.vm.reenteredPassword = password;

            this.changePasswordFactory.changePassword.andReturn(this.$q.reject());

            this.vm.changePassword();
            this.$rootScope.$apply();

            expect(this.vm.error).toEqual('openlmisResetPassword.passwordReset.failure');
        });

        it('should set error message if password are different', function() {
            this.vm.password = 'password1';
            this.vm.reenteredPassword = 'password2';

            this.vm.changePassword();

            expect(this.vm.error).toEqual('openlmisResetPassword.passwordMismatch');
        });

        it('should set error message if password is too short', function() {
            var password = 'pass1';

            this.vm.password = password;
            this.vm.reenteredPassword = password;

            this.vm.changePassword();

            expect(this.vm.error).toEqual('openlmisResetPassword.passwordTooShort');
        });

        it('should set error message if password does not contain number', function() {
            var password = 'passwordWithoutNumber';

            this.vm.password = password;
            this.vm.reenteredPassword = password;

            this.vm.changePassword();

            expect(this.vm.error).toEqual('openlmisResetPassword.passwordMustContainNumber');
        });
    });

});
