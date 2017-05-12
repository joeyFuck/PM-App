// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])
.run(function ($ionicPlatform, $location,$timeout,$ionicHistory,$ionicLoading,$http,ApiEndpoint) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }

    });
	
  document.addEventListener("plusready", onPlusReady, false);
  			
        	function onPlusReady() {     
        		var checkurl;
        	 	plus.runtime.getProperty(plus.runtime.appid,function(inf){
        			wgtVer=inf.version;
        			$http.get(ApiEndpoint.url+"/api/login/checkupdate?version="+wgtVer).success(function(data){       				
	   			 	if(data.hasnewversion){	   			 			   			 		
			   			 	plus.nativeUI.confirm( "有新版本，是否更新？", function(e){
			   			 		if(e.index==0){	
			   			 			downWgt(ApiEndpoint.url+"/api/login/getnewversionfile?devtype="+plus.os.name);			   			 			
			   			 		} 
			   			 	}, "提示", ["更新","取消"] );		   			 	
			   			 	checkurl=ApiEndpoint.url+checkurl;
	   			 		
	   			 	}
	   			 })	   			 
   			 	});
   			 
   			function downWgt(downurl){
			    plus.nativeUI.showWaiting("正在下载更新包...");
			    downurl=ApiEndpoint.url+"/Resource/AppWgt/H563D1660.wgt";
			    plus.downloader.createDownload( downurl, {filename:"_doc/update/"}, function(d,status){			    	
			        if ( status == 200 ) { 
			            console.log("下载wgt成功："+d.filename);
			            installWgt(d.filename); // 安装wgt包			            
			        } else {
			            console.log("下载wgt失败！");
			            plus.nativeUI.alert("更新包下载失败！");
			        }
			        plus.nativeUI.closeWaiting();
			    }).start();
			} 
			
			function installWgt(path){
			    plus.nativeUI.showWaiting("正在安装更新包...");
			    plus.runtime.install(path,{},function(){
			        plus.nativeUI.closeWaiting();
			        console.log("安装wgt文件成功！");
			        plus.nativeUI.alert("更新完成！",function(){					        	
			            plus.runtime.restart();
			        });
			    },function(e){			    	
			        plus.nativeUI.closeWaiting();
			        console.log("安装wgt文件失败["+e.code+"]："+e.message);
			        plus.nativeUI.alert("更新包安装失败");
			    });
			}
  			 
   			 
            plus.key.addEventListener("backbutton", function() {               	
                if ($location.path() == '/login'||$location.path() == '/menus/daily/main') {
                      if (plus.os.name == "Android") {     
                      	plus.nativeUI.toast("再次点击返回键退出应用");                        
                            $timeout(function() {                            
                        plus.key.removeEventListener("backbutton", function() {});
                            return; 
                            }, 1000);
                        plus.key.addEventListener("backbutton", function() {
                            plus.runtime.quit();
                        });
                } else {
                    outSet("此平台不支持直接退出程序，请按Home键切换应用");
                    }
                } else {
                    $ionicHistory.goBack();
            }
        });
    }
})
.filter('brDateFilter', function () {
    return function (dateSTR) {
        if (dateSTR) { dateSTR = dateSTR.replace("/Date(", "").replace(")/", ""); var now = new Date(parseInt(dateSTR)); var year = now.getFullYear(); var month = now.getMonth() + 1; var date = now.getDate(); var hour = now.getHours(); var minute = now.getMinutes(); var second = now.getSeconds(); return year + "-" + month + "-" + date; }        
    }
})
.filter('brDateFilter2', function () {
    return function (dateSTR) {
        if (dateSTR) {
        	return dateSTR.replace(/\//g,'-');       	
        }
    }
})
.filter('brDateFilter3', function () {
    return function (dateSTR) {
        if (dateSTR) {
        	return dateSTR.substring(0,10);       	
        }
    }
})
.filter('delHtmlTag', function () {
    return function (str) {
    	if(str)
        	return str.replace(/<[^>]+>/g, "");
        else
        	return str;
    }
})
.filter('deviceStatusTran', function () {
        return function (val) {
            switch (val) {
                case 0: return "闲置"; break;
                case 1: return "已安装"; break;
                case 2: return "已检测"; break;
                case 3: return "使用中"; break;
                case 4: return "报废"; break;
                default: return val; break;
            }
        }
})
.filter('noticeType', function () {
    return function (val) {
        switch (val) {
            case 1: return "安全隐患整改"; break;
            case 2: return "安全局部停工整改"; break;
            case 3: return "安全全面停工整改"; break;
            case 4: return "质量隐患整改"; break;
            case 5: return "质量局部停工整改"; break;
            case 6: return "质量全面停工整改"; break;
            default: return val; break;
        }
    }
})
.filter('machineIconTran', function () {
    return function (val, action) {
        if (action == 1) {
            switch (val) {
                case 1: return "icon-construction15"; break;
                case 2: return "icon-elevator3"; break;
                case 3: return "icon-crane30"; break;
                case 4: return "icon-excavator3"; break;
            }
        } else if (action == 2) {
            switch (val) {
                case 0: return "icon-construction15"; break;               
                case 1: return "icon-elevator3"; break;
            }
        }
    }
})
.directive("appMap", function ($http,$state) {
    return {
        restrict: "E",
        replace: true,
        template: "<div id='allMap'></div>",
        scope: {
            center: "=",		// Center point on the map (e.g. <code>{ latitude: 10, longitude: 10 }</code>).
            markers: "=",	   // Array of map markers (e.g. <code>[{ lat: 10, lon: 10, name: "hello" }]</code>).
            width: "@",		 // Map width in pixels.
            height: "@",		// Map height in pixels.
            zoom: "@",	// Zoom level (one is totally zoomed out, 25 is very much zoomed in).
            apiendpointurl: "@",
            zoomControl: "@",   // Whether to show a zoom control on the map.
            scaleControl: "@",   // Whether to show scale control on the map.
            address:"@",
           	moduletype:"@"
        },
        link: function(scope, element, attrs) {
	
	
	
	
	function loadJScript() {
		var map;
		// 百度地图API功能
		map = new BMap.Map("allMap");
		map.centerAndZoom(new BMap.Point(113.2744, 22.99316), 13);
		//var local = new BMap.LocalSearch(map, {
		//renderOptions: { map: map, autoViewport: true }
		//});	
		var isend = false;
		var pageindex=1;
		if(!isend) {
			setInterval(function() {
				$http.get(scope.apiendpointurl + '/api/project/lists?pageindex='+pageindex+'&Lng=113.2744&Lat=22.99316&r=' + Math.random()).success(function(data) {
					if(data.code == "200") {
						var projectdata = data.rows;
						pageindex++;
						if(projectdata != null && projectdata != '') {
							angular.forEach(projectdata, function(data, index, array) {

								var point = new BMap.Point(data.Lng, data.Lat);
								var myIcon = new BMap.Icon(scope.apiendpointurl + "/Resource/images/newicon.png", new BMap.Size(50, 50), {});

								var marker = new BMap.Marker(point, {
									enableClicking: true,
									icon: myIcon
								});
								marker.id = data.ID;
								var label = new BMap.Label(data.ProName, {
									offset: new BMap.Size(0, -10)
								});
								marker.setLabel(label);
								marker.addEventListener(
									"click",
									function() {
										$state.go('menus.board-project-detail', {
											proId: marker.id
										});
									}
								);
								map.addOverlay(marker);

							})
						}
					}else{
						isend=true;
					}
				})
			},1000)
		}
		
		
		map.enableScrollWheelZoom();
		//var projectdata=scope.projectlist;

		//local.searchNearby("B幢", scope.address);
		//map.addControl(new BMap.ZoomControl());
		//创建地址解析器实例
		//var myGeo = new BMap.Geocoder();
		// 将地址解析结果显示在地图上,并调整地图视野
		//myGeo.getPoint(scope.address, function(point){
		//if (point) {
		//  map.centerAndZoom(point, 16);
		//  map.addOverlay(new BMap.Marker(point));
		//}
		//}, "");      		
	}
	window.onload = loadJScript();
}
    };
})
//.directive("myDctv", function() {
//    return function(scope, element, attrs) {
//        element.bind("click", function() {
//            scope.doWaitListRefresh();
//        });                              
//    }
//})
.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
    $httpProvider.defaults.headers.common['Authorization'] = window.localStorage["apikey"];
    //$httpProvider.interceptors.push('httpInterceptor');

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $ionicConfigProvider.tabs.position('bottom');
    //if (!ionic.Platform.isIOS()) {
    //    $ionicConfigProvider.scrolling.jsScrolling(false);
    //}
    $stateProvider
    .state('menus', { url: "/menus", abstract: true, templateUrl: "templates/menus.html" })
    .state('login', { url: "/login", templateUrl: "templates/login.html", controller: 'ctrl-login' })   
    .state('menus.home', { views: { 'menus-home': { templateUrl: 'templates/home.html', controller: 'ctrl-home' } }, url: '/home' })

    .state('menus.projectmap', { views: { 'menus-board': { templateUrl: 'templates/common/project_map.html', controller: 'ctrl-projectmap' } }, url: '/common/projectmap/:moduletype' })

    .state('menus.monitor-main', { views: { 'menus-monitor': { templateUrl: 'templates/monitor/main.html', controller: 'ctrl-monitor-main' } },url: '/monitor/main' })
    .state('menus.monitor-device', { views: { 'menus-monitor': { templateUrl: 'templates/monitor/devices.html', controller: 'ctrl-monitor-devices' } }, url: '/monitor/devices/:monitorType/:monitorStatus' })
    .state('menus.monitor-device-detail', { views: { 'menus-monitor': { templateUrl: 'templates/monitor/device-detail.html', controller: 'ctrl-monitor-devicedetail' } }, url: '/monitor/device/:deviceSN/:monitorType' })
    .state('menus.monitor-device-detail-info', { views: { 'menus-monitor': { templateUrl: 'templates/monitor/device-detail-info.html', controller: 'ctrl-monitor-devicedetail-info' } }, url: '/monitor/devicedetail/info/:deviceId' })
    .state('menus.monitor-device-detail-simulate', { views: { 'menus-monitor': { templateUrl: 'templates/monitor/device-detail-simulate.html', controller: 'ctrl-monitor-devicedetail-simulate' } }, url: '/monitor/devicedetail/simulate/:deviceId' })

    //.state('menus.monitor-elevators', { views: { 'menus-monitor': { templateUrl: 'templates/monitor/elevators.html', controller: 'ctrl-monitor-elevators' } }, url: '/monitor/elevators' })
    //.state('menus.monitor-elevator-detail', { views: { 'menus-monitor': { templateUrl: 'templates/monitor/elevator-detail.html', controller: 'ctrl-monitor-elevatordetail' } }, url: '/monitor/elevators/:deviceId' })
    //.state('menus.monitor-elevator-detail-info', { views: { 'menus-monitor': { templateUrl: 'templates/monitor/elevator-detail-info.html', controller: 'ctrl-monitor-elevatordetail-info' } }, url: '/monitor/elevators/:deviceId/info' })

    .state('menus.monitor-warnings', { views: { 'menus-monitor': { templateUrl: 'templates/monitor/warnings.html', controller: 'ctrl-monitor-warnings' } }, url: '/monitor/warnings' })

    .state('menus.monitor-machinerys', { views: { 'menus-monitor': { templateUrl: 'templates/monitor/machinerys.html', controller: 'ctrl-monitor-machinerys' } }, url: '/monitor/machinerys/:machinerysType' })
    .state('menus.monitor-machinery-detail', { views: { 'menus-monitor': { templateUrl: 'templates/monitor/machinery-detail.html', controller: 'ctrl-monitor-machinerydetail' } }, url: '/monitor/machinerydetail/:baId' })
    
    .state('menus.daily-notice', { views: { 'menus-daily': { templateUrl: 'templates/daily/notice.html', controller: 'ctrl-daily-notice' } }, url: '/daily/notice' })
    //.state('menus.daily-main', { views: { 'menus-daily': { templateUrl: 'templates/daily/main.html', controller: 'ctrl-daily-main' } }, url: '/daily/main' })
    .state('menus.daily-info', { views: { 'menus-daily': { templateUrl: 'templates/daily/daily-info.html', controller: 'ctrl-daily-info' } }, url: '/daily/info/:Id' })
    .state('menus.daily-standard', { views: { 'menus-daily': { templateUrl: 'templates/daily/daily-standard.html', controller: 'ctrl-daily-info' } }, url: '/daily/standard/:Id' })
    .state('menus.daily-waitinfo', { views: { 'menus-daily': { templateUrl: 'templates/daily/daily-waitinfo.html', controller: 'ctrl-daily-waitinfo' } }, url: '/daily/waitinfo/:noticeId/:replyId/:type' })

    .state('menus.check-projects', { views: { 'menus-check': { templateUrl: 'templates/check/projects.html', controller: 'ctrl-check-projects' } }, url: '/check/projects' })
    .state('menus.check-checks', { views: { 'menus-check': { templateUrl: 'templates/check/checks.html', controller: 'ctrl-check-checks' } }, url: '/check/projectchecks/:proId/:proName' })
    .state('menus.check-checkdetail', { views: { 'menus-check': { templateUrl: 'templates/check/check-detail.html', controller: 'ctrl-check-checkdetail' } }, url: '/check/checkdetail/:operType/:checkId/:proId' })
    .state('menus.check-checkadd', { views: { 'menus-check': { templateUrl: 'templates/check/check-detail.html', controller: 'ctrl-check-checkdetail' } }, url: '/check/checkadd/:operType/:proId/:proName/:checkUser/:ProjectProgress' })

    .state('menus.board-projects', { views: { 'menus-board': { templateUrl: 'templates/board/projects.html', controller: 'ctrl-board-projects' } }, url: '/board/projects' })
    .state('menus.board-project-detail', { views: { 'menus-board': { templateUrl: 'templates/board/project-detail.html', controller: 'ctrl-board-projectdetail' } }, url: '/board/projects/:proId' }) 
    .state('menus.board-projectperson-detail', { views: { 'menus-board': { templateUrl: 'templates/common/properson-detail.html', controller: 'ctrl-board-projectpersondetail' } }, url: '/common/properson/:pperonid/:persontype' })
    .state('menus.board-project-beian', { views: { 'menus-board': { templateUrl: 'templates/board/project-beian.html', controller: 'ctrl-board-projectbeian' } }, url: '/board/probeian/:InstallID' })


    .state('menus.account-main', { views: { 'menus-account': { templateUrl: 'templates/account/main.html', controller: 'ctrl-account-main' } }, url: '/account/main' })
    .state('menus.account-userinfo', { views: { 'menus-account': { templateUrl: 'templates/account/userinfo.html', controller: 'ctrl-account-userinfo' } }, url: '/account/userinfo' })
    .state('menus.account-zone', { views: { 'menus-account': { templateUrl: 'templates/account/zone.html', controller: 'ctrl-account-zone' } }, url: '/account/zone' })
    .state('menus.account-about', { views: { 'menus-account': { templateUrl: 'templates/account/about.html', controller: 'ctrl-account-about' } }, url: '/account/about' })


    .state("menus.common-company-detail", { views: { 'menus-monitor': { templateUrl: 'templates/common/company-detail.html', controller: 'ctrl-common-companydetail' } }, url: '/common/companys/:companyType/:deviceSN/:monitorType' })
    .state("menus.common-project-detail", { views: { 'menus-monitor': { templateUrl: 'templates/common/project-detail.html', controller: 'ctrl-common-projectdetail' } }, url: '/common/projects/:deviceSN/:monitorType' })

    ;  // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
    //if (window.localStorage["apikey"] != undefined) {
    //    $urlRouterProvider.otherwise('/menus/check/projects');
    //} else {
    //    $urlRouterProvider.otherwise('/login'); 
    //}
});





