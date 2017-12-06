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

xdescribe('AuthorizationService decorator', function() {
    var authorizationService, $rootScope, user, referencedataUserService, localStorageService, cache;

    beforeEach(function() {
        module('openlmis-auth-cache', function($provide) {
            cache = jasmine.createSpyObj('cache', ['getBy', 'put', 'clearAll']);
            $provide.factory('localStorageFactory', function() {
                return function() {
                    return cache;
                };
            });
        });

        inject(function($injector) {
            authorizationService = $injector.get('authorizationService');
            $rootScope = $injector.get('$rootScope');
            referencedataUserService = $injector.get('referencedataUserService');
            localStorageService = $injector.get('localStorageService');
        });

        user = {
            id: 'user-id',
            username: 'some-user'
        };

        spyOn(localStorageService, 'get').andReturn(user.id);
    });

    it('will return a cached user if available', function() {
        cache.getBy.andReturn(user);
        spyOn(referencedataUserService, 'get').andReturn(undefined);

        var result = undefined;
        authorizationService.getUserInfo().then(function(response) {
            result = response;
        });
        $rootScope.$apply();

        expect(result).toEqual(user);
        expect(cache.getBy).toHaveBeenCalledWith('id', user.id);
    });

    it('will call referencedata if there is no user cached', function() {
        spyOn(referencedataUserService, 'get').andReturn(user);
        cache.getBy.andReturn(undefined);

        var result = undefined;
        authorizationService.getUserInfo().then(function(response) {
            result = response;
        });
        $rootScope.$apply();

        expect(result).toEqual(user);
        expect(cache.put).toHaveBeenCalledWith(user);
        expect(referencedataUserService.get).toHaveBeenCalledWith(user.id);
    });

    it('should clear user cache', function() {
        authorizationService.clearUserCache();

        expect(cache.clearAll).toHaveBeenCalled();
    });
});
