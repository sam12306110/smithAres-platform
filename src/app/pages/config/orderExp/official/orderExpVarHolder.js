/**
 * @author Ivan
 * created on 2017-9-18
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').service('orderExpVarHolder', orderExpVarHolder);

    /** @ngInject */
    function orderExpVarHolder(lotteryConst) {

        this.status = [
            {id: null, value: '全部'},
            {id: 0, value: '启用中'},
            {id: 1, value: '已停用'}
        ];
        //
        this.basePath = lotteryConst.riskManageBasePath;
        this.orderExpPath = "/risk/orderExp";

        this.getOrderExpResourcePath = function () {
            return this.basePath + this.orderExpPath;
        }
    }
})();
