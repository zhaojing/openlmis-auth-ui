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

describe('reset-password.html template', function() {

    beforeEach(function() {
        module('openlmis-reset-password');

        inject(function($injector) {
            this.$rootScope = $injector.get('$rootScope');
            this.$templateRequest = $injector.get('$templateRequest');
            this.$controller = $injector.get('$controller');
            this.$compile = $injector.get('$compile');
            this.$state = $injector.get('$state');
            this.$timeout = $injector.get('$timeout');
            this.$q = $injector.get('$q');
        });

        this.$scope = this.$rootScope.$new();

        spyOn(this.$state, 'go').andReturn();

        this.vm = this.$controller('ResetPasswordController', {
            modalDeferred: this.$q.defer()
        });

        this.$scope.vm = this.vm;

        var template;
        this.$templateRequest('openlmis-reset-password/reset-password.html').then(function(requested) {
            template = requested;
        });
        this.$rootScope.$apply();

        this.template = this.$compile(template)(this.$scope);
        this.$rootScope.$apply();
    });

    describe('Show password checkbox', function() {

        it('should change input type', function() {
            var inputs = this.template.find('#password, #reenteredPassword');

            expect(inputs.length).toEqual(2);

            inputs.each(function() {
                expect($(this).attr('type')).toEqual('password');
            });

            this.template.find('#showPassword').click();
            this.$timeout.flush();

            inputs.each(function() {
                expect($(this).attr('type')).toEqual('text');
            });

            this.template.find('#showPassword').click();

            inputs.each(function() {
                expect($(this).attr('type')).toEqual('password');
            });
        });

    });

});
