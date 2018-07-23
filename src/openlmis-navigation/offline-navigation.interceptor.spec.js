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

describe('Offline navigation interceptor', function() {

    var $state, alertService, loadingModalService, isOffline, $rootScope, offlineService;

    beforeEach(function() {
        module('openlmis-navigation', function($stateProvider) {
            $stateProvider.state('parent', {
                url: '/parent',
                isOffline: true
            });
            $stateProvider.state('parent.child.child', {
                url: '/child'
            });
            $stateProvider.state('parent.child', {
                url: '/child'
            });
            $stateProvider.state('normal', {
                url: '/normal'
            });
            $stateProvider.state('offline', {
                url: '/offline',
                isOffline: true
            });
        });

        inject(function($injector) {
            $state = $injector.get('$state');
            alertService = $injector.get('alertService');
            loadingModalService = $injector.get('loadingModalService');
            offlineService = $injector.get('offlineService');
            $rootScope = $injector.get('$rootScope');
        });

        spyOn(alertService, 'error');
        spyOn(loadingModalService, 'close');

        isOffline = false;
        spyOn(offlineService, 'isOffline').andCallFake(function() {
            return isOffline;
        });
    });

    it('will show an alert if offline for non-offline state', function() {
        $state.go('normal');
        expect(alertService.error).not.toHaveBeenCalled();

        isOffline = true;

        $state.go('normal');
        expect(alertService.error).toHaveBeenCalled();
    });

    it('will never show an alert if route is offline', function() {
        $state.go('offline');
        expect(alertService.error).not.toHaveBeenCalled();

        isOffline = true;
        $state.go('offline');
        expect(alertService.error).not.toHaveBeenCalled();
    });

    it('will show an alert if offline and going to parent state with reload', function() {
        $state.go('parent.child.child');
        expect(alertService.error).not.toHaveBeenCalled();

        isOffline = true;

        $state.go('parent.child', {}, {
            reload: true
        });
        expect(alertService.error).toHaveBeenCalled();
    });

    it('will never show an alert if offline and going to parent state without reload', function() {
        $state.go('parent.child.child');
        $rootScope.$apply();

        isOffline = true;

        $state.go('parent.child');
        expect(alertService.error).not.toHaveBeenCalled();
    });

    it('will never show an alert if offline and going to an offline parent state with reload', function() {
        $state.go('parent.child.child');
        $rootScope.$apply();

        isOffline = true;

        $state.go('parent');
        expect(alertService.error).not.toHaveBeenCalled();
    });

});