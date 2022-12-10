(function($) {
	'use strict';

	$(document).ready(function() {
		$('.svq-login-form').on('submit', function(e) {
			if ($('#svq-login-terms').length > 0 && !$('#svq-login-terms').is(':checked')) {
				$('.svq-login-result', this).html(SqAjaxLoginLocale.agreeTerms).show();
				return false;
			}

			$('.svq-login-result', this).show().html(SqAjaxLoginLocale.loadingMessage);
			$(window).trigger('resize');

			let data = $(this).serialize();
			let _self = this;
			data += '&action=svq-ajax-login';

			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: SqAjaxLoginLocale.loginUrl,
				data: data,
				success: function(data) {
					$('.svq-login-result', _self).html(data.message);
					if (data.loggedin == true) {
						if (data.redirecturl == null) {
							document.location.reload();
						} else {
							document.location.href = data.redirecturl;
						}
					}
					$(window).trigger('resize');
				},
				complete: function() {

				},
				error: function() {
					$(_self).off('submit').submit();
				},
			});

			e.preventDefault();
		});

		$('.svq-register-form').on('submit', function(e) {
			e.preventDefault();

			const registerResult = $('.svq-register-result', this);
			const registerTerms = $('#svq-register-terms');

			if (registerTerms.length > 0 && !registerTerms.is(':checked')) {
				$('.svq-register-result', this).html(SqAjaxLoginLocale.agreeTerms).show();
				return false;
			}

			registerResult.show().html(SqAjaxLoginLocale.loadingMessage);
			$(window).trigger('resize');

			let data = new FormData(this);
			data.set('category', localStorage.getItem('category'));

			$.ajax({
				type: 'POST',
				url: SqAjaxLoginLocale.ajaxUrl,
				data: data,
				cache: false,
				processData: false,
				contentType: false,
				context: $(this),
				beforeSend: function() {
					$(this).find('button[type="submit"]').prop('disabled', true);
				},
				success: function(data) {
					data = $.parseJSON(data);
					registerResult.html(data.message);

					if (data.registered) {
						localStorage.removeItem('category');
						$(this).find('input[type=text], input[type=email]').val('');
					}

					$(window).trigger('resize');
					if (data.redirecturl) {
						document.location.href = data.redirecturl;
					}
				},
				complete: function() {
					$(this).find('button[type="submit"]').prop('disabled', false);
				},
				error: function() {
					$(this).off('submit').submit();
				},
			});

			return false;
		});

		$('.svq-lost-form').on('submit', function() {
			let data = $(this).serialize();
			data += '&action=svq_lost_password';
			let resultDiv = $('.svq-forgot-result', this);

			resultDiv.show().html(SqAjaxLoginLocale.loadingMessage);
			$(window).trigger('resize');

			$.ajax({
				url: SqAjaxLoginLocale.ajaxUrl,
				type: 'POST',
				data: data,
				success: function(data) {
					resultDiv.html(data);
					$(window).trigger('resize');
				},
				error: function() {
					resultDiv.html(SqAjaxLoginLocale.errorOcurred).css('color', 'red');
				},

			});

			return false;
		});
	});

})(jQuery);
