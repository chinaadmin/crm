var $parentNode = window.parent.document;

function $childNode(name) {
  return window.frames[name]
}

// tooltips
$('.tooltip-demo').tooltip({
  selector: "[data-toggle=tooltip]",
  container: "body"
});

// 使用animation.css修改Bootstrap Modal
$('.modal').appendTo("body");

$("[data-toggle=popover]").popover();

//折叠ibox
$('.collapse-link').click(function() {
  var ibox = $(this).closest('div.ibox');
  var button = $(this).find('i');
  var content = ibox.find('div.ibox-content');
  content.slideToggle(200);
  button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
  ibox.toggleClass('').toggleClass('border-bottom');
  setTimeout(function() {
    ibox.resize();
    ibox.find('[id^=map-]').resize();
  }, 50);
});

//关闭ibox
$('.close-link').click(function() {
  var content = $(this).closest('div.ibox');
  content.remove();
});

//当前页面如果不在iframe中，则返回后台管理首页
if (top == this) {
  window.location.href = "index.html";
}

//animation.css
function animationHover(element, animation) {
  element = $(element);
  element.hover(
    function() {
      element.addClass('animated ' + animation);
    },
    function() {
      //动画完成之前移除class
      window.setTimeout(function() {
        element.removeClass('animated ' + animation);
      }, 2000);
    });
}

//拖动面板
function WinMove() {
  var element = "[class*=col]";
  var handle = ".ibox-title";
  var connect = "[class*=col]";
  $(element).sortable({
      handle: handle,
      connectWith: connect,
      tolerance: 'pointer',
      forcePlaceholderSize: true,
      opacity: 0.8,
    })
    .disableSelection();
};