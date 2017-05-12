angular.module('starter.controllers', [])

//angular.module('starter.controllers', []).directive('dateFormat', ['$filter', function ($filter) {
//    var dateFilter = $filter('date');  
//    return {  
//        require: 'ngModel',  
//        link: function(scope, elm, attrs, ctrl) {    
//            function formatter(value) {
//                return dateFilter(value, 'yyyy-MM-dd'); //format 
//            }    
//            function parser() {  
//                return ctrl.$modelValue;  
//            }  
//            ctrl.$formatters.push(formatter);  
//            ctrl.$parsers.unshift(parser);  
//        }  
//    };  
//}])

.constant('ApiEndpoint', {
	    url: 'http://192.168.3.64:8015'
		//url: 'http://tzapp.safe110.net:8085' 
		//url: 'http://121.199.75.88:8085'
		//url:'http://www.safe110.net:8085'
		//url: 'http://183.129.189.106:8015'
})

.controller('ctrl-login', function($scope, $ionicPopup, $http, $state, $ionicHistory, ApiEndpoint, $ionicLoading, $timeout) {
		$http.defaults.headers.common['Authorization'] = '';
		window.localStorage['moduletype']='';
		$ionicHistory.nextViewOptions({
			disableBack: true
		});
		//$scope.dologin = function () {
		//    if (window.localStorage["apikey"] != undefined) {
		//        //$state.go('menus.home');
		//        $state.go('menus.monitor-main');
		//    }
		//};    
		$scope.user = {};
		if(window.localStorage['savepass'] == "true") {
			$scope.user.username = window.localStorage['loginname'];
			$scope.user.password = window.localStorage['password'];
			$scope.user.savepass = true;
		}
		$scope.showAlert = function(msg) {
			var alertPopup = $ionicPopup.alert({
				title: '登录失败',
				template: msg
			});
			alertPopup.then(function(res) {
				//console.log('Thank you for not eating my delicious ice cream cone');
			});
		};
		$scope.login = function(user) {
			////if (user.username == null && user.password == null)
			////{
			//    //user.username = "戴峰";
			//    user.password = "123456";
			////}
			//    alert(0); return;
			//   var uname = "戴峰"; var upass = "123456";

			if(user == null)
				return;
			else if(user.username == null)
				return;
			else if(user.password == null)
				return;
			else if(user.username == "")
				return;
			else if(user.password == "")
				return;
			$http.post(ApiEndpoint.url + '/api/Login?username=' + user.username + '&password=' + user.password + '&r=' + Math.random()).success(function(data) {
				if(data.code == 200) {
					window.localStorage['apikey'] = data.token;
					window.localStorage['moduletype'] = data.moduletype;
					
					if(user.savepass === true) {
						window.localStorage['loginname'] = user.username;
						window.localStorage['password'] = user.password;
						window.localStorage['savepass'] = user.savepass;

					} else {
						window.localStorage.removeItem("loginname");
						window.localStorage.removeItem("password");
						window.localStorage.removeItem("savepass");
					}
					$http.defaults.headers.common['Authorization'] = window.localStorage["apikey"];
					//$state.go('menus.home');
					$state.go('menus.daily-notice');
				} else {
					$scope.showAlert(data.msg);
				}
			}).error(function(response) {
				if(errCb && typeof errCb === 'function') {
					errCb(response);
				}
			});
		};
		$scope.maptest = function() {
			$state.go('menus.projectmap');
		}
		$scope.login2 = function(user) {
			$scope.loginpictype = 0;
			makePhoto();
		};
		$scope.multitest = function() {
			window.imagePicker.getPictures(
				function(results) {
					for(var i = 0; i < results.length; i++) {
						//console.log('Image URI: ' + results[i]);
						alert(results[i]);
					}
				},
				function(error) {
					console.log('Error: ' + error);
				}
			);
		}
		$scope.login3 = function(user) {
			$scope.loginpictype = 1;
			$ionicLoading.show({
				template: '正在请假...'
			});
			$http.post(ApiEndpoint.url + '/common/upload/?fixname=2&r=' + Math.random()).success(function(data) {
				$timeout(function() {
					$ionicLoading.show({
						template: '请假成功',
						duration: 1000
					});
				}, 1000);

			});
		};

		function onPhotoDone(imageURI) {
			uploadPhoto(imageURI);
		}

		function onPhotoFail(message) {
			if(message.indexOf('cancelled') < 0) {
				alert('出錯了：' + message);
			}
		}

		function getPicArr() {
			var str = '';
			for(var i in $scope.photos) {
				str += $scope.photos[i].PicPath + ',';
			}
			return str.substr(0, str.lastIndexOf(','));
		}

		function uploadPhoto(imageURI) {
			var done = function(r) {
				var reg = eval('(' + r.response + ')');
				var photo = {
					PicPath: reg.obj,
					PicPath_s: imageURI
				};
				$scope.$apply(function() {
					$scope.photos.push(photo);
				});
			};

			var fail = function(e) {
				alert(e.code);
			};

			var options = new FileUploadOptions();
			options.fileKey = "fileAddPic";
			options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1).split("?")[0];
			//如果是图片格式，就用image/jpeg，其他文件格式上官网查API
			options.mimeType = "image/jpeg";
			options.chunkedMode = false;
			var ft = new FileTransfer();
			ft.upload(imageURI, encodeURI(ApiEndpoint.url + "/api/common/upload/?fixname=" + $scope.loginpictype + "&r=" + Math.random()), done, fail, options);
		}

		function makePhoto() {
			navigator.camera.getPicture(onPhotoDone, onPhotoFail, {
				quality: 100,
				targetWidth: 800,
				targetHeight: 800,
				destinationType: navigator.camera.DestinationType.FILE_URI
			});
		}

		function takePhoto() {
			navigator.camera.getPicture(onPhotoDone, onPhotoFail, {
				quality: 100,
				targetWidth: 800,
				targetHeight: 800,
				destinationType: navigator.camera.DestinationType.FILE_URI,
				sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM
			});
		}
		//$scope.dologin();
	})
	.controller('ctrl-home', function($scope) {

	})
	.controller('ctrl-projectmap', function($scope, $http, $stateParams, $state, ApiEndpoint, $window) {
		$scope.address = "天堂软件园";
		$scope.boxheight = $window.innerHeight - 50;
		$scope.apiendpointurl = ApiEndpoint.url;
		$scope.moduletype = window.localStorage['moduletype'];

		//  $scope.getprojectlist=function (){
		//						    	$http.get(ApiEndpoint.url + '/api/project/lists?r=' + Math.random()).success(function(data){
		//						    	debugger;
		//						    	if(data.code=="200"){
		//						    		return data.rows;
		//						    	}else{
		//						    		return [];
		//						    	}
		//							    })
		//						    }

		//$scope.projectlist=[{ID:"B5253FB9-7C79-E611-A54D-38D547011054",Longitude:"113.2744",Latitude:"22.99316"},{ID:"FFE681FF-A479-E611-A54D-38D547011054",Longitude:"113.3878",Latitude:"22.94393"}];
	})
	//.controller('ctrl-daily-main', function ($scope, $stateParams, $http, $state, ApiEndpoint, $ionicScrollDelegate) {
	//  
	//})

