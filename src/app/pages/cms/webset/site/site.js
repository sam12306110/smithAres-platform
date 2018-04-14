/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('site', site);

    /** @ngInject */
    function site($scope, httpFactory, lotteryConst, common, custNotify) {
        var url = lotteryConst.aresCmsPath + '/site';

        function onSearch() {
            httpFactory.getList(url + '/view', 'GET', null, $scope.queryParam).then(function (result) {
                $scope.entity = result.data;
                if ($scope.entity == null) {
                    $scope.entity = {h5Name: '', iconUrl: '', logoUrl: '', h5SiteUrl: ''}
                }
                common.initUpImg({
                    $id: 'iconImg',
                    upload: lotteryConst.imgUrl + '/photo/upload'
                }, function (res) {
                    if (res.code === 0) {
                        $scope.entity['iconUrl'] = res.picid;
                        custNotify.success('操作提示', '图片上传成功！');
                    } else {
                        custNotify.error('操作提示', '图片上传失败！');
                    }
                });
                common.initUpImg({
                    $id: 'logoImg',
                    upload: lotteryConst.imgUrl + '/photo/upload'
                }, function (res) {
                    if (res.code === 0) {
                        $scope.entity['logoUrl'] = res.picid;
                        custNotify.success('操作提示', '图片上传成功！');
                    } else {
                        custNotify.error('操作提示', '图片上传失败！');
                    }
                })
                // }
            }, function (data) {

            });
        }
        onSearch();
        $scope.onSave = function () {
            httpFactory.getList(url + '/save', 'POST', null, $scope.entity).then(function (result) {
                custNotify.success('操作提示', '新增成功！');
            }, function (data) {
                custNotify.error('操作提示', '新增失败！');
            });
        };
    }
})();



