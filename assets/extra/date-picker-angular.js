define(['app', 'directive/datepickerCtrl'], function (app) {
    app.directive('datepicker', function () {
        return {
            restrict: 'A',
            controller: 'datepickerCtrl',
            controllerAs: 'dp',
            templateUrl: 'app/directive/datepicker.html',
            scope: {
                'value': '='
            },
            link: function (scope) {
               
            }
        };
    });
});

define(['app'], function (app) {
    app.controller('datepickerCtrl', function ($scope) {
        var self = this;
        $('.date').datepicker({ autoclose: true, todayHighlight: true });
        $scope.$watch('value', function (oldVal, newVal) {
                        console.log("Value: "+ $scope.value);
        });
    } );
});