//.controller('ctrl-daily-waitlist', function ($scope, $stateParams, $http, $state, ApiEndpoint, WaitList) {
//  $scope.waitdolist = [];
//  $scope.waitlistpage = 1;
//  $scope.waitlistpage_count = 1;
//  $scope.load_waitlist_over = true;    
//
//  $scope.loadWaitListMore = function () {
//      $http.post(ApiEndpoint.url + '/zaSys/getWaitDoList/?page=' + $scope.waitlistpage + '&r=' + Math.random()).success(function (data) {
//          if (data.success) {                
//              $scope.waitlistpage_count = data.total;
//              WaitList.push(data.rows);
//              $scope.waitdolist = WaitList.all();               
//              $scope.waitlistpage++;
//              $scope.$broadcast("scroll.infiniteScrollComplete");
//              if ($scope.waitlistpage > $scope.waitlistpage_count) {
//                  $scope.load_waitlist_over = false;
//                  return;
//              }
//          } else {
//              //alert('登录超时，请重新登录');
//              //$scope.login();
//              return;
//          }
//      });
//  };
//  $scope.doWaitListRefresh = function () {
//      $scope.$broadcast('scroll.refreshComplete');
//  };
//})
.controller('ctrl-daily-notice', function($scope, $http, $state, ApiEndpoint) {
		$scope.notices = [];
		$scope.noticespage = 1;
		$scope.noticespage_count = 1;
		$scope.load_over = true;
		$scope.loadMore = function() {
			$http.get(ApiEndpoint.url + '/api/notice/lists?key=&page=' + $scope.noticespage + '&r=' + Math.random()).success(function(data) {
				if(data.code == 200) {
					$scope.noticespage_count = data.total;
					$scope.notices = $scope.notices.concat(data.rows);
					$scope.noticespage++;
					$scope.$broadcast("scroll.infiniteScrollComplete");
					if($scope.noticespage > $scope.noticespage_count) {
						$scope.load_over = false;
						return;
					}
				} else {
					alert('登录超时，请重新登录');
					$scope.login();
					return;
				}
			});
		};
		$scope.doRefresh = function() {
			$scope.$broadcast('scroll.refreshComplete');
		};
	})
	.controller('ctrl-daily-standard', function($scope, $http, $state, ApiEndpoint) {
		$scope.standardlist = [];
		$scope.standardlistpage = 1;
		$scope.standardlistpage_count = 1;
		$scope.load_standardlist_over = true;
		$scope.loadStandardListMore = function() {
			$http.post(ApiEndpoint.url + '/zaSys/getDailyList/?classid=3&page=' + $scope.standardlistpage + '&r=' + Math.random()).success(function(data) {
				if(data.success) {
					$scope.standardlistpage_count = data.total;
					$scope.standardlist = $scope.standardlist.concat(data.rows);
					$scope.standardlistpage++;
					$scope.$broadcast("scroll.infiniteScrollComplete");
					if($scope.standardlistpage > $scope.standardlistpage_count) {
						$scope.load_standardlist_over = false;
						return;
					}
				} else {
					//alert('登录超时，请重addnew新登录');
					//$scope.login();
					return;
				}
			});
		};
		$scope.doStandardListRefresh = function() {
			$scope.$broadcast('scroll.refreshComplete');
		};
	})
	.controller('ctrl-daily-info', function($scope, $stateParams, $http, $state, ApiEndpoint) {
		$scope.dailyInfoData = {};
		$http.get(ApiEndpoint.url + '/api/notice?id=' + $stateParams.Id + '&r=' + Math.random()).success(function(data) {
			if(data.code = 200) {
				$scope.dailyInfoData.InfoTitle = data.obj.InfoTitle;
				$scope.dailyInfoData.InfoContent = data.obj.InfoContent;
			}
		});
	})
	.controller('ctrl-daily-waitinfo', function($scope, $stateParams, $http, $filter, $state, ApiEndpoint, $ionicPopup, WaitList) {
		$scope.dailyWaitDoData = {};
		var template, tempurl;
		$scope.dailyWaitDoData.Type = $stateParams.type;

		var comFun = function(flag) {
			switch($scope.dailyWaitDoData.Type) {
				case '6':
					tempurl = '/zaSys/replyCheck?r=';
					if(flag) {
						$scope.dailyWaitDoData.DoReplyContent = '通过';
					} else {
						$scope.dailyWaitDoData.DoReplyContent = '不通过';
					}
					template = '<textarea  rows="5" placeholder="复查内容" ng-model="dailyWaitDoData.Content4"></textarea>';
					break;
				case '7':
					tempurl = '/zaSys/sendCheck?r=';
					if(flag) {
						$scope.dailyWaitDoData.Status = '1';
					} else {
						$scope.dailyWaitDoData.Status = '0';
					}
					template = '<textarea  rows="5" placeholder="停工整改内容" ng-model="dailyWaitDoData.Content2"></textarea>';
					break;
				case '8':
					tempurl = '/zaSys/replyCheck?r=';
					if(flag) {
						$scope.dailyWaitDoData.DoReplyContent = '通过';
					} else {
						$scope.dailyWaitDoData.DoReplyContent = '不通过';
					}
					template = '<textarea  rows="5" placeholder="复查内容" ng-model="dailyWaitDoData.Content4"></textarea>';
					break;
				case '9':
					tempurl = '/zaSys/finishCheck?r=';
					if(flag) {
						$scope.dailyWaitDoData.DoReplyContent2 = '通过';
					} else {
						$scope.dailyWaitDoData.DoReplyContent2 = '不通过';
					}
					template = '<textarea  rows="5" placeholder="复工内容" ng-model="dailyWaitDoData.F2"></textarea>';
					break;
			}
		};

		$scope.through = function() {
			comFun(true);
			$http.post(ApiEndpoint.url + tempurl + Math.random(), $scope.dailyWaitDoData).success(function(data) {
				if(data.success) {
					WaitList.remove($stateParams.noticeId);
					$state.go('menus.daily-main');
				}
			});
		};

		$scope.showPopup = function() {
			comFun(false);
			var myPopup = $ionicPopup.show({
				template: template,
				title: '输入原因',
				scope: $scope,
				buttons: [{
					text: '取消'
				}, {
					text: '<b>保存</b>',
					type: 'button-positive',
					onTap: function(e) {
						$http.post(ApiEndpoint.url + tempurl + Math.random(), $scope.dailyWaitDoData).success(function(data) {
							if(data.success) {
								WaitList.remove($stateParams.noticeId);
								$state.go('menus.daily-main');
							}
						});
					}
				}, ]
			});
			myPopup.then(function(res) {
				console.log('Tapped!', res);
			});
		};
		$scope.showPic = function(url) {
			//$window.open(url, '_blank', "width=100%,height=100%,resizable=1", '')
		};
		$http.post(ApiEndpoint.url + '/zaSys/viewWaitDoDetail?noticeId=' + $stateParams.noticeId + '&replyId=' + $stateParams.replyId + '&r=' + Math.random()).success(function(data) {
			if(data.success) {
				//通知书主题信息
				$scope.dailyWaitDoData.WebApiUrl = ApiEndpoint.url;
				$scope.dailyWaitDoData.NoticeID = data.obj.NoticeID; //通知书ID
				$scope.dailyWaitDoData.NoticeType = data.obj.NoticeType; //通知书类型
				$scope.dailyWaitDoData.ReplyID = data.obj.ReplyID; //回复ID
				$scope.dailyWaitDoData.CheckUser = data.obj.CheckUser; //检查人员
				$scope.dailyWaitDoData.CheckTime = $filter("date")(data.obj.CheckTime.replace(/\D/igm, "").trim(), 'yyyy-MM-dd'); //检查日期
				$scope.dailyWaitDoData.MaxDoDate = $filter("date")(data.obj.MaxDoDate.replace(/\D/igm, "").trim(), 'yyyy-MM-dd');
				$scope.dailyWaitDoData.NoticeGrantUser = data.obj.NoticeGrantUser; //站长
				$scope.dailyWaitDoData.NoticeGrantDate = $filter("date")(data.obj.NoticeGrantDate.replace(/\D/igm, "").trim(), 'yyyy-MM-dd'); //站长发放日期
				$scope.dailyWaitDoData.Content2 = data.obj.Content2; //站长发放原因
				$scope.dailyWaitDoData.ReplyCompanyName = data.obj.ReplyCompanyName; //整改单位
				$scope.dailyWaitDoData.ReplyDate = $filter("date")(data.obj.ReplyDate.replace(/\D/igm, "").trim(), 'yyyy-MM-dd'); //整改时间
				$scope.dailyWaitDoData.ReplyContent = data.obj.ReplyContent; //整改情况描述
				$scope.dailyWaitDoData.FirstCheckUser = data.obj.FirstCheckUser; //监理单位审查人员
				$scope.dailyWaitDoData.FirstCheckDate = $filter("date")(data.obj.FirstCheckDate.replace(/\D/igm, "").trim(), 'yyyy-MM-dd');
				$scope.dailyWaitDoData.Content3 = data.obj.Content3; //监理单位审核原因
				$scope.dailyWaitDoData.ReCheckPerson = data.obj.ReCheckPerson; //复查人员
				$scope.dailyWaitDoData.ReCheckDate = $filter("date")(data.obj.ReCheckDate.replace(/\D/igm, "").trim(), 'yyyy-MM-dd'); //复查时间
				$scope.dailyWaitDoData.DoReplyContent = data.obj.DoReplyContent; //复查结论
				$scope.dailyWaitDoData.Content4 = data.obj.Content4; //复查原因
				$scope.dailyWaitDoData.BackWorkUser = data.obj.BackWorkUser; //复工人员
				$scope.dailyWaitDoData.BackWorkDate = $filter("date")(data.obj.BackWorkDate.replace(/\D/igm, "").trim(), 'yyyy-MM-dd'); //复工时间
				$scope.dailyWaitDoData.DoReplyContent2 = data.obj.DoReplyContent2; //复工结论
				$scope.dailyWaitDoData.F2 = data.obj.F2; //复工原因
				$scope.dailyWaitDoData.NoticeContent = data.obj.NoticeContent;
				if($stateParams.replyId != null) {
					$scope.dailyWaitDoData.Attachments = data.rows[0].rows; //通知书图片
					$scope.dailyWaitDoData.AttachmentsReply = data.rows[1].rows; //通知书整改图片    
				} else {
					$scope.dailyWaitDoData.Attachments = data.rows
				}
			}
		});
	})
	.controller('ctrl-monitor-main', function($scope, $http, $state, ApiEndpoint) {
		$scope.homeData = {};
		$http.post(ApiEndpoint.url + '/monitor/getDeviceCount?r=' + Math.random()).success(function(data) {
			if(data.success) {
				$scope.homeData.TD = data.rows.TD; //塔式起重机
				$scope.homeData.SJJ = data.rows.SJJ; //施工升降机
				$scope.homeData.WL = data.rows.WL; //物料提升机
				$scope.homeData.QT = data.rows.QT; //其它设备
				$scope.homeData.Total = data.rows.Total; //已备案设备总数

				$scope.homeData.TotalRegisted = data.rows.TotalRegisted; //受监控的总量
				$scope.homeData.TCRegisted = data.rows.TCRegisted; //登记塔吊
				$scope.homeData.TCOnline = data.rows.TCOnline; //在线塔吊
				$scope.homeData.TCOffline = data.rows.TCOffline; //离线塔吊
				$scope.homeData.TCAlarm = data.rows.TCAlarm == undefined ? 0 : data.rows.TCAlarm; //违章塔吊
				$scope.homeData.ERegisted = data.rows.ERegisted; //登记人货梯
				$scope.homeData.EOnline = data.rows.EOnline; //在线人货梯
				$scope.homeData.EOffline = data.rows.EOffline; //离线人货梯
				$scope.homeData.EAlarm = data.rows.EAlarm == undefined ? 0 : data.rows.EAlarm; //违章人货梯
			} else {
				alert(data.msg);
				$state.go('login');
			}
		});
	})
	.controller('ctrl-monitor-devices', function($scope, $stateParams, $http, $state, ApiEndpoint) {
		var url = "";
		$scope.devices = [];
		switch($stateParams.monitorStatus) {
			case '1':
				url = '/monitor/getRegisterList?monitorType=' + $stateParams.monitorType + '&r=' + Math.random();
				break;
			case '2':
				url = '/monitor/getOnlineDevice?monitorType=' + $stateParams.monitorType + '&r=' + Math.random();
				break;
			case '3':
				url = '/monitor/getTodayAlarmList?monitorType=' + $stateParams.monitorType + '&r=' + Math.random();
				break;
		}
		$http.post(ApiEndpoint.url + url).success(function(data) {
			if(data.success) {
				$scope.devices = $scope.devices.concat(data.rows);
				$scope.$broadcast("scroll.infiniteScrollComplete");
			} else {
				//alert('登录超时，请重新登录');
				//$scope.login();
				return;
			}
		});
	})
	.controller('ctrl-monitor-devicedetail', function($scope, $stateParams, $http, $state, ApiEndpoint) {
		$scope.devicedetail = {};
		$http.post(ApiEndpoint.url + '/monitor/GetDeviceDetailInfo?deviceSN=' + $stateParams.deviceSN + '&monitorType=' + $stateParams.monitorType + '&r=' + Math.random()).success(function(data) {
			if(data.success) {
				$scope.devicedetail.MonitorType = $stateParams.monitorType;
				$scope.devicedetail.DeviceSN = $stateParams.deviceSN;
				$scope.devicedetail.FilingNO = data.obj.FilingNO;
				$scope.devicedetail.DeviceNO = data.obj.DeviceNO;
				$scope.devicedetail.OwnerCompanyName = data.obj.OwnerCompanyName;
				$scope.devicedetail.OwnerCompanyID = data.obj.OwnerCompanyID;
				$scope.devicedetail.ProjectName = data.obj.ProjectName;
				$scope.devicedetail.ProjectID = data.obj.ProjectID;
				$scope.devicedetail.ContractorCompanyName = data.obj.ContractorCompanyName;
				$scope.devicedetail.AlarmCount = data.obj.AlarmCount;
				$scope.devicedetail.OperateAlarmCount = data.obj.OperateAlarmCount;
				$scope.devicedetail.UnoperateAlarmCount = data.obj.UnoperateAlarmCount;
			} else {
				alert(data.msg);
			}
		});
	})
	.controller('ctrl-monitor-devicedetail-info', function($scope) {

	})
	.controller('ctrl-monitor-devicedetail-simulate', function($scope) {

	})
	//.controller('ctrl-monitor-elevators', function ($scope) {

