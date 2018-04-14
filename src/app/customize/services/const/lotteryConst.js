/**
 * @author Ivan
 * created on 2017-9-18
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.customize').service('lotteryConst', lotteryConst);

    /** @ngInject */
    function lotteryConst() {
        this.pageSize = 15;

        this.apiRoot = globalPath;
        this.imgUrl = globalImgUrl;
        this.aresPath = this.apiRoot + '/ares-config/apis';
        this.aresPathPlat = this.apiRoot + '/ares-config/apis/plat';
        this.uaaPath = this.apiRoot + '/uaa';
        this.uaaPathPlat = this.apiRoot + '/uaa/apis/plat';
        this.hemes = this.apiRoot + '/hermes';
        this.hermes = this.apiRoot + '/hermes';
        this.hermesApi = this.apiRoot + '/hermes/api/plat';
        this.hermesApis = this.apiRoot + '/hermes/apis/plat';
        this.aresAccount = this.apiRoot + '/areaaccount/apis/plat';
        this.riskManageBasePath = this.apiRoot + '/riskmanagementweb/apis/plat';
        this.aresAnalysisPath = this.apiRoot + '/aresanalysis/apis';
        this.aresCmsPath = this.apiRoot + '/ares-cms/apis/plat';
        this.payConfigPath = this.apiRoot + '/arespayment/apis/plat';
        this.paymentPath = this.apiRoot + '/arespayment/apis/platinfo';
        this.paymentPlatPath = this.apiRoot + '/arespayment/apis/plat';


        /**
         * 提示信息
         * @type {{success: string, fail: string}}
         */
        this.msgSelect = {success: '查询成功', fail: '查询失败', nullSeq: '查询条件为空', nullRes: '返回数据为空'};
        this.msgAdd = {success: '新增成功', fail: '新增失败'};
        this.msgEdit = {success: '修改成功', fail: '修改失败'};
        this.msgServer = {success: '服务请求成功', fail: '服务请求失败'};

        this.lottery = [
            {id: 1, value: '重庆时时彩', lotteryType: 1, sideType: 1},
            {id: 2, value: '重庆时时彩双面彩', lotteryType: 1, sideType: 2},
            {id: 3, value: '江西11选5', lotteryType: 2, sideType: 1},
            {id: 4, value: '江西11选5双面彩', lotteryType: 2, sideType: 2},
            {id: 5, value: '江苏快3', lotteryType: 3, sideType: 1},
            {id: 6, value: '江苏快3双面彩', lotteryType: 3, sideType: 2},
            {id: 7, value: '北京pk10', lotteryType: 4, sideType: 1},
            {id: 8, value: '北京pk10双面彩', lotteryType: 4, sideType: 2},
            {id: 9, value: '香港六合彩', lotteryType: 6, sideType: 1},
            {id: 10, value: '香港六合彩双面彩', lotteryType: 6, sideType: 2},
            {id: 11, value: '天津时时彩', lotteryType: 1, sideType: 1},
            {id: 12, value: '天津时时彩双面彩', lotteryType: 1, sideType: 2},
            {id: 13, value: '新疆时时彩', lotteryType: 1, sideType: 1},
            {id: 14, value: '新疆时时彩双面彩', lotteryType: 1, sideType: 2},
            {id: 15, value: '广东11选5', lotteryType: 2, sideType: 1},
            {id: 16, value: '广东11选5双面彩', lotteryType: 2, sideType: 2},
            {id: 17, value: '山东11选5', lotteryType: 2, sideType: 1},
            {id: 18, value: '山东11选5双面彩', lotteryType: 2, sideType: 2},
            {id: 19, value: '安徽快3', lotteryType: 3, sideType: 1},
            {id: 20, value: '安徽快3双面彩', lotteryType: 3, sideType: 2},
            {id: 21, value: '湖北快3', lotteryType: 3, sideType: 1},
            {id: 22, value: '湖北快3双面彩', lotteryType: 3, sideType: 2},
            {id: 23, value: '幸运飞艇', lotteryType: 4, sideType: 1},
            {id: 24, value: '幸运飞艇双面彩', lotteryType: 4, sideType: 2},
            {id: 101, value: '秒速时时彩', lotteryType: 1, sideType: 1},
            {id: 102, value: '秒速时时彩双面彩', lotteryType: 1, sideType: 2},
            {id: 103, value: '秒速11选5', lotteryType: 2, sideType: 1},
            {id: 104, value: '秒速11选5双面彩', lotteryType: 2, sideType: 2},
            {id: 105, value: '秒速快3', lotteryType: 3, sideType: 1},
            {id: 106, value: '秒速快3双面彩', lotteryType: 3, sideType: 2},
            {id: 107, value: '秒速赛车', lotteryType: 4, sideType: 1},
            {id: 108, value: '秒速赛车双面彩', lotteryType: 4, sideType: 2},
            {id: 109, value: '五分六合彩', lotteryType: 6, sideType: 1},
            {id: 110, value: '五分六合彩双面彩', lotteryType: 6, sideType: 2}
        ];

        this.sourceTerminal = [
            {id: 1, value: '电脑'},
            {id: 2, value: 'H5'},
            {id: 3, value: 'IOS'},
            {id: 4, value: 'Android'}
        ]
        this.status = [
            {id: null, value: '全部'},
            {id: 1, value: '启用中'},
            {id: 0, value: '已停用'}
        ];

        this.statusExcRecord = [
            {id: null, value: '全部'},
            {id: 1, value: '处理中'},
            {id: 2, value: '处理成功'}
        ];
        this.statusLock = [
            {id: null, value: '全部'},
            {id: 1, value: '启用中'},
            {id: 0, value: '已冻结'}
        ];

        this.auditStatus = [
            {id: null, value: '全部'},
            {id: 0, value: '待审核'},
            {id: 1, value: '已通过'},
            {id: 2, value: '已拒绝'}
        ];

        this.lotteryStatus = [
            {id: null, value: '全部'},
            {id: 3, value: '不通过'},
            {id: 1, value: '已通过'},
            {id: 2, value: '待审核'},
            {id: 4, value: '已失效'}
        ];

        this.fastDate = [
            {id: '今天', name: '今天'},
            {id: '昨天', name: '昨天'},
            {id: '近三天', name: '近三天'},
            {id: '本周', name: '本周'},
            {id: '上周', name: '上周'},
            {id: '本月', name: '本月'}
        ];
        this.bulletinType = [
            {id: null, value: '全部'},
            {id: 1, value: '系统公告'},
            {id: 2, value: '游戏公告'}
        ];


        this.state = [
            {id: null, value: '全部'},
            {id: 4, value: '已成功'},
            {id: 0, value: '待处理'},
            {id: 5, value: '已锁定'},
            {id: 3, value: '已失败'}
        ];
        this.stateOlin = [
            {id: null, value: '全部'},
            {id: 4, value: '已成功'},
            {id: 0, value: '待处理'},
            {id: 3, value: '失败'}
        ];

        this.payMethod = [
            {id: null, value: '全部'},
            {id: 1, value: '网银存款'},
            {id: 2, value: '支付宝支付'},
            {id: 3, value: '微信支付'},
            {id: 4, value: '柜员机现金存款'},
            {id: 5, value: '柜员机转账'},
            {id: 6, value: '银行柜台存款'},
            {id: 7, value: '其他支付'}
        ];

        // 存款项目
        this.depositType = [
            {id: 10, value: '人工存款'},
            {id: 11, value: '存款优惠'},
            /* {id: 12, value: '存款优惠'},*/
            {id: 13, value: '活动优惠'},
            {id: 14, value: '返点优惠'},
            {id: 15, value: '负数额度清零'},
            {id: 16, value: '取消提款'},
            {id: 17, value: '其他入款'}
        ];
        // 取款项目
        this.withdrawalType = [
            {id: 20, value: '重复出款'},
            {id: 21, value: '手动申请出款'},
            {id: 22, value: '公司入款存误'},
            {id: 23, value: '公司负数回冲'},
            {id: 24, value: '扣除非法下注派彩'},
            {id: 25, value: '放弃存款优惠'},
            {id: 26, value: '其他出款'}
        ];
        this.fixedCode = [
            {id: 1, value: '录入官方实际开奖时间', type: 1},
            {id: 2, value: '号码验证失败需补录', type: 2},
            {id: 3, value: '撤销本期方案', type: 2},
            {id: 4, value: '撤销后期追号', type: 2},
            {id: 5, value: '暂缓派奖', type: 1},
            {id: 6, value: '继续派奖', type: 2},
            {id: 7, value: '重新录入开奖号码', type: 2}
        ];
        this.logType=[
            // {id:1,value:'查询'},
            // {id:2,value:'添加'},
            {id:3,value:'修改'},
            {id:4,value:'审核'},
            // {id:5,value:'删除'},
            {id:6,value:'登陆'},
            {id:7,value:'登出'},
            // {id:8,value:'充值'},
            // {id:9,value:'提现'},
            // {id:10,value:'导出'},
            {id:11,value:'人工存入'},
            {id:12,value:'人工提出'}
        ];

        this.dateType = [
            {id: 1, value: '今天'},
            {id: 2, value: '昨天'},
            {id: 3, value: '近三天'},
            {id: 4, value: '本周'},
            {id: 5, value: '本月'}
        ];
        this.sourceType = [
            {id: 1, value: 'PC'},
            {id: 2, value: 'H5'},
            {id: 4, value: 'Android'},
            {id: 3, value: 'Ios'}
        ];
        this.cycle = [{msg: '不更新', val: 0},
            {msg: '20S', val: 20},
            {msg: '30S', val: 30},
            {msg: '40S', val: 40},
            {msg: '50S', val: 40}
        ];
        this.deposit = [
            {id: 1, value: '公司入款'},
            {id: 3, value: '线上入款'},
            {id: 5, value: '人工入款'}
        ];
        this.dispensing = [
            {id: 7, value: '会员出款'},
            {id: 8, value: '人工出款'}
        ];
        this.PreferentialProjects = [
            {id: 1, value: '公司入款优惠'},
            {id: 3, value: '线上入款优惠'},
            {id: 4, value: '注册优惠'},
            {id: 11, value: '存款优惠'},
            {id: 13, value: '活动优惠'},
            {id: 14, value: '返点优惠'}
            // {id:9,value:'积分活动优惠'}
        ];
        this.typesName = [{id: 1, value: "会员账号"}, {id: 2, value: "代理账号"}];
        this.domainType = [
            {id: null, value: '请选择'},
            {id: 1, value: '推广域名'},
            {id: 2, value: '代理域名'},
            {id: 3, value: '业主域名'}
        ];

        //退佣状态
        this.retirementStatus = [
            {id: null, value: '全部'},
            {id: 0, value: '未处理'},
            {id: 1, value: '已取消'},
            {id: 2, value: '已退佣'},
            {id: 3, value: '已挂账'}
        ];
        //退佣判定
        this.retirementJudge = [
            {id: null, value: '全部'},
            {id: 1, value: '未达门槛'},
            {id: 3, value: '已达资格'},
            {id: 2, value: '未达标'}
        ];

        this.getCookie = function (name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return null;
        };

        this.agentFlag = Number(this.getCookie('agentFlag'));
    }
})();
