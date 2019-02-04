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

describe('openlmis-navigation directive', function() {

    beforeEach(function() {
        module('openlmis-navigation', function($stateProvider) {
            $stateProvider.state('test', {
                showInNavigation: true,
                label: 'test'
            });
            $stateProvider.state('offline', {
                showInNavigation: true,
                label: 'offline',
                isOffline: true
            });
            $stateProvider.state('foo', {
                showInNavigation: true,
                label: 'foo'
            });
            $stateProvider.state('foo.bar', {
                showInNavigation: true,
                label: 'bar'
            });
            $stateProvider.state('foo.bar.baz', {
                showInNavigation: true,
                label: 'baz'
            });
            $stateProvider.state('foo.test', {
                showInNavigation: true
            });
        });

        inject(function($injector) {
            this.$rootScope = $injector.get('$rootScope');
            this.$compile = $injector.get('$compile');
            this.offlineService = $injector.get('offlineService');
            this.navigationStateService = $injector.get('navigationStateService');
        });

        this.navigationStateService.updateStateAvailability();
        this.$rootScope.$apply();

        spyOn(this.offlineService, 'isOffline').andReturn(true);

        var markup = '<openlmis-navigation></openlmis-navigation>';

        this.scope = this.$rootScope.$new();
        this.element = this.$compile(markup)(this.scope);

        this.scope.$apply();
    });

    describe('shows navigation', function() {

        it('will display root states', function() {
            var firstLevel = this.element.children();

            expect(firstLevel.length).toBe(3);
        });

        it('will show child items in a drop down', function() {
            var dropdown = this.element.children('.dropdown:first');

            var childStates = dropdown.children('ul').children();

            expect(dropdown.children('a').text()).toBe('foo');
            expect(childStates.length).toBe(2);
        });

        it('will recurse through child item dropdowns', function() {
            var dropdown = this.element.children('.dropdown:first').children('ul')
                .children('.dropdown:first');

            var childStates = dropdown.children('ul').children();

            expect(dropdown.children('a').text()).toBe('bar');
            expect(childStates.length).toBe(1);
            expect(childStates.children('a').text()).toBe('baz');
        });
    });

    describe('offline', function() {

        it('will disable states that dont support offline', function() {
            var testLink = this.element.children('li:last').children('a');

            expect(testLink.text()).toBe('test');
            expect(testLink.attr('disabled')).toBe('disabled');
            expect(testLink.hasClass('is-offline')).toBe(true);
        });

        it('states marked offline will not be disabled', function() {
            var testLink = angular.element(this.element.children('li')[1]).children('a');

            expect(testLink.text()).toBe('offline');
            expect(testLink.attr('disabled')).toBe(undefined);
            expect(testLink.hasClass('is-offline')).toBe(false);
        });
    });

});