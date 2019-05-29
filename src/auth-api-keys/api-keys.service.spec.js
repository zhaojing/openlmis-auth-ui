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

    beforeEach(function() {
        module('auth-api-keys');

        inject(function($injector) {
            this.authUrl = $injector.get('authUrl');
            this.apiKeysService = $injector.get('apiKeysService');
            this.$rootScope = $injector.get('$rootScope');
            this.$httpBackend = $injector.get('$httpBackend');
            this.ApiKeyBuilder = $injector.get('ApiKeyBuilder');
        });

        this.apiKeys = [
            new this.ApiKeyBuilder().build(),
            new this.ApiKeyBuilder().build()
        ];
    });

    describe('create', function() {

        beforeEach(function() {
            this.$httpBackend
                .whenPOST(this.authUrl('/api/apiKeys'))
                .respond(200, this.apiKeys[0]);
        });

        it('should return promise', function() {
            var result = this.apiKeysService.create();
            this.$httpBackend.flush();

            expect(result.then).not.toBeUndefined();
        });

        it('should resolve to service account', function() {
            var result;

            this.apiKeysService.create().then(function(data) {
                result = data;
            });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(result.apiKey).toEqual(this.apiKeys[0].apiKey);
        });

        //eslint-disable-next-line jasmine/missing-expect
        it('should make a proper request', function() {
            this.$httpBackend.expectPOST(this.authUrl('/api/apiKeys'));

            this.apiKeysService.create();
            this.$httpBackend.flush();
        });
    });

    describe('remove', function() {

        beforeEach(function() {
            this.token = 'key';

            this.$httpBackend
                .whenDELETE(this.authUrl('/api/apiKeys/' + this.token))
                .respond(204);
        });

        it('should return promise', function() {
            var result = this.apiKeysService.remove(this.token);
            this.$httpBackend.flush();

            expect(result.then).not.toBeUndefined();
        });

        //eslint-disable-next-line jasmine/missing-expect
        it('should make a proper request', function() {
            this.$httpBackend.expectDELETE(this.authUrl('/api/apiKeys/' + this.token));

            this.apiKeysService.remove(this.token);
            this.$httpBackend.flush();
        });
    });

    describe('query', function() {

        beforeEach(function() {
            this.params = {
                page: 1,
                size: 10
            };

            this.$httpBackend
                .whenGET(this.authUrl('/api/apiKeys?page=' + this.params.page + '&size=' + this.params.size))
                .respond(200, {
                    content: this.apiKeys
                });
        });

        it('should return promise', function() {
            var result = this.apiKeysService.query(this.params);
            this.$httpBackend.flush();

            expect(result.then).not.toBeUndefined();
        });

        it('should resolve to service accounts page', function() {
            var result;

            this.apiKeysService.query(this.params)
                .then(function(data) {
                    result = data;
                });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(result.content).toEqual(this.apiKeys);
        });

        //eslint-disable-next-line jasmine/missing-expect
        it('should make a proper request', function() {
            this.$httpBackend
                .expectGET(this.authUrl('/api/apiKeys?page=' + this.params.page + '&size=' + this.params.size));

            this.apiKeysService.query(this.params);
            this.$httpBackend.flush();
        });
    });

    afterEach(function() {
        this.$httpBackend.verifyNoOutstandingExpectation();
        this.$httpBackend.verifyNoOutstandingRequest();
    });
});
