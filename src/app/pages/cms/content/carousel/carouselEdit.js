/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('carouselEdit', carouselEdit);

    /** @ngInject */
    function carouselEdit($scope, httpFactory, lotteryConst, custNotify, todoService, common, $filter) {
        var url = lotteryConst.aresCmsPath + '/carousel';
        //日期控件 事件ngRepeatFinished作用是延迟加载
        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            var sodateStart = new common.soDate(); // 声明一个新的日期控件
            sodateStart.init({ //初始化控件
                $id: 'startTime', //input的id，记得给input加上so-date指令
                formart: 'yyyy/MM/dd HH:mm:ss' // 'yyyy/MM/dd HH:mm:ss'如果只要日期写'yyyy/MM/dd'
            }, function (res) {
                $scope.entity.beginTime = res;
            });
            var sodateEnd = new common.soDate(); // 声明一个新的日期控件
            sodateEnd.init({ //初始化控件
                $id: 'endTime', //input的id，记得给input加上so-date指令
                formart: 'yyyy/MM/dd HH:mm:ss' // 'yyyy/MM/dd HH:mm:ss'如果只要日期写'yyyy/MM/dd'
            }, function (res) {
                $scope.entity.endTime = res;
            });
            // $scope.initImgFile()
        });
        $scope.initImgFile = function () {
            for (var i = 0; i < $scope.entity.itemPO.length; i++) {
                common.initUpImg({
                    $id: 'imgFile' + i,
                    upload: lotteryConst.imgUrl + '/photo/upload',
                    maxSize:80
                }, function (res) {
                    if (res.code === 0) {
                        $scope.entity.itemPO[parseInt(res.id.substring(7, res.id.length))].titlePic = res.picid;
                        custNotify.success('操作提示', '图片上传成功！');
                    } else {
                        custNotify.error('操作提示', '图片上传失败！');
                    }
                })
            }
        }
        $scope.addCarousel = function () {
            if ($scope.entity.itemPO.length >= 3) {
                return
            }
            $scope.entity.itemPO.push({
                "link": "",
                "titlePic": ""
            })
            $scope.initImgFile()
        }
        $scope.deleteCarousel = function () {
            if ($scope.entity.itemPO.length <= 2) {
                return
            }
            $scope.entity.itemPO.pop()
        }
        $scope.edit = todoService.get().edit;
        if (todoService.get().item) {
            // /apis/plat/carousel/view
            httpFactory.getList(url + '/view', 'GET', null, {id: todoService.get().item.cid}).then(function (result) {
                $scope.entity = result.data;
                $scope.entity.beginTime = $filter('date')($scope.entity.beginTime, 'yyyy/MM/dd HH:mm:ss');
                $scope.entity.endTime = $filter('date')($scope.entity.endTime, 'yyyy/MM/dd HH:mm:ss');
                $scope.initImgFile()
            }, function (err) {
            });
            if ($scope.edit) {
                $scope.titleName = "修改轮播图";
            } else {
                $scope.titleName = "预览轮播图";
            }
        } else {
            $scope.entity = {
                "beginTime": '',
                "delayTime": '',
                "endTime": '',
                "itemPO": [
                    {
                        "link": "",
                        "titlePic": ""
                    }, {
                        "link": "",
                        "titlePic": ""
                    }
                ],
                "title": "",
            }
            $scope.initImgFile()
            $scope.titleName = "新增轮播图";
        }

        $scope.onSave = function () {
            if ($scope.entity.beginTime ) {
                $scope.entity.beginTime = new Date($scope.entity.beginTime).getTime();
            }
            if ($scope.entity.endTime ) {
                $scope.entity.endTime = new Date($scope.entity.endTime).getTime();
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

