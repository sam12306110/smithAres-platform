/* eslint-disable keyword-spacing */
/**
 * @author a.demeshko
 * created on 23.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.customize').filter('formatTime', function () {
        return function (text) {
            text = '' + text;
            if (text.length <= 6) {
                var len = 6 - text.length;
                var start = '';
                for (var i = 0; i < len; i++) {
                    start += '0';
                }
                text = start + text;
            }
            text = text.substring(0, 2) + ':' + text.substring(2, 4) + ':' + text.substring(4, 6);
            return text;
        };
    });
    angular.module('BlurAdmin.customize').filter('dateToTime', function () {
        return function (date) {
            return new Date(date).valueOf();
        };
    });
    angular.module('BlurAdmin.customize').filter('formatPrize', function () {
        return function (prize) {
            return $filter('number')(prize / 100, '2');
        };
    });
    angular.module('BlurAdmin.customize').filter('formatNumber', function () {
        return function (x) {
            return $filter('number')(x / 100);
        };
    });
    angular.module('BlurAdmin.customize').filter('formatAuditStatus', function () {
        return function (text) {
            var statusHtml = '';
            switch (text) {
                case 0:
                    statusHtml = '待审核';
                    break;
                case 1:
                    statusHtml = '已通过';
                    break;
                case 2:
                    statusHtml = '已拒绝';
                    break;
                default:
                    break;
            }
            return statusHtml;
        };
    });
    angular.module('BlurAdmin.customize').filter('formatStatus', function () {
        return function (text) {
            var statusHtml = '';
            switch (text) {
                case 1:
                    statusHtml = '已通过';
                    break;
                case 2:
                    statusHtml = '待审核';
                    break;
                case 3:
                    statusHtml = '不通过';
                    break;
                case 4:
                    statusHtml = '已失效';
                    break;
                default:
                    break;
            }
            return statusHtml;
        };
    });
    angular.module('BlurAdmin.customize').filter('formatSourceType', function () {
        return function (text) {
            var statusHtml = '';
            var text=Number(text);
            switch (text) {
                case 1:
                    statusHtml = 'PC';
                    break;
                case 2:
                    statusHtml = 'H5';
                    break;
                case 3:
                    statusHtml = 'IOS';
                    break;
                case 4:
                    statusHtml = 'Android';
                    break;

                default:
                    statusHtml = '-';
                    break;
            }
            return statusHtml;
        };
    });
    angular.module('BlurAdmin.customize').filter('formatIf', function () {
        return function (text) {
            var statusHtml = '';
            switch (text) {
                case 0:
                    statusHtml = '否';
                    break;
                case 1:
                    statusHtml = '是';
                    break;
                default:
                    break;
            }
            return statusHtml;
        };
    });
    angular.module('BlurAdmin.customize').filter('formatPrizeStatus', function () {
        return function (text) {
            var statusHtml = '';
            switch (text) {
                case 0:
                    statusHtml = '无异常';
                    break;
                case 1:
                    statusHtml = '已开奖';
                    break;
                default:
                    break;
            }
            return statusHtml;
        };
    });
    angular.module('BlurAdmin.customize').filter('formatConfigStatus', function () {
        return function (text) {
            var statusHtml = '';
            switch (text) {
                case 0:
                    statusHtml = '已停用';
                    break;
                case 1:
                    statusHtml = '启用中';
                    break;
                default:
                    break;
            }
            return statusHtml;
        };
    });
    angular.module('BlurAdmin.customize').filter('formatDomainType', function () {
        return function (text) {
            var statusHtml = '';
            switch (text) {
                case 1:
                    statusHtml = '推广域名';
                    break;
                case 2:
                    statusHtml = '代理域名';
                    break;
                case 3:
                    statusHtml = '业主域名';
                    break;
                default:
                    break;
            }
            return statusHtml;
        };
    });
    angular.module('BlurAdmin.customize').filter('formatAgentPeriodStatus', function () {
        return function (text) {
            var statusHtml = '';
            switch (text) {
                case 0:
                    statusHtml = '已停用';
                    break;
                case 1:
                    statusHtml = '已使用';
                    break;
                case 2:
                    statusHtml = '未使用';
                    break;
                default:
                    break;
            }
            return statusHtml;
        };
    });
    angular.module('BlurAdmin.customize').filter('moneyMode', function () {
        return function (text) {
            if (text == null || text == '') {
                return '——';
            }
            var moneyMode = '';
            var arr = text.split(',');
            for (var i = 0; i < arr.length; i++) {
                switch (arr[i]) {
                    case 'y':
                        moneyMode += '元';
                        break;
                    case 'j':
                        moneyMode += '角';
                        break;
                    case 'f':
                        moneyMode += '分';
                        break;
                    default:
                        break;
                }
            }
            return moneyMode;
        };
    });
    angular.module('BlurAdmin.customize').filter('lotteryCycle', function () { // 可以注入依赖
        return function (text) {
            var cycleHtml = '';
            var arr = text.split(',');
            for (var i = 0; i < arr.length; i++) {
                switch (Number(arr[i])) {
                    case 1:
                        cycleHtml += '周一 ';
                        break;
                    case 2:
                        cycleHtml += '周二 ';
                        break;
                    case 3:
                        cycleHtml += '周三 ';
                        break;
                    case 4:
                        cycleHtml += '周四 ';
                        break;
                    case 5:
                        cycleHtml += '周五 ';
                        break;
                    case 6:
                        cycleHtml += '周六 ';
                        break;
                    case 7:
                        cycleHtml += '周日 ';
                        break;
                }
            }
            return cycleHtml;
        };
    });
    angular.module('BlurAdmin.customize').filter('formatProgramModel', function () {
        //方案管理 模式
        return function (text) {
            var statusHtml = '';
            switch (text) {
                case 1:
                    statusHtml = '已通过';
                    break;
                case 2:
                    statusHtml = '待审核';
                    break;
                case 3:
                    statusHtml = '不通过';
                    break;
                default:
                    break;
            }
            return statusHtml;
        };
    });
    angular.module('BlurAdmin.customize').filter('resourceType', function () {
        //资源菜单类型
        return function (text) {
            var statusHtml = '';
            switch (text) {
                case 1:
                    statusHtml = '菜单';
                    break;
                case 2:
                    statusHtml = '按钮';
                    break;
                case 3:
                    statusHtml = '子菜单';
                    break;
                default:
                    break;
            }
            return statusHtml;
        };
    });

    angular.module('BlurAdmin.customize').filter('bulletinType', function () {
        return function (text) {
            var statusHtml = '';
            switch (text) {
                case 1:
                    statusHtml = '系统公告';
                    break;
                case 2:
                    statusHtml = '游戏公告';
                    break;
                default:
                    break;
            }
            return statusHtml;
        };
    });

    angular.module('BlurAdmin.customize').filter('formartNumbers', function () {
        return function (text, startTime, endTime) {
            var currTime = new Date().getTime();
            if (text == null) {
                if (currTime > startTime && currTime < endTime) {
                    return "销售中";
                }
                if (currTime > endTime) {
                    return "正在开奖";
                }
            }
            return text;
        };
    });

    // 退佣状态
    angular.module('BlurAdmin.customize').filter('formatRetirementStatus', function () {
        return function (text) {
            var statusHtml = '';
            switch (text) {
                case 0:
                    statusHtml = '未处理';
                    break;
                case 1:
                    statusHtml = '已取消';
                    break;
                case 2:
                    statusHtml = '已退佣';
                    break;
                case 3:
                    statusHtml = '已挂账';
                    break;
                default:
                    statusHtml = '';
                    break;
            }
            return statusHtml;
        };
    });

    // 退佣判定
    angular.module('BlurAdmin.customize').filter('formatRetirementJudge', function () {
        return function (text) {
            var statusHtml = '';
            switch (text) {
                case 1:
                    statusHtml = '未达门槛';
                    break;
                case 2:
                    statusHtml = '未达标';
                    break;
                case 3:
                    statusHtml = '已达资格';
                    break;
                default:
                    statusHtml = '';
                    break;
            }
            return statusHtml;
        };
    });
})();
