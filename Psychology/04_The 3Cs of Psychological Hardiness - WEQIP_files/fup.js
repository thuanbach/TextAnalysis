var FUP = FUP || {};

(function($) {

  'use strict';

  FUP.main = {
    routesNamespace: window.fupVar.base_url + '/wp-json/fup',
    routes: {
      user: {
        follow: '/user/follow',
        unfollow: '/user/unfollow',
        block: '/user/block',
        unblock: '/user/unblock',
      },
      category: {
        follow: '/category/follow',
        unfollow: '/category/unfollow',
      },
      post: {
        bookmark: '/post/bookmark',
        unbookmark: '/post/unbookmark',
        like: '/post/like',
        unlike: '/post/unlike',
      },
      notifications: {
        updateFollowers: '/notification/update-followers',
        subscribeComments: '/notification/subscribe-comments',
        unsubscribeComments: '/notification/unsubscribe-comments',
      },
    },

    request: function(route, id, target, self) {
      let data = {};

      if (id) {
        data = {
          id: id,
        };
      }

      if (self && self.attr('data-action') === 'fup-post-like') {
        self.find('.svq-love').addClass('is_animating');
      }

      $.ajax({
        type: 'POST',
        url: FUP.main.routesNamespace + route + '?_wpnonce=' + window.fupVar.nonce,
        data: data,
        beforeSend: function() {
          self.prop('disabled', true).addClass('is-loading');
        },
        complete: function() {
          self.prop('disabled', false).removeClass('is-loading');
        },
        success: function(response) {
          if (target) {
            $(target).each(function(index, item) {
              let button = $(item);

              if (parseInt(button.data('target')) === id) {
                let count = button.find('.svq-love-count');
                switch (response.message) {
                  case 'user-follow':
                    button.attr('data-action', 'fup-author-unfollow');
                    break;
                  case 'user-unfollow':
                    button.attr('data-action', 'fup-author-follow');
                    break;
                  case 'category-follow':
                    button.attr('data-action', 'fup-category-unfollow');
                    break;
                  case 'category-unfollow':
                    button.attr('data-action', 'fup-category-follow');
                    break;
                  case 'post-like':
                    setTimeout(function() {
                      if (self)
                        self.find('.svq-love').removeClass('is_animating');
                      button.find('.svq-love').addClass('animated');
                      button.attr('data-action', 'fup-post-unlike');
                      count.text(parseInt(count.text()) + 1);
                    }, 300);
                    break;
                  case 'post-unlike':
                    button.find('.svq-love').removeClass('animated');
                    button.attr('data-action', 'fup-post-like');
                    count.text(parseInt(count.text()) - 1);
                    break;
                  default:
                }

                button.toggleClass('is-changed');
              }
            });
          }
        },
        error: function(error) {

        },
      });
    },

    initAPI: function() {
      let actions = FUP.main.apiActions();

      for (let target in actions) {
        $(document).on('click', target, function(e) {
          if (!$(this).hasClass('svq-login-popup')) {
            e.preventDefault();
            let targetID = $(this).data('target');
            if (targetID) {
              if ($(this).hasClass('no-ajax')) {
                let targets = FUP.main.storageItems();

                let _this = $(this);
                $.each(targets, function(index, element) {
                  if (_this.is($(element))) {
                    let data = [];
                    let storage = localStorage.getItem(_this.data('type'));
                    if (storage) {
                      data = JSON.parse(storage);
                    }

                    let exists = data.indexOf(targetID);
                    if (exists < 0) {
                      data.push(targetID);
                    } else {
                      data.splice(exists, 1);
                    }

                    _this.toggleClass('is-changed');

                    localStorage.setItem(_this.data('type'), JSON.stringify(data));
                  }
                });
              } else {
                FUP.main.request(actions[target], parseInt(targetID), target, $(this));
              }
            }
          }
        });
      }

    },

    initSimpleAPI: function() {
      let actions = {
        '[data-action="fup-update-followers-notification"]': FUP.main.routes.notifications.updateFollowers,
      };

      for (let target in actions) {
        $(target).on('click', function(e) {
          e.preventDefault();

          FUP.main.request(actions[target], null, null, null);
        });
      }
    },

    initProfileTabs: function() {
      $('#fup-tabs a').on('click', function(e) {
        e.preventDefault();
        $(this).tab('show');
      });
    },

    apiActions: function() {
      return {
        '[data-action="fup-author-follow"]': FUP.main.routes.user.follow,
        '[data-action="fup-author-unfollow"]': FUP.main.routes.user.unfollow,
        '[data-action="fup-author-block"]': FUP.main.routes.user.block,
        '[data-action="fup-author-unblock"]': FUP.main.routes.user.unblock,
        '[data-action="fup-category-follow"]': FUP.main.routes.category.follow,
        '[data-action="fup-category-unfollow"]': FUP.main.routes.category.unfollow,
        '[data-action="fup-post-bookmark"]': FUP.main.routes.post.bookmark,
        '[data-action="fup-post-unbookmark"]': FUP.main.routes.post.unbookmark,
        '[data-action="fup-post-like"]': FUP.main.routes.post.like,
        '[data-action="fup-post-unlike"]': FUP.main.routes.post.unlike,
      };
    },

    storageItems: function() {
      return [
        '[data-type="category"]',
      ];
    },

    checkStorage: function() {
      let targets = FUP.main.storageItems();
      for (let i in targets) {
        $.each($(targets[i]), function(index, item) {
          if ($(item) && $(item).hasClass('no-ajax')) {
            let targetID = $(item).data('target');
            if (targetID) {

              let data = [];
              let storage = localStorage.getItem($(item).data('type'));
              if (storage) {
                data = JSON.parse(storage);
              }

              let exists = data.indexOf(targetID);
              if (exists > -1) {
                $(item).toggleClass('is-changed');
              }

            }
          }
        });
      }
    },

    imageWatcher: function() {
      $('.svq-img-input').on('change', function(e) {
        let file = e.currentTarget.files[0];

        if (file && file.type.match(/image.*/)) {
          let reader = new FileReader();
          let box = $(this).parent().parent();
          let previewContainer = box.find('.svq-comment--el-preview');

          if (previewContainer) {
            reader.onload = function() {
              previewContainer.css('background-image', 'url(' + reader.result + ')');
            };

            reader.readAsDataURL(file);
            box.addClass('has-element');
          }
        }
      });

      $('.svq-img-del').on('click', function(e) {
        e.preventDefault();
        $(this).
            parent().
            removeClass('has-element').
            find('.svq-comment--el-preview').
            attr('style', null).
            parent().
            find('input.svq-comment--file-input').
            val('').
            parent().
            find('input.svq-file-del').
            val('1');
      });
    },

    themePreview: function() {
      $('#toggle-dark').on('change', function() {
        if ($(this).is(':checked')) {
          $('body').addClass('theme-color-dark');
          document.cookie = 'darktheme=1; path=' + $(this).data('site');
        } else {
          $('body').removeClass('theme-color-dark');
          document.cookie = 'darktheme=; Max-Age=-99999999; path=' + $(this).data('site');
        }
      });
    },

    coverOverlayPreview: function() {
      $('.profile-cover-overlay').on('change', function() {
        $('.svq-panel .svq-progressive__placeholder-image').
            removeClass().
            addClass('svq-progressive__placeholder-image').
            addClass('svq-overlay').
            addClass('svq-overlay--' + $(this).val());
      });
    },

    subscribe: function() {
      $(document).on('click', '.svq-subscribe', function(e) {
        e.preventDefault();

        let _this = $(this);

        $.ajax({
          type: 'POST',
          url: FUP.main.routesNamespace + FUP.main.routes.notifications.subscribeComments + '?_wpnonce=' +
              window.fupVar.nonce,
          data: {
            post: $(this).data('post'),
          },
          success: function(response) {
            if (response.code === 'success')
              _this.parent().replaceWith(response.data[0]);
          },
          error: function(error) {

          },
        });
      });
    },

    unsubscribe: function() {
      $(document).on('click', '.svq-unsubscribe', function(e) {
        e.preventDefault();

        let _this = $(this);

        $.ajax({
          type: 'POST',
          url: FUP.main.routesNamespace + FUP.main.routes.notifications.unsubscribeComments + '?_wpnonce=' +
              window.fupVar.nonce,
          data: {
            post: $(this).data('post'),
          },
          success: function(response) {
            if (response.code === 'success')
              _this.parent().replaceWith(response.data[0]);
          },
          error: function(error) {

          },
        });
      });
    },

    loadMore: function() {
      $('.svq-more').on('click', function(e) {
        e.preventDefault();
        let type = $(this).data('more');
        let URL = FUP.main.routesNamespace + '/load-more?_wpnonce=' + window.fupVar.nonce;
        let data = {type: type, offset: 1, user_id: '', hash: ''};

        if (type === 'stories') {
          URL = FUP.main.routesNamespace + '/load-more-stories?_wpnonce=' + window.fupVar.nonce;
          data = {
            user_id: $(this).data('user-id'),
            hash: $(this).data('hash'),
          };
        } else if (type === 'categories') {
          URL = FUP.main.routesNamespace + '/load-more-categories?_wpnonce=' + window.fupVar.nonce;
          data = {
            hash: $(this).data('hash'),
          };
        }

        $.ajax({
          type: 'POST',
          url: URL,
          data: data,
          context: this,
          beforeSend: function() {
            $(this).prop('disabled', true).addClass('is-loading');
          },
          complete: function() {
            $(this).prop('disabled', false).removeClass('is-loading');
          },
          success: function(response) {
            if (response.code === 'success') {
              if (!response.data[0]) {
                $(this).parent().hide();
              } else {
                switch (type) {
                  case 'feed-authors':
                    $(this).parent().parent().find('.feed-authors').append(response.data[0]);
                    break;
                  case 'feed-categories':
                    $(this).parent().parent().find('.feed-categories').append(response.data[0]);
                    break;
                  case 'stories':
                    $(this).parent().parent().find('.my-stories').append(response.data[0]);
                    break;
                  case 'drafts':
                    $(this).parent().parent().find('.my-drafts').append(response.data[0]);
                    break;
                  case 'bookmarks':
                    $(this).parent().parent().find('.bookmarks-listings').append(response.data[0]);
                    break;
                  case 'categories':
                    $(this).parent().parent().find('.tags-category').append(response.data[0]);
                    break;
                  case 'blocked':
                    $(this).parent().parent().find('.people-listings').append(response.data[0]);
                    break;
                  case 'following':
                    $(this).parent().parent().find('.people-listings').append(response.data[0]);
                    break;
                  case 'followers':
                    $(this).parent().parent().find('.people-listings').append(response.data[0]);
                    break;
                  default:
                }

                let event = new Event('fupAjaxLoaded');
                window.dispatchEvent(event);
              }
            }
          },
          error: function(error) {

          },
        });
      });
    },

    init: function() {
      FUP.main.initAPI();
      FUP.main.initSimpleAPI();

      FUP.main.initProfileTabs();
      FUP.main.checkStorage();

      FUP.main.imageWatcher();
      FUP.main.themePreview();
      FUP.main.coverOverlayPreview();
      FUP.main.subscribe();
      FUP.main.unsubscribe();
      FUP.main.loadMore();
    },
  };

})(jQuery);

jQuery(document).ready(function() {
  FUP.main.init();
});
