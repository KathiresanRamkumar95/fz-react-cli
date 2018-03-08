$(document).ready(function() {
  var This;

  // var fileObj ={
  //     diff : ['desk3.png','desk3.png','desk3.png','desk3.png','desk3.png','desk3.png','desk3.png','desk3.png','desk3.png','desk3.png','desk3.png','desk3.png'],
  //     test :['desk2.png','desk2.png','desk2.png','desk2.png','desk2.png','desk2.png','desk2.png','desk2.png','desk2.png','desk2.png','desk2.png','desk2.png'],
  //     reference :['desk1.png','desk1.png','desk1.png','desk1.png','desk1.png','desk1.png','desk1.png','desk1.png','desk1.png','desk1.png','desk1.png','desk1.png']
  // }

  var div = '';

  for (var i = fileObj.diff.length - 1; i >= 0; i--) {
    var content =
      '<li class="image_li"><span class="glyphicon glyphicon-chevron-down arrow"> </span><span>' +
      fileObj.diff[i].split('.')[0] +
      '</span> </li>';
    div += content;
  }

  $('#line1').addClass('line1');
  $('#line3').addClass('line3');
  $(window).scroll(function() {
    var topPos = $('.list').offset().top;
    var list = $('.list');
    scroll = $(window).scrollTop();
    if (scroll > 220) {
      list.addClass('fixed');
    }
    if (scroll < 20) {
      list.removeClass('fixed');
    }
  });

  $(document).on('click', '.tab1', function() {
    $('.tab1').addClass('tab1_hover');
    $('.tab2_hover').addClass('tab2').removeClass('tab2_hover');
    $('#line1').addClass('line1');
    $('#line2').removeClass('line2');
    $('.Screenshot').hide();
    $('.Unit').show();
  });

  $('.tab2').click(function() {
    $('.tab1_hover').addClass('tab1').removeClass('tab1_hover');
    $('.tab2').addClass('tab2_hover').removeClass('tab2');
    $('#line2').addClass('line2');
    $('#line1').removeClass('line1');
    $('.Screenshot').show();
    $('.image_view').append(div);
    $('.Unit').hide();
    $('.ul_catch_2').css('display', 'none');
    $('.ul_catch_3').css('display', 'none');
  });
  $('.icon1').click(function() {
    $('.icon1')
      .addClass('icon2')
      .removeClass('icon1')
      .removeClass('glyphicon glyphicon-search');
    $('.inp').val('');
    $('.inp').css('display', 'block');
    $('.tab_li1_hover').css('text-align', 'left');
    $('.tab_li1').css('text-align', 'left');
  });
  $(document).on('click', '.tab_li1', function() {
    $('.ul_catch_2').css('display', 'none');
    $('.ul_catch_3').css('display', 'none');
    $('.ul_catch_1').css('display', 'flex');
    $('.ul_catch_1').addClass('ul_catch_1');
    $('.tab_li1').addClass('tab_li1_hover').removeClass('tab_li1');
    $('.tab_li2_hover').addClass('tab_li2').removeClass('tab_li2_hover');
    $('.tab_li3_hover').addClass('tab_li3').removeClass('tab_li3_hover');
    $('#line3').addClass('line3');
    $('#line4').removeClass('line4');
    $('#line5').removeClass('line5');
  });
  $('.tab_li2').click(function() {
    $('.ul_catch_1').css('display', 'none');
    $('.ul_catch_3').css('display', 'none');
    $('.ul_catch_2').css('display', 'block');
    $('.ul_catch_2').addClass('ul_catch_2');
    $('.tab_li2').addClass('tab_li2_hover').removeClass('tab_li2');
    $('.tab_li1_hover').addClass('tab_li1').removeClass('tab_li1_hover');
    $('.tab_li3_hover').addClass('tab_li3').removeClass('tab_li3_hover');
    $('#line4').addClass('line4');
    $('#line3').removeClass('line3');
    $('#line5').removeClass('line5');
    $('.inp').css('display', 'none');
    $('.tab_li1').css('text-align', 'center');
    $('.icon2')
      .addClass('icon1')
      .addClass('glyphicon glyphicon-search')
      .removeClass('icon2');
  });
  $('.tab_li3').click(function() {
    $('.ul_catch_1').css('display', 'none');
    $('.ul_catch_2').css('display', 'none');
    $('.ul_catch_3').css('display', 'block');
    $('.ul_catch_3').addClass('ul_catch_3');
    $('.tab_li3').addClass('tab_li3_hover').removeClass('tab_li3');
    $('.tab_li1_hover').addClass('tab_li1').removeClass('tab_li1_hover');
    $('.tab_li2_hover').addClass('tab_li2').removeClass('tab_li2_hover');
    $('#line5').addClass('line5');
    $('#line4').removeClass('line4');
    $('#line3').removeClass('line3');
    $('.inp').css('display', 'none');
    $('.tab_li1').css('text-align', 'center');
    $('.icon2')
      .addClass('icon1')
      .addClass('glyphicon glyphicon-search')
      .removeClass('icon2');
  });

  $('.inp').on('focus', function() {
    $('icon1')
      .addClass('icon2')
      .removeClass('icon1')
      .removeClass('glyphicon glyphicon-search');
    $('.tab_li1').css('text-align', 'left');
  });

  $('.inp').on('blur', function() {
    $('.icon2')
      .addClass('icon1')
      .addClass('glyphicon glyphicon-search')
      .removeClass('icon2');
    $('.inp').css('display', 'none');
    $('.tab_li1').css('text-align', 'center');
  });

  $(document).on('click', '.image_li', function() {
    if (This == this) {
      $('.img_div').remove();
      $(this).children().addClass('arrow').removeClass('arrow_up');
      $('.image_li').css('background-color', '');
      This = null;
    } else {
      This = this;
      $('.img_div').remove();
      $('.image_li').css('background-color', '');
      $(this).css('background-color', 'rgba(0, 0, 0, 0.09');
      $('.image_li').children().addClass('arrow').removeClass('arrow_up');
      $(this).children().addClass('arrow_up').removeClass('arrow');
      var name = $(this).text().trim();
      var image_view =
        '<div class="img_div_hide" ><span class="span"><span class="title" >Original Image</span><img class="scr_img" src="./../../../../screenShots/my_ui_reference/' +
        name +
        '.png"></img></span><span class="span"> <span class="title" >Tested Image</span><img class="scr_img" src="./../../../../screenShots/my_ui_test/' +
        name +
        '.png"></img></span><span class="span" > <span class="title">Difference Image</span><img class="scr_img" src="./../../../../screenShots/my_ui_diff/' +
        name +
        '.png"></img></span><span class="refer span"><h4>Referencedby</h4><ul class="refer_ul"></ul><span class="message"></span></span></div>';
      $(this).after(image_view);
      $('.img_div_hide').addClass('img_div');
      var referenceBy = mdata[name].referencedby;
      var li = '';
      alert(mdataa);
      if (!referenceBy.length == 0) {
        for (var i = referenceBy.length - 1; i >= 0; i--) {
          li += '<li>' + referenceBy[i] + '</li>';
        }
        $('.refer').append(li);
      } else {
        $('.message').html('! No Referencedby Components.');
      }
    }
  });
  $(document).on('click', '.scr_img', function() {
    $('.popup_view').css('display', 'block');
    $('.large_img').attr('src', $(this).attr('src'));
    $('.a').attr('href', $(this).attr('src'));
  });

  $(document).on('click', '.close', function() {
    $('.popup_view').css('display', 'none');
  });
});
