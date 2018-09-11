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

describe('openlmis-reset-password.changePasswordFactory', function() {

    var changePasswordFactory, $httpBackend, $rootScope, openlmisUrlFactory, spy;

    beforeEach(function() {
        module('openlmis-reset-password');

        inject(function($injector) {
            changePasswordFactory = $injector.get('changePasswordFactory');
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            openlmisUrlFactory = $injector.get('openlmisUrlFactory');
        });

        var data = {
            token: 'token',
            newPassword: 'password'
        };

        $httpBackend.when('POST', openlmisUrlFactory('/api/users/auth/changePassword'))
            .respond(function(method, url, body) {
                if (body === angular.toJson(data)) {
                    return [200];
                }
                return [404];

            });
    });

    it('will resolve for successful requests', function() {
        spy = jasmine.createSpy();
        changePasswordFactory.changePassword('password', 'token').then(spy);

        $httpBackend.flush();
        $rootScope.$apply();

        expect(spy).toHaveBeenCalled();
    });

    it('will reject for failed requests', function() {
        spy = jasmine.createSpy();
        changePasswordFactory.changePassword('password', 'incorrect token').catch(spy);

        $httpBackend.flush();
        $rootScope.$apply();

        expect(spy).toHaveBeenCalled();
    });

});