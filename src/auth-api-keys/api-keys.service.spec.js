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

describe('apiKeysService', function() {

    var authUrl, $httpBackend, $rootScope, apiKeysService, ApiKeyBuilder,
        apiKeys;

    beforeEach(function() {
        module('auth-api-keys');

        inject(function($injector) {
            authUrl = $injector.get('authUrl');
            apiKeysService = $injector.get('apiKeysService');
            $rootScope = $injector.get('$rootScope');
            $httpBackend = $injector.get('$httpBackend');
            ApiKeyBuilder = $injector.get('ApiKeyBuilder');
        });

        apiKeys = [
            new ApiKeyBuilder().build(),
            new ApiKeyBuilder().build()
        ];
    });

    describe('create', function() {

        beforeEach(function() {
            $httpBackend.whenPOST(authUrl('/api/apiKeys')).respond(200, apiKeys[0]);
        });

        it('should return promise', function() {
            var result = apiKeysService.create();
            $httpBackend.flush();

            expect(result.then).not.toBeUndefined();
        });

        it('should resolve to service account', function() {
            var result;

            apiKeysService.create().then(function(data) {
                result = data;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(result.apiKey).toEqual(apiKeys[0].apiKey);
        });

        it('should make a proper request', function() {
            $httpBackend.expectPOST(authUrl('/api/apiKeys'));

            apiKeysService.create();
            $httpBackend.flush();
        });
    });

    describe('remove', function() {

        var token = 'key';

        beforeEach(function() {
            $httpBackend.whenDELETE(authUrl('/api/apiKeys/' + token)).respond(204);
        });

        it('should return promise', function() {
            var result = apiKeysService.remove(token);
            $httpBackend.flush();

            expect(result.then).not.toBeUndefined();
        });

        it('should make a proper request', function() {
            $httpBackend.expectDELETE(authUrl('/api/apiKeys/' + token));

            apiKeysService.remove(token);
            $httpBackend.flush();
        });
    });

    describe('query', function() {

        var params = {
            page: 1,
            size: 10
        };

        beforeEach(function() {
            $httpBackend.whenGET(authUrl('/api/apiKeys?page=' + params.page + '&size=' + params.size)).respond(200, {
                content: apiKeys
            });
        });

        it('should return promise', function() {
            var result = apiKeysService.query(params);
            $httpBackend.flush();

            expect(result.then).not.toBeUndefined();
        });

        it('should resolve to service accounts page', function() {
            var result;

            apiKeysService.query(params)
            .then(function(data) {
                result = data;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(result.content).toEqual(apiKeys);
        });

        it('should make a proper request', function() {
            $httpBackend.expectGET(authUrl('/api/apiKeys?page=' + params.page + '&size=' + params.size));

            apiKeysService.query(params);
            $httpBackend.flush();
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});
