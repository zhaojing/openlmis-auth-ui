(function() {

    'use strict';

    /**
     * @ngdoc directive
     * @name openlmis-form.directive:select-one-option
     * @restrict E
     *
     * @description
     * Disables an select element if there is only one option, and selects that options.
     *
     * @example
     * The following will be rendered like the commented out markup.
     * ```
     * <select ng-model="vm.value">
     *   <option>-- Select an option --</option>
     *   <option value="awesome">Awesome!</option>
     * </select>
     * <!--
     * <select ng-model="vm.value" disabled>
     *   <option>-- Select an option --</option>
     *   <option value="awesome" selected="selected">Awesome!</option>
     * </select>
     * -->
     * ```
     */
    angular
        .module('openlmis-form')
        .directive('select', select);

    select.$inject = ['bootbox', 'messageService', '$rootScope', '$compile', '$templateRequest'];

    function select(bootbox, messageService, $rootScope, $compile, $templateRequest) {
        return {
            restrict: 'E',
            replace: false,
            require: ['select', '?ngModel'],
            link: link
        };

        function link(scope, element, attrs, ctrls) {
            var selectCtrl = ctrls[0],
                ngModelCtrl = ctrls[1],
                optionsSelector = 'option:not(.placeholder)',
                modal;

            updateSelect();
            if(ngModelCtrl) {
                // using instead of $ngModelCtrl.$render
                // beacuse ngSelect uses it
                scope.$watch(function() {
                    return ngModelCtrl.$modelValue;
                }, updateSelect);

                // See if ng-repeat or ng-options changed
                scope.$watch(function() {
                    return element.html();
                }, updateSelect);
            }

            setPopOut();

            function updateSelect() {
                var options = getOptions();

                if(options.length <= 1) {
                    element.attr('disabled', true);
                } else {
                    element.attr('disabled', false);
                }

                if(options.length == 1) {
                    element.children('option[selected="selected"]').removeAttr('selected');
                    element.children(optionsSelector + ':first').attr('selected', 'selected');

                    updateModel();
                }

                if(isPopOut()) {
                    element.addClass('pop-out');
                } else {
                    element.removeClass('pop-out');
                }
            }

            function getOptions() {
                var options = [];

                angular.forEach(element.children(optionsSelector), function(option) {
                    options.push(angular.element(option)[0]);
                });

                return options;
            }

            function updateModel() {
                if(ngModelCtrl) {
                    var selectedValue = selectCtrl.readValue();
                    ngModelCtrl.$setViewValue(selectedValue);
                }
            }

            function showModal() {
                $templateRequest('openlmis-form/select-search-option.html').then(function(template) {
                    var modalScope = $rootScope.$new();

                    modalScope.options = getOptions();
                    modalScope.select = selectOption;

                    var labelElement = element.siblings('label[for="' + element[0].id + '"]');

                    modal = bootbox.dialog({
                        title: labelElement[0] ? labelElement[0].textContent : '',
                        message: $compile(template)(modalScope)
                    });
                });
            }

            function selectOption(option) {
                element.children('option[selected="selected"]').removeAttr('selected');
                element.children('option[label="' + option.label + '"]').attr('selected', 'selected');

                updateModel();

                if(modal) modal.modal('hide');
            }

            function setPopOut() {
                element.on('mousedown', function (event) {
                    if(isPopOut()) {
                        event.stopPropagation();
                        showModal();
                    }
                });

                element.bind("keydown", function (event) {
                    if(isPopOut() && event.which === 13) {
                        event.stopPropagation();
                        showModal();
                    }
                });
            }

            function isPopOut() {
                return (attrs.popOut !== null && attrs.popOut !== undefined) ||
                    (getOptions().length > 10);
            }
        }
    }
})();
