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

describe('navigationStateService', function() {

    beforeEach(function() {
        module('openlmis-navigation', function($stateProvider) {
            createState($stateProvider, 'state1', true, 10, true);
            createState($stateProvider, 'state1.subState13', false);
            createState($stateProvider, 'state1.subState65', false);
            createState($stateProvider, 'state2', true, 12, true);
            createState($stateProvider, 'state2.subState0', false);
            createState($stateProvider, 'state2.subState3', true, 53, false, ['other-rights'], true);
            createState($stateProvider, 'state2.subState4', true, 15, false, ['rights'], false);
            createState($stateProvider, 'state2.subState4.subSubState1', true);
            createState($stateProvider, 'state3', false);
            createState($stateProvider, 'state3.subState1', true, 11);
            createState($stateProvider, 'state3.subState16', true, 10);
            createState($stateProvider, 'state4', true, 11);
        });

        inject(function($injector) {
            this.authorizationService = $injector.get('authorizationService');
        });

        spyOn(this.authorizationService, 'hasRights').andCallFake(function(rights) {
            if ('other-rights' === rights[0]) {
                return false;
            }
            return true;
        });

        inject(function($injector) {
            this.navigationStateService = $injector.get('navigationStateService');
            this.$rootScope = $injector.get('$rootScope');
            this.$state = $injector.get('$state');
        });
    });

    describe('initialization', function() {

        it('should group by invisible root this.states', function() {
            expect(this.navigationStateService.roots['']).not.toBeUndefined();
            expect(this.navigationStateService.roots[''].length).toBe(3);
            expect(this.navigationStateService.roots.state3).not.toBeUndefined();
            expect(this.navigationStateService.roots.state3.length).toBe(2);
        });

        it('should add only visible children to parent state', function() {
            expect(this.navigationStateService.roots[''][0].children).not.toBeUndefined();
            expect(this.navigationStateService.roots[''][0].children.length).toBe(2);
        });

        it('should sort children by priority', function() {
            expect(this.navigationStateService.roots[''][0].children[0].name).toBe('state2.subState3');
            expect(this.navigationStateService.roots[''][0].children[1].name).toBe('state2.subState4');
        });

        it('should sort states by priority', function() {
            expect(this.navigationStateService.roots[''][0].name).toBe('state2');
            expect(this.navigationStateService.roots[''][1].name).toBe('state4');
            expect(this.navigationStateService.roots[''][2].name).toBe('state1');
        });

        it('should refresh this.states after login', function() {
            this.authorizationService.hasRights.andReturn(false);
            this.$rootScope.$emit('openlmis-auth.login');
            this.$rootScope.$apply();

            expect(this.navigationStateService.roots[''][0].children[1].$shouldDisplay).toBe(false);
        });
    });

    describe('refreshDisplay', function() {

        it('should return false if state should not be shown in navigation', function() {
            expect(this.navigationStateService.roots[''][2].$shouldDisplay).toBe(false);
        });

        it('should return true if state does not require any rights', function() {
            expect(this.navigationStateService.roots[''][1].$shouldDisplay).toBe(true);
        });

        it('should return true if user has required rights', function() {
            expect(this.navigationStateService.roots[''][0].children[1].$shouldDisplay).toBe(true);
        });

        it('should return false if user does not have required rights', function() {
            expect(this.navigationStateService.roots[''][0].children[0].$shouldDisplay).not.toBe(true);
        });

        it('should return false if state is abstract and has no visible children', function() {
            expect(this.navigationStateService.roots[''][2].$shouldDisplay).toBe(false);
        });

        it('should return true if state is abstract but has visible children', function() {
            expect(this.navigationStateService.roots[''][0].$shouldDisplay).toBe(true);
        });
    });

    describe('hasChildren', function() {

        it('should return true if state has visible children', function() {
            expect(this.navigationStateService.hasChildren(this.$state.get('state2'))).toBe(true);
        });

        it('should return false if state is abstract and does not have visible children', function() {
            expect(this.navigationStateService.hasChildren(this.$state.get('state1'))).toBe(false);
        });

    });

    describe('isSubmenu', function() {

        it('should return false if state is child of root', function() {
            expect(this.navigationStateService.isSubmenu(this.$state.get('state2'))).toBe(false);
        });

        it('should return true if state is not child of root and has children', function() {
            expect(this.navigationStateService.isSubmenu(this.$state.get('state2.subState4'))).toBe(true);
        });

        it('should return false if state is not child of root and has no children', function() {
            expect(this.navigationStateService.isSubmenu(this.$state.get('state2.subState3'))).toBe(false);
        });

    });

    describe('isOffline', function() {
        it('should return true if the state has isOffline defined', function() {
            var offlineState = this.$state.get('state2.subState3'),
                state1 = this.$state.get('state2.subState0'),
                state2 = this.$state.get('state2.subState4');

            expect(this.navigationStateService.isOffline(state1)).toBe(undefined);
            expect(this.navigationStateService.isOffline(state2)).toBe(false);
            expect(this.navigationStateService.isOffline(offlineState)).toBe(true);
        });
    });

    function createState($stateProvider, name, showInNavigation, priority, abstract, rights, offline) {
        $stateProvider.state(name, {
            showInNavigation: showInNavigation,
            priority: priority,
            abstract: abstract,
            accessRights: rights,
            isOffline: offline
        });
    }

});