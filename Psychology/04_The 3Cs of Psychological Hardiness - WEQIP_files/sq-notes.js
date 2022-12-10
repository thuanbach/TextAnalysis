jQuery(function($) {
	$(document).on('click', '.svq-sidelink a', null, function(e) {
		e.preventDefault();
		e.stopPropagation();
		var $footnoteContent = $('.svq-sidenote[data-svq-note="' + $(this).parent().attr('data-svq-note') + '"]');
		if ($footnoteContent.is(':hidden')) {
			if ($(window).width() >= 768 && $(this).parent().is(':not(.svq-sidelink--expands-on-desktop)')) {

				modern_footnotes_hide_footnotes();
				$(this).parent().toggleClass('svq-sidelink--selected');
				$footnoteContent.show().
					addClass('svq-sidenote--tooltip').
					removeClass('svq-sidenote--expandable');

				var position = $(this).parent().position();
				var fontHeight = Math.floor(parseInt($(this).parent().parent().css('font-size').replace(/px/, '')) * 1.5);
				var footnoteWidth = $footnoteContent.outerWidth();
				var windowWidth = $(window).width();
				var left = position.left - footnoteWidth / 2;
				if (left < 0) left = 8;
				if (left + footnoteWidth > $(window).width()) left = $(window).width() - footnoteWidth;
				var top = (parseInt(position.top) + parseInt(fontHeight));
				$footnoteContent.css({
					top: top + 'px',
					left: left + 'px',
				});

				$footnoteContent.after('<div class="svq-sidelink__connector"></div>');
				var superscriptPosition = $(this).parent().position();
				var superscriptHeight = $(this).parent().outerHeight();
				var superscriptWidth = $(this).parent().outerWidth();
				var connectorHeight = top - superscriptPosition.top - superscriptHeight;
				$('.svq-sidelink__connector').css({
					top: (superscriptPosition.top + superscriptHeight) + 'px',
					height: connectorHeight,
					left: (superscriptPosition.left + superscriptWidth / 2) + 'px',
				});
			} else {

				$footnoteContent.removeClass('svq-sidenote--tooltip').
					addClass('svq-sidenote--expandable').
					css('display', 'block');
				$(this).data('unopenedContent', $(this).html());
				$(this).html('x');
			}
		} else {
			modern_footnotes_hide_footnotes();
		}
	}).on('click', '.svq-sidenote', null, function(e) {
		e.stopPropagation();
	}).on('click', '.svq-sidenote__close a', null, function(e) {
		e.preventDefault();
		modern_footnotes_hide_footnotes();
	}).on('click', function() {
		modern_footnotes_hide_footnotes();
	});

	//hide all footnotes on window resize or clicking anywhere but on the footnote link
	$(window).resize(function() {
		modern_footnotes_hide_footnotes();
	});

	//some plugins, like TablePress, cause shortcodes to be rendered
	//in a different order than they appear in the HTML. This can cause
	//the numbering to be out of order. I couldn't find a way to deal
	//with this on the PHP side (as of 1/27/18), so this JavaScript fix
	//will correct the numbering if it's not sequential.
	var $footnotesAnchorLinks = $('.svq-sidelink a');
	var usedReferenceNumbers = [0];
	if ($footnotesAnchorLinks.length > 1) {
		$footnotesAnchorLinks.each(function() {
			if ($(this).is('a[refnum]')) {
				var manualRefNum = $(this).attr('refnum');
				if ($(this).html() != manualRefNum) {
					$(this).html(manualRefNum);
				}
				if (!isNaN(parseFloat(manualRefNum)) && isFinite(manualRefNum)) {
					usedReferenceNumbers.push(manualRefNum);
				}
			} else {
				var refNum = Math.max.apply(null, usedReferenceNumbers) + 1;
				if ($(this).html() != refNum) {
					$(this).html(refNum);
				}
				usedReferenceNumbers.push(refNum);
			}
		});
	}

});

function modern_footnotes_hide_footnotes() {
	jQuery('.svq-sidelink a').each(function() {
		var $this = jQuery(this);
		if ($this.data('unopenedContent')) {
			$this.html($this.data('unopenedContent'));
		}
	});
	//jQuery('.svq-sidenote').hide().css({'left': '', 'top': ''});
	jQuery('.svq-sidelink__connector').remove();
	jQuery('.svq-sidelink--selected').removeClass('svq-sidelink--selected');
}
