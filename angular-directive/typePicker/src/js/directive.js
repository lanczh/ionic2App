angular.module('com.amarsoft.mobile.services2',[])
//.directive('base',function($parse){})

.directive('typePicker',function($ionicPopup, $ionicModal, $timeout,
		$ionicScrollDelegate,$ionicLoading){
//	类型选择器，来源：www/lib/ionic-citypicker/src/js/ionic-citypicker.js
//	<type-Picker options="obj.typename"></type-Picker>

	function loadMsg($ionicLoading,templateContent){
		$ionicLoading.show({
			template : templateContent,
			duration : 2000
		});
	}
	function isBoolean(value) {
		return typeof value === 'boolean'
	}
	function isArray(value) {
		return toString.apply(value) === '[object Array]'
	}
	return {
		restrict : 'AE',
		template : "<div class={{pk.cssClass}}><label class={{pk.labelClass}}>{{pk.select.name}}</label><span class={{pk.arrowClass}}><span></div>",
		scope : {
			options : '=options'
		},
		link : function(scope, element, attrs) {
			console.log(element);
			
//			scope
		
			var pk = scope.pk = {}, so = scope.options, pickerModal = null;
			pk.uuid = Math.random().toString(36)
					.substring(3, 8);
			
			console.log('test type-picker');
			console.log(so);
			pk.listHandler = "list-" + pk.uuid;
			pk.show = false;
			pk.list = so.list || [];
			pk.title = so.title || '';
			pk.buttonText = so.buttonText || '完成';
			pk.backdropClickToClose = isBoolean(so.backdropClickToClose) ? so.backdropClickToClose
					: false;
			pk.hardwareBackButtonClose = isBoolean(so.hardwareBackButtonClose) ? so.hardwareBackButtonClose
					: true;
			pk.watchChange = isBoolean(so.watchChange) ? so.watchChange
					: false;
			pk.cssClass = so.cssClass
					|| 'single_picker';
			pk.labelClass = so.labelClass || 'col-80';
			pk.arrowClass = so.arrowClass
					|| 'arrow_menu col-20';
			pk.select = {
				value : "",
				name : so.defaultText || "请选择"
			};
			pk.select = so.select || pk.select;
			pk.temp = so.select
					|| (pk.list.length != 0 ? pk.list[0]
							: {});
			pk.step = so.step || 36;
			pk.returnCancel = function() {
				
				$timeout(function() {
					pickerModal && pickerModal.hide();
					pk.show = false;
					pk.initData(pk.select);
				}, 200)
				
			};
			pk.returnOk = function() {
				pk.select = pk.temp;
				so.select = pk.temp;
				$timeout(function() {
					pickerModal && pickerModal.hide();
					pk.show = false;
					so.buttonClicked
							&& so.buttonClicked();
				}, 200);
			};
			pk.clickToClose = function() {
				pk.backdropClickToClose
						&& pk.returnCancel();
			};

			pk.getValue = function() {
				$timeout.cancel(pk.runing);

				var top = $ionicScrollDelegate
						.$getByHandle(pk.listHandler)
						.getScrollPosition().top; // 当前滚动位置
				var step = Math.round(top / pk.step);
				if (top % pk.step !== 0) {
					$ionicScrollDelegate.$getByHandle(
							pk.listHandler).scrollTo(0,
							step * pk.step, true);
					return false;
				}
				pk.runing = $timeout(function() {
					pk.temp = pk.list[step];
				});
			};

			pk.initData = function(defaultData) {									
				for (var i = 0; i < pk.list; i++) {
					if (defaultData.value == pk.list[i].value) {
						$ionicScrollDelegate
								.$getByHandle(
										pk.listHandler)
								.scrollTo(0,
										i * pk.step);
						pk.select = pk.list[i];
					}
				}
			};

			scope
					.$watch(
							'options.list',
							function(newVal, oldVal) {
								if (newVal != oldVal
										&& isArray(newVal)
										&& newVal.length >= 1) {
									pk.list = newVal;
									pk.temp = so.select
											|| (pk.list.length != 0 ? pk.list[0]
													: {});
									if (pk.isCreated) {
										pk
												.initData(pk.temp);
									}
								}
							});
			scope.$watch('options.select', function(
					newVal, oldVal) {
				if (newVal != oldVal) {
					pk.temp = so.select;
					pk.select = so.select;
					if (pk.isCreated) {
						pk.initData(pk.temp);
					}else{
//						if(newVal.)
						pk.select.name= newVal.join("");
					}
				}
			});
			

			element
					.on(
							"click",
							function() {
							
								if(pk.list.length > 0){
									if(pk.show){return;}
									pk.show = true;
									
									if (pickerModal) {
										$timeout(
						                        function() {
						                        	pickerModal.show();
						                        },
						                        1000);
										return;
									}
									
									pk.isCreated = true;
									creatModal();
								}else{
									pk.isCreated = false;
									loadMsg($ionicLoading,"查询数据出错,请联系服务商");
									return;
								}													
								
								function creatModal(){
									$ionicModal
									.fromTemplateUrl(
//											'templates/widget/picker_popup.html',
											'lib/typePicker/src/templates/dir-typePicker.html',
											{
												scope : scope,
												animation : 'slide-in-up',
												backdropClickToClose : pk.backdropClickToClose,
												hardwareBackButtonClose : pk.hardwareBackButtonClose
											})
									.then(
											function(
													modal) {
												pickerModal = modal;
												$timeout(
														function() {
															pickerModal
																	.show();
															pk
																	.initData(pk.temp);
														},
														200);
												
											});
								}
							});

			scope.$on('$destroy', function() {
				if (pickerModal) {
					pk.show = false;
					pickerModal.remove();
					pickerModal = null;
				}
			});
		}
	}


})
.directive('base',function(){
	return {
		restrict:'A',
		transclude : true,
		template:'<div ng-transclude></div>',
		link: function(){
			var expanders = [];
            this.gotOpened = function(selectedExpander) {
                angular.forEach(expanders, function(expander) {
                    if (selectedExpander != expander) {
                        expander.showMe = false;
                    }
                });
            }
            this.addExpander = function(expander) {
                expanders.push(expander);
            }
		}
	}
})

