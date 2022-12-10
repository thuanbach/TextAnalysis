/** 
 * Frontend JS File 
 * v 1.0.1 
 * 
 * @since   2.3.2
 * @since   2.7.1   Compatibility with 2.7.0
 */
(function ($) {
    'use strict';
 
    $(document).ready(function () {
 
        if( $('.sjb-detail').length ) {
             
            // On Resume Optional Feature -> Remove Required Asteric Indicator
            if ( '' === resume.require_resume) {
                $('#applicant-resume').addClass("sjb-not-required");
                $('#applicant-resume').parent().parent().prev().find('label span').remove();
            }
        }
    });
})(jQuery);