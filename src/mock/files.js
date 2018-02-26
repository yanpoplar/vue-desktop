module.exports = {
    desktop: [{
            name: "智能选课",
            type: "selectCourse",
            icon: "#icon-zhinengpaike",
            apps: [
                {
                    icon: "#icon-CombinedShape",
                    name: "选课管理",
                    type: "coursemanage"
                },
                {
                    icon: "#icon-banjifenxi",
                    name: "智能分班",
                    type: "divideclass"
                },
                {
                    icon: "#icon-xuankebaoming1",
                    name: "智能排课",
                    type: "intelCourse"
                }
            ]
        },
        {
            name: "档案中心",
            type: "documentCenter",
            icon: "#icon-dangan",
            apps: [{
                    icon: "#icon-kebiao1",
                    name: "学生档案管理",
                    type: "studentDocumentManage"
            }, {
                icon: "#icon-kebiao1",
                name: "课程档案管理",
                type: "courseDocumentManage"
            }],
            options: {
                data: { }
            }
        }, {
            name: "日志中心",
            type: "logCenter",
            icon: "#icon-dangan",
            apps: [{
                icon: "#icon-kebiao1",
                name: "导入类日志",
                type: "importlog"
            }, {
                icon: "#icon-kebiao1",
                name: "操作类日志",
                type: "operatelog"
            }, {
                icon: "#icon-kebiao1",
                name: "安全类日志",
                type: "safelog"
            }],

            options: {
                data: {}
            }
        }
    ],
    footer: [{
            name: "智能选课",
            app: "browser",
            icon: "#icon-zhinengpaike",
            options: {
                data: {
                    index: "http://baidu.com"
                },
                height: function () {
                    return window._h * 0.8;
                },
                width: function () {
                    return window._w * 0.8;
                }
            }
        },
        {
            name: "学生综合素质评价",
            app: "browser",
            icon: "#icon-xueshengzonghesuzhipingjia",
            options: function () {
                return {
                    data: {
                        index: "http://v2ex.com"
                    },
                    height: window._h * 0.8,
                    width: window._w * 0.8
                }
            }
        },
        {
            name: "学生综合",
            app: "browser",
            icon: "#icon-xueshengzonghesuzhipingjia",
            options: function () {
                return {
                    data: {
                        index: "http://v2ex.com"
                    },
                    height: window._h * 0.8,
                    width: window._w * 0.8
                }
            }
        }
    ]
};
