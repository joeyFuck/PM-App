angular.module('starter.services', [])

.factory('CheckProjects', ['$http', '$state',function ($http, $state) {
    var projects = [{
        proId: 1,
        proName: '龙驰幕墙工程有限公司二期工程一标'
    }, {
        proId: 2,
        proName: '军区截污纳管工程一期（德胜路以北）'
    }, {
        proId: 3,
        proName: '杭政工出【2014】13号地块工业厂房（标准厂房）工程'
    }, {
        proId: 4,
        proName: '南苑路北侧支路二工程'
    }, {
        proId: 5,
        proName: '南苑路北侧支路一工程'
    }, {
        proId: 6,
        proName: '新建工程（杭州口岸国际物流有限公司）'
    }, {
        proId: 7,
        proName: '东部湾总部基地规划支路四至支路六'
    }, {
        proId: 8,
        proName: '东部湾总部基地规划支路一至支路三'
    }, {
        proId: 9,
        proName: '浙江经济职业技术学院学生宿舍及其它生活设施用房工程住宿餐饮区装饰工程'
    }, {
        proId: 10,
        proName: '杭州经济技术开发区景苑中学工程'
    }, {
        proId: 11,
        proName: '龙驰幕墙工程有限公司二期工程二标'
    }];

    return {
        all: function ($http) {
            //return projects;
            //$http.get(ApiEndpoint.url + '/zasys/getchecklist/?stype=&skey=&r=' + Math.random()).success(function (data) {
            //    if (data.success) {
            //        alert(data.success);
            //        return data.rows;
            //    } else {
            //        return [];
            //    }
            //})
        },

        get: function (proId) {
            for (var i = 0; i < projects.length; i++) {
                if (projects[i].proId === parseInt(proId)) {
                    return projects[i];
                }
            }
            return null;
        }
    };
}])
.factory('WaitList', ['$http', '$state', function ($http, $state) {
    var waitlist = [];
    return {
        all: function () {
            return waitlist;
        },
        push: function (list) {
            waitlist = waitlist.concat(list);
        },
        remove: function (noticeId) {           
            for (var i = 0; i < waitlist.length; i++) {
                if (waitlist[i].NoticeID == noticeId) {                   
                    waitlist.splice(i, 1);
                }
            }
        }
    };
}])
  
.factory('BoardProjects', function () {
    var projects = [{
        proId: 1,
        proName: '龙驰幕墙工程有限公司二期工程一标'
    }, {
        proId: 2,
        proName: '军区截污纳管工程一期（德胜路以北）'
    }, {
        proId: 3,
        proName: '杭政工出【2014】13号地块工业厂房（标准厂房）工程'
    }, {
        proId: 4,
        proName: '南苑路北侧支路二工程'
    }, {
        proId: 5,
        proName: '南苑路北侧支路一工程'
    }, {
        proId: 6,
        proName: '新建工程（杭州口岸国际物流有限公司）'
    }, {
        proId: 7,
        proName: '东部湾总部基地规划支路四至支路六'
    }, {
        proId: 8,
        proName: '东部湾总部基地规划支路一至支路三'
    }, {
        proId: 9,
        proName: '浙江经济职业技术学院学生宿舍及其它生活设施用房工程住宿餐饮区装饰工程'
    }, {
        proId: 10,
        proName: '杭州经济技术开发区景苑中学工程'
    }, {
        proId: 11,
        proName: '龙驰幕墙工程有限公司二期工程二标'
    }];

    return {
        all: function () {
            return projects;
        },

        get: function (proId) {
            for (var i = 0; i < projects.length; i++) {
                if (projects[i].proId === parseInt(proId)) {
                    return projects[i];
                }
            }
            return null;
        }
    };
})
//.factory('focus', function ($timeout, $window) {  
//  return function (id) {  
//    $timeout(function () {  
//      var element = $window.document.getElementById(id);  
//      if (element)  
//        element.focus();  
//    });  
//  };  
// })
//.factory('httpInterceptor', [ '$q', '$injector',function($q, $injector) {  
//    var httpInterceptor = {  
//        'responseError' : function(response) {  
//            if (response.status == 401) {
//                var rootScope = $injector.get('$rootScope');  
//                var state = $injector.get('$rootScope').$state.current.name;  
//                rootScope.stateBeforLogin = state;  
//                rootScope.$state.go("login");  
//                return $q.reject(response);  
//            } else if (response.status === 404) {  
//                alert("404!");  
//                return $q.reject(response);  
//            }  
//        },  
//        'response' : function(response) {  
//            return response;  
//        }  
//    }  
//    return httpInterceptor;  
//}]);
