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

    var template, vm, $q, $timeout, $state, $rootScope;

    beforeEach(function() {
        var $controller, $templateRequest, $compile, $scope;

        module('openlmis-reset-password');

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $templateRequest = $injector.get('$templateRequest');
            $controller = $injector.get('$controller');
            $compile = $injector.get('$compile');
            $state = $injector.get('$state');
            $timeout = $injector.get('$timeout');
            $q = $injector.get('$q');
        });

        $scope = $rootScope.$new();

        spyOn($state, 'go');

        vm = $controller('ResetPasswordController', {
            modalDeferred: $q.defer()
        });

        $scope.vm = vm;

        $templateRequest('openlmis-reset-password/reset-password.html').then(function(requested) {
            template = $compile(requested)($scope);
        });
        $rootScope.$apply();
    });

    describe('Show password checkbox', function() {

        it('should change input type', function() {
            var inputs = template.find('#password, #reenteredPassword');
            expect(inputs.length).toEqual(2);

            inputs.each(function() {
                expect($(this).attr('type')).toEqual('password');
            });

            template.find('#showPassword').click();
            $timeout.flush();

            inputs.each(function() {
                expect($(this).attr('type')).toEqual('text');
            });

            template.find('#showPassword').click();

            inputs.each(function() {
                expect($(this).attr('type')).toEqual('password');
            });
        });

    });

});
