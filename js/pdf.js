

// document.getElementById("btn-html2canvas").onclick = function(){
//   console.log("---getElementById---");
//   main.html2Canvas();
//
// };

function downPdf() {
  console.log("---downPdf---");
  main.html2Canvas();
}

//获取系统时间作为下载文件名称
function formartDate() {
  var date = new Date();
  this.month = date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
  this.date = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  this.hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  this.minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  this.second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  var d = date.getFullYear() + this.month + this.date + this.hour + this.minute + this.second;
  return "Math-exercises_"+d;
}

var main = {
  /*init:function(){
      main.setListener();
  },
  //设置监听事件
  setListener:function(){
      var btnShare = document.getElementById("btnShare");
      btnShare.onclick = function(){
          main.html2Canvas();
      }
  },*/

  //获取像素密度
  getPixelRatio:function(context){
    var backingStore = context.backingStorePixelRatio ||
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio || 1;
    return (window.devicePixelRatio || 1) / backingStore;
  },

  //绘制dom 元素，生成截图canvas
  html2Canvas: function () {
    var shareContent = document.getElementById("myContent");// 需要绘制的部分的 (原生）dom 对象 ，注意容器的宽度不要使用百分比，使用固定宽度，避免缩放问题
    var width = shareContent.offsetWidth;  // 获取(原生）dom 宽度
    var height = shareContent.offsetHeight; // 获取(原生）dom 高
    var offsetTop = shareContent.offsetTop;  //元素距离顶部的偏移量

    var canvas = document.createElement('canvas');  //创建canvas 对象
    var context = canvas.getContext('2d');
    var scaleBy = 10;  //获取像素密度的方法 (也可以采用自定义缩放比例)main.getPixelRatio(context)
    canvas.width = width * scaleBy;   //这里 由于绘制的dom 为固定宽度，居中，所以没有偏移
    canvas.height = (height + offsetTop) * scaleBy;  // 注意高度问题，由于顶部有个距离所以要加上顶部的距离，解决图像高度偏移问题
    context.scale(scaleBy, scaleBy);

    var opts = {
      allowTaint:true,//允许加载跨域的图片
      tainttest:true, //检测每张图片都已经加载完成
      scale:scaleBy, // 添加的scale 参数
      canvas:canvas, //自定义 canvas
      logging: true, //日志开关，发布的时候记得改成false
      width:width, //dom 原始宽度
      height:height //dom 原始高度
    };

    html2canvas(shareContent, opts).then(function (canvas) {
      //方向默认竖直，尺寸ponits，格式a4[595.28,841.89]
      var pdf = new jsPDF('', 'pt', 'a4');

      //addImage后两个参数控制添加图片的尺寸，此处将页面高度按照a4纸宽高比列进行压缩(canvas, 'JPEG', 0, 0, 595.28, 592.28/canvas.width * canvas.height)
      pdf.addImage(canvas, 'JPEG', 0, 0, 610, 592.28/canvas.width * canvas.height );

      pdf.save(formartDate()+'.pdf');

    });
  }
};
