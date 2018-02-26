
function delay(cb,n){
    setTimeout(cb,n||0);
}

function App(o) {
    var _default = {
        _show: true,
        title: "app",
        icon:"",
        _focus: false,
        titleHeight:42,
        type: null,
        top: null,
        left: null,
        height: 634,
        width: 924,
        data:null,
        animating:false,
        maximized: false,
        oldPosition: null,
        resizable:true,
        singleton:false,
        _close:false
    };
    $.extend(_default,o);
    $.each(_default,function (k,v) {
        if(typeof v == 'function'){
            _default[k] = v();
        }
    });
    $.extend(this,_default);

    this.checkLayout();
}

App.prototype.checkLayout = function () {
    var maxWidth = window._w;
    var maxHeight = window._h - this.titleHeight + footer_height;

    if(this.width>maxWidth){
        this.width = maxWidth;
    }
    if(this.height>maxHeight){
        this.height=maxHeight;
    }

    if(this.left===null){
        this.left = ( window._w - this.width ) / 2;
    }
    if(this.top===null){
        this.top = ( window._h - this.height ) / 2;
        if (this.top < header_height ) {
            this.top = header_height;
        }
    }


    if(this.left + this.width > window._w){
        this.left = window._w - this.width;
    }
    if (this.height + this.titleHeight + this.top - header_height > window._h + footer_height){
        this.top = header_height;
    }

    if(this.maximized){
        this.top = header_height;
        console.log(this.top);
        console.log(header_height);
        this.left = 0;
        this.height = maxHeight;
        this.width = maxWidth;
    }
}

App.prototype.set = function (key,value) {
    var isResize = ['height','width','top','left'].indexOf(key)>=0;
    if(isResize){
        this.maximized = false;

        if(this.resizable){
            this[key] = value;
        }
    }else{
        this[key] = value;
    }
}

App.prototype.show = function () {
    this._show = true;
    this.focus();
}

App.prototype.hide = function () {
    this._show = false;
    this.blur();
};

App.prototype.close = function () {
    if(!this._close){
        this._close = true;
        $event.emit('app:close',this);
    }
}

App.prototype.focus = function () {
    if(!this._focus){
        this._focus = true;
        $event.emit('app:focus',this);
    }
}

App.prototype.blur = function () {
    this._focus = false;
};

App.prototype.maximize = function (force) {
    var _this = this;
    if(!force && _this.maximized && _this.oldPosition){
        _this.animating = true;
        delay(function () {
            _this.maximized = false;

            _this.top = _this.oldPosition.top;
            _this.left = _this.oldPosition.left;
            _this.height = _this.oldPosition.height;
            _this.width = _this.oldPosition.width;

            _this.oldPosition = null;
            delay(function () {
                _this.animating = false;
            },500)
        })

    }else{
        _this.animating = true;
        delay(function () {
            _this.maximized = true;
            _this.oldPosition = {
                top:_this.top,
                left:_this.left,
                height:_this.height,
                width:_this.width
            };
            _this.top = header_height;
            _this.left = 0;
            _this.height = window._h - _this.titleHeight + footer_height;
            _this.width = window._w;
            delay(function () {
                _this.animating = false;
            },500);
        })
    }
};

module.exports = App;