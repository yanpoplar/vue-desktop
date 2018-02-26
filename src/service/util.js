function arrRemove(arr) {
    var what, a = arguments,
        L = a.length,
        ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}
//深度拷贝对象
function deepCopy(p, c) {　　　　
    var c = c || {};　　　　
    for (var i in p) {　　　　　　
        if (typeof p[i] === 'object') {　　　　　　　　
            c[i] = (p[i].constructor === Array) ? [] : {};　　　　　　　　
            deepCopy(p[i], c[i]);　　　　　　
        } else {　　　　　　　　　
            c[i] = p[i];　　　　　　
        }　　　　
    }　　　　
    return c;　　
}
//初始化对象
function initialObj(obj) {
    if (typeof obj === 'object') {
        for (i in obj) {
            if (typeof obj[i] === 'number') {
                obj[i] = 0;
            } else if (typeof obj[i] === 'string') {
                obj[i] = '';

            } else if (typeof obj[i] === 'boolean') {
                obj[i] = false;

            } else if (typeof obj[i] === '' && obj[i].constructor === Array) {

                obj[i] = [];
            } else {
                obj[i] = {};
            }
        }
    } else {
        return;
    }
}
//画圆
function Circle() {
    this.radius = 60; // 圆环半径
    this.lineWidth = 15; // 圆环边的宽度
    this.strokeStyle = '#ccc'; //边的颜色
    this.fillStyle = '#ccc'; //填充色
    this.lineCap = 'round';
}
Circle.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.arc(150, 80, this.radius, 0, Math.PI * 2, true); // 坐标为250的圆，这里起始角度是0，结束角度是Math.PI*2
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.strokeStyle;
    ctx.stroke(); // 这里用stroke画一个空心圆，想填充颜色的童鞋可以用fill方法
};

//画环形
function Ring(startAngle, percent, color, color2) {
    Circle.call(this);
    this.strokeStyle = color;
    this.fillStyle = color2;
    this.startAngle = startAngle || 3 * Math.PI / 2; //弧起始角度
    this.percent = percent; //弧占的比例
}
Ring.prototype = Object.create(Circle.prototype);
Ring.prototype.drawRing = function (ctx) {

    this.draw(ctx); // 调用Circle的draw方法画圈圈

    // angle
    ctx.beginPath();
    var anglePerSec = 2 * Math.PI / (100 / this.percent); // 蓝色的弧度
    ctx.arc(150, 80, this.radius, this.startAngle, this.startAngle + anglePerSec, false); //这里的圆心坐标要和cirle的保持一致
    ctx.strokeStyle = this.fillStyle;
    ctx.lineCap = this.lineCap;
    ctx.stroke();
    ctx.closePath();
    //小圆
    var x1 = 150 + (Math.sin(anglePerSec) * 60);
    var y1 = 80 - (Math.cos(anglePerSec) * 60);
    ctx.beginPath();
    ctx.arc(x1, y1, 4, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = "rgba(250,250,250,.4)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x1, y1, 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = "#fff";
    ctx.fill();

}



module.exports = {
    clone: function clone(a) {
        return JSON.parse(JSON.stringify(a));
    },
    arrayRemove: function (arr, cb) {
        var targetArr = arr.filter(cb);
        arrRemove.apply(null, [arr].concat(targetArr));
        console.log(targetArr);
        console.log(arr);
    },
    deepCopy: deepCopy,
    initialObj: initialObj,
    ring: Ring
}
