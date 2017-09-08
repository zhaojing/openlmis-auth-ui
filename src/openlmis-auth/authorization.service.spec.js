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

describe("authorizationService", function() {

  beforeEach(module('openlmis-auth'));

  var authorizationService, httpBackend, $rootScope, localStorageService;

  beforeEach(module(function($provide){
    $provide.factory('authUrl', function(pathFactory){
      return function(url){
        return pathFactory('/', url);
      }
    })
  }));

  beforeEach(inject(function(_authorizationService_, _$httpBackend_, _$rootScope_, _localStorageService_) {
    httpBackend = _$httpBackend_;
    authorizationService = _authorizationService_;
    $rootScope = _$rootScope_;
    localStorageService = _localStorageService_;

    localStorageService.clearAll();
    spyOn(localStorageService, 'remove');
    spyOn(localStorageService, 'get');

    // Keep auth interceptor from running....
    spyOn($rootScope, '$on');

  }));

  ddescribe('hasRight', function() {

    beforeEach(function(){
      var mockRights = [{
        id: "123",
        name: 'EXAMPLE_RIGHT',
        programCodes: [
          'abc'
        ],
        programIds: [
          "123"
        ],
        supervisoryNodeCodes: [
          "nodeCode"
        ],
        supervisoryNodeIds: [
          "nodeId"
        ]
      }];
      localStorageService.get.andReturn(mockRights);
    });

    it('should return false if right name is undefined', function() {
       expect(function() {
            authorizationService.hasRight(undefined);
       }).toThrow(new Error("Right name is required"));

       expect(localStorageService.get).not.toHaveBeenCalled();
    });

    it('will authorize user if they have the correct right name', function() {
      expect(authorizationService.hasRight("fake")).toBe(false);
      expect(authorizationService.hasRight('EXAMPLE_RIGHT')).toBe(true);
    });
    it('will authorize a user if given a right and program code', function() {
      var hasRight = authorizationService.hasRight('EXAMPLE_RIGHT', {
        programCode: 'abc'
      });

      expect(hasRight).toBe(true);
    });
    it('will authorize a user if given a right and program ID', function() {
      var hasRight = authorizationService.hasRight('EXAMPLE_RIGHT', {
        programId: '123'
      });

      expect(hasRight).toBe(true);
    });
    it('will authorize a user if given a right and supervisory node code', function() {
      var hasRight = authorizationService.hasRight('EXAMPLE_RIGHT', {
        supervisoryNodeCode: 'nodeCode'
      });

      expect(hasRight).toBe(true);
    });
    it('will authorize a user if given a right and supervisory node ID', function() {
      var hasRight = authorizationService.hasRight('EXAMPLE_RIGHT', {
        supervisoryNodeId: 'nodeId'
      });

      expect(hasRight).toBe(true);
    });
    it('will authorize a user if given a right, a program, and a facility', function() {
      var hasRight = authorizationService.hasRight('EXAMPLE_RIGHT', {
        supervisoryNodeCode: 'nodeCode',
        programCode: 'abc'
      });

      expect(hasRight).toBe(true);
    });
  });

});
