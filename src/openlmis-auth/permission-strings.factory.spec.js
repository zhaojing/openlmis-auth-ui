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

describe('openlmis-auth.permissionStringsService', function() {
    var permissionStringsService, localStorageService, $httpBackend, $rootScope;

    beforeEach(module('openlmis-auth'));

    beforeEach(inject(function(_$rootScope_, _permissionStringsService_) {
        $rootScope = _$rootScope_;
        permissionStringsService = _permissionStringsService_;
    }));

    beforeEach(inject(function(authorizationService) {
        var user = {
            user_id: 'userId'
        };

        spyOn(authorizationService, 'getUser').andReturn(user);
    }));

    beforeEach(inject(function(_localStorageService_) {
        localStorageService = _localStorageService_;
        spyOn(localStorageService, 'get').andReturn(null);
        spyOn(localStorageService, 'add');
    }));

    beforeEach(inject(function(authUrl, _$httpBackend_) {
        var permissionStrings = [
            'permissionString1',
            'permissionString2'
        ];

        $httpBackend = _$httpBackend_;
        $httpBackend.when('GET', authUrl('/api/users/userId/permissionStrings'))
        .respond(permissionStrings);

    }));

    it('gets permission strings from the server, and saves them locally', function() {
        var permissionStrings;
        permissionStringsService.getAll()
        .then(function(response){
            permissionStrings = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(permissionStrings).toBeTruthy();
        expect(permissionStrings.length).toBe(2);
        expect(permissionStrings[0]).toBe('permissionString1');

        expect(localStorageService.add).toHaveBeenCalled();
    });

    it('will return cached strings, if they are available', function() {
        localStorageService.get.andReturn(['permissionString']);

        var permissionStrings;
        permissionStringsService.getAll()
        .then(function(response){
            permissionStrings = response;
        });

        $rootScope.$apply();

        expect(permissionStrings.length).toBe(1);
        expect(permissionStrings[0]).toBe('permissionString');
    });

    it('will check to update cached string when a user logs in');

    it('will clear cached strings on logout');

});
