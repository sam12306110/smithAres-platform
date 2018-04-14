/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('userAddCtrl', userAddCtrl);

    /** @ngInject */
    function userAddCtrl($scope, $rootScope, httpFactory, lotteryConst, custNotify) {
        var url = lotteryConst.aresAccount;
        $scope.selectParam = {
            role: null,
            roleSelected: null
        };

        httpFactory.getList(lotteryConst.aresAccount + '/role/role_map ', 'GET', null, {}).then(function (data) {
            $scope.selectParam.role = data.data;
        }, function (data) {

        });

        $scope.entity = {
            account: null,
            password: '',
            nickName: null,
            roleId: null
        };
        if ($rootScope.edit == 'edit') {
            $scope.accountReadonly = true;
            httpFactory.getList(lotteryConst.aresAccount + '/user/get?userId=' + $rootScope.userId, 'GET', null, {}).then(function (data) {
                $('#myModalLabel').html("修改账号");
                $scope.entity.account = data.data.account;
                $scope.entity.nickName = data.data.realname;
                angular.forEach($scope.selectParam.role, function (_data, index, array) {
                    if (_data.id == data.data.roleId) {
                        $scope.selectParam.roleSelected = _data;
                    }
                });
            });
        } else {
            $scope.accountReadonly = false;
            $scope.entity.account = '';
            $scope.entity.password = '';
            $scope.entity.nickName = '';
            $scope.entity.roleId = '';
        }


        $scope.onSave = function () {
            if ($rootScope.edit == 'edit') {
                update();
            } else {
                save();
            }
        };

        function update() {
            var data = {
                userId: $rootScope.userId,
                password: $scope.entity.password,
                nickName: $scope.entity.nickName,
                roleId: null
            };
            data.roleId = $scope.selectParam.roleSelected.id;
            var url = lotteryConst.aresAccount + '/user/update?' + assemReqParams(data);
            httpFactory.getList(url, 'POST', null, null).then(function (res) {
                if (res.err != 'SUCCESS') {
                    custNotify.error('操作提示' + res.cnMsg, '修改失败！');
                    return;
                }
                custNotify.success(lotteryConst.msgAdd.success, '提示:');
                $scope.$dismiss();
                $rootScope.userSearch();
            }, function (err) {
                custNotify.error('操作提示' + data, '修改失败！');
            });

        }

        function save() {
            var data = {
                account: $scope.entity.account,
                password: $scope.entity.password,
                nickName: $scope.entity.nickName,
                roleId: null
            };
            data.roleId = $scope.selectParam.roleSelected.id;

            var url = lotteryConst.aresAccount + '/user/register?' + assemReqParams(data);
            httpFactory.getList(url, 'POST', null, null).then(function (res) {
                if (res.err != 'SUCCESS') {
                    custNotify.error(res.cnMsg, '操作提示:');
                    return;
                }
                custNotify.success(lotteryConst.msgAdd.success, '提示:');
                $scope.$dismiss();
                $rootScope.userSearch();
            }, function (err) {
                custNotify.error('操作提示' + err, '新增失败！');
            });

        }

        function assemReqParams(params) {
            var paramsConcat = "";
            if (params.account) {
                paramsConcat += "account=" + params.account;
            }
            if (params.password) {
                paramsConcat += "&password=" + params.password;
            }
            if (params.nickName) {
                paramsConcat += "&nickName=" + params.nickName;
            }
            if (params.roleId) {
                paramsConcat += "&roleId=" + params.roleId;
            }
            if (params.userId) {
                paramsConcat += "&userId=" + params.userId;
            }
            return paramsConcat;
        }
    }
})();

