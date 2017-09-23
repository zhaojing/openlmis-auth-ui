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

describe("openlmis-auth.authorizationService", function() {
    var authorizationService;

    beforeEach(module('openlmis-auth'));

    beforeEach(inject(function(localStorageService) {
        var fakeLocalStorage = {};

        spyOn(localStorageService, 'add').andCallFake(function(key, value){
            fakeLocalStorage[key] = value;
        });
        spyOn(localStorageService, 'remove').andCallFake(function(key){
            fakeLocalStorage[key] = undefined
        });
        spyOn(localStorageService, 'get').andCallFake(function(key){
            return fakeLocalStorage[key];
        });
    }));

    beforeEach(inject(function(_authorizationService_){
        authorizationService = _authorizationService_;
    }));

    it('will return authorized if the accessToken is set', function() {
        expect(authorizationService.isAuthenticated()).toBe(false);

        authorizationService.setAccessToken('token');

        expect(authorizationService.isAuthenticated()).toBe(true);
    });

    it('getAccessToken will return the access token, set by setAccessToken', function() {
        authorizationService.setAccessToken('token');

        expect(authorizationService.getAccessToken()).toBe('token');
    });

    it('setAccessToken will not set a access token if it is falsy, and return false', function() {
        var returnValue = authorizationService.setAccessToken();

        expect(returnValue).toBe(false);
        expect(authorizationService.getAccessToken()).toBe(false);
    });

    it('clearAccessToken will clear the access token', function(){
        authorizationService.setAccessToken('token');

        expect(authorizationService.getAccessToken()).toBe('token');

        authorizationService.clearAccessToken();
        expect(authorizationService.getAccessToken()).toBe(false);
    });

    it('getUser will return an object representing the current user, that is set by setUser', function() {
        authorizationService.setUser('1234','test');

        var user = authorizationService.getUser();
        expect(user.user_id).toBe('1234');
        expect(user.username).toBe('test');
    });

    it('clearUser will remove the user object', function() {
        authorizationService.setUser('1234', 'test');
        expect(authorizationService.getUser()).not.toBeUndefined();

        authorizationService.clearUser();
        expect(authorizationService.getUser()).toBe(false);
    });

});
