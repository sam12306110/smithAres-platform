/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('lotteryWeightEdit', lotteryWeightEdit);

    /** @ngInject */
    function lotteryWeightEdit($scope, httpFactory, lotteryConst, custNotify, todoService, common, $filter) {
        var url = lotteryConst.aresPathPlat + '/lotteryWeight';
        var fileUrl =lotteryConst.imgUrl + '/photo/upload';
        //日期控件 事件ngRepeatFinished作用是延迟加载

        $scope.edit = todoService.get().edit;
        $scope.entity = todoService.get().item;

        $scope.onSave = function () {
            if ($scope.entity.weight === '') {
                custNotify.success('请输入权重！', '操作提示');
                return
            }
            if ($scope.entity.weight < 0 || $scope.entity.weight >= 100 || isNaN($scope.entity.weight)) {
                custNotify.success('权重只能是0-99之间的整数！', '操作提示');
                return
            }

            httpFactory.getList(url + '/save', 'POST', null, $scope.entity).then(function (result) {
                custNotify.success('操作提示', '修改成功！');
                $scope.$dismiss();
            }, function (data) {
                custNotify.error('操作提示', '修改失败！');
            });
        };

        $scope.isDisabled = false;
        $scope.uploadFile = function () {
            var fileInput = document.getElementById('imgFile');
            fileInput.click();
            $(fileInput).on('change', function () {
                if($scope.isDisabled){
                    return false
                }

                var file = this.files[0];
                if(file==undefined){
                    return false
                }
                if(file.size>20000){
                    custNotify.error('系统提示', '上传图片大于20kB');
                    return false
                }
                var imageType = /image.*/;
                //console.log(!!file);
                custNotify.warning('温馨提示', '上传中，请稍后...');
                $scope.isDisabled = true;
                if (file.type.match(imageType)) {
                    var reader = new FileReader();
                    reader.onload = function () {
                        var formData = new FormData();
                        formData.append("pic", file);
                        var oReq = new XMLHttpRequest();
                        oReq.responseType = "json";
                        oReq.open("POST", fileUrl, true);
                        oReq.onload = function (oEvent) {
                            if (oReq.status == 200) {
                                var picid = oReq.response.picid;
                                $scope.entity.imgUrl = picid;
                                custNotify.success('上传成功！', '温馨提示：');
                                $scope.isDisabled=false;
                            } else {
                                //失败返回
                                custNotify.error('请重新上传图片！', '温馨提示：');
                                $scope.isDisabled = false;
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

