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

    angular
        .module('openlmis-auth')
        .factory('RightDataBuilder', RightDataBuilder);

    RightDataBuilder.$inject = [];

    function RightDataBuilder() {

        RightDataBuilder.prototype.withName = withName;
        RightDataBuilder.prototype.withProgramIds = withProgramIds;
        RightDataBuilder.prototype.withProgramCodes = withProgramCodes;
        RightDataBuilder.prototype.withFacilityIds = withFacilityIds;
        RightDataBuilder.prototype.build = build;

        return RightDataBuilder;

        function RightDataBuilder() {
            RightDataBuilder.instanceNumber = RightDataBuilder.instanceNumber ? RightDataBuilder.instanceNumber + 1 : 0;
            this.name = 'RIGHT_NAME_' + RightDataBuilder.instanceNumber;
            this.facilityIds = [];
            this.isDirect = true;
            this.programCodes = [];
            this.programIds = [];
        }

        function withName(name) {
            this.name = name;
            return this;
        }

        function withProgramCodes(programCodes) {
            this.programCodes = programCodes;
            return this;
        }

        function withProgramIds(programIds) {
            this.programIds = programIds;
            return this;
        }

        function withFacilityIds(facilityIds) {
            this.facilityIds = facilityIds;
            return this;
        }

        function build() {
            return {
                name: this.name,
                isDirect: this.isDirect,
                facilityIds: this.facilityIds,
                programIds: this.programIds,
                programCodes: this.programCodes
            };
        }

    }

})();
