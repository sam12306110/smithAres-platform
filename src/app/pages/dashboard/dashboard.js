/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').directive('onFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        }
    }).controller('dashboard', dashboard);

    /** @ngInject */
    function dashboard($scope, $cookieStore,lotteryConst, baConfig, layoutPaths,httpFactory,common,todoService,custNotify) {
        var access_token = $cookieStore.get('access_token1');
        var layoutColors = baConfig.colors;
        var id='';
        var menuBtn='';
      /*  var id =document.getElementById("zoomAxisChart").getAttribute('id');*/
        if (access_token == null || access_token == '') {
            window.location.href = 'auth.html';
        }
        var pieColor = '#cccccc';
        var url=lotteryConst.apiRoot +'/forseti/apis/mongo/plat/orderDateTotalCount';
        $scope.agentFlag=!lotteryConst.agentFlag;
        function initPage() {
            $scope.selectParam = {
                lotterySelected:[],
                lottery:[{id: null, value: '全部',sideType:2}].concat(lotteryConst.lottery),
                time1:'',
                time2:''

            };
            $scope.queryParam = {
                pdateStart:"",
                pdateEnd:"",
                lotteryIds:''


            };



        }
        //日期控件 事件ngRepeatFinished作用是延迟加载
        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
             id =document.getElementById("zoomAxisChart").getAttribute('id');
            menuBtn=document.getElementById("menuBtn");
            menuBtn.onclick =$scope.onSearch;
            window.onresize=$scope.onSearch;

            var sodateStart = new common.soDate(); // 声明一个新的日期控件
            sodateStart.init({//初始化控件
                $id: 'startTime',//input的id，记得给input加上so-date指令
                formart: 'yyyy/MM/dd'// 'yyyy/MM/dd HH:mm:ss'如果只要日期写'yyyy/MM/dd'
            }, function (res) {
                console.log(res)
                $scope.selectParam.startTime = res;
                $('#startTime').val(res);
            });
            var sodateEnd = new common.soDate();// 声明一个新的日期控件
            sodateEnd.init({//初始化控件
                $id: 'endTime',//input的id，记得给input加上so-date指令
                formart: 'yyyy/MM/dd'// 'yyyy/MM/dd HH:mm:ss'如果只要日期写'yyyy/MM/dd'
            }, function (res) {
                $scope.selectParam.endTime = res;
                $('#endTime').val(res );

            });

        });

        $scope.dateFun=function () {
          var  date = {
                startTime: common.getDateDay('beforeWeek'),
                endTime: common.getDateDay('today')
            };

            $('#startTime').val(date.startTime );
            $('#endTime').val(date.endTime );
            $scope.selectParam.startTime = date.startTime ;
            $scope.selectParam.endTime = date.endTime ;

        };
        initPage();
      $scope.dateFun();
        $scope.insertFlg=function (str,flg,sn) {
            var newstr="";
            for(var i=0;i<str.length;i+=sn){
                var tmp=str.substring(i, i+sn);
                newstr+=tmp+flg;
            }
            newstr=newstr.substring(0,newstr.length-1).replace(/\-/,'')
            return newstr;
        };
        $scope.onSearch = function () {
            if ($scope.selectParam.startTime) {
                $scope.selectParam.time1=new Date($scope.selectParam.startTime).getTime();
                $scope.queryParam.pdateStart = $scope.selectParam.startTime.replace(/\//g,'');
            }
            if ($scope.selectParam.endTime  ) {
                $scope.selectParam.time2=new Date($scope.selectParam.endTime).getTime();
                $scope.queryParam.pdateEnd =$scope.selectParam.endTime.replace(/\//g,'') ;
            }
            if(($scope.selectParam.time2-$scope.selectParam.time1)>24*60*60*1000*31){
                custNotify.warning('参数错误', '时间查询不能超过31天');
                return false
            }
            $scope.queryParam.lotteryIds=null;
            if($scope.selectParam.lotterySelected.length==1){
                $scope.queryParam.lotteryIds=$scope.selectParam.lotterySelected[0].id;
            }else if($scope.selectParam.lotterySelected.length>1){
                var arr=[];
                for(var i=0;i<$scope.selectParam.lotterySelected.length;i++){
                    arr.push($scope.selectParam.lotterySelected[i].id)
                }
                $scope.queryParam.lotteryIds=arr.toString();
            }

            httpFactory.getList(url, 'GET', null, $scope.queryParam).then(function (result) {
                   var data=result.data;
                   var reulstData=[];

              for(var i=0;i<data.length;i++){
                   reulstData.push(data[i])
                    for(var k in reulstData[i]){
                        if(k=='platInfoId' || k=='platInfoName' || k=='totalChaseCount' || k=='totalChaseCount'||k=='totalBetCount'){
                            delete reulstData[i][k]
                        }else if(k!=='pdate'){
                            reulstData[i][k]= reulstData[i][k]/100
                        }else if(k=='pdate'){
                            reulstData[i][k]=$scope.insertFlg(reulstData[i][k]+'','-',2)
                            /*$scope.insertFlg(reulstData[i][k]+'','-',2)
                            console.log()*/
                        }
                    }
                   reulstData[i].totalProfit=Number(accSub(reulstData[i].totalBetAmount,reulstData[i].totalPayoff))
                }

              $scope.data=reulstData;
                var chart = AmCharts.makeChart(id, {
                    "type": "serial",
                    "theme": "none",
                    "color": layoutColors.defaultText,
                    "dataDateFormat": "YYYY-MM-DD",
                    "precision": 2,
                    "valueAxes": [{
                        color: layoutColors.defaultText,
                        axisColor: layoutColors.defaultText,
                        gridColor: layoutColors.defaultText,
                        "id": "v1",
                        "title": "总销售额         中奖" ,
                        "position": "left",
                        "autoGridCount": false,
                        "labelFunction": function(value) {
                            return "￥" + Math.round(value) + "元";
                        }
                    }, {
                        color: layoutColors.defaultText,
                        axisColor: layoutColors.defaultText,
                        gridColor: layoutColors.defaultText,
                        "id": "v2",
                        "title": "损 益",
                        "gridAlpha": 0,
                        "position": "right",
                        "autoGridCount": false,
                        "labelFunction": function(value) {
                            return "￥" + Math.round(value) + "元";
                        }
                    }],
                    "graphs": [{
                        "id": "g4",
                        "valueAxis": "v1",
                        color: layoutColors.defaultText,
                        "lineColor": layoutColors.primary,
                        "fillColors": layoutColors.primary,
                        "fillAlphas": 0.9,
                        "lineAlpha": 0.9,
                        "type": "column",
                        "title": "总销售额 ",
                        "valueField": "totalBetAmount",
                        "clustered": false,
                        "columnWidth": 0.3,
                        "balloonText": "[[title]]<br/><b style='font-size: 130%'> ￥[[value]]元</b>"
                    }, {
                        "id": "g1",
                        "valueAxis": "v1",
                        "bullet": "round",
                        "bulletBorderAlpha": 1,
                        "bulletColor": layoutColors.defaultText,
                        color: layoutColors.defaultText,
                        "bulletSize": 5,
                        "hideBulletsCount": 50,
                        "lineThickness": 2,
                        "lineColor": layoutColors.danger,
                        "type": "smoothedLine",
                        "title": "中奖",
                        "useLineColorForBulletBorder": true,
                        "valueField": "totalPayoff",
                        "balloonText": "[[title]]<br/><b style='font-size: 130%'>￥[[value]]元</b>"
                    }, {
                        "id": "g2",
                        "valueAxis": "v2",
                        color: layoutColors.defaultText,
                        "bullet": "round",
                        "bulletBorderAlpha": 1,
                        "bulletColor": layoutColors.defaultText,
                        "bulletSize": 5,
                        "hideBulletsCount": 50,
                        "lineThickness": 2,
                        "lineColor": layoutColors.warning,
                        "type": "smoothedLine",
                        "dashLength": 5,
                        "title": "损益",
                        "useLineColorForBulletBorder": true,
                        "valueField": "totalProfit",
                        "balloonText": "[[title]]<br/><b style='font-size: 130%'>￥[[value]]元</b>"
                    }],
                    "chartScrollbar": {
                        "graph": "g1",
                        "oppositeAxis": false,
                        "offset": 30,
                        gridAlpha: 0,
                        color: layoutColors.defaultText,
                        scrollbarHeight: 50,
                        backgroundAlpha: 0,
                        selectedBackgroundAlpha: 0.05,
                        selectedBackgroundColor: layoutColors.defaultText,
                        graphFillAlpha: 0,
                        autoGridCount: true,
                        selectedGraphFillAlpha: 0,
                        graphLineAlpha: 0.2,
                        selectedGraphLineColor: layoutColors.defaultText,
                        selectedGraphLineAlpha: 1
                    },
                    "chartCursor": {
                        "pan": true,
                        "cursorColor" : layoutColors.danger,
                        "valueLineEnabled": true,
                        "valueLineBalloonEnabled": true,
                        "cursorAlpha": 0,
                        "valueLineAlpha": 0.2
                    },
                    "categoryField": "pdate",
                    "categoryAxis": {
                        "axisColor": layoutColors.defaultText,
                        "color": layoutColors.defaultText,
                        "gridColor": layoutColors.defaultText,
                        "parseDates": false,
                        "dashLength": 1,
                        "minorGridEnabled": true
                    },
                    "legend": {
                        "useGraphSettings": true,
                        "position": "top",
                        "color": layoutColors.defaultText
                    },
                    "balloon": {
                        "borderThickness": 1,
                        "shadowAlpha": 0
                    },
                    "export": {
                        "enabled": true
                    },
                    "dataProvider": $scope.data,
                    pathToImages: layoutPaths.images.amChart
                });

                var tt = $("text");
                $.each(tt, function (k,v) {
                    if(v.getAttribute("text-anchor") == "end") v.setAttribute("text-anchor","middle")
                })



            }, function (result) {

            });
        };

        if($scope.agentFlag){
            $scope.onSearch();

        }


        /**
         * 彩种改变监听事件
         */
        $scope.$watch("selectParam.lotterySelected", function () {
            $scope.onSearch();
        });

        $scope.onReset = function () {
            initPage();

        };
        $scope.charts = [{
            color: pieColor,
            description: 'New Visits',
            stats: '57,820',
            icon: 'person',
        }, {
            color: pieColor,
            description: 'Purchases',
            stats: '$ 89,745',
            icon: 'money',
        }, {
            color: pieColor,
            description: 'Active Users',
            stats: '178,391',
            icon: 'face',
        }, {
            color: pieColor,
            description: 'Returned',
            stats: '32,592',
            icon: 'refresh',
        }
        ];



    }

})();

