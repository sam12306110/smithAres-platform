/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('rapidDetection', rapidDetection);

    /** @ngInject */
    function rapidDetection($scope, $rootScope, httpFactory, lotteryConst, custNotify, $uibModal, $cookieStore, todoService) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        var url = lotteryConst.uaaPath + '/apis/plat/data';
        var url2 = lotteryConst.payConfigPath + '/member';
        var url3 = lotteryConst.uaaPath + '/apis/plat/member';
        var url4 = lotteryConst.payConfigPath + '/bank';
        var url5 = lotteryConst.uaaPath + '/apis/plat/data/member';
        var headers={
            "Content-Type":"application/json"
        };

        $scope.main = null;
        $scope.agentData=null;

        $scope.queryParam = {
            appid: null,
            username: ''
        };
        $scope. selectParam={
            typesSelected:{id:1,value:"会员"},
            typesName:[{id:1,value:"会员"},{id:2,value:"代理"}]
        };
        $scope.stutesArr = {agentName:0,bank:0,bankNo:0,phone:0,email: 0, bankCard: 0, bankName: 0, bankAddress: 0, qq: 0, wechat: 0};
        $scope.stutesEdit = function (e) {
            $scope.stutesArr[e] = 1;
        }
        $scope.stutesSave = function (e, type) {
            $scope.stutesArr[e] = 0;
            if($scope. selectParam.typesSelected.id==1){
                if (type == 0) {
                    var ifqqstr = '&qq=' + $scope.main.qq;
                    var ifemailstr = '&email=' + $scope.main.email;
                    var ifwechatstr = '&wechat=' + $scope.main.wechat;
                    if ($scope.main.qq == '' || $scope.main.qq == null || $scope.main.qq == undefined) {
                        ifqqstr = ''
                    }
                    if ($scope.main.email == '' || $scope.main.email == null || $scope.main.email == undefined) {
                        ifemailstr = ''
                    }
                    if ($scope.main.wechat == '' || $scope.main.wechat == null || $scope.main.wechat == undefined) {
                        ifwechatstr = ''
                    }
                    httpFactory.getList(lotteryConst.uaaPath + '/api/plat/data/member/chgInfo?memberId=' + $scope.main.memberId + ifemailstr + ifwechatstr + ifqqstr, 'POST', null, null).then(function (data) {
                        if (data.err === 'SUCCESS') {
                            custNotify.success('修改成功', '提示:');
                        } else {
                            custNotify.error(data.msg, '提示:');
                        }
                        $scope.onSearch();
                    }, function (data) {
                        custNotify.error(lotteryConst.msgEdit.fail, '提示:');
                    });
                } else {
                    // /apis/plat/bank/update
                    var data = {
                        bankCard: $scope.main.bankCard,
                        //bankName: $scope.main.bankName,
                        memberId: $scope.main.memberId,
                        bankAddress: $scope.main.bankAddress
                    };
                    if($scope.selectParam.bankNameSelect){
                        data.bankName=$scope.selectParam.bankNameSelect.bankName;
                        $scope.main.bankName=$scope.selectParam.bankNameSelect.bankName;
                    }
                    // /arespayment/apis/plat/bank/update
                    httpFactory.getList(url4 + '/update?memberId=' + $scope.main.memberId + '&bankName=' + $scope.main.bankName + '&bankCard=' + $scope.main.bankCard, 'PUT', null, data).then(function (data) {
                        if (data.msg === 'SUCCESS') {
                            custNotify.success('修改成功', '提示:');
                        }
                        $scope.onSearch();
                    }, function (data) {
                        custNotify.error(lotteryConst.msgEdit.fail, '提示:');
                    });
                }
            }else {
                data={
                  cid:$scope.agentData.agentId,
                  agentName:$scope.agentData.agentName,
                  bank:$scope.agentData.bank,
                  bankNo:$scope.agentData.bankNo,
                  email:$scope.agentData.email,
                  phone:$scope.agentData.phone,
                  qq:$scope.agentData.qq,
                  wechat:$scope.agentData.wechat
                };
               /* console.log($scope.selectParam.bankNameSelect.bankName
                )*/
                if($scope.selectParam.bankNameSelect){
                    data.bankName=$scope.selectParam.bankNameSelect.bankName
                }
                //console.log($scope.agentData.agentName);
                httpFactory.getList(lotteryConst.aresAccount + '/agent/chgInfo', 'POST', headers,data).then(function (data) {
                    if (data.msg === 'SUCCESS') {
                        custNotify.success('修改成功', '提示:');
                    }
                    $scope.onSearch();
                }, function (data) {
                    custNotify.error(lotteryConst.msgEdit.fail, '提示:');
                });
            }


        };
        /**
         * 状态修改
         * @param id
         * @param status
         */
        $scope.onStatus = function (id, status) {
            var status = status === 0 ? 1 : 0;
            httpFactory.getList(url5 + '/statusChange/' + id + '/' + status, 'GET', null, null).then(function (data) {
                $scope.main.status = status
                custNotify.success(lotteryConst.msgEdit.success, '提示:');
                $scope.onSearch();
            }, function (data) {
                custNotify.error(lotteryConst.msgSelect.fail, '提示:');
            });
        };
        //获取银行列表
        httpFactory.getList(lotteryConst.payConfigPath + '/income/banks', 'GET', null, null).then(function (data) {
            //console.log(data);
            $scope.selectParam.banks = data.data;
            //custNotify.success('操作提示', '修改成功！');

        }, function (data) {
            custNotify.error('系统提示', '服务器出现未知错误！');
        });

        /**
         * 条件搜索
         */

        $scope.onSearch = function (e) {
            $scope.main = {};
            $scope.mainFlag =false;
            $scope.agentData = {};
            $scope.agentDataFlag =false;
            if ($scope.queryParam.username === '' || $scope.queryParam.username === null) {
                $scope.main = null;
                $scope.loginNum = '';
                custNotify.error(lotteryConst.msgSelect.nullSeq, '提示:');
                return false
            };
            //var appid = $cookieStore.get('appid');

            if($scope. selectParam.typesSelected.id==1){
                httpFactory.getList(url + '/member/info', 'GET', null, $scope.queryParam).then(function (data) {
                    if (data.err != 'SUCCESS') {
                        $scope.main = null;
                        $scope.mainFlag =false;
                        custNotify.error(lotteryConst.msgSelect.fail, '提示:');
                        return
                    }
                    var main = data.data;
                    $scope.loginNum = main.login;
                    $scope.mainFlag =true;
                    //console.log(main.login)
                    httpFactory.getList(url2 + '/bank/view', 'GET', null, {memberId: main.memberId}).then(function (data) {
                        if (data.err != 'SUCCESS') {
                            custNotify.error(lotteryConst.msgSelect.fail, '提示:');
                            return
                        }
                        $scope.main = data.data;
                        $scope.main.email = main.email;
                        $scope.main.createTime = main.createTime;
                        $scope.main.registIp = main.registIp;
                        $scope.main.status = main.status;
                        $scope.main.memberId = main.memberId;
                        $scope.main.qq = main.qq;
                        $scope.main.wechat = main.wechat;
                        $scope.main.accessDiscount = main.accessDiscount;
                        $scope.main.memberLevel = main.memberLevel;
                        $scope.main.rebateProgram = main.rebateProgram;
                    }, function (data) {
                        $scope.main = null;
                        $scope.mainFlag =false;
                        custNotify.error(lotteryConst.msgSelect.fail, '提示:');
                    });
                }, function (data) {
                    $scope.main = null;
                    $scope.mainFlag =false;
                    custNotify.error(lotteryConst.msgSelect.fail, '提示:');
                });
            }else {
                httpFactory.getList(lotteryConst.aresAccount + '/agent/info', 'GET', null, $scope.queryParam).then(function (data) {
                    if (data.err != 'SUCCESS') {
                        custNotify.error(lotteryConst.msgSelect.fail, '提示:');
                        return false
                    }
                    //console.log(data.data)
                    if(data.data){
                        $scope.agentData=data.data
                    }
                    $scope.agentDataFlag =true;
                }, function (data) {
                    $scope.agentDataFlag =false;
                    $scope.agentData =null;
                    custNotify.error(lotteryConst.msgSelect.fail, '提示:');
                });
            }

        };


        function open(page, size) {
            var modalInstance = $uibModal.open({animation: true, templateUrl: page, size: size});
            modalInstance.result.then(function (result) {
                $scope.onSearch();
            }, function (reason) {
                $scope.onSearch();
            })
        }

        $scope.openEdit = function (e,main,types) {
            if (typeof($scope.main) === 'undefined') {
                custNotify.error('必须先查询出用户信息', '提示:');
            }
            /*todoService.set({type: e, memberId: $scope.main.memberId});*/
            todoService.set({num: e, main: main,types:types});
            open('app/pages/account/rapidDetection/rapidDetectionPop.html', 'mg');
        };
        $scope.openDownLine = function () {
            todoService.set({item: $scope.main});
            open('app/pages/account/rapidDetection/downLine.html', 'sm');
        };
        $scope.openEditDomain=function (data) {
            todoService.set({data: data});
            open('app/pages/account/rapidDetection/editDomain.html', 'lg');
        };

        $scope.openAgentConfig = function (data) {
            todoService.set({data: data});
            open('app/pages/account/rapidDetection/agentConfig.html', 'lg');
        };
        //强制下线
        $scope.offLine = function (username) {
            var data = {
                username: username
            };
            //console.log(url2+ '/offline')
            httpFactory.getList(url3 + '/offline', 'GET', null, data).then(function (data) {
                // console.log(data);
                if (data.err = 'ERR_INVALID_OPERATE') {
                    custNotify.warning(data.msg, '提示');
                } else {
                    custNotify.success('操作提示', '修改成功！');
                }
                // $scope.onSearch();
            }, function (data) {
                custNotify.error('系统提示', '服务器出现未知错误！');
            });
        };

        var username = todoService.get().name;
         var types=todoService.get().types;
        if (username) {
            $scope.queryParam.username = username;
            if(types=="member"){
                $scope. selectParam.typesSelected={id:1,value:"会员"}
            }
            if(types=="agent"){
                $scope. selectParam.typesSelected={id:2,value:"代理"}
            }
            $scope.onSearch()
        }
        
        $scope.openEditLevel= function (memberId,item) {
            todoService.set({
                memberId: memberId,
                item: item
            });
            open('app/pages/account/rapidDetection/editLevel.html', 'sm');
        }
    }
})();