//})
//.controller('ctrl-monitor-elevatordetail', function ($scope) {

//})
//.controller('ctrl-monitor-elevatordetail-info', function ($scope) {

//})
.controller('ctrl-monitor-machinerys', function($scope, $stateParams, $http, $state, ApiEndpoint) {
		$scope.machinerys = [];
		$scope.page = 1;
		$scope.page_count = 1;
		$scope.load_over = true;
		$scope.loadMore = function() {
			$http.post(ApiEndpoint.url + '/filing/getFilingMachinerys/?page=' + $scope.page + '&machinerysType=' + $stateParams.machinerysType + '&r=' + Math.random()).success(function(data) {
				if(data.success) {
					$scope.page_count = data.total;
					$scope.machinerys = $scope.machinerys.concat(data.rows);
					$scope.page++;
					$scope.$broadcast("scroll.infiniteScrollComplete");
					if($scope.page > $scope.page_count) {
						$scope.load_over = false;
						return;
					}
				} else {
					//alert('登录超时，请重新登录');
					//$scope.login();
					return;
				}
			});
		};
		$scope.doRefresh = function() {
			$scope.$broadcast('scroll.refreshComplete');
		};
	})
	.controller('ctrl-monitor-machinerydetail', function($scope, $stateParams, $http, $state, ApiEndpoint) {
		$scope.machinerydetail = {};
		$http.post(ApiEndpoint.url + '/filing/getFilingMachineryDetail?baId=' + $stateParams.baId + '&r=' + Math.random()).success(function(data) {
			if(data.success) {
				$scope.machinerydetail.BeiAnICP = data.rows.BeiAnICP;
				$scope.machinerydetail.SpecificationModel = data.rows.SpecificationModel;
				$scope.machinerydetail.IsOutland = data.rows.IsOutland == 0 ? "本地机械" : "外地机械";
				$scope.machinerydetail.ApplyMan = data.rows.ApplyMan;
				$scope.machinerydetail.MadeDate = data.rows.MadeDate;
				$scope.machinerydetail.UseEndDate = data.rows.UseEndDate;
				$scope.machinerydetail.FactoryNO = data.rows.FactoryNO;
				$scope.machinerydetail.FactoryName = data.rows.FactoryName;
				$scope.machinerydetail.PropertyCompanyName = data.rows.PropertyCompanyName;
			} else {
				//alert(data.msg);
				//$state.go('login');
			}
		});
	})
	.controller('ctrl-monitor-warnings', function($scope) {

	})
	.controller('ctrl-check-projects', function($scope, $http, $state, ApiEndpoint) {
		$scope.projects = [];
		$scope.page = 1;
		$scope.page_count = 1;
		$scope.load_over = true;
	
		
		$scope.loadMore = function() {
			$http.get(ApiEndpoint.url + '/api/check/checkprojectlist?page=' + $scope.page + '&r=' + Math.random()).success(function(data) {
				if(data.code == 200) {
					$scope.page_count = data.total;
					if(data.rows)
						$scope.projects = $scope.projects.concat(data.rows);
					$scope.page++;
					$scope.$broadcast("scroll.infiniteScrollComplete");
					if($scope.page > $scope.page_count) {
						$scope.load_over = false;
						return;
					}
				} else {
					//alert('登录超时，请重新登录');
					//$scope.login();
					return;
				}
			})
		};
		//$scope.moreDataCanBeLoaded = function () { return CheckProjects.hasmore; };
		$scope.doRefresh = function() {
			$scope.page = 1;
			$scope.page_count = 1;
			$scope.load_over = true;
			$http.get(ApiEndpoint.url + '/api/check/checkprojectlist?moduletype=' + $scope.moduletype + '&page=' + $scope.page + '&r=' + Math.random()).success(function(data) {
				if(data.code == 200) {
					$scope.page_count = data.total;
					$scope.projects = data.rows;
					$scope.page++;
					$scope.$broadcast("scroll.refreshComplete");
					if($scope.page > $scope.page_count) {
						$scope.load_over = false;
						return;
					}
				} else {
					//alert('登录超时，请重新登录');
					//$scope.login();
					return;
				}
			})
		};
	})

