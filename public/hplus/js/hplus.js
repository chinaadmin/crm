//自定义js

//公共配置


$(document).ready(function() {

  // MetsiMenu
  //$('#side-menu').metisMenu();

  // 打开右侧边栏
  $('.right-sidebar-toggle').click(function() {
    $('#right-sidebar').toggleClass('sidebar-open');
  });

  // 右侧边栏使用slimscroll
  $('.sidebar-container').slimScroll({
    height: '100%',
    railOpacity: 0.4,
    wheelStep: 10
  });

  // 打开聊天窗口
  $('.open-small-chat').click(function() {
    $(this).children().toggleClass('fa-comments').toggleClass('fa-remove');
    $('.small-chat-box').toggleClass('active');
  });

  // 聊天窗口使用slimscroll
  $('.small-chat-box .content').slimScroll({
    height: '234px',
    railOpacity: 0.4
  });

  // Small todo handler
  $('.check-link').click(function() {
    var button = $(this).find('i');
    var label = $(this).next('span');
    button.toggleClass('fa-check-square').toggleClass('fa-square-o');
    label.toggleClass('todo-completed');
    return false;
  });

  //固定菜单栏
  $(function() {
    $('.sidebar-collapse').slimScroll({
      height: '100%',
      railOpacity: 0.9,
      alwaysVisible: false
    });
  });


  // 菜单切换
  $(document).on('click', '.tr-tool>.navbar-minimalize', function() {
    $("body").toggleClass("mini-navbar");

    if ($('body').hasClass('mini-navbar')) {
      $(this).removeClass('fa-angle-left').addClass('fa-angle-right');
      $('#side-menu>li').find('ul.nav-second-level').hide();
    } else {
      $(this).removeClass('fa-angle-right').addClass('fa-angle-left');
      $('#side-menu>li.active').find('ul.nav-second-level').show();
      $('.nav-header').addClass('animated rotateInDownRight');
      $('.tr-tool').addClass('animated rotateInDownLeft');
    }

    SmoothlyMenu();

    return false;
  });


  // 侧边栏高度
  function fix_height() {
    var heightWithoutNavbar = $("body > #wrapper").height() - 61;
    $(".sidebard-panel").css("min-height", heightWithoutNavbar + "px");
  }
  fix_height();

  $(window).bind("load resize click scroll", function() {
    if (!$("body").hasClass('body-small')) {
      fix_height();
    }
  });

  //侧边栏滚动
  $(window).scroll(function() {
    if ($(window).scrollTop() > 0 && !$('body').hasClass('fixed-nav')) {
      $('#right-sidebar').addClass('sidebar-top');
    } else {
      $('#right-sidebar').removeClass('sidebar-top');
    }
  });

  $('.full-height-scroll').slimScroll({
    height: '100%'
  });

  $('#side-menu>li').click(function() {
    if ($('body').hasClass('mini-navbar')) {
      NavToggle();
    }
  });
  $('#side-menu>li li a').click(function() {
    if ($(window).width() < 769) {
      NavToggle();
    }
  });

  $('.nav-close').click(NavToggle);

  //ios浏览器兼容性处理
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    $('#content-main').css('overflow-y', 'auto');
  }

});

$(window).bind("load resize", function() {
  if ($(this).width() < 769) {
    $('body').addClass('mini-navbar');
    $('.navbar-static-side').fadeIn();
    $('.tr-tool>.navbar-minimalize').addClass('fa-angle-right');
    $('#side-menu>li.active').find('ul').hide();
  }
});

function NavToggle() {
  $('.navbar-minimalize').trigger('click');
}

function SmoothlyMenu() {
  if (!$('body').hasClass('mini-navbar')) {
    $('#side-menu').hide();
    setTimeout(
      function() {
        $('#side-menu').fadeIn(300);
      }, 100);
  } else if ($('body').hasClass('fixed-sidebar')) {
    $('#side-menu').hide();
    setTimeout(
      function() {
        $('#side-menu').fadeIn(300);
      }, 300);
  } else {
    $('#side-menu').removeAttr('style');
  }
}

//判断浏览器是否支持html5本地存储
function localStorageSupport() {
  return (('localStorage' in window) && window['localStorage'] !== null)
}