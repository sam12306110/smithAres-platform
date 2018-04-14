(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .directive('ngFileSelect', ngFileSelect);

    /** @ngInject */
    function ngFileSelect() {
        return {
            link: function ($scope, lotteryConst, el) {
                //图片上传地址
                var upload = lotteryConst.imgUrl
                el.bind('change', function (e) {
                    $scope.file = (e.srcElement || e.target).files[0];
                    $scope.getFile($scope.file, function (res) {
                        if (res.code === 0) {
                            $('#' + e.currentTarget.id).parent().find('.userpic-wrapper').find('img').attr('src', res.url)
                        }
                    });
                })
                $scope.getFile = function (file, fun) {
                    var imageType = /image.*/;
                    if (file.type.match(imageType)) {
                        var reader = new FileReader();
                        reader.onload = function () {
                            // $('#img-' + id).attr('src', reader.result)
                            var formData = new FormData();
                            formData.append("pic", file);
                            var oReq = new XMLHttpRequest();
                            oReq.responseType = "json";
                            oReq.open("POST", upload, true);
                            oReq.onload = function (oEvent) {
                                if (oReq.status == 200) {
                                    var picid = oReq.response.picid
                                    fun({
                                        code: 0,
                                        url: upload + '/photo/pic/' + picid + '/0',
                                        picid: picid
                                    })
                                } else {
                                    $('#' + id).html('<div class="so-upImg"><img class="upImg-img" id="img-' + id + '"><a class="upImg-a" id="but-' + id + '">图片上传</a><input class="upImg-file" type="file" id="file-' + id + '"></div>')
                                    fun({code: oReq.status, err: oReq.response})
                                }
                            };
                            oReq.send(formData);
                        };
                        reader.readAsDataURL(file);
                    } else {
                        $('#' + id).html('<div class="so-upImg"><img class="upImg-img" id="img-' + id + '"><a class="upImg-a" id="but-' + id + '">图片上传</a><input class="upImg-file" type="file" id="file-' + id + '"></div>')
                        initChange()
                        fun({code: oReq.status, err: '获取文件失败'})
                    }
                }
            }
        }
    }

})();
