/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('soundConfig', soundConfig);

    /** @ngInject */
    function soundConfig($scope, httpFactory, lotteryConst, common, custNotify, $uibModal, todoService, $filter) {
        var url = lotteryConst.aresPathPlat + '/soundConfig';
        var fileUrl = lotteryConst.imgUrl + '/photo/upload_file'
        $scope.pageSize = 100;
        $scope.queryParam = {
            page: 1,//当前页*分页必须
            rows: $scope.pageSize//分页行数*分页必须
        };
        /**
         * 条件搜索
         */
        $scope.onSearch = function (e) {
            httpFactory.getList(url + '/list', 'GET', null, $scope.queryParam).then(function (result) {
                $scope.entity = result.data.rows;
            }, function (data) {

            });
        };
        $scope.onSearch();
        /**
         * 状态修改
         * @param id
         * @param status
         */
        $scope.onStatus = function (item) {
            item.status = item.status === 0 ? 1 : 0;
            var entity = {
                cid: item.cid,
                status: item.status
            }
            httpFactory.getList(url + '/save', 'POST', null, entity).then(function (result) {
                custNotify.success('操作提示', '修改成功！');
                $scope.onSearch();
            }, function (data) {
                custNotify.error('系统提示', '服务器出现未知错误！');
            });
        };
        $scope.onSave = function (item) {
            httpFactory.getList(url + '/save', 'POST', null, item).then(function (result) {
                custNotify.success('操作提示', '修改成功！');
                $scope.onSearch();
            }, function (data) {
                custNotify.error('系统提示', '服务器出现未知错误！');
            });
        };
        $scope.uploadFile = function (flag, item) {
            var fileInput = document.getElementById('file' + flag);
            fileInput.click()
            $(fileInput).on('change', function () {
                custNotify.warning('温馨提示', '上传中，请稍后...');
                var file = this.files[0];
                var imageType = /audio.*/;
                if (file.type.match(imageType)) {
                    var reader = new FileReader();
                    reader.onload = function () {
                        var formData = new FormData();
                        formData.append("file", file);
                        var oReq = new XMLHttpRequest();
                        oReq.responseType = "json";
                        oReq.open("POST", fileUrl, true);
                        oReq.onload = function (oEvent) {
                            if (oReq.status == 200) {
                                var fileid = oReq.response.fileid
                                item.itemUrl = fileid;
                                $scope.onSave(item);
                            } else {
                                //失败返回
                            }
                        };
                        oReq.send(formData);
                    };
                    reader.readAsDataURL(file);
                }
            })

        };

    }
})();



