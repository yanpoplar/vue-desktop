module.exports = {
    file: [
        {
            text: "打开",
            fontclass:"#icon-zhitiaodakai",
            iconStyle: "color:#fe1b36",
            key:"Enter",
            type: "open",
            disabled: false,
            callback: function () {
                $event.emit('open:menu')
            }
        },
        {
            text: "删除",
            fontclass: "#icon-close",
            key: "Del",
            type: "delete",
            iconStyle:"color:#fe1b36",
            disabled: false,
            callback: function () {
                $event.emit('delete:menu')
            }
        },
        // {
        //     text: "复制",
        //     type: "copy",
        //     disabled: false,
        //     callback: function () {
        //         $event.emit('copy:menu')
        //     }
        // },
        {
            type: "divide"
        },
        // {
        //     text: "删除",
        //     type: "delete",
        //     disabled: false,
        //     callback: function () {
        //         $event.emit('delete:menu')
        //     }
        // },
        {
            text: "属性",
            fontclass: "#icon-shuxingbiao",
            iconStyle: "color:#61de2a",
            key: "Alt+i",
            type: "prop",
            callback: function (file) {
                $event.emit('openFileProp:menu', file);
            }
        }
    ],
    wallpaper: [
        {
            text: "刷新",
            type: "refresh",
            disabled: false,
            callback: function () {
                $event.emit('refresh:menu')
            }
        },
        {
            text: '全选',
            type: "selectAll",
            callback: function () {
                $event.emit('selectAll:menu');
            }
        },
        {
            text: "粘贴",
            type: "paste",
            disabled: true,
            callback: function () {
                $event.emit('paste:menu')
            }
        },
        {
            type: 'divide'
        },
        {
            text: "恢复图标",
            type: "resetAllFile",
            callback: function () {
                $event.emit('resetFile:menu');
            }
        }
    ],
    usercenter: [
        {
            text: "打开",
            fontclass: "#icon-zhitiaodakai",
            iconStyle: "color:#fe1b36",
            key: "Enter",
            type: "open",
            disabled: false,
            callback: function () {
                $event.emit('open:menu')
            }
        },
        {
            text: "删除",
            fontclass: "#icon-close",
            key: "Del",
            type: "delete",
            iconStyle: "color:#fe1b36",
            disabled: false,
            callback: function () {
                $event.emit('delete:menu')
            }
        },
        // {
        //     text: "复制",
        //     type: "copy",
        //     disabled: false,
        //     callback: function () {
        //         $event.emit('copy:menu')
        //     }
        // },
        {
            type: "divide"
        },
        // {
        //     text: "删除",
        //     type: "delete",
        //     disabled: false,
        //     callback: function () {
        //         $event.emit('delete:menu')
        //     }
        // },
        {
            text: "属性",
            fontclass: "#icon-shuxingbiao",
            iconStyle: "color:#61de2a",
            key: "Alt+i",
            type: "prop",
            callback: function (file) {
                $event.emit('openFileProp:menu', file);
            }
        }
    ]
}