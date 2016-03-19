app.controller('settingCtrl', function ($http, $state, $scope, $ionicSlideBoxDelegate, $ionicScrollDelegate, $timeout, SelfDetailManager, ContactTreeManager, DepMembersManager, $ionicModal, $rootScope, Api) {
   //

    $scope.people = SelfDetailManager.get(localStorage.id);
   
    $scope.data = {
        nodeValue: $scope.people.topNode,
    };
    if ($scope.people.topNode === null) $scope.data.nodeValue = "";
    $scope.depsName = {};
    $scope.lockDiv = false;
    $timeout(function () {
        $scope.lockDiv=true;
    }, 3);
    $scope.change = function () {
        $scope.lockDiv = !$scope.lockDiv;
        $ionicScrollDelegate.resize();
    }
    $scope.sync = function (value) {
        for (var key in $scope.option) {
            $scope.option[key].nodeValue = value;
        }
    }
    $scope.init = function () {
        $scope.check();
        var nodes = '', radio = {}, check = {};

        for (var key in $scope.option) {
            var box = {};
            if ($scope.option[key].nodeValue == '' || $scope.option[key].nodeValue == $scope.option[key].allNode) {
                nodes = $scope.option[key].nodeValue;
                break;
            }
            else nodes += $scope.option[key].nodeValue + "::";
            radio[key] = { nodeValue: $scope.option[key].nodeValue };
            for (var key2 in $scope.option[key].checkbox) {
                box[key2] = { checked: $scope.option[key].checkbox[key2].checked };
                if (box[key2].checked) nodes += $scope.option[key].checkbox[key2].value + "::";
            }
            check[key] = box;
        }
        $scope.people.topNode = nodes;
        $scope.people.radioNode = radio;
        $scope.people.checkNode = check;
        SelfDetailManager.update($scope.people);
        Api.updateTopNode($scope.people.id, nodes);
    }
    $scope.check = function () {
        for (var key in $scope.option) {
            var item=$scope.option[key];
            if (item.nodeValue === '' || item.nodeValue === item.allNode) {
                item.nodeValue = item.radiobox[0].value;
            }
        }
    }
    $scope.option = {};
    $scope.RadioUpdate = function (value) {
        var nodes = '', radio = {};
        if (value === '' || value === $scope.option[$scope.Deps[0].parentId].allNode) {
            nodes = value;
        } else {
            for (var key in $scope.option) {
                nodes += $scope.option[key].nodeValue + "::";
            }
        }
        for (var key in $scope.option) {
            radio[key] = { nodeValue: $scope.option[key].nodeValue };
        }
        $scope.people.topNode = nodes;
        $scope.people.radioNode = radio;
        SelfDetailManager.update($scope.people);
        Api.updateTopNode($scope.people.id, nodes);
    }
    $scope.checkUpdate = function (checkbox) {
        var nodes = '', check = {};
        for (var key in $scope.option) {
            nodes += $scope.option[key].nodeValue + "::";
        }
        if (checkbox.checked) {
            nodes += checkbox.value;
        }
        for (var key in $scope.option) {
            var box={};
            for (var key2 in $scope.option[key].checkbox) {
                box[key2]={checked:$scope.option[key].checkbox[key2].checked};
            }
            check[key] = box;
        }
        $scope.people.topNode = nodes;
        $scope.people.checkNode = check;
        SelfDetailManager.update($scope.people);
        Api.updateTopNode($scope.people.id, nodes);
    }
    var getLevel = function (parentId) {
        var count = 1;
        var rootId = parentId;
        while (rootId != null) {
            var root = ContactTreeManager.get(rootId);
            rootId = root.rootId;
            count++;
        }
        return count;
    }
    $scope.showIcon = function (item,index) {
        var length = Object.keys(item.depName).length;
        if (index>=length) return false;
        else return true;
    }
    $scope.Deps = DepMembersManager.getById(localStorage.id);
    for (var key in $scope.Deps) {
        var names = {};
        var count = getLevel($scope.Deps[key].parentId);
        var root = ContactTreeManager.get($scope.Deps[key].parentId);
        var sels = {}, sel_count = 0, node = "";
        node += $scope.Deps[key].parentId;
        sels[sel_count] = { select: root.name, value: node };
        while (root.parentId != null) {
            names[count] = root.name;
            count--;
            sel_count++;
            root = ContactTreeManager.get(root.parentId);
            node += "::" + root.id;
            sels[sel_count] = { select: root.name, value: node };
            if (root.parentId == null) unitId = root.id;
        }
        $scope.depsName[key] ={
            depName: names,
            tel: $scope.Deps[key].tel,
            job:$scope.Deps[key].job
        }
        var allNode = '';
        var selection={};
        var Unit = ContactTreeManager.listById(null);
        for (var key2 in Unit) {
            allNode += Unit[key2].id + "::";
            if (Unit[key2].id === unitId) continue;
            else {
                if (Object.keys($scope.people.checkNode).length === 0) checked = false;
                else {
                    if (!$scope.people.checkNode[$scope.Deps[key].parentId]) {checked=false }
                    else checked = $scope.people.checkNode[$scope.Deps[key].parentId][key2].checked;
                }
                selection[key2] = { text: Unit[key2].name, checked: checked, value: Unit[key2].id };
            }
        }
        if (Object.keys($scope.people.radioNode).length === 0) nodevalue = '';
        else {
            if (!$scope.people.radioNode[$scope.Deps[key].parentId]) nodevalue = sels[0].value;
            else nodevalue = $scope.people.radioNode[$scope.Deps[key].parentId].nodeValue;
        }
        $scope.option[$scope.Deps[key].parentId] = {
            radiobox: sels,
            allNode: allNode,
            nodeValue: nodevalue ,
            name: 'group' + key,
            checkbox: selection
        }
    }
    if (Object.keys($scope.option).length == 1) $scope.showpaper = false;
    else $scope.showpaper = true;

    $rootScope.$on('ctrl:setting:refresh', function (event) {
        Api.getMyMemberInfo(localStorage.phone, function (data) {
            receiveData = data;
            var tels = [];
            for (var key in receiveData.jobTels) {
                tels.push(receiveData.jobTels[key].tel);
            }
            var member = SelfDetailManager.get(localStorage.id);
            member.tel = tels;
            SelfDetailManager.update(member);
            $scope.Deps = DepMembersManager.getById(localStorage.id);
            $state.reload();
        });
    });

    $timeout(function () {
        $scope.$apply();
    }, 2000);
});