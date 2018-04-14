/**
 * @author Ivan
 * created on 2017-9-18
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').service('riskSideConfigVarHolder', riskSideConfigVarHolder);

    /** @ngInject */
    function riskSideConfigVarHolder(lotteryConst) {

        //这个数据是从后台enum变量copy过来的,和getRiskOrderStatusListURL返回的数据应该保持一致
        this.riskOrderStatus = {
            NORMAL: 0,
            LOCKED: 1,
            NOT_PASS: 2,
            PASS: 3
        }

        //
        //
        this.basePath = lotteryConst.riskManageBasePath;

        this.riskConfig = "/risk/config";
        this.getRiskConfigHeadURL = function () {
            return this.basePath + this.riskConfig;
        }

        this.getRiskOrderStatusListURL = function () {
            return this.getRiskConfigHeadURL() + "/listValidRiskOrderStatus"
        }


        //风险订单
        this.riskOrderURL = "/apis/risk/riskOrderRecord";

        this.getRiskOrderHeadURL = function () {
            return this.basePath + this.riskOrderURL;
        }
        this.listRiskOrderURL = function () {
            return this.getRiskOrderHeadURL() + "/list";
        }

        this.exportRiskOrderURL = function () {
            return this.getRiskOrderHeadURL() + "/list/export";
        }

        //现在是一个url,后续要拆分的时候，改这里就行
        this.updateRiskOrderStatusURL = function () {
            return this.getRiskOrderHeadURL() + "/updateRiskOrderStatus";
        }

        //管理后台ip限制
        this.hostileOrderURL = "/apis/risk/hostileOrderRecord";


        this.getHostileOrderHeadURL = function () {
            return this.basePath + this.hostileOrderURL;
        }

        this.listHostileRecordURL = function () {
            return this.getHostileOrderHeadURL() + "/list";
        }

        this.exportHostileOrderURL = function () {
            return this.getHostileOrderHeadURL() + "/list/export";
        }

        //t
        this.actions = {
            clickSideRiskOrderCtrl: "clicSidekRiskOrderCtrl",
            clickSideHostileOrderCtrl: "clicSidekHostileOrderCtrl",
        }
    }
})();
