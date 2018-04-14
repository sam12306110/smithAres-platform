/**
 * @author Ivan
 * created on 2017-9-18
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').service('chaseOrderOfficialConfigVarHolder', chaseOrderOfficialConfigVarHolder);

    /** @ngInject */
    function chaseOrderOfficialConfigVarHolder(lotteryConst, httpFactory, custNotify, common) {

        //
        this.invalidInt = -1;
        //
        this.basePath = lotteryConst.hermes;

        //

        this.chaseOrderManageUrl = "/apis/order/management";
        this.getChaseOrderManageHeadURL = function () {
            return this.basePath + this.chaseOrderManageUrl;
        }

        //今日追号记录url
        this.getTodayChaseOrderListURL = function () {
            // return this.getChaseOrderManageHeadURL() + "/today/chaseOrderList"
            return lotteryConst.hemes + '/apis/order/management/today/chaseOrderList';
        }

        //今日追号记录导出
        this.getTodayChaseOrderExportURL = function () {
            //TODO
            throw "还没来得及做";
        }


        //历史追号记录url
        this.getHistoryChaseOrderListURL = function () {
            return this.getChaseOrderManageHeadURL() + "/history/chaseOrderList"
        }


        //历史追号记录导出url
        this.getHistoryChaseOrderExportURL = function () {
            //TODO
            throw "还没来得及做";
        }


        //追号订单详情
        this.getChaseOrderDetailURL = function () {
            return this.getChaseOrderManageHeadURL() + "/chaseOrderDetail"
        }

        //t
        this.actions = {
            clickChaseOrderTodayListCtrl: "clickChaseOrderTodayListCtrl",
            clickChaseOrderOfficialHistoryListCtrl: "clickChaseOrderOfficialHistoryListCtrl",

            //httpEvent ->用来控制下层模块完成了http请求
            lotteryLoadEvent: "lotteryLoadEvent",
            platLoadEvent: "platLoadEvent",
            sourceTypeLoadEvent: "sourceTypeLoadEvent",
            statusLoadEvent: "statusLoadEvent"
        }


        this.openChaseDetail = function (orderId) {
            this.orderId = orderId;
            common.open('app/pages/plan/chaseOrder/official/chaseOrderDetail.html', 'lg');
        }
    }
})();
