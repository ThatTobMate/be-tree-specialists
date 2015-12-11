(function($) {
	"use strict";
	// override jquery validate plugin defaults
	$.validator.setDefaults({
		errorElement: 'span',
		errorClass: 'help-block',
		errorPlacement: function(error, element) {
			if(element.parent('.input-group').length) {
				error.insertAfter(element.parent());
			} else {
				error.insertAfter(element);
			}
		}
	});
	

	//Max equal height
	$.fn.setAllToMaxHeight = function(){
		return this.height( Math.max.apply(this, $.map( this , function(e){ return $(e).height() }) ) );
	}

	//Calculate slide content height for vertical align
	function calculateContent() {
		$('.owl-item .slide-content').each(function(index, el) {
			$(this).height($(this).parent().height());
		});

	}

	//Prepare slider width and height
	function prepareCarousel() {
		$('#home-slider').height($(window).height());
		$('#home-slider .slide-content').css('margin-top', (($('#home-slider .slide-content').height()/2)*-1) + 'px');
        if (!$('#home-slider').hasClass('fixed-height')) {
            $('#home-slider #owl-main .item').height($(window).height());
            $('#home-slider #owl-main img').height($(window).height());
        } else {
            $('#home-slider #owl-main .item').height(600);
        }

        $('#home-slider #owl-main img').width('auto');

        var left = ((($('#home-slider').width() - $('#home-slider #owl-main img').width())/2));
        if (left<0) {
            $('#home-slider #owl-main img').css('top', '0px' );
            $('#home-slider #owl-main img').css('left', left + 'px' );
        } else {
            $('#home-slider #owl-main img').css('left', '0px' );
            $('#home-slider #owl-main img').css('max-width', 'none' );
            $('#home-slider #owl-main img').height('auto');
            $('#home-slider #owl-main img').width($(window).width());
            $('#home-slider #owl-main img').css('top', ((($('#home-slider').height() - $('#home-slider #owl-main img').height())/2)) + 'px' );
        }

        if ($('#home-slider #owl-main img').height() < $('#home-slider').height()) {
        	$('#home-slider #owl-main img').css('max-width', 'none' );
            $('#home-slider #owl-main img').width('auto');
            $('#home-slider #owl-main img').height($('#home-slider').height());
            $('#home-slider #owl-main img').css('top', ((($('#home-slider').height() - $('#home-slider #owl-main img').height())/2)) + 'px' );
        }
	}

	//Services carousel equalheight
	function updateSize(){
        $('.services-carousel .owl-item').setAllToMaxHeight();
        $('.team-wrapper .team-member').setAllToMaxHeight();
    }

	$(document).ready(function() {
		//Configure generic carousel
		$('.generic-carousel').each(function(index, el) {
			$(el).imagesLoaded(function() {
				$(el).owlCarousel({
					animateOut: $(el).data('animation-out') ? $(el).data('animation-out') : 'fadeOut',
		    		animateIn: $(el).data('animation-in') ? $(el).data('animation-in') : 'fadeIn',
					items: $(el).data('items') && $(window).width() > 990 ? $(el).data('items') : 1,
					dots: $(el).data('dots')!== undefined ? $(el).data('dots') : true,
					nav: $(el).data('nav')!== undefined ? $(el).data('nav') : true,
					loop: $(el).data('loop')!== undefined ? $(el).data('loop') : true,
					navText: ['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
					onInitialized: calculateContent,
					onResize: calculateContent,
					mouseDrag: false
				});
			});
		});

		//Configure services carousel
		$('.services-carousel').each(function(index, el) {
			$(el).imagesLoaded(function() {
				$(el).owlCarousel({
					animateOut: $(el).data('animation-out') ? $(el).data('animation-out') : 'fadeOut',
		    		animateIn: $(el).data('animation-in') ? $(el).data('animation-in') : 'fadeIn',
					items:  ($(window).width() > 990) ? 4 : 1,
					dots:  true,
					loop:  false,
					mouseDrag: false,
					onInitialized: updateSize,
					onResize: updateSize,
				});
			});
		});
		
		init_gmaps();
		//Set home slider height
		$('#home-slider').height($(window).height());

		//Click on navigations menu animate scroll
		$(".page-scroll a[href^='#']").on('click', function(e) {
			e.preventDefault();

			var hash = this.hash;
			var top = $(hash).offset().top - 100;
			$('html, body').animate({
				scrollTop: top
				}, 300, function() {
			});
			return false;
		});

		//Scroll to top
		$(".scrolltop").on('click', function(e) {
			e.preventDefault();
			$('html, body').animate({
				scrollTop: 0
				}, 300);
		});

		//Active scroll when map is clicked
		$('.map-wrapper').parent().click(function () {
		    $('.map-wrapper').css("pointer-events", "auto");
		});

		//When images are loaded
		imagesLoaded('body', function() {
			$(window).scroll();
			$('body').scrollspy({ target: '#header nav', offset: 130 });
			$('.loader').fadeOut(600);
			calculateContent();
			$('.equal-heights > div').setAllToMaxHeight();
			$('.team-wrapper .team-member').setAllToMaxHeight();
		});

		// Counters
		$.fn.countTo = function(options) {
			// merge the default plugin settings with the custom options
			options = $.extend({}, $.fn.countTo.defaults, options || {});

			// how many times to update the value, and how much to increment the value on each update
			var loops = Math.ceil(options.speed / options.refreshInterval),
			increment = (options.to - options.from) / loops;

			return $(this).each(function() {
				var _this = this,
				loopCount = 0,
				value = options.from,
				interval = setInterval(updateTimer, options.refreshInterval);

				function updateTimer() {
					value += increment;
					loopCount++;
					$(_this).html(value.toFixed(options.decimals));

					if (typeof(options.onUpdate) == 'function') {
						options.onUpdate.call(_this, value);
					}

					if (loopCount >= loops) {
						clearInterval(interval);
						value = options.to;

						if (typeof(options.onComplete) == 'function') {
							options.onComplete.call(_this, value);
						}
					}
				}
			})
		};

		//Run counters when visible
		var count = 0;
		$('.counter').bind('inview', function (event, visible) {
			if (visible === true && count===0) {
				count++;
				// element is now visible in the viewport
				$('.counter').each(function(){
					var datacount = $(this).attr('data-count');
					$(this).find('.number').delay(6000).countTo({
						from: 0,
						to: datacount,
						speed: 2500,
						refreshInterval: 80
					});
				});
			} else {
			// element has gone out of viewport
			}
		});


		//Run skills bars when visible
		var count_skill = 0;
		$('.skills-wrap').bind('inview', function (event, visible) {
			if (visible === true && count_skill===0) {
				count_skill++;
				// element is now visible in the viewport
				$('.skill-name').each(function(){
					var prog = ($('.skills-wrap').height() * $(this).attr('data-progress')/100);
					$(this).animate({
						'width': prog + 'px'},
						2000, function() {
						/* stuff to do after animation is complete */
					});
				});
			} else {
			// element has gone out of viewport
			}
		});


		google.maps.event.addDomListener(window, 'load', init_gmaps);
		//Google maps

        function init_gmaps() {
            var mapOptions = {
                zoom: 11,

                center: new google.maps.LatLng(51.6015995249203, 0.6548881530761719), // Essex

                styles: [{"stylers":[{"hue":"#ff1a00"},{"invert_lightness":true},{"saturation":-100},{"lightness":33},{"gamma":0.5}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2D333C"}]}]
            };


            var mapElement = document.getElementById('map-container');

            var map = new google.maps.Map(mapElement, mapOptions);

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(51.6015995249203, 0.6548881530761719),
                map: map,
                title: 'Your company'
            });
        }
        if ($('#map-header').length>0) 
			google.maps.event.addDomListener(window, 'load', init_contact);
        
        function init_contact() {
            var mapOptions = {
                zoom: 11,

                center: new google.maps.LatLng(51.6015995249203, 0.6548881530761719), // New York
                disableDefaultUI: true,
                styles: [
							{"stylers": [
								{"hue": "#ff1a00"},
								{"invert_lightness": true},
								{"saturation": -100},
								{"lightness": 33},
								{"gamma": 0.5}
							]},
							{"featureType": "water",
							"elementType": "geometry",
							"stylers": [
									{
									"color": "#2D333C"
									}
							]}
						]
            };


            var mapElement = document.getElementById('map-header');

            var map = new google.maps.Map(mapElement, mapOptions);

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(51.6015995249203, 0.6548881530761719),
                map: map,
                title: 'Your company',
                icon: 'images/map/pointer.png'
            });
        }

        //Contact form

        $("#contactform").validate({
            submitHandler: function(form) {
                $(form).ajaxSubmit();
                $(form).find('.formSent').show();
            }
        });

        

        //Header fixed on scroll
        $(window).bind("scroll", function(){ //when the user is scrolling...
        	if ($(window).scrollTop() >= 100) { //header hide by scroll
                $('#header').addClass('overflow');
            } else {
                $('#header').removeClass('overflow');
            }
            if ($(window).scrollTop() >= $(window).height()/2) { 
                $('#header').addClass('fixed');
            } else {
                $('#header').removeClass('fixed');
            }
        });

        //Style switcher
        $(".corner").on('click', function(){
            $('#customizer').toggleClass('s-open');
        });
        $('.color-scheme li a').on('click',function (e) {
			e.preventDefault();
			e.stopPropagation();
			$('.color-scheme li a').removeClass('active')
			$(this).addClass('active');
			less.modifyVars({'header-color':$('.headers-sel .version a.active').data('color'), 'main-color':$(this).parent().data('color')});
        });
        $('.headers-sel .version a').on('click',function (e) {
			e.preventDefault();
			e.stopPropagation();
			$('.headers-sel .version a').removeClass('active')
			$(this).addClass('active');
			less.modifyVars({'header-color':$(this).data('color'),'main-color':$('.color-scheme li a.active').parent().data('color')});
        });

	});
	var $portfolio;
	$(window).load(function() {
		//Isotope portfolio
		$('.portfolio').imagesLoaded(function() {
			$portfolio = $('.folio-grid').isotope();
			$('.filter').on( 'click', '.filter-link', function(e) {
				$('.filter-link').removeClass('active');
				$(this).addClass('active');
				var filterValue = $(this).attr('data-filter');
				$portfolio.isotope({ filter: filterValue });
				e.preventDefault();
			});
		});
		
		
		//Configure main slider carousel
		$('#owl-main').owlCarousel({
			animateOut: 'fadeOut',
    		animateIn: 'fadeIn',
			items: 1,
			loop: true,
			onInitialized: prepareCarousel,
            onResize: prepareCarousel,
            autoplay: true,
            autoplayTimeout:5500
		});
		//Configure main slider carousel
		$('#owl-text').owlCarousel({
			animateOut: 'fadeOut',
    		animateIn: 'fadeInUp',
			items: 1,
			loop: true,
			dots:false,
			autoplay: true,
			autoplayTimeout:5500,
			onInitialized: prepareCarousel,
			onResize: prepareCarousel
		});

		

		$('body').imagesLoaded(function() {
			if ($(window).width()>991)
				$('.align-table').height($('.align-table').parent().height());
			else 
				$('.align-table').height($('.align-table').height()+100);
		});

		if ($(".player").length>0) { //If there are video backgrounds
            $(".player").mb_YTPlayer();
        }

        /*Portfolio hover*/
        $('.folio-item').each( function() {
        	$(this).hoverdir({
				hoverDelay : 5
			});
		});

	}); // end window.load
	$(window).resize(function(event) {
		prepareCarousel();
	});
})(jQuery);