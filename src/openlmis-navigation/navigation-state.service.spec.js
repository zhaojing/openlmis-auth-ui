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
        var context = this;

        this.dependencyMethod = jasmine.createSpy('dependencyMethod');

        angular.module('dependency', []);
        angular
            .module('dependency')
            .service('mockService', function() {
                this.mockMethod = context.dependencyMethod;
            });

        module('dependency');
        module('openlmis-navigation', function($stateProvider) {
            context.$stateProvider = $stateProvider;
            $stateProvider
                .state('state1', {
                    showInNavigation: true,
                    priority: 10,
                    abstract: true
                })
                .state('state1.subState13', {})
                .state('state1.subState65', {})
                .state('state2', {
                    showInNavigation: true,
                    priority: 12,
                    abstract: true
                })
                .state('state2.subState0', {})
                .state('state2.subState3', {
                    showInNavigation: true,
                    priority: 53,
                    accessRights: ['other-rights'],
                    isOffline: true
                })
                .state('state2.subState4', {
                    showInNavigation: true,
                    priority: 15,
                    accessRights: ['rights']
                })
                .state('state2.subState4.subSubState1', {
                    showInNavigation: true
                })
                .state('state3', {})
                .state('state3.subState1', {
                    showInNavigation: true,
                    priority: 11
                })
                .state('state3.subState16', {
                    showInNavigation: true,
                    priority: 10
                })
                .state('state4', {
                    showInNavigation: true,
                    priority: 11
                })
                .state('state5', {
                    showInNavigation: true,
                    canAccess: function() {
                        return false;
                    }
                })
                .state('state6', {
                    showInNavigation: true,
                    canAccess: function($q) {
                        return $q.resolve(false);
                    }
                })
                .state('state7', {
                    showInNavigation: true,
                    canAccess: function($q) {
                        return $q.resolve(true);
                    }
                })
                .state('state8', {
                    showInNavigation: true,
                    canAccess: function() {
                        return true;
                    }
                })
                .state('state9', {
                    showInNavigation: true,
                    canAccess: function(mockService) {
                        return mockService.mockMethod();
                    }
                })
                .state('state91', {
                    showInNavigation: true,
                    abstract: true
                })
                .state('state91.subState17', {
                    showInNavigation: true,
                    canAccess: function($q) {
                        context.state91SubState17Deferred = $q.defer();
                        return context.state91SubState17Deferred.promise;
                    }
                });
        });

        inject(function($injector) {
            this.authorizationService = $injector.get('authorizationService');
            this.$q = $injector.get('$q');
        });

        spyOn(this.authorizationService, 'hasRights').andCallFake(function(rights) {
            if ('other-rights' === rights[0]) {
                return false;
            }
            return true;
        });

        this.dependencyMethod.andReturn(true);

        inject(function($injector) {
            this.navigationStateService = $injector.get('navigationStateService');
            this.$rootScope = $injector.get('$rootScope');
            this.$state = $injector.get('$state');
        });

        this.navigationStateService.setUpStatesAvailability();
        this.$rootScope.$apply();
    });

    describe('initialization', function() {

        it('should group by invisible root this.states', function() {
            expect(this.navigationStateService.roots['']).not.toBeUndefined();
            expect(this.navigationStateService.roots[''].length).toBe(9);
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
    });

    describe('setUpStatesAvailability', function() {

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

        it('should return false if user has no access to the state', function() {
            expect(this.navigationStateService.roots[''][3].$shouldDisplay).toBe(false);
            expect(this.navigationStateService.roots[''][4].$shouldDisplay).toBe(false);
        });

        it('should return true if user has access to the state', function() {
            expect(this.navigationStateService.roots[''][5].$shouldDisplay).toBe(true);
            expect(this.navigationStateService.roots[''][6].$shouldDisplay).toBe(true);
        });

        it('should inject dependencies into the canAccess function', function() {
            expect(this.navigationStateService.roots[''][7].$shouldDisplay).toBe(true);
            expect(this.dependencyMethod).toHaveBeenCalled();
        });

        it('should not update states availability for subsequent call unless they are cleared', function() {
            expect(this.dependencyMethod.callCount).toEqual(1);

            this.navigationStateService.setUpStatesAvailability();
            this.state91SubState17Deferred.resolve(true);
            this.$rootScope.$apply();

            expect(this.dependencyMethod.callCount).toEqual(1);

            this.navigationStateService.clearStatesAvailability();
            this.state91SubState17Deferred.resolve(true);
            this.navigationStateService.setUpStatesAvailability();
            this.$rootScope.$apply();

            expect(this.dependencyMethod.callCount).toEqual(2);
        });

        it('should set parent availability after setting children visibility', function() {
            this.state91SubState17Deferred.resolve(true);
            this.$rootScope.$apply();

            expect(this.navigationStateService.roots[''][8].$shouldDisplay).toBe(true);
        });
    });

    describe('clearStatesAvailability', function() {

        it('should clear state availability', function() {
            this.navigationStateService.clearStatesAvailability();

            var allCleared = this.$state.get().reduce(function(allCleared, state) {
                return allCleared && state.$shouldDisplay !== true;
            }, true);

            expect(allCleared).toBe(true);
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

            expect(this.navigationStateService.isOffline(state1)).toBeFalsy();
            expect(this.navigationStateService.isOffline(state2)).toBeFalsy();
            expect(this.navigationStateService.isOffline(offlineState)).toBe(true);
        });
    });

});