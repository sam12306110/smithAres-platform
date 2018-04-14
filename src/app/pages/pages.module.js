/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages', [
        'ui.router'
    ]).config(routeConfig);


    /** @ngInject */
    function routeConfig($urlRouterProvider, baSidebarServiceProvider, $stateProvider) {
        function getCookie(name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return null;
        }

        var access_token = getCookie('access_token1');
        //console.log(access_token)
        if (access_token != null) {
            access_token = access_token.replace(/"/g, '');
        }
        $urlRouterProvider.otherwise('/dashboard');
        //获取路由配置
        var routing = [];
        var initRouting = function () {


            var path = globalPath;
            //var path = globalPath;
            // console.log(3333+path)
            $.ajax({
                url: path + '/areaaccount/api/plat/res/user/list',
                type: 'get',
                dataType: 'json',
                async: false,
                headers: {
                    Authorization: 'bearer ' + access_token
                },
                success: function (result) {
                    //console.log(result.data)
                    routing = result.data;
                    //路径鉴权
                    // window.addEventListener('popstate', function (event) {
                    //     verifyAddress(routing)
                    // });
                    initManage()
                },
                error: function (err) {
                    var text = ''
                    switch (err.status) {
                        case 401:
                            text = '证书失效：账号已注销';
                            // alert(text);
                            window.location.href = 'auth.html';
                            break;
                        case 404:
                            text = '找不到该页面';
                            // alert(text);
                            window.location.href = 'auth.html';
                            break;
                        case 409:
                            text = '证书失效：账号在其他地方登入';
                            // alert(text);
                            window.location.href = 'auth.html';
                            break;
                    }
                }
            })
        };

        function verifyAddress(routing) {
            var routing = routing;
            routing.push({
                description: "首页",
                engKey: "",
                icon: "ion-home",
                id: 100001,
                leaf: 1,
                level: 1,
                name: "首页",
                parentId: 0,
                resUri: "",
                sort: 1,
                staticUrl: "dashboard",
                status: 1,
                type: 1
            });//必定进入首页
            var relUrl = window.location.href
            relUrl = relUrl.split('#')
            relUrl = relUrl[relUrl.length - 1]
            var trueOrFalse = false
            for (var i in routing) {
                var strUrl = routing[i].staticUrl || ''
                if (relUrl.indexOf(strUrl) >= 0 && strUrl !== '') {
                    // console.log('菜单获取完成：' + strUrl)
                    trueOrFalse = true;
                }
            }
            if (!trueOrFalse) {
                window.location.href = 'auth.html'
            }
        }

        function GetUrlRelativePath() {//获取URL相对路径
            var url = document.location.toString();
            var arrUrl = url.split("//");

            var start = arrUrl[1].indexOf("/");
            var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符

            if (relUrl.indexOf("?") != -1) {
                relUrl = relUrl.split("?")[0];
            }
            return relUrl;
        }

        var initManage = function () {
            var arr = [];
            var icons = ['ion-home', 'ion-ios-game-controller-a', 'ion-ios-paper', 'ion-ribbon-b', 'ion-card', 'ion-settings', 'ion-person-stalker', 'ion-stats-bars', 'ion-pie-graph', 'ion-chatboxes', 'ion-card']
            routing.forEach(function (e, i) {
                if (e.level === 1) {
                    var e_obj = {
                        title: e.name,
                        icon: e.icon || '',
                        stateRef: e.staticUrl,
                        subMenu: [],
                        id: e.id,
                    }
                    routing.forEach(function (f) {
                        if (f.level === 2 && e_obj.id === f.parentId) {
                            var f_obj = {
                                title: f.name,
                                icon: '',
                                stateRef: f.staticUrl,
                                subMenu: [],
                                id: f.id,
                            }
                            routing.forEach(function (g) {
                                if (g.level === 3 && f_obj.id === g.parentId) {
                                    var g_obj = {
                                        title: g.name,
                                        icon: '',
                                        stateRef: g.staticUrl,
                                        subMenu: [],
                                        id: g.id,
                                    }
                                    f_obj.subMenu.push(g_obj)
                                }
                            })
                            e_obj.subMenu.push(f_obj)
                        }
                    })
                    arr.push(e_obj)
                }
            })
            arr.forEach(function (e, i) {
                if (e.subMenu.length === 0) e.subMenu = null;
                if (e.subMenu) {
                    e.subMenu.forEach(function (f) {
                        if (f.subMenu.length === 0) f.subMenu = null;
                        if (f.subMenu) {
                            f.subMenu.forEach(function (g) {
                                if (g.subMenu.length === 0) g.subMenu = null;
                            })
                        }
                    })
                }
            });
            arr.forEach(function (e) {
                baSidebarServiceProvider.addStaticItem(e);
            })
        };
        var initStaticUrl = function () {
            $stateProvider.state('dashboard', {
                title: '首页',
                url: '/dashboard',
                templateUrl: 'app/pages/dashboard/dashboard.html'
            });

            /**
             * plan
             */
            $stateProvider.state('plan/order/side', {
                url: '/plan/order/side',
                templateUrl: 'app/pages/plan/order/side/orderSide.html',
                title: '双面彩方案管理'
            });

            $stateProvider.state('plan/order/official', {
                url: '/plan/order/official',
                templateUrl: 'app/pages/plan/order/official/orderOfficial.html',
                title: '官方彩方案管理'
            });

            $stateProvider.state('plan/chaseOrder/official', {
                url: '/plan/chaseOrder/official',
                templateUrl: 'app/pages/plan/chaseOrder/official/chaseOrderOfficial.html',
                title: '官方彩追号记录'
            });


            $stateProvider.state('plan/risk/side', {
                url: '/plan/risk/side',
                templateUrl: 'app/pages/plan/risk/side/riskSide.html',
                title: '双面彩异常方案监控'
            });

            $stateProvider.state('plan/risk/official', {
                url: '/plan/risk/official',
                templateUrl: 'app/pages/plan/risk/official/riskOfficial.html',
                title: '官方彩异常方案监控'
            });
            /**
             * drawCenter
             */
            $stateProvider.state('drawCenter/excRecord', {
                url: '/drawCenter/excRecord/excRecord',
                templateUrl: 'app/pages/drawCenter/excRecord/excRecord.html',
                title: '开奖异常处理记录'
            });

            $stateProvider.state('drawCenter/lotteryMonitor', {
                url: '/drawCenter/lotteryMonitor',
                templateUrl: 'app/pages/drawCenter/lotteryMonitor/lotteryMonitor.html',
                title: '开奖历史'
            });

            $stateProvider.state('drawCenter/sourceManage', {
                url: '/drawCenter/sourceManage',
                templateUrl: 'app/pages/drawCenter/sourceManage/sourceManage.html',
                title: '号源管理'
            });
            /**
             * config
             */
            $stateProvider.state('config/quotaLimit/side', {
                url: '/config/quotaLimit/side',
                templateUrl: 'app/pages/config/quotaLimit/side/quotaLimitSide.html',
                title: '双面彩投注限制设定'
            });
            $stateProvider.state('config/quotaLimit/official', {
                url: '/config/quotaLimit/official',
                templateUrl: 'app/pages/config/quotaLimit/official/quotaLimitOfficial.html',
                title: '官方彩投注限制设定'
            });


            $stateProvider.state('config/orderExp/side', {
                url: '/config/orderExp/side',
                templateUrl: 'app/pages/config/orderExp/side/orderExp.html',
                title: '双面彩异常方案设定'
            });
            $stateProvider.state('config/orderExp/official', {
                url: '/config/orderExp/official',
                templateUrl: 'app/pages/config/orderExp/official/orderExp.html',
                title: '官方彩异常方案设定'
            });
            $stateProvider.state('config/openConfig', {
                url: '/config/openConfig',
                templateUrl: 'app/pages/config/openConfig/openConfig.html',
                title: '开奖参数设定'
            });

            $stateProvider.state('config/reforward/side', {
                url: '/config/reforward/side',
                templateUrl: 'app/pages/config/reforward/side/reforwardSide.html',
                title: '双面彩返点与奖金对照表'
            });
            $stateProvider.state('config/reforward/official', {
                url: '/config/reforward/official',
                templateUrl: 'app/pages/config/reforward/official/reforwardOfficial.html',
                title: '官方彩返点与奖金对照表'
            });


            $stateProvider.state('config/settlePlan/side', {
                url: '/config/settlePlan/side',
                templateUrl: 'app/pages/config/settlePlan/side/settlePlanSide.html',
                title: '双面彩结算方案设定'
            });
            $stateProvider.state('config/settlePlan/official', {
                url: '/config/settlePlan/official',
                templateUrl: 'app/pages/config/settlePlan/official/settlePlanOfficial.html',
                title: '官方彩结算方案设定'
            });


            $stateProvider.state('config/periodManage/side', {
                url: '/config/periodManage/side',
                templateUrl: 'app/pages/config/periodManage/side/periodManageSide.html',
                title: '双面彩期数设定'
            });
            $stateProvider.state('config/periodManage/official', {
                url: '/config/periodManage/official',
                templateUrl: 'app/pages/config/periodManage/official/periodManageOfficial.html',
                title: '官方彩期数设定'
            });


            $stateProvider.state('config/permissionManage', {
                url: '/config/permissionManage',
                templateUrl: 'app/pages/config/permissionManage/permissionManage.html',
                title: '权限管理'
            });

            $stateProvider.state('config/permissionMenu', {
                url: '/config/permissionMenu',
                templateUrl: 'app/pages/config/permissionMenu/permissionMenu.html',
                title: '权限菜单配置'
            });


            $stateProvider.state('config/accessConfig', {
                url: '/config/accessConfig',
                templateUrl: 'app/pages/config/accessConfig/accessConfig.html',
                title: '访问权限设定'
            });

            $stateProvider.state('config/registerConfig', {
                url: '/config/registerConfig',
                templateUrl: 'app/pages/config/registerConfig/registerConfig.html',
                title: '注册配置'
            });

            $stateProvider.state('config/lotteryWeight', {
                url: '/config/lotteryWeight',
                templateUrl: 'app/pages/config/lotteryWeight/lotteryWeight.html',
                title: '彩种排序'
            });
            $stateProvider.state('config/soundConfig', {
                url: '/config/soundConfig',
                templateUrl: 'app/pages/config/soundConfig/soundConfig.html',
                title: '站点语音提示'
            });

            $stateProvider.state('config/custConfig', {
                url: '/config/custConfig',
                templateUrl: 'app/pages/config/custConfig/custConfig.html',
                title: '客服设定'
            });

            $stateProvider.state('config/appConfig', {
                url: '/config/appConfig',
                templateUrl: 'app/pages/config/appConfig/appConfig.html',
                title: 'app地址设定'
            });
            $stateProvider.state('config/domain', {
                url: '/config/domain',
                templateUrl: 'app/pages/config/domain/domain.html',
                title: '域名列表'
            });


            $stateProvider.state('config/shortLink', {
                url: '/config/shortLink',
                templateUrl: 'app/pages/config/shortLink/shortLink.html',
                title: '短连接设定'
            });
            $stateProvider.state('config/accessDiscount', {
                url: '/config/accessDiscount',
                templateUrl: 'app/pages/config/accessDiscount/accessDiscount.html',
                title: '出入款优惠设定'
            });

            $stateProvider.state('config/rebateProgram', {
                url: '/config/rebateProgram',
                templateUrl: 'app/pages/config/rebateProgram/rebateProgram.html',
                title: '会员返水设定'
            });


            $stateProvider.state('config/registDiscount', {
                url: '/config/registDiscount',
                templateUrl: 'app/pages/config/registDiscount/registDiscount.html',
                title: '注册优惠设定'
            });

            $stateProvider.state('config/retirement', {
                url: '/config/retirement',
                templateUrl: 'app/pages/config/retirement/retirement.html',
                title: '代理退佣设定'
            });

            $stateProvider.state('config/administrative', {
                url: '/config/administrative',
                templateUrl: 'app/pages/config/administrative/administrative.html',
                title: '行政成本设定'
            });
            $stateProvider.state('config/feePlan', {
                url: '/config/feePlan',
                templateUrl: 'app/pages/config/feePlan/feePlan.html',
                title: '手续费设定'
            });
            $stateProvider.state('config/agentPeriod', {
                url: '/config/agentPeriod',
                templateUrl: 'app/pages/config/agentPeriod/agentPeriod.html',
                title: '代理期数设定'
            });
            $stateProvider.state('config/proxyWhitelistSettings', {
                url: '/config/proxyWhitelistSettings',
                templateUrl: 'app/pages/config/proxyWhitelistSettings/proxyWhitelistSettings.html',
                title: '代理白名单设定'
            });

            /**
             * account
             */
            $stateProvider.state('account/rapidDetection', {
                url: '/account/rapidDetection',
                templateUrl: 'app/pages/account/rapidDetection/rapidDetection.html',
                title: '快速检测'
            });
            $stateProvider.state('account/editUserInfo', {
                url: '/account/editUserInfo',
                templateUrl: 'app/pages/account/editUserInfo/editUserInfo.html',
                title: '资料修改'
            });
            $stateProvider.state('account/plat/side', {
                url: '/account/plat/side',
                templateUrl: 'app/pages/account/plat/side/platSide.html',
                title: '双面彩平台商账号管理'
            });
            $stateProvider.state('account/plat/official', {
                url: '/account/plat/official',
                templateUrl: 'app/pages/account/plat/official/platOfficial.html',
                title: '官方彩平台商账号管理'
            });
            $stateProvider.state('account/member/side', {
                url: '/account/member/side',
                templateUrl: 'app/pages/account/member/side/memberSide.html',
                title: '会员列表'
            });
            $stateProvider.state('account/member/official', {
                url: '/account/member/official',
                templateUrl: 'app/pages/account/member/official/memberOfficial.html',
                title: '官方彩会员账号管理'
            });

            $stateProvider.state('account/memberLevel', {
                url: '/account/memberLevel',
                templateUrl: 'app/pages/account/memberLevel/memberLevel.html',
                title: '会员层级管理'
            });
            $stateProvider.state('account/MembersReturnLevels', {
                url: '/account/MembersReturnLevels',
                templateUrl: 'app/pages/account/MembersReturnLevels/MembersReturnLevels.html',
                title: '会员分层回归'
            });
            $stateProvider.state('account/agentList', {
                url: '/account/agentList',
                templateUrl: 'app/pages/account/agentList/agentList.html',
                title: '代理列表'
            });

            $stateProvider.state('account/agentAudit', {
                url: '/account/agentAudit',
                templateUrl: 'app/pages/account/agentList/agentAudit.html',
                title: '新增代理审核'
            });
            $stateProvider.state('account/memberStatistics', {
                url: '/account/memberStatistics',
                templateUrl: 'app/pages/account/memberStatistics/memberStatistics.html',
                title: '新增会员统计'
            });
            $stateProvider.state('account/memberStatisticsSubpage', {
                url: '/account/memberStatisticsSubpage',
                templateUrl: 'app/pages/account/memberStatistics/memberStatisticsSubpage.html',
                title: '新增会员明细'
            });
            $stateProvider.state('account/withIpAccountInquiries', {
                url: '/account/withIpAccountInquiries',
                templateUrl: 'app/pages/account/withIpAccountInquiries/withIpAccountInquiries.html',
                title: '同IP账号查询'
            });


            /**
             * analysis
             */
            $stateProvider.state('analysis/quickSearch/side', {
                url: '/analysis/quickSearch/side',
                templateUrl: 'app/pages/analysis/quickSearch/side/quickSearchSide.html',
                title: '双面彩快速查询'
            });
            $stateProvider.state('analysis/quickSearch/official', {
                url: '/analysis/quickSearch/official',
                templateUrl: 'app/pages/analysis/quickSearch/official/quickSearchOfficial.html',
                title: '官方彩快速查询'
            });

            /**
             * 游戏统计
             */
            $stateProvider.state('analysis/gameReport/official', {
                url: '/analysis/gameReport/official',
                templateUrl: 'app/pages/analysis/gameReport/official/gameReport.html',
                title: '官方彩游戏统计报表'
            });
            $stateProvider.state('analysis/gameReport/official/daysGameReport', {
                url: '/analysis/gameReport/official/daysGameReport/:lotteryId',
                templateUrl: 'app/pages/analysis/gameReport/official/daysGameReport.html',
                title: '官方彩单日游戏报表'
            });
            $stateProvider.state('analysis/gameReport/official/pcodesGameReport', {
                url: '/analysis/gameReport/official/pcodesGameReport',
                templateUrl: 'app/pages/analysis/gameReport/official/pcodesGameReport.html',
                title: '官方彩单期游戏报表',
                params: {
                    lotteryId: null,
                    pdate: null
                }
            });
            $stateProvider.state('analysis/gameReport/official/singlePcodeGameReport', {
                url: '/analysis/gameReport/official/singlePcodeGameReport',
                templateUrl: 'app/pages/analysis/gameReport/official/singlePcodeGameReport.html',
                title: '官方彩玩法盈亏明细',
                params: {
                    lotteryId: null,
                    pcode: null
                }
            });

            /**
             * statistics
             */
            $stateProvider.state('statistics/userLog', {
                url: '/statistics/userLog/userLog',
                templateUrl: 'app/pages/statistics/userLog/userLogManage.html',
                title: '日志查询与统计'
            });
            $stateProvider.state('statistics/agentListStatistics', {
                url: '/statistics/agentListStatistics',
                templateUrl: 'app/pages/statistics/agentListStatistics/agentListStatistics.html',
                title: '代理统计报表'
            });
            $stateProvider.state('statistics/MemberStatisticsList', {
                url: '/statistics/MemberStatisticsList',
                templateUrl: 'app/pages/statistics/agentListStatistics/MemberStatisticsList.html',
                title: '会员统计报表'
            });
            $stateProvider.state('statistics/AccessStatistics', {
                url: '/statistics/AccessStatistics',
                templateUrl: 'app/pages/statistics/AccessStatistics/AccessStatistics.html',
                title: '出入款统计'
            });
            $stateProvider.state('statistics/MembershipDetails', {
                url: '/statistics/MembershipDetails',
                templateUrl: 'app/pages/statistics/AccessStatistics/MembershipDetails.html',
                title: '会员入款明细'
            });
            $stateProvider.state('statistics/MemberPaymentDetails', {
                url: '/statistics/MemberPaymentDetails',
                templateUrl: 'app/pages/statistics/AccessStatistics/MemberPaymentDetails.html',
                title: '会员出款明细'
            });
            $stateProvider.state('statistics/MemberDiscountStatistics', {
                url: '/statistics/MemberDiscountStatistics',
                templateUrl: 'app/pages/statistics/MemberDiscountStatistics/MemberDiscountStatistics.html',
                title: '会员优惠统计'
            });
            $stateProvider.state('statistics/MemberBenefitsList', {
                url: '/statistics/MemberBenefitsList',
                templateUrl: 'app/pages/statistics/MemberDiscountStatistics/MemberBenefitsList.html',
                title: '会员优惠列表'
            });
            $stateProvider.state('statistics/MemberDiscountDetails', {
                url: '/statistics/MemberDiscountDetails',
                templateUrl: 'app/pages/statistics/MemberDiscountStatistics/MemberDiscountDetails.html',
                title: '会员优惠详情'
            });
            $stateProvider.state('statistics/memberFeedbackStatistics', {
                url: '/statistics/memberFeedbackStatistics',
                templateUrl: 'app/pages/statistics/memberFeedbackStatistics/memberFeedbackStatistics.html',
                title: '会员返水统计'
            });
            $stateProvider.state('statistics/memberFeedbackList', {
                url: '/statistics/memberFeedbackList',
                templateUrl: 'app/pages/statistics/memberFeedbackStatistics/memberFeedbackList.html',
                title: '会员返水列表'
            });
            $stateProvider.state('statistics/memberFeedbackDetails', {
                url: '/statistics/memberFeedbackDetails',
                templateUrl: 'app/pages/statistics/memberFeedbackStatistics/memberFeedbackDetails.html',
                title: '会员返水详情'
            });
            $stateProvider.state('statistics/OnlineMemberInquiries', {
                url: '/statistics/OnlineMemberInquiries',
                templateUrl: 'app/pages/statistics/OnlineMemberInquiries/OnlineMemberInquiries.html',
                title: '在线会员查询'
            });
            $stateProvider.state('statistics/gameStatisticsReport', {
                url: '/statistics/gameStatisticsReport',
                templateUrl: 'app/pages/statistics/gameStatisticsReport/gameStatisticsReport.html',
                title: '游戏统计报表'
            });
            $stateProvider.state('statistics/singleDayGameReport', {
                url: '/statistics/singleDayGameReport',
                templateUrl: 'app/pages/statistics/gameStatisticsReport/singleDayGameReport.html',
                title: '单日游戏统计'
            });
            $stateProvider.state('statistics/singleGameReport', {
                url: '/statistics/singleGameReport',
                templateUrl: 'app/pages/statistics/gameStatisticsReport/singleGameReport.html',
                title: '单日游戏统计'
            });
            $stateProvider.state('statistics/playProfitLossDetails', {
                url: '/statistics/playProfitLossDetails',
                templateUrl: 'app/pages/statistics/gameStatisticsReport/playProfitLossDetails.html',
                title: '玩法盈亏明细'
            });
            $stateProvider.state('statistics/logQueryStatistics', {
                url: '/statistics/logQueryStatistics',
                templateUrl: 'app/pages/statistics/logQueryStatistics/logQueryStatistics.html',
                title: '日志查询与统计'
            });
            $stateProvider.state('statistics/memberDebitRecords', {
                url: '/statistics/memberDebitRecords',
                templateUrl: 'app/pages/statistics/memberDebitRecords/memberDebitRecords.html',
                title: '会员扣款记录'
            });
            $stateProvider.state('statistics/membersHierarchicalStatistics', {
                url: '/statistics/membersHierarchicalStatistics',
                templateUrl: 'app/pages/statistics/membersHierarchicalStatistics/membersHierarchicalStatistics.html',
                title: '会员分层统计'
            });
            $stateProvider.state('statistics/memberNoteStatistics', {
                url: '/statistics/memberNoteStatistics',
                templateUrl: 'app/pages/statistics/membersHierarchicalStatistics/memberNoteStatistics.html',
                title: '会员注单统计'
            });
            $stateProvider.state('statistics/actingMonthlyStatement', {
                url: '/statistics/actingMonthlyStatement',
                templateUrl: 'app/pages/statistics/actingMonthlyStatement/actingMonthlyStatement.html',
                title: '代理月结账单'
            });
            $stateProvider.state('statistics/actingCommissionStatistics', {
                url: '/statistics/actingCommissionStatistics',
                templateUrl: 'app/pages/statistics/actingCommissionStatistics/actingCommissionStatistics.html',
                title: '代理退佣统计'
            });
            $stateProvider.state('statistics/refundBillDetails', {
                url: '/statistics/refundBillDetails',
                templateUrl: 'app/pages/statistics/actingMonthlyStatement/refundBillDetails.html',
                title: '退佣账单详情'
            });
            $stateProvider.state('statistics/actingCommissionDetails', {
                url: '/statistics/actingCommissionDetails',
                templateUrl: 'app/pages/statistics/actingCommissionStatistics/actingCommissionDetails.html',
                title: '代理退佣详情'
            });
            $stateProvider.state('statistics/gameplayDetails', {
                url: '/statistics/gameplayDetails',
                templateUrl: 'app/pages/statistics/gameStatisticsReport/gameplayDetails.html',
                title: '代理退佣详情'
            });
            /**
             * cms
             */
            $stateProvider.state('cms/bulletin/side', {
                url: '/cms/bulletin/side',
                templateUrl: 'app/pages/cms/bulletin/side/bulletinSide.html',
                title: '双面彩公告列表'
            });
            $stateProvider.state('cms/bulletin/official', {
                url: '/cms/bulletin/official',
                templateUrl: 'app/pages/cms/bulletin/official/bulletinOfficial.html',
                title: '官方彩公告列表'
            });
            $stateProvider.state('cms/webset/site', {
                url: '/cms/webset/site',
                templateUrl: 'app/pages/cms/webset/site/site.html',
                title: '站点信息'
            });

            $stateProvider.state('cms/webset/copyright', {
                url: '/cms/webset/copyright',
                templateUrl: 'app/pages/cms/webset/copyright/copyright.html',
                title: '网站说明文案'
            });

            $stateProvider.state('cms/activity', {
                url: '/cms/activity',
                templateUrl: 'app/pages/cms/activity/activity.html',
                title: '优惠活动列表'
            });

            $stateProvider.state('cms/carousel', {
                url: '/cms/carousel',
                templateUrl: 'app/pages/cms/content/carousel/carousel.html',
                title: '轮播图管理'
            });

            $stateProvider.state('cms/notice', {
                url: '/cms/notice',
                templateUrl: 'app/pages/cms/content/notice/notice.html',
                title: '公告管理'
            });

            $stateProvider.state('cms/popText', {
                url: '/cms/popText',
                templateUrl: 'app/pages/cms/content/popText/popText.html',
                title: '首页弹屏'
            });


            $stateProvider.state('cms/msg', {
                url: '/cms/msg',
                templateUrl: 'app/pages/cms/msg/msg.html',
                title: '站内信'
            });

            $stateProvider.state('cms/msgTemplate', {
                url: '/cms/msgTemplate',
                templateUrl: 'app/pages/cms/msgTemplate/msgTemplate.html',
                title: '信息模板'
            });

            /**
             * payConfig
             */
            $stateProvider.state('payConfig/collectionConfig', {
                url: '/payConfig/collectionConfig',
                templateUrl: 'app/pages/payConfig/collectionConfig/collectionConfig.html',
                title: '收款配置'
            });
            $stateProvider.state('payConfig/accountSettings', {
                url: '/payConfig/accountSettings',
                templateUrl: 'app/pages/payConfig/accountSettings/accountSettings.html',
                title: '公司入款设定'
            });
            $stateProvider.state('payConfig/thirdPartySettings', {
                url: '/payConfig/thirdPartySettings',
                templateUrl: 'app/pages/payConfig/thirdPartySettings/thirdPartySettings.html',
                title: '第三方账号设定'
            });
            $stateProvider.state('payConfig/walletSettings', {
                url: '/payConfig/walletSettings',
                templateUrl: 'app/pages/payConfig/walletSettings/walletSettings.html',
                title: '钱包支付设定'
            });

            /**
             * funds
             */
            $stateProvider.state('funds/accessSummary', {
                url: '/funds/accessSummary',
                templateUrl: 'app/pages/funds/accessSummary/accessSummary.html',
                title: '出入款账目汇总'
            });

            $stateProvider.state('funds/companyFlowInfo', {
                url: '/funds/companyFlowInfo',
                templateUrl: 'app/pages/funds/accessSummary/companyFlowInfo.html',
                title: '公司入款详情'
            });
            $stateProvider.state('funds/olineFlowInfo', {
                url: '/funds/olineFlowInfo',
                templateUrl: 'app/pages/funds/accessSummary/olineFlowInfo.html',
                title: '线上入款详情'
            });
            $stateProvider.state('funds/manualFlowInfo', {
                url: '/funds/manualFlowInfo',
                templateUrl: 'app/pages/funds/accessSummary/manualFlowInfo.html',
                title: '人工入款详情'
            });
            $stateProvider.state('funds/memberOutFlowInfo', {
                url: '/funds/memberOutFlowInfo',
                templateUrl: 'app/pages/funds/accessSummary/memberOutFlowInfo.html',
                title: '会员出款扣款详情'
            });
            $stateProvider.state('funds/memberOutInfo', {
                url: '/funds/memberOutInfo',
                templateUrl: 'app/pages/funds/accessSummary/memberOutInfo.html',
                title: '会员出款详情'
            });
            $stateProvider.state('funds/giveDiscountInfo', {
                url: '/funds/giveDiscountInfo',
                templateUrl: 'app/pages/funds/accessSummary/giveDiscountInfo.html',
                title: '给予优惠详情'
            });
            $stateProvider.state('funds/manualDrawInfo', {
                url: '/funds/manualDrawInfo',
                templateUrl: 'app/pages/funds/accessSummary/manualDrawInfo.html',
                title: '人工提出详情'
            });
            $stateProvider.state('funds/giveRebateInfo', {
                url: '/funds/giveRebateInfo',
                templateUrl: 'app/pages/funds/accessSummary/giveRebateInfo.html',
                title: '给予返水详情'
            });


            $stateProvider.state('funds/companyFlowCheck', {
                url: '/funds/companyFlowCheck',
                templateUrl: 'app/pages/funds/companyFlowCheck/companyFlowCheck.html',
                title: '公司入款审核'
            });
            $stateProvider.state('funds/olineFlowRecord', {
                url: '/funds/olineFlowRecord',
                templateUrl: 'app/pages/funds/olineFlowRecord/olineFlowRecord.html',
                title: '线上入款记录'
            });
            $stateProvider.state('funds/memberOutCheck', {
                url: '/funds/memberOutCheck',
                templateUrl: 'app/pages/funds/memberOutCheck/memberOutCheck.html',
                title: '会员出款审核'
            });
            $stateProvider.state('funds/manualWithdrawal', {
                url: '/funds/manualWithdrawal',
                templateUrl: 'app/pages/funds/manualWithdrawal/manualWithdrawal.html',
                title: '人工存提'
            });
            $stateProvider.state('funds/manualWithdrawalRecord', {
                url: '/funds/manualWithdrawalRecord',
                templateUrl: 'app/pages/funds/manualWithdrawalRecord/manualWithdrawalRecord.html',
                title: '人工存提记录'
            });
            $stateProvider.state('funds/memberFeedbackRecords', {
                url: '/funds/memberFeedbackRecords',
                templateUrl: 'app/pages/funds/memberFeedbackRecords/memberFeedbackRecords.html',
                title: '会员返水记录'
            });
            $stateProvider.state('funds/memberFeedbackManagement', {
                url: '/funds/memberFeedbackManagement',
                templateUrl: 'app/pages/funds/memberFeedbackManagement/memberFeedbackManagement.html',
                title: '会员返水管理'
            });
            $stateProvider.state('funds/retirementCurrentReport', {
                url: '/funds/retirementCurrentReport',
                templateUrl: 'app/pages/funds/retirementCurrentReport/retirementCurrentReport.html',
                title: '退佣当期报表'
            });
            $stateProvider.state('funds/cemberFlowCheck', {
                url: '/funds/cemberFlowCheck',
                templateUrl: 'app/pages/funds/cemberFlowCheck/cemberFlowCheck.html',
                title: '会员金流查询'
            });

        };
        initRouting();
        initStaticUrl()
    }
})();
