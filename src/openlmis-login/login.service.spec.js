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

describe('openlmis-login.loginService', function() {

    var authUrl, $rootScope, $httpBackend, loginService, offlineService, authorizationService, $q;

    beforeEach(function() {
        module('openlmis-login');

        inject(function($injector) {
            $q = $injector.get('$q');
            authUrl = $injector.get('authUrl');
            $rootScope = $injector.get('$rootScope');
            $httpBackend = $injector.get('$httpBackend');
            loginService = $injector.get('loginService');
            offlineService = $injector.get('offlineService');
            authorizationService = $injector.get('authorizationService');
        });

        $httpBackend.when('POST', authUrl('/api/oauth/token?grant_type=password'))
            .respond(function(method, url, data) {
                if (data.indexOf('bad-password') >= 0) {
                    return [400];
                }
                return [200, {
                    //eslint-disable-next-line quote-props
                    'access_token': 'access_token',
                    referenceDataUserId: 'userId',
                    username: 'john'
                }];
            });

        spyOn(authorizationService, 'setAccessToken').andCallThrough();
        spyOn(authorizationService, 'clearAccessToken').andCallThrough();

        spyOn(authorizationService, 'setUser');
        spyOn(authorizationService, 'clearUser');
        spyOn(offlineService, 'isOffline').andReturn(false);
    });

    describe('login', function() {

        it('should reject bad logins', function() {
            var error = false;
            loginService.login('john', 'bad-password')
                .catch(function() {
                    error = true;
                });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(error).toBe(true);
        });

        it('returns an error message for bad logins', function() {
            var message;
            loginService.login('john', 'bad-password')
                .catch(function(error) {
                    message = error;
                });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(message).toBe('openlmisLogin.invalidCredentials');
        });

        it('returns an error if offline', function() {
            offlineService.isOffline.andReturn(true);

            var message;
            loginService.login('john', 'john-password')
                .catch(function(error) {
                    message = error;
                });

            $rootScope.$apply();

            expect(message).toEqual('openlmisLogin.cannotConnectToServer');
        });

        it('should resolve successful logins', function() {
            var result;

            loginService.login('john', 'john-password')
                .then(function(response) {
                    result = response;
                });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(result).toEqual({
                userId: 'userId',
                username: 'john',
                accessToken: 'access_token'
            });

        });

        it('should set access token when login is successful', function() {
            loginService.login('john', 'john-password');
            $httpBackend.flush();
            $rootScope.$apply();

            expect(authorizationService.setAccessToken).toHaveBeenCalledWith('access_token');
        });

        it('should set basic user data when login is successful', function() {
            loginService.login('john', 'john-password');
            $httpBackend.flush();
            $rootScope.$apply();

            expect(authorizationService.setUser).toHaveBeenCalledWith('userId', 'john');
        });

        it('should wait for post login actions', function() {
            var postLoginActionDeferred = $q.defer();
            var postLoginAction = jasmine.createSpy('postLoginAction');
            postLoginAction.andReturn(postLoginActionDeferred.promise);

            loginService.registerPostLoginAction(postLoginAction);

            var success;
            loginService.login('john', 'john-password')
                .then(function() {
                    success = true;
                });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(success).toBeFalsy();

            postLoginActionDeferred.resolve();
            $rootScope.$apply();

            expect(success).toBe(true);
            expect(postLoginAction).toHaveBeenCalledWith({
                userId: 'userId',
                username: 'john',
                accessToken: 'access_token'
            });
        });
    });

    describe('logout', function() {

        beforeEach(function() {
            $httpBackend.when('POST', authUrl('/api/users/auth/logout'))
                .respond(200);
        });

        it('always clears the access token', function() {
            loginService.logout();
            $httpBackend.flush();
            $rootScope.$apply();

            expect(authorizationService.clearAccessToken).toHaveBeenCalled();
        });

        it('always clears user data', function() {
            loginService.logout();
            $httpBackend.flush();
            $rootScope.$apply();

            expect(authorizationService.clearUser).toHaveBeenCalled();
        });

        it('should logout while offline', function() {
            offlineService.isOffline.andReturn(true);

            var success = false;
            loginService.logout().then(function() {
                success = true;
            });
            $rootScope.$apply();

            expect(success).toBe(true);
        });

        it('should resolve promise if response status is 401', inject(function(authUrl) {
            $httpBackend.when('POST', authUrl('/api/users/auth/logout'))
                .respond(401);

            var resolved = false;
            loginService.logout().then(function() {
                resolved = true;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(resolved).toBe(true);
        }));

        it('should wait for post logout actions', function() {
            var postLogoutActionDeferred = $q.defer();
            var postLogoutAction = jasmine.createSpy('postLogoutAction');
            postLogoutAction.andReturn(postLogoutActionDeferred.promise);

            loginService.registerPostLogoutAction(postLogoutAction);

            var success;
            loginService.logout()
                .then(function() {
                    success = true;
                });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(success).toBeFalsy();

            postLogoutActionDeferred.resolve();
            $rootScope.$apply();

            expect(success).toBe(true);
            expect(postLogoutAction).toHaveBeenCalled();
        });

    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});