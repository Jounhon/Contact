
app.factory('Api', function ($http) {
    return {
        getGroupList: function (onSuccess) {
            $http.get('URL_PEOPLE').
            success(function (data, status, headers, config) {
                (onSuccess || angular.noop)(data);
            }).
            error(function (data, status, headers, config) {
                alert("Error - Data:" + data + " status:" + status);
            });
        },
        getPhoneDetail: function (onSuccess) {
            $http.get('URL_Phone').
            success(function (data, status, headers, config) {
                (onSuccess || angular.noop)(data);
            }).
            error(function (data, status, headers, config) {
                alert("Error - Data:" + data + " status:" + status);
            });
        }, getMemberDetail: function (onSuccess) {
            $http.get('URL_Member').
            success(function (data, status, headers, config) {
                (onSuccess || angular.noop)(data);
            }).
            error(function (data, status, headers, config) {
                alert("Error - Data:" + data + " status:" + status);
            });
        }
    };
});