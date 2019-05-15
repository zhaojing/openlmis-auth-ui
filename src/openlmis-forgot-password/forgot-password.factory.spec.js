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

describe('openlmis-forgot-password.forgotPasswordFactory', function() {

    beforeEach(function() {
        module('openlmis-forgot-password');

        inject(function($injector) {
            this.forgotPasswordFactory = $injector.get('forgotPasswordFactory');
            this.$rootScope = $injector.get('$rootScope');
            this.$httpBackend = $injector.get('$httpBackend');
            this.openlmisUrlFactory = $injector.get('openlmisUrlFactory');
        });
    });

    it('sendResetEmail should call forgot password endpoint', function() {
        var email = 'user@openlmis.org',
            spy = jasmine.createSpy();

        this.$httpBackend
            .whenPOST(this.openlmisUrlFactory('/api/users/auth/forgotPassword?email=' + email))
            .respond(200, {});

        this.forgotPasswordFactory.sendResetEmail(email).then(spy);

        this.$httpBackend.flush();
        this.$rootScope.$apply();

        expect(spy).toHaveBeenCalled();
    });

});