/**
 Created by Dio on 17-9.
 http://inhu.net
 */

(function () {
    "use strict";
    (function () {
        var NGUeditor;
        NGUeditor = angular.module("ng.ueditor", []);
        NGUeditor.directive("ueditor", [
            function () {
                return {
                    restrict: "C",
                    require: "ngModel",
                    scope: {
                        config: "=",
                        ready: "="
                    },
                    link: function ($S, element, attr, ctrl) {
                        var _NGUeditor, _updateByRender;
                        _updateByRender = false;
                        _NGUeditor = (function () {
                            function _NGUeditor() {
                                this.bindRender();
                                this.initEditor();
                                return;
                            }


                            /**
                             * 初始化编辑器
                             * @return {[type]} [description]
                             */

                            _NGUeditor.prototype.initEditor = function () {
                                var _UEConfig, _editorId, _self;
                                _self = this;
                                if (typeof UE === 'undefined') {
                                    console.error("Please import the local resources of ueditor!");
                                    return;
                                }
                                // _UEConfig = $S.config ? $S.config : {
                                _UEConfig = {
                                    toolbars: [
                                        [
                                            'source', //源代码
                                            // 'fullscreen', //全屏
                                            'anchor', //锚点
                                            'undo', //撤销
                                            'redo', //重做
                                            'bold', //加粗
                                            'indent', //首行缩进
                                            // 'snapscreen', //截图
                                            'italic', //斜体
                                            'underline', //下划线
                                            'strikethrough', //删除线
                                            'subscript', //下标
                                            'fontborder', //字符边框
                                            'superscript', //上标
                                            'formatmatch', //格式刷
                                            'blockquote', //引用
                                            'pasteplain', //纯文本粘贴模式
                                            'selectall', //全选
                                            // 'print', //打印
                                            // 'preview', //预览
                                            'horizontal', //分隔线
                                            'removeformat', //清除格式
                                            'time', //时间
                                            'date', //日期
                                            'unlink', //取消链接
                                            'insertrow', //前插入行
                                            'insertcol', //前插入列
                                            'mergeright', //右合并单元格
                                            'mergedown', //下合并单元格
                                            'deleterow', //删除行
                                            'deletecol', //删除列
                                            'splittorows', //拆分成行
                                            'splittocols', //拆分成列
                                            'splittocells', //完全拆分单元格
                                            'deletecaption', //删除表格标题
                                            'inserttitle', //插入标题
                                            'mergecells', //合并多个单元格
                                            'deletetable', //删除表格
                                            'cleardoc', //清空文档
                                            'insertparagraphbeforetable', //"表格前插入行"
                                            // 'insertcode', //代码语言
                                            'fontfamily', //字体
                                            'fontsize', //字号
                                            'paragraph', //段落格式
                                            // 'simpleupload', //单图上传
                                            'insertimage', //多图上传
                                            'edittable', //表格属性
                                            'edittd', //单元格属性
                                            // 'link', //超链接
                                            // 'emotion', //表情
                                            // 'spechars', //特殊字符
                                            // 'searchreplace', //查询替换
                                            // 'map', //Baidu地图
                                            // 'gmap', //Google地图
                                            // 'insertvideo', //视频
                                            // 'help', //帮助
                                            'justifyleft', //居左对齐
                                            'justifyright', //居右对齐
                                            'justifycenter', //居中对齐
                                            'justifyjustify', //两端对齐
                                            'forecolor', //字体颜色
                                            'backcolor', //背景色
                                            'insertorderedlist', //有序列表
                                            'insertunorderedlist', //无序列表
                                            'directionalityltr', //从左向右输入
                                            'directionalityrtl', //从右向左输入
                                            'rowspacingtop', //段前距
                                            'rowspacingbottom', //段后距
                                            'pagebreak', //分页
                                            // 'insertframe', //插入Iframe
                                            'imagenone', //默认
                                            'imageleft', //左浮动
                                            'imageright', //右浮动
                                            // 'attachment', //附件
                                            'imagecenter', //居中
                                            // 'wordimage', //图片转存
                                            'lineheight', //行间距
                                            'edittip ', //编辑提示
                                            'customstyle', //自定义标题
                                            'autotypeset', //自动排版
                                            // 'webapp', //百度应用
                                            'touppercase', //字母大写
                                            'tolowercase', //字母小写
                                            // 'background', //背景
                                            // 'template', //模板
                                            // 'scrawl', //涂鸦
                                            // 'music', //音乐
                                            'inserttable', //插入表格
                                            'drafts', // 从草稿箱加载
                                            // 'charts', // 图表
                                        ]
                                    ],
                                    "imageActionName": "uploadimage", /* 执行上传图片的action名称 */
                                    "imageFieldName": "upfile", /* 提交的图片表单名称 */
                                    "imageMaxSize": 2048000, /* 上传大小限制，单位B */
                                    "imageAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"], /* 上传图片格式显示 */
                                    "imageCompressEnable": true, /* 是否压缩图片,默认是true */
                                    "imageCompressBorder": 1600, /* 图片压缩最长边限制 */
                                    "imageInsertAlign": "none", /* 插入的图片浮动方式 */
                                    "imageUrlPrefix": "http://192.168.3.9/ds/ueditor/net/", /* 图片访问路径前缀 */
                                    autoHeightEnabled: true,
                                    autoFloatEnabled: true,
                                    // initialFrameWidth: 470,  //初始化编辑器宽度,默认1000
                                    // initialFrameHeight: 280  //初始化编辑器高度,默认320
                                    zIndex: 9000000
                                };
                                _editorId = attr.id ? attr.id : "_editor" + (Date.now());
                                element[0].id = _editorId;
                                this.editor = new UE.ui.Editor(_UEConfig);
                                this.editor.render(_editorId);
                                return this.editor.ready(function () {
                                    _self.editorReady = true;
                                    _self.editor.addListener("contentChange", function() {
                                        ctrl.$setViewValue(_self.editor.getContent());
                                        if (!_updateByRender) {
                                            if (!$S.$$phase) {
                                                $S.$apply();
                                            }
                                        }
                                        _updateByRender = false;
                                    });

                                    if (_self.modelContent && _self.modelContent.length > 0) {
                                        _self.setEditorContent();
                                    }
                                    if (typeof $S.ready === "function") {
                                        $S.ready(_self.editor);
                                    }
                                    $S.$on("$destroy", function () {
                                        if (!attr.id && UE.delEditor) {
                                            UE.delEditor(_editorId);
                                        }
                                    });
                                });
                            };

                            _NGUeditor.prototype.setEditorContent = function (content) {
                                if (content == null) {
                                    content = this.modelContent;
                                }
                                if (this.editor && this.editorReady) {
                                    this.editor.setContent(content);
                                }
                            };

                            _NGUeditor.prototype.bindRender = function () {
                                var _self;
                                _self = this;
                                ctrl.$render = function () {
                                    _self.modelContent = (ctrl.$isEmpty(ctrl.$viewValue) ? "" : ctrl.$viewValue);
                                    _updateByRender = true;
                                    _self.setEditorContent();
                                };
                            };

                            return _NGUeditor;

                        })();
                        new _NGUeditor();
                    }
                };
            }
        ]);
    })();

}).call(this);

//# sourceMappingURL=angular-ueditor.js.map
