/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('lateralNav', lateralNav);

    /** @ngInject */
    function lateralNav($scope, httpFactory, lotteryConst, custNotify, $interval, todoService, common, $sce) {
        //请求菜单列表
        var url = lotteryConst.apiRoot
        var routingArr = [];
        var access_token = getCookie('access_token1');
        if (access_token != null) {
            access_token = access_token.replace(/"/g, '');
        }
        $.ajax({
            url: url + '/areaaccount/api/plat/res/user/list',
            type: 'get',
            dataType: 'json',
            headers: {
                Authorization: 'bearer ' + access_token
            },
            success: function (result) {
                routingArr = result.data;
                var hash = getMao().mao;
                readState(hash);

            },
            error: function (err) {
                var text = ''
            }
        })

        function getCookie(name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return null;
        }

        common.addNav = function (hash, name) {
            $scope.routing.push({hash: hash, name: name})
            window.location.href = getMao().url + hash;
        }
        /**
         * 路由处理
         */
        $scope.routing = [{hash: '#/dashboard', name: '首页'}]
        window.addEventListener('popstate', function (event) {
            var hash = getMao().mao;
            $('.so-nav-a').each(function (i, t) {
                var href = $(t).find('a').attr('href')
                if (href == hash) {
                    $(t).addClass('active').siblings().removeClass('active')
                }
            })
            readState(hash);
        });

        function readState(data) {
            var hashUrl = data;
            var hash = hashUrl.substring(2, data.length)
            var name = '';
            if(hashUrl=='#/account/memberStatisticsSubpage'){
                name='新增会员明细'
            }
            if(hashUrl=='#/statistics/MemberStatisticsList'){
                name='会员统计报表'
            }
            if(hashUrl=='#/statistics/MembershipDetails'){
                name='会员入款明细'
            }
            if(hashUrl=='#/statistics/MemberPaymentDetails'){
                name='会员出款明细'
            }
            if(hashUrl=='#/statistics/MemberBenefitsList'){
                name='会员优惠列表'
            }
            if(hashUrl=='#/statistics/MemberDiscountDetails'){
                name='会员优惠详情'
            }
            if(hashUrl=='#/statistics/memberFeedbackList'){
                name='会员返水列表'
            }
            if(hashUrl=='#/statistics/memberFeedbackDetails'){
                name='会员返水详情'
            }
            if(hashUrl=='#/statistics/singleDayGameReport'){
                name='单日游戏报表'
            }
            if(hashUrl=='#/statistics/singleGameReport'){
                name='单期游戏统计'
            }
            if(hashUrl=='#/statistics/playProfitLossDetails'){
                name='玩法盈亏明细'
            }
            if(hashUrl=='#/funds/companyFlowInfo'){
                name='公司入款详情'
            }
            if(hashUrl=='#/funds/olineFlowInfo'){
                name='线上入款详情'
            }
            if(hashUrl=='#/funds/manualFlowInfo'){
                name='人工入款详情'
            }
            if(hashUrl=='#/funds/memberOutFlowInfo'){
                name='会员出款扣款详情'
            }
            if(hashUrl=='#/funds/memberOutInfo'){
                name='会员出款详情'
            }
            if(hashUrl=='#/funds/giveDiscountInfo'){
                name='给予优惠详情'
            }
            if(hashUrl=='#/funds/manualDrawInfo'){
                name='人工提出详情'
            }
            if(hashUrl=='#/funds/giveRebateInfo'){
                name='给予返水详情'
            }
            if(hashUrl=='#/statistics/memberNoteStatistics'){
                name='会员注单统计'
            }
            if(hashUrl=='#/statistics/refundBillDetails'){
                name='退佣账单详情'
            }
            if(hashUrl=='#/statistics/actingCommissionDetails'){
                name='代理退佣详情'
            }
            if(hashUrl=='#/statistics/gameplayDetails'){
                name='游戏玩法明细'
            }

            routingArr.forEach(function (t, i) {
                if (hash === t.staticUrl) {
                    name = t.name
                }
            });
            var lock = 1;
            $scope.routing.forEach(function (t, i) {
                if (hashUrl === t.hash) {
                    lock = 0
                }
            })
            if (lock === 1) {
                $scope.routing.push({hash: data, name: name});
            }
        }

        /**
         * nav操作
         */
        //删除
        $scope.deleteNav = function (e, index) {
            event.stopPropagation();
            setTimeout(function () {
                window.location.href = getMao().url + $scope.routing[index - 1].hash
                $scope.routing.splice(index, 1)
            }, 0)
        }


        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            var hash = getMao().mao;
            $('.so-nav-a').each(function (i, t) {
                var href = $(t).find('a').attr('href')
                if (href == hash) {
                    $(t).addClass('active').siblings().removeClass('active')
                }
            })
            $('.so-nav-a').each(function (i, t) {
                $(t).on('click', function () {
                    var href = $(t).find('a').attr('href')
                    if (href == hash) {
                        $(this).addClass('active').siblings().removeClass('active')
                    }
                })
            })
            //更新UL的宽度
            var li_w = 10
            $('#soNav li').each(function (i, t) {
                li_w += $(t).width()
            })
            $('#soNav').width(li_w)
            var lateralNav_w = $('.lateralNav').width()
        });

        function getMao() {
            var hash = window.location.href
            var urlArr = hash.split('#')
            var data = {url: urlArr[0], mao: '#' + urlArr[1]}
            return data
        }

        //获取鼠标位置
        function mousePosition(ev) {
            if (ev.pageX || ev.pageY) {
                return {x: ev.pageX, y: ev.pageY};
            }
            return {
                x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
                y: ev.clientY + document.body.scrollTop - document.body.clientTop
            };
        }


        function handle(delta) {
            var xd = getElementPos("soNav");
            var sc = mousePosition(event)
            if (sc.x >= xd.x && sc.y > xd.y && sc.y < xd.y + $('#soNav').height()) {
                var li_w = 20//li宽度
                var ul_w = $('.lateralNav').width()
                $('#soNav li').each(function (i, t) {
                    li_w += $(t).width()
                })
                var ul_left = ($('#soNav').css('left').replace('px', '')) * 1;//ul位置
                if (delta < 0) {
                    if (li_w - ul_left > 0 && li_w + ul_left >= ul_w) {
                        ul_left -= 20
                    }
                } else {
                    if (ul_left < 0) {
                        ul_left += 20
                    }
                }
                $('#soNav').css('left', ul_left + 'px')
            }
        }

        $scope.soNavRight = function () {
            var xd = getElementPos("soNav");
            var sc = mousePosition(event)
            if (sc.x >= xd.x && sc.y > xd.y && sc.y < xd.y + $('#soNav').height()) {
                var li_w = 20//li宽度
                var ul_w = $('.lateralNav').width()
                $('#soNav li').each(function (i, t) {
                    li_w += $(t).width()
                })
                var ul_left = ($('#soNav').css('left').replace('px', '')) * 1;//ul位置
                if (li_w - ul_left > 0 && li_w + ul_left >= ul_w) {
                    ul_left -= 100
                }
                $('#soNav').css('left', ul_left + 'px')
            }
        }
        $scope.soNavLeft = function () {
            var xd = getElementPos("soNav");
            var sc = mousePosition(event)
            if (sc.x >= xd.x && sc.y > xd.y && sc.y < xd.y + $('#soNav').height()) {
                var li_w = 20//li宽度
                var ul_w = $('.lateralNav').width()
                $('#soNav li').each(function (i, t) {
                    li_w += $(t).width()
                })
                var ul_left = ($('#soNav').css('left').replace('px', '')) * 1;//ul位置
                if (ul_left < 0) {
                    ul_left += 100
                }
                $('#soNav').css('left', ul_left + 'px')
            }
        }

        function wheel(event) {
            var delta = 0;
            if (!event) event = window.event;
            if (event.wheelDelta) {
                delta = event.wheelDelta / 120;
                if (window.opera) delta = -delta;
            } else if (event.detail) {
                delta = -event.detail / 3;
            }
            if (delta)
                handle(delta);
        }

        if (window.addEventListener)
            window.addEventListener('DOMMouseScroll', wheel, false);
        window.onmousewheel = document.onmousewheel = wheel;


        function getElementPos(elementId) {
            var ua = navigator.userAgent.toLowerCase();
            var isOpera = (ua.indexOf('opera') != -1);
            var isIE = (ua.indexOf('msie') != -1 && !isOpera); // not opera spoof
            var el = document.getElementById(elementId);
            if (el.parentNode === null || el.style.display == 'none') {
                return false;
            }
            var parent = null;
            var pos = [];
            var box;
            if (el.getBoundingClientRect) //IE
            {
                box = el.getBoundingClientRect();
                var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
                var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
                return {
                    x: box.left + scrollLeft,
                    y: box.top + scrollTop
                };
            }
            else if (document.getBoxObjectFor) // gecko
            {
                box = document.getBoxObjectFor(el);
                var borderLeft = (el.style.borderLeftWidth) ? parseInt(el.style.borderLeftWidth) : 0;
                var borderTop = (el.style.borderTopWidth) ? parseInt(el.style.borderTopWidth) : 0;
                pos = [box.x - borderLeft, box.y - borderTop];
            }
            else // safari & opera
            {
                pos = [el.offsetLeft, el.offsetTop];
                parent = el.offsetParent;
                if (parent != el) {
                    while (parent) {
                        pos[0] += parent.offsetLeft;
                        pos[1] += parent.offsetTop;
                        parent = parent.offsetParent;
                    }
                }
                if (ua.indexOf('opera') != -1 || (ua.indexOf('safari') != -1 && el.style.position == 'absolute')) {
                    pos[0] -= document.body.offsetLeft;
                    pos[1] -= document.body.offsetTop;
                }
            }
            if (el.parentNode) {
                parent = el.parentNode;
            }
            else {
                parent = null;
            }
            while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') { // account for any scrolled

                ancestors
                pos[0] -= parent.scrollLeft;
                pos[1] -= parent.scrollTop;
                if (parent.parentNode) {
                    parent = parent.parentNode;
                }
                else {
                    parent = null;
                }
            }
            return {
                x: pos[0],
                y: pos[1]
            };
        }

        //右键菜单


        //鼠标键按下监控
        $('#soNav').mousedown(function (e) {
            //获取鼠标按下的键值
            var key = e.which;
            if (key == 3) {
                //获取当前鼠标光标的坐标
                var x = e.clientX;
                var y = e.clientY;
                //获取弹出菜单的宽度和高度
                var menuwidth = $("#desktop_menu").width();
                var menuheight = $("#desktop_menu").height();
                //alert(menuwidth+"===========>>"+menuheight);
                //获取浏览器可视宽度和高度
                var clientHeight = getClientHeight();
                var clientWidth = getClientWidth();
                //判断当光标靠边时，防止弹出菜单溢出浏览器可视范围
                if ((x + menuwidth) > clientWidth) {
                    x = clientWidth - menuwidth - 10;
                }
                if ((y + menuheight) > clientHeight) {
                    y = clientHeight - menuheight - 10;
                }
                //为menu菜单定位
                $("#desktop_menu").show().css({top: y, left: x});
            }
        });

        //鼠标点击任意浏览器区域菜单消失
        $(document).click(function () {
            //alert(0);
            $("#desktop_menu").hide();
        });

        // 浏览器的可见高度
        function getClientHeight() {
            var clientHeight = 0;
            if (document.body.clientHeight && document.documentElement.clientHeight) {
                clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
            } else {
                clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
            }
            return clientHeight;
        }

        // 浏览器的可见宽度
        function getClientWidth() {
            var clientWidth = 0;
            if (document.body.clientWidth && document.documentElement.clientWidth) {
                clientWidth = (document.body.clientWidth < document.documentElement.clientWidth) ? document.body.clientWidth : document.documentElement.clientWidth;
            } else {
                clientWidth = (document.body.clientWidth > document.documentElement.clientWidth) ? document.body.clientWidth : document.documentElement.clientWidth;
            }
            return clientWidth;
        }

        //鼠标点击菜单选项添加事件
        // $("#desktop_menu li").click(function () {
        //     var li_index = $(this).index();
        //     alert($(this).text());
        // });
        $scope.navIndex = 0;
        $scope.mouseoverNav = function (e) {
            $scope.navIndex = e.$index
        }
        $scope.muneClick = function (e) {
            event.stopPropagation();
            var index = $scope.navIndex
            window.location.href = getMao().url + $scope.routing[index].hash
            switch (e) {
                case 0:
                    $scope.routing.splice(index + 1, $scope.routing.length)
                    $scope.routing.splice(1, index - 1)
                    break;
                case 1:
                    $scope.routing.splice(1, index - 1)
                    break;
                case 2:
                    $scope.routing.splice(index + 1, $scope.routing.length)
                    break;
                case 3:
                    window.location.href = getMao().url + $scope.routing[0].hash
                    $scope.routing.splice(1, $scope.routing.length)
                    break;
            }
            $("#desktop_menu").hide();
        }
    }
})();