.controller('ctrl-check-checks', function($scope, $stateParams, $http, $state, ApiEndpoint, $ionicActionSheet) {
		$scope.checks = [];
		$scope.page = 1;
		$scope.page_count = 1;
		$scope.load_over = true;
		var proName, checkUser,ProjectProgress;
		$scope.CheckTypeName = "";

		$scope.moduletype = parseInt(window.localStorage['moduletype']);
		if($scope.moduletype == 1) {
			$scope.CheckTypeName = "安全检查";
		}
		if($scope.moduletype == 2) {
			$scope.CheckTypeName = "质量检查"
		}

		$scope.loadMore = function() {
			$http.get(ApiEndpoint.url + '/api/check/checkList/?page=' + $scope.page + '&proid=' + $stateParams.proId + '&moduletype=' + $scope.moduletype + '&r=' + Math.random()).success(function(data) {
				if(data.code == 200) {
					$scope.page_count = data.total;
					if(data.rows)
						$scope.checks = $scope.checks.concat(data.rows);
					if(data.rows.length > 0) {
						proName = data.rows[0].ProName;
						checkUser = data.rows[0].CheckUser;
						ProjectProgress=data.rows[0].ProjectProgress;
					}
					$scope.page++;
					$scope.$broadcast("scroll.infiniteScrollComplete");
					if($scope.page > $scope.page_count) {
						$scope.load_over = false;
						return;
					}
				} else {
					//alert('登录超时，请重新登录');
					//$scope.login();
					return;
				}
			})
		};
		$scope.doRefresh = function() {
			$scope.page = 1;
			$scope.page_count = 1;
			$scope.load_over = true;
			$http.get(ApiEndpoint.url + '/api/check/checkList/?page=' + $scope.page + '&proid=' + $stateParams.proId + '&moduletype=' + $scope.moduletype + '&r=' + Math.random()).success(function(data) {
				if(data.code == 200) {
					$scope.page_count = data.total;
					$scope.checks = data.rows;
					if(data.rows.length > 0) {
						proName = data.rows[0].ProName;
						checkUser = data.rows[0].CheckUser;
						ProjectProgress=data.rows[0].ProjectProgress;
					}
					$scope.page++;
					$scope.$broadcast("scroll.refreshComplete");
					if($scope.page > $scope.page_count) {
						$scope.load_over = false;
						return;
					}
				} else {
					//alert('登录超时，请重新登录');
					//$scope.login();
					return;
				}
			})
		};
		$scope.addnew = function() {

			$state.go("menus.check-checkadd", {
				operType: 'add',
				proId: $stateParams.proId,
				proName: $stateParams.proName,
				checkUser: checkUser,
				moduletype: $scope.moduletype,
				ProjectProgress:ProjectProgress
			});
//			      $ionicActionSheet.show({
//			          titleText: '新建检查',
//			          cancelText: '取消',
//			          buttons: [{ text: '安全检查' }, { text: '质量检查' }],
//			          cancel: function () { },
//			          buttonClicked: function (index) {
//			              $state.go("menus.check-checkadd", { operType: 'add', proId: $stateParams.proId, proName: proName, checkUser: checkUser, moduletype: $scope.moduletype });
//			              return true;
//			          }
//			      });
		};

	})
	.controller('ctrl-check-checkdetail', function($scope, $ionicPopover, $stateParams, $window, $http, $ionicActionSheet, $filter, ApiEndpoint, $ionicLoading, $timeout, $state) {

		$scope.checkdetail = {};
		$scope.photos = [];
		$scope.isedit = $stateParams.operType == 'edit';
		$scope.userlist = [];
		$scope.userdatas = [];
		$scope.selectusers = [];
		$scope.projectProgressList = [];
		$scope.CheckTypes = [{
			typeid: 1,
			name: "安全检查"
		}, {
			typeid: 2,
			name: "质量检查"
		}];
		if(window.localStorage['moduletype']=="1"){
			$http.get(ApiEndpoint.url + '/api/check/projectprogresslist?moduletype='+window.localStorage['moduletype']+'&ProjectID=&r=' + Math.random()).success(function(data) {
			if(data.code == 200) {
				$scope.projectProgressList = data.row;
			}
		})
		}else if(window.localStorage['moduletype']=="2"){                                                         
			$http.get(ApiEndpoint.url + '/api/check/projectprogresslist?moduletype='+window.localStorage['moduletype']+'&ProjectID='+$stateParams.proId+'&r=' + Math.random()).success(function(data) {
			if(data.code == 200) {
				$scope.projectProgressList = data.row;
			}})
			}
				
        $scope.checkdetail.WebApiUrl = ApiEndpoint.url;
		if($stateParams.operType == 'edit') {
			$scope.checkdetail.CheckType = $scope.CheckTypes[parseInt(window.localStorage['moduletype']) - 1];
			$http.get(ApiEndpoint.url + '/api/check/checkDetail/?moduletype=' + window.localStorage['moduletype'] + '&checkId=' + $stateParams.checkId + '&r=' + Math.random()).success(function(data) {
				if(data.code == 200) {
					$scope.checkdetail.ProName = data.obj.ProName;
					$scope.checkdetail.ProjectProgress = data.obj.ProjectProgress;
					$scope.checkdetail.projectProgressname = data.obj.ProjectProgressName;
					$scope.checkdetail.NoticeTypeName=data.obj.NoticeTypeName;
					$scope.checkdetail.CheckTime = data.obj.CheckDate.replace(/\//g, '-').substring(0, 10);
					$scope.checkdetail.CheckContent = data.obj.CheckContent;
					$scope.checkdetail.SuperviseSuggest = data.obj.SuperviseSuggest;	
					$scope.checkdetail.CheckUserIDs=data.obj.CheckUserIDs;
					$scope.checkdetail.CheckUserNames=data.obj.CheckUserNames;
					$scope.selectusers=data.checkuser;	
					$scope.checkdetail.GrantObject=data.obj.GrantObject;
					if(data.obj.NoticeNumber != null && data.obj.NoticeNumber != '') {
						$scope.checkdetail.hasnotice = true;
						$scope.checkdetail.NoticeNo = data.obj.NoticeNumber;
						$scope.checkdetail.NoticeType = data.obj.NoticeType;
						if(data.obj.GrantObject.indexOf("施工单位") > -1) {
							$scope.checkdetail.GrantObject1 = true;
						}
						if(data.obj.GrantObject.indexOf("监理单位") > -1) {
							$scope.checkdetail.GrantObject2 = true;
						}
						if(data.obj.GrantObject.indexOf("建设单位") > -1) {
							$scope.checkdetail.GrantObject3 = true;
						}
						//$scope.checkdetail.MaxDoDate=
					}
					$scope.checkdetail.RectificationLimit=data.obj.RectificationLimit;
					//$scope.checkdetail.CheckTime = $filter("date")(data.rows[0].CheckTime.replace(/\D/igm, "").trim(), 'yyyy-MM-dd');//'2011-11-11';//data.rows[0].CheckTime.replace(/\D/igm, "").trim();
					//$scope.checkdetail.CheckUser = data.rows[0].CheckUser;
					//$scope.checkdetail.ItemDes = data.rows[0].ItemDes;
					//$scope.checkdetail.CheckNunber = data.rows[0].CheckNunber;
					//$scope.checkdetail.F1 = data.rows[0].F1;
					//$scope.checkdetail.F2 = data.rows[0].F2;
					//$scope.checkdetail.CheckResult2 = data.rows[0].CheckResult2;
					//              if ($stateParams.checktypeid == 1) {
					//                  $http.post(ApiEndpoint.url + '/zaSys/subprojects/?proId=' + $stateParams.proId + '&r=' + Math.random()).success(function (prodata) {
					//                      if (prodata.success) {
					//                          $scope.SubPros = prodata.rows;
					//                          angular.forEach($scope.SubPros, function (item) {
					//                              if (item.ProID == data.rows[0].SubProID) {
					//                                  $scope.checkdetail.SubPro = item;
					//                              }
					//                          });
					//                      }
					//                  });
					//                  
					//              }					
					//$scope.checkdetail.ItemDes = data.rows[0].ItemDes;
					//alert($scope.checkdetail.CheckTime);
					//alert(data.obj);
					if(data.obj&&data.obj.pics) {
						var str=data.obj.pics.split(',');
						if(str.length>0){
							for(var i=0;i<str.length;i++){
								var photo = {
										PicPath: str[i].split('|')[0],
										PicPath_s: str[i].split('|')[1]
									};
									$scope.photos = $scope.photos.concat(photo);
							}
						}						
					}
					//              if(data.children && data.children.length>0)
					//              {
					//              	if(data.children[0].obj){
					//	                    var notice = data.children[0].obj;
					//	                    $scope.checkdetail.hasnotice = true;
					//	                    $scope.checkdetail.NoticeType = notice.NoticeType;
					//	                    $scope.checkdetail.NoticeNo = notice.NoticeNo;
					//	                    $scope.checkdetail.StopPart = notice.StopPart;
					//	                    $scope.checkdetail.GrantObject1 = ((notice.GrantObject & 1) == 1);
					//	                    $scope.checkdetail.GrantObject2 = ((notice.GrantObject & 2) == 2);
					//	                    $scope.checkdetail.GrantObject3 = ((notice.GrantObject & 4) == 4);
					//	                    $scope.checkdetail.NoticeContent1 = notice.Content1;
					//	                    $scope.checkdetail.GrantDate = $filter("date")(notice.GrantDate.replace(/\D/igm, "").trim(), 'yyyy-MM-dd');
					//	                    $scope.checkdetail.MaxDoDate = $filter("date")(notice.MaxDoDate.replace(/\D/igm, "").trim(), 'yyyy-MM-dd');
					//              	}       
					//              }
				} else {
					//alert('登录超时，请重新登录');
					//$scope.login();
					//alert(data);
					return;
				}
			})
		} else if($stateParams.operType == 'add') {

			$scope.checkdetail.ProName = $stateParams.proName;
			$scope.checkdetail.CheckUser = $stateParams.checkUser;
			$scope.checkdetail.ProjectProgress=$stateParams.ProjectProgress;
			$scope.checkdetail.GrantObject1 = true;
			var d = new Date();
			$scope.checkdetail.CheckTime = d.toLocaleDateString(); //$filter("date")(new Date().replace(/\D/igm, "").trim(), 'yyyy-MM-dd');//'2011-11-11';//data.rows[0].CheckTime.replace(/\D/igm, "").trim();
			$scope.checkdetail.CheckType = $scope.CheckTypes[parseInt(window.localStorage['moduletype']) - 1];
			//安监模块
			if($stateParams.moduletype == 1) {
				$http.post(ApiEndpoint.url + '/zaSys/subprojects/?proId=' + $stateParams.proId + '&r=' + Math.random()).success(function(data) {
					if(data.success) {
						$scope.SubPros = data.rows;
					}
				});
				$http.post(ApiEndpoint.url + '/zaSys/GetNewCheckNumber/?r=' + Math.random()).success(function(data) {
					if(data.success) {
						$scope.checkdetail.CheckNunber = data.obj;
					}
				});
			}
		}
		// .fromTemplateUrl() 方法
		$ionicPopover.fromTemplateUrl('my-popover.html', {
			scope: $scope,
			animation: 'silde-in-up'
		}).then(function(popover) {
			$scope.popover = popover;
		});

		$scope.openPopover = function() {			
			$scope.popover.show();		
			$scope.getcheckusers('');	
		};
		
		$scope.closePopover = function() {
			$scope.popover.hide();
		};
		// 清除浮动框
		$scope.$on('$destroy', function() {
			$scope.popover.remove();
		});
		// 在隐藏浮动框后执行
		$scope.$on('popover.hidden', function() {
			// 执行代码
		});
		// 移除浮动框后执行
		$scope.$on('popover.removed', function() {
			// 执行代码
		});

		$scope.getcheckusers = function(searchName) {
			$http.get(ApiEndpoint.url + '/api/check/checkuserlist/?searchName=' + searchName).success(function(data) {
				if(data.code == 200) {
					$scope.userlist=[];
					for(var i=0;i<data.row.length;i++){
						if($scope.selectusers.length>0){
							var count=0;
							for(var j=0;j<$scope.selectusers.length;j++){
								if(data.row[i].UserID==$scope.selectusers[j].UserID){
									count++;									
								}
							}	
							if(count==0){
								data.row[i].checked=false;
								$scope.userlist.push(data.row[i]);
							}
						}else{
							data.row[i].checked=false;
						    $scope.userlist = data.row;
						}									
					}
					//$scope.userlist = data.row;
				}
			})
		}
		$scope.selectcheckusers = function(user) {
			$scope.checkdetail.CheckUserIDs='';
			$scope.checkdetail.CheckUserNames='';
			if(user.checked&&!$scope.selectusers.indexOf(user)>-1){
				var i=$scope.userlist.indexOf(user);
				$scope.userlist.splice(i,1);
				$scope.selectusers.push(user)
			}	
			else if(!user.checked&&$scope.selectusers.indexOf(user)>-1){
				var i=$scope.selectusers.indexOf(user);
				$scope.selectusers.splice(i,1);		
				$scope.userlist.unshift(user);				
			}
			for(var i=0;i<$scope.selectusers.length;i++){
		  		$scope.checkdetail.CheckUserIDs+=$scope.selectusers[i].UserID+',';
		  		$scope.checkdetail.CheckUserNames+=$scope.selectusers[i].UserName+',';
		    }
			$scope.checkdetail.CheckUserIDs=$scope.checkdetail.CheckUserIDs.substring(0,$scope.checkdetail.CheckUserIDs.lastIndexOf(','));
			$scope.checkdetail.CheckUserNames=$scope.checkdetail.CheckUserNames.substring(0,$scope.checkdetail.CheckUserNames.lastIndexOf(','));
		}
		$scope.showActionsheet = function() {
			plus.nativeUI.actionSheet({
				title: "上传照片",
				cancel: "取消",
				buttons: [{
					title: "现场拍照"
				}, {
					title: "从相册选择"
				}]
			}, function(b) {
				//console.log("User pressed: " + b.index);
				switch(b.index) {
					case 1:
						makePhoto();
						break;
					case 2:
						takePhoto();
						break;
					default:
						break;
				}
			});
//			      $ionicActionSheet.show({
//			          titleText: '上传现场照片',
//			          cancelText: '取消',
//			          buttons: [{ text: '拍照' }, { text: '从相册中选取' }],
//			          cancel: function () { },
//			          buttonClicked: function (index) {
//			              switch (index) {
//			                  case 1: takePhoto(); break;
//			                  case 0:
//			                  default: makePhoto(); break;
//			              }
//			              return true;
//			          }
//			      });                    
		};
		$scope.showPic = function(url) {			
//			     var w=plus.webview.create(url,url,{hardwareAccelerated:true,scrollIndicator:'none',scalable:true,bounce:"all"});
//					w.addEventListener( "close", function() {
//						w = null;
//					}, false );
//					w.show( "pop-in" );
//					
//		   var floatw=plus.webview.create(url,url,{hardwareAccelerated:true,scrollIndicator:'none',scalable:true,bounce:"all"});
//        floatw.show('fade-in',300);
//          floatw.addEventListener('click',function(){
//              plus.webview.close(plus.webview.getWebviewById(url));
//          },false);
		};
		
		
		$scope.printcheck = function() {
			$http.post(ApiEndpoint.url + '/zaSys/printCheck/?checkID=' + $stateParams.checkId).success(function(data) {
				if(data.success) {
					//$ionicLoading.show({
					//    template: '正在签名...'
					//});
					//$timeout(function () {
					//    $ionicLoading.show({
					//        template: '签名成功...'
					//    });
					//},1000);
					$ionicLoading.show({
						template: '正在生成打印文件……'
					});
					$timeout(function() {
						$ionicLoading.show({
							template: '打印文件已生成！',
							duration: 1000
						});
					}, 1000);
					$timeout(function() {
						$ionicLoading.show({
							template: '发送打印命令……',
							duration: 500
						});
					}, 1500);
					$timeout(function() {
						$ionicLoading.show({
							template: '打印命令发送成功！',
							duration: 1000
						});
					}, 2500);
					//var extraInfo = cordova.require('cn.net.wenzhixin.cordova.ExtraInfo');

					//extraInfo.getExtra(function (message) {
					//     alert(message);
					//}, function (message) {
					// alert(message);
					//});
				} else {
					//alert('登录超时，请重新登录');
					//$scope.login();
					return;
				}
			})
		};
		$scope.printcheck2 = function() {
			//var uri = encodeURI(ApiEndpoint.url + "/1.pdf");
			//var fileTransfer = new FileTransfer(); 
			//fileTransfer.download(
			//    uri,
			//    window.appRootDir + "1.pdf",
			//    function (entry) {
			//        alert("download complete: " + entry.toURL());
			//    },
			//    function (error) {
			//        //console.log("download error source " + error.source);
			//        //console.log("download error target " + error.target);
			//        //console.log("upload error code" + error.code);
			//    }file:///storage/emulated/0/andriod/data/net.safe110.tzapp/cache
			//);
			var filepath = $window.cordova.file.dataDirectory.replace("file:///", "file://") + "1.pdf";
			//filepath = "www/res/file.pdf";
			//alert(filepath);
			//window.plugins.socialsharing.shareVia('epson.print', '检查文件', filepath, filepath, null, function () { console.log('share ok') }, function (msg) { alert('error: ' + msg) });
			window.plugins.socialsharing.share('检查文件', "subject", filepath);
		};
		$scope.savecheck = function() {			 
				if(!checkForm())
					return;
				var pics = getPicArr();
				var checkdate = $filter("date")($scope.checkdetail.CheckTime, 'yyyy-MM-dd');

				var poststr = ApiEndpoint.url + '/api/check/addCheck?r=' + Math.random();

				var postdata = {
					ProjectID: $stateParams.proId,
					ModuleType: $scope.checkdetail.CheckType.typeid,
					CheckDate: checkdate,
					CheckUserIDs: $scope.checkdetail.CheckUserIDs,
					pics: pics,
					CheckContent: $scope.checkdetail.CheckContent,
					SuperviseSuggest: $scope.checkdetail.SuperviseSuggest,
					RectificationLimit:$scope.checkdetail.RectificationLimit

				};
					postdata.NoticeType = $scope.checkdetail.NoticeType;
					postdata.NoticeNumber = $scope.checkdetail.NoticeNo;
					postdata.GrantObject = (($scope.checkdetail.GrantObject1 ? 1 : 0) | ($scope.checkdetail.GrantObject2 ? 2 : 0) | ($scope.checkdetail.GrantObject3 ? 4 : 0));				
			    if($stateParams.operType == 'edit'){
					postdata.ID=$stateParams.checkId;
				}
			  	postdata.ProjectProgress=$scope.checkdetail.ProjectProgress;
			  	
				$http.post(poststr, postdata).success(function(data) {
					if(data.code == 200) {
						$ionicLoading.show({
							template: '保存成功！',
							duration: 1000
						});
						$state.go("menus.check-checks", {
							proId: $stateParams.proId
						});
					} else {
						//alert('登录超时，请重新登录');
						//$scope.login();
						return;
					}
				})
			
		};
		function checkForm() {
			if(!$scope.checkdetail.CheckUserNames) {
				$ionicLoading.show({
					template: '请选择检查人员！',
					duration: 1000
				});
				return false;
			}
			if(!$scope.checkdetail.CheckTime) {
				$ionicLoading.show({
					template: '检查时间不能为空！',
					duration: 1000
				});
				return false;
			}
			if(!$scope.checkdetail.NoticeType) {
				$ionicLoading.show({
					template: '请选择通知书类型！',
					duration: 1000
				});
				return false;
			}
			if(!$scope.checkdetail.NoticeNo || ($scope.checkdetail.NoticeNo && ($scope.checkdetail.NoticeNo == null || $scope.checkdetail.NoticeNo == ""))) {
				$ionicLoading.show({
					template: '通知书编号不能为空！',
					duration: 1000
				});
				return false;
			}
			if(!$scope.checkdetail.GrantObject1 && !$scope.checkdetail.GrantObject2 && !$scope.checkdetail.GrantObject3) {
				$ionicLoading.show({
					template: '通知书发放对象至少要选择一个！',
					duration: 1000
				});
				return false;
				}
			if($scope.checkdetail.RectificationLimit!=undefined&&$scope.checkdetail.RectificationLimit!="") {
				var t= /^[0-9]*[1-9][0-9]*$/ ;  
				if(!t.test($scope.checkdetail.RectificationLimit)){
					$ionicLoading.show({
						template: '整改期限必须为正整数！',
						duration: 1000
					});
					return false;
				}
			}
			

	return true;
}
		//  function onPhotoDone(imageURI) { 
		//      uploadPhoto(imageURI); //alert(imageURI);
		//  }
		function onPhotoFail(message) {
			if(message.indexOf('cancelled') < 0) {
				alert('出錯了：' + message);
			}
		}

		function getPicArr() {
			var str = '';
			for(var i in $scope.photos) {
				str += $scope.photos[i].PicPath+'|'+$scope.photos[i].PicPath_s + ',';
			}
			return str.substr(0, str.lastIndexOf(','));
		}
				

		function uploadPhoto(imageURIs) {			
			var wt = plus.nativeUI.showWaiting();
			var task = plus.uploader.createUpload(ApiEndpoint.url + "/api/common/upload", {
					method: "POST"
				},
				function(t, status) { //上传完成
					if(status == 200) {						
						var json = eval('(' + t.responseText + ')');
						if(json && json.code==200) {
							for(var i = 0; i < json.rows.length; i++) {
								var row = json.rows[i];
								var loclurl = plus.io.convertLocalFileSystemURL(row.key);
									var photo = {
										PicPath: row.vipath,
										PicPath_s: row.svipath
									};
									$scope.$apply(function() {
										$scope.photos.push(photo);
									});
							}
						}
						wt.close();
					} else {
						alert(status);
						wt.close();
					}
				}
			);
			for(var i = 0; i < imageURIs.length; i++) {
				task.addFile(imageURIs[i], {
					key: 'uploadkey'+(i+1)
				});
			}
			task.start();
		}

		function makePhoto() {
			var cmr = plus.camera.getCamera();
			cmr.captureImage(function(p) {
				var arr = [];
				arr.push(p);

				uploadPhoto(arr);
			}, function(e) {}, {
				filename: "_doc/camera/",
				index: 1
			});
		}

		function takePhoto() {
			plus.gallery.pick(function(e) {
				var filesarr = []
				for(var i in e.files) {
					if(plus.os.name == "Android")
						filesarr.push(plus.io.convertLocalFileSystemURL(e.files[i]));
					else {
						var localurl = "_doc" + e.files[i].substring(e.files[i].lastIndexOf("/"), e.files[i].length);
						filesarr.push(localurl);
					}
				}
				uploadPhoto(filesarr);
			}, function(e) {
				outSet("取消选择图片");
			}, {
				filter: "image",
				multiple: true,
				system: false
			});

		}
	})
	.controller('ctrl-board-projects', function($scope, $http, $state, ApiEndpoint) {
		$scope.projects = [];
		$scope.page = 1;
		$scope.page_count = 1;
		$scope.load_over = true;
		$scope.type = 1;
		$scope.moduletype=window.localStorage['moduletype'];
		$scope.loadMore = function() {
			$http.post(ApiEndpoint.url + '/api/project/checkprolist/?moduletype='+$scope.moduletype+'&page=' + $scope.page + '&r=' + Math.random()).success(function(data) {
				if(data.code == 200) {
					$scope.page_count = data.total;
					angular.forEach(data.rows, function(row) {
						if(row.closeNum == 0)
							row.badgestyle = "badge-balanced";
						else
							row.badgestyle = "badge-assertive";
					});
					if(data.rows)
						$scope.projects = $scope.projects.concat(data.rows);
					//alert(data.rows.length);
					$scope.page++;
					$scope.$broadcast("scroll.infiniteScrollComplete");
					if($scope.page > $scope.page_count) {
						$scope.load_over = false;
						return;
					}
				} else {
					alert('登录超时，请重新登录');
					$scope.login();
					return;
				}
			})
		};
		$scope.doRefresh = function() {
			$scope.$broadcast('scroll.refreshComplete');
		};
	})

.controller('ctrl-board-projectbeian', function($scope, $stateParams, $http, $filter, $ionicActionSheet, ApiEndpoint, $window) {
	$scope.beiandetail = {};
	$scope.photos = [];
	$scope.photos2 = [];
	$http.get(ApiEndpoint.url + '/api/project/getprobeiandetail?InstallID=' + $stateParams.InstallID+ '&r=' + Math.random()).success(function(data) {
		if(data.code==200){
			$scope.beiandetail.PropertyUnit=data.obj.PropertyUnit;
			$scope.beiandetail.InstallUnit=data.obj.InstallUnit;
			$scope.beiandetail.InstallDate=data.obj.InstallDate;
			$scope.beiandetail.CheckUnit=data.obj.CheckUnit;
			$scope.beiandetail.CheckDate=data.obj.CheckDate;
			$scope.beiandetail.UseRegUnit=data.obj.UseRegUnit;
			$scope.beiandetail.UseRegDate=data.obj.UseRegDate;
			$scope.beiandetail.BeiAnICP=data.obj.BeiAnICP;
		}
	});

	$scope.showActionsheet = function() {
		$ionicActionSheet.show({
			titleText: '上传附件资料',
			cancelText: '取消',
			buttons: [{
				text: '拍照'
			}, {
				text: '从相册中选取'
			}],
			cancel: function() {},
			buttonClicked: function(index) {
				$scope.pictype = 1;
				switch(index) {
					case 1:
						takePhoto();
						break;
					case 0:
					default:
						makePhoto();
						break;
				}
				return true;
			}
		});
	};
	$scope.showActionsheet2 = function() {
		$ionicActionSheet.show({
			titleText: '上传使用登记表',
			cancelText: '取消',
			buttons: [{
				text: '拍照'
			}, {
				text: '从相册中选取'
			}],
			cancel: function() {},
			buttonClicked: function(index) {
				$scope.pictype = 2;
				switch(index) {
					case 1:
						takePhoto();
						break;
					case 0:
					default:
						makePhoto();
						break;
				}
				return true;
			}
		});
	};
	$scope.savepic = function() {
		var pics1 = getPicArr(1);
		var pics2 = getPicArr(2);
		var poststr = ApiEndpoint.url + '/zaSys/editBeiAnAttach/';

		poststr += '?checkId=' + $stateParams.checkId + '&checkType=' + $scope.checkdetail.CheckType.typeid + '&checkTime=' + $scope.checkdetail.CheckTime + '&checkUser=' + $scope.checkdetail.CheckUser + '&pics=' + escape(pics) + "&ItemDes=" + $scope.checkdetail.ItemDes;
		poststr += "&SubProID=" + ($scope.checkdetail.SubPro ? $scope.checkdetail.SubPro.ProID : 0);
		poststr += "&CheckNunber=" + ($scope.checkdetail.CheckNunber ? $scope.checkdetail.CheckNunber : "");
		//poststr += "&Content2=" + ($scope.checkdetail.Content2 ? $scope.checkdetail.Content2 : "");
		//poststr += "&Content3=" + ($scope.checkdetail.Content3 ? $scope.checkdetail.Content3 : "");
		poststr += "&CheckResult5=" + ($scope.checkdetail.CheckResult5 ? $scope.checkdetail.CheckResult5 : "");

		var checkresult = 0;
		if($scope.checkdetail.onjob1)
			checkresult |= 1;
		if($scope.checkdetail.onjob2)
			checkresult |= 2;
		if($scope.checkdetail.onjob3)
			checkresult |= 4;
		if($scope.checkdetail.onjob4)
			checkresult |= 8;
		poststr += "&CheckResult=" + checkresult;
		if($scope.checkdetail.hasnotice) {
			poststr += '&hasnotice=' + $scope.checkdetail.hasnotice;
			poststr += '&NoticeType=' + $scope.checkdetail.NoticeType;
			poststr += '&NoticeNo=' + $scope.checkdetail.NoticeNo;
			poststr += '&StopPart=' + ($scope.checkdetail.StopPart ? $scope.checkdetail.StopPart : "");
			poststr += '&GrantObject=' + (($scope.checkdetail.GrantObject1 ? 1 : 0) | ($scope.checkdetail.GrantObject2 ? 2 : 0) | ($scope.checkdetail.GrantObject3 ? 4 : 0));
			//poststr += '&NoticeContent1=' + ($scope.checkdetail.NoticeContent1 ? $scope.checkdetail.NoticeContent1 : "");
			poststr += '&GrantDate=' + $scope.checkdetail.GrantDate;
			poststr += '&MaxDoDate=' + $scope.checkdetail.MaxDoDate;
		}
		poststr += '&r=' + Math.random();
		var f1value = $scope.checkdetail.F1 ? $scope.checkdetail.F1 : "";
		var con1value = $scope.checkdetail.Content1 ? $scope.checkdetail.Content1 : "";
		if($scope.checkdetail.CheckMode == 24)
			con1value = $scope.checkdetail.F2;
		if($scope.checkdetail.CheckMode > 23)
			f1value = $scope.checkdetail.CheckResult2 ? $scope.checkdetail.CheckResult2 : "";

		var postdata = {
			Content1: con1value,
			Content2: ($scope.checkdetail.Content2 ? $scope.checkdetail.Content2 : ""),
			Content3: ($scope.checkdetail.Content3 ? $scope.checkdetail.Content3 : ""),
			NoticeContent1: ($scope.checkdetail.NoticeContent1 ? $scope.checkdetail.NoticeContent1 : ""),
			"F1": f1value
		};
		//alert(poststr); return;
		$http.post(poststr, postdata).success(function(data) {
			if(data.success) {
				$ionicLoading.show({
					template: '修改成功！',
					duration: 1000
				});
			} else {
				//alert('登录超时，请重新登录');
				//$scope.login();
				return;
			}
		})
	}
	$scope.showPic = function(url) {
		$window.open(url, '_blank', "width=100%,height=100%,resizable=1", '')
	};

	function onPhotoDone(imageURI) {
		uploadPhoto(imageURI); //alert(imageURI);
	}

	function onPhotoFail(message) {
		if(message.indexOf('cancelled') < 0) {
			alert('出錯了：' + message);
		}
	}

	function getPicArr(pictype) {
		var str = '';
		if(pictype == 1) {
			for(var i in $scope.photos) {
				str += $scope.photos[i].PicPath + ',';
			}
		} else if(pictype == 2) {
			for(var i in $scope.photos2) {
				str += $scope.photos2[i].PicPath + ',';
			}
		}
		return str.substr(0, str.lastIndexOf(','));
	}

	function uploadPhoto(imageURI) {
		var done = function(r) {
			var reg = eval('(' + r.response + ')');
			var photo = {
				PicPath: reg.obj,
				PicPath_s: imageURI
			};
			$scope.$apply(function() {
				if($scope.pictype == 1)
					$scope.photos.push(photo);
				else if($scope.pictype == 2)
					$scope.photos2.push(photo);
			});
		};

		var fail = function(e) {
			alert(e.code);
		};

		var options = new FileUploadOptions();
		options.fileKey = "fileAddPic";
		options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1).split("?")[0];
		//如果是图片格式，就用image/jpeg，其他文件格式上官网查API
		options.mimeType = "image/jpeg";
		options.chunkedMode = false;
		var ft = new FileTransfer();
		ft.upload(imageURI, encodeURI(ApiEndpoint.url + "/api/common/upload/?pictype=" + $scope.pictype), done, fail, options);
	}

	function makePhoto() {
		navigator.camera.getPicture(onPhotoDone, onPhotoFail, {
			quality: 100,
			targetWidth: 800,
			targetHeight: 800,
			destinationType: navigator.camera.DestinationType.FILE_URI
		});
	}

	function takePhoto() {
		navigator.camera.getPicture(onPhotoDone, onPhotoFail, {
			quality: 100,
			targetWidth: 800,
			targetHeight: 800,
			destinationType: navigator.camera.DestinationType.FILE_URI,
			sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM
		});
	}
})

.controller('ctrl-board-projectdetail', function($scope, $stateParams, $http, $state, ApiEndpoint) {
		$scope.projectDetail = {};
		$scope.checks = [];
		$scope.ProjectPersons = [];
		$scope.beians = [];
		$scope.devices = [];
		$scope.IsLoadForMonitor = true;
		$scope.IsLoadForCheck = true;
		$scope.IsLoadForPerson = true;
		$scope.IsLoadForBeiAn = true;
		$scope.shownGroup = 1;
		$scope.proId=$stateParams.proId;
		$scope.moduletype = parseInt(window.localStorage['moduletype']);
		$scope.toggleGroup = function(index) {

			if($scope.isGroupShown(index)) {
				$scope.shownGroup = null;
			} else {
				$scope.shownGroup = index;
			}
		};
		$scope.isGroupShown = function(index) {
			return $scope.shownGroup === index;
		};

		$http.get(ApiEndpoint.url + '/api/project/baseprojectmsg?proId=' + $stateParams.proId + '&moduletype=' + $scope.moduletype + '&r=' + Math.random()).success(function(data) {
			if(data.code == 200) {
				if($scope.moduletype == "1") {
					$scope.projectDetail.ProName = data.obj.ProName;
					$scope.projectDetail.RegNumber = data.obj.RegNumber;
					$scope.projectDetail.ShigongUnitName = data.obj.ShigongUnitName;
					$scope.projectDetail.JianLiUnitName = data.obj.JianLiUnitName;
					$scope.projectDetail.ProUsers = data.obj.ProUsers;

					$scope.projectDetail.ProjectCreateTime = data.obj.ProjectCreateTime;
					$scope.projectDetail.CheckTimes = data.obj.CheckTimes;
					$scope.projectDetail.CheckRecord = data.obj.CheckRecord;
					$scope.projectDetail.SuggestCount = data.obj.SuggestCount;
					$scope.projectDetail.NoticeCount = data.obj.NoticeCount;
					$scope.projectDetail.ShutdownRectification = data.obj.ShutdownRectification;
					$scope.projectDetail.CloseNum = data.obj.CloseNum;
					$scope.projectDetail.RecentCheckTime = data.obj.RecentCheckTime;
					$scope.projectDetail.JiKengZhiHu=[];
					$scope.projectDetail.GaoDaZhiMo=[];
					$scope.projectDetail.Other=[];
					$scope.projectDetail.JiKengZhiHu = data.obj.JiKengZhiHu;
					$scope.projectDetail.GaoDaZhiMo = data.obj.GaoDaZhiMo;
					$scope.projectDetail.Other = data.obj.Other;

					$scope.beians = data.obj.BeiAnListData;
				} else if($scope.moduletype == "2") {
					$scope.projectDetail.ProName = data.obj.ProName;
					$scope.projectDetail.QualityRegNumber = data.obj.QualityRegNumber;
					$scope.projectDetail.ShigongUnitName = data.obj.ShigongUnitName;
					$scope.projectDetail.JianLiUnitName = data.obj.JianLiUnitName;
					$scope.projectDetail.ProUsers = data.obj.ProUsers;

					$scope.projectDetail.ProjectCreateTime = data.obj.ProjectCreateTime;
					$scope.projectDetail.CheckTimes = data.obj.CheckTimes;
					$scope.projectDetail.CheckNoticeNoRecive = data.obj.CheckNoticeNoRecive;
					$scope.projectDetail.CheckNoticeRecive = data.obj.CheckNoticeRecive;
					$scope.projectDetail.Rectification = data.obj.Rectification;
					$scope.projectDetail.ShutdownRectification = data.obj.ShutdownRectification;
					$scope.projectDetail.CloseNum = data.obj.CloseNum;
					$scope.projectDetail.RecentCheckTime = data.obj.RecentCheckTime;
					
					$scope.projectDetail.FoundationDivision=[];
					$scope.projectDetail.MainBranch=[];
					$scope.projectDetail.FinalAcceptance=[];
					
					$scope.projectDetail.FoundationDivision=data.obj.FoundationDivision;
					$scope.projectDetail.MainBranch=data.obj.MainBranch;
					$scope.projectDetail.FinalAcceptance=data.obj.FinalAcceptance;
				}

				var person = {};

				person.PPersonID = data.obj.ShiGongManageId;
				person.TrueName = data.obj.ShiGongManageName;
				person.Phone = data.obj.ShiGongManagePhone;
				person.PersonTypeName = '施工单位项目负责人';
				$scope.ProjectPersons[0] = person;

				person = {};
				person.PPersonID = data.obj.JianLiManageId;
				person.TrueName = data.obj.JianLiManageName;
				person.Phone = data.obj.JianLiManagePhone;
				person.PersonTypeName = '监理单位项目负责人';
				$scope.ProjectPersons[1] = person;
				person = {};
				person.PPersonID = data.obj.JianSheManageId;
				person.TrueName = data.obj.JianSheManageName;
				person.Phone = data.obj.JianSheManagePhone;
				person.PersonTypeName = '建设单位项目负责人';
				$scope.ProjectPersons[2] = person;
				person = {};
				person.PPersonID = data.obj.KanChaManageId;
				person.TrueName = data.obj.KanChaManageName;
				person.Phone = data.obj.KanChaManagePhone;
				person.PersonTypeName = '勘察单位项目负责人';
				$scope.ProjectPersons[3] = person;
				person = {};
				person.PPersonID = data.obj.SheJiManageId;
				person.TrueName = data.obj.SheJiManageName;
				person.Phone = data.obj.SheJiManagePhone;
				person.PersonTypeName = '设计单位项目负责人';
				$scope.ProjectPersons[4] = person;
				//			

			} else {
				alert(data.msg);
				$state.go('login');
			}
		});
	})
	//.controller('ctrl-board-projectdetail-quality', function ($scope, $stateParams, $http, ApiEndpoint) {
	//  $scope.projectDetail = {};
	//  $scope.checks = [];
	//  $scope.persons = [];
	//  $scope.beians = [];
	//  $scope.devices = [];
	//  $scope.IsLoadForMonitor = true;
	//  $scope.IsLoadForCheck = true;
	//  $scope.IsLoadForPerson = true;
	//  $scope.IsLoadForBeiAn = true;
	//  $scope.shownGroup = 1;
	//  $scope.toggleGroup = function (index) {        
	//      if ($scope.isGroupShown(index)) {
	//          $scope.shownGroup = null;
	//      } else {           
	//          $scope.shownGroup = index;
	//          //if ($scope.IsLoadForMonitor && index == 3) {
	//          //    $http.post(ApiEndpoint.url + '/monitor/getRegisterList/?r=' + Math.random()).success(function (data) {
	//          //        if (data.success) {
	//          //            $scope.devices = $scope.devices.concat(data.rows);
	//          //            $scope.IsLoadForMonitor = false;
	//          //        }
	//          //    })
	//          //} else
	//              if ($scope.IsLoadForCheck && index == 5) {
	//              $http.post(ApiEndpoint.url + '/zaSys/checkList/?page=1&rows=10000&proid=' + $stateParams.proId + '&checkType=3&r=' + Math.random()).success(function (data) {
	//                  if (data.success) {
	//                      $scope.checks = $scope.checks.concat(data.rows);
	//                      $scope.IsLoadForCheck = false;                        
	//                  }
	//              })
	//          } else if ($scope.IsLoadForPerson && index == 6) {
	////              $http.post(ApiEndpoint.url + '/zaSys/getProPerList/?proid=' + $stateParams.proId + '&r=' + Math.random()).success(function (data) {
	////                  if (data.success) {
	////                      $scope.persons = $scope.persons.concat(data.rows);
	////                      $scope.IsLoadForPerson = false;
	////                  }
	////              })
	//          } else if ($scope.IsLoadForBeiAn && index == 7) {
	//              $http.post(ApiEndpoint.url + '/zaSys/getProBeiAnList/?proid=' + $stateParams.proId + '&r=' + Math.random()).success(function (data) {
	//                  if (data.success) {
	//                      $scope.beians = $scope.beians.concat(data.rows);
	//                      $scope.IsLoadForBeiAn = false;
	//                  }
	//              })
	//          }
	//      }
	//  };
	//  $scope.isGroupShown = function (index) {
	//      return $scope.shownGroup === index;       
	//  };    
	//  $http.post(ApiEndpoint.url + '/zaSys/getProjectDetail?proId=' + $stateParams.proId + '&r=' + Math.random()).success(function (data) {
	//      if (data.success) {
	//          $scope.projectDetail.ProName = data.obj[0].ProName;
	//          $scope.projectDetail.RegNumber = data.obj[0].RegNumber;
	//          $scope.projectDetail.ShigongUnitName = data.obj[0].ShigongUnitName;
	//          $scope.projectDetail.ConsUnitName = data.obj[0].ConsUnitName;
	//          $scope.projectDetail.ProUsers = data.obj[0].ProUsers;
	//          $scope.projectDetail.JiaoDiDate = data.obj[0].JiaoDiDate;
	//          $scope.projectDetail.CheckCount = data.obj[0].CheckCount;
	//          $scope.projectDetail.CheckCount1 = data.obj[0].CheckCount1;
	//          $scope.projectDetail.noticeNum = data.obj[0].noticeNum;
	//          $scope.projectDetail.closeNum = data.obj[0].closeNum;
	//          $scope.projectDetail.LastCheckTime = data.obj[0].LastCheckTime;
	//          $scope.projectDetail.Target1 = data.obj[0].Target1;
	//          $scope.projectDetail.Count1 = data.obj[0].Count1;
	//          $scope.projectDetail.Target2 = data.obj[0].Target2;
	//          $scope.projectDetail.Count2 = data.obj[0].Count2;
	//          $scope.projectDetail.Target3 = data.obj[0].Target3;
	//          $scope.projectDetail.Count3 = data.obj[0].Count3;
	//          $scope.projectDetail.Target4 = data.obj[0].Target4;
	//          $scope.projectDetail.Count4 = data.obj[0].Count4;
	//          $scope.projectDetail.CountTotal = data.obj[0].Count1 + data.obj[0].Count2 + data.obj[0].Count3 + data.obj[0].Count4;
	//          $scope.projectDetail.TargetTotal = data.obj[0].Target1 + data.obj[0].Target2 + data.obj[0].Target3 + data.obj[0].Target4;
	//      } else {
	//          alert(data.msg);
	//          $state.go('login');
	//      }
	//  });
	//})
	.controller('ctrl-board-projectpersondetail', function($scope, $stateParams, $http, ApiEndpoint) {
		$scope.persondetail = {};
		if($stateParams.pperonid != '00000000-0000-0000-0000-000000000000') {
			$http.get(ApiEndpoint.url + '/api/project/projectperson?projectpersonid=' + $stateParams.pperonid + '&r=' + Math.random()).success(function(data) {
				if(data.code == 200) {
					$scope.persondetail.PersonType = $stateParams.persontype;
					$scope.persondetail.TrueName = data.obj.TrueName;
					$scope.persondetail.Phone = data.obj.Phone;
					$scope.persondetail.IdentityCard = data.obj.IDCard;
					$scope.persondetail.CerNo = data.obj.CerNo;
				} else {
					alert(data.msg);
					$state.go('login');
				}
			});
		} else {
			$scope.persondetail.PersonType = $stateParams.persontype;
			$scope.persondetail.TrueName = '';
			$scope.persondetail.Phone = '';
			$scope.persondetail.IdentityCard = '';
			$scope.persondetail.CerNo = '';
		}

	})

