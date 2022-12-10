window.onload = function () {
    if (typeof jQuery == 'undefined') {
        throw new Error('jQuery not loaded. Comments media will not work properly.');
    }
};

jQuery(document).ready(function ($) {
    let filesContainer = $('.comment-media-form');
    let inputBoxID = filesContainer.children().length + 1;

    function inputBox() {
        inputBoxID++;
        let wpThemeUri = filesContainer.data('template');

        return '<div class="svq-comment--media-el">' +
            '<div class="svq-comment--el-preview"></div>' +
            '<div class="svq-comment--file">' +
            '<label class="svq-comment--file-label" for="attachments-' + inputBoxID + '"></label>' +
            '<input class="svq-comment--file-input svq-form-input" id="attachments-' + inputBoxID + '" name="attachments[]" type="file" />' +
            '</div>' +
            '<span class="svq-comment--file-add"><span class="svq-icon icon-cloud-upload icon--x24"></span></span>' +
            '<span class="svq-comment--file-delete svq-del-file"><span class="svq-icon icon-close icon--x18"></span></span>' +
            '</div>';
    }

    let validation = $('.file-validation');
    let max_file_size = validation.data('max-file');
    let max_post_size = validation.data('max-upload');
    let current_post_size = 0;

    function checkFileSizes() {
        current_post_size = 0;

        let submit_btn = $('button[type="submit"]');

        let max_file_size_reached = false;

        $.each($('.comment-media-form .svq-form-input'), function (i, input) {
            if (input.files.length) {
                let file = input.files[0];

                current_post_size += file.size;

                if(!max_file_size_reached) {
                    validation.hide();
                    validation.html('');
                    submit_btn.prop('disabled', false);
                }

                $(input).closest('.svq-comment--media-el').removeClass('max-size-reached');

                if (file.size > max_file_size) {
                    validation.show();
                    validation.html('<ul><li>' + validation.data('file-message') + '</li></ul>');
                    submit_btn.prop('disabled', true);
                    $(input).closest('.svq-comment--media-el').addClass('max-size-reached');
                    max_file_size_reached = true;
                }

                if (current_post_size > max_post_size) {
                    validation.show();
                    validation.html('<ul><li>' + validation.data('upload-message') + '</li></ul>');
                    submit_btn.prop('disabled', true);
                }
            }
        });
    }

    filesContainer.on('change', '.svq-form-input', function (e) {
        let file = e.currentTarget.files[0];

        if (file && file.type.match(/image.*/)) {
            let reader = new FileReader();
            let box = $(this).parent().parent();
            let previewContainer = box.find('.svq-comment--el-preview');

            if (previewContainer) {
                reader.onload = function () {
                    previewContainer.css('background-image', 'url(' + reader.result + ')');
                };
                reader.readAsDataURL(file);
                if (!box.hasClass('has-element') && filesContainer.children().length < 5) {
                    filesContainer.append(inputBox());
                }
                box.addClass('has-element');
            }
        } else {
            if ($(this).parent().parent().hasClass('has-element'))
                $(this).parent().parent().remove();
        }

        checkFileSizes();
    });

    filesContainer.on('click', '.svq-del-file', function (e) {
        e.preventDefault();
        let allHaveImages = true;

        $.each(filesContainer.children(), function (index, element) {
            if (!$(element).hasClass('has-element')) {
                allHaveImages = false;
            }
        });

        if (filesContainer.children().length === 5 && allHaveImages) {
            $(this).parent().remove();
            filesContainer.append(inputBox());
        } else {
            $(this).parent().remove();
        }

        checkFileSizes();
    });

    $(window).on('clear-comment-form-media', function () {
        filesContainer.children().each(function (index, element) {
            let el = $(element);
            current_post_size = 0;
            if (index) {
                el.remove();
            } else {
                el.removeClass('has-element');
                el.find('.svq-comment--el-preview').attr('style', null);
                el.find('.svq-form-input').val('');
            }
        });
    });
});
