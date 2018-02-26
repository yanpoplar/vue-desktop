var util = require('service/util');
var App = require('service/app');
var File = require('service/file');
var $event = require('service/event');
var sourceFile = require('mock/files.js');

var _this = {
    apps:[],
    files: (sourceFile.desktop).map(function(a){
        return new File(a);
    }),
    footerapps: (sourceFile.footer).map(function (a) {
        return new File(a);
    }),
    changeFile:function(file,index){
        var num = this.files.indexOf(file);
        var item = sourceFile.desktop[num];
        sourceFile.desktop.splice(num, 1);
        sourceFile.desktop.splice(index, 0, item);

    },
    addfile:function(file){
        var flag = true;
        for (item in this.files) {
            if (file.name == this.files[item].name){
                flag = false;
            }
        }
        if(flag){
            sourceFile.desktop.push(file);
            var num = this.footerapps.indexOf(file);
            sourceFile.footer.splice(num, 1);
        }
    },
    addfooterapps: function(file,index){
        var flag = true;
        for (item in this.footerapps) {
            if (file.name == this.footerapps[item].name) {
                flag = false;
            }
        }
        if (flag) {
            var num = this.files.indexOf(file);
            sourceFile.desktop.splice(num, 1);
            sourceFile.footer.splice(index, 0, file);
        }
    },
    openApp:function (app) {
        var flag = true;
        for (item in this.apps) {
            if (app.title == this.apps[item].title) {
                flag = false;
                this.apps[item]._show = true;
                this.apps[item]._focus = true;
            }
        }
        if (flag) {
            this.apps.push(app);
            app.show();
        }
    },
    resetAllFile:function () {
        this.files.length = 0;
        this.footerapps.length = 0;
        sourceFile.desktop.forEach(function (a,index) {
            _this.files.push(new File(a))
        });
        sourceFile.footer.forEach(function (a, index) {
            _this.footerapps.push(new File(a))
        });
        $event.emit('file:reset');
    },
    checkFocus:function (app) {
        _this.apps.forEach(function (item) {
            if (item === app) {
                item._focus = true;
            }else {
                item._focus = false;
            }

        })

    },
    checkClose:function () {
        util.arrayRemove(this.apps,function (a) {
            return a._close;
        });
    },
};

$event.on('app:close',function () {
    _this.checkClose();
});
$event.on('app:focus',function (app) {
    _this.checkFocus(app);
});
$event.on('mousedown:wallpaper',function () {
    _this.apps.forEach(function (app) {
        app._focus = false;
    })
});
$event.on('click:desktop', function () {
    _this.apps.forEach(function (app) {
        app._focus = false;
        app.hide();
    })
});
$event.on('click:appstore', function () {
    _this.apps.forEach(function (app) {
        app._focus = false;
        app.hide();
    })
});
$event.on('window:resize',function () {
    _this.apps.forEach(function (app) {
        app.checkLayout();
    })
});


module.exports = _this;