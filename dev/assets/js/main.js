(function ($) {
  'use strict';
  /*=================================
      JS Index Here
  ==================================*/
  /*
    01. On Load Function
    02. Preloader
    03. Mobile Menu Active
    04. Sticky fix
    05. Scroll To Top
    06. Set Background Image
    07. Hero Slider Active 
    08. Global Slider
    09. Ajax Contact Form
    10. Popup Side Menu   
    11. Magnific Popup
    12. Section Position
    13. Filter
    14. One Page Nav
    15. WOW.js Animation
  */
  /*=================================
      JS Index End
  ==================================*/
  /*

  /*---------- 01. On Load Function ----------*/
  $(window).on('load', function () {
    $('.preloader').fadeOut();
  });

  /*---------- 02. Preloader ----------*/
  if ($('.preloader').length > 0) {
    $('.preloaderCls').each(function () {
      $(this).on('click', function (e) {
        e.preventDefault();
        $('.preloader').css('display', 'none');
      });
    });
  }

  /*---------- 03. Mobile Menu Active ----------*/
  $.fn.vsmobilemenu = function (options) {
    var opt = $.extend(
      {
        menuToggleBtn: '.vs-menu-toggle',
        bodyToggleClass: 'vs-body-visible',
        subMenuClass: 'vs-submenu',
        subMenuParent: 'vs-item-has-children',
        subMenuParentToggle: 'vs-active',
        meanExpandClass: 'vs-mean-expand',
        appendElement: '<span class="vs-mean-expand"></span>',
        subMenuToggleClass: 'vs-open',
        toggleSpeed: 400,
      },
      options
    );

    return this.each(function () {
      var menu = $(this); // Select menu

      // Menu Show & Hide
      function menuToggle() {
        menu.toggleClass(opt.bodyToggleClass);

        // collapse submenu on menu hide or show
        var subMenu = '.' + opt.subMenuClass;
        $(subMenu).each(function () {
          if ($(this).hasClass(opt.subMenuToggleClass)) {
            $(this).removeClass(opt.subMenuToggleClass);
            $(this).css('display', 'none');
            $(this).parent().removeClass(opt.subMenuParentToggle);
          }
        });
      }

      // Class Set Up for every submenu
      menu.find('li').each(function () {
        var submenu = $(this).find('ul');
        submenu.addClass(opt.subMenuClass);
        submenu.css('display', 'none');
        submenu.parent().addClass(opt.subMenuParent);
        submenu.prev('a').append(opt.appendElement);
        submenu.next('a').append(opt.appendElement);
      });

      // Toggle Submenu
      function toggleDropDown($element) {
        if ($($element).next('ul').length > 0) {
          $($element).parent().toggleClass(opt.subMenuParentToggle);
          $($element).next('ul').slideToggle(opt.toggleSpeed);
          $($element).next('ul').toggleClass(opt.subMenuToggleClass);
        } else if ($($element).prev('ul').length > 0) {
          $($element).parent().toggleClass(opt.subMenuParentToggle);
          $($element).prev('ul').slideToggle(opt.toggleSpeed);
          $($element).prev('ul').toggleClass(opt.subMenuToggleClass);
        }
      }

      // Submenu toggle Button
      var expandToggler = '.' + opt.meanExpandClass;
      $(expandToggler).each(function () {
        $(this).on('click', function (e) {
          e.preventDefault();
          toggleDropDown($(this).parent());
        });
      });

      // Menu Show & Hide On Toggle Btn click
      $(opt.menuToggleBtn).each(function () {
        $(this).on('click', function () {
          menuToggle();
        });
      });

      // Hide Menu On out side click
      menu.on('click', function (e) {
        e.stopPropagation();
        menuToggle();
      });

      // Stop Hide full menu on menu click
      menu.find('div').on('click', function (e) {
        e.stopPropagation();
      });
    });
  };

  $('.vs-menu-wrapper').vsmobilemenu();

  /*---------- 04. Sticky fix ----------*/
  var lastScrollTop = '';
  var scrollToTopBtn = '.scrollToTop';

  function stickyMenu($targetMenu, $toggleClass, $parentClass) {
    var st = $(window).scrollTop();
    var height = $targetMenu.css('height');
    $targetMenu.parent().css('min-height', height);
    if ($(window).scrollTop() > 800) {
      $targetMenu.parent().addClass($parentClass);

      if (st > lastScrollTop) {
        $targetMenu.removeClass($toggleClass);
      } else {
        $targetMenu.addClass($toggleClass);
      }
    } else {
      $targetMenu.parent().css('min-height', '').removeClass($parentClass);
      $targetMenu.removeClass($toggleClass);
    }
    lastScrollTop = st;
  }
  $(window).on('scroll', function () {
    stickyMenu($('.sticky-active'), 'active', 'will-sticky');
    if ($(this).scrollTop() > 500) {
      $(scrollToTopBtn).addClass('show');
    } else {
      $(scrollToTopBtn).removeClass('show');
    }
  });

  /*---------- 05. Scroll To Top ----------*/
  $(scrollToTopBtn).each(function () {
    $(this).on('click', function (e) {
      e.preventDefault();
      console.log('scroll to top clicked');
      $('html, body').animate(
        {
          scrollTop: 0,
        },
        1000
      );
      return false;
    });
  });

  /*---------- 06.Set Background Image ----------*/
  if ($('[data-bg-src]').length > 0) {
    $('[data-bg-src]').each(function () {
      var src = $(this).attr('data-bg-src');
      $(this).css('background-image', 'url(' + src + ')');
      $(this).removeAttr('data-bg-src').addClass('background-image');
    });
  }

  /*----------- 07. Global Slider ----------*/
  $('.vs-carousel').each(function () {
    var vsSlide = $(this);

    // Collect Data
    var d = (data) => {
      return vsSlide.data(data);
    };

    // Custom Arrow Button
    var prevButton =
        '<button type="button" class="slick-prev"><i class="' +
        d('prev-arrow') +
        '"></i></button>',
      nextButton =
        '<button type="button" class="slick-next"><i class="' +
        d('next-arrow') +
        '"></i></button>';

    // Function For Custom Arrow Btn
    $('[data-slick-next]').each(function () {
      $(this).on('click', function (e) {
        e.preventDefault();
        $($(this).data('slick-next')).slick('slickNext');
      });
    });

    $('[data-slick-prev]').each(function () {
      $(this).on('click', function (e) {
        e.preventDefault();
        $($(this).data('slick-prev')).slick('slickPrev');
      });
    });

    // Check for arrow wrapper
    if (d('arrows') == true) {
      if (!vsSlide.closest('.arrow-wrap').length) {
        vsSlide.closest('.container').parent().addClass('arrow-wrap');
      }
    }

    vsSlide.slick({
      dots: d('dots') ? true : false,
      fade: d('fade') ? true : false,
      arrows: d('arrows') ? true : false,
      speed: d('speed') ? d('speed') : 1000,
      asNavFor: d('asnavfor') ? d('asnavfor') : false,
      autoplay: d('autoplay') == false ? false : false,
      infinite: d('infinite') == false ? false : true,
      slidesToShow: d('slide-show') ? d('slide-show') : 1,
      adaptiveHeight: d('adaptive-height') ? true : false,
      centerMode: d('center-mode') ? true : false,
      autoplaySpeed: d('autoplay-speed') ? d('autoplay-speed') : 8000,
      centerPadding: d('center-padding') ? d('center-padding') : '0',
      focusOnSelect: d('focuson-select') ? true : false,
      pauseOnFocus: d('pauseon-focus') ? true : false,
      pauseOnHover: d('pauseon-hover') ? true : false,
      variableWidth: d('variable-width') ? true : false,
      vertical: d('vertical') ? true : false,
      verticalSwiping: d('vertical') ? true : false,
      prevArrow: d('prev-arrow')
        ? prevButton
        : '<button type="button" class="slick-prev"><i class="fal fa-long-arrow-left"></i></button>',
      nextArrow: d('next-arrow')
        ? nextButton
        : '<button type="button" class="slick-next"><i class="fal fa-long-arrow-right"></i></button>',
      rtl: $('html').attr('dir') == 'rtl' ? true : false,
      responsive: [
        {
          breakpoint: 1600,
          settings: {
            arrows: d('xl-arrows') ? true : false,
            dots: d('xl-dots') ? true : false,
            slidesToShow: d('xl-slide-show')
              ? d('xl-slide-show')
              : d('slide-show'),
            centerMode: d('xl-center-mode') ? true : false,
            centerPadding: 0,
          },
        },
        {
          breakpoint: 1400,
          settings: {
            arrows: d('ml-arrows') ? true : false,
            dots: d('ml-dots') ? true : false,
            slidesToShow: d('ml-slide-show')
              ? d('ml-slide-show')
              : d('slide-show'),
            centerMode: d('ml-center-mode') ? true : false,
            centerPadding: 0,
          },
        },
        {
          breakpoint: 1200,
          settings: {
            arrows: d('lg-arrows') ? true : false,
            dots: d('lg-dots') ? true : false,
            slidesToShow: d('lg-slide-show')
              ? d('lg-slide-show')
              : d('slide-show'),
            centerMode: d('lg-center-mode') ? d('lg-center-mode') : false,
            centerPadding: 0,
          },
        },
        {
          breakpoint: 992,
          settings: {
            arrows: d('md-arrows') ? true : false,
            dots: d('md-dots') ? true : false,
            slidesToShow: d('md-slide-show') ? d('md-slide-show') : 1,
            centerMode: d('md-center-mode') ? d('md-center-mode') : false,
            centerPadding: 0,
          },
        },
        {
          breakpoint: 767,
          settings: {
            arrows: d('sm-arrows') ? true : false,
            dots: d('sm-dots') ? true : false,
            slidesToShow: d('sm-slide-show') ? d('sm-slide-show') : 1,
            centerMode: d('sm-center-mode') ? d('sm-center-mode') : false,
            centerPadding: 0,
          },
        },
        {
          breakpoint: 576,
          settings: {
            arrows: d('xs-arrows') ? true : false,
            dots: d('xs-dots') ? true : false,
            slidesToShow: d('xs-slide-show') ? d('xs-slide-show') : 1,
            centerMode: d('xs-center-mode') ? d('xs-center-mode') : false,
            centerPadding: 0,
          },
        },
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ],
    });
  });

  /*----------- 08. Ajax Contact Form ----------*/
  function ajaxContactForm(selectForm) {
    var form = selectForm;
    var invalidCls = 'is-invalid';
    var $email = '[name="email"]';
    var $validation =
      '[name="name"],[name="email"],[name="phone"],[name="message"]'; // Remove [name="subject"]
    var formMessages = $(selectForm).next('.form-messages');

    function sendContact() {
      var formData = $(form).serialize();
      var valid;
      valid = validateContact();
      if (valid) {
        jQuery
          .ajax({
            url: $(form).attr('action'),
            data: formData,
            type: 'POST',
          })
          .done(function (response) {
            // Make sure that the formMessages div has the 'success' class.
            formMessages.removeClass('error');
            formMessages.addClass('success');
            // Set the message text.
            formMessages.text(response);
            // Clear the form.
            $(form + ' input:not([type="submit"]),' + form + ' textarea').val(
              ''
            );
          })
          .fail(function (data) {
            // Make sure that the formMessages div has the 'error' class.
            formMessages.removeClass('success');
            formMessages.addClass('error');
            // Set the message text.
            if (data.responseText !== '') {
              formMessages.html(data.responseText);
            } else {
              formMessages.html(
                'Oops! An error occurred and your message could not be sent.'
              );
            }
          });
      }
    }

    function validateContact() {
      var valid = true;
      var formInput;
      function unvalid($validation) {
        $validation = $validation.split(',');
        for (var i = 0; i < $validation.length; i++) {
          formInput = form + ' ' + $validation[i];
          if (!$(formInput).val()) {
            $(formInput).addClass(invalidCls);
            valid = false;
          } else {
            $(formInput).removeClass(invalidCls);
            valid = true;
          }
        }
      }
      unvalid($validation);

      if (
        !$(form + ' ' + $email).val() ||
        !$(form + ' ' + $email)
          .val()
          .match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)
      ) {
        $(form + ' ' + $email).addClass(invalidCls);
        valid = false;
      } else {
        $(form + ' ' + $email).removeClass(invalidCls);
        valid = true;
      }
      return valid;
    }

    $(form).on('submit', function (element) {
      element.preventDefault();
      sendContact();
    });
  }
  ajaxContactForm('.ajax-contact');

  /*---------- 09. Popup Side Menu ----------*/
  function popupSideMenu($sideMenu, $sideMunuOpen, $sideMenuCls, $toggleCls) {
    // Sidebar Popup
    $($sideMunuOpen).on('click', function (e) {
      e.preventDefault();
      $($sideMenu).addClass($toggleCls);
    });
    $($sideMenu).on('click', function (e) {
      e.stopPropagation();
      $($sideMenu).removeClass($toggleCls);
    });
    var sideMenuChild = $sideMenu + ' > div';
    $(sideMenuChild).on('click', function (e) {
      e.stopPropagation();
      $($sideMenu).addClass($toggleCls);
    });
    $($sideMenuCls).on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $($sideMenu).removeClass($toggleCls);
    });
  }
  popupSideMenu(
    '.sidemenu-wrapper',
    '.sideMenuToggler',
    '.sideMenuCls',
    'show'
  );

  /*----------- 10. Magnific Popup ----------*/
  /* magnificPopup img view */
  $('.popup-image').magnificPopup({
    type: 'image',
    gallery: {
      enabled: true,
    },
  });

  /* magnificPopup video view */
  $('.popup-video').magnificPopup({
    type: 'iframe',
  });

  /*---------- 11. Section Position ----------*/
  // Interger Converter
  function convertInteger(str) {
    return parseInt(str, 10);
  }

  $.fn.sectionPosition = function (mainAttr, posAttr, getPosValue) {
    $(this).each(function () {
      var section = $(this);

      function setPosition() {
        var sectionHeight = Math.floor(section.height() / 2), // Main Height of section
          posValue = convertInteger(section.attr(getPosValue)), // positioning value
          posData = section.attr(mainAttr), // how much to position
          posFor = section.attr(posAttr), // On Which section is for positioning
          parentPT = convertInteger($(posFor).css('padding-top')), // Default Padding of  parent
          parentPB = convertInteger($(posFor).css('padding-bottom')); // Default Padding of  parent

        if (posData === 'top-half') {
          $(posFor).css('padding-bottom', parentPB + sectionHeight + 'px');
          section.css('margin-top', '-' + sectionHeight + 'px');
        } else if (posData === 'bottom-half') {
          $(posFor).css('padding-top', parentPT + sectionHeight + 'px');
          section.css('margin-bottom', '-' + sectionHeight + 'px');
        } else if (posData === 'top') {
          $(posFor).css('padding-bottom', parentPB + posValue + 'px');
          section.css('margin-top', '-' + posValue + 'px');
        } else if (posData === 'bottom') {
          $(posFor).css('padding-top', parentPT + posValue + 'px');
          section.css('margin-bottom', '-' + posValue + 'px');
        }
      }
      setPosition(); // Set Padding On Load
    });
  };

  var postionHandler = '[data-sec-pos]';
  if ($(postionHandler).length) {
    $(postionHandler).imagesLoaded(function () {
      $(postionHandler).sectionPosition(
        'data-sec-pos',
        'data-pos-for',
        'data-pos-amount'
      );
    });
  }

  /*----------- 12. Filter ----------*/
  $('.filter-active, .filter-active2').imagesLoaded(function () {
    var $filter = '.filter-active',
      $filter2 = '.filter-active2',
      $filterItem = '.filter-item',
      $filterMenu = '.filter-menu-active';

    if ($($filter).length > 0) {
      var $grid = $($filter).isotope({
        itemSelector: $filterItem,
        filter: '*',
        masonry: {
          // use outer width of grid-sizer for columnWidth
          columnWidth: 1,
        },
      });
    }

    if ($($filter2).length > 0) {
      var $grid = $($filter2).isotope({
        itemSelector: $filterItem,
        filter: '*',
        masonry: {
          // use outer width of grid-sizer for columnWidth
          columnWidth: $filterItem,
        },
      });
    }

    // Menu Active Class
    $($filterMenu).on('click', 'button', function (event) {
      event.preventDefault();
      var filterValue = $(this).attr('data-filter');
      $grid.isotope({
        filter: filterValue,
      });
      $(this).addClass('active');
      $(this).siblings('.active').removeClass('active');
    });
  });

  /*----------- 13. One Page Nav ----------*/
  function onePageNav(element) {
    if ($(element).length > 0) {
      $(element).each(function () {
        $(this)
          .find('a')
          .each(function () {
            $(this).on('click', function (e) {
              var target = $(this.getAttribute('href'));
              if (target.length) {
                e.preventDefault();
                event.preventDefault();
                $('html, body')
                  .stop()
                  .animate(
                    {
                      scrollTop: target.offset().top - 10,
                    },
                    1000
                  );
              }
            });
          });
      });
    }
  }
  onePageNav('.onepage-nav, .main-menu, .vs-mobile-menu');

  /*----------- 14. WOW.js Animation ----------*/
  var wow = new WOW({
    boxClass: 'wow', // animated element css class (default is wow)
    animateClass: 'wow-animated', // animation css class (default is animated)
    offset: 0, // distance to the element when triggering the animation (default is 0)
    mobile: false, // trigger animations on mobile devices (default is true)
    live: true, // act on asynchronously loaded content (default is true)
    scrollContainer: null, // optional scroll container selector, otherwise use window,
    resetAnimation: false, // reset animation on end (default is true)
  });
  wow.init();

  /*----------- 15. Indicator Position ----------*/
  function setPos(element) {
    var indicator = element.siblings('.indicator'),
      btnWidth = element.css('width'),
      btnHiehgt = element.css('height'),
      btnLeft = element.position().left,
      btnTop = element.position().top;
    element.addClass('active').siblings().removeClass('active');
    indicator.css({
      left: btnLeft + 'px',
      top: btnTop + 'px',
      width: btnWidth,
      height: btnHiehgt,
    });
  }

  $('.login-tab a').each(function () {
    var link = $(this);
    if (link.hasClass('active')) setPos(link);
    link.on('mouseover', function () {
      setPos($(this));
    });
  });

  /*----------- 16. Color Plate Js ----------*/
  const themeIcon = document.getElementById('themeToggleIcon');
  const themePanel = document.getElementById('themePanel');
  const closeBtn = document.getElementById('closePanelBtn');
  const modeButtons = document.querySelectorAll('.mode-btn');
  const colorPicker = document.getElementById('colorPicker');
  const resetBtn = document.getElementById('resetTheme');

  // Toggle open
  themeIcon.addEventListener('click', () => {
    themePanel.classList.add('open');
  });

  // Close button
  closeBtn.addEventListener('click', () => {
    themePanel.classList.remove('open');
  });

  // Click outside closes panel
  document.addEventListener('click', (e) => {
    if (!themePanel.contains(e.target) && !themeIcon.contains(e.target)) {
      themePanel.classList.remove('open');
    }
  });

  // Theme mode change
  modeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      document.body.className = '';
      document.body.classList.add(`${mode}-mode`);

      if (mode !== 'color') {
        document.body.style.backgroundColor = '';
        localStorage.removeItem('customColor');
      }

      localStorage.setItem('theme', mode);
    });
  });

  // Color picker
  colorPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    document.body.className = 'color-mode';
    document.body.style.backgroundColor = color;
    localStorage.setItem('theme', 'color');
    localStorage.setItem('customColor', color);
  });

  // Reset theme
  resetBtn.addEventListener('click', () => {
    document.body.className = '';
    document.body.style.backgroundColor = '';
    localStorage.removeItem('theme');
    localStorage.removeItem('customColor');
  });

  // Load saved theme on page load
  window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const savedColor = localStorage.getItem('customColor');

    if (savedTheme) {
      document.body.classList.add(`${savedTheme}-mode`);
      if (savedTheme === 'color' && savedColor) {
        document.body.style.backgroundColor = savedColor;
        colorPicker.value = savedColor;
      }
    }
  });

  // Get the current year
  const currentYear = new Date().getFullYear();
  // Set the text content of the element with id "currentYear"
  document.getElementById('currentYear').textContent = currentYear;

  /**************************************
   ***** 21. SVG Assets in Inline *****
   **************************************/
  document.addEventListener('DOMContentLoaded', () => {
    const svgElements = document.querySelectorAll('.vs-svg-assets');

    svgElements.forEach((svgElement) => {
      const svgPath = svgElement.getAttribute('data-svg-assets');

      if (svgPath) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', svgPath, true);
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200 || xhr.status === 0) {
              svgElement.insertAdjacentHTML('afterbegin', xhr.responseText);
            } else {
              console.error(
                `Failed to load SVG: ${xhr.status} ${xhr.statusText}`
              );
            }
          }
        };
        xhr.send();
      } else {
        console.error('SVG path not found for element:', svgElement);
      }
    });
  });

  // Svg line animation
  // Wait for the DOM to fully load
  document.addEventListener('DOMContentLoaded', () => {
    // Select all paths within .vs-svg-assets in .main-menu
    const paths = document.querySelectorAll(
      '.main-menu .vs-svg-assets svg path'
    );

    paths.forEach((path) => {
      // Get the total length of the current path
      const pathLength = path.getTotalLength();

      // Dynamically set the stroke-dasharray and stroke-dashoffset
      path.style.strokeDasharray = pathLength;
      path.style.strokeDashoffset = pathLength; // Initially hide the stroke
    });
  });
  /**************************************
   ***** 04. Active Menu Item Based On URL *****
   **************************************/
  document.addEventListener('DOMContentLoaded', () => {
    const navMenu = document.querySelector('.main-menu'); // Select the main menu container once
    const windowPathname = window.location.pathname;

    if (navMenu) {
      const navLinkEls = navMenu.querySelectorAll('a'); // Only get <a> tags inside the main menu

      navLinkEls.forEach((navLinkEl) => {
        const navLinkPathname = new URL(navLinkEl.href, window.location.origin)
          .pathname;

        // Match current URL with link's href
        if (
          windowPathname === navLinkPathname ||
          (windowPathname === '/index.html' && navLinkPathname === '/')
        ) {
          navLinkEl.classList.add('active');

          // Add 'active' class to all parent <li> elements
          let parentLi = navLinkEl.closest('li');
          while (parentLi && parentLi !== navMenu) {
            parentLi.classList.add('active');
            parentLi = parentLi.parentElement.closest('li'); // Traverse up safely
          }
        }
      });
    }
  });
})(jQuery);
