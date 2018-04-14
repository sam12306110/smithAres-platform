/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('reforwardOfficial', reforwardOfficial);

    /** @ngInject */
    function reforwardOfficial($scope, todoService, httpFactory, lotteryConst, custNotify, common, $uibModal) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        var url = lotteryConst.aresPath + '/reforward';

        function initPage() {
            $scope.selectParam = {
                lottery: [{id: null, value: '全部', sideType: 1}].concat(lotteryConst.lottery),
                status: lotteryConst.status,
                lotterySelected: {id: null, value: '全部', sideType: 1},
                statusSelected: null,
                playSet: [],
                playSetSelected: {cid: null, name: '全部玩法群'},
                playGroup: [],
                playGroupSelected: {cid: null, name: '全部玩法组'},
                plays: [],
                playsSelected: {cid: null, name: '全部玩法'}
            };

            $scope.queryParam = {
                page: 1,//当前页*分页必须
                rows: $scope.pageSize,//分页行数*分页必须
                lotteryId: null,
                status: null,
                modifyUsername: null,
                sideType: 1
            };


        }

        initPage();
        /**
         * 条件搜索
         */
        $scope.onSearch = function (e) {
            if (!e) {
                $scope.queryParam.page = 1;
            }
            if ($scope.selectParam.statusSelected) {
                $scope.queryParam.status = $scope.selectParam.statusSelected.id;
            }
            if ($scope.selectParam.lotterySelected) {
                $scope.queryParam.lotteryId = $scope.selectParam.lotterySelected.id;
            }
            httpFactory.getList(url + '/list', 'GET', null, $scope.queryParam).then(function (result) {
                $scope.entity = result.data.rows;
                /**
                 * 分页开始
                 */
                $scope.queryParam.page = result.data.currentPage;// 获取的当前页currentPage赋值给查询方法的当前页参数page
                common.soPage({
                    $id: 'page',
                    total: result.data.total,// 总条数
                    size: $scope.queryParam.rows,// 每页条数
                    nowPage: $scope.queryParam.page
                }, function (btn) {// 回调方法，返回当前页码
                    $scope.queryParam.page = btn;// 重新赋值当前页
                    $scope.onSearch(1);// 获取list的方法
                });// 分页
                /**
                 * 分页结束
                 */
            }, function (data) {

            });
        };
        $scope.onSearch();
        $scope.onReset = function () {
            initPage();
        };


        /**
         * 状态修改
         * @param id
         * @param status
         */
        $scope.onStatus = function (id, status) {
            status = status === 0 ? 1 : 0;
            httpFactory.getList(url + '/onStatus?id=' + id + '&status=' + status, 'POST', null, null).then(function (result) {
                custNotify.success(lotteryConst.msgEdit.success, '提示:');
                $scope.onSearch();
            }, function (data) {
                custNotify.error(lotteryConst.msgSelect.fail,  '提示:');
            });
        };


        function open(page, size) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size
            });
            modalInstance.result.then(function (result) {
                $scope.onSearch();
            }, function (reason) {
            });
        }

        $scope.openEdit = function (edit, item) {
            todoService.set({
                edit: edit,
                item: item
            });
            open('app/pages/config/reforward/official/reforwardOfficialEdit.html', 'md');
        };


        $scope.$watch("selectParam.lotterySelected", function (n, o) {
            if ($scope.selectParam.lotterySelected.id) {
                var lotteryId = $scope.selectParam.lotterySelected.id;
                httpFactory.getList(lotteryConst.aresPath + '/plays/PC/list', 'GET', null, {lotteryId: lotteryId}).then(function (result) {
                    if (result.data != [] && result.data != null ) {
                        $scope.selectParam.playSet = [{'cid': null, 'name': '全部玩法群'}];
                        result.data.forEach(function (rows) {
                            var temp = {'cid': null, 'name': null, 'level': null, 'parentId': null};
                            temp.cid = rows.cid;
                            temp.name = rows.name;
                            temp.level = rows.level;
                            temp.parentId = rows.parentId;
                            $scope.selectParam.playSet.push(temp);
                        });
                    } else {
                        $scope.selectParam.playSet = [{cid: null, name: '全部玩法群'}];
                        $scope.selectParam.playSetSelected = {cid: null, name: '全部玩法群'};
                        $scope.selectParam.playGroup = [{cid: null, name: '全部玩法组'}];
                        $scope.selectParam.playGroupSelected = {cid: null, name: '全部玩法组'};
                        $scope.selectParam.plays = [{cid: null, name: '全部玩法'}];
                        $scope.selectParam.playsSelected = {cid: null, name: '全部玩法'};
                    }
                }, function (data) {

                });
            } else {
                $scope.selectParam.playSet = [{cid: null, name: '全部玩法群'}];
                $scope.selectParam.playSetSelected = {cid: null, name: '全部玩法群'};
                $scope.selectParam.playGroup = [{cid: null, name: '全部玩法组'}];
                $scope.selectParam.playGroupSelected = {cid: null, name: '全部玩法组'};
                $scope.selectParam.plays = [{cid: null, name: '全部玩法'}];
                $scope.selectParam.playsSelected = {cid: null, name: '全部玩法'};
            }
        });

        $scope.$watch("selectParam.playSetSelected", function (n, o) {
            $scope.selectParam.playGroup = [{cid: null, name: '全部玩法组'}];
            $scope.selectParam.playSet.forEach(function (rows) {
                if (rows.level == 2 && rows.parentId == $scope.selectParam.playSetSelected.cid) {
                    $scope.selectParam.playGroup.push(rows);
                }
            });
        });

        $scope.$watch("selectParam.playGroupSelected", function (n, o) {
            $scope.selectParam.plays = [{cid: null, name: '全部玩法'}];
            $scope.selectParam.playSet.forEach(function (rows) {
                if (rows.level == 3 && rows.parentId == $scope.selectParam.playGroupSelected.cid) {
                    $scope.selectParam.plays.push(rows);
                }
            });
        });
    }

    angular.module('BlurAdmin.pages').controller('reforwardOfficialEdit', reforwardOfficialEdit);

    /** @ngInject */
    function reforwardOfficialEdit($scope, $rootScope, httpFactory, lotteryConst, custNotify, todoService) {
        var url = lotteryConst.aresPath + '/reforward';
        $scope.entity = null;
        $scope.payoffGroup = lotteryConst.payoffGroup;

        $scope.list = [];
        $scope.entity = {
            itemPO: [],
            sideType: 1
        };

        if (todoService.get().item) {
            // 取列表
            var item = todoService.get().item;
            httpFactory.getList(url + '/view', 'GET', null, {id: item.cid}).then(function (result) {
                $scope.entity = result.data;
            }, function (err) {
                console.log(err);
            });
        }
        if (todoService.get().edit) {
            $scope.edit = todoService.get().edit;
        }


        $scope.onSave = function () {
            console.log($scope.entity);
            debugger;
            httpFactory.getList(url + '/save', 'POST', null, $scope.entity).then(function (data) {
                custNotify.success(lotteryConst.msgEdit.success, '提示:');
                $scope.$dismiss();
            }, function (data) {
                custNotify.error('操作提示', '修改失败！');
            });
        };

    }

})();

