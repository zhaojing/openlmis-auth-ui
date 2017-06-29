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

(function() {

    'use strict';

    /**
     * @module auth-state-router
     *
     * @description
     * Provides state router to the application. Every time the state is changed the router checks
     * whether the user is authorized and opens a login modal prompting prompting the user for
     * credentials if (s)he is not logged in.
     */
    angular.module('auth-state-router', [
        'openlmis-auth',
        'openlmis-login',
        'openlmis-modal'
    ]);

})();
