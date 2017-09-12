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

describe('openlmis-permissions.permissionService', function() {
    var permissionService, localStorageService, $httpBackend, $rootScope;

    beforeEach(module('openlmis-permissions'));

    beforeEach(inject(function(_$rootScope_, _permissionService_) {
        $rootScope = _$rootScope_;
        permissionService = _permissionService_;
    }));

    beforeEach(inject(function(_localStorageService_) {
        localStorageService = _localStorageService_;
        spyOn(localStorageService, 'get').andReturn(null);
        spyOn(localStorageService, 'add').andCallThrough();
    }));

    beforeEach(inject(function(openlmisUrlFactory, _$httpBackend_) {
        var permissionStrings = [
            'permissionString1|facility-id|program-id',
            'permissionString2|some-facility'
        ];

        $httpBackend = _$httpBackend_;
        $httpBackend.when('GET', openlmisUrlFactory('/api/users/userId/permissionStrings'))
        .respond(permissionStrings);

    }));

    it('will fail and empty all permissions if userId not entered', function() {
        spyOn(permissionService, 'empty').andCallThrough();

        var failed = false;
        permissionService.load()
        .catch(function(){
            failed = true;
        });

        $rootScope.$apply();

        expect(failed).toBe(true);
        expect(permissionService.empty).toHaveBeenCalled();
    });

    it('gets permission strings from the server, and saves them locally', function() {
        var permissions;
        permissionService.load('userId')
        .then(function(response) {
            permissions = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(permissions).toBeTruthy();
        expect(Array.isArray(permissions)).toBeTruthy();

        expect(localStorageService.add).toHaveBeenCalledWith('permissions', angular.toJson(permissions));
    });

    it('correctly parses permission strings from the server', function() {
        var permissions;
        permissionService.load('userId')
        .then(function(response) {
            permissions = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(permissions.length).toBe(2);

        expect(permissions[0].right).toBe('permissionString1');
        expect(permissions[0].facilityId).toBe('facility-id');
        expect(permissions[0].programId).toBe('program-id');

        expect(permissions[1].right).toBe('permissionString2');
        expect(permissions[1].facilityId).toBe('some-facility');
        expect(permissions[1].programId).toBeUndefined();
    });

    it('will return cached permissions, if they are available', function() {
        localStorageService.get.andReturn([{right:'example'}]);

        var permissions;
        permissionService.load('userId')
        .then(function(response) {
            permissions = response;
        });

        $rootScope.$apply();

        expect(permissions.length).toBe(1);
        expect(permissions[0].right).toBe('example');

        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('hasPermission', function() {
        beforeEach(function() {
            localStorageService.get.andReturn([{
                right:'example',
                facilityId: 'facility-id'
            }]);
        });

        function checkPermission(permissionObj) {
            var success = false;

            permissionService.hasPermission('userId', permissionObj)
            .then(function() {
                success = true;
            });

            $rootScope.$apply();
            return success;    
        }

        it('will return FALSE if no arguments', function() {
            expect(checkPermission({})).toBe(false);
        });

        it('will return FALSE if the right is not set', function(){
            expect(checkPermission({
                facilityId: 'facility-id'
            })).toBe(false);

            expect(checkPermission({
                right: 'example',
                facilityId: 'facility-id'
            })).toBe(true); 
        });

        it('will resolve promise if the argument EXACTLY matches a permission', function() {
            // Too vague
            expect(checkPermission({
                right: 'example'
            })).toBe(false);

            // Too strict
            expect(checkPermission({
                right: 'example',
                programId: 'program-id',
                facilityId: 'facility-id'
            })).toBe(false);

            // Just right
            expect(checkPermission({
                right: 'example',
                facilityId: 'facility-id'
            })).toBe(true);
        });

    });

});
