
app.controller('peoplelistCtrl', function ($scope, $rootScope, $ionicLoading, $timeout, $filter,MemberManager, ContactManager, ContactTreeManager, DepMembersManager, $stateParams, $state, Api, XMPPClient, MessageInfoManager) {

    var departmentId = parseInt($stateParams.departmentId);
    var root = ContactTreeManager.get(departmentId);
    $scope.localStorageID=localStorage.id;
    $scope.depName = root.name;
    //$scope.peoplelist = MemberManager.listByDep(departmentId);
    $scope.peoplelist={};
    var t = MemberManager.initialize();
    t.then(function (result) {
        $scope.peoplelist = result;
    });
    $scope.hasData = true;
    // $timeout(function () {
    //     getnew();
    // }, 3);
    // var getnew = function () {
    //     $scope.peoplelist = MemberManager.listByDep(departmentId);
    // };
    $scope.toggleClick = function(item,$event) {
        item.marked=!item.marked;
        MemberManager.update(item);
        if (item.marked) {
            var node = {
                id: item.id,
                parentId: item.parentId,
                name: item.name,
                type: 1,
                open: false,
                hasChild: false
            }
            ContactManager.add(node);
        }
        else ContactManager.remove(item.id, item.parentId);
        $event.stopImmediatePropagation();
    };
    $scope.chat = function (id) {
        $state.go('tab.messageSingle', { depId: $stateParams.departmentId, memberId: id });
    }

    $rootScope.$on('ctrl:peopleList:refresh', function (event) {
        $scope.peoplelist = MemberManager.listByDep(departmentId);
    });

    $timeout(function () {
        $scope.$apply();
    }, 2000);
    
});

