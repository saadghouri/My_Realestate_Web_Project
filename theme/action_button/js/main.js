jQuery(document).ready(function($){
	// browser window scroll (in pixels) after which the "menu" link is shown
	var offset = 300;

	var navigationContainer = $('#act-btn-nav'),
	mainNavigation = navigationContainer.find('#cd-main-nav ul');
	//mainNavigation_hoz = navigationContainer.find('#ab-horizontal ul');

	//hide or show the "menu" link
	checkMenu();
	$(window).scroll(function(){
		checkMenu();
	});

	//open or close the menu clicking on the bottom "menu" link
	$('.act-btn-trigger').on('click', function(){
		$(this).toggleClass('menu-is-open');
		$(".white_box").toggleClass('cl_show');
		//we need to remove the transitionEnd event handler (we add it when scolling up with the menu open)
		mainNavigation.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend').toggleClass('is-visible');
		//mainNavigation_hoz.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend').toggleClass('is-visible');

	});

	$('#act-btn-nav li a').on('click', function(){
		$(".act-btn-trigger").toggleClass('menu-is-open');
			//we need to remove the transitionEnd event handler (we add it when scolling up with the menu open)
			mainNavigation.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend').toggleClass('is-visible');
			//mainNavigation_hoz.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend').toggleClass('is-visible');
		});


	function checkMenu() {
		if( $(window).scrollTop() > offset && !navigationContainer.hasClass('is-fixed')) {
			navigationContainer.addClass('is-fixed').find('.act-btn-trigger').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
				mainNavigation.addClass('has-transitions');
			});
		} else if ($(window).scrollTop() <= offset) {
			//check if the menu is open when scrolling up
			if( mainNavigation.hasClass('is-visible')  && !$('html').hasClass('no-csstransitions') ) {
				//close the menu with animation
				mainNavigation.addClass('is-hidden').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
					//wait for the menu to be closed and do the rest
					mainNavigation.removeClass('is-visible is-hidden has-transitions');
					navigationContainer.removeClass('is-fixed');
					$('.act-btn-trigger').removeClass('menu-is-open');
				});
			//check if the menu is open when scrolling up - fallback if transitions are not supported
		} else if( mainNavigation.hasClass('is-visible')  && $('html').hasClass('no-csstransitions') ) {
			mainNavigation.removeClass('is-visible has-transitions');
			navigationContainer.removeClass('is-fixed');
			$('.act-btn-trigger').removeClass('menu-is-open');
			//scrolling up with menu closed
		} else {
			navigationContainer.removeClass('is-fixed');
			mainNavigation.removeClass('has-transitions');
		}
	} 
}
});