//这个例子主要的难点在于如何在子Expander里面访问外层Accordion的scope中的数据
// <accordion>
//	<expander class="expander" ng-repeat="expander in expanders" expander-title ="expander.title">{{expander.text}}</expander>
//</accordion>
.directive('accordion', function() {
    return {
        restrict : 'EA',
        replace : true,
        transclude : true,
        template : '<div ng-transclude></div>',
        controller : function() {
            var expanders = [];
            this.gotOpened = function(selectedExpander) {
                angular.forEach(expanders, function(expander) {
                    if (selectedExpander != expander) {
                        expander.showMe = false;
                    }
                });
            }
            this.addExpander = function(expander) {
                expanders.push(expander);
            }
        }
    }
})
.directive('expander', function() {
    return {
        restrict : 'EA',
        replace : true,
        transclude : true,
        require : '^?accordion',
        scope : {
            title : '=expanderTitle'
        },
        template : '<div>'
                   + '<div class="title" ng-click="toggle()">{{title}}</div>'
                   + '<div class="body" ng-show="showMe" ng-transclude></div>'
                   + '</div>',
        link : function(scope, element, attrs, accordionController) {
            scope.showMe = false;
            accordionController.addExpander(scope);
            scope.toggle = function toggle() {
                scope.showMe = !scope.showMe;
                accordionController.gotOpened(scope);
            }
        }
    }
})
.directive('fileModel',function($parse){
	
	return {
		restrict : 'A',
		link : function(scope, element, attrs, ngModel) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;
			element.bind('change', function(event) {
				scope.$apply(function() {
					modelSetter(scope, element[0].files[0]);
				});
				// 附件预览
				scope.file = (event.srcElement || event.target).files[0];
				scope.getFile();
			});
		}
	};

	
})