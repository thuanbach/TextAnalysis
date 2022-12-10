(function() {
  var HeaderList,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  namespace({
    Noba: {
      Chapter: HeaderList = (function() {
        function HeaderList(container, observable) {
          this.container = container;
          this.observable = observable;
          this.hash = __bind(this.hash, this);
          this.nestHeaders = __bind(this.nestHeaders, this);
          this.findHeaders = __bind(this.findHeaders, this);
          this.headers = ko.computed(this.findHeaders).extend({
            rateLimit: 200
          });
          this.nestedHeaders = ko.computed(this.nestHeaders);
        }

        HeaderList.prototype.findHeaders = function() {
          var container, element, header, headers, text, _i, _len, _ref;
          if (this.observable) {
            this.observable();
          }
          headers = [];
          container = this.container();
          if (!container) {
            return headers;
          }
          _ref = container.find('h1,h2');
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            element = _ref[_i];
            text = element.textContent.trim().replace(/&nbsp;/g, '');
            if (text.length > 250 || text === '') {
              continue;
            }
            header = (element.header != null ? element.header : element.header = new Noba.Chapter.HeaderList.Header(text, element.tagName));
            header.text(text);
            headers.push(header);
            element.setAttribute('id', header.id());
          }
          if (!(headers[0] && headers[0].type === 'H1')) {
            headers.unshift(new Noba.Chapter.HeaderList.Header('Introduction', 'H1', true));
          }
          return headers;
        };

        HeaderList.prototype.nestHeaders = function() {
          var h1, h2s, header, headers, _i, _len, _ref, _ref1;
          this.hash();
          headers = [];
          _ref = this.headers.peek();
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            header = _ref[_i];
            if (header.type === 'H1') {
              _ref1 = [header, []], h1 = _ref1[0], h2s = _ref1[1];
              headers.push({
                h1: h1,
                h2s: h2s
              });
            } else if (h1) {
              h2s.push(header);
            }
          }
          return headers;
        };

        HeaderList.prototype.hash = function() {
          var header;
          return ((function() {
            var _i, _len, _ref, _results;
            _ref = this.headers();
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              header = _ref[_i];
              if (!header.implicit) {
                _results.push(header.type);
              }
            }
            return _results;
          }).call(this)).join();
        };

        return HeaderList;

      })()
    }
  });

}).call(this);
(function() {
  var Header;

  namespace({
    Noba: {
      Chapter: {
        HeaderList: Header = (function() {
          function Header(text, type, implicit) {
            var _this = this;
            this.type = type;
            this.implicit = implicit != null ? implicit : false;
            this.text = ko.observable(text);
            this.id = ko.computed(function() {
              return parameterize(_this.text());
            });
            this.href = ko.computed(function() {
              return "#" + (_this.id());
            });
            this.optionText = ko.computed(function() {
              if (_this.type === 'H1') {
                return _this.text();
              } else {
                return "- " + (_this.text());
              }
            });
          }

          return Header;

        })()
      }
    }
  });

}).call(this);
(function() {
  $(function() {
    var header;
    $('article.noba-chapter-enhanced a[data-term]').popover({
      trigger: 'manual',
      placement: 'bottom',
      html: true,
      title: function() {
        return $("dt[data-term='" + ($(this).attr('data-term')) + "']").html();
      },
      content: function() {
        return $("dt[data-term='" + ($(this).attr('data-term')) + "'] + dd").html();
      }
    }).click(function(e) {
      e.preventDefault();
      return $(this).popover('toggle');
    }).mouseleave(function(e) {
      var link;
      link = $(this);
      return setTimeout(function() {
        return link.popover('hide');
      }, 200);
    });
    $('article.noba-chapter-enhanced a[data-reference]').popover({
      trigger: 'manual',
      placement: 'bottom',
      html: true,
      title: "Reference",
      content: function() {
        return $("li[data-reference='" + ($(this).attr('data-reference')) + "']").html();
      }
    }).click(function(e) {
      e.preventDefault();
      return $(this).popover('toggle');
    }).mouseleave(function(e) {
      var link;
      link = $(this);
      return setTimeout(function() {
        return link.popover('hide');
      }, 200);
    });
    $('article.noba-chapter-enhanced a[data-footnote]').popover({
      trigger: 'manual',
      placement: 'bottom',
      html: true,
      title: "Footnote",
      content: function() {
        return $("li[data-footnote='" + ($(this).attr('data-footnote')) + "']").html();
      }
    }).click(function(e) {
      e.preventDefault();
      return $(this).popover('toggle');
    }).mouseleave(function(e) {
      var link;
      link = $(this);
      return setTimeout(function() {
        return link.popover('hide');
      }, 200);
    });
    $('article.noba-chapter a[rel="author"]').click(function(e) {
      e.preventDefault();
      return $.smoothScroll({
        scrollTarget: '#authors',
        offset: -80
      });
    });
    $('[data-spy="smart-affix"] .panel-body').on('activate.bs.scrollspy', function(e) {
      if ($(this).filter(':hover').length === 0) {
        return Noba.utilities.scrollIntoView($(e.target), {
          parent: $(this),
          offset: 50
        });
      }
    });
    if ($('article.noba-chapter').length > 0 && location.hash.length > 1) {
      header = $(location.hash).get(0);
      if (header) {
        setTimeout(function() {
          return document.body.scrollTop = header.offsetTop + 35;
        }, 50);
      }
    }
    if ($('#adaptive-learning-form').length > 0) {
      return $('#adaptive-learning-form').submit();
    }
  });

}).call(this);
