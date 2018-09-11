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

describe('accessTokenInterceptor', function() {

    var accessTokenInterceptor, authorizationService, config, openlmisUrlService, interceptors, accessTokenFactory, $q,
        alertService;

    beforeEach(function() {
        module('openlmis-auth', function($httpProvider) {
            interceptors = $httpProvider.interceptors;
        });

        inject(function($injector) {
            $q = $injector.get('$q');
            openlmisUrlService = $injector.get('openlmisUrlService');
            authorizationService = $injector.get('authorizationService');
            accessTokenInterceptor = $injector.get('accessTokenInterceptor');
            accessTokenFactory = $injector.get('accessTokenFactory');
            alertService = $injector.get('alertService');
        });

        spyOn(accessTokenFactory, 'addAccessToken').andCallFake(function(url) {
            return url + '&access_token=SoMeAcCeSsToKeN';
        });
        spyOn(accessTokenFactory, 'authHeader').andReturn('Bearer SoMeAcCeSsToKeN');

        spyOn(openlmisUrlService, 'check');
        spyOn(authorizationService, 'isAuthenticated');
        spyOn(authorizationService, 'clearAccessToken');
        spyOn(authorizationService, 'clearUser');
        spyOn(authorizationService, 'clearRights');
        spyOn(alertService, 'error');
    });

    describe('request', function() {

        beforeEach(function() {
            openlmisUrlService.check.andReturn(true);
            authorizationService.isAuthenticated.andReturn(true);

            config = {
                url: 'some.url',
                headers: { }
            };
        });

        it('should be registered', function() {
            expect(interceptors.indexOf('accessTokenInterceptor') > -1).toBe(true);
        });

        it('should add token header', function() {
            var result = accessTokenInterceptor.request(config);

            expect(result.url).toEqual('some.url');
            expect(result.headers.Authorization).toEqual('Bearer SoMeAcCeSsToKeN');
        });

        it('should not add token if requesting html file', function() {
            config.url = 'some.html';

            var result = accessTokenInterceptor.request(config);

            expect(result.url).toEqual('some.html');
            expect(result.headers.Authorization).not.toBeDefined();
        });

        it('should not add token if user is not authenticated', function() {
            authorizationService.isAuthenticated.andReturn(false);

            var result = accessTokenInterceptor.request(config);

            expect(result.url).toEqual('some.url');
            expect(result.headers.Authorization).not.toBeDefined();
        });

        it('should check if user is authenticated', function() {
            accessTokenInterceptor.request(config);

            expect(authorizationService.isAuthenticated).toHaveBeenCalled();
        });

        it('should check if url should not be bypassed', function() {
            accessTokenInterceptor.request(config);

            expect(openlmisUrlService.check).toHaveBeenCalledWith('some.url');
        });

    });

    describe('responseError', function() {

        var response;

        beforeEach(function() {
            response = {};
        });

        describe('on 401 status', function() {

            beforeEach(function() {
                response.status = 401;

                accessTokenInterceptor.responseError(response);
            });

            it('should clear access token', function() {
                expect(authorizationService.clearAccessToken).toHaveBeenCalled();
            });

            it('should clear user', function() {
                expect(authorizationService.clearUser).toHaveBeenCalled();
            });

            it('should clear rights', function() {
                expect(authorizationService.clearRights).toHaveBeenCalled();
            });

        });

        it('should show error.authorization alert on 403 status', function() {
            response.status = 403;
            response.data = {
                message: 'Test message'
            };

            accessTokenInterceptor.responseError(response);

            expect(alertService.error)
                .toHaveBeenCalledWith('openlmisAuth.authorization.error', response.data.message);
        });

        it('should not call with message when message is null on 403', function() {
            response.status = 403;
            response.data = {
                message: null
            };

            accessTokenInterceptor.responseError(response);

            expect(alertService.error)
                .not
                .toHaveBeenCalledWith('openlmisAuth.authorization.error', response.data.message);
            expect(alertService.error)
                .toHaveBeenCalledWith('openlmisAuth.authorization.error');
        });

        it('should reject response', function() {
            spyOn($q, 'reject').andCallThrough();

            accessTokenInterceptor.responseError(response);

            expect($q.reject).toHaveBeenCalledWith(response);
        });

    });

});
