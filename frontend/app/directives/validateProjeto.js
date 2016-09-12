(function() {
    'use strict';

    //custom directive to validate the Literal types
    //It is used at app/views/addLiteral, with the attribute directive 'validate-type'
    angular.module('controleApp').directive('validateProjeto', [
        function() {
            var link = function($scope, $element, $attrs, ctrl) {

                var validate = function(viewValue) {
                    ctrl.$setValidity('nome', null);

                    var comparisonModel = $attrs.validateProjeto;

                    if(comparisonModel == 'teste'){
                      ctrl.$setValidity('nome', false);
                    } else {
                      ctrl.$setValidity('nome', true);
                    }


                    return viewValue;
                };

                ctrl.$parsers.unshift(validate);
                //ctrl.$formatters.push(validate);

                $attrs.$observe('validateProjeto', function(comparisonModel) {
                    return validate(ctrl.$viewValue);
                });

            };

            return {
                restrict: 'A',
                require: 'ngModel',
                link: link
            };

        }
    ]);
})();
