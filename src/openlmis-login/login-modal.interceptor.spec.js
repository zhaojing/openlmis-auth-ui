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

describe('LoginModalInterceptor', function() {

    beforeEach(function() {
        module('openlmis-login');

        inject(function($injector) {
            this.loginModalService = $injector.get('loginModalService');
            this.$rootScope = $injector.get('$rootScope');
            this.$q = $injector.get('$q');
        });

        this.loginDeferred = this.$q.defer();
        spyOn(this.loginModalService, 'open').andReturn(this.loginDeferred.promise);

        this.$rootScope.$broadcast('event:auth-loginRequired');
    });

    it('should open login modal dialog on event:auth-loginRequired', function() {
        this.$rootScope.$apply();

        expect(this.loginModalService.open).toHaveBeenCalled();
    });

});
