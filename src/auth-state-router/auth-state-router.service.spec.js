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

describe('authStateRouter', function() {

    var $rootScope, loginModalService, authorizationServiceSpy, stateSpy, alertSpy;

    beforeEach(function() {
        module('auth-state-router', function($provide) {
            stateSpy = jasmine.createSpyObj('$state', ['go']);
            alertSpy = jasmine.createSpyObj('alertService', ['error']);
            authorizationServiceSpy = jasmine.createSpyObj('authorizationService', ['hasRights',
                'isAuthenticated']);

            $provide.factory('$state', function() {
                return stateSpy;
            });

            $provide.factory('alertService', function() {
                return alertSpy;
            });

            $provide.factory('authorizationService', function() {
                return authorizationServiceSpy;
            });
        });

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            loginModalService = $injector.get('loginModalService');
        });

        spyOn(loginModalService, 'open').andCallThrough();
        spyOn($rootScope, '$emit');
    });

    it('will redirect user to login if auth token is not set and state is home', function() {
        authorizationServiceSpy.isAuthenticated.andReturn(false);

        $rootScope.$broadcast('$stateChangeStart', createState('openlmis.home'));

        expect(stateSpy.go).toHaveBeenCalledWith('auth.login');
    });

    it('will open login modal if auth token is not set and state is not home', function() {
        authorizationServiceSpy.isAuthenticated.andReturn(false);

        $rootScope.$broadcast('$stateChangeStart', createState('somewhere'), {}, createState(''));

        expect(loginModalService.open).toHaveBeenCalled();
    });

      it('should close loading dialog if auth token is not set and state is not home', inject(function (loadingModalService) {
        authorizationServiceSpy.isAuthenticated.andReturn(false);
        spyOn(loadingModalService, 'close');

        $rootScope.$broadcast('$stateChangeStart', createState('somewhere'), {}, createState(''));

        expect(loadingModalService.close).toHaveBeenCalled();
      }));


    it('will not redirect user if accessing pages in "auth.*" routes, and user is NOT authenticated', function() {
        authorizationServiceSpy.isAuthenticated.andReturn(false);

        $rootScope.$broadcast('$stateChangeStart', createState('auth.login'));

        expect(stateSpy.go).not.toHaveBeenCalled();

    });

    it('will not redirect user if auth token is set, unless page is login.html', function() {
        authorizationServiceSpy.isAuthenticated.andReturn(true);
        authorizationServiceSpy.hasRights.andReturn(true);

        $rootScope.$broadcast('$stateChangeStart', createState('somewhere'));

        expect(stateSpy.go).not.toHaveBeenCalled();

        $rootScope.$broadcast('$stateChangeStart', createState('auth.login'), {},
            createState('somewhere'));

        expect(stateSpy.go).toHaveBeenCalledWith('openlmis.home');
    });

    it('should call alert if has no permission to enter state', function() {
        authorizationServiceSpy.isAuthenticated.andReturn(true);
        authorizationServiceSpy.hasRights.andReturn(false);

        $rootScope.$broadcast('$stateChangeStart', createState('somewhere', []));

        expect(alertSpy.error).toHaveBeenCalled();
    });

    function createState(name, accessRights) {
        return {
            name: name ? name : '',
            accessRights: accessRights
        };
    }
});