.controller('ctrl-account-main', function($scope, $ionicPopup, $state,$ionicHistory,$http, ApiEndpoint, $window) {
		$scope.showAlert = function() {
			var alertPopup = $ionicPopup.alert({
				title: '密码失效或不正确!',
				template: '密码失效或不正确'
			});
			alertPopup.then(function(res) {
				console.log('Thank you for not eating my delicious ice cream cone');
			});
		};

		$scope.exit = function() {
			$http.get(ApiEndpoint.url + '/api/Login/?r=' + Math.random()).success(function(data) {
				if(data.code == 200) {
					window.localStorage.removeItem('apikey');
					$http.defaults.headers.common['Authorization'] = "";
					$ionicHistory.clearCache();
					$state.go('login');
				} else {
					//$scope.showAlert();
					window.localStorage.removeItem('apikey');
					$http.defaults.headers.common['Authorization'] = "";
					$state.go('login');
					//alert(data.msg);
				}
			}).error(function(response) {
				if(errCb && typeof errCb === 'function') {
					//errCb(response);
				}
			});
		};
		$scope.scancheck = function() {
			cordova.plugins.barcodeScanner.scan(
				function(result) {
					if(!result.cancelled) {
						$window.open("http://tzapp.safe110.net:8085/checkresult.html?code=" + result.text, '_blank', "width=100%,height=100%,resizable=1", '');
					}
				},
				function(error) {
					//alert("Scanning failed: " + error);
				}
			);

			// $window.open("http://tzapp.safe110.net:8085/checkresult.html", '_blank', "width=100%,height=100%,resizable=1", '');
		};
	})
	.controller('ctrl-account-userinfo', function($scope, $http, ApiEndpoint) {
		$http.get(ApiEndpoint.url + '/api/Account/?r=' + Math.random()).success(function(data) {
			if(data.code == 200) {
				$scope.userinfo = data.obj;
			}
		});
	})
	.controller('ctrl-account-zone', function($scope) {

	})
	.controller('ctrl-account-about', function($scope) {

	})

