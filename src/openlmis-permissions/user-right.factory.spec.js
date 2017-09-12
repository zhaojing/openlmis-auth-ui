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

describe('userRightsFactory', function() {

    var $rootScope, $q, rights;

    beforeEach(module('openlmis-permissions'));

    beforeEach(inject(function(_$rootScope_,  _$q_, _userRightsFactory_) {
        $rootScope = _$rootScope_;
        $q = _$q_;
        userRightsFactory = _userRightsFactory_;
    }));

    beforeEach(inject(function(permissionService) {
        var permissions = makePermissions();
        spyOn(permissionService, 'load').andReturn($q.resolve(permissions));
    }));

    beforeEach(function() {
        userRightsFactory('userId')
        .then(function(builtRights) {
            rights = builtRights;
        });

        $rootScope.$apply();
    });

    it('should not duplicate rights', function() {
        expect(rights.length).toBe(3);
    });

    it('should group programs', function() {
        expect(rights[0].programIds.length).toBe(2);
        expect(rights[0].programIds[0]).toBe('program1');
        expect(rights[0].programIds[1]).toBe('program2');
    });

    it('should group facilities', function() {
        expect(rights[1].facilityIds.length).toBe(2);
        expect(rights[1].facilityIds[0]).toBe('facility-1');
        expect(rights[1].facilityIds[1]).toBe('facility-2');
    });

    it('should mark right as direct if no program or facility id is associated with permission', function() {
        expect(rights[2].isDirect).toBe(true);
    });

    function makePermissions() {
        return [{
            right: 'example',
            facilityId: 'facility-1',
            programId: 'program1'
        }, {
            right: 'example',
            facilityId: 'facility-2',
            programId: 'program1'
        }, {
            right: 'example',
            facilityId: 'facility-3',
            programId: 'program2'
        }, {
            right: 'otherExample',
            facilityId: 'facility-1'
        }, {
            right: 'otherExample',
            facilityId: 'facility-2'
        }, {
            right: 'DIRECT_RIGHT'
        }];
    }
});
