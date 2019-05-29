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

describe('this.accessTokenFactory', function() {

    beforeEach(function() {
        module('openlmis-auth');

        inject(function($injector) {
            this.authorizationService = $injector.get('authorizationService');
            this.accessTokenFactory = $injector.get('accessTokenFactory');
        });
    });

    it('should update query param value when key exists', function() {
        var uri = 'http://example.com/requisitions?program=abc&access_token=123';
        var updatedUri = this.accessTokenFactory.updateQueryStringParameter(uri, 'access_token', '321');

        expect(updatedUri).toEqual('http://example.com/requisitions?program=abc&access_token=321');
    });

    it('should not update query param value when key not exists', function() {
        var uri = 'http://example.com/requisitions?program=abc';
        var updatedUri = this.accessTokenFactory.updateQueryStringParameter(uri, 'access_token', '321');

        expect(updatedUri).toEqual(uri);
    });

    it('should add access_token if not already in URI', function() {
        spyOn(this.authorizationService, 'getAccessToken').andReturn('123');

        var uri = 'http://example.com/requisitions?program=abc';
        var updatedUri = this.accessTokenFactory.addAccessToken(uri);

        expect(updatedUri).toEqual('http://example.com/requisitions?program=abc&access_token=123');
    });

    it('should not add access_token if already in URI', function() {
        spyOn(this.authorizationService, 'getAccessToken').andReturn('321');

        var uri = 'http://example.com/requisitions?program=abc&access_token=123';
        var updatedUri = this.accessTokenFactory.addAccessToken(uri);

        expect(updatedUri).toEqual('http://example.com/requisitions?program=abc&access_token=123');
    });

    it('should update access_token when "access_token" key in query params', function() {
        spyOn(this.authorizationService, 'getAccessToken').andReturn('321');

        var uri = 'http://example.com/requisitions?program=abc&access_token=123';
        var updatedUri = this.accessTokenFactory.updateAccessToken(uri);

        expect(updatedUri).toEqual('http://example.com/requisitions?program=abc&access_token=321');
    });

    it('should not update access_token when "access_token" key not in query params', function() {
        spyOn(this.authorizationService, 'getAccessToken').andReturn('321');

        var uri = 'http://example.com/requisitions?program=abc';
        var updatedUri = this.accessTokenFactory.updateAccessToken(uri);

        expect(updatedUri).toEqual(uri);
    });

    it('should create a token header', function() {
        spyOn(this.authorizationService, 'getAccessToken').andReturn('321');

        var header = this.accessTokenFactory.authHeader();

        expect(header).toEqual('Bearer 321');
    });
});
