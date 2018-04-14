/**
 * @author Ivan
 * created on 2017-9-18
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.customize').service('common', common);

})();

/** @ngInject */
function common($uibModal, lotteryConst,custNotify) {
    this.count = null;
    var that = this;
    //参数格式
    var newData = {
        $id: '',
        total: '',
        size: '',
        nowPage: ''
    }
    this.soPage = function (data, fun) {
        //附属功能，改变td状态颜色
        setTimeout(function () {
            $('td').each(function (i, t) {
                if ($(t).html().indexOf('不通过') >= 0) {
                    // $(t).css('color', '#ff0000');
                    $(t).attr('class', 'status_red');
                }
                if ($(t).html().indexOf('已通过') >= 0) {
                    // $(t).css('color', '#00ff08');
                    $(t).attr('class', 'status_green');
                }

                if ($(t).html().indexOf('已失效') >= 0) {
                    // $(t).css('color', '#ffd904');
                    $(t).attr('class', 'status_yellow');
                }
                if ($(t).html().indexOf('已失败') >= 0) {
                    // $(t).css('color', '#ff0000');
                    $(t).attr('class', 'status_red');
                }
                if ($(t).html().indexOf('已拒绝') >= 0) {
                    // $(t).css('color', '#ff0000');
                    $(t).attr('class', 'status_red');
                }
                if ($(t).html().indexOf('已停用') >= 0) {
                    // $(t).css('color', '#ff0000');
                    $(t).attr('class', 'status_red');
                }
                if ($(t).html().indexOf('已成功') >= 0) {
                    // $(t).css('color', '#00ff08');
                    $(t).attr('class', 'status_green');
                }
                if ($(t).html().indexOf('已锁定') >= 0) {
                    // $(t).css('color', '#ffd904');
                    $(t).attr('class', 'status_yellow');
                }
                if ($(t).html().indexOf('已达资格') >= 0) {
                    // $(t).css('color', '#00ff08');
                    $(t).attr('class', 'status_green');
                }
                if ($(t).html().indexOf('未达门槛') >= 0) {
                    // $(t).css('color', '#ffd904');
                    $(t).attr('class', 'status_yellow');
                }
                if ($(t).html().indexOf('未达标') >= 0) {
                    // $(t).css('color', '#ffd904');
                    $(t).attr('class', 'status_red');
                }
                if ($(t).html().indexOf('未处理') >= 0) {
                    // $(t).css('color', '#ffd904');
                    $(t).attr('class', 'status_red');
                }
                if ($(t).html().indexOf('已取消') >= 0) {
                    // $(t).css('color', '#ffd904');
                    $(t).attr('class', 'status_red');
                }
                if ($(t).html().indexOf('已挂账') >= 0) {
                    // $(t).css('color', '#ffd904');
                    $(t).attr('class', 'status_red');
                }
                if ($(t).html().indexOf('已退佣') >= 0) {
                    // $(t).css('color', '#ffd904');
                    $(t).attr('class', 'status_green');
                }
            });
            $('.control-label .ng-binding').each(function (i, t) {
                if ($(t).html().indexOf('不通过') >= 0) {
                    // $(t).css('color', 'red');
                    $(t).attr('class', 'status_red');
                }
                if ($(t).html().indexOf('已通过') >= 0) {
                    // $(t).css('color', '#00ff08');
                    $(t).attr('class', 'status_green');
                }
                if ($(t).html().indexOf('已失效') >= 0) {
                    // $(t).css('color', '#ffd904');
                    $(t).attr('class', 'status_yellow');
                }
            })
        }, 1)
        if (data.nowPage > 1) {
            $('#' + newData.$id)
            if ($('#' + newData.$id).find('div').length === undefined || $('#' + newData.$id).find('div').length === 0) {
                console.log('分页提示：当前页（nowPage）必须是第一页，你传入的是：' + data.nowPage)
            }
            return
        } else {
            newData = {
                $id: '',
                total: '',
                size: '',
                nowPage: ''
            }
        }
        newData = data;

        var startPage = 1;//开始的页码
        var endPage = 5;//最后一个页码
        var numPage = 5;//显示N个按钮
        var total = newData.total;
        var size = newData.size;
        var btn = newData.nowPage;//当前激活的按钮/当前页数
        if ($('#' + newData.$id).length === undefined || $('#' + newData.$id).length === 0) {
            console.log('分页提示：插件缺少HTML部分或id不正确（<div id="you id"></div>） 你传入的id为' + newData.$id)
            return
        }
        for (var i in newData) {
            if (newData[i] === undefined || newData[i] === null || (typeof(newData[i]) !== "number" && i !== '$id')) {
                console.log('分页提示：参数错误：' + i + ' 您传入的' + i + '为' + newData[i])
                if (typeof(newData[i]) !== "number") {
                    console.log('分页提示：参数' + i + ' 必须为number类型')
                }
                return
            }
        }
        if (total === 0) {
            console.log('分页提示：总条数（total）为零' + total)
            if (btn == 1) {
                $('#' + newData.$id).html('')
            }
            return
        }

        this.count = this.count || total;
        if (total > 1000) {
            numPage = 7
        }
        if (total > 10000) {
            numPage = 9
        }
        total = total || that.count;
        $('#' + newData.$id).addClass('so-page-parent');
        $('#' + newData.$id).html('<div class="so-page"></div>');
        var count = ((total - total % size) / size).toFixed(0);//总条数
        if (total % size !== 0) {
            count++
        }
        var pageList = [];
        for (var i = 0; i < count; i++) {
            pageList.push(i + 1);
        }


        var mim = (numPage + 1) / 2;//中间数
        var viewPage = [];
        viewPage = pageList.slice(0, numPage);
        if (btn === 1 && count < numPage) {
            viewPage = pageList.slice(0, count);
        }
        initPage();

        function initPage() {
            //渲染分页
            $('#' + newData.$id + ' .so-page').html('');
            var html = '<div class="so-page-up"><</div><div class="so-page-first">1</div></div><div>';
            for (var i in viewPage) {
                html += '<a >' + viewPage[i] + '</a>'
            }
            html += '</div><div class="so-page-last">99</div><div class="so-page-down">></div><div class="input-group ng-scope">' +
                '<input type="text" class="form-control so-page-input" placeholder="页码">' +
                '<span class="input-group-btn"><button class="btn btn-primary so-page-button" type="button">跳转</button>' +
                '</span></div>';
            $('#' + newData.$id + ' .so-page').html(html);
            $('#' + newData.$id + ' .so-page a').each(function (i, t) {
                if (btn === viewPage[i]) {
                    $(t).addClass('active');
                }
                $(t).unbind('click').click(function () {
                    if (numPage % 2 === 1) {
                        btn = parseInt($(t).html(), 10);
                        if (i < mim) {//如果点击按钮小于中间数
                            if (viewPage[0] <= pageList[0] + mim) {//如果数据左边到底了
                                viewPage = pageList.slice(0, numPage);
                            } else {
                                viewPage = pageList.slice(pageList[btn - 1] - mim, pageList[btn - 2] + mim);
                            }
                        } else {//如果点击按钮大于等于中间数
                            if (viewPage[viewPage.length - 1] > pageList[pageList.length - 1]) {//如果数据的右边到底了
                                viewPage = pageList.slice(pageList.length - numPage - 1, pageList.length - 1);
                            } else {
                                // if (mim + 2 < count) {
                                viewPage = pageList.slice(pageList[btn - 1] - mim, pageList[btn - 2] + mim);
                                // }
                            }
                        }
                    }
                    initPage();
                    initActive();
                    initButtomBir();
                })
            });
            //尾页更新
            $('#' + newData.$id + ' .so-page-last').html(count)

            //跳转分页
            $('#' + newData.$id + ' .so-page-button').unbind('click').click(function () {
                initButtomBir()
                var inputVal = $('#' + newData.$id + ' .so-page-input').val();
                if (parseInt(inputVal, 10) <= count && parseInt(inputVal, 10) > 0) {
                    if (numPage % 2 === 1) {
                        btn = parseInt(inputVal, 10);
                        if (parseInt(inputVal, 10) < mim) {//如果点击按钮小于中间数
                            if (viewPage[0] <= pageList[0] + mim) {//如果数据左边到底了
                                viewPage = pageList.slice(0, numPage);
                            } else {
                                if (pageList[btn - 1] - mim < 0) {
                                    viewPage = pageList.slice(0, numPage);
                                } else {
                                    viewPage = pageList.slice(pageList[btn - 1] - mim, pageList[btn - 2] + mim);
                                }
                            }
                        } else {//如果点击按钮大于等于中间数
                            if (viewPage[viewPage.length - 1] > pageList[pageList.length - 1]) {//如果数据的右边到底了
                                viewPage = pageList.slice(pageList.length - numPage - 1, pageList.length - 1);
                            } else {
                                viewPage = pageList.slice(pageList[btn - 1] - mim, pageList[btn - 2] + mim);
                            }
                        }
                    }
                    initPage();
                    initActive();
                } else {
                    $('#' + newData.$id + ' .so-page-input').val('error').attr('style', 'color:red');
                    $('#' + newData.$id + ' .so-page-input').on('focus', function () {
                        $('#' + newData.$id + ' .so-page-input').val('').attr('style', '')
                    });
                }
            })
//上一页
            $('#' + newData.$id + ' .so-page-up').unbind('click').click(function () {
                btn--;
                initButtom();
            })
//下一页
            $('#' + newData.$id + ' .so-page-down').unbind('click').click(function () {
                btn++
                initButtom();
            })
// 第一页
            $('#' + newData.$id + ' .so-page-first').unbind('click').click(function () {
                btn = 1;
                initButtom();
            })
//尾页
            $('#' + newData.$id + ' .so-page-last').unbind('click').click(function () {
                btn = count;
                initButtom();
            })

            function initButtomBir() {
                if (count > numPage) {
                    if (btn > mim) {
                        $('#' + newData.$id + ' .so-page-first').addClass('active')
                    } else if (btn < mim) {
                        $('#' + newData.$id + ' .so-page-first').removeClass('active')
                    }
                    if (btn > (count - mim)) {
                        $('#' + newData.$id + ' .so-page-last').removeClass('active')
                    } else {
                        $('#' + newData.$id + ' .so-page-last').addClass('active')
                    }
                } else {
                    $('#' + newData.$id + ' .so-page-last').removeClass('active')
                }
            };
            initButtomBir()

            function initButtom() {
                initButtomBir()
                var inputVal = btn;
                if (parseInt(inputVal, 10) <= count && parseInt(inputVal, 10) > 0) {
                    if (numPage % 2 === 1) {
                        btn = parseInt(inputVal, 10);
                        if (parseInt(inputVal, 10) < mim) {//如果点击按钮小于中间数
                            if (viewPage[0] <= pageList[0] + mim) {//如果数据左边到底了
                                viewPage = pageList.slice(0, numPage);
                            } else {
                                if (pageList[btn - 1] - mim < 0) {
                                    viewPage = pageList.slice(0, numPage);
                                } else {
                                    viewPage = pageList.slice(pageList[btn - 1] - mim, pageList[btn - 2] + mim);
                                }
                            }
                        } else {//如果点击按钮大于等于中间数
                            if (viewPage[viewPage.length - 1] > pageList[pageList.length - 1]) {//如果数据的右边到底了
                                viewPage = pageList.slice(pageList.length - numPage - 1, pageList.length - 1);
                            } else {
                                viewPage = pageList.slice(pageList[btn - 1] - mim, pageList[btn - 2] + mim);
                            }
                        }
                    }
                    initPage();
                    initActive();
                }
            }

        }

        function initActive() {
            $('#' + newData.$id + ' .so-page a').each(function (i, t) {
                if (btn === viewPage[i]) {
                    $(t).addClass('active')
                    //这里写获取分页数据的方法,并传入页码
                    fun(btn);
                }
            });
        }


    }

    this.calNumPages = function (total, pageSize) {
        var numPages = 1;
        if (total == null || total == undefined) {
            numPages = 1;
        } else {
            if (total > 0) {
                numPages = total / pageSize + 1;
            } else {
                numPages = 1;
            }
        }
        //向下取整
        return parseInt(numPages);
    }

    this.getValidPage = function (page, totalPage) {
        if (page < 1) {
            page = 1;
        }
        if (totalPage != null) {
            if (page > totalPage) {
                page = totalPage;
            }
        }
        return page;
    }

    /**
     * 打开页面
     * @param page
     * @param size
     */
    this.open = function (page, size) {
        $uibModal.open({
            animation: true,
            templateUrl: page,
            size: size,
        });
    };


    //图片上传插件
    this.initUpImg = function (data, fun) {
        var data = data;
        var id = data.$id;
        var initImgUrl = '';
        var upload = data.upload;
        var maxSize=data.maxSize*1000;
        var maxWidth=data.width*1000;
        var maxHeight=data.height*1000;
        setTimeout(function () {
            initImgUrl = $.trim($('#' + id).html());
            if ($('#' + id).data('status') === 1) {
                return
            } else {
                $('#' + id).attr('data-status', '1')
            }
            $('#' + id).html('<div class="so-upImg"><img class="upImg-img" id="img-' + id + '"><a class="upImg-a" id="but-' + id + '">图片上传</a><input class="upImg-file" type="file" id="file-' + id + '"></div>')
            if (initImgUrl) {
                $('#img-' + id).attr('src', lotteryConst.imgUrl + '/photo/pic/' + initImgUrl + '/0')
            }
            initChange()

            function initChange() {
                $('#file-' + id).on('change', function () {
                    var file = this.files[0];
                    var imageType = /image.*/;
                    if (file.type.match(imageType)) {
                        var reader = new FileReader();
                        reader.onload = function () {
                            if(file.size>maxSize){
                                custNotify.error('系统提示', '上传图片大于'+ maxSize/1000 +'k');
                                return false
                            }
                            $('#img-' + id).attr('src', reader.result)
                            var formData = new FormData();
                            formData.append("pic", file);
                            var oReq = new XMLHttpRequest();
                            oReq.responseType = "json";
                            oReq.open("POST", upload, true);
                            oReq.onload = function (oEvent) {
                                if (oReq.status == 200) {
                                    var picid = oReq.response.picid
                                    fun({
                                        id: id,
                                        code: 0,
                                        url: lotteryConst.imgUrl + '/photo/pic/' + picid + '/0',
                                        picid: picid
                                    })
                                } else {
                                    $('#' + id).html('<div class="so-upImg"><img class="upImg-img" id="img-' + id + '"><a class="upImg-a" id="but-' + id + '">图片上传</a><input class="upImg-file" type="file" id="file-' + id + '"></div>')
                                    initChange()
                                    fun({code: oReq.status, err: oReq.response})
                                }
                            };
                            oReq.send(formData);
                        };
                        reader.readAsDataURL(file);
                    } else {
                        $('#' + id).html('<div class="so-upImg"><img class="upImg-img" id="img-' + id + '"><a class="upImg-a" id="but-' + id + '">图片上传</a><input class="upImg-file" type="file" id="file-' + id + '"></div>')
                        initChange()
                        fun({code: -1, err: '获取文件失败'})
                    }
                })
            }
        }, 1)
    }


    //日期插件

    /**
     * 日期控件
     *
     * @type {common}
     */
    this.soDate = function () {
        var that = this;
        this.init = function (data, cb) {
            that.formart = data.formart;
            var $id = data.$id
            $('#' + $id).unbind('click').click(function () {
                that.preventBubble()
                $('.sodate-date').remove()
                $(this).val('')
                var $id = $(this).attr('id')
                that.initDateFrame($id, function (res) {
                    cb(res)
                });
            })
            $('body').unbind('click').click(function () {
                $('.sodate-date').remove()
                clearInterval(that.interval);
            })
        }
        this.initDateFrame = function ($id, cb) {
            var $id = $id;
            var inputDoc = $('#' + $id);
            var newTime = new Date();
            var soDateHtml = '<div class="sodate-date" id="sodate-date-' + $id + '">' +
                '<div class="sodate-top">' +
                '<i class="sodate-up-year"></i><i class="sodate-up-mon"></i>' +
                '<span class="sodate-year-mon"></span>' +
                '<i class="sodate-next-mon"></i><i class="sodate-next-year"></i>' +
                '</div>' +
                '<div class="sodate-date-content">' +
                '<table>' +
                '<thead><tr><td>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td></tr></thead><tbody class="sodate-date-day">' +
                '</tbody>' +
                '</table>' +
                '</div>' +
                '<div class="sodate-bottom">' +
                '</div>' +
                '</div>';
            //位置计算
            $('body').append(soDateHtml);
            that.interval = setInterval(function () {
                var inputDoc = $('#' + $id);
                if (inputDoc.css('display') !== 'none' && inputDoc.length && inputDoc.length > 0) {
                    var initTop = inputDoc.offset().top + inputDoc.height() + 15;
                    var initLeft = inputDoc.offset().left;
                    if (initLeft + 274 > $(window).width()) {
                        initLeft = $(window).width() - 274;
                    }
                    $('#sodate-date-' + $id).offset({
                        top: initTop,
                        left: initLeft
                    }).show().animate({'opacity': 1}, 500);
                } else {
                    $('.sodate-date').remove();
                    clearInterval(that.interval);
                }
            }, 60)
            that.getDayContent($id, newTime.getYear() + 1900, newTime.getMonth() + 1, null, function (res) {
                clearInterval(that.interval);
                cb(res)
            });
            that.initDate($id);
        }
        this.initDate = function ($id) {
            var $id = $id;
            //获取当前时间
            var nowTime = new Date();
            var year = nowTime.getYear() + 1900;
            var month = nowTime.getMonth() + 1;
            if (month < 10) month = '0' + month;
            var date = nowTime.getDate();
            if (date < 10) date = '0' + date;
            var nowDate = year + '-' + month + '-' + date;
            //给标题赋值年月日
            $('#sodate-date-' + $id + ' .sodate-year-mon').text(year + '年' + month + '月')
        }
        this.initTime = function ($id) {
            $('.sodate-time').remove()
            $('#sodate-date-' + $id + ' .sodate-date-content').append('<div class="sodate-time">' +
                '<div class="sodate-time-top">选择时间</div>' +
                '<div class="sodate-time-main"></div></div>');
            var liHtml = '<ul><li class="sodate-date-hour"><p>时</p><ol>';
            for (var i = 0; i < 24; i++) {
                var h = i;
                if (h < 10) {
                    h = '0' + h
                }
                var className = '';
                if (i === 0) {
                    className = 'sodate-active'
                }
                liHtml += '<li class="' + className + '">' + h + '</li>'
            }
            liHtml += '</ol></li><li class="sodate-date-minutes"><p>分</p><ol>';
            for (var i = 0; i < 60; i++) {
                var m = i;
                if (m < 10) {
                    m = '0' + m
                }
                var className = '';
                if (i === 0) {
                    className = 'sodate-active'
                }
                liHtml += '<li class="' + className + '">' + m + '</li>'
            }
            liHtml += '</ol></li><li class="sodate-date-seconds"><p>秒</p><ol>';
            for (var i = 0; i < 60; i++) {
                var s = i;
                if (s < 10) {
                    s = '0' + s
                }
                var className = '';
                if (i === 0) {
                    className = 'sodate-active'
                }
                liHtml += '<li class="' + className + '">' + s + '</li>'
            }
            liHtml += '</ol></li></ul>';
            $('#sodate-date-' + $id + ' .sodate-time-main').html(liHtml);
            var inputDoc = $('#sodate-date-' + $id);
            var initTop = inputDoc.offset().top + 1;
            var initLeft = inputDoc.offset().left + 1;
            $('#sodate-date-' + $id + ' .sodate-time').offset({top: initTop, left: initLeft}).show();
            //鼠标移动到ol上显示滚动条
            $('#sodate-date-' + $id + ' .sodate-time-main ol').unbind('mouseover').mouseover(function () {
                $(this).addClass('sodate-overflow')
            });
            $('#sodate-date-' + $id + ' .sodate-time-main ol').unbind('mouseout').mouseout(function () {
                $(this).removeClass('sodate-overflow')
            });
            $('#sodate-date-' + $id + ' .sodate-time-main ol li').unbind('click').click(function () {
                that.preventBubble()
                $(this).addClass('sodate-active').siblings().removeClass('sodate-active');
                $(this).parent().animate({scrollTop: (parseInt($(this).text()) + 1) * 32 - (3 * 32)}, 200)
            })
        }
        this.getDayNumOfMonth = function (year, month) {
            return 32 - new Date(year, month, 32).getData();
        }
        this.getDayContent = function ($id, year, month, date, cb) {
            var $id = $id;
            //返回日期选择器
            var firstDay = new Date(year + '/' + month + '/' + 1);
            firstDay.setDate(firstDay.getDate() - firstDay.getDay() - 1);
            var conHtml = '';
            for (var i = 0; i < 6; i++) {
                conHtml += '<tr>'
                for (var j = 0; j < 7; j++) {
                    firstDay.setDate(firstDay.getDate() + 1);
                    var day = firstDay.getDate();
                    //给内容指定样式
                    var className = '';
                    var newTime = null;
                    if (date) {
                        newTime = new Date(year + '-' + month + '-' + date)
                    } else {
                        newTime = new Date()
                    }
                    //如果是本日/或指定date给样式sodate-active
                    if (day === newTime.getDate() && firstDay.getMonth() === newTime.getMonth()) {
                        className += 'sodate-active'
                    }

                    //给不是本月的样式sodate-before/sodate-after
                    if (firstDay.getMonth() < newTime.getMonth()) {
                        className += 'sodate-before'
                    }
                    if (firstDay.getMonth() > newTime.getMonth()) {
                        className += 'sodate-after'
                    }
                    var td_y = (firstDay.getYear() + 1900);
                    var td_m = (firstDay.getMonth() + 1);
                    if (td_m < 10) td_m = '0' + td_m;
                    var td_d = firstDay.getDate();
                    if (td_d < 10) td_d = '0' + td_d;
                    var dateAll = td_y + '-' + td_m + '-' + td_d;
                    conHtml += '<td class="' + className + '" data-val="' + dateAll + '">' + day + '</td>'
                }
                conHtml += '</tr>'
            }
            $('.sodate-date-day').html(conHtml);
            //返回时间选择器
            var timeHmtl = '<div class="sodate-date-time"><span class="sodate-date-time-text">选择时间</span></div>' +
                '<div class="sodate-date-button"><span>清空</span><span>现在</span>' +
                '<span>确定</span></div>';
            $('.sodate-bottom').html(timeHmtl);
            that.setEvent($id, function (res) {
                cb(res)
            })
        }
        this.getNewTime = function () {
            //获取当前时间
            var nowTime = new Date();
            var year = nowTime.getYear() + 1900;
            var month = nowTime.getMonth() + 1;
            if (month < 10) month = '0' + month;
            var date = nowTime.getDate();
            if (date < 10) date = '0' + date;
            var hour = nowTime.getHours();
            ;
            if (hour < 10) hour = '0' + hour;
            var minutes = nowTime.getMinutes();
            if (minutes < 10) minutes = '0' + minutes;
            var seconds = nowTime.getSeconds();
            if (seconds < 10) seconds = '0' + seconds;
            var nowDate = year + '-' + month + '-' + date + ' ' + hour + ':' + minutes + ':' + seconds;
            return nowDate
        }
        this.getFormart = function (time) {
            var dateStr = time
            var formart = that.formart || 'yyyy/MM/dd HH:mm:ss';
            if (formart) {

                formart = formart.replace('yyyy', dateStr.substring(0, 4) || '0000');
                formart = formart.replace('MM', dateStr.substring(5, 7) || '00');
                formart = formart.replace('dd', dateStr.substring(8, 10) || '00');
                formart = formart.replace('HH', dateStr.substring(11, 13) || '00');
                formart = formart.replace('mm', dateStr.substring(14, 16) || '00');
                formart = formart.replace('ss', dateStr.substring(17, 19) || '00')
            }
            return formart;
        }
        this.setEvent = function ($id, cb) {
            var $id = $id;
            //年份选择
            $('#sodate-date-' + $id + ' .sodate-up-year,.sodate-next-year').unbind('click').click(function () {
                that.preventBubble()
                var dated = '';
                that.preventBubble()
                $('#sodate-date-' + $id + ' .sodate-date-content td').each(function (i, t) {
                    if (i > 6) {
                        var tdVal = $(t).attr('class') || '';
                        if (tdVal.indexOf('sodate-active') >= 0) {
                            dated = $(t).data('val');
                        }
                    }
                })
                var yearDate = new Date(dated)
                var yearClassName = $(this).attr('class') || '';
                if (yearClassName.indexOf('sodate-up-year') >= 0) {
                    console.log(yearDate.getYear())
                    yearDate.setYear(((yearDate.getYear() + 1900) - 1))
                }
                if (yearClassName.indexOf('sodate-next-year') >= 0) {
                    console.log(yearDate.getYear())
                    yearDate.setYear(((yearDate.getYear() + 1900) + 1))
                }
                that.getDayContent($id, yearDate.getYear() + 1900, yearDate.getMonth() + 1, yearDate.getDate(), function (res) {
                    cb(res)
                })
                $('#sodate-date-' + $id + ' .sodate-year-mon').text((yearDate.getYear() + 1900) + '年' + (yearDate.getMonth() + 1) + '月')
            })
            //月份选择
            $('#sodate-date-' + $id + ' .sodate-up-mon,.sodate-next-mon').unbind('click').click(function () {
                that.preventBubble()
                var dated = ''
                $('#sodate-date-' + $id + ' .sodate-date-content td').each(function (i, t) {
                    if (i > 6) {
                        var tdVal = $(t).attr('class') || '';
                        if (tdVal.indexOf('sodate-active') >= 0) {
                            dated = $(t).data('val');
                        }
                    }
                })
                var yearDate = new Date(dated)
                var yearClassName = $(this).attr('class') || '';
                if (yearClassName.indexOf('sodate-up-mon') >= 0) {
                    yearDate.setMonth((yearDate.getMonth() - 1))
                }
                if (yearClassName.indexOf('sodate-next-mon') >= 0) {
                    yearDate.setMonth((yearDate.getMonth() + 1))
                }
                console.log(yearDate.getMonth() + 1)
                that.getDayContent($id, yearDate.getYear() + 1900, yearDate.getMonth() + 1, yearDate.getDate(), function (res) {
                    cb(res)
                })
                $('#sodate-date-' + $id + ' .sodate-year-mon').text((yearDate.getYear() + 1900) + '年' + (yearDate.getMonth() + 1) + '月')
            })
            //日期选择
            $('#sodate-date-' + $id + ' .sodate-date-content td').each(function (i, t) {
                if (i > 6) {
                    $(t).unbind('click').click(function () {
                        that.preventBubble()
                        var dateStr = $(t).data('val');

                        var enddateStr;
                        if (that.getFormart(dateStr).length > 11) {
                            enddateStr = that.getFormart(dateStr).substring(0, 10) + ' 23:59:59';
                        } else {
                            enddateStr = that.getFormart(dateStr);
                        }

                        if ($id.indexOf('endTime') >= 0) {
                            $("#" + $id).val(enddateStr)
                        } else {
                            $("#" + $id).val(that.getFormart(dateStr))
                        }

                        $('#sodate-date-' + $id + ' .sodate-date-content td').removeClass('sodate-active')
                        $(this).addClass('sodate-active');
                        if (!(that.formart.indexOf('hh') >= 0 || that.formart.indexOf('mm') >= 0 || that.formart.indexOf('ss') >= 0)) {
                            $('#sodate-date-' + $id).remove()
                        }
                        if ($id.indexOf('endTime') >= 0) {
                            //console.log(that.getFormart(dateStr).length)

                            if (that.getFormart(dateStr).length > 11) {
                                cb(that.getFormart(dateStr).substring(0, 10) + ' 23:59:59')
                            } else {
                                cb(that.getFormart(dateStr))
                            }

                        }
                        if ($id.indexOf('startTime') >= 0) {
                            cb(that.getFormart(dateStr))
                        }

                    })
                }
            })
            //初始化时间控件
            $('#sodate-date-' + $id + ' .sodate-date-time-text').unbind('click').click(function () {
                that.preventBubble()
                if ($(this).text() === '返回日期') {
                    $('#sodate-date-' + $id + ' .sodate-time').hide();
                    $(this).text('选择时间')
                } else {
                    $(this).text('返回日期')
                    $('#sodate-date-' + $id + ' .sodate-time').remove();
                    that.initTime($id)
                }
            })
            if (!(that.formart.indexOf('yyyy') >= 0 || that.formart.indexOf('MM') >= 0 || that.formart.indexOf('dd') >= 0)) {
                $('.sodate-top').css({"opacity": "0"})
                $('.sodate-date-content ul').css({"opacity": "0"})
                setTimeout(function () {
                    that.initTime($id)
                }, 0)
                $('#sodate-date-' + $id + ' .sodate-date-time-text').hide()
            }
            if (!(that.formart.indexOf('hh') >= 0 || that.formart.indexOf('mm') >= 0 || that.formart.indexOf('ss') >= 0)) {
                $('#sodate-date-' + $id + ' .sodate-date-time-text').hide();
            }
            // 三个按钮
            $('.sodate-date-button span').unbind('click').click(function () {
                that.preventBubble();
                var text = $(this).text();
                var flag = false;
                if (text === '清空') {
                    $('#' + $id).val('')
                }
                if (text === '现在') {
                    $("#" + $id).val(that.getFormart(that.getNewTime()))
                    $('.sodate-date').remove()
                    cb(that.getFormart(that.getNewTime()))
                }
                if (text === '确定') {
                    var dateStr = ''
                    $('#sodate-date-' + $id + ' .sodate-date-content td').each(function (i, t) {

                        if (i > 6) {
                            if ($(t).attr('class').indexOf('sodate-active') >= 0) {

                                dateStr = $(t).data('val');
                            }
                        }
                    })
                    $('#sodate-date-' + $id + ' .sodate-date-hour ol li').each(function (i, t) {
                        if ($(t).attr('class').indexOf('sodate-active') >= 0) {
                            flag = true;
                            dateStr += ' ' + $(t).text()
                        }
                    })
                    $('#sodate-date-' + $id + ' .sodate-date-minutes ol li').each(function (i, t) {
                        if ($(t).attr('class').indexOf('sodate-active') >= 0) {
                            flag = true;
                            dateStr += ':' + $(t).text()
                        }
                    })
                    $('#sodate-date-' + $id + ' .sodate-date-seconds ol li').each(function (i, t) {
                        if ($(t).attr('class').indexOf('sodate-active') >= 0) {
                            flag = true;
                            dateStr += ':' + $(t).text()
                        }
                    });
                    //console.log(that.getFormart(dateStr))
                    if ($id.indexOf('endTime') >= 0) {
                        if (that.getFormart(dateStr).length > 11 && !flag) {
                            $("#" + $id).val(that.getFormart(dateStr).substring(0, 10) + ' 23:59:59');
                            cb(that.getFormart(dateStr).substring(0, 10) + ' 23:59:59');
                        } else {
                            $("#" + $id).val(that.getFormart(dateStr));
                            cb(that.getFormart(dateStr));
                            ;
                        }


                    }

                    /* if( $id.indexOf('startTime')>=0){
                         $("#" + $id).val(that.getFormart(dateStr))
                     }
                     cb(that.getFormart(dateStr))*/
                    //$("#" + $id).val(that.getFormart(dateStr))
                    $('.sodate-date').remove();

                    if ($id.indexOf('startTime') >= 0) {
                        $("#" + $id).val(that.getFormart(dateStr))
                        cb(that.getFormart(dateStr));

                    }

                }
            })
        };
        this.preventBubble = function (event) {
            var e = arguments.callee.caller.arguments[0] || event; //若省略此句，下面的e改为event，IE运行可以，但是其他浏览器就不兼容
            if (e && e.stopPropagation) {
                e.stopPropagation();
            } else if (window.event) {
                window.event.cancelBubble = true;
            }
        }
    }
    /**
     * @return {boolean}
     */
    this.IsURL = function (str_url) {
        var strRegex =  /^((https?|ftp|news):\/\/)?([a-z]([a-z0-9\-]*[\.。])+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel)|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&]*)?)?(#[a-z][a-z0-9_]*)?$/;
        var re = new RegExp(strRegex);
        //re.test()
        if (re.test(str_url)) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * 日期小轮子
     *
     * @param data
     */


    this.getDateDay = function (data) {
        /**
         * 时间日期类
         */
        var now = new Date(); //当前日期
        var nowDayOfWeek = now.getDay(); //今天本周的第几天
        var nowDay = now.getDate(); //当前日
        var nowMonth = now.getMonth(); //当前月
        var nowYear = now.getYear(); //当前年
        nowYear += (nowYear < 2000) ? 1900 : 0; //
        if (data == 'today') {
            var yesterday = new Date(nowYear, nowMonth, nowDay); //今天
            return formatDate(yesterday);
        } else if (data == 'yesterday') {
            var yesterday = new Date(nowYear, nowMonth, nowDay - 1); //昨天
            return formatDate(yesterday);
        } else if (data == 'weekStart') {
            //获取本周第一天日期
            var weekStart = new Date(nowYear, nowMonth, nowDay + (1 - nowDayOfWeek));
            return formatDate(weekStart);
        } else if (data == 'weekEnd') {
            //获取本周最后一天日期
            var weekStart = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek));
            return formatDate(weekStart);
        } else if (data == 'lastWeekStart') {
            //获得上周第一天日期
            var lastWeekStart = new Date(nowYear, nowMonth, nowDay + (-6 - nowDayOfWeek));
            return formatDate(lastWeekStart);
        } else if (data == 'lastWeekEnd') {
            //获得上周最后一天日期
            var lastWeekEnd = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
            return formatDate(lastWeekEnd);
        } else if (data == 'monthStart') {
            //本月第一天
            var monthStartDate = new Date(nowYear, nowMonth, 1);
            return formatDate(monthStartDate);
        } else if (data == 'monthEnd') {
            //本月最后一天
            var monthStartDate = new Date(nowYear, nowMonth + 1, 0);
            return formatDate(monthStartDate);
        } else if (data == 'lastMonthStart') {
            //上月第一天
            var monthStartDate = new Date(nowYear, (nowMonth - 1), 1);
            return formatDate(monthStartDate);
        } else if (data == 'LastMonthEnd') {
            //上月最后一天
            var monthStartDate = new Date(nowYear, nowMonth, 0);
            return formatDate(monthStartDate);
        } else if (data == "tomorrow") {
            var tomorrow = new Date(nowYear, nowMonth, nowDay + 1); //明天
            return formatDate(tomorrow);
        } else if (data == 'beforeWeek') {
            var beforeWeek = new Date(nowYear, nowMonth, nowDay - 7); //七天前
            return formatDate(beforeWeek);
        }

        //格式化时间
        function formatDate(date) {
            var myyear = date.getFullYear();
            var mymonth = date.getMonth() + 1;
            var myweekday = date.getDate();
            if (mymonth < 10) {
                mymonth = "0" + mymonth;
            }
            if (myweekday < 10) {
                myweekday = "0" + myweekday;
            }
            return (myyear + "/" + mymonth + "/" + myweekday);
        }
    }
}

/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function accAdd(arg1, arg2) {
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}

//给Number类型增加一个add方法，调用起来更加方便。
Number.prototype.add = function (arg) {
    return accAdd(arg, this);
};

/**
 ** 减法函数，用来得到精确的减法结果
 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 ** 调用：accSub(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function accSub(arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

// 给Number类型增加一个sub方法，调用起来更加方便。
Number.prototype.sub = function (arg) {
    return accMul(arg, this);
};

/**
 ** 乘法函数，用来得到精确的乘法结果
 ** 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 ** 调用：accMul(arg1,arg2)
 ** 返回值：arg1乘以 arg2的精确结果
 **/
function accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

// 给Number类型增加一个mul方法，调用起来更加方便。
Number.prototype.mul = function (arg) {
    return accMul(arg, this);
};

/**
 ** 除法函数，用来得到精确的除法结果
 ** 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
 ** 调用：accDiv(arg1,arg2)
 ** 返回值：arg1除以arg2的精确结果
 **/
function accDiv(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
    }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * pow(10, t2 - t1);
    }
}

//给Number类型增加一个div方法，调用起来更加方便。
Number.prototype.div = function (arg) {
    return accDiv(this, arg);
};
