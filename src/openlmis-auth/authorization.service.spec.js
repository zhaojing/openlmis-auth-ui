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

describe('openlmis-auth.authorizationService', function() {

    var authorizationService, localStorageService, RightDataBuilder;

    beforeEach(function() {
        module('openlmis-auth');

        inject(function($injector) {
            authorizationService = $injector.get('authorizationService');
            localStorageService = $injector.get('localStorageService');
            RightDataBuilder = $injector.get('RightDataBuilder');
        });
    });

    describe('setAccessToken', function() {

        it('will return authorized if the accessToken is set', function() {
            expect(authorizationService.isAuthenticated()).toBe(false);

            authorizationService.setAccessToken('token');

            expect(authorizationService.isAuthenticated()).toBe(true);
        });

        it('will not set a access token if it is falsy, and return false', function() {
            var returnValue = authorizationService.setAccessToken();

            expect(returnValue).toBe(false);
            expect(authorizationService.getAccessToken()).toBe(false);
        });

    });

    describe('getAccessToken', function() {

        it('will return the access token, set by setAccessToken', function() {
            authorizationService.setAccessToken('token');

            expect(authorizationService.getAccessToken()).toBe('token');
        });

    });

    describe('clearAccessToken', function() {

        it('will clear the access token', function() {
            authorizationService.setAccessToken('token');

            expect(authorizationService.getAccessToken()).toBe('token');

            authorizationService.clearAccessToken();
            expect(authorizationService.getAccessToken()).toBe(false);
        });

    });

    describe('clearUser', function() {

        it('will remove the user object', function() {
            authorizationService.setUser('1234', 'test');
            expect(authorizationService.getUser()).not.toBeUndefined();

            authorizationService.clearUser();
            expect(authorizationService.getUser()).toBe(false);
        });

    });

    describe('getUser', function() {

        it('will return an object representing the current user, that is set by setUser', function() {
            authorizationService.setUser('1234', 'test');

            var user = authorizationService.getUser();
            expect(user.user_id).toBe('1234');
            expect(user.username).toBe('test');
        });

    });

    describe('hasRight', function() {

        beforeEach(function() {
            authorizationService.setRights([
                new RightDataBuilder()
                    .withName('RIGHT_SUPERVISION')
                    .withProgramCodes(['program'])
                    .withProgramIds(['1'])
                    .withFacilityIds(['2'])
                    .build()
            ]);
        });

        it('should return false if right name is undefined', inject(function() {
            expect(function() {
                authorizationService.hasRight(undefined);
            }).toThrow(new Error('Right name is required'));
        }));

        it('should return true if supervision right name is found with program id and facility id', function() {
            expect(authorizationService.hasRight('RIGHT_SUPERVISION', {
                programId: '1',
                facilityId: '2'
            })).toBe(true);
        });

        it('should return false if supervision right name is found with program id but not facility id', function() {
            expect(authorizationService.hasRight('RIGHT_SUPERVISION', {
                programId: '1',
                facilityId: 'not found'
            })).toBe(false);
        });
    });

    describe('hasRights', function() {

        beforeEach(function() {
            authorizationService.setRights([
                new RightDataBuilder()
                    .withName('RIGHT_ONE')
                    .build(),
                new RightDataBuilder()
                    .withName('RIGHT_TWO')
                    .build()
            ]);
        });

        it('should return false if user does not have all required rights', function() {
            expect(authorizationService.hasRights(['RIGHT_ONE', 'RIGHT_THREE'], true)).toBe(false);
        });

        it('should return false if user does not have at least one required right', function() {
            expect(authorizationService.hasRights(['RIGHT_THREE', 'RIGHT_FOUR'], false)).toBe(false);
        });

        it('should return true if user has all required rights', function() {
            expect(authorizationService.hasRights(['RIGHT_ONE', 'RIGHT_TWO'], true)).toBe(true);
        });

        it('should return true if user has at least one required right', function() {
            expect(authorizationService.hasRights(['RIGHT_ONE', 'RIGHT_THREE'], false)).toBe(true);
        });

    });

    afterEach(function() {
        localStorageService.remove('ACCESS_TOKEN');
        localStorageService.remove('USER_ID');
        localStorageService.remove('USERNAME');
        localStorageService.remove('ROLE_ASSIGNMENTS');
    });

});
