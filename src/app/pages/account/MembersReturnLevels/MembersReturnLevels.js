/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('MembersReturnLevels', MembersReturnLevels);

    /** @ngInject */
    function MembersReturnLevels($scope, httpFactory, lotteryConst, custNotify, $uibModal, todoService, common) {
        var url = lotteryConst.uaaPathPlat;
        var cacheFlag = [];
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        $scope.accountFlag = false;
        $scope.accountSeltctAllFlag = false;
        $scope.levelFlag = false;
        $scope.levelSeltctAllFlag = false;
        $scope.cid = [];
        $scope.levelCid = [];

        function initPage() {

            $scope.queryParam = {
                page: 1,//当前页*分页必须
                rows: $scope.pageSize,//分页行数*分页必须
                createTimeStart: '',
                createTimeEnd: "",
                status: '',
                logins: ''

            };
            $scope.levelQueryParam = {
                page: 1,//当前页*分页必须
                rows: $scope.pageSize,//分页行数*分页必须
                createTimeStart: '',
                createTimeEnd: "",
                status: '',
                levelIds: []

            };
            $scope.selectParam = {
                startTime: "",
                endTime: '',
                startTime2: "",
                endTime2: '',
                statusSelected: '',
                status: lotteryConst.status

            };
        }

        initPage();
        /**
         * 条件搜索
         */
        $scope.openTab = function (e) {
            if (e == 1) {
                initPage();
                $scope.accountSeltctAllFlag = false;
                $("#accountSeltct").prop("checked", false);
                $scope.onSearch1();
            } else {
                initPage();
                $scope.getMembersLists();
                $("#levelSeltctAll").prop("checked", false);
                $scope.levelSeltctAllFlag = false;
                $scope.onSearch2();
            }
        };
        //获取会员层级列表
        $scope.getMembersLists = function () {
            httpFactory.getList(lotteryConst.uaaPathPlat + '/memberLevel/getSelectList', 'GET', null, null).then(function (result) {
                //console.log(result)
                if (result.data) {
                    $scope.selectParam.memberLevel = result.data;

                }
                console.log($scope.selectParam.memberLevel)
            }, function (data) {

            });
        };

        $scope.onSearch1 = function (e) {
            if (!e) {
                $scope.queryParam.page = 1;
            }
            if ($scope.selectParam.logins) {
                $scope.queryParam.logins = $scope.selectParam.logins.split(',')
            }
            if (!$scope.selectParam.logins) {
                $scope.queryParam.logins = ''
            }
            if ($scope.selectParam.startTime) {
                $scope.queryParam.createTimeStart = new Date($scope.selectParam.startTime).getTime();
            }
            if ($scope.selectParam.endTime) {
                $scope.queryParam.createTimeEnd = new Date($scope.selectParam.endTime).getTime();
            }
            if ($scope.selectParam.status) {
                $scope.queryParam.status = $scope.selectParam.statusSelected.id
            }

            httpFactory.getList(url + '/memberLevel/backList', 'GET', null, $scope.queryParam).then(function (result) {
                if (result.data) {
                    $scope.entity = result.data.rows;
                    for (var i = 0; i < $scope.entity.length; i++) {
                        if ($scope.cid.length == 0) {
                            $scope.entity[i].flag = false;
                        } else if ($scope.cid.length >= 1) {

                            for (var j = 0; j < $scope.cid.length; j++) {
                                if ($scope.entity[i].cid == $scope.cid[j]) {
                                    $scope.entity[i].flag = true;
                                }
                            }
                        }


                    }
                    var selectFlag = $scope.entity.every(function (item) {
                        return item.flag == true
                    });
                    if (selectFlag) {
                        $scope.accountSeltctAllFlag = true;
                        $("#accountSeltct").prop("checked", true);
                    } else {
                        $scope.accountSeltctAllFlag = false;
                        $("#accountSeltct").prop("checked", false);
                    }

                }

                /**
                 * 分页开始
                 */
                $scope.queryParam.page = result.data.currentPage;//获取的当前页currentPage赋值给查询方法的当前页参数page
                common.soPage({
                    $id: 'page-1',
                    total: result.data.total,//总条数
                    size: $scope.queryParam.rows,//每页条数
                    nowPage: $scope.queryParam.page
                }, function (btn) {// 回调方法，返回当前页码
                    $scope.queryParam.page = btn;//重新赋值当前页
                    $scope.onSearch1(1);// 获取list的方法
                });// 分页
                /**
                 * 分页结束
                 */
            }, function (data) {

            });
        };

        $scope.onSearch1();
        $scope.onSearch2 = function (e) {
            if (!e) {
                $scope.levelQueryParam.page = 1;
            }

            if ($scope.selectParam.memberLevelSelected) {
                var arr = [];
                for (var i = 0; i < $scope.selectParam.memberLevelSelected.length; i++) {
                    arr.push($scope.selectParam.memberLevelSelected[i].id)
                }
                //console.log(arr)
                $scope.levelQueryParam.levelIds = arr;
            }

            if ($scope.selectParam.startTime) {
                console.log($scope.selectParam.startTime2)
                $scope.levelQueryParam.createTimeStart = new Date($scope.selectParam.startTime).getTime();
            }
            if ($scope.selectParam.endTime) {
                $scope.levelQueryParam.createTimeEnd = new Date($scope.selectParam.endTime).getTime();
            }
            if ($scope.selectParam.status) {
                $scope.levelQueryParam.status = $scope.selectParam.statusSelected.id
            }
            httpFactory.getList(url + '/memberLevel/backList', 'GET', null, $scope.levelQueryParam).then(function (result) {
                if (!result.data.rows) {
                    return false
                }
                cacheFlag = [];
                $scope.levelEntity = result.data.rows;
                if ($scope.levelEntity.length == 0) {
                    $("#levelSeltctAll").prop("checked", false);
                    $scope.levelSeltctAllFlag = false;
                }
                for (var i = 0; i < $scope.levelEntity.length; i++) {

                    if ($scope.levelCid.length == 0) {
                        $scope.levelEntity[i].flag = false;
                    } else if ($scope.levelCid.length >= 1) {

                        for (var j = 0; j < $scope.levelCid.length; j++) {
                            if ($scope.levelEntity[i].cid == $scope.levelCid[j]) {
                                $scope.levelEntity[i].flag = true;
                                cacheFlag.push($scope.levelEntity[i].flag)
                            }
                        }
                    }
                }


                if (result.data.total > $scope.pageSize) {
                    if (cacheFlag.length == $scope.pageSize) {
                        $("#levelSeltctAll").prop("checked", true);
                        $scope.levelSeltctAllFlag = true;
                    } else {
                        $("#levelSeltctAll").prop("checked", false);
                        $scope.levelSeltctAllFlag = false;
                    }
                } else if (result.data.total > 1) {
                    if (cacheFlag.length == result.data.total) {
                        $("#levelSeltctAll").prop("checked", true);
                        $scope.levelSeltctAllFlag = true;
                    } else {
                        $("#levelSeltctAll").prop("checked", false);
                        $scope.levelSeltctAllFlag = false;
                    }
                }
                /**
                 * 分页开始
                 */
                $scope.levelQueryParam.page = result.data.currentPage;//获取的当前页currentPage赋值给查询方法的当前页参数page
                common.soPage({
                    $id: 'page-2',
                    total: result.data.total,//总条数
                    size: $scope.levelQueryParam.rows,//每页条数
                    nowPage: $scope.levelQueryParam.page
                }, function (btn) {// 回调方法，返回当前页码
                    $scope.levelQueryParam.page = btn;//重新赋值当前页
                    $scope.onSearch2(1);// 获取list的方法
                });// 分页
                /**
                 * 分页结束
                 */
            }, function (data) {

            });
        };
        /**
         * 会员层级改变监听事件
         */
        $scope.$watch("selectParam.memberLevelSelected", function () {
            $scope.onSearch2()
        });
        $scope.onReset = function () {
            $scope.selectParam.startTime = '';
            $scope.selectParam.endTime = '';
            initPage();
        };
        $scope.accountSeltctAll = function () {
            $scope.accountSeltctAllFlag = !$scope.accountSeltctAllFlag;
            if ($scope.accountSeltctAllFlag) {
                for (var i = 0; i < $scope.entity.length; i++) {
                    $scope.entity[i].flag = true;
                    $scope.cid.push($scope.entity[i].cid)
                }
                $scope.cid = unique($scope.cid);
            } else {
                for (var j = 0; j < $scope.entity.length; j++) {
                    $scope.entity[j].flag = false;
                }
                $scope.cid = [];

            }
            console.log($scope.cid)
        };
        $scope.levelSeltctAll = function () {
            $scope.levelSeltctAllFlag = !$scope.levelSeltctAllFlag;
            if ($scope.levelSeltctAllFlag) {
                for (var i = 0; i < $scope.levelEntity.length; i++) {
                    $scope.levelEntity[i].flag = true;
                    $scope.levelCid.push($scope.levelEntity[i].cid)
                }
                $scope.levelCid = unique($scope.levelCid);
            } else {
                for (var j = 0; j < $scope.levelEntity.length; j++) {
                    $scope.levelEntity[j].flag = false;
                }
                $scope.levelCid = [];
            }
            console.log($scope.levelCid)
        };
        $scope.selectCurCid = function (item) {
            var arr = [];
            var selectFlag = [];

            //item.flag=!item.flag;
            function isSelect(item) {
                return item == true
            }

            if (item.flag) {
                $scope.cid.push(item.cid);
                for (var i = 0; i < $scope.entity.length; i++) {
                    arr.push($scope.entity[i].flag)
                }
                selectFlag = arr.every(isSelect);
                //console.log(selectFlag)
                if (selectFlag) {
                    $scope.accountSeltctAllFlag = true;
                    $("#accountSeltct").prop("checked", true);
                }

            } else {
                if ($scope.cid.length == 1) {
                    $scope.cid = []
                } else if ($scope.cid.length > 1) {
                    $scope.accountSeltctAllFlag = false;
                    $("#accountSeltct").prop("checked", false);
                    for (var i = 0; i < $scope.cid.length; i++) {
                        if ($scope.cid[i] == item.cid) {
                            $scope.cid.splice(i, 1);
                            break
                        }
                    }
                }
            }
            console.log($scope.cid)
        };
        $scope.selectlevelCurCid = function (item) {
            var arr = [];
            var selectFlag = [];

            //item.flag=!item.flag;
            function isSelect(item) {
                return item == true
            }

            //item.flag=!item.flag;
            if (item.flag) {
                $scope.levelCid.push(item.cid);
                for (var i = 0; i < $scope.levelEntity.length; i++) {
                    arr.push($scope.levelEntity[i].flag)
                }
                console.log(arr);
                selectFlag = arr.every(isSelect);
                console.log(selectFlag)
                if (selectFlag) {
                    $("#levelSeltctAll").prop("checked", true);
                    $scope.levelSeltctAllFlag = true;
                }

            } else {
                if ($scope.levelCid.length == 1) {
                    $scope.levelCid = []
                } else if ($scope.levelCid.length > 1) {
                    $("#levelSeltctAll").prop("checked", false);
                    $scope.levelSeltctAllFlag = false;
                    for (var i = 0; i < $scope.levelCid.length; i++) {
                        if ($scope.levelCid[i] == item.cid) {
                            $scope.levelCid.splice(i, 1);
                            break
                        }
                    }
                }
            }
            console.log($scope.levelCid)
        };

        function unique(arr) {
            arr.sort();
            var re = [arr[0]];
            for (var i = 1; i < arr.length; i++) {
                if (arr[i] !== re[re.length - 1]) {
                    re.push(arr[i]);
                }
            }
            return re;
        }

        $scope.showMoreFilter = function (e) {
            if (e == 1) {
                $scope.accountFlag = !$scope.accountFlag;

            } else {
                $scope.levelFlag = !$scope.levelFlag;
            }
        };
        //日期控件 事件ngRepeatFinished作用是延迟加载
        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            var sodateStart = new common.soDate(); // 声明一个新的日期控件
            sodateStart.init({//初始化控件
                $id: 'startTime',//input的id，记得给input加上so-date指令
                formart: 'yyyy/MM/dd HH:mm:ss'// 'yyyy/MM/dd HH:mm:ss'如果只要日期写'yyyy/MM/dd'
            }, function (res) {
                $scope.selectParam.startTime = res;
            });
            var sodateEnd = new common.soDate();// 声明一个新的日期控件
            sodateEnd.init({//初始化控件
                $id: 'endTime',//input的id，记得给input加上so-date指令
                formart: 'yyyy/MM/dd HH:mm:ss'// 'yyyy/MM/dd HH:mm:ss'如果只要日期写'yyyy/MM/dd'
            }, function (res) {
                $scope.selectParam.endTime = res;
            });
        });
        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            var sodateStart = new common.soDate(); // 声明一个新的日期控件
            sodateStart.init({//初始化控件
                $id: 'startTime2',//input的id，记得给input加上so-date指令
                formart: 'yyyy/MM/dd HH:mm:ss'// 'yyyy/MM/dd HH:mm:ss'如果只要日期写'yyyy/MM/dd'
            }, function (res) {
                $scope.selectParam.startTime = res;
            });
            var sodateEnd = new common.soDate();// 声明一个新的日期控件
            sodateEnd.init({//初始化控件
                $id: 'endTime2',//input的id，记得给input加上so-date指令
                formart: 'yyyy/MM/dd HH:mm:ss'// 'yyyy/MM/dd HH:mm:ss'如果只要日期写'yyyy/MM/dd'
            }, function (res) {
                $scope.selectParam.endTime = res;
            });
        });

        function open(page, size) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size
            });
            modalInstance.result.then(function (result) {
                $scope.onSearch1();
                $scope.onSearch2();
            }, function (reason) {
                $scope.onSearch1();
                $scope.onSearch2();
            });
        }

        $scope.openEdit1 = function () {
            if ($scope.cid.length == 0) {
                custNotify.warning('操作提示', '请选择会员！');
                return false
            }
            todoService.set({
                cid: $scope.cid
            });
            open('app/pages/account/MembersReturnLevels/MembersReturnLevelsEdit.html', 'md');
        };
        $scope.openEdit2 = function () {
            if ($scope.levelCid.length == 0) {
                custNotify.warning('操作提示', '请选择会员！');
                return false
            }
            todoService.set({
                cid: $scope.levelCid
            });
            open('app/pages/account/MembersReturnLevels/MembersReturnLevelsEdit.html', 'md');
        };
    }
})();

