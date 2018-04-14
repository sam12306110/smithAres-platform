/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('platSideEditCtrl', platSideEditCtrl);

    /** @ngInject */
    function platSideEditCtrl($scope, $rootScope, httpFactory, lotteryConst, custNotify, $filter) {
        $scope.selectParam = {
            banks: null,
            banksSelected: null,
            settleCashType: lotteryConst.settleType,
            settleCashTypeSelected: null,

            settleCashPlanIds: null,
            settleCreditPlanIds: null,
            lotteries: null
        };



        $scope.entity = {
            oddsGroup: []
        };

        var lotteries = $filter('filter')(lotteryConst.lottery, {sideType: 2});

        /**
         * 加载赔率列表
         */
        var lotteryIds = "";
        lotteries.forEach(function (item, index, array) {
            lotteryIds += item.id + ",";
            item['ngModel'] = "";
        });
        lotteryIds = lotteryIds.substr(0, lotteryIds.length - 1);
        $.when(
            //加载赔率
            $.ajax({
                url: lotteryConst.aresPath + '/odds/getOddsMap',
                type: 'GET',
                data: {lotteryIds: lotteryIds}
            }),
            //现金方案列表
            $.ajax({
                url: lotteryConst.aresPath + '/settlePlan/getListMap',
                type: 'GET',
                data: {settleType: 1, sideType: 2}
            }),
            //银行列表
            $.ajax({
                url : lotteryConst.payConfigPath +'/income/banks',
                type: 'GET'
            }),
            //信用结算方案列表
            $.ajax({
                url: lotteryConst.aresPath + '/settlePlan/getListMap',
                type: 'GET',
                data: {settleType: 2, sideType: 2}
            }))
            .done(function (data1, data2, data4, data3) {
                //赔率处理
                console.log(data1[0]);
                data1[0].data.forEach(function (oddsDataItem, index, array) {
                    lotteries.forEach(function (lotteryItem, index, array) {
                        if (oddsDataItem.lotteryId == lotteryItem.id) {
                            lotteryItem['odds'] = oddsDataItem.list;
                        }
                    });

                });
                $scope.selectParam.lotteries = lotteries;

                $scope.selectParam.settleCashPlanIds = data2[0].data;

                $scope.selectParam.banks = data4[0].data;

                $scope.selectParam.settleCreditPlanIds = data3[0].data;

                initPlat();
            });

        /**
         * 修改 加载界面数据
         */
        function initPlat() {
            if ($rootScope.edit == 'edit') {
                httpFactory.getList(lotteryConst.aresAccount + '/platinfo/get?platInfoId=' + $rootScope.platInfoId, 'GET', null, null).then(function (data) {
                    $scope.entity.platAccount = data.data.account;
                    $scope.platAccountReadonly = true;
                    $scope.entity.platName = data.data.platName;
                    $scope.entity.telephone = data.data.phone;
                    $scope.entity.email = data.data.email;
                    $scope.entity.realName = data.data.realName;
                    $scope.entity.depositBank = data.data.bankAddress;
                    $scope.entity.bankNo = data.data.bankNo;
                    $scope.entity.settleType = data.data.settleType;

                    //结算方案
                    if (data.data.settleType == 1) {
                        $scope.selectParam.settleCashPlanIds.forEach(function (item, index, array) {
                            if (item.id == data.data.settlePlanId) {
                                $scope.selectParam.settleCashPlanIdSelected = item;
                            }
                        });
                    } else if (data.data.settleType == 2) {
                        $scope.selectParam.settleCreditPlanIds.forEach(function (item, index, array) {
                            if (item.id == data.data.settlePlanId) {
                                $scope.selectParam.settleCreditPlanIdSelected = item;
                            }
                        });
                    }


                    //赔率组
                    if (data.data.oddsGroup) {
                        angular.forEach($scope.selectParam.lotteries, function (item, index, array) {
                            angular.forEach(data.data.oddsGroup, function (p_odds, index, array) {
                                if (p_odds.lotteryId == item.id) {
                                    item.odds.forEach(function (_odds, index, array) {
                                        if (p_odds.payoffGroup == _odds.payoffGroup) {
                                            item.ngModel = _odds;
                                        }
                                    });
                                }
                            });
                        });
                    }
                    //银行
                    $scope.selectParam.banks.forEach(function (item, index, array) {
                        if (item.bankCode == data.data.bankType) {
                            $scope.selectParam.banksSelected = item;
                        }
                    });

                });
            } else {
                $scope.entity.platAccount = null;
                $scope.entity.platName = null;
                $scope.entity.telephone = null;
                $scope.entity.email = null;
                $scope.entity.realName = null;
                $scope.selectParam.banksSelected = null;
                $scope.entity.depositBank = null;
                $scope.entity.bankNo = null;
                $scope.entity.settleType = null;
                $scope.selectParam.settleCashPlanIdSelected = null;
                $scope.selectParam.settleCreditPlanIdSelected = null;
                $scope.selectParam.oddsSelected = null;
            }
        }


        $scope.onSave = function () {
            if ($rootScope.edit == 'edit') {
                update();
            } else {
                save();
            }
        };

        /**
         * 保存
         */
        function save() {
            var pOdds = [];
            $scope.selectParam.lotteries.forEach(function (item, index, array) {
                if (item.ngModel != '' && item.ngModel) {
                    pOdds.push({lotteryId: item.id, oddsId: item.ngModel.id, payoffGroup: item.ngModel.payoffGroup});
                }
            });
            if ($scope.selectParam.banksSelected != null) {
                $scope.entity.bank = $scope.selectParam.banksSelected.bankCode;
            }
            if (pOdds) {
                $scope.entity.oddsGroup = JSON.stringify(pOdds);
            }
            if ($scope.entity.settleType == 1) {
                $scope.entity.settlePlanId = $scope.selectParam.settleCashPlanIdSelected.id;
                $scope.entity.settlePlanName = $scope.selectParam.settleCashPlanIdSelected.value;
            } else if ($scope.entity.settleType == 2) {
                $scope.entity.settlePlanId = $scope.selectParam.settleCreditPlanIdSelected.id;
                $scope.entity.settlePlanName = $scope.selectParam.settleCreditPlanIdSelected.value;

            }
            $scope.entity.appid = $scope.entity.platAccount;
            $scope.entity.sideType = 2;

            var url = lotteryConst.aresAccount + '/platinfo/add?' + assemReqParams($scope.entity);
            httpFactory.getList(url, 'POST', null, null).then(function (data) {
                custNotify.success(lotteryConst.msgAdd.success, '提示:');
                $scope.$dismiss();
                $rootScope.onSearch();
            }, function(err){
                custNotify.error(lotteryConst.msgSelect.fail,  '提示:');
            });
        }

        /**
         * 修改
         */
        function update() {
            var pOdds = [];
            $scope.selectParam.lotteries.forEach(function (item, index, array) {
                if (item.ngModel != '' && item.ngModel) {
                    pOdds.push({lotteryId: item.id, oddsId: item.ngModel.id, payoffGroup: item.ngModel.payoffGroup});
                }
            });
            if (pOdds) {
                $scope.entity.oddsGroup = pOdds;
            }

            if ($scope.selectParam.banksSelected != null) {
                $scope.entity.bank = $scope.selectParam.banksSelected.bankCode;
            }
            if ($scope.entity.oddsGroup) {
                $scope.entity.oddsGroup = JSON.stringify($scope.entity.oddsGroup);
            }
            if ($scope.entity.settleType == '1') {
                $scope.entity.settlePlanId = $scope.selectParam.settleCashPlanIdSelected.id;
                $scope.entity.settlePlanName = $scope.selectParam.settleCashPlanIdSelected.value;
            } else if ($scope.entity.settleType == '2') {
                $scope.entity.settlePlanId = $scope.selectParam.settleCreditPlanIdSelected.id;
                $scope.entity.settlePlanName = $scope.selectParam.settleCreditPlanIdSelected.value;
            }
            $scope.entity.platInfoId = $rootScope.platInfoId;
            $scope.entity.sideType = 2;

            var url = lotteryConst.aresAccount + '/platinfo/update?' + assemReqParams($scope.entity);
            httpFactory.getList(url, 'POST', null, null).then(function (data) {
                custNotify.success(lotteryConst.msgEdit.success, '提示:');
                $scope.$dismiss();
                $rootScope.onSearch();
            }, function(err){
                custNotify.error(lotteryConst.msgSelect.fail,  '提示:');
            });
        }

        /**
         * 检查请求数据是否合法
         */
        function checkSaveParams() {

        }

        function assemReqParams(params) {
            var paramsConcat = "";
            if(params.platAccount) {
                paramsConcat += "platAccount="+params.platAccount;
            }
            if(params.platName) {
                paramsConcat += "&platName="+params.platName;
            }
            if(params.telephone) {
                paramsConcat += "&telephone="+params.telephone;
            }
            if(params.email) {
                paramsConcat += "&email="+params.email;
            }
            if(params.realName) {
                paramsConcat += "&realName="+params.realName;
            }
            if(params.depositBank) {
                paramsConcat += "&depositBank="+params.depositBank;
            }
            if(params.bankNo) {
                paramsConcat += "&bankNo="+params.bankNo;
            }
            if(params.settleType) {
                paramsConcat += "&settleType="+params.settleType;
            }
            if(params.bank) {
                paramsConcat += "&bank="+params.bank;
            }
            if(params.settlePlanId) {
                paramsConcat += "&settlePlanId="+params.settlePlanId;
            }
            if(params.settlePlanName) {
                paramsConcat += "&settlePlanName="+params.settlePlanName;
            }
            if(params.platInfoId) {
                paramsConcat += "&platInfoId="+params.platInfoId;
            }
            if(params.sideType) {
                paramsConcat += "&sideType="+params.sideType;
            }
            if(params.oddsGroup) {
                paramsConcat += "&oddsGroup=" + params.oddsGroup;
            }
            if(params.appid) {
                paramsConcat += "&appid=" + params.appid;
            }
            return paramsConcat;
        }
    }
})();