.controller('ctrl-common-companydetail', function($scope, $stateParams, $http, $state, ApiEndpoint) {
		$scope.companydetail = {};
		$http.post(ApiEndpoint.url + '/basic/GetDeviceCompanyDetailInfo?deviceSN=' + $stateParams.deviceSN + '&monitorType=' + $stateParams.monitorType + '&r=' + Math.random()).success(function(data) {
			if(data.success) {
				$scope.companydetail.CompanyName = data.obj.ContractorCompanyName;
				if($stateParams.companyType == "1") {
					$scope.companydetail.CompanyType = "施工单位";
					$scope.companydetail.CompanyAddress = data.obj.ContractorCompanyAddress;
					$scope.companydetail.TecPerson = data.obj.TechniqueMan;
					$scope.companydetail.LinkPhone = data.obj.TechniqueTel;
					$scope.companydetail.WebUrl = data.obj.ContractorCompanyWebUrl;
					$scope.companydetail.Fax = data.obj.ContractorCompanyFax;
				} else {
					$scope.companydetail.CompanyType = "产权单位";
					$scope.companydetail.CompanyAddress = data.obj.OwnerCompanyAddress;
					$scope.companydetail.TecPerson = data.obj.OwnerCompanyTechniqueMan;
					$scope.companydetail.LinkPhone = data.obj.OwnerCompanyTechniqueTel;
					$scope.companydetail.WebUrl = data.obj.OwnerCompanyWebUrl;
					$scope.companydetail.Fax = data.obj.OwnerCompanyFax;
				}
			} else {
				alert(data.msg);
			}
		});
	})
	.controller('ctrl-common-projectdetail', function($scope, $stateParams, $http, $state, ApiEndpoint) {
		$scope.projectdetail = {};
		$http.post(ApiEndpoint.url + '/basic/GetDeviceCompanyDetailInfo?deviceSN=' + $stateParams.deviceSN + '&monitorType=' + $stateParams.monitorType + '&r=' + Math.random()).success(function(data) {
			if(data.success) {
				$scope.projectdetail.ProjectName = data.obj.ProjectName;
				$scope.projectdetail.ProjectAddress = data.obj.ProjectAddress;
				$scope.projectdetail.AreaAddress = data.obj.AreaAddress;
				$scope.projectdetail.StationName = data.obj.StationName;
				$scope.projectdetail.ContractorCompanyName = data.obj.ContractorCompanyName;
				$scope.projectdetail.ContractorCompanyName = data.obj.ContractorCompanyName;
				$scope.projectdetail.SupervisionCompanyName = data.obj.SupervisionCompanyName;
			} else {
				alert(data.msg);
			}
		});
	});