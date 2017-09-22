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

    var $rootScope, httpBackend, loginService, authorizationService, $q, offlineService;

    beforeEach(module('openlmis-login'));

    beforeEach(inject(function(_$rootScope_, _loginService_, _authorizationService_, _$q_, _offlineService_) {
        $rootScope = _$rootScope_;
        loginService = _loginService_;
        $q = _$q_;

        authorizationService = _authorizationService_;
        spyOn(authorizationService, 'setAccessToken').andCallThrough();
        spyOn(authorizationService, 'clearAccessToken').andCallThrough();

        spyOn(authorizationService, 'setUser');
        spyOn(authorizationService, 'clearUser');
        
        offlineService = _offlineService_;
        spyOn(offlineService, 'isOffline').andReturn(false);
    }));

    beforeEach(inject(function(_$httpBackend_) {
        httpBackend = _$httpBackend_;
        httpBackend.when('POST', '/api/oauth/token?grant_type=password')
        .respond(function(method, url, data){
            if(data.indexOf('bad-password') >= 0 ){
                return [400];
            } else {
                return [200, {
                    'access_token': 'access_token',
                    'referenceDataUserId': 'userId'
                }];
            }
        });
    }));

    describe('login', function() {
        it('should reject bad logins', function() {
            var error = false;
            loginService.login('john', 'bad-password')
            .catch(function(){
                error = true;
            });

            httpBackend.flush();
            $rootScope.$apply();

            expect(error).toBe(true);
        });

        it('returns an error message for bad logins', function(){
            var message;
            loginService.login('john', 'bad-password')
            .catch(function(error){
                message = error;
            });

            httpBackend.flush();
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
            var success = false;

            loginService.login('john', 'john-password')
            .then(function(){
                success = true;
            });

            httpBackend.flush();
            $rootScope.$apply();

            expect(success).toBe(true);
        });

        it('should emit "openlmis-auth.login" event when successfully logged in', function() {
            var success = false;
            $rootScope.$on('openlmis-auth.login', function(){
                success = true;
            });

            loginService.login('john', 'john-password');
            httpBackend.flush();
            $rootScope.$apply();

            expect(success).toBe(true);
        });

        it('should set access token when login is successful', function() {            
            loginService.login('john', 'john-password');
            httpBackend.flush();
            $rootScope.$apply();

            expect(authorizationService.setAccessToken).toHaveBeenCalledWith('access_token');
        });

        it('should set basic user data when login is successful', function() {
            loginService.login('john', 'john-password');
            httpBackend.flush();
            $rootScope.$apply();

            expect(authorizationService.setUser).toHaveBeenCalledWith('userId', 'john');
        });

        it('login method calls requestLogin method', function(){
            spyOn(loginService, 'requestLogin').andReturn($q.reject());

            loginService.login('fake', 'arguments');

            expect(loginService.requestLogin).toHaveBeenCalled();
        });

    });

    describe('logout', function() {

        it('always emits a logout event', function() {
            var success = false;
            $rootScope.$on('openlmis-auth.logout', function() {
                success = true;
            });

            loginService.logout();
            $rootScope.$apply();

            expect(success).toBe(true);
        });

        it('always clears the access token', function(){
            loginService.logout();
            $rootScope.$apply();

            expect(authorizationService.clearAccessToken).toHaveBeenCalled();
        });

        it('always clears user data', function() {
            loginService.logout();
            $rootScope.$apply();

            expect(authorizationService.clearUser).toHaveBeenCalled();
        });

        it('should logout while offline', function() {
            offlineService.isOffline.andReturn(true);

            var success = false;
            loginService.logout().then(function(){
                success = true;
            });
            $rootScope.$apply();

            expect(success).toBe(true);
        });

        it('should resolve promise if response status is 401', function() {
            httpBackend.when('POST', '/api/users/auth/logout')
            .respond(401);

            var resolved = false;
            loginService.logout().then(function() {
                resolved = true;
            });

            httpBackend.flush();
            $rootScope.$apply();

            expect(resolved).toBe(true);
        });

        it('calls requestLogout method', function(){
            spyOn(loginService, 'requestLogout').andReturn($q.reject());

            loginService.logout();

            expect(loginService.requestLogout).toHaveBeenCalled();
        });

    });

    it('should call forgot password endpoint', inject(function() {
        var email = 'user@openlmis.org',
            spy = jasmine.createSpy();

        httpBackend.when('POST', '/api/users/auth/forgotPassword?email=' + email)
        .respond(200, {});

        loginService.forgotPassword(email).then(spy);

        httpBackend.flush();
        $rootScope.$apply();

        expect(spy).toHaveBeenCalled();
    }));

    it('should call change password endpoint', inject(function() {
        var data = {
                token: '1234',
                newPassword: 'secret1234'
            },
            spy = jasmine.createSpy();

        httpBackend.when('POST', '/api/users/auth/changePassword')
        .respond(function(method, url, body){
            if(body === angular.toJson(data)){
                return [200];
            } else {
                return [404];
            }
        });

        loginService.changePassword(data.newPassword, data.token).then(spy);

        httpBackend.flush();
        $rootScope.$apply();

        expect(spy).toHaveBeenCalled();
    }));

});
