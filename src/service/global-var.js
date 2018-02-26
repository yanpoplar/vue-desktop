var $w = $(window);
$w.on('resize',update);
header_height = 40;//header高度
footer_height = 80;//footer高度
window._h = $w.height() - header_height - footer_height; //减去header,footer的高度
window._w = $w.width();

function update(){
    window._h = $w.height() - header_height - footer_height; // 减去header
    window._w = $w.width();
    $event && $event.emit('window:resize');
}