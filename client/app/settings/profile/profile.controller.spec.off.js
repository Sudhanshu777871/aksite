describe('Controller: ProfileSettingsCtrl', function() {

    // load the controller's module
    beforeEach(() => angular.mock.module('aksiteApp'));

    var DashboardCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        DashboardCtrl = $controller('DashboardCtrl', {
            $scope: scope
        });
    }));

    it('should ...', function() {
        expect(1).to.equal(1);
    });
});
