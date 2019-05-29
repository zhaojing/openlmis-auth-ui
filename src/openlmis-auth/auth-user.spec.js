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

describe('AuthUser', function() {

    beforeEach(function() {
        module('openlmis-auth');

        inject(function($injector) {
            this.AuthUser = $injector.get('AuthUser');
        });

        this.USER_ID = 'some-id';
        this.USERNAME = 'someUser';
        this.authUser = new this.AuthUser(this.USER_ID, this.USERNAME);
    });

    describe('constructor', function() {

        it('should set user_id', function() {
            expect(this.authUser.user_id).toEqual(this.USER_ID);
        });

        it('should set username', function() {
            expect(this.authUser.username).toEqual(this.USERNAME);
        });

    });

});
