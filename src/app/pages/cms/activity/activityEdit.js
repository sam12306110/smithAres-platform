/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('activityEdit', activityEdit);

    /** @ngInject */
    function activityEdit($scope, httpFactory, lotteryConst, custNotify, todoService, common, $filter) {
        var url = lotteryConst.aresCmsPath + '/activity';
        //UE配置
        $scope.config = {}
        $scope.selectParam = {}

        //日期控件 事件ngRepeatFinished作用是延迟加载
        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            var sodateStart = new common.soDate(); // 声明一个新的日期控件
            sodateStart.init({ //初始化控件
                $id: 'startTime', //input的id，记得给input加上so-date指令
                formart: 'yyyy/MM/dd HH:mm:ss' // 'yyyy/MM/dd HH:mm:ss'如果只要日期写'yyyy/MM/dd'
            }, function (res) {
                $scope.selectParam.startTime = res;
            });
            var sodateEnd = new common.soDate(); // 声明一个新的日期控件
            sodateEnd.init({ //初始化控件
                $id: 'endTime', //input的id，记得给input加上so-date指令
                formart: 'yyyy/MM/dd HH:mm:ss' // 'yyyy/MM/dd HH:mm:ss'如果只要日期写'yyyy/MM/dd'
            }, function (res) {
                $scope.selectParam.endTime = res;
            });
        });


        $scope.edit = todoService.get().edit;
        if (todoService.get().item) {
            $scope.entity = todoService.get().item;
            window.editorContent = $scope.entity.content;
            $scope.selectParam.startTime = $filter('date')($scope.entity.beginTime, 'yyyy/MM/dd HH:mm:ss');
            $scope.selectParam.endTime = $filter('date')($scope.entity.endTime, 'yyyy/MM/dd HH:mm:ss');
            $scope.titleName = "修改优惠活动";
        } else {
            $scope.titleName = "新增优惠活动";
        }
        common.initUpImg({
            $id: 'imgFile',
            upload: lotteryConst.imgUrl + '/photo/upload',
            width: 680,//限制图片宽度
            height: 127,//限制图片高度
            maxSize: 50//限制文件大小，单位K
        }, function (res) {
            if (res.code === 0) {
                $scope.entity.titlePic = res.picid;
                custNotify.success('操作提示', '图片上传成功！');
            } else {
                custNotify.error('操作提示', '图片上传失败！');
            }
        })
        $scope.onSave = function () {
            console.log($scope.selectParam.startTime)
            if ($scope.selectParam.startTime) {
                $scope.entity.beginTime = new Date($scope.selectParam.startTime).getTime();
            }
            if ($scope.selectParam.endTime ) {
                $scope.entity.endTime = new Date($scope.selectParam.endTime).getTime();
            }
            if ($scope.entity.weight > 100 || $scope.entityweight <= 0) {
                custNotify.warning('提示', '权重只能是0~100之间的整数！');
                return
            }
            if ($scope.entity.beginTime >= $scope.entity.endTime) {
                custNotify.warning('提示', '结束时间必须大于开始时间');
                return
            }
            if ($scope.entity.titlePic == null || $scope.entity.titlePic == '') {
                custNotify.warning('提示', '必须上传一张图片');
                return
            }
            httpFactory.getList(url + '/save', 'POST', null, $scope.entity).then(function (result) {
                custNotify.success('操作提示', '新增成功！');
                $scope.$dismiss();
            }, function (data) {
                custNotify.error('操作提示', '新增失败！');
            });
        };

        $scope.removePicture = function () {
            $scope.picture = $filter('appImage')('theme/no-img.jpg');
            $scope.noPicture = true;
        };

        $scope.uploadPicture = function () {
            var fileInput = document.getElementById('uploadFile');
            fileInput.click();
        };

    }

})();

