(function() {
  (function(root) {
    var fn;
    fn = function() {
      var Class, args, match, name, obj, parent, subpackage, target;
      args = arguments[0];
      target = root;
      parent = null;
      while (true) {
        for (subpackage in args) {
          obj = args[subpackage];
          parent = [target, subpackage];
          target = target[subpackage] != null ? target[subpackage] : target[subpackage] = {};
          args = obj;
        }
        if (typeof args !== 'object') {
          break;
        }
      }
      Class = args;
      if (arguments[0].hasOwnProperty('global')) {
        target = root;
      }
      match = Class.toString().match(/^function\s(\w+)\(/);
      if (match != null) {
        name = match[1];
        return target[name] = Class;
      } else {
        return parent[0][parent[1]] = Class;
      }
    };
    root.namespace = fn;
    return root.module = fn;
  })(typeof global !== "undefined" && global !== null ? global : window);

}).call(this);
(function() {
  if (!String.prototype.trim) {
    String.prototype.trim = function() {
      return this.replace(/^\s+|\s+$/g, '');
    };
  }

}).call(this);
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Button elements boud jquery-ujs
    buttonClickSelector: 'button[data-remote]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $document.delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $document.delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.delegate(rails.buttonClickSelector, 'click.rails', function(e) {
      var button = $(this);
      if (!rails.allowAction(button)) return rails.stopEverything(e);

      rails.handleRemote(button);
      return false;
    });

    $document.delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
/*
 * jQuery UI Touch Punch 0.2.2
 *
 * Copyright 2011, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */

(function(b){b.support.touch="ontouchend" in document;if(!b.support.touch){return;}var c=b.ui.mouse.prototype,e=c._mouseInit,a;function d(g,h){if(g.originalEvent.touches.length>1){return;}g.preventDefault();var i=g.originalEvent.changedTouches[0],f=document.createEvent("MouseEvents");f.initMouseEvent(h,true,true,window,1,i.screenX,i.screenY,i.clientX,i.clientY,false,false,false,false,0,null);g.target.dispatchEvent(f);}c._touchStart=function(g){var f=this;if(a||!f._mouseCapture(g.originalEvent.changedTouches[0])){return;}a=true;f._touchMoved=false;d(g,"mouseover");d(g,"mousemove");d(g,"mousedown");};c._touchMove=function(f){if(!a){return;}this._touchMoved=true;d(f,"mousemove");};c._touchEnd=function(f){if(!a){return;}d(f,"mouseup");d(f,"mouseout");if(!this._touchMoved){d(f,"click");}a=false;};c._mouseInit=function(){var f=this;f.element.bind("touchstart",b.proxy(f,"_touchStart")).bind("touchmove",b.proxy(f,"_touchMove")).bind("touchend",b.proxy(f,"_touchEnd"));e.call(f);};})(jQuery);
/* ========================================================================
 * Bootstrap: affix.js v3.0.3
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)
    this.$window = $(window)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element = $(element)
    this.affixed  =
    this.unpin    = null

    this.checkPosition()
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$window.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin) this.$element.css('top', '')

    this.affixed = affix
    this.unpin   = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(Affix.RESET).addClass('affix' + (affix ? '-' + affix : ''))

    if (affix == 'bottom') {
      this.$element.offset({ top: document.body.offsetHeight - offsetBottom - this.$element.height() })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      $spy.affix(data)
    })
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: alert.js v3.0.3
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);
/* ========================================================================
 * Bootstrap: button.js v3.0.3
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element = $(element)
    this.options  = $.extend({}, Button.DEFAULTS, options)
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d);
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons"]')
    var changed = true

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') === 'radio') {
        // see if clicking on current one
        if ($input.prop('checked') && this.$element.hasClass('active'))
          changed = false
        else
          $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: carousel.js v3.0.3
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000
  , pause: 'hover'
  , wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition.end) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    this.sliding = true

    isCycling && this.pause()

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })

    if ($next.hasClass('active')) return

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid.bs.carousel', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid.bs.carousel') }, 0)
        })
        .emulateTransitionEnd(600)
    } else {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid.bs.carousel')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: collapse.js v3.0.3
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: dropdown.js v3.0.3
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      $parent.trigger(e = $.Event('show.bs.dropdown'))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown')

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var $items = $('[role=menu] li:not(.divider):visible a', $parent)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index=0

    $items.eq(index).focus()
  }

  function clearMenus() {
    $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(jQuery);
/* ========================================================================
 * Bootstrap: tab.js v3.0.3
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab'
      , relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: transition.js v3.0.3
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: modal.js v3.0.3
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) this.$element.load(this.options.remote)
  }

  Modal.DEFAULTS = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      that.$element.show()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that    = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.bs.modal',  '.modal', function () { $(document.body).addClass('modal-open') })
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(jQuery);
/* ========================================================================
 * Bootstrap: tooltip.js v3.0.3
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay
      , hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    $tip
      .offset(offset)
      .addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.$element.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);
/* ========================================================================
 * Bootstrap: popover.js v3.0.3
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({} , $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);
/* ========================================================================
 * Bootstrap: scrollspy.js v3.2.0
 * https://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */



+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var process  = $.proxy(this.process, this)

    this.$body            = $('body')
    this.$scrollElement   = $(element).is('body') ? $(window) : $(element)
    this.options          = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector         = (this.options.target || '') + ' .nav li > a'
    this.direction        = (this.options.direction || 'vertical')
    this.offsets          = []
    this.targets          = []
    this.activeTarget     = null
    this.scrollDimensions = 0

    if (this.direction === 'vertical') {
      this._scrollPosition = 'scrollTop'
      this._getScrollDimensions = 'getScrollHeight'
      this._position = 'top'
      this._dimensions = 'height'

    } else {
      this._scrollPosition = 'scrollLeft'
      this._getScrollDimensions = 'getScrollWidth'
      this._position = 'left'
      this._dimensions = 'width'
    }

    this.$scrollElement.on('scroll.bs.scrollspy', process)
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.2.0'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollWidth = function () {
    return this.$scrollElement[0].scrollWidth || Math.max(this.$body[0].scrollWidth, document.documentElement.scrollWidth)
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = 'offset'
    var offsetBase   = 0

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement[this._scrollPosition]()
    }

    this.offsets = []
    this.targets = []
    this.scrollDimensions = this[this._getScrollDimensions]()

    var self = this

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]()[self._position] + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollPosition    = this.$scrollElement[this._scrollPosition]() + this.options.offset
    var scrollDimensions  = this[this._getScrollDimensions]()
    var maxScroll         = this.options.offset + scrollDimensions - this.$scrollElement[this._dimensions]()
    var offsets           = this.offsets
    var targets           = this.targets
    var activeTarget      = this.activeTarget
    var i

    if (this.scrollDimensions != scrollDimensions) {
      this.refresh()
    }

    if (scrollPosition >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollPosition <= offsets[0]) {
      return activeTarget != (i = targets[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollPosition >= offsets[i]
        && (!offsets[i + 1] || scrollPosition <= offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')

    var selector = this.selector +
        '[data-target="' + target + '"],' +
        this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);
/*
  Redactor v9.2.6
  Updated: Jul 19, 2014

  https://imperavi.com/redactor/

  Copyright (c) 2009-2014, Imperavi LLC.
  License: https://imperavi.com/redactor/license/

  Usage: $('#content').redactor();
*/

(function($)
{
  var uuid = 0;

  "use strict";

  var Range = function(range)
  {
    this[0] = range.startOffset;
    this[1] = range.endOffset;

    this.range = range;

    return this;
  };

  Range.prototype.equals = function()
  {
    return this[0] === this[1];
  };

  var reUrlYoutube = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube\.com\S*[^\w\-\s])([\w\-]{11})(?=[^\w\-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;
  var reUrlVimeo = /https?:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/;

  // Plugin
  $.fn.redactor = function(options)
  {
    var val = [];
    var args = Array.prototype.slice.call(arguments, 1);

    if (typeof options === 'string')
    {
      this.each(function()
      {
        var instance = $.data(this, 'redactor');
        if (typeof instance !== 'undefined' && $.isFunction(instance[options]))
        {
          var methodVal = instance[options].apply(instance, args);
          if (methodVal !== undefined && methodVal !== instance) val.push(methodVal);
        }
        else return $.error('No such method "' + options + '" for Redactor');
      });
    }
    else
    {
      this.each(function()
      {
        if (!$.data(this, 'redactor')) $.data(this, 'redactor', Redactor(this, options));
      });
    }

    if (val.length === 0) return this;
    else if (val.length === 1) return val[0];
    else return val;

  };

  // Initialization
  function Redactor(el, options)
  {
    return new Redactor.prototype.init(el, options);
  }

  $.Redactor = Redactor;
  $.Redactor.VERSION = '9.2.6';
  $.Redactor.opts = {

      // settings
      rangy: false,

      iframe: false,
      fullpage: false,
      css: false, // url

      lang: 'en',
      direction: 'ltr', // ltr or rtl

      placeholder: false,

      typewriter: false,
      wym: false,
      mobile: true,
      cleanup: true,
      tidyHtml: true,
      pastePlainText: false,
      removeEmptyTags: true,
      cleanSpaces: true,
      cleanFontTag: true,
      templateVars: false,
      xhtml: false,

      visual: true,
      focus: false,
      tabindex: false,
      autoresize: true,
      minHeight: false,
      maxHeight: false,
      shortcuts: {
        'ctrl+m, meta+m': "this.execCommand('removeFormat', false)",
        'ctrl+b, meta+b': "this.execCommand('bold', false)",
        'ctrl+i, meta+i': "this.execCommand('italic', false)",
        'ctrl+h, meta+h': "this.execCommand('superscript', false)",
        'ctrl+l, meta+l': "this.execCommand('subscript', false)",
        'ctrl+k, meta+k': "this.linkShow()",
        'ctrl+shift+7': "this.execCommand('insertorderedlist', false)",
        'ctrl+shift+8': "this.execCommand('insertunorderedlist', false)"
      },
      shortcutsAdd: false,

      autosave: false, // false or url
      autosaveInterval: 60, // seconds

      plugins: false, // array

      //linkAnchor: true,
      //linkEmail: true,
      linkProtocol: 'https://',
      linkNofollow: false,
      linkSize: 50,
      predefinedLinks: false, // json url (ex. /some-url.json ) or false

      imageFloatMargin: '10px',
      imageGetJson: false, // json url (ex. /some-images.json ) or false

      dragUpload: true, // false
      imageTabLink: true,
      imageUpload: false, // url
      imageUploadParam: 'file', // input name
      imageResizable: true,

      fileUpload: false, // url
      fileUploadParam: 'file', // input name
      clipboardUpload: true, // or false
      clipboardUploadUrl: false, // url

      dnbImageTypes: ['image/png', 'image/jpeg', 'image/gif'], // or false

      s3: false,
      uploadFields: false,

      observeImages: true,
      observeLinks: true,

      modalOverlay: true,

      tabSpaces: false, // true or number of spaces
      tabFocus: true,

      air: false,
      airButtons: ['formatting', 'bold', 'italic', 'deleted', 'unorderedlist', 'orderedlist', 'outdent', 'indent'],

      toolbar: true,
      toolbarFixed: false,
      toolbarFixedTarget: document,
      toolbarFixedTopOffset: 0, // pixels
      toolbarFixedBox: false,
      toolbarExternal: false, // ID selector
      toolbarOverflow: false,
      buttonSource: true,

      buttons: ['html', 'formatting', 'bold', 'italic', 'deleted', 'unorderedlist', 'orderedlist',
            'outdent', 'indent', 'image', 'video', 'file', 'table', 'link', 'alignment', '|',
            'horizontalrule'], // 'underline', 'alignleft', 'aligncenter', 'alignright', 'justify'
      buttonsHideOnMobile: [],

      activeButtons: ['deleted', 'italic', 'bold', 'underline', 'unorderedlist', 'orderedlist',
              'alignleft', 'aligncenter', 'alignright', 'justify', 'table'],
      activeButtonsStates: {
        b: 'bold',
        strong: 'bold',
        i: 'italic',
        em: 'italic',
        del: 'deleted',
        strike: 'deleted',
        ul: 'unorderedlist',
        ol: 'orderedlist',
        u: 'underline',
        tr: 'table',
        td: 'table',
        table: 'table'
      },

      formattingTags: ['p', 'blockquote', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],

      linebreaks: false,
      paragraphy: true,
      convertDivs: true,
      convertLinks: true,
      convertImageLinks: false,
      convertVideoLinks: false,
      formattingPre: false,
      phpTags: false,

      allowedTags: false,
      deniedTags: ['html', 'head', 'link', 'body', 'meta', 'script', 'style', 'applet'],

      boldTag: 'strong',
      italicTag: 'em',

      // private
      indentValue: 20,
      buffer: [],
      rebuffer: [],
      textareamode: false,
      emptyHtml: '<p>&#x200b;</p>',
      invisibleSpace: '&#x200b;',
      rBlockTest: /^(P|H[1-6]|LI|ADDRESS|SECTION|HEADER|FOOTER|ASIDE|ARTICLE)$/i,
      alignmentTags: ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'DD', 'DL', 'DT', 'DIV', 'TD',
                'BLOCKQUOTE', 'OUTPUT', 'FIGCAPTION', 'ADDRESS', 'SECTION',
                'HEADER', 'FOOTER', 'ASIDE', 'ARTICLE'],
      ownLine: ['area', 'body', 'head', 'hr', 'i?frame', 'link', 'meta', 'noscript', 'style', 'script', 'table', 'tbody', 'thead', 'tfoot'],
      contOwnLine: ['li', 'dt', 'dt', 'h[1-6]', 'option', 'script'],
      newLevel: ['blockquote', 'div', 'dl', 'fieldset', 'form', 'frameset', 'map', 'ol', 'p', 'pre', 'select', 'td', 'th', 'tr', 'ul'],
      blockLevelElements: ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'DD', 'DL', 'DT', 'DIV', 'LI',
                'BLOCKQUOTE', 'OUTPUT', 'FIGCAPTION', 'PRE', 'ADDRESS', 'SECTION',
                'HEADER', 'FOOTER', 'ASIDE', 'ARTICLE', 'TD'],


      // lang
      langs: {
        en: {
          html: 'HTML',
          video: 'Insert Video',
          image: 'Insert Image',
          table: 'Table',
          link: 'Link',
          link_insert: 'Insert link',
          link_edit: 'Edit link',
          unlink: 'Unlink',
          formatting: 'Formatting',
          paragraph: 'Normal text',
          quote: 'Quote',
          code: 'Code',
          header1: 'Header 1',
          header2: 'Header 2',
          header3: 'Header 3',
          header4: 'Header 4',
          header5: 'Header 5',
          bold: 'Bold',
          italic: 'Italic',
          fontcolor: 'Font Color',
          backcolor: 'Back Color',
          unorderedlist: 'Unordered List',
          orderedlist: 'Ordered List',
          outdent: 'Outdent',
          indent: 'Indent',
          cancel: 'Cancel',
          insert: 'Insert',
          save: 'Save',
          _delete: 'Delete',
          insert_table: 'Insert Table',
          insert_row_above: 'Add Row Above',
          insert_row_below: 'Add Row Below',
          insert_column_left: 'Add Column Left',
          insert_column_right: 'Add Column Right',
          delete_column: 'Delete Column',
          delete_row: 'Delete Row',
          delete_table: 'Delete Table',
          rows: 'Rows',
          columns: 'Columns',
          add_head: 'Add Head',
          delete_head: 'Delete Head',
          title: 'Title',
          image_position: 'Position',
          none: 'None',
          left: 'Left',
          right: 'Right',
          center: 'Center',
          image_web_link: 'Image Web Link',
          text: 'Text',
          mailto: 'Email',
          web: 'URL',
          video_html_code: 'Video Embed Code',
          file: 'Insert File',
          upload: 'Upload',
          download: 'Download',
          choose: 'Choose',
          or_choose: 'Or choose',
          drop_file_here: 'Drop file here',
          align_left: 'Align text to the left',
          align_center: 'Center text',
          align_right: 'Align text to the right',
          align_justify: 'Justify text',
          horizontalrule: 'Insert Horizontal Rule',
          deleted: 'Deleted',
          anchor: 'Anchor',
          link_new_tab: 'Open link in new tab',
          underline: 'Underline',
          alignment: 'Alignment',
          filename: 'Name (optional)',
          edit: 'Edit'
        }
      }
  };

  // Functionality
  Redactor.fn = $.Redactor.prototype = {

    keyCode: {
      BACKSPACE: 8,
      DELETE: 46,
      DOWN: 40,
      ENTER: 13,
      ESC: 27,
      TAB: 9,
      CTRL: 17,
      META: 91,
      LEFT: 37,
      LEFT_WIN: 91
    },

    // Initialization
    init: function(el, options)
    {
      this.rtePaste = false;
      this.$element = this.$source = $(el);
      this.uuid = uuid++;

      // clonning options
      var opts = $.extend(true, {}, $.Redactor.opts);

      // current settings
      this.opts = $.extend(
        {},
        opts,
        this.$element.data(),
        options
      );

      this.start = true;
      this.dropdowns = [];

      // get sizes
      this.sourceHeight = this.$source.css('height');
      this.sourceWidth = this.$source.css('width');

      // dependency of the editor modes
      if (this.opts.fullpage) this.opts.iframe = true;
      if (this.opts.linebreaks) this.opts.paragraphy = false;
      if (this.opts.paragraphy) this.opts.linebreaks = false;
      if (this.opts.toolbarFixedBox) this.opts.toolbarFixed = true;

      // the alias for iframe mode
      this.document = document;
      this.window = window;

      // selection saved
      this.savedSel = false;

      // clean setup
      this.cleanlineBefore = new RegExp('^<(/?' + this.opts.ownLine.join('|/?' ) + '|' + this.opts.contOwnLine.join('|') + ')[ >]');
      this.cleanlineAfter = new RegExp('^<(br|/?' + this.opts.ownLine.join('|/?' ) + '|/' + this.opts.contOwnLine.join('|/') + ')[ >]');
      this.cleannewLevel = new RegExp('^</?(' + this.opts.newLevel.join('|' ) + ')[ >]');

      // block level
      this.rTestBlock = new RegExp('^(' + this.opts.blockLevelElements.join('|' ) + ')$', 'i');

      // setup formatting permissions
      if (this.opts.linebreaks === false)
      {
        if (this.opts.allowedTags !== false)
        {
          var arrSearch = ['strong', 'em', 'del'];
          var arrAdd = ['b', 'i', 'strike'];

          if ($.inArray('p', this.opts.allowedTags) === '-1') this.opts.allowedTags.push('p');

          for (i in arrSearch)
          {
            if ($.inArray(arrSearch[i], this.opts.allowedTags) != '-1') this.opts.allowedTags.push(arrAdd[i]);
          }
        }

        if (this.opts.deniedTags !== false)
        {
          var pos = $.inArray('p', this.opts.deniedTags);
          if (pos !== '-1') this.opts.deniedTags.splice(pos, pos);
        }
      }

      // ie & opera
      if (this.browser('msie') || this.browser('opera'))
      {
        this.opts.buttons = this.removeFromArrayByValue(this.opts.buttons, 'horizontalrule');
      }

      // load lang
      this.opts.curLang = this.opts.langs[this.opts.lang];

      // extend shortcuts
      $.extend(this.opts.shortcuts, this.opts.shortcutsAdd);

      // init placeholder
      this.placeholderInit();

      // Build
      this.buildStart();

    },
    toolbarInit: function(lang)
    {
      return {
        html:
        {
          title: lang.html,
          func: 'toggle'
        },
        formatting:
        {
          title: lang.formatting,
          func: 'show',
          dropdown:
          {
            p:
            {
              title: lang.paragraph,
              func: 'formatBlocks'
            },
            blockquote:
            {
              title: lang.quote,
              func: 'formatQuote',
              className: 'redactor_format_blockquote'
            },
            pre:
            {
              title: lang.code,
              func: 'formatBlocks',
              className: 'redactor_format_pre'
            },
            h1:
            {
              title: lang.header1,
              func: 'formatBlocks',
              className: 'redactor_format_h1'
            },
            h2:
            {
              title: lang.header2,
              func: 'formatBlocks',
              className: 'redactor_format_h2'
            },
            h3:
            {
              title: lang.header3,
              func: 'formatBlocks',
              className: 'redactor_format_h3'
            },
            h4:
            {
              title: lang.header4,
              func: 'formatBlocks',
              className: 'redactor_format_h4'
            },
            h5:
            {
              title: lang.header5,
              func: 'formatBlocks',
              className: 'redactor_format_h5'
            }
          }
        },
        bold:
        {
          title: lang.bold,
          exec: 'bold'
        },
        italic:
        {
          title: lang.italic,
          exec: 'italic'
        },
        deleted:
        {
          title: lang.deleted,
          exec: 'strikethrough'
        },
        underline:
        {
          title: lang.underline,
          exec: 'underline'
        },
        unorderedlist:
        {
          title: '&bull; ' + lang.unorderedlist,
          exec: 'insertunorderedlist'
        },
        orderedlist:
        {
          title: '1. ' + lang.orderedlist,
          exec: 'insertorderedlist'
        },
        outdent:
        {
          title: '< ' + lang.outdent,
          func: 'indentingOutdent'
        },
        indent:
        {
          title: '> ' + lang.indent,
          func: 'indentingIndent'
        },
        image:
        {
          title: lang.image,
          func: 'imageShow'
        },
        video:
        {
          title: lang.video,
          func: 'videoShow'
        },
        file:
        {
          title: lang.file,
          func: 'fileShow'
        },
        table:
        {
          title: lang.table,
          func: 'show',
          dropdown:
          {
            insert_table:
            {
              title: lang.insert_table,
              func: 'tableShow'
            },
            separator_drop1:
            {
              name: 'separator'
            },
            insert_row_above:
            {
              title: lang.insert_row_above,
              func: 'tableAddRowAbove'
            },
            insert_row_below:
            {
              title: lang.insert_row_below,
              func: 'tableAddRowBelow'
            },
            insert_column_left:
            {
              title: lang.insert_column_left,
              func: 'tableAddColumnLeft'
            },
            insert_column_right:
            {
              title: lang.insert_column_right,
              func: 'tableAddColumnRight'
            },
            separator_drop2:
            {
              name: 'separator'
            },
            add_head:
            {
              title: lang.add_head,
              func: 'tableAddHead'
            },
            delete_head:
            {
              title: lang.delete_head,
              func: 'tableDeleteHead'
            },
            separator_drop3:
            {
              name: 'separator'
            },
            delete_column:
            {
              title: lang.delete_column,
              func: 'tableDeleteColumn'
            },
            delete_row:
            {
              title: lang.delete_row,
              func: 'tableDeleteRow'
            },
            delete_table:
            {
              title: lang.delete_table,
              func: 'tableDeleteTable'
            }
          }
        },
        link: {
          title: lang.link,
          func: 'show',
          dropdown:
          {
            link:
            {
              title: lang.link_insert,
              func: 'linkShow'
            },
            unlink:
            {
              title: lang.unlink,
              exec: 'unlink'
            }
          }
        },
        alignment:
        {
          title: lang.alignment,
          func: 'show',
          dropdown:
          {
            alignleft:
            {
              title: lang.align_left,
              func: 'alignmentLeft'
            },
            aligncenter:
            {
              title: lang.align_center,
              func: 'alignmentCenter'
            },
            alignright:
            {
              title: lang.align_right,
              func: 'alignmentRight'
            },
            justify:
            {
              title: lang.align_justify,
              func: 'alignmentJustify'
            }
          }
        },
        alignleft:
        {
          title: lang.align_left,
          func: 'alignmentLeft'
        },
        aligncenter:
        {
          title: lang.align_center,
          func: 'alignmentCenter'
        },
        alignright:
        {
          title: lang.align_right,
          func: 'alignmentRight'
        },
        alignjustify:
        {
          title: lang.align_justify,
          func: 'alignmentJustify'
        },
        horizontalrule:
        {
          exec: 'inserthorizontalrule',
          title: lang.horizontalrule
        }

      }
    },

    // CALLBACKS
    callback: function(type, event, data)
    {
      var callback = this.opts[ type + 'Callback' ];
      if ($.isFunction(callback))
      {
        if (event === false) return callback.call(this, data);
        else return callback.call(this, event, data);
      }
      else return data;
    },


    // DESTROY
    destroy: function()
    {
      clearInterval(this.autosaveInterval);

      $(window).off('.redactor');
      this.$source.off('redactor-textarea');
      this.$element.off('.redactor').removeData('redactor');

      var html = this.get();

      if (this.opts.textareamode)
      {
        this.$box.after(this.$source);
        this.$box.remove();
        this.$source.val(html).show();
      }
      else
      {
        var $elem = this.$editor;
        if (this.opts.iframe) $elem = this.$element;

        this.$box.after($elem);
        this.$box.remove();

        $elem.removeClass('redactor_editor').removeClass('redactor_editor_wym').removeAttr('contenteditable').html(html).show();
      }

      if (this.opts.toolbarExternal)
      {
        $(this.opts.toolbarExternal).html('');
      }

      if (this.opts.air)
      {
        $('#redactor_air_' + this.uuid).remove();
      }
    },

    // API GET
    getObject: function()
    {
      return $.extend({}, this);
    },
    getEditor: function()
    {
      return this.$editor;
    },
    getBox: function()
    {
      return this.$box;
    },
    getIframe: function()
    {
      return (this.opts.iframe) ? this.$frame : false;
    },
    getToolbar: function()
    {
      return (this.$toolbar) ? this.$toolbar : false;
    },

    // CODE GET & SET
    get: function()
    {
      return this.$source.val();
    },
    getCodeIframe: function()
    {
      this.$editor.removeAttr('contenteditable').removeAttr('dir');
      var html = this.outerHtml(this.$frame.contents().children());
      this.$editor.attr({ 'contenteditable': true, 'dir': this.opts.direction });

      return html;
    },
    set: function(html, strip, placeholderRemove)
    {
      html = html.toString();
      html = html.replace(/\$/g, '&#36;');

      if (this.opts.fullpage) this.setCodeIframe(html);
      else this.setEditor(html, strip);

      if (html == '') placeholderRemove = false;
      if (placeholderRemove !== false) this.placeholderRemoveFromEditor();
    },
    setEditor: function(html, strip)
    {

      if (strip !== false)
      {
        html = this.cleanSavePreCode(html);

        html = this.cleanStripTags(html);
        html = this.cleanConvertProtected(html);
        html = this.cleanConvertInlineTags(html, true);

        if (this.opts.linebreaks === false) html = this.cleanConverters(html);
        else html = html.replace(/<p(.*?)>([\w\W]*?)<\/p>/gi, '$2<br>');
      }

      // $ fix
      html = html.replace(/&amp;#36;/g, '$');

      html = this.cleanEmpty(html);

      this.$editor.html(html);

      // set no editable
      this.setNonEditable();
      this.setSpansVerified();

      this.sync();
    },
    setCodeIframe: function(html)
    {
      var doc = this.iframePage();
      this.$frame[0].src = "about:blank";

      html = this.cleanConvertProtected(html);
      html = this.cleanConvertInlineTags(html);
      html = this.cleanRemoveSpaces(html);

      doc.open();
      doc.write(html);
      doc.close();

      // redefine editor for fullpage mode
      if (this.opts.fullpage)
      {
        this.$editor = this.$frame.contents().find('body').attr({ 'contenteditable': true, 'dir': this.opts.direction });
      }

      // set no editable
      this.setNonEditable();
      this.setSpansVerified();
      this.sync();

    },
    setFullpageOnInit: function(html)
    {
      this.fullpageDoctype = html.match(/^<\!doctype[^>]*>/i);
      if (this.fullpageDoctype && this.fullpageDoctype.length == 1)
      {
        html = html.replace(/^<\!doctype[^>]*>/i, '');
      }

      html = this.cleanSavePreCode(html, true);
      html = this.cleanConverters(html);
      html = this.cleanEmpty(html);

      // set code
      this.$editor.html(html);

      // set no editable
      this.setNonEditable();
      this.setSpansVerified();
      this.sync();
    },
    setFullpageDoctype: function()
    {
      if (this.fullpageDoctype && this.fullpageDoctype.length == 1)
      {
        var source = this.fullpageDoctype[0] + '\n' + this.$source.val();
        this.$source.val(source);
      }
    },
    setSpansVerified: function()
    {
      var spans = this.$editor.find('span');
      var replacementTag = 'inline';

      $.each(spans, function() {
        var outer = this.outerHTML;

        // Replace opening tag
        var regex = new RegExp('<' + this.tagName, 'gi');
        var newTag = outer.replace(regex, '<' + replacementTag);

        // Replace closing tag
        regex = new RegExp('</' + this.tagName, 'gi');
        newTag = newTag.replace(regex, '</' + replacementTag);

        $(this).replaceWith(newTag);
      });

    },
    setSpansVerifiedHtml: function(html)
    {
      html = html.replace(/<span(.*?)>/, '<inline$1>');
      return html.replace(/<\/span>/, '</inline>');
    },
    setNonEditable: function()
    {
      this.$editor.find('.noneditable').attr('contenteditable', false);
    },

    // SYNC
    sync: function(e)
    {
      var html = '';

      this.cleanUnverified();

      if (this.opts.fullpage) html = this.getCodeIframe();
      else html = this.$editor.html();

      html = this.syncClean(html);
      html = this.cleanRemoveEmptyTags(html);

      // is there a need to synchronize
      var source = this.cleanRemoveSpaces(this.$source.val(), false);
      var editor = this.cleanRemoveSpaces(html, false);

      if (source == editor)
      {
        // do not sync
        return false;
      }
      // fix second level up ul, ol
      html = html.replace(/<\/li><(ul|ol)>([\w\W]*?)<\/(ul|ol)>/gi, '<$1>$2</$1></li>');

      if ($.trim(html) === '<br>') html = '';

      // xhtml
      if (this.opts.xhtml)
      {
        var xhtmlTags = ['br', 'hr', 'img', 'link', 'input', 'meta'];
        $.each(xhtmlTags, function(i,s)
        {
          html = html.replace(new RegExp('<' + s + '(.*?[^\/$]?)>', 'gi'), '<' + s + '$1 />');
        });

      }

      // before callback
      html = this.callback('syncBefore', false, html);

      this.$source.val(html);
      this.setFullpageDoctype();

      // onchange & after callback
      this.callback('syncAfter', false, html);

      if (this.start === false)
      {

        if (typeof e != 'undefined')
        {
          switch(e.which)
          {
                case 37: // left
                break;
                case 38: // up
                break;
                case 39: // right
                break;
                case 40: // down
                break;

            default: this.callback('change', false, html);
          }
        }
        else
        {
          this.callback('change', false, html);
        }
      }

    },
    syncClean: function(html)
    {
      if (!this.opts.fullpage) html = this.cleanStripTags(html);

      // trim
      html = $.trim(html);

      // removeplaceholder
      html = this.placeholderRemoveFromCode(html);

      // remove space
      html = html.replace(/&#x200b;/gi, '');
      html = html.replace(/&#8203;/gi, '');
      html = html.replace(/<\/a>&nbsp;/gi, '<\/a> ');
      html = html.replace(/\u200B/g, '');

      if (html == '<p></p>' || html == '<p> </p>' || html == '<p>&nbsp;</p>')
      {
        html = '';
      }

      // link nofollow
      if (this.opts.linkNofollow)
      {
        html = html.replace(/<a(.*?)rel="nofollow"(.*?)>/gi, '<a$1$2>');
        html = html.replace(/<a(.*?)>/gi, '<a$1 rel="nofollow">');
      }

      // php code fix
      html = html.replace('<!--?php', '<?php');
      html = html.replace('?-->', '?>');

      // revert no editable
      html = html.replace(/<(.*?)class="noeditable"(.*?) contenteditable="false"(.*?)>/gi, '<$1class="noeditable"$2$3>');

      html = html.replace(/ data-tagblock=""/gi, '');
      html = html.replace(/<br\s?\/?>\n?<\/(P|H[1-6]|LI|ADDRESS|SECTION|HEADER|FOOTER|ASIDE|ARTICLE)>/gi, '</$1>');

      // remove image resize
      html = html.replace(/<span(.*?)id="redactor-image-box"(.*?)>([\w\W]*?)<img(.*?)><\/span>/gi, '$3<img$4>');
      html = html.replace(/<span(.*?)id="redactor-image-resizer"(.*?)>(.*?)<\/span>/gi, '');
      html = html.replace(/<span(.*?)id="redactor-image-editter"(.*?)>(.*?)<\/span>/gi, '');

      // remove empty lists
      html = html.replace(/<(ul|ol)>\s*\t*\n*<\/(ul|ol)>/gi, '');

      // remove font
      if (this.opts.cleanFontTag)
      {
        html = html.replace(/<font(.*?)>([\w\W]*?)<\/font>/gi, '$2');
      }

      // remove spans
      html = html.replace(/<span(.*?)>([\w\W]*?)<\/span>/gi, '$2');
      html = html.replace(/<inline>([\w\W]*?)<\/inline>/gi, '$1');
      html = html.replace(/<inline>/gi, '<span>');
      html = html.replace(/<inline /gi, '<span ');
      html = html.replace(/<\/inline>/gi, '</span>');

      if (this.opts.removeEmptyTags)
      {
        html = html.replace(/<span>([\w\W]*?)<\/span>/gi, '$1');
      }

      html = html.replace(/<span(.*?)class="redactor_placeholder"(.*?)>([\w\W]*?)<\/span>/gi, '');
      html = html.replace(/<img(.*?)contenteditable="false"(.*?)>/gi, '<img$1$2>');

      // special characters
      html = html.replace(/&/gi, '&');
      html = html.replace(/\u2122/gi, '&trade;');
      html = html.replace(/\u00a9/gi, '&copy;');
      html = html.replace(/\u2026/gi, '&hellip;');
      html = html.replace(/\u2014/gi, '&mdash;');
      html = html.replace(/\u2010/gi, '&dash;');

      html = this.cleanReConvertProtected(html);

      return html;
    },



    // BUILD
    buildStart: function()
    {
      // content
      this.content = '';

      // container
      this.$box = $('<div class="redactor_box" />');

      // textarea test
      if (this.$source[0].tagName === 'TEXTAREA') this.opts.textareamode = true;

      // mobile
      if (this.opts.mobile === false && this.isMobile())
      {
        this.buildMobile();
      }
      else
      {
        // get the content at the start
        this.buildContent();

        if (this.opts.iframe)
        {
          // build as iframe
          this.opts.autoresize = false;
          this.iframeStart();
        }
        else if (this.opts.textareamode) this.buildFromTextarea();
        else this.buildFromElement();

        // options and final setup
        if (!this.opts.iframe)
        {
          this.buildOptions();
          this.buildAfter();
        }
      }
    },
    buildMobile: function()
    {
      if (!this.opts.textareamode)
      {
        this.$editor = this.$source;
        this.$editor.hide();
        this.$source = this.buildCodearea(this.$editor);
        this.$source.val(this.content);
      }

      this.$box.insertAfter(this.$source).append(this.$source);
    },
    buildContent: function()
    {
      if (this.opts.textareamode) this.content = $.trim(this.$source.val());
      else this.content = $.trim(this.$source.html());
    },
    buildFromTextarea: function()
    {
      this.$editor = $('<div />');
      this.$box.insertAfter(this.$source).append(this.$editor).append(this.$source);

      // enable
      this.buildAddClasses(this.$editor);
      this.buildEnable();
    },
    buildFromElement: function()
    {
      this.$editor = this.$source;
      this.$source = this.buildCodearea(this.$editor);
      this.$box.insertAfter(this.$editor).append(this.$editor).append(this.$source);

      // enable
      this.buildEnable();
    },
    buildCodearea: function($source)
    {
      return $('<textarea />').attr('name', $source.attr('id')).css('height', this.sourceHeight);
    },
    buildAddClasses: function(el)
    {
      // append textarea classes to editable layer
      $.each(this.$source.get(0).className.split(/\s+/), function(i,s)
      {
        el.addClass('redactor_' + s);
      });
    },
    buildEnable: function()
    {
      this.$editor.addClass('redactor_editor').attr({ 'contenteditable': true, 'dir': this.opts.direction });
      this.$source.attr('dir', this.opts.direction).hide();

      // set code
      this.set(this.content, true, false);
    },
    buildOptions: function()
    {
      var $source = this.$editor;
      if (this.opts.iframe) $source = this.$frame;

      // options
      if (this.opts.tabindex) $source.attr('tabindex', this.opts.tabindex);

      if (this.opts.minHeight) $source.css('min-height', this.opts.minHeight + 'px');
      // FF fix bug with line-height rendering
      else if (this.browser('mozilla') && this.opts.linebreaks)
      {
        this.$editor.css('min-height', '45px');
      }
      // FF fix bug with line-height rendering
      if (this.browser('mozilla') && this.opts.linebreaks)
      {
        this.$editor.css('padding-bottom', '10px');
      }


      if (this.opts.maxHeight)
      {
        this.opts.autoresize = false;
        this.sourceHeight = this.opts.maxHeight;
      }
      if (this.opts.wym) this.$editor.addClass('redactor_editor_wym');
      if (this.opts.typewriter) this.$editor.addClass('redactor-editor-typewriter');
      if (!this.opts.autoresize) $source.css('height', this.sourceHeight);

    },
    buildAfter: function()
    {
      this.start = false;

      // load toolbar
      if (this.opts.toolbar)
      {
        this.opts.toolbar = this.toolbarInit(this.opts.curLang);
        this.toolbarBuild();
      }

      // modal templates
      this.modalTemplatesInit();

      // plugins
      this.buildPlugins();

      // enter, tab, etc.
      this.buildBindKeyboard();

      // autosave
      if (this.opts.autosave) this.autosave();

      // observers
      setTimeout($.proxy(this.observeStart, this), 4);

      // FF fix
      if (this.browser('mozilla'))
      {
        try {
          this.document.execCommand('enableObjectResizing', false, false);
          this.document.execCommand('enableInlineTableEditing', false, false);
        } catch (e) {}
      }

      // focus
      if (this.opts.focus) setTimeout($.proxy(this.focus, this), 100);

      // code mode
      if (!this.opts.visual)
      {
        setTimeout($.proxy(function()
        {
          this.opts.visual = true;
          this.toggle(false);

        }, this), 200);
      }

      // init callback
      this.callback('init');
    },
    buildBindKeyboard: function()
    {
      this.dblEnter = 0;

      if (this.opts.dragUpload && (this.opts.imageUpload !== false || this.opts.s3 !== false))
      {
        this.$editor.on('drop.redactor', $.proxy(this.buildEventDrop, this));
      }

      this.$editor.on('click.redactor', $.proxy(function()
      {
        this.selectall = false;

      }, this));

      this.$editor.on('input.redactor', $.proxy(this.sync, this));
      this.$editor.on('paste.redactor', $.proxy(this.buildEventPaste, this));
      this.$editor.on('keydown.redactor', $.proxy(this.buildEventKeydown, this));
      this.$editor.on('keyup.redactor', $.proxy(this.buildEventKeyup, this));

      // textarea callback
      if ($.isFunction(this.opts.textareaKeydownCallback))
      {
        this.$source.on('keydown.redactor-textarea', $.proxy(this.opts.textareaKeydownCallback, this));
      }

      // focus callback
      if ($.isFunction(this.opts.focusCallback))
      {
        this.$editor.on('focus.redactor', $.proxy(this.opts.focusCallback, this));
      }

      var clickedElement;
      $(document).mousedown(function(e) {
        clickedElement = $(e.target);
      });

      // blur callback
      this.$editor.on('blur.redactor', $.proxy(function(e)
      {
        if (!$(clickedElement).hasClass('redactor_toolbar') && $(clickedElement).parents('.redactor_toolbar').size() == 0)
        {
          this.selectall = false;
          if ($.isFunction(this.opts.blurCallback)) this.callback('blur', e);
        }
      }, this));

    },
    buildEventDrop: function(e)
    {
      e = e.originalEvent || e;

      if (window.FormData === undefined || !e.dataTransfer) return true;

        var length = e.dataTransfer.files.length;
        if (length == 0) return true;

        e.preventDefault();

          var file = e.dataTransfer.files[0];

          if (this.opts.dnbImageTypes !== false && this.opts.dnbImageTypes.indexOf(file.type) == -1)
          {
            return true;
          }

      this.bufferSet();

      this.showProgressBar();

      if (this.opts.s3 === false)
      {
        this.dragUploadAjax(this.opts.imageUpload, file, true, e, this.opts.imageUploadParam);
      }
      else
      {
        this.s3uploadFile(file);
      }


    },
    buildEventPaste: function(e)
    {
      var oldsafari = false;
      if (this.browser('webkit') && navigator.userAgent.indexOf('Chrome') === -1)
      {
        var arr = this.browser('version').split('.');
        if (arr[0] < 536) oldsafari = true;
      }

      if (oldsafari) return true;

      // paste except opera (not webkit)
      if (this.browser('opera')) return true;

      // clipboard upload
      if (this.opts.clipboardUpload && this.buildEventClipboardUpload(e)) return true;

      if (this.opts.cleanup)
      {
        this.rtePaste = true;

        this.selectionSave();

        if (!this.selectall)
        {
          if (this.opts.autoresize === true && this.fullscreen !== true)
          {
            this.$editor.height(this.$editor.height());
            this.saveScroll = this.document.body.scrollTop;
          }
          else
          {
            this.saveScroll = this.$editor.scrollTop();
          }
        }

        var frag = this.extractContent();

        setTimeout($.proxy(function()
        {
          var pastedFrag = this.extractContent();
          this.$editor.append(frag);

          this.selectionRestore();

          var html = this.getFragmentHtml(pastedFrag);
          this.pasteClean(html);

          if (this.opts.autoresize === true && this.fullscreen !== true) this.$editor.css('height', 'auto');

        }, this), 1);
      }
    },
    buildEventClipboardUpload: function(e)
    {
      var event = e.originalEvent || e;
      this.clipboardFilePaste = false;


      if (typeof(event.clipboardData) === 'undefined') return false;
      if (event.clipboardData.items)
      {
        var file = event.clipboardData.items[0].getAsFile();
        if (file !== null)
        {
          this.bufferSet();
          this.clipboardFilePaste = true;

          var reader = new FileReader();
          reader.onload = $.proxy(this.pasteClipboardUpload, this);
              reader.readAsDataURL(file);

              return true;
        }
      }

      return false;

    },
    buildEventKeydown: function(e)
    {
      if (this.rtePaste) return false;

      var key = e.which;
      var ctrl = e.ctrlKey || e.metaKey;
      var parent = this.getParent();
      var current = this.getCurrent();
      var block = this.getBlock();
      var pre = false;

      this.callback('keydown', e);
      if (e.isDefaultPrevented()) return; // CUSTOM: Allow the keydown callback to cancel the event.

      /*
        firefox cmd+left/Cmd+right browser back/forward fix -
        https://joshrhoderick.wordpress.com/2010/05/05/how-firefoxs-command-key-bug-kills-usability-on-the-mac/
      */
      if (this.browser('mozilla') && "modify" in window.getSelection())
      {
        if ((ctrl) && (e.keyCode===37 || e.keyCode===39))
        {
          var selection = this.getSelection();
          var lineOrWord = (e.metaKey ? "line" : "word");
          if (e.keyCode===37)
          {
            selection.modify("extend","left",lineOrWord);
            if (!e.shiftKey)
            {
              selection.collapseToStart();
            }
          }
          if (e.keyCode===39)
          {
            selection.modify("extend","right",lineOrWord);
            if (!e.shiftKey)
            {
              selection.collapseToEnd();
            }
          }

          e.preventDefault();
        }
      }


      this.imageResizeHide(false);

      // pre & down
      if ((parent && $(parent).get(0).tagName === 'PRE') || (current && $(current).get(0).tagName === 'PRE'))
      {
        pre = true;
        if (key === this.keyCode.DOWN) this.insertAfterLastElement(block);
      }

      // down
      if (key === this.keyCode.DOWN)
      {
        if (parent && $(parent)[0].tagName === 'BLOCKQUOTE') this.insertAfterLastElement(parent);
        if (current && $(current)[0].tagName === 'BLOCKQUOTE') this.insertAfterLastElement(current);

        if (parent && $(parent)[0].tagName === 'P' && $(parent).parent()[0].tagName == 'BLOCKQUOTE')
        {
          this.insertAfterLastElement(parent, $(parent).parent()[0]);
        }
        if (current && $(current)[0].tagName === 'P' && parent && $(parent)[0].tagName == 'BLOCKQUOTE')
        {
          this.insertAfterLastElement(current, parent);
        }
      }

      // shortcuts setup
      this.shortcuts(e, key);

      // buffer setup
      if (ctrl && key === 90 && !e.shiftKey && !e.altKey) // z key
      {
        e.preventDefault();
        if (this.opts.buffer.length) this.bufferUndo();
        else this.document.execCommand('undo', false, false);
        return;
      }
      // undo
      else if (ctrl && key === 90 && e.shiftKey && !e.altKey)
      {
        e.preventDefault();
        if (this.opts.rebuffer.length != 0) this.bufferRedo();
        else this.document.execCommand('redo', false, false);
        return;
      }

      // space
      if (key == 32)
      {
        this.bufferSet();
      }

      // select all
      if (ctrl && key === 65)
      {
        this.bufferSet();
        this.selectall = true;
      }
      else if (key != this.keyCode.LEFT_WIN && !ctrl)
      {
        this.selectall = false;
      }

      // enter
      if (key == this.keyCode.ENTER && !e.shiftKey && !e.ctrlKey && !e.metaKey)
      {
        // remove selected content on enter
        var range = this.getRange();
        if (range && range.collapsed === false)
        {
          sel = this.getSelection();
          if (sel.rangeCount)
          {
            range.deleteContents();
          }
        }

        // In ie, opera in the tables are created paragraphs, fix it.
        if (this.browser('msie') && (parent.nodeType == 1 && (parent.tagName == 'TD' || parent.tagName == 'TH')))
        {
          e.preventDefault();
          this.bufferSet();
          this.insertNode(document.createElement('br'));
          this.callback('enter', e);
          return false;
        }

        // blockquote exit
        if (block && (block.tagName == 'BLOCKQUOTE' || $(block).parent()[0].tagName == 'BLOCKQUOTE'))
        {
          if (this.isEndOfElement())
          {
            if (this.dblEnter == 1)
            {
              var element;
              var last;
              if (block.tagName == 'BLOCKQUOTE')
              {
                last = 'br';
                element = block;
              }
              else
              {
                last = 'p';
                element = $(block).parent()[0];
              }

              e.preventDefault();
              this.insertingAfterLastElement(element);
              this.dblEnter = 0;

              if (last == 'p')
              {
                $(block).parent().find('p').last().remove();
              }
              else
              {
                var tmp = $.trim($(block).html());
                $(block).html(tmp.replace(/<br\s?\/?>$/i, ''));
              }

              return;
            }
            else this.dblEnter++;
          }
          else this.dblEnter++;
        }

        // pre
        if (pre === true)
        {
          return this.buildEventKeydownPre(e, current);
        }
        else
        {
          if (!this.opts.linebreaks)
          {
            // lists exit
            if (block && block.tagName == 'LI')
            {
              var listCurrent = this.getBlock();
              if (listCurrent !== false || listCurrent.tagName === 'LI')
              {
                var listText = $.trim($(block).text());
                var listCurrentText = $.trim($(listCurrent).text());
                if (listText == ''
                  && listCurrentText == ''
                  && $(listCurrent).next('li').size() == 0
                  && $(listCurrent).parents('li').size() == 0)
                {
                  this.bufferSet();

                  var $list = $(listCurrent).closest('ol, ul');
                  $(listCurrent).remove();
                  var node = $('<p>' + this.opts.invisibleSpace + '</p>');
                  $list.after(node);
                  this.selectionStart(node);

                  this.sync();
                  this.callback('enter', e);
                  return false;
                }
              }

            }

            // replace div to p
            if (block && this.opts.rBlockTest.test(block.tagName))
            {
              // hit enter
              this.bufferSet();

              setTimeout($.proxy(function()
              {
                var blockElem = this.getBlock();
                if (blockElem.tagName === 'DIV' && !$(blockElem).hasClass('redactor_editor'))
                {
                  var node = $('<p>' + this.opts.invisibleSpace + '</p>');
                  $(blockElem).replaceWith(node);
                  this.selectionStart(node);
                }

              }, this), 1);
            }
            else if (block === false)
            {
              // hit enter
              this.bufferSet();
              var node = $('<p>' + this.opts.invisibleSpace + '</p>');
              this.insertNode(node[0]);
              this.selectionStart(node);
              this.callback('enter', e);
              return false;
            }

          }

          if (this.opts.linebreaks)
          {
            // replace div to br
            if (block && this.opts.rBlockTest.test(block.tagName))
            {
              // hit enter
              this.bufferSet();

              setTimeout($.proxy(function()
              {
                var blockElem = this.getBlock();
                if ((blockElem.tagName === 'DIV' || blockElem.tagName === 'P') && !$(blockElem).hasClass('redactor_editor'))
                {
                  this.replaceLineBreak(blockElem);
                }

              }, this), 1);
            }
            else
            {
              return this.buildEventKeydownInsertLineBreak(e);
            }
          }

          // blockquote, figcaption
          if (block.tagName == 'BLOCKQUOTE' || block.tagName == 'FIGCAPTION')
          {
            return this.buildEventKeydownInsertLineBreak(e);
          }

        }

        this.callback('enter', e);
      }
      else if (key === this.keyCode.ENTER && (e.ctrlKey || e.shiftKey)) // Shift+Enter or Ctrl+Enter
      {
        this.bufferSet();

        e.preventDefault();
        this.insertLineBreak();
      }

      // tab (cmd + [)
      if ((key === this.keyCode.TAB || e.metaKey && key === 219) && this.opts.shortcuts)
      {
        return this.buildEventKeydownTab(e, pre, key);
      }

      // delete zero-width space before the removing
      if (key === this.keyCode.BACKSPACE) this.buildEventKeydownBackspace(e, current, parent);

    },
    buildEventKeydownPre: function(e, current)
    {
      e.preventDefault();
      this.bufferSet();
      var html = $(current).parent().text();
      this.insertNode(document.createTextNode('\n'));
      if (html.search(/\s$/) == -1)
      {
        this.insertNode(document.createTextNode('\n'));
      }

      this.sync();
      this.callback('enter', e);
      return false;
    },
    buildEventKeydownTab: function(e, pre, key)
    {
      if (!this.opts.tabFocus) return true;
      if (this.isEmpty(this.get()) && this.opts.tabSpaces === false) return true;

      e.preventDefault();

      if (pre === true && !e.shiftKey)
      {
        this.bufferSet();
        this.insertNode(document.createTextNode('\t'));
        this.sync();
        return false;

      }
      else if (this.opts.tabSpaces !== false)
      {
        this.bufferSet();
        this.insertNode(document.createTextNode(Array(this.opts.tabSpaces + 1).join('\u00a0')));
        this.sync();
        return false;
      }
      else
      {
        if (!e.shiftKey) this.indentingIndent();
        else this.indentingOutdent();
      }

      return false;
    },
    buildEventKeydownBackspace: function(e, current, parent)
    {
      // remove empty list in table
      if (parent && current && parent.parentNode.tagName == 'TD'
        && parent.tagName == 'UL' && current.tagName == 'LI' && $(parent).children('li').size() == 1)
      {
        var text = $(current).text().replace(/[\u200B-\u200D\uFEFF]/g, '');
        if (text == '')
        {
          var node = parent.parentNode;
          $(parent).remove();
          this.selectionStart(node);
          this.sync();
          return false;
        }
      }

      if (typeof current.tagName !== 'undefined' && /^(H[1-6])$/i.test(current.tagName))
      {
        var node;
        if (this.opts.linebreaks === false) node = $('<p>' + this.opts.invisibleSpace + '</p>');
        else node = $('<br>' + this.opts.invisibleSpace);

        $(current).replaceWith(node);
        this.selectionStart(node);
        this.sync();
      }

      if (typeof current.nodeValue !== 'undefined' && current.nodeValue !== null)
      {
        if (current.remove && current.nodeType === 3 && current.nodeValue.match(/[^\u200B]/g) == null)
        {
          $(current).prev().remove();
          this.sync();
        }
      }
    },
    buildEventKeydownInsertLineBreak: function(e)
    {
      this.bufferSet();
      e.preventDefault();
      this.insertLineBreak();
      this.callback('enter', e);
      return;
    },
    buildEventKeyup: function(e)
    {
      if (this.rtePaste) return false;

      var key = e.which;
      var parent = this.getParent();
      var current = this.getCurrent();

      // replace to p before / after the table or body
      if (!this.opts.linebreaks && current.nodeType == 3 && (parent == false || parent.tagName == 'BODY'))
      {
        var node = $('<p>').append($(current).clone());
        $(current).replaceWith(node);
        var next = $(node).next();
        if (typeof(next[0]) !== 'undefined' && next[0].tagName == 'BR')
        {
          next.remove();
        }

        this.selectionEnd(node);
      }

      // convert links
      if ((this.opts.convertLinks || this.opts.convertImageLinks || this.opts.convertVideoLinks) && key === this.keyCode.ENTER)
      {
        this.buildEventKeyupConverters();
      }

      // if empty
      if (key === this.keyCode.DELETE || key === this.keyCode.BACKSPACE)
      {
        return this.formatEmpty(e);
      }

      this.callback('keyup', e);
      this.sync(e);
    },
    buildEventKeyupConverters: function()
    {
      this.formatLinkify(this.opts.linkProtocol, this.opts.convertLinks, this.opts.convertImageLinks, this.opts.convertVideoLinks, this.opts.linkSize);

      setTimeout($.proxy(function()
      {
        if (this.opts.convertImageLinks) this.observeImages();
        if (this.opts.observeLinks) this.observeLinks();
      }, this), 5);
    },
    buildPlugins: function()
    {
      if (!this.opts.plugins ) return;

      $.each(this.opts.plugins, $.proxy(function(i, s)
      {
        if (RedactorPlugins[s])
        {
          $.extend(this, RedactorPlugins[s]);
          if ($.isFunction( RedactorPlugins[ s ].init)) this.init();
        }

      }, this ));
    },

    // IFRAME
    iframeStart: function()
    {
      this.iframeCreate();

      if (this.opts.textareamode) this.iframeAppend(this.$source);
      else
      {
        this.$sourceOld = this.$source.hide();
        this.$source = this.buildCodearea(this.$sourceOld);
        this.iframeAppend(this.$sourceOld);
      }
    },
    iframeAppend: function(el)
    {
      this.$source.attr('dir', this.opts.direction).hide();
      this.$box.insertAfter(el).append(this.$frame).append(this.$source);
    },
    iframeCreate: function()
    {
      this.$frame = $('<iframe style="width: 100%;" frameborder="0" />').one('load', $.proxy(function()
      {
        if (this.opts.fullpage)
        {
          this.iframePage();

          if (this.content === '') this.content = this.opts.invisibleSpace;

          this.$frame.contents()[0].write(this.content);
          this.$frame.contents()[0].close();

          var timer = setInterval($.proxy(function()
          {
            if (this.$frame.contents().find('body').html())
            {
              clearInterval(timer);
              this.iframeLoad();
            }

          }, this), 0);
        }
        else this.iframeLoad();

      }, this));
    },
    iframeDoc: function()
    {
      return this.$frame[0].contentWindow.document;
    },
    iframePage: function()
    {
      var doc = this.iframeDoc();
      if (doc.documentElement) doc.removeChild(doc.documentElement);

      return doc;
    },
    iframeAddCss: function(css)
    {
      css = css || this.opts.css;

      if (this.isString(css))
      {
        this.$frame.contents().find('head').append('<link rel="stylesheet" href="' + css + '" />');
      }

      if ($.isArray(css))
      {
        $.each(css, $.proxy(function(i, url)
        {
          this.iframeAddCss(url);

        }, this));
      }
    },
    iframeLoad: function()
    {
      this.$editor = this.$frame.contents().find('body').attr({ 'contenteditable': true, 'dir': this.opts.direction });

      // set document & window
      if (this.$editor[0])
      {
        this.document = this.$editor[0].ownerDocument;
        this.window = this.document.defaultView || window;
      }

      // iframe css
      this.iframeAddCss();

      if (this.opts.fullpage)
      {
        this.setFullpageOnInit(this.$source.val());
      }
      else this.set(this.content, true, false);

      this.buildOptions();
      this.buildAfter();
    },

    // PLACEHOLDER
    placeholderInit: function()
    {
      if (this.opts.placeholder !== false)
      {
        this.placeholderText = this.opts.placeholder;
        this.opts.placeholder = true;
      }
      else
      {
        if (typeof this.$element.attr('placeholder') == 'undefined' || this.$element.attr('placeholder') == '')
        {
          this.opts.placeholder = false;
        }
        else
        {
          this.placeholderText = this.$element.attr('placeholder');
          this.opts.placeholder = true;
        }
      }
    },
    placeholderStart: function(html)
    {
      if (this.opts.placeholder === false)
      {
        return false;
      }

      if (this.isEmpty(html))
      {
        this.opts.focus = false;
        this.placeholderOnFocus();
        this.placeholderOnBlur();

        return this.placeholderGet();
      }
      else
      {
        this.placeholderOnBlur();
      }

      return false;
    },
    placeholderOnFocus: function()
    {
      this.$editor.on('focus.redactor_placeholder', $.proxy(this.placeholderFocus, this));
    },
    placeholderOnBlur: function()
    {
      this.$editor.on('blur.redactor_placeholder', $.proxy(this.placeholderBlur, this));
    },
    placeholderGet: function()
    {
      var ph = $('<span class="redactor_placeholder">').data('redactor', 'verified')
      .attr('contenteditable', false).text(this.placeholderText);

      if (this.opts.linebreaks === false)
      {
        return $('<p>').append(ph);
      }
      else return ph;
    },
    placeholderBlur: function()
    {
      var html = this.get();
      if (this.isEmpty(html))
      {
        this.placeholderOnFocus();
        this.$editor.html(this.placeholderGet());
      }
    },
    placeholderFocus: function()
    {
      this.$editor.find('span.redactor_placeholder').remove();

      var html = '';
      if (this.opts.linebreaks === false)
      {
        html = this.opts.emptyHtml;
      }

      this.$editor.off('focus.redactor_placeholder');
      this.$editor.html(html);

      if (this.opts.linebreaks === false)
      {
        // place the cursor inside emptyHtml
        this.selectionStart(this.$editor.children()[0]);
      }
      else
      {
        this.focus();
      }

      this.sync();
    },
    placeholderRemoveFromEditor: function()
    {
      this.$editor.find('span.redactor_placeholder').remove();
      this.$editor.off('focus.redactor_placeholder');
    },
    placeholderRemoveFromCode: function(html)
    {
      return html.replace(/<span class="redactor_placeholder"(.*?)>(.*?)<\/span>/i, '');
    },

    // SHORTCUTS
    shortcuts: function(e, key)
    {

      // disable browser's hot keys for bold and italic
      if (!this.opts.shortcuts)
      {
        if ((e.ctrlKey || e.metaKey) && (key === 66 || key === 73))
        {
          e.preventDefault();
        }

        return false;
      }

      $.each(this.opts.shortcuts, $.proxy(function(str, command)
      {
        var keys = str.split(',');
        for (var i in keys)
        {
          if (typeof keys[i] === 'string')
          {
            this.shortcutsHandler(e, $.trim(keys[i]), $.proxy(function()
            {
              eval(command);
            }, this));
          }

        }

      }, this));


    },
    shortcutsHandler: function(e, keys, origHandler)
    {
      // based on https://github.com/jeresig/jquery.hotkeys
      var hotkeysSpecialKeys =
      {
        8: "backspace", 9: "tab", 10: "return", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
        20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
        37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del", 59: ";", 61: "=",
        96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
        104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/",
        112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8",
        120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 173: "-", 186: ";", 187: "=",
        188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\", 221: "]", 222: "'"
      };


      var hotkeysShiftNums =
      {
        "`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&",
        "8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": "\"", ",": "<",
        ".": ">",  "/": "?",  "\\": "|"
      };

      keys = keys.toLowerCase().split(" ");
      var special = hotkeysSpecialKeys[e.keyCode],
        character = String.fromCharCode( e.which ).toLowerCase(),
        modif = "", possible = {};

      $.each([ "alt", "ctrl", "meta", "shift"], function(index, specialKey)
      {
        if (e[specialKey + 'Key'] && special !== specialKey)
        {
          modif += specialKey + '+';
        }
      });


      if (special)
      {
        possible[modif + special] = true;
      }

      if (character)
      {
        possible[modif + character] = true;
        possible[modif + hotkeysShiftNums[character]] = true;

        // "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
        if (modif === "shift+")
        {
          possible[hotkeysShiftNums[character]] = true;
        }
      }

      for (var i = 0, l = keys.length; i < l; i++)
      {
        if (possible[keys[i]])
        {
          e.preventDefault();
          return origHandler.apply(this, arguments);
        }
      }
    },

    // FOCUS
    focus: function()
    {
      if (!this.browser('opera'))
      {
        this.window.setTimeout($.proxy(this.focusSet, this, true), 1);
      }
      else
      {
        this.$editor.focus();
      }
    },
    focusWithSaveScroll: function()
    {
      // CUSTOM: save the scroll position in Chrome, too.
      if (this.browser('msie') || this.browser('chrome'))
      {
        var top = this.document.documentElement.scrollTop;
      }

      this.$editor.focus();

      if (this.browser('msie') || this.browser('chrome'))
      {
        this.document.documentElement.scrollTop = top;
      }
    },
    focusEnd: function()
    {
      if (!this.browser('mozilla'))
      {
        this.focusSet();
      }
      else
      {
        if (this.opts.linebreaks === false)
        {
          var last = this.$editor.children().last();

          this.$editor.focus();
          this.selectionEnd(last);
        }
        else
        {
          this.focusSet();
        }
      }
        },
    focusSet: function(collapse, element)
    {
      this.$editor.focus();

      if (typeof element == 'undefined')
      {
        element = this.$editor[0];
      }

      var range = this.getRange();
      range.selectNodeContents(element);

      // collapse - controls the position of focus: the beginning (true), at the end (false).
      range.collapse(collapse || false);

      var sel = this.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    },

    // TOGGLE
    toggle: function(direct)
    {
      if (this.opts.visual) this.toggleCode(direct);
      else this.toggleVisual();
    },
    toggleVisual: function()
    {
      var html = this.$source.hide().val();
      if (typeof this.modified !== 'undefined')
      {
        var modified = this.modified.replace(/\n/g, '');

        var thtml = html.replace(/\n/g, '');
        thtml = this.cleanRemoveSpaces(thtml, false);

        this.modified = this.cleanRemoveSpaces(modified, false) !== thtml;
      }

      if (this.modified)
      {
        // don't remove the iframe even if cleared all.
        if (this.opts.fullpage && html === '')
        {
          this.setFullpageOnInit(html);
        }
        else
        {
          this.set(html);
          if (this.opts.fullpage)
          {
            this.buildBindKeyboard();
          }
        }

        this.callback('change', false, html);
      }

      if (this.opts.iframe) this.$frame.show();
      else this.$editor.show();

      if (this.opts.fullpage) this.$editor.attr('contenteditable', true );

      this.$source.off('keydown.redactor-textarea-indenting');

      this.$editor.focus();
      this.selectionRestore();

      this.observeStart();
      this.buttonActiveVisual();
      this.buttonInactive('html');
      this.opts.visual = true;


    },
    toggleCode: function(direct)
    {
      if (direct !== false) this.selectionSave();

      var height = null;
      if (this.opts.iframe)
      {
        height = this.$frame.height();
        if (this.opts.fullpage) this.$editor.removeAttr('contenteditable');
        this.$frame.hide();
      }
      else
      {
        height = this.$editor.innerHeight();
        this.$editor.hide();
      }

      var html = this.$source.val();

      // tidy html
      if (html !== '' && this.opts.tidyHtml)
      {
        this.$source.val(this.cleanHtml(html));
      }

      this.modified = html;

      this.$source.height(height).show().focus();

      // textarea indenting
      this.$source.on('keydown.redactor-textarea-indenting', this.textareaIndenting);

      this.buttonInactiveVisual();
      this.buttonActive('html');
      this.opts.visual = false;
    },
    textareaIndenting: function(e)
    {
      if (e.keyCode === 9)
      {
        var $el = $(this);
        var start = $el.get(0).selectionStart;
        $el.val($el.val().substring(0, start) + "\t" + $el.val().substring($el.get(0).selectionEnd));
        $el.get(0).selectionStart = $el.get(0).selectionEnd = start + 1;
        return false;
      }
    },

    // AUTOSAVE
    autosave: function()
    {
      var savedHtml = false;
      this.autosaveInterval = setInterval($.proxy(function()
      {
        var html = this.get();
        if (savedHtml !== html)
        {
          var name = this.$source.attr('name');
          $.ajax({
            url: this.opts.autosave,
            type: 'post',
            data: 'name=' + name + '&' + name + '=' + escape(encodeURIComponent(html)),
            success: $.proxy(function(data)
            {
              var json = $.parseJSON(data);
              if (typeof json.error == 'undefined')
              {
                // success
                this.callback('autosave', false, json);
              }
              else
              {
                // error
                this.callback('autosaveError', false, json);
              }

              savedHtml = html;

            }, this)
          });
        }
      }, this), this.opts.autosaveInterval*1000);
    },

    // TOOLBAR
    toolbarBuild: function()
    {
      // hide on mobile
      if (this.isMobile() && this.opts.buttonsHideOnMobile.length > 0)
      {
        $.each(this.opts.buttonsHideOnMobile, $.proxy(function(i, s)
        {
          var index = this.opts.buttons.indexOf(s);
          this.opts.buttons.splice(index, 1);

        }, this));
      }

      // extend buttons
      if (this.opts.air)
      {
        this.opts.buttons = this.opts.airButtons;
      }
      else
      {
        if (!this.opts.buttonSource)
        {
          var index = this.opts.buttons.indexOf('html');
          this.opts.buttons.splice(index, 1);
        }
      }

      // formatting tags
      if (this.opts.toolbar)
      {
        $.each(this.opts.toolbar.formatting.dropdown, $.proxy(function (i, s)
        {
          if ($.inArray(i, this.opts.formattingTags ) == '-1') delete this.opts.toolbar.formatting.dropdown[i];

        }, this));
      }

      // if no buttons don't create a toolbar
      if (this.opts.buttons.length === 0) return false;

      // air enable
      this.airEnable();

      // toolbar build
      this.$toolbar = $('<ul>').addClass('redactor_toolbar').attr('id', 'redactor_toolbar_' + this.uuid);

      if (this.opts.typewriter)
      {
        this.$toolbar.addClass('redactor-toolbar-typewriter');
      }

      if (this.opts.toolbarOverflow && this.isMobile())
      {
        this.$toolbar.addClass('redactor-toolbar-overflow');
      }

      if (this.opts.air)
      {
        // air box
        this.$air = $('<div class="redactor_air">').attr('id', 'redactor_air_' + this.uuid).hide();
        this.$air.append(this.$toolbar);
        $('body').append(this.$air);
      }
      else
      {
        if (this.opts.toolbarExternal)
        {
          this.$toolbar.addClass('redactor-toolbar-external');
          $(this.opts.toolbarExternal).html(this.$toolbar);
        }
        else this.$box.prepend(this.$toolbar);
      }

      $.each(this.opts.buttons, $.proxy(function(i, btnName)
      {
        if (this.opts.toolbar[btnName])
        {
          var btnObject = this.opts.toolbar[btnName];
          if (this.opts.fileUpload === false && btnName === 'file') return true;
          this.$toolbar.append( $('<li>').append(this.buttonBuild(btnName, btnObject)));
        }

      }, this));

      this.$toolbar.find('a').attr('tabindex', '-1');

      // fixed
      if (this.opts.toolbarFixed)
      {
        this.toolbarObserveScroll();
        $(this.opts.toolbarFixedTarget).on('scroll.redactor', $.proxy(this.toolbarObserveScroll, this));
      }

      // buttons response
      if (this.opts.activeButtons)
      {
        this.$editor.on('mouseup.redactor keyup.redactor', $.proxy(this.buttonActiveObserver, this));
      }
    },
    toolbarObserveScroll: function()
    {
      var scrollTop = $(this.opts.toolbarFixedTarget).scrollTop() + this.opts.toolbarFixedTopOffset; // CUSTOM: Force the toolbar to "snap" at the offset.

      var boxTop = 0;
      var left = 0;
      var end = 0;

      if (this.opts.toolbarFixedTarget === document)
      {
        boxTop = this.$box.offset().top;
      }
      else
      {
        boxTop = 1;
      }

      end = boxTop + this.$box.height() + 40;

      if (scrollTop > boxTop)
      {
        var width = '100%';
        if (this.opts.toolbarFixedBox)
        {
          left = this.$box.offset().left;
          width = this.$box.innerWidth() + 1;
          this.$toolbar.addClass('toolbar_fixed_box');
        }

        this.toolbarFixed = true;

        if (this.opts.toolbarFixedTarget === document)
        {
          this.$toolbar.css({
            position: 'fixed',
            width: width,
            zIndex: 1005,
            top: this.opts.toolbarFixedTopOffset + 'px',
            left: left
          });
        }
        else
        {
          this.$toolbar.css({
            position: 'absolute',
            width: width,
            zIndex: 1005,
            top: (this.opts.toolbarFixedTopOffset + scrollTop) + 'px',
            left: 0
          });
        }

        if (scrollTop < end) this.$toolbar.css('visibility', 'visible');
        else this.$toolbar.css('visibility', 'hidden');
      }
      else
      {
        this.toolbarFixed = false;
        this.$toolbar.css({
          position: 'relative',
          width: 'auto',
          top: 0,
          left: left
        });

        if (this.opts.toolbarFixedBox) this.$toolbar.removeClass('toolbar_fixed_box');
      }
    },

    // AIR
    airEnable: function()
    {
      if (!this.opts.air) return;

      this.$editor.on('mouseup.redactor keyup.redactor', this, $.proxy(function(e)
      {
        var text = this.getSelectionText();

        if (e.type === 'mouseup' && text != '') this.airShow(e);
        if (e.type === 'keyup' && e.shiftKey && text != '')
        {
          var $focusElem = $(this.getElement(this.getSelection().focusNode)), offset = $focusElem.offset();
          offset.height = $focusElem.height();
          this.airShow(offset, true);
        }

      }, this));
    },
    airShow: function (e, keyboard)
    {
      if (!this.opts.air) return;

      this.selectionSave();

      var left, top;
      $('.redactor_air').hide();

      if (keyboard)
      {
        left = e.left;
        top = e.top + e.height + 14;

        if (this.opts.iframe)
        {
          top += this.$box.position().top - $(this.document).scrollTop();
          left += this.$box.position().left;
        }
      }
      else
      {
        var width = this.$air.innerWidth();

        left = e.clientX;
        if ($(this.document).width() < (left + width)) left -= width;

        top = e.clientY + 14;
        if (this.opts.iframe)
        {
          top += this.$box.position().top;
          left += this.$box.position().left;
        }
        else top += $( this.document ).scrollTop();
      }

      this.$air.css({
        left: left + 'px',
        top: top + 'px'
      }).show();

      this.airBindHide();
    },
    airBindHide: function()
    {
      if (!this.opts.air) return;

      var hideHandler = $.proxy(function(doc)
      {
        $(doc).on('mousedown.redactor', $.proxy(function(e)
        {
          if ($( e.target ).closest(this.$toolbar).length === 0)
          {
            this.$air.fadeOut(100);
            this.selectionRemove();
            $(doc).off(e);
          }

        }, this)).on('keydown.redactor', $.proxy(function(e)
        {
          if (e.which === this.keyCode.ESC)
          {
            this.getSelection().collapseToStart();
          }

          this.$air.fadeOut(100);
          $(doc).off(e);

        }, this));
      }, this);

      // Hide the toolbar at events in all documents (iframe)
      hideHandler(document);
      if (this.opts.iframe) hideHandler(this.document);
    },
    airBindMousemoveHide: function()
    {
      if (!this.opts.air) return;

      var hideHandler = $.proxy(function(doc)
      {
        $(doc).on('mousemove.redactor', $.proxy(function(e)
        {
          if ($( e.target ).closest(this.$toolbar).length === 0)
          {
            this.$air.fadeOut(100);
            $(doc).off(e);
          }

        }, this));
      }, this);

      // Hide the toolbar at events in all documents (iframe)
      hideHandler(document);
      if (this.opts.iframe) hideHandler(this.document);
    },

    // DROPDOWNS
    dropdownBuild: function($dropdown, dropdownObject)
    {
      $.each(dropdownObject, $.proxy(function(btnName, btnObject)
      {
        if (!btnObject.className) btnObject.className = '';

        var $item;
        if (btnObject.name === 'separator') $item = $('<a class="redactor_separator_drop">');
        else
        {
          $item = $('<a href="#" class="' + btnObject.className + ' redactor_dropdown_' + btnName + '">' + btnObject.title + '</a>');
          $item.on('click', $.proxy(function(e)
          {
            if (this.opts.air)
            {
              this.selectionRestore();
            }

            if (e.preventDefault) e.preventDefault();
            if (this.browser('msie')) e.returnValue = false;

            if (btnObject.callback) btnObject.callback.call(this, btnName, $item, btnObject, e);
            if (btnObject.exec) this.execCommand(btnObject.exec, btnName);
            if (btnObject.func) this[btnObject.func](btnName);

            this.buttonActiveObserver();
            if (this.opts.air) this.$air.fadeOut(100);


          }, this));
        }

        $dropdown.append($item);

      }, this));
    },
    dropdownShow: function(e, key)
    {
      if (!this.opts.visual)
      {
        e.preventDefault();
        return false;
      }

      var $button = this.buttonGet(key);

      // Always re-append it to the end of <body> so it always has the highest sub-z-index.
      var $dropdown  = $button.data('dropdown').appendTo(document.body);

      if ($button.hasClass('dropact')) this.dropdownHideAll();
      else
      {
        this.dropdownHideAll();
        this.callback('dropdownShow', { dropdown: $dropdown, key: key, button: $button });

        this.buttonActive(key);
        $button.addClass('dropact');

        var keyPosition = $button.offset();

        // fix right placement
        var dropdownWidth = $dropdown.width();
        if ((keyPosition.left + dropdownWidth) > $(document).width())
        {
          keyPosition.left -= dropdownWidth;
        }

        var left = keyPosition.left + 'px';
        var btnHeight = $button.innerHeight();

        var position = 'absolute';
        var top = (btnHeight + this.opts.toolbarFixedTopOffset) + 'px';

        if (this.opts.toolbarFixed && this.toolbarFixed) position = 'fixed';
        else top = keyPosition.top + btnHeight + 'px';

        $dropdown.css({ position: position, left: left, top: top }).show();
        this.callback('dropdownShown', { dropdown: $dropdown, key: key, button: $button });
      }


      var hdlHideDropDown = $.proxy(function(e)
      {
        this.dropdownHide(e, $dropdown);

      }, this);

      $(document).one('click', hdlHideDropDown);
      this.$editor.one('click', hdlHideDropDown);
      this.$editor.one('touchstart', hdlHideDropDown);


      e.stopPropagation();
      this.focusWithSaveScroll();
    },
    dropdownHideAll: function()
    {
      this.$toolbar.find('a.dropact').removeClass('redactor_act').removeClass('dropact');
      $('.redactor_dropdown').hide();
      this.callback('dropdownHide');
    },
    dropdownHide: function (e, $dropdown)
    {
      if (!$(e.target).hasClass('dropact'))
      {
        $dropdown.removeClass('dropact');
        this.dropdownHideAll();
      }
    },

    // BUTTONS
    buttonBuild: function(btnName, btnObject, buttonImage)
    {
      var $button = $('<a href="javascript:;" title="' + btnObject.title + '" tabindex="-1" class="re-icon re-' + btnName + '"></a>');

      if (typeof buttonImage != 'undefined')
      {
        $button.addClass('redactor-btn-image');
      }

      $button.on('click', $.proxy(function(e)
      {
        if (e.preventDefault) e.preventDefault();
        if (this.browser('msie')) e.returnValue = false;

        if ($button.hasClass('redactor_button_disabled')) return false;

        if (this.isFocused() === false && !btnObject.exec)
        {
          this.focusWithSaveScroll();
        }

        if (btnObject.exec)
        {
          this.focusWithSaveScroll();

          this.execCommand(btnObject.exec, btnName);
          this.airBindMousemoveHide();

        }
        else if (btnObject.func && btnObject.func !== 'show')
        {
          this[btnObject.func](btnName);
          this.airBindMousemoveHide();

        }
        else if (btnObject.callback)
        {
          btnObject.callback.call(this, btnName, $button, btnObject, e);
          this.airBindMousemoveHide();

        }
        else if (btnObject.dropdown)
        {
          this.dropdownShow(e, btnName);
        }

        this.buttonActiveObserver(false, btnName);

      }, this));

      // dropdown
      if (btnObject.dropdown)
      {
        var $dropdown = $('<div class="redactor_dropdown redactor_dropdown_box_' + btnName + '" style="display: none;">');
        $button.data('dropdown', $dropdown);
        this.dropdownBuild($dropdown, btnObject.dropdown);
      }

      return $button;
    },
    buttonGet: function(key)
    {
      if (!this.opts.toolbar) return false;
      return $(this.$toolbar.find('a.re-' + key));
    },
    buttonTagToActiveState: function(buttonName, tagName)
    {
      this.opts.activeButtons.push(buttonName);
      this.opts.activeButtonsStates[tagName] = buttonName;
    },
    buttonActiveToggle: function(key)
    {
      var btn = this.buttonGet(key);

      if (btn.hasClass('redactor_act'))
      {
        this.buttonInactive(key);
      }
      else
      {
        this.buttonActive(key);
      }
    },
    buttonActive: function(key)
    {
      var btn = this.buttonGet(key);
      btn.addClass('redactor_act');
    },
    buttonInactive: function(key)
    {
      var btn = this.buttonGet(key);
      btn.removeClass('redactor_act');
    },
    buttonInactiveAll: function(btnName)
    {
      this.$toolbar.find('a.re-icon').not('.re-' + btnName).removeClass('redactor_act');
    },
    buttonActiveVisual: function()
    {
      this.$toolbar.find('a.re-icon').not('a.re-html').removeClass('redactor_button_disabled');
    },
    buttonInactiveVisual: function()
    {
      this.$toolbar.find('a.re-icon').not('a.re-html').addClass('redactor_button_disabled');
    },
    buttonChangeIcon: function (key, classname)
    {
      this.buttonGet(key).addClass('re-' + classname);
    },
    buttonRemoveIcon: function(key, classname)
    {
      this.buttonGet(key).removeClass('re-' + classname);
    },
    buttonAwesome: function(key, name)
    {
      var button = this.buttonGet(key);
      button.removeClass('redactor-btn-image');
      button.addClass('fa-redactor-btn');
      button.html('<i class="fa ' + name + '"></i>');
    },
    buttonAdd: function(key, title, callback, dropdown)
    {
      if (!this.opts.toolbar) return;
      var btn = this.buttonBuild(key, { title: title, callback: callback, dropdown: dropdown }, true);

      this.$toolbar.append($('<li>').append(btn));

      return btn;
    },
    buttonAddFirst: function(key, title, callback, dropdown)
    {
      if (!this.opts.toolbar) return;
      var btn = this.buttonBuild(key, { title: title, callback: callback, dropdown: dropdown }, true);
      this.$toolbar.prepend($('<li>').append(btn));
    },
    buttonAddAfter: function(afterkey, key, title, callback, dropdown)
    {
      if (!this.opts.toolbar) return;
      var btn = this.buttonBuild(key, { title: title, callback: callback, dropdown: dropdown }, true);
      var $btn = this.buttonGet(afterkey);

      if ($btn.size() !== 0) $btn.parent().after($('<li>').append(btn));
      else this.$toolbar.append($('<li>').append(btn));

      return btn;
    },
    buttonAddBefore: function(beforekey, key, title, callback, dropdown)
    {
      if (!this.opts.toolbar) return;
      var btn = this.buttonBuild(key, { title: title, callback: callback, dropdown: dropdown }, true);
      var $btn = this.buttonGet(beforekey);

      if ($btn.size() !== 0) $btn.parent().before($('<li>').append(btn));
      else this.$toolbar.append($('<li>').append(btn));

      return btn;
    },
    buttonRemove: function (key)
    {
      var $btn = this.buttonGet(key);
      $btn.remove();
    },
    buttonActiveObserver: function(e, btnName)
    {
      var parent = this.getParent();
      this.buttonInactiveAll(btnName);

      if (e === false && btnName !== 'html')
      {
        if ($.inArray(btnName, this.opts.activeButtons) != -1)
        {
          this.buttonActiveToggle(btnName);
        }
        return;
      }

      if (parent && parent.tagName === 'A') this.$toolbar.find('a.redactor_dropdown_link').text(this.opts.curLang.link_edit);
      else this.$toolbar.find('a.redactor_dropdown_link').text(this.opts.curLang.link_insert);

      $.each(this.opts.activeButtonsStates, $.proxy(function(key, value)
      {
        if ($(parent).closest(key, this.$editor.get()[0]).length != 0)
        {
          this.buttonActive(value);
        }

      }, this));

      var $parent = $(parent).closest(this.opts.alignmentTags.toString().toLowerCase(), this.$editor[0]);
      if ($parent.length)
      {
        var align = $parent.css('text-align');
        if (align == '')
        {
          align = 'left';
        }

        this.buttonActive('align' + align);
      }
    },

    // EXEC
    execPasteFrag: function(html)
    {
      var sel = this.getSelection();
      if (sel.getRangeAt && sel.rangeCount)
      {
        var range = this.getRange();
        range.deleteContents();

        var el = this.document.createElement("div");
        el.innerHTML = html;

        var frag = this.document.createDocumentFragment(), node, lastNode;
        while ((node = el.firstChild))
        {
          lastNode = frag.appendChild(node);
        }

        var firstNode = frag.firstChild;
        range.insertNode(frag);

        if (lastNode)
        {
          range = range.cloneRange();
          range.setStartAfter(lastNode);
          range.collapse(true);
        }
        sel.removeAllRanges();
        sel.addRange(range);
      }
    },
    exec: function(cmd, param, sync)
    {
      if (cmd === 'formatblock' && this.browser('msie'))
      {
        param = '<' + param + '>';
      }

      if (cmd === 'inserthtml' && this.browser('msie'))
      {
        if (!this.isIe11())
        {
          this.focusWithSaveScroll();
          this.document.selection.createRange().pasteHTML(param);
        }
        else this.execPasteFrag(param);
      }
      else
      {
        this.document.execCommand(cmd, false, param);
      }

      if (sync !== false) this.sync();
      this.callback('execCommand', cmd, param);
    },
    execCommand: function(cmd, param, sync)
    {
      if (!this.opts.visual)
      {
        this.$source.focus();
        return false;
      }

      if (   cmd === 'bold'
        || cmd === 'italic'
        || cmd === 'underline'
        || cmd === 'strikethrough')
      {
        this.bufferSet();
      }


      if (cmd === 'superscript' || cmd === 'subscript')
      {
        var parent = this.getParent();
        if (parent.tagName === 'SUP' || parent.tagName === 'SUB')
        {
          this.inlineRemoveFormatReplace(parent);
        }
      }

      if (cmd === 'inserthtml')
      {
        this.insertHtml(param, sync);
        this.callback('execCommand', cmd, param);
        return;
      }

      // Stop formatting pre
      if (this.currentOrParentIs('PRE') && !this.opts.formattingPre) return false;

      // Lists
      if (cmd === 'insertunorderedlist' || cmd === 'insertorderedlist') return this.execLists(cmd, param);

      // Unlink
      if (cmd === 'unlink') return this.execUnlink(cmd, param);

      // Usual exec
      this.exec(cmd, param, sync);

      // Line
      if (cmd === 'inserthorizontalrule') this.$editor.find('hr').removeAttr('id');

    },
    execUnlink: function(cmd, param)
    {
      this.bufferSet();

      var link = this.currentOrParentIs('A');
      if (link)
      {
        $(link).replaceWith($(link).text());

        this.sync();
        this.callback('execCommand', cmd, param);
        return;
      }
    },
    execLists: function(cmd, param)
    {
      this.bufferSet();

      var parent = this.getParent();
      var $list = $(parent).closest('ol, ul');

      if (!this.isParentRedactor($list) && $list.size() != 0)
      {
        $list = false;
      }

      var remove = false;

      if ($list && $list.length)
      {
        remove = true;
        var listTag = $list[0].tagName;
        if ((cmd === 'insertunorderedlist' && listTag === 'OL')
        || (cmd === 'insertorderedlist' && listTag === 'UL'))
        {
          remove = false;
        }
      }

      this.selectionSave();

      // remove lists
      if (remove)
      {

        var nodes = this.getNodes();
        var elems = this.getBlocks(nodes);

        if (typeof nodes[0] != 'undefined' && nodes.length > 1 && nodes[0].nodeType == 3)
        {
          // fix the adding the first li to the array
          elems.unshift(this.getBlock());
        }

        var data = '', replaced = '';
        $.each(elems, $.proxy(function(i,s)
        {
          if (s.tagName == 'LI')
          {
            var $s = $(s);
            var cloned = $s.clone();
            cloned.find('ul', 'ol').remove();

            if (this.opts.linebreaks === false)
            {
              data += this.outerHtml($('<p>').append(cloned.contents()));
            }
            else
            {
              var clonedHtml = cloned.html().replace(/<br\s?\/?>$/i, '');
              data += clonedHtml + '<br>';
            }

            if (i == 0)
            {
              $s.addClass('redactor-replaced').empty();
              replaced = this.outerHtml($s);
            }
            else $s.remove();
          }

        }, this));


        html = this.$editor.html().replace(replaced, '</' + listTag + '>' + data + '<' + listTag + '>');

        this.$editor.html(html);
        this.$editor.find(listTag + ':empty').remove();

      }

      // insert lists
      else
      {
        var firstParent = $(this.getParent()).closest('td');

        if (this.browser('msie') && !this.isIe11() && this.opts.linebreaks)
        {
          var wrapper = this.selectionWrap('div');
          var wrapperHtml = $(wrapper).html();
          var tmpList = $('<ul>');
          if (cmd == 'insertorderedlist')
          {
            tmpList = $('<ol>');
          }

          var tmpLi = $('<li>');

          if ($.trim(wrapperHtml) == '')
          {
            tmpLi.append(wrapperHtml + '<span id="selection-marker-1">' + this.opts.invisibleSpace + '</span>');
            tmpList.append(tmpLi);
            this.$editor.find('#selection-marker-1').replaceWith(tmpList);
          }
          else
          {
            tmpLi.append(wrapperHtml);
            tmpList.append(tmpLi);
            $(wrapper).replaceWith(tmpList);
          }
        }
        else
        {
          this.document.execCommand(cmd);
        }

        var parent = this.getParent();
        var $list = $(parent).closest('ol, ul');

        if (this.opts.linebreaks === false)
        {
          var listText = $.trim($list.text());
          if (listText == '')
          {
            $list.children('li').find('br').remove();
            $list.children('li').append('<span id="selection-marker-1">' + this.opts.invisibleSpace + '</span>');
          }
        }

        if (firstParent.size() != 0)
        {
          $list.wrapAll('<td>');
        }

        if ($list.length)
        {
          // remove block-element list wrapper
          var $listParent = $list.parent();
          if (this.isParentRedactor($listParent) && $listParent[0].tagName != 'LI' && this.nodeTestBlocks($listParent[0]))
          {
            $listParent.replaceWith($listParent.contents());
          }
        }

        if (this.browser('mozilla'))
        {
          this.$editor.focus();
        }
      }

      this.selectionRestore();
      this.$editor.find('#selection-marker-1').removeAttr('id');
      this.sync();
      this.callback('execCommand', cmd, param);
      return;
    },

    // INDENTING
    indentingIndent: function()
    {
      this.indentingStart('indent');
    },
    indentingOutdent: function()
    {
      this.indentingStart('outdent');
    },
    indentingStart: function(cmd)
    {
      this.bufferSet();

      if (cmd === 'indent')
      {
        var block = this.getBlock();

        this.selectionSave();

        if (block && block.tagName == 'LI')
        {
          // li
          var parent = this.getParent();

          var $list = $(parent).closest('ol, ul');
          var listTag = $list[0].tagName;

          var elems = this.getBlocks();

          $.each(elems, function(i,s)
          {
            if (s.tagName == 'LI')
            {
              var $prev = $(s).prev();
              if ($prev.size() != 0 && $prev[0].tagName == 'LI')
              {
                var $childList = $prev.children('ul, ol');
                if ($childList.size() == 0)
                {
                  $prev.append($('<' + listTag + '>').append(s));
                }
                else $childList.append(s);
              }
            }
          });
        }
        // linebreaks
        else if (block === false && this.opts.linebreaks === true)
        {
          this.exec('formatBlock', 'blockquote');
          var newblock = this.getBlock();
          var block = $('<div data-tagblock="">').html($(newblock).html());
          $(newblock).replaceWith(block);

          var left = this.normalize($(block).css('margin-left')) + this.opts.indentValue;
          $(block).css('margin-left', left + 'px');
        }
        else
        {
          // all block tags
          var elements = this.getBlocks();
          $.each(elements, $.proxy(function(i, elem)
          {
            var $el = false;

            if (elem.tagName === 'TD') return;

            if ($.inArray(elem.tagName, this.opts.alignmentTags) !== -1)
            {
              $el = $(elem);
            }
            else
            {
              $el = $(elem).closest(this.opts.alignmentTags.toString().toLowerCase(), this.$editor[0]);
            }

            var left = this.normalize($el.css('margin-left')) + this.opts.indentValue;
            $el.css('margin-left', left + 'px');

          }, this));
        }

        this.selectionRestore();

      }
      // outdent
      else
      {
        this.selectionSave();

        var block = this.getBlock();
        if (block && block.tagName == 'LI')
        {
          // li
          var elems = this.getBlocks();
          var index = 0;

          this.insideOutdent(block, index, elems);
        }
        else
        {
          // all block tags
          var elements = this.getBlocks();
          $.each(elements, $.proxy(function(i, elem)
          {
            var $el = false;

            if ($.inArray(elem.tagName, this.opts.alignmentTags) !== -1)
            {
              $el = $(elem);
            }
            else
            {
              $el = $(elem).closest(this.opts.alignmentTags.toString().toLowerCase(), this.$editor[0]);
            }

            var left = this.normalize($el.css('margin-left')) - this.opts.indentValue;
            if (left <= 0)
            {
              // linebreaks
              if (this.opts.linebreaks === true && typeof($el.data('tagblock')) !== 'undefined')
              {
                $el.replaceWith($el.html() + '<br>');
              }
              // all block tags
              else
              {
                $el.css('margin-left', '');
                this.removeEmptyAttr($el, 'style');
              }
            }
            else
            {
              $el.css('margin-left', left + 'px');
            }

          }, this));
        }


        this.selectionRestore();
      }

      this.sync();

    },
    insideOutdent: function (li, index, elems)
    {
      if (li && li.tagName == 'LI')
      {
        var $parent = $(li).parent().parent();
        if ($parent.size() != 0 && $parent[0].tagName == 'LI')
        {
          $parent.after(li);
        }
        else
        {
          if (typeof elems[index] != 'undefined')
          {
            li = elems[index];
            index++;

            this.insideOutdent(li, index, elems);
          }
          else
          {
            this.execCommand('insertunorderedlist');
          }
        }
      }
    },

    // ALIGNMENT
    alignmentLeft: function()
    {
      this.alignmentSet('', 'JustifyLeft');
    },
    alignmentRight: function()
    {
      this.alignmentSet('right', 'JustifyRight');
    },
    alignmentCenter: function()
    {
      this.alignmentSet('center', 'JustifyCenter');
    },
    alignmentJustify: function()
    {
      this.alignmentSet('justify', 'JustifyFull');
    },
    alignmentSet: function(type, cmd)
    {
      this.bufferSet();

      if (this.oldIE())
      {
        this.document.execCommand(cmd, false, false);
        return true;
      }

      this.selectionSave();

      var block = this.getBlock();
      if (!block && this.opts.linebreaks)
      {
        // one element
        this.exec('formatblock', 'div');

        var newblock = this.getBlock();
        var block = $('<div data-tagblock="">').html($(newblock).html());
        $(newblock).replaceWith(block);

        $(block).css('text-align', type);
        this.removeEmptyAttr(block, 'style');

        if (type == '' && typeof($(block).data('tagblock')) !== 'undefined')
        {
          $(block).replaceWith($(block).html());
        }
      }
      else
      {
        var elements = this.getBlocks();
        $.each(elements, $.proxy(function(i, elem)
        {
          var $el = false;

          if ($.inArray(elem.tagName, this.opts.alignmentTags) !== -1)
          {
            $el = $(elem);
          }
          else
          {
            $el = $(elem).closest(this.opts.alignmentTags.toString().toLowerCase(), this.$editor[0]);
          }

          if ($el)
          {
            $el.css('text-align', type);
            this.removeEmptyAttr($el, 'style');
          }

        }, this));
      }

      this.selectionRestore();
      this.sync();
    },

    // CLEAN
    cleanEmpty: function(html)
    {
      var ph = this.placeholderStart(html);
      if (ph !== false) return ph;

      if (this.opts.linebreaks === false)
      {
        if (html === '') html = this.opts.emptyHtml;
        else if (html.search(/^<hr\s?\/?>$/gi) !== -1) html = '<hr>' + this.opts.emptyHtml;
      }

      return html;
    },
    cleanConverters: function(html)
    {
      // convert div to p
      if (this.opts.convertDivs && !this.opts.gallery)
      {
        html = html.replace(/<div(.*?)>([\w\W]*?)<\/div>/gi, '<p$1>$2</p>');
      }

      if (this.opts.paragraphy) html = this.cleanParagraphy(html);

      return html;
    },
    cleanConvertProtected: function(html)
    {
      if (this.opts.templateVars)
      {
        html = html.replace(/\{\{(.*?)\}\}/gi, '<!-- template double $1 -->');
        html = html.replace(/\{(.*?)\}/gi, '<!-- template $1 -->');
      }

      html = html.replace(/<script(.*?)>([\w\W]*?)<\/script>/gi, '<title type="text/javascript" style="display: none;" class="redactor-script-tag"$1>$2</title>');
      html = html.replace(/<style(.*?)>([\w\W]*?)<\/style>/gi, '<section$1 style="display: none;" rel="redactor-style-tag">$2</section>');
      html = html.replace(/<form(.*?)>([\w\W]*?)<\/form>/gi, '<section$1 rel="redactor-form-tag">$2</section>');

      // php tags convertation
      if (this.opts.phpTags) html = html.replace(/<\?php([\w\W]*?)\?>/gi, '<section style="display: none;" rel="redactor-php-tag">$1</section>');
      else html = html.replace(/<\?php([\w\W]*?)\?>/gi, '');

      return html;
    },
    cleanReConvertProtected: function(html)
    {
      if (this.opts.templateVars)
      {
        html = html.replace(/<!-- template double (.*?) -->/gi, '{{$1}}');
        html = html.replace(/<!-- template (.*?) -->/gi, '{$1}');
      }

      html = html.replace(/<title type="text\/javascript" style="display: none;" class="redactor-script-tag"(.*?)>([\w\W]*?)<\/title>/gi, '<script$1 type="text/javascript">$2</script>');
      html = html.replace(/<section(.*?) style="display: none;" rel="redactor-style-tag">([\w\W]*?)<\/section>/gi, '<style$1>$2</style>');
      html = html.replace(/<section(.*?)rel="redactor-form-tag"(.*?)>([\w\W]*?)<\/section>/gi, '<form$1$2>$3</form>');

      // php tags convertation
      if (this.opts.phpTags) html = html.replace(/<section style="display: none;" rel="redactor-php-tag">([\w\W]*?)<\/section>/gi, '<?php\r\n$1\r\n?>');

      return html;
    },
    cleanRemoveSpaces: function(html, buffer)
    {
      if (buffer !== false)
      {
        var buffer = []
        var matches = html.match(/<(pre|style|script|title)(.*?)>([\w\W]*?)<\/(pre|style|script|title)>/gi);
        if (matches === null) matches = [];

        if (this.opts.phpTags)
        {
          var phpMatches = html.match(/<\?php([\w\W]*?)\?>/gi);
          if (phpMatches) matches = $.merge(matches, phpMatches);
        }

        if (matches)
        {
          $.each(matches, function(i, s)
          {
            html = html.replace(s, 'buffer_' + i);
            buffer.push(s);
          });
        }
      }

      html = html.replace(/\n/g, ' ');
      html = html.replace(/[\t]*/g, '');
      html = html.replace(/\n\s*\n/g, "\n");
      html = html.replace(/^[\s\n]*/g, ' ');
      html = html.replace(/[\s\n]*$/g, ' ');
      html = html.replace( />\s{2,}</g, '> <'); // between inline tags can be only one space

      html = this.cleanReplacer(html, buffer);

      html = html.replace(/\n\n/g, "\n");

      return html;
    },
    cleanReplacer: function(html, buffer)
    {
      if (buffer === false) return html;

      $.each(buffer, function(i,s)
      {
        html = html.replace('buffer_' + i, s);
      });

      return html;
    },
    cleanRemoveEmptyTags: function(html)
    {
      // remove zero width-space
      html = html.replace(/[\u200B-\u200D\uFEFF]/g, '');

      var etagsInline = ["<b>\\s*</b>", "<b>&nbsp;</b>", "<em>\\s*</em>"]
      var etags = ["<pre></pre>", "<blockquote>\\s*</blockquote>", "<dd></dd>", "<dt></dt>", "<ul></ul>", "<ol></ol>", "<li></li>", "<table></table>", "<tr></tr>", "<span>\\s*<span>", "<span>&nbsp;<span>", "<p>\\s*</p>", "<p></p>", "<p>&nbsp;</p>",  "<p>\\s*<br>\\s*</p>", "<div>\\s*</div>", "<div>\\s*<br>\\s*</div>"];

      if (this.opts.removeEmptyTags)
      {
        etags = etags.concat(etagsInline);
      }
      else etags = etagsInline;

      var len = etags.length;
      for (var i = 0; i < len; ++i)
      {
        html = html.replace(new RegExp(etags[i], 'gi'), "");
      }

      return html;
    },
    cleanParagraphy: function(html)
    {
      html = $.trim(html);

      if (this.opts.linebreaks === true) return html;
      if (html === '' || html === '<p></p>') return this.opts.emptyHtml;

      html = html + "\n";

      if (this.opts.removeEmptyTags === false)
      {
        return html;
      }

      var safes = [];
      var matches = html.match(/<(table|div|pre|object)(.*?)>([\w\W]*?)<\/(table|div|pre|object)>/gi);
      if (!matches) matches = [];

      var commentsMatches = html.match(/<!--([\w\W]*?)-->/gi);
      if (commentsMatches) matches = $.merge(matches, commentsMatches);

      if (this.opts.phpTags)
      {
        var phpMatches = html.match(/<section(.*?)rel="redactor-php-tag">([\w\W]*?)<\/section>/gi);
        if (phpMatches) matches = $.merge(matches, phpMatches);
      }

      if (matches)
      {
        $.each(matches, function(i,s)
        {
          safes[i] = s;
          html = html.replace(s, '{replace' + i + '}\n');
        });
      }

      html = html.replace(/<br \/>\s*<br \/>/gi, "\n\n");
      html = html.replace(/<br><br>/gi, "\n\n");

      function R(str, mod, r)
      {
        return html.replace(new RegExp(str, mod), r);
      }

      var blocks = '(comment|html|body|head|title|meta|style|script|link|iframe|table|thead|tfoot|caption|col|colgroup|tbody|tr|td|th|div|dl|dd|dt|ul|ol|li|pre|select|option|form|map|area|blockquote|address|math|style|p|h[1-6]|hr|fieldset|legend|section|article|aside|hgroup|header|footer|nav|figure|figcaption|details|menu|summary)';

      html = R('(<' + blocks + '[^>]*>)', 'gi', "\n$1");
      html = R('(</' + blocks + '>)', 'gi', "$1\n\n");
      html = R("\r\n", 'g', "\n");
      html = R("\r", 'g', "\n");
      html = R("/\n\n+/", 'g', "\n\n");

      var htmls = html.split(new RegExp('\n\s*\n', 'g'), -1);

      html = '';
      for (var i in htmls)
      {
        if (htmls.hasOwnProperty(i))
                {
          if (htmls[i].search('{replace') == -1)
          {
            htmls[i] = htmls[i].replace(/<p>\n\t?<\/p>/gi, '');
            htmls[i] = htmls[i].replace(/<p><\/p>/gi, '');

            if (htmls[i] != '')
            {
              html += '<p>' +  htmls[i].replace(/^\n+|\n+$/g, "") + "</p>";
            }
          }
          else html += htmls[i];
        }
      }

      html = R('<p><p>', 'gi', '<p>');
      html = R('</p></p>', 'gi', '</p>');

      html = R('<p>\s?</p>', 'gi', '');

      html = R('<p>([^<]+)</(div|address|form)>', 'gi', "<p>$1</p></$2>");

      html = R('<p>(</?' + blocks + '[^>]*>)</p>', 'gi', "$1");
      html = R("<p>(<li.+?)</p>", 'gi', "$1");
      html = R('<p>\s?(</?' + blocks + '[^>]*>)', 'gi', "$1");

      html = R('(</?' + blocks + '[^>]*>)\s?</p>', 'gi', "$1");
      html = R('(</?' + blocks + '[^>]*>)\s?<br />', 'gi', "$1");
      html = R('<br />(\s*</?(?:p|li|div|dl|dd|dt|th|pre|td|ul|ol)[^>]*>)', 'gi', '$1');
      html = R("\n</p>", 'gi', '</p>');

      html = R('<li><p>', 'gi', '<li>');
      html = R('</p></li>', 'gi', '</li>');
      html = R('</li><p>', 'gi', '</li>');
      //html = R('</ul><p>(.*?)</li>', 'gi', '</ul></li>');
      // html = R('</ol><p>', 'gi', '</ol>');
      html = R('<p>\t?\n?<p>', 'gi', '<p>');
      html = R('</dt><p>', 'gi', '</dt>');
      html = R('</dd><p>', 'gi', '</dd>');
      html = R('<br></p></blockquote>', 'gi', '</blockquote>');
      html = R('<p>\t*</p>', 'gi', '');

      // restore safes
      $.each(safes, function(i,s)
      {
        html = html.replace('{replace' + i + '}', s);
      });

      return $.trim(html);
    },
    cleanConvertInlineTags: function(html, set)
    {
      var boldTag = 'strong';
      if (this.opts.boldTag === 'b') boldTag = 'b';

      var italicTag = 'em';
      if (this.opts.italicTag === 'i') italicTag = 'i';

      html = html.replace(/<span style="font-style: italic;">([\w\W]*?)<\/span>/gi, '<' + italicTag + '>$1</' + italicTag + '>');
      html = html.replace(/<span style="font-weight: bold;">([\w\W]*?)<\/span>/gi, '<' + boldTag + '>$1</' + boldTag + '>');

      // bold, italic, del
      if (this.opts.boldTag === 'strong') html = html.replace(/<b>([\w\W]*?)<\/b>/gi, '<strong>$1</strong>');
      else html = html.replace(/<strong>([\w\W]*?)<\/strong>/gi, '<b>$1</b>');

      if (this.opts.italicTag === 'em') html = html.replace(/<i>([\w\W]*?)<\/i>/gi, '<em>$1</em>');
      else html = html.replace(/<em>([\w\W]*?)<\/em>/gi, '<i>$1</i>');

      html = html.replace(/<span style="text-decoration: underline;">([\w\W]*?)<\/span>/gi, '<u>$1</u>');

      if (set !== true) html = html.replace(/<strike>([\w\W]*?)<\/strike>/gi, '<del>$1</del>');
      else html = html.replace(/<del>([\w\W]*?)<\/del>/gi, '<strike>$1</strike>');

      return html;
    },
    cleanStripTags: function(html)
    {
      if (html == '' || typeof html == 'undefined') return html;

      var allowed = false;
      if (this.opts.allowedTags !== false) allowed = true;

      var arr = allowed === true ? this.opts.allowedTags : this.opts.deniedTags;

      var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
      html = html.replace(tags, function ($0, $1)
      {
        if (allowed === true) return $.inArray($1.toLowerCase(), arr) > '-1' ? $0 : '';
        else return $.inArray($1.toLowerCase(), arr) > '-1' ? '' : $0;
      });

      html = this.cleanConvertInlineTags(html);

      return html;

    },
    cleanSavePreCode: function(html, encode)
    {
      var pre = html.match(/<(pre|code)(.*?)>([\w\W]*?)<\/(pre|code)>/gi);
      if (pre !== null)
      {
        $.each(pre, $.proxy(function(i,s)
        {
          var arr = s.match(/<(pre|code)(.*?)>([\w\W]*?)<\/(pre|code)>/i);

          arr[3] = arr[3].replace(/&nbsp;/g, ' ');

          if (encode !== false) arr[3] = this.cleanEncodeEntities(arr[3]);

          // $ fix
          arr[3] = arr[3].replace(/\$/g, '&#36;');

          html = html.replace(s, '<' + arr[1] + arr[2] + '>' + arr[3] + '</' + arr[1] + '>');

        }, this));
      }

      return html;
    },
    cleanEncodeEntities: function(str)
    {
      str = String(str).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    },
    cleanUnverified: function()
    {
      // label, abbr, mark, meter, code, q, dfn, ins, time, kbd, var
      var $elem = this.$editor.find('li, img, a, b, strong, sub, sup, i, em, u, small, strike, del, span, cite');

      $elem.filter('[style*="background-color: transparent;"][style*="line-height"]')
      .css('background-color', '')
      .css('line-height', '');

      $elem.filter('[style*="background-color: transparent;"]')
      .css('background-color', '');

      $elem.css('line-height', '');

      $.each($elem, $.proxy(function(i,s)
      {
        this.removeEmptyAttr(s, 'style');
      }, this));

      var $elem2 = this.$editor.find('b, strong, i, em, u, strike, del');
      $elem2.css('font-size', '');

      $.each($elem2, $.proxy(function(i,s)
      {
        this.removeEmptyAttr(s, 'style');
      }, this));

      // When we paste text in Safari is wrapping inserted div (remove it)
      this.$editor.find('div[style="text-align: -webkit-auto;"]').contents().unwrap();

      // Remove all styles in ul, ol, li
      this.$editor.find('ul, ol, li').removeAttr('style');
    },


    // TEXTAREA CODE FORMATTING
    cleanHtml: function(code)
    {
      var i = 0,
      codeLength = code.length,
      point = 0,
      start = null,
      end = null,
      tag = '',
      out = '',
      cont = '';

      this.cleanlevel = 0;

      for (; i < codeLength; i++)
      {
        point = i;

        // if no more tags, copy and exit
        if (-1 == code.substr(i).indexOf( '<' ))
        {
          out += code.substr(i);

          return this.cleanFinish(out);
        }

        // copy verbatim until a tag
        while (point < codeLength && code.charAt(point) != '<')
        {
          point++;
        }

        if (i != point)
        {
          cont = code.substr(i, point - i);
          if (!cont.match(/^\s{2,}$/g))
          {
            if ('\n' == out.charAt(out.length - 1)) out += this.cleanGetTabs();
            else if ('\n' == cont.charAt(0))
            {
              out += '\n' + this.cleanGetTabs();
              cont = cont.replace(/^\s+/, '');
            }

            out += cont;
          }

          if (cont.match(/\n/)) out += '\n' + this.cleanGetTabs();
        }

        start = point;

        // find the end of the tag
        while (point < codeLength && '>' != code.charAt(point))
        {
          point++;
        }

        tag = code.substr(start, point - start);
        i = point;

        var t;

        if ('!--' == tag.substr(1, 3))
        {
          if (!tag.match(/--$/))
          {
            while ('-->' != code.substr(point, 3))
            {
              point++;
            }
            point += 2;
            tag = code.substr(start, point - start);
            i = point;
          }

          if ('\n' != out.charAt(out.length - 1)) out += '\n';

          out += this.cleanGetTabs();
          out += tag + '>\n';
        }
        else if ('!' == tag[1])
        {
          out = this.placeTag(tag + '>', out);
        }
        else if ('?' == tag[1])
        {
          out += tag + '>\n';
        }
        else if (t = tag.match(/^<(script|style|pre)/i))
        {
          t[1] = t[1].toLowerCase();
          tag = this.cleanTag(tag);
          out = this.placeTag(tag, out);
          end = String(code.substr(i + 1)).toLowerCase().indexOf('</' + t[1]);

          if (end)
          {
            cont = code.substr(i + 1, end);
            i += end;
            out += cont;
          }
        }
        else
        {
          tag = this.cleanTag(tag);
          out = this.placeTag(tag, out);
        }
      }

      return this.cleanFinish(out);
    },
    cleanGetTabs: function()
    {
      var s = '';
      for ( var j = 0; j < this.cleanlevel; j++ )
      {
        s += '\t';
      }

      return s;
    },
    cleanFinish: function(code)
    {
      code = code.replace(/\n\s*\n/g, '\n');
      code = code.replace(/^[\s\n]*/, '');
      code = code.replace(/[\s\n]*$/, '');
      code = code.replace(/<script(.*?)>\n<\/script>/gi, '<script$1></script>');

      this.cleanlevel = 0;

      return code;
    },
    cleanTag: function (tag)
    {
      var tagout = '';
      tag = tag.replace(/\n/g, ' ');
      tag = tag.replace(/\s{2,}/g, ' ');
      tag = tag.replace(/^\s+|\s+$/g, ' ');

      var suffix = '';
      if (tag.match(/\/$/))
      {
        suffix = '/';
        tag = tag.replace(/\/+$/, '');
      }

      var m;
      while (m = /\s*([^= ]+)(?:=((['"']).*?\3|[^ ]+))?/.exec(tag))
      {
        if (m[2]) tagout += m[1].toLowerCase() + '=' + m[2];
        else if (m[1]) tagout += m[1].toLowerCase();

        tagout += ' ';
        tag = tag.substr(m[0].length);
      }

      return tagout.replace(/\s*$/, '') + suffix + '>';
    },
    placeTag: function (tag, out)
    {
      var nl = tag.match(this.cleannewLevel);
      if (tag.match(this.cleanlineBefore) || nl)
      {
        out = out.replace(/\s*$/, '');
        out += '\n';
      }

      if (nl && '/' == tag.charAt(1)) this.cleanlevel--;
      if ('\n' == out.charAt(out.length - 1)) out += this.cleanGetTabs();
      if (nl && '/' != tag.charAt(1)) this.cleanlevel++;

      out += tag;

      if (tag.match(this.cleanlineAfter) || tag.match(this.cleannewLevel))
      {
        out = out.replace(/ *$/, '');
        out += '\n';
      }

      return out;
    },

    // FORMAT
    formatEmpty: function(e)
    {
      var html = $.trim(this.$editor.html());

      if (this.opts.linebreaks)
      {
        if (html == '')
        {
          e.preventDefault();
          this.$editor.html('');
          this.focus();
        }
      }
      else
      {
        html = html.replace(/<br\s?\/?>/i, '');
        var thtml = html.replace(/<p>\s?<\/p>/gi, '');

        if (html === '' || thtml === '')
        {
          e.preventDefault();

          var node = $(this.opts.emptyHtml).get(0);
          this.$editor.html(node);
          this.focus();
        }
      }

      this.sync();
    },
    formatBlocks: function(tag)
    {
      if (this.browser('mozilla') && this.isFocused())
      {
        this.$editor.focus();
      }

      this.bufferSet();

      var nodes = this.getBlocks();
      this.selectionSave();

      $.each(nodes, $.proxy(function(i, node)
      {
        if (node.tagName !== 'LI')
        {
          var parent = $(node).parent();

          if (tag === 'p')
          {
            if ((node.tagName === 'P'
            && parent.size() != 0
            && parent[0].tagName === 'BLOCKQUOTE')
            ||
            node.tagName === 'BLOCKQUOTE')
            {
              this.formatQuote();
              return;
            }
            else if (this.opts.linebreaks)
            {
              if (node && node.tagName.search(/H[1-6]/) == 0)
              {
                $(node).replaceWith(node.innerHTML + '<br>');
              }
              else return;
            }
            else
            {
              this.formatBlock(tag, node);
            }
          }
          else
          {
            this.formatBlock(tag, node);
          }
        }

      }, this));

      this.selectionRestore();
      this.sync();
    },
    formatBlock: function(tag, block)
    {
      if (block === false) block = this.getBlock();
      if (block === false && this.opts.linebreaks === true)
      {
        this.execCommand('formatblock', tag);
        return true;
      }

      var contents = '';
      if (tag !== 'pre')
      {
        contents = $(block).contents();
      }
      else
      {
        //contents = this.cleanEncodeEntities($(block).text());
        contents = $(block).html();
        if ($.trim(contents) === '')
        {
          contents = '<span id="selection-marker-1"></span>';
        }
      }

      if (block.tagName === 'PRE') tag = 'p';

      if (this.opts.linebreaks === true && tag === 'p')
      {
        $(block).replaceWith($('<div>').append(contents).html() + '<br>');
      }
      else
      {
        var parent = this.getParent();

        var node = $('<' + tag + '>').append(contents);
        $(block).replaceWith(node);

        if (parent && parent.tagName == 'TD')
        {
          $(node).wrapAll('<td>');
        }
      }
    },
    formatChangeTag: function(fromElement, toTagName, save)
    {
      if (save !== false) this.selectionSave();

      var newElement = $('<' + toTagName + '/>');
      $(fromElement).replaceWith(function() { return newElement.append($(this).contents()); });

      if (save !== false) this.selectionRestore();

      return newElement;
    },

    // QUOTE
    formatQuote: function()
    {
      if (this.browser('mozilla') && this.isFocused())
      {
        this.$editor.focus();
      }

      this.bufferSet();

      // paragraphy
      if (this.opts.linebreaks === false)
      {
        this.selectionSave();

        var blocks = this.getBlocks();

        var blockquote = false;
        var blocksLen = blocks.length;
        if (blocks)
        {
          var data = '';
          var replaced = '';
          var replace = false;
          var paragraphsOnly = true;

          $.each(blocks, function(i,s)
          {
            if (s.tagName !== 'P') paragraphsOnly = false;
          });

          $.each(blocks, $.proxy(function(i,s)
          {
            if (s.tagName === 'BLOCKQUOTE')
            {
              this.formatBlock('p', s, false);
            }
            else if (s.tagName === 'P')
            {
              blockquote = $(s).parent();
              // from blockquote
              if (blockquote[0].tagName == 'BLOCKQUOTE')
              {
                var count = $(blockquote).children('p').size();

                // one
                if (count == 1)
                {
                  $(blockquote).replaceWith(s);
                }
                // all
                else if (count == blocksLen)
                {
                  replace = 'blockquote';
                  data += this.outerHtml(s);
                }
                // some
                else
                {
                  replace = 'html';
                  data += this.outerHtml(s);

                  if (i == 0)
                  {
                    $(s).addClass('redactor-replaced').empty();
                    replaced = this.outerHtml(s);
                  }
                  else $(s).remove();
                }
              }
              // to blockquote
              else
              {
                if (paragraphsOnly === false || blocks.length == 1)
                {
                  this.formatBlock('blockquote', s, false);
                }
                else
                {
                  replace = 'paragraphs';
                  data += this.outerHtml(s);
                }
              }

            }
            else if (s.tagName !== 'LI')
            {
              this.formatBlock('blockquote', s, false);
            }

          }, this));

          if (replace)
          {
            if (replace == 'paragraphs')
            {
              $(blocks[0]).replaceWith('<blockquote>' + data + '</blockquote>');
              $(blocks).remove();
            }
            else if (replace == 'blockquote')
            {
              $(blockquote).replaceWith(data);
            }
            else if (replace == 'html')
            {
              var html = this.$editor.html().replace(replaced, '</blockquote>' + data + '<blockquote>');

              this.$editor.html(html);
              this.$editor.find('blockquote').each(function()
              {
                if ($.trim($(this).html()) == '') $(this).remove();
              })
            }
          }
        }

        this.selectionRestore();
      }
      // linebreaks
      else
      {
        var block = this.getBlock();
        if (block.tagName === 'BLOCKQUOTE')
        {
          this.selectionSave();

          var html = $.trim($(block).html());
          var selection = $.trim(this.getSelectionHtml());

          html = html.replace(/<span(.*?)id="selection-marker(.*?)<\/span>/gi, '');

          if (html == selection)
          {
            $(block).replaceWith($(block).html() + '<br>');
          }
          else
          {
            // replace
            this.inlineFormat('tmp');
            var tmp = this.$editor.find('tmp');
            tmp.empty();

            var newhtml = this.$editor.html().replace('<tmp></tmp>', '</blockquote><span id="selection-marker-1">' + this.opts.invisibleSpace + '</span>' + selection + '<blockquote>');

            this.$editor.html(newhtml);
            tmp.remove();
            this.$editor.find('blockquote').each(function()
            {
              if ($.trim($(this).html()) == '') $(this).remove();
            })
          }

          this.selectionRestore();
          this.$editor.find('span#selection-marker-1').attr('id', false);
        }
        else
        {
          var wrapper = this.selectionWrap('blockquote');
          var html = $(wrapper).html();

          var blocksElemsRemove = ['ul', 'ol', 'table', 'tr', 'tbody', 'thead', 'tfoot', 'dl'];
          $.each(blocksElemsRemove, function(i,s)
          {
            html = html.replace(new RegExp('<' + s + '(.*?)>', 'gi'), '');
            html = html.replace(new RegExp('</' + s + '>', 'gi'), '');
          });

          var blocksElems = this.opts.blockLevelElements;
          $.each(blocksElems, function(i,s)
          {
            html = html.replace(new RegExp('<' + s + '(.*?)>', 'gi'), '');
            html = html.replace(new RegExp('</' + s + '>', 'gi'), '<br>');
          });

          $(wrapper).html(html);
          this.selectionElement(wrapper);
          var next = $(wrapper).next();
          if (next.size() != 0 && next[0].tagName === 'BR')
          {
            next.remove();
          }
        }
      }

      this.sync();
    },

    // BLOCK
    blockRemoveAttr: function(attr, value)
    {
      var nodes = this.getBlocks();
      $(nodes).removeAttr(attr);

      this.sync();
    },
    blockSetAttr: function(attr, value)
    {
      var nodes = this.getBlocks();
      $(nodes).attr(attr, value);

      this.sync();
    },
    blockRemoveStyle: function(rule)
    {
      var nodes = this.getBlocks();
      $(nodes).css(rule, '');
      this.removeEmptyAttr(nodes, 'style');

      this.sync();
    },
    blockSetStyle: function (rule, value)
    {
      var nodes = this.getBlocks();
      $(nodes).css(rule, value);

      this.sync();
    },
    blockRemoveClass: function(className)
    {
      var nodes = this.getBlocks();
      $(nodes).removeClass(className);
      this.removeEmptyAttr(nodes, 'class');

      this.sync();
    },
    blockSetClass: function(className)
    {
      var nodes = this.getBlocks();
      $(nodes).addClass(className);

      this.sync();
    },

    // INLINE
    inlineRemoveClass: function(className)
    {
      this.selectionSave();

      this.inlineEachNodes(function(node)
      {
        $(node).removeClass(className);
        this.removeEmptyAttr(node, 'class');
      });

      this.selectionRestore();
      this.sync();
    },
    inlineSetClass: function(className)
    {
      var current = this.getCurrent();
      if (!$(current).hasClass(className)) this.inlineMethods('addClass', className);
    },
    inlineRemoveStyle: function (rule)
    {
      this.selectionSave();

      this.inlineEachNodes(function(node)
      {
        $(node).css(rule, '');
        this.removeEmptyAttr(node, 'style');
      });

      this.selectionRestore();
      this.sync();
    },
    inlineSetStyle: function(rule, value)
    {
      this.inlineMethods('css', rule, value);
    },
    inlineRemoveAttr: function (attr)
    {
      this.selectionSave();

      var range = this.getRange(), node = this.getElement(), nodes = this.getNodes();

      if (range.collapsed || range.startContainer === range.endContainer && node)
      {
        nodes = $( node );
      }

      $(nodes).removeAttr(attr);

      this.inlineUnwrapSpan();

      this.selectionRestore();
      this.sync();
    },
    inlineSetAttr: function(attr, value)
    {
      this.inlineMethods('attr', attr, value );
    },
    inlineMethods: function(type, attr, value)
    {
      this.bufferSet();
      this.selectionSave();

      var range = this.getRange()
      var el = this.getElement();

      if ((range.collapsed || range.startContainer === range.endContainer) && el && !this.nodeTestBlocks(el))
      {
        $(el)[type](attr, value);
      }
      else
      {
        var cmd, arg = value;
        switch (attr)
        {
          case 'font-size':
            cmd = 'fontSize';
            arg = 4;
          break;
          case 'font-family':
            cmd = 'fontName';
          break;
          case 'color':
            cmd = 'foreColor';
          break;
          case 'background-color':
            cmd = 'backColor';
          break;
        }

        this.document.execCommand(cmd, false, arg);

        var fonts = this.$editor.find('font');
        $.each(fonts, $.proxy(function(i, s)
        {
          this.inlineSetMethods(type, s, attr, value);

        }, this));

      }

      this.selectionRestore();
      this.sync();
    },
    inlineSetMethods: function(type, s, attr, value)
    {
      var parent = $(s).parent(), el;

      var selectionHtml = this.getSelectionText();
      var parentHtml = $(parent).text();
      var selected = selectionHtml == parentHtml;

      if (selected && parent && parent[0].tagName === 'INLINE' && parent[0].attributes.length != 0)
      {
        el = parent;
        $(s).replaceWith($(s).html());
      }
      else
      {
        el = $('<inline>').append($(s).contents());
        $(s).replaceWith(el);
      }


      $(el)[type](attr, value);

      return el;
    },
    // Sort elements and execute callback
    inlineEachNodes: function(callback)
    {
      var range = this.getRange(),
        node = this.getElement(),
        nodes = this.getNodes(),
        collapsed;

      if (range.collapsed || range.startContainer === range.endContainer && node)
      {
        nodes = $(node);
        collapsed = true;
      }

      $.each(nodes, $.proxy(function(i, node)
      {
        if (!collapsed && node.tagName !== 'INLINE')
        {
          var selectionHtml = this.getSelectionText();
          var parentHtml = $(node).parent().text();
          var selected = selectionHtml == parentHtml;

          if (selected && node.parentNode.tagName === 'INLINE' && !$(node.parentNode).hasClass('redactor_editor'))
          {
            node = node.parentNode;
          }
          else return;
        }
        callback.call(this, node);

      }, this ) );
    },
    inlineUnwrapSpan: function()
    {
      var $spans = this.$editor.find('inline');

      $.each($spans, $.proxy(function(i, span)
      {
        var $span = $(span);

        if ($span.attr('class') === undefined && $span.attr('style') === undefined)
        {
          $span.contents().unwrap();
        }

      }, this));
    },
    inlineFormat: function(tag)
    {
      this.selectionSave();

      this.document.execCommand('fontSize', false, 4 );

      var fonts = this.$editor.find('font');
      var last;
      $.each(fonts, function(i, s)
      {
        var el = $('<' + tag + '/>').append($(s).contents());
        $(s).replaceWith(el);
        last = el;
      });

      this.selectionRestore();

      this.sync();
    },
    inlineRemoveFormat: function(tag)
    {
      this.selectionSave();

      var utag = tag.toUpperCase();
      var nodes = this.getNodes();
      var parent = $(this.getParent()).parent();

      $.each(nodes, function(i, s)
      {
        if (s.tagName === utag) this.inlineRemoveFormatReplace(s);
      });

      if (parent && parent[0].tagName === utag) this.inlineRemoveFormatReplace(parent);

      this.selectionRestore();
      this.sync();
    },
    inlineRemoveFormatReplace: function(el)
    {
      $(el).replaceWith($(el).contents());
    },


    // INSERT
    insertHtml: function (html, sync)
    {
      var current = this.getCurrent();
      var parent = current.parentNode;

      this.focusWithSaveScroll();

      this.bufferSet();

      var $html = $('<div>').append($.parseHTML(html));
      html = $html.html();

      html = this.cleanRemoveEmptyTags(html);

      // Update value
      $html = $('<div>').append($.parseHTML(html));
      var currBlock = this.getBlock();

      if ($html.contents().length == 1)
      {
        var htmlTagName = $html.contents()[0].tagName;

        // If the inserted and received text tags match
        if (htmlTagName != 'P' && htmlTagName == currBlock.tagName || htmlTagName == 'PRE')
        {
          //html = $html.html();
          $html = $('<div>').append(html);
        }
      }

      if (this.opts.linebreaks)
      {
        html = html.replace(/<p(.*?)>([\w\W]*?)<\/p>/gi, '$2<br>');
      }

      // add text in a paragraph
      if (!this.opts.linebreaks && $html.contents().length == 1 && $html.contents()[0].nodeType == 3
        && (this.getRangeSelectedNodes().length > 2 || (!current || current.tagName == 'BODY' && !parent || parent.tagName == 'HTML')))
      {
        html = '<p>' + html + '</p>';
      }

      html = this.setSpansVerifiedHtml(html);

      if ($html.contents().length > 1 && currBlock
      || $html.contents().is('p, :header, ul, ol, li, div, table, td, blockquote, pre, address, section, header, footer, aside, article'))
      {
        if (this.browser('msie'))
        {
          if (!this.isIe11())
          {
            this.document.selection.createRange().pasteHTML(html);
          }
          else
          {
            this.execPasteFrag(html);
          }
        }
        else
        {
          this.document.execCommand('inserthtml', false, html);
        }
      }
      else this.insertHtmlAdvanced(html, false);

      if (this.selectall)
      {
        this.window.setTimeout($.proxy(function()
        {
          if (!this.opts.linebreaks) this.selectionEnd(this.$editor.contents().last());
          else this.focusEnd();

        }, this), 1);
      }

      this.observeStart();

      // set no editable
      this.setNonEditable();

      if (sync !== false) this.sync();
    },
    insertHtmlAdvanced: function(html, sync)
    {
      html = this.setSpansVerifiedHtml(html);

      var sel = this.getSelection();

      if (sel.getRangeAt && sel.rangeCount)
      {
        var range = sel.getRangeAt(0);
        range.deleteContents();

        var el = document.createElement('div');
        el.innerHTML = html;
        var frag = document.createDocumentFragment(), node, lastNode;
        while ((node = el.firstChild))
        {
          lastNode = frag.appendChild(node);
        }

        range.insertNode(frag);

        if (lastNode)
        {
          range = range.cloneRange();
          range.setStartAfter(lastNode);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }

      if (sync !== false)
      {
        this.sync();
      }

    },
    insertBeforeCursor: function(html)
    {
      html = this.setSpansVerifiedHtml(html);

      var node = $(html);

      var space = document.createElement("span");
      space.innerHTML = "\u200B";

      var range = this.getRange();
      range.insertNode(space);
      range.insertNode(node[0]);
      range.collapse(false);

      var sel = this.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);

      this.sync();
    },
    insertText: function(html)
    {
      var $html = $($.parseHTML(html));

      if ($html.length) html = $html.text();

      this.focusWithSaveScroll();

      if (this.browser('msie'))
      {
        if (!this.isIe11())
        {
          this.document.selection.createRange().pasteHTML(html);
        }
        else
        {
          this.execPasteFrag(html);
        }
      }
      else
      {
        this.document.execCommand('inserthtml', false, html);
      }

      this.sync();
    },
    insertNode: function(node)
    {
      node = node[0] || node;

      if (node.tagName == 'SPAN')
      {
        var replacementTag = 'inline';

          var outer = node.outerHTML;

          // Replace opening tag
          var regex = new RegExp('<' + node.tagName, 'i');
          var newTag = outer.replace(regex, '<' + replacementTag);

          // Replace closing tag
          regex = new RegExp('</' + node.tagName, 'i');
          newTag = newTag.replace(regex, '</' + replacementTag);
          node = $(newTag)[0];
      }

      var sel = this.getSelection();
      if (sel.getRangeAt && sel.rangeCount)
      {
        // with delete contents
        range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(node);
        range.setEndAfter(node);
        range.setStartAfter(node);
        sel.removeAllRanges();
        sel.addRange(range);
      }

      return node;
    },
    insertNodeToCaretPositionFromPoint: function(e, node)
    {
      var range;
      var x = e.clientX, y = e.clientY;
      if (this.document.caretPositionFromPoint)
      {
          var pos = this.document.caretPositionFromPoint(x, y);
          range = this.getRange();
          range.setStart(pos.offsetNode, pos.offset);
          range.collapse(true);
          range.insertNode(node);
      }
      else if (this.document.caretRangeFromPoint)
      {
          range = this.document.caretRangeFromPoint(x, y);
          range.insertNode(node);
      }
      else if (typeof document.body.createTextRange != "undefined")
      {
            range = this.document.body.createTextRange();
            range.moveToPoint(x, y);
            var endRange = range.duplicate();
            endRange.moveToPoint(x, y);
            range.setEndPoint("EndToEnd", endRange);
            range.select();
      }

    },
    insertAfterLastElement: function(element, parent)
    {
      if (typeof(parent) != 'undefined') element = parent;

      if (this.isEndOfElement())
      {
        if (this.opts.linebreaks)
        {
          var contents = $('<div>').append($.trim(this.$editor.html())).contents();
          var last = contents.last()[0];
          if (last.tagName == 'SPAN' && last.innerHTML == '')
          {
            last = contents.prev()[0];
          }

          if (this.outerHtml(last) != this.outerHtml(element))
          {
            return false;
          }
        }
        else
        {
          if (this.$editor.contents().last()[0] !== element)
          {
            return false;
          }
        }

        this.insertingAfterLastElement(element);
      }
    },
    insertingAfterLastElement: function(element)
    {
      this.bufferSet();

      if (this.opts.linebreaks === false)
      {
        var node = $(this.opts.emptyHtml);
        $(element).after(node);
        this.selectionStart(node);
      }
      else
      {
        var node = $('<span id="selection-marker-1">' + this.opts.invisibleSpace + '</span>', this.document)[0];
        $(element).after(node);
        $(node).after(this.opts.invisibleSpace);
        this.selectionRestore();
        this.$editor.find('span#selection-marker-1').removeAttr('id');
      }
    },
    insertLineBreak: function(twice)
    {
      this.selectionSave();

      var br = '<br>';
      if (twice == true)
      {
        br = '<br><br>';
      }

      if (this.browser('mozilla'))
      {
        var span = $('<span>').html(this.opts.invisibleSpace);
        this.$editor.find('#selection-marker-1').before(br).before(span).before(this.opts.invisibleSpace);

        this.setCaretAfter(span[0]);
        span.remove();

        this.selectionRemoveMarkers();
      }
      else
      {
        var parent = this.getParent();
        if (parent && parent.tagName === 'A')
        {
          var offset = this.getCaretOffset(parent);

          var text = $.trim($(parent).text()).replace(/\n\r\n/g, '');
          var len = text.length;

          if (offset == len)
          {
            this.selectionRemoveMarkers();

            var node = $('<span id="selection-marker-1">' + this.opts.invisibleSpace + '</span>', this.document)[0];
            $(parent).after(node);
            $(node).before(br + (this.browser('webkit') ? this.opts.invisibleSpace : ''));
            this.selectionRestore();

            return true;
          }

        }

        this.$editor.find('#selection-marker-1').before(br + (this.browser('webkit') ? this.opts.invisibleSpace : ''));
        this.selectionRestore();
      }
    },
    insertDoubleLineBreak: function()
    {
      this.insertLineBreak(true);
    },
    replaceLineBreak: function(element)
    {
      var node = $('<br>' + this.opts.invisibleSpace);
      $(element).replaceWith(node);
      this.selectionStart(node);
    },

    // PASTE
    pasteClean: function(html)
    {
      html = this.callback('pasteBefore', false, html);

      // ie10 fix paste links
      if (this.browser('msie'))
      {
        var tmp = $.trim(html);
        if (tmp.search(/^<a(.*?)>(.*?)<\/a>$/i) == 0)
        {
          html = html.replace(/^<a(.*?)>(.*?)<\/a>$/i, "$2");
        }
      }

      if (this.opts.pastePlainText)
      {
        var tmp = this.document.createElement('div');

        html = html.replace(/<br>|<\/H[1-6]>|<\/p>|<\/div>/gi, '\n');

        tmp.innerHTML = html;
        html = tmp.textContent || tmp.innerText;

        html = $.trim(html);
        html = html.replace('\n', '<br>');
        html = this.cleanParagraphy(html);

        this.pasteInsert(html);
        return false;
      }

      // clean up table
      var tablePaste = false;
      if (this.currentOrParentIs('TD'))
      {
        tablePaste = true;
        var blocksElems = this.opts.blockLevelElements;
        blocksElems.push('tr');
        blocksElems.push('table');
        $.each(blocksElems, function(i,s)
        {
          html = html.replace(new RegExp('<' + s + '(.*?)>', 'gi'), '');
          html = html.replace(new RegExp('</' + s + '>', 'gi'), '<br>');
        });
      }

      // clean up pre
      if (this.currentOrParentIs('PRE'))
      {
        html = this.pastePre(html);
        this.pasteInsert(html);
        return true;
      }

      // ms words shapes
      html = html.replace(/<img(.*?)v:shapes=(.*?)>/gi, '');

      // ms word list
      html = html.replace(/<p(.*?)class="MsoListParagraphCxSpFirst"([\w\W]*?)<\/p>/gi, '<ul><li$2</li>');
      html = html.replace(/<p(.*?)class="MsoListParagraphCxSpMiddle"([\w\W]*?)<\/p>/gi, '<li$2</li>');
      html = html.replace(/<p(.*?)class="MsoListParagraphCxSpLast"([\w\W]*?)<\/p>/gi, '<li$2</li></ul>');
      // one line
      html = html.replace(/<p(.*?)class="MsoListParagraph"([\w\W]*?)<\/p>/gi, '<ul><li$2</li></ul>');
      // remove ms word's bullet
      html = html.replace(/·/g, '');

      // remove comments and php tags
      html = html.replace(/<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi, '');

      // remove nbsp
      if (this.opts.cleanSpaces === true)
      {
        html = html.replace(/(&nbsp;){2,}/gi, '&nbsp;');
        html = html.replace(/&nbsp;/gi, ' ');
      }

      // remove google docs marker
      html = html.replace(/<b\sid="internal-source-marker(.*?)">([\w\W]*?)<\/b>/gi, "$2");
      html = html.replace(/<b(.*?)id="docs-internal-guid(.*?)">([\w\W]*?)<\/b>/gi, "$3");


      html = html.replace(/<span[^>]*(font-style: italic; font-weight: bold|font-weight: bold; font-style: italic)[^>]*>/gi, '<span style="font-weight: bold;"><span style="font-style: italic;">');
      html = html.replace(/<span[^>]*font-style: italic[^>]*>/gi, '<span style="font-style: italic;">');
      html = html.replace(/<span[^>]*font-weight: bold[^>]*>/gi, '<span style="font-weight: bold;">');
      html = html.replace(/<span[^>]*text-decoration: underline[^>]*>/gi, '<span style="text-decoration: underline;">');

      // strip tags
      //html = this.cleanStripTags(html);



      // prevert
      html = html.replace(/<td>\u200b*<\/td>/gi, '[td]');
      html = html.replace(/<td>&nbsp;<\/td>/gi, '[td]');
      html = html.replace(/<td><br><\/td>/gi, '[td]');
      html = html.replace(/<td(.*?)colspan="(.*?)"(.*?)>([\w\W]*?)<\/td>/gi, '[td colspan="$2"]$4[/td]');
      html = html.replace(/<td(.*?)rowspan="(.*?)"(.*?)>([\w\W]*?)<\/td>/gi, '[td rowspan="$2"]$4[/td]');
      html = html.replace(/<a(.*?)href="(.*?)"(.*?)>([\w\W]*?)<\/a>/gi, '[a href="$2"]$4[/a]');
      html = html.replace(/<iframe(.*?)>([\w\W]*?)<\/iframe>/gi, '[iframe$1]$2[/iframe]');
      html = html.replace(/<video(.*?)>([\w\W]*?)<\/video>/gi, '[video$1]$2[/video]');
      html = html.replace(/<audio(.*?)>([\w\W]*?)<\/audio>/gi, '[audio$1]$2[/audio]');
      html = html.replace(/<embed(.*?)>([\w\W]*?)<\/embed>/gi, '[embed$1]$2[/embed]');
      html = html.replace(/<object(.*?)>([\w\W]*?)<\/object>/gi, '[object$1]$2[/object]');
      html = html.replace(/<param(.*?)>/gi, '[param$1]');

      html = html.replace(/<img(.*?)>/gi, '[img$1]');

      // remove classes
      html = html.replace(/ class="(.*?)"/gi, '');

      // remove all attributes
      html = html.replace(/<(\w+)([\w\W]*?)>/gi, '<$1>');

      // remove empty
      if (this.opts.linebreaks)
      {
        // prevent double linebreaks when an empty line in RTF has bold or underlined formatting associated with it
        html = html.replace(/<strong><\/strong>/gi, '');
        html = html.replace(/<u><\/u>/gi, '');

        if (this.opts.cleanFontTag)
        {
          html = html.replace(/<font(.*?)>([\w\W]*?)<\/font>/gi, '$2');
        }

        html = html.replace(/<[^\/>][^>]*>(\s*|\t*|\n*|&nbsp;|<br>)<\/[^>]+>/gi, '<br>');
      }
      else
      {
        html = html.replace(/<[^\/>][^>]*>(\s*|\t*|\n*|&nbsp;|<br>)<\/[^>]+>/gi, '');
      }

      html = html.replace(/<div>\s*?\t*?\n*?(<ul>|<ol>|<p>)/gi, '$1');

      // revert
      html = html.replace(/\[td colspan="(.*?)"\]([\w\W]*?)\[\/td\]/gi, '<td colspan="$1">$2</td>');
      html = html.replace(/\[td rowspan="(.*?)"\]([\w\W]*?)\[\/td\]/gi, '<td rowspan="$1">$2</td>');
      html = html.replace(/\[td\]/gi, '<td>&nbsp;</td>');
      html = html.replace(/\[a href="(.*?)"\]([\w\W]*?)\[\/a\]/gi, '<a href="$1">$2</a>');
      html = html.replace(/\[iframe(.*?)\]([\w\W]*?)\[\/iframe\]/gi, '<iframe$1>$2</iframe>');
      html = html.replace(/\[video(.*?)\]([\w\W]*?)\[\/video\]/gi, '<video$1>$2</video>');
      html = html.replace(/\[audio(.*?)\]([\w\W]*?)\[\/audio\]/gi, '<audio$1>$2</audio>');
      html = html.replace(/\[embed(.*?)\]([\w\W]*?)\[\/embed\]/gi, '<embed$1>$2</embed>');
      html = html.replace(/\[object(.*?)\]([\w\W]*?)\[\/object\]/gi, '<object$1>$2</object>');
      html = html.replace(/\[param(.*?)\]/gi, '<param$1>');
      html = html.replace(/\[img(.*?)\]/gi, '<img$1>');

      // convert div to p
      if (this.opts.convertDivs)
      {
        html = html.replace(/<div(.*?)>([\w\W]*?)<\/div>/gi, '<p>$2</p>');
        html = html.replace(/<\/div><p>/gi, '<p>');
        html = html.replace(/<\/p><\/div>/gi, '</p>');
        html = html.replace(/<p><\/p>/gi, '<br />');
      }
      else
      {
        html = html.replace(/<div><\/div>/gi, '<br />');
      }

      // strip tags
      html = this.cleanStripTags(html);

      if (this.currentOrParentIs('LI'))
      {
        html = html.replace(/<p>([\w\W]*?)<\/p>/gi, '$1<br>');
      }
      else if (tablePaste === false)
      {
        html = this.cleanParagraphy(html);
      }

      // remove span
      html = html.replace(/<span(.*?)>([\w\W]*?)<\/span>/gi, '$2');

      // remove empty
      html = html.replace(/<img>/gi, '');
      html = html.replace(/<[^\/>][^>][^img|param|source|td][^<]*>(\s*|\t*|\n*| |<br>)<\/[^>]+>/gi, '');

      html = html.replace(/\n{3,}/gi, '\n');

      // remove dirty p
      html = html.replace(/<p><p>/gi, '<p>');
      html = html.replace(/<\/p><\/p>/gi, '</p>');

      html = html.replace(/<li>(\s*|\t*|\n*)<p>/gi, '<li>');
      html = html.replace(/<\/p>(\s*|\t*|\n*)<\/li>/gi, '</li>');

      if (this.opts.linebreaks === true)
      {
        html = html.replace(/<p(.*?)>([\w\W]*?)<\/p>/gi, '$2<br>');
      }

      // remove empty finally
      html = html.replace(/<[^\/>][^>][^img|param|source|td][^<]*>(\s*|\t*|\n*| |<br>)<\/[^>]+>/gi, '');

      // remove safari local images
      html = html.replace(/<img src="webkit-fake-url\:\/\/(.*?)"(.*?)>/gi, '');

      // remove p in td
      html = html.replace(/<td(.*?)>(\s*|\t*|\n*)<p>([\w\W]*?)<\/p>(\s*|\t*|\n*)<\/td>/gi, '<td$1>$3</td>');

      // remove divs
      if (this.opts.convertDivs)
      {
        html = html.replace(/<div(.*?)>([\w\W]*?)<\/div>/gi, '$2');
        html = html.replace(/<div(.*?)>([\w\W]*?)<\/div>/gi, '$2');
      }

      // FF specific
      this.pasteClipboardMozilla = false;
      if (this.browser('mozilla'))
      {
        if (this.opts.clipboardUpload)
        {
          var matches = html.match(/<img src="data:image(.*?)"(.*?)>/gi);
          if (matches !== null)
          {
            this.pasteClipboardMozilla = matches;
            for (k in matches)
            {
              var img = matches[k].replace('<img', '<img data-mozilla-paste-image="' + k + '" ');
              html = html.replace(matches[k], img);
            }
          }
        }

        // FF fix
        while (/<br>$/gi.test(html))
        {
          html = html.replace(/<br>$/gi, '');
        }
      }

      // bullets again
      html = html.replace(/<p>•([\w\W]*?)<\/p>/gi, '<li>$1</li>');

      // ie inserts a blank font tags when pasting
      if (this.browser('msie'))
      {
        while (/<font>([\w\W]*?)<\/font>/gi.test(html))
        {
          html = html.replace(/<font>([\w\W]*?)<\/font>/gi, '$1');
        }
      }

      // remove table paragraphs
      if (tablePaste === false)
      {
        html = html.replace(/<td(.*?)>([\w\W]*?)<p(.*?)>([\w\W]*?)<\/td>/gi, '<td$1>$2$4</td>');
        html = html.replace(/<td(.*?)>([\w\W]*?)<\/p>([\w\W]*?)<\/td>/gi, '<td$1>$2$3</td>');
        html = html.replace(/<td(.*?)>([\w\W]*?)<p(.*?)>([\w\W]*?)<\/td>/gi, '<td$1>$2$4</td>');
        html = html.replace(/<td(.*?)>([\w\W]*?)<\/p>([\w\W]*?)<\/td>/gi, '<td$1>$2$3</td>');
      }

      // ms word break lines
      html = html.replace(/\n/g, ' ');

      // ms word lists break lines
      html = html.replace(/<p>\n?<li>/gi, '<li>');

      this.pasteInsert(html);

    },
    pastePre: function(s)
    {
      s = s.replace(/<br>|<\/H[1-6]>|<\/p>|<\/div>/gi, '\n');

      var tmp = this.document.createElement('div');
      tmp.innerHTML = s;
      return this.cleanEncodeEntities(tmp.textContent || tmp.innerText);
    },
    pasteInsert: function(html)
    {
      html = this.callback('pasteAfter', false, html);

      if (this.selectall)
      {
        this.$editor.html(html);
        this.selectionRemove();
        this.focusEnd();
        this.sync();
      }
      else
      {
        this.insertHtml(html);
      }

      this.selectall = false;

      setTimeout($.proxy(function()
      {
        this.rtePaste = false;

        // FF specific
        if (this.browser('mozilla'))
        {
          this.$editor.find('p:empty').remove()
        }
        if (this.pasteClipboardMozilla !== false)
        {
          this.pasteClipboardUploadMozilla();
        }

      }, this), 100);

      if (this.opts.autoresize && this.fullscreen !== true)
      {
        $(this.document.body).scrollTop(this.saveScroll);
      }
      else
      {
        this.$editor.scrollTop(this.saveScroll);
      }
    },
    pasteClipboardAppendFields: function(postData)
    {
      // append hidden fields
      if (this.opts.uploadFields !== false && typeof this.opts.uploadFields === 'object')
      {
        $.each(this.opts.uploadFields, $.proxy(function(k, v)
        {
          if (v != null && v.toString().indexOf('#') === 0) v = $(v).val();
          postData[k] = v;

        }, this));
      }

      return postData;
    },
    pasteClipboardUploadMozilla: function()
    {
      var imgs = this.$editor.find('img[data-mozilla-paste-image]');
      $.each(imgs, $.proxy(function(i,s)
      {
        var $s = $(s);
        var arr = s.src.split(",");
        var postData = {
          'contentType': arr[0].split(";")[0].split(":")[1],
          'data': arr[1] // raw base64
        };

        // append hidden fields
        postData = this.pasteClipboardAppendFields(postData);

        $.post(this.opts.clipboardUploadUrl, postData,
        $.proxy(function(data)
        {
          var json = (typeof data === 'string' ? $.parseJSON(data) : data);
              $s.attr('src', json.filelink);
              $s.removeAttr('data-mozilla-paste-image');

              this.sync();

          // upload callback
          this.callback('imageUpload', $s, json);

        }, this));

      }, this));
    },
    pasteClipboardUpload: function(e)
    {
          var result = e.target.result;
      var arr = result.split(",");
      var postData = {
        'contentType': arr[0].split(";")[0].split(":")[1],
        'data': arr[1] // raw base64
      };


      if (this.opts.clipboardUpload)
      {
        // append hidden fields
        postData = this.pasteClipboardAppendFields(postData);

        $.post(this.opts.clipboardUploadUrl, postData,
        $.proxy(function(data)
        {
          var json = (typeof data === 'string' ? $.parseJSON(data) : data);

          var html = '<img src="' + json.filelink + '" id="clipboard-image-marker" />';
          this.execCommand('inserthtml', html, false);

          var image = $(this.$editor.find('img#clipboard-image-marker'));

          if (image.length) image.removeAttr('id');
          else image = false;

          this.sync();

          // upload callback
          if (image)
          {
            this.callback('imageUpload', image, json);
          }


        }, this));
      }
      else
      {
            this.insertHtml('<img src="' + result + '" />');
          }
    },

    // BUFFER
    bufferSet: function(selectionSave)
    {
      if (selectionSave !== false)
      {
        this.selectionSave();
      }

      this.opts.buffer.push(this.$editor.html());

      if (selectionSave !== false)
      {
        this.selectionRemoveMarkers('buffer');
      }

    },
    bufferUndo: function()
    {
      if (this.opts.buffer.length === 0)
      {
        this.focusWithSaveScroll();
        return;
      }

      // rebuffer
      this.selectionSave();
      this.opts.rebuffer.push(this.$editor.html());
      this.selectionRestore(false, true);

      this.$editor.html(this.opts.buffer.pop());

      this.selectionRestore();
      setTimeout($.proxy(this.observeStart, this), 100);
    },
    bufferRedo: function()
    {
      if (this.opts.rebuffer.length === 0)
      {
        this.focusWithSaveScroll();
        return false;
      }

      // buffer
      this.selectionSave();
      this.opts.buffer.push(this.$editor.html());
      this.selectionRestore(false, true);

      this.$editor.html(this.opts.rebuffer.pop());
      this.selectionRestore(true);
      setTimeout($.proxy(this.observeStart, this), 4);
    },

    // OBSERVE
    observeStart: function()
    {
      this.observeImages();

      if (this.opts.observeLinks) this.observeLinks();
    },
    observeLinks: function()
    {
      this.$editor.find('a').on('click', $.proxy(this.linkObserver, this));

      this.$editor.on('click.redactor', $.proxy(function(e)
      {
        this.linkObserverTooltipClose(e);

      }, this));

      $(document).on('click.redactor', $.proxy(function(e)
      {
        this.linkObserverTooltipClose(e);

      }, this));
    },
    observeImages: function()
    {
      if (this.opts.observeImages === false) return false;

      this.$editor.find('img').each($.proxy(function(i, elem)
      {
        if (this.browser('msie')) $(elem).attr('unselectable', 'on');

        var parent = $(elem).parent();
        if (!parent.hasClass('royalSlider') && !parent.hasClass('fotorama'))
        {
          this.imageResize(elem);
        }

      }, this));

      // royalSlider and fotorama
      this.$editor.find('.fotorama, .royalSlider').on('click', $.proxy(this.editGallery, this));

    },
    linkObserver: function(e)
    {
      var $link = $(e.target);

      var parent = $(e.target).parent();
      if (parent.hasClass('royalSlider') || parent.hasClass('fotorama'))
      {
        return;
      }

      if ($link.size() == 0 || $link[0].tagName !== 'A') return;

      var pos = $link.offset();
      if (this.opts.iframe)
      {
        var posFrame = this.$frame.offset();
        pos.top = posFrame.top + (pos.top - $(this.document).scrollTop());
        pos.left += posFrame.left;
      }

      var tooltip = $('<span class="redactor-link-tooltip"></span>');

      var href = $link.attr('href');
      if (href === undefined)
      {
        href = '';
      }

      if (href.length > 24) href = href.substring(0, 24) + '...';

      var aLink = $('<a href="' + $link.attr('href') + '" target="_blank">' + href + '</a>').on('click', $.proxy(function(e)
      {
        this.linkObserverTooltipClose(false);
      }, this));

      var aEdit = $('<a href="#">' + this.opts.curLang.edit + '</a>').on('click', $.proxy(function(e)
      {
        e.preventDefault();
        this.linkShow();
        this.linkObserverTooltipClose(false);

      }, this));

      var aUnlink = $('<a href="#">' + this.opts.curLang.unlink + '</a>').on('click', $.proxy(function(e)
      {
        e.preventDefault();
        this.execCommand('unlink');
        this.linkObserverTooltipClose(false);

      }, this));


      tooltip.append(aLink);
      tooltip.append(' | ');
      tooltip.append(aEdit);
      tooltip.append(' | ');
      tooltip.append(aUnlink);
      tooltip.css({
        top: (pos.top + 20) + 'px',
        left: pos.left + 'px'
      });

      $('.redactor-link-tooltip').remove();
      $('body').append(tooltip);
    },
    linkObserverTooltipClose: function(e)
    {
      if (e !== false && e.target.tagName == 'A') return false;
      $('.redactor-link-tooltip').remove();
    },

    // SELECTION
    getSelection: function()
    {
      if (!this.opts.rangy) return this.document.getSelection();
      else // rangy
      {
        if (!this.opts.iframe) return rangy.getSelection();
        else return rangy.getSelection(this.$frame[0]);
      }
    },
    getRange: function()
    {
      if (!this.opts.rangy)
      {
        if (this.document.getSelection)
        {
          var sel = this.getSelection();
          if (sel.getRangeAt && sel.rangeCount) return sel.getRangeAt(0);
        }

        return this.document.createRange();
      }
      else // rangy
      {
        if (!this.opts.iframe) return rangy.createRange();
        else return rangy.createRange(this.iframeDoc());
      }
    },
    selectionElement: function(node)
    {
      this.setCaret(node);
    },
    selectionStart: function(node)
    {
      this.selectionSet(node[0] || node, 0, null, 0);
    },
    selectionEnd: function(node)
    {
      this.selectionSet(node[0] || node, 1, null, 1);
    },
    selectionSet: function(orgn, orgo, focn, foco)
    {
      if (focn == null) focn = orgn;
      if (foco == null) foco = orgo;

      var sel = this.getSelection();
      if (!sel) return;

      if (orgn.tagName == 'P' && orgn.innerHTML == '')
      {
        orgn.innerHTML = this.opts.invisibleSpace;
      }

      if (orgn.tagName == 'BR' && this.opts.linebreaks === false)
      {
        var par = $(this.opts.emptyHtml)[0];
        $(orgn).replaceWith(par);
        orgn = par;
        focn = orgn;
      }

      var range = this.getRange();
      range.setStart(orgn, orgo);
      range.setEnd(focn, foco );

      try {
        sel.removeAllRanges();
      } catch (e) {}

      sel.addRange(range);
    },
    selectionWrap: function(tag)
    {
      tag = tag.toLowerCase();

      var block = this.getBlock();
      if (block)
      {
        var wrapper = this.formatChangeTag(block, tag);
        this.sync();
        return wrapper;
      }

      var sel = this.getSelection();
      var range = sel.getRangeAt(0);
      var wrapper = document.createElement(tag);
      wrapper.appendChild(range.extractContents());
      range.insertNode(wrapper);

      this.selectionElement(wrapper);

      return wrapper;
    },
    selectionAll: function()
    {
      var range = this.getRange();
      range.selectNodeContents(this.$editor[0]);

      var sel = this.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    },
    selectionRemove: function()
    {
      this.getSelection().removeAllRanges();
    },
    getCaretOffset: function (element)
    {
      var caretOffset = 0;

      var range = this.getRange();
      var preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = $.trim(preCaretRange.toString()).length;

      return caretOffset;
    },
    getCaretOffsetRange: function()
    {
      return new Range(this.getSelection().getRangeAt(0));
    },
    setCaret: function (el, start, end)
    {
      if (typeof end === 'undefined') end = start;
      el = el[0] || el;

      var range = this.getRange();
      range.selectNodeContents(el);

      var textNodes = this.getTextNodesIn(el);
      var foundStart = false;
      var charCount = 0, endCharCount;

      if (textNodes.length == 1 && start)
      {
        range.setStart(textNodes[0], start);
        range.setEnd(textNodes[0], end);
      }
      else
      {
        for (var i = 0, textNode; textNode = textNodes[i++];)
        {
          endCharCount = charCount + textNode.length;
          if (!foundStart && start >= charCount && (start < endCharCount || (start == endCharCount && i < textNodes.length)))
          {
            range.setStart(textNode, start - charCount);
            foundStart = true;
          }

          if (foundStart && end <= endCharCount)
          {
            range.setEnd( textNode, end - charCount );
            break;
          }

          charCount = endCharCount;
        }
      }

      var sel = this.getSelection();
      sel.removeAllRanges();
      sel.addRange( range );
    },
    setCaretAfter: function(node)
    {
      this.$editor.focus();

      node = node[0] || node;

      var range = this.document.createRange()

      var start = 1;
      var end = -1;

      range.setStart(node, start)
      range.setEnd(node, end + 2)


      var selection = this.window.getSelection()
      var cursorRange = this.document.createRange()

      var emptyElement = this.document.createTextNode('\u200B')
      $(node).after(emptyElement)

      cursorRange.setStartAfter(emptyElement)

      selection.removeAllRanges()
      selection.addRange(cursorRange)
      $(emptyElement).remove();
    },
    getTextNodesIn: function (node)
    {
      var textNodes = [];

      if (node.nodeType == 3) textNodes.push(node);
      else
      {
        var children = node.childNodes;
        for (var i = 0, len = children.length; i < len; ++i)
        {
          textNodes.push.apply(textNodes, this.getTextNodesIn(children[i]));
        }
      }

      return textNodes;
    },

    // GET ELEMENTS
    getCurrent: function()
    {
      var el = false;
      var sel = this.getSelection();

      if (sel && sel.rangeCount > 0)
      {
        el = sel.getRangeAt(0).startContainer;
        //el = sel.getRangeAt(0).commonAncestorContainer;
      }

      return this.isParentRedactor(el);
    },
    getParent: function(elem)
    {
      elem = elem || this.getCurrent();
      if (elem) return this.isParentRedactor( $( elem ).parent()[0] );
      else return false;
    },
    getBlock: function(node)
    {
      if (typeof node === 'undefined') node = this.getCurrent();

      while (node)
      {
        if (this.nodeTestBlocks(node))
        {
          if ($(node).hasClass('redactor_editor')) return false;
          return node;
        }

        node = node.parentNode;
      }

      return false;
    },
    getBlocks: function(nodes)
    {
      var newnodes = [];
      if (typeof nodes == 'undefined')
      {
        var range = this.getRange();
        if (range && range.collapsed === true) return [this.getBlock()];
        var nodes = this.getNodes(range);
      }

      $.each(nodes, $.proxy(function(i,node)
      {
        if (this.opts.iframe === false && $(node).parents('div.redactor_editor').size() == 0) return false;
        if (this.nodeTestBlocks(node)) newnodes.push(node);

      }, this));

      if (newnodes.length === 0) newnodes = [this.getBlock()];

      return newnodes;
    },
    isInlineNode: function(node)
    {
      if (node.nodeType != 1) return false;

      return !this.rTestBlock.test(node.nodeName);
    },
    nodeTestBlocks: function(node)
    {
      return node.nodeType == 1 && this.rTestBlock.test(node.nodeName);
    },
    tagTestBlock: function(tag)
    {
      return this.rTestBlock.test(tag);
    },
    getNodes: function(range, tag)
    {
      if (typeof range == 'undefined' || range == false) var range = this.getRange();
      if (range && range.collapsed === true)
      {
        if (typeof tag === 'undefined' && this.tagTestBlock(tag))
        {
          var block = this.getBlock();
          if (block.tagName == tag) return [block];
          else return [];
        }
        else
        {
          return [this.getCurrent()];
        }
      }

      var nodes = [], finalnodes = [];

      var sel = this.document.getSelection();
      if (!sel.isCollapsed) nodes = this.getRangeSelectedNodes(sel.getRangeAt(0));

      $.each(nodes, $.proxy(function(i,node)
      {
        if (this.opts.iframe === false && $(node).parents('div.redactor_editor').size() == 0) return false;

        if (typeof tag === 'undefined')
        {
          if ($.trim(node.textContent) != '')
          {
            finalnodes.push(node);
          }
        }
        else if (node.tagName == tag)
        {
          finalnodes.push(node);
        }

      }, this));

      if (finalnodes.length == 0)
      {
        if (typeof tag === 'undefined' && this.tagTestBlock(tag))
        {
          var block = this.getBlock();
          if (block.tagName == tag) return finalnodes.push(block);
          else return [];
        }
        else
        {
          finalnodes.push(this.getCurrent());
        }
      }

      // last element filtering
      var last = finalnodes[finalnodes.length-1];
      if (this.nodeTestBlocks(last))
      {
        finalnodes = finalnodes.slice(0, -1);
      }

      return finalnodes;
    },
    getElement: function(node)
    {
      if (!node) node = this.getCurrent();
      while (node)
      {
        if (node.nodeType == 1)
        {
          if ($(node).hasClass('redactor_editor')) return false;
          return node;
        }

        node = node.parentNode;
      }

      return false;
    },
    getRangeSelectedNodes: function(range)
    {
      range = range || this.getRange();
      var node = range.startContainer;
      var endNode = range.endContainer;

      if (node == endNode) return [node];

      var rangeNodes = [];
      while (node && node != endNode)
      {
        rangeNodes.push(node = this.nextNode(node));
      }

      node = range.startContainer;
      while (node && node != range.commonAncestorContainer)
      {
        rangeNodes.unshift(node);
        node = node.parentNode;
      }

      return rangeNodes;
    },
    nextNode: function(node)
    {
      if (node.hasChildNodes()) return node.firstChild;
      else
      {
        while (node && !node.nextSibling)
        {
          node = node.parentNode;
        }

        if (!node) return null;
        return node.nextSibling;
      }
    },

    // GET SELECTION HTML OR TEXT
    getSelectionText: function()
    {
      return this.getSelection().toString();
    },
    getSelectionHtml: function()
    {
      var html = '';

      var sel = this.getSelection();
      if (sel.rangeCount)
      {
        var container = this.document.createElement( "div" );
        var len = sel.rangeCount;
        for (var i = 0; i < len; ++i)
        {
          container.appendChild(sel.getRangeAt(i).cloneContents());
        }

        html = container.innerHTML;
      }

      return this.syncClean(html);
    },

    // SAVE & RESTORE
    selectionSave: function()
    {
      if (!this.isFocused())
      {
        this.focusWithSaveScroll();
      }

      if (!this.opts.rangy)
      {
        this.selectionCreateMarker(this.getRange());
      }
      // rangy
      else
      {
        this.savedSel = rangy.saveSelection();
      }
    },
    selectionCreateMarker: function(range, remove)
    {
      if (!range) return;

      var node1 = $('<span id="selection-marker-1" class="redactor-selection-marker">' + this.opts.invisibleSpace + '</span>', this.document)[0];
      var node2 = $('<span id="selection-marker-2" class="redactor-selection-marker">' + this.opts.invisibleSpace + '</span>', this.document)[0];

      if (range.collapsed === true)
      {
        this.selectionSetMarker(range, node1, true);
      }
      else
      {
        this.selectionSetMarker(range, node1, true);
        this.selectionSetMarker(range, node2, false);
      }

      this.savedSel = this.$editor.html();

      this.selectionRestore(false, false);
    },
    selectionSetMarker: function(range, node, type)
    {
      var boundaryRange = range.cloneRange();

      try {
        boundaryRange.collapse(type);
        boundaryRange.insertNode(node);
        boundaryRange.detach();
      }
      catch (e)
      {
        var html = this.opts.emptyHtml;
        if (this.opts.linebreaks) html = '<br>';

        this.$editor.prepend(html);
        this.focus();
      }
    },
    selectionRestore: function(replace, remove)
    {
      if (!this.opts.rangy)
      {
        if (replace === true && this.savedSel)
        {
          this.$editor.html(this.savedSel);
        }

        var node1 = this.$editor.find('span#selection-marker-1');
        var node2 = this.$editor.find('span#selection-marker-2');

        if (this.browser('mozilla'))
        {
          this.$editor.focus();
        }
        else if (!this.isFocused())
        {
          this.focusWithSaveScroll();
        }

        if (node1.length != 0 && node2.length != 0)
        {

          this.selectionSet(node1[0], 0, node2[0], 0);
        }
        else if (node1.length != 0)
        {
          this.selectionSet(node1[0], 0, null, 0);
        }

        if (remove !== false)
        {
          this.selectionRemoveMarkers();
          this.savedSel = false;
        }
      }
      // rangy
      else
      {
        rangy.restoreSelection(this.savedSel);
      }
    },
    selectionRemoveMarkers: function(type)
    {
      if (!this.opts.rangy)
      {
        $.each(this.$editor.find('span.redactor-selection-marker'), function()
        {
          var html = $.trim($(this).html().replace(/[^\u0000-\u1C7F]/g, ''));
          if (html == '')
          {
            $(this).remove();
          }
          else
          {
            $(this).removeAttr('class').removeAttr('id');
          }
        });
      }
      // rangy
      else
      {
        rangy.removeMarkers(this.savedSel);
      }
    },

    // TABLE
    tableShow: function()
    {
      this.selectionSave();

      this.modalInit(this.opts.curLang.table, this.opts.modal_table, 300, $.proxy(function()
      {
        $('#redactor_insert_table_btn').click($.proxy(this.tableInsert, this));

        setTimeout(function()
        {
          $('#redactor_table_rows').focus();

        }, 200);

      }, this));
    },
    tableInsert: function()
    {
      this.bufferSet(false);

      var rows = $('#redactor_table_rows').val(),
        columns = $('#redactor_table_columns').val(),
        $table_box = $('<div></div>'),
        tableId = Math.floor(Math.random() * 99999),
        $table = $('<table id="table' + tableId + '"><tbody></tbody></table>'),
        i, $row, z, $column;

      for (i = 0; i < rows; i++)
      {
        $row = $('<tr></tr>');

        for (z = 0; z < columns; z++)
        {
          $column = $('<td>' + this.opts.invisibleSpace + '</td>');

          // set the focus to the first td
          if (i === 0 && z === 0)
          {
            $column.append('<span id="selection-marker-1">' + this.opts.invisibleSpace + '</span>');
          }

          $($row).append($column);
        }

        $table.append($row);
      }

      $table_box.append($table);
      var html = $table_box.html();

      if (this.opts.linebreaks === false && this.browser('mozilla'))
      {
        html += '<p>' + this.opts.invisibleSpace + '</p>';
      }

      this.modalClose();
      this.selectionRestore();

      var current = this.getBlock() || this.getCurrent();

      if (current && current.tagName != 'BODY')
      {
        if (current.tagName == 'LI')
        {
          var current = $(current).closest('ul, ol');
        }

        $(current).after(html)
      }
      else
      {

        this.insertHtmlAdvanced(html, false);
      }

      this.selectionRestore();

      var table = this.$editor.find('#table' + tableId);
      this.buttonActiveObserver();

      table.find('span#selection-marker-1, inline#selection-marker-1').remove();
      table.removeAttr('id');

      this.sync();
    },
    tableDeleteTable: function()
    {
      var $table = $(this.getParent()).closest('table');
      if (!this.isParentRedactor($table)) return false;
      if ($table.size() == 0) return false;

      this.bufferSet();

      $table.remove();
      this.sync();
    },
    tableDeleteRow: function()
    {
      var parent = this.getParent();
      var $table = $(parent).closest('table');


      if (!this.isParentRedactor($table)) return false;
      if ($table.size() == 0) return false;

      this.bufferSet();

      var $current_tr = $(parent).closest('tr');
      var $focus_tr = $current_tr.prev().length ? $current_tr.prev() : $current_tr.next();
      if ($focus_tr.length)
      {
        var $focus_td = $focus_tr.children('td' ).first();
        if ($focus_td.length)
        {
          $focus_td.prepend('<span id="selection-marker-1">' + this.opts.invisibleSpace + '</span>');
        }
      }

      $current_tr.remove();
      this.selectionRestore();
      $table.find('span#selection-marker-1').remove();
      this.sync();
    },
    tableDeleteColumn: function()
    {
      var parent = this.getParent();
      var $table = $(parent).closest('table');

      if (!this.isParentRedactor($table)) return false;
      if ($table.size() == 0) return false;

      this.bufferSet();

      var $current_td = $(parent).closest('td');
      if (!($current_td.is('td')))
      {
        $current_td = $current_td.closest('td');
      }

      var index = $current_td.get(0).cellIndex;

      // Set the focus correctly
      $table.find('tr').each($.proxy(function(i, elem)
      {
        var focusIndex = index - 1 < 0 ? index + 1 : index - 1;
        if (i === 0)
        {
          $(elem).find('td').eq(focusIndex).prepend('<span id="selection-marker-1">' + this.opts.invisibleSpace + '</span>');
        }

        $(elem).find('td').eq(index).remove();

      }, this));

      this.selectionRestore();
      $table.find('span#selection-marker-1').remove();
      this.sync();
    },
    tableAddHead: function()
    {
      var $table = $(this.getParent()).closest('table');
      if (!this.isParentRedactor($table)) return false;
      if ($table.size() == 0) return false;

      this.bufferSet();

      if ($table.find('thead').size() !== 0) this.tableDeleteHead();
      else
      {
        var tr = $table.find('tr').first().clone();
        tr.find('td').html(this.opts.invisibleSpace);
        $thead = $('<thead></thead>');
        $thead.append(tr);
        $table.prepend($thead);

        this.sync();
      }
    },
    tableDeleteHead: function()
    {
      var $table = $(this.getParent()).closest('table');
      if (!this.isParentRedactor($table)) return false;
      var $thead = $table.find('thead');

      if ($thead.size() == 0) return false;

      this.bufferSet();

      $thead.remove();
      this.sync();
    },
    tableAddRowAbove: function()
    {
      this.tableAddRow('before');
    },
    tableAddRowBelow: function()
    {
      this.tableAddRow('after');
    },
    tableAddColumnLeft: function()
    {
      this.tableAddColumn('before');
    },
    tableAddColumnRight: function()
    {
      this.tableAddColumn('after');
    },
    tableAddRow: function(type)
    {
      var $table = $(this.getParent()).closest('table');
      if (!this.isParentRedactor($table)) return false;
      if ($table.size() == 0) return false;

      this.bufferSet();

      var $current_tr = $(this.getParent()).closest('tr');
      var new_tr = $current_tr.clone();
      new_tr.find('td').html(this.opts.invisibleSpace);

      if (type === 'after') $current_tr.after(new_tr);
      else $current_tr.before(new_tr);

      this.sync();
    },
    tableAddColumn: function (type)
    {
      var parent = this.getParent();
      var $table = $(parent).closest('table');

      if (!this.isParentRedactor($table)) return false;
      if ($table.size() == 0) return false;

      this.bufferSet();

      var index = 0;

      var current = this.getCurrent();
      var $current_tr = $(current).closest('tr');
      var $current_td =  $(current).closest('td');

      $current_tr.find('td').each($.proxy(function(i, elem)
      {
        if ($(elem)[0] === $current_td[0]) index = i;

      }, this));

      $table.find('tr').each($.proxy(function(i, elem)
      {
        var $current = $(elem).find('td').eq(index);

        var td = $current.clone();
        td.html(this.opts.invisibleSpace);

        type === 'after' ? $current.after(td) : $current.before(td);

      }, this));

      this.sync();
    },

    // VIDEO
    videoShow: function()
    {
      this.selectionSave();

      this.modalInit(this.opts.curLang.video, this.opts.modal_video, 600, $.proxy(function()
      {
        $('#redactor_insert_video_btn').click($.proxy(this.videoInsert, this));

        setTimeout(function()
        {
          $('#redactor_insert_video_area').focus();

        }, 200);

      }, this));
    },
    videoInsert: function ()
    {
      var data = $('#redactor_insert_video_area').val();
      data = this.cleanStripTags(data);

      // parse if it is link on youtube & vimeo
      var iframeStart = '<iframe width="500" height="281" src="',
        iframeEnd = '" frameborder="0" allowfullscreen></iframe>';

      if (data.match(reUrlYoutube))
      {
        data = data.replace(reUrlYoutube, iframeStart + '//www.youtube.com/embed/$1' + iframeEnd);
      }
      else if (data.match(reUrlVimeo))
      {
        data = data.replace(reUrlVimeo, iframeStart + '//player.vimeo.com/video/$2' + iframeEnd);
      }

      this.selectionRestore();

      var current = this.getBlock() || this.getCurrent();

      if (current) $(current).after(data)
      else this.insertHtmlAdvanced(data, false);

      this.sync();
      this.modalClose();
    },


    // LINK
    linkShow: function()
    {
      this.selectionSave();

      var callback = $.proxy(function()
      {
        // Predefined links
        if (this.opts.predefinedLinks !== false)
        {
          this.predefinedLinksStorage = {};
          var that = this;
          $.getJSON(this.opts.predefinedLinks, function(data)
          {
            var $select = $('#redactor-predefined-links');
            $select .html('');
            $.each(data, function(key, val)
            {
              that.predefinedLinksStorage[key] = val;
              $select.append($('<option>').val(key).html(val.name));
            });

            $select.on('change', function()
            {
              var key = $(this).val();
              var name = '', url = '';
              if (key != 0)
              {
                name = that.predefinedLinksStorage[key].name;
                url = that.predefinedLinksStorage[key].url;
              }

              $('#redactor_link_url').val(url);
              $('#redactor_link_url_text').val(name);

            });

            $select.show();
          });
        }

        this.insert_link_node = false;

        var sel = this.getSelection();
        var url = '', text = '', target = '';

        var elem = this.getParent();
        var par = $(elem).parent().get(0);
        if (par && par.tagName === 'A')
        {
          elem = par;
        }

        if (elem && elem.tagName === 'A')
        {
          url = elem.href;
          text = $(elem).text();
          target = elem.target;

          this.insert_link_node = elem;
        }
        else text = sel.toString();

        $('#redactor_link_url_text').val(text);

        var thref = self.location.href.replace(/\/$/i, '');
        url = url.replace(thref, '');
        url = url.replace(/^\/#/, '#');
        url = url.replace('mailto:', '');

        // remove host from href
        if (this.opts.linkProtocol === false)
        {
          var re = new RegExp('^(http|ftp|https)://' + self.location.host, 'i');
          url = url.replace(re, '');
        }

        // set url
        $('#redactor_link_url').val(url);

        if (target === '_blank')
        {
          $('#redactor_link_blank').prop('checked', true);
        }

        this.linkInsertPressed = false;
        $('#redactor_insert_link_btn').on('click', $.proxy(this.linkProcess, this));


        setTimeout(function()
        {
          $('#redactor_link_url').focus();

        }, 200);

      }, this);

      this.modalInit(this.opts.curLang.link, this.opts.modal_link, 460, callback);

    },
    linkProcess: function()
    {
      if (this.linkInsertPressed)
      {
        return;
      }

      this.linkInsertPressed = true;
      var target = '', targetBlank = '';

      var link = $('#redactor_link_url').val();
      var text = $('#redactor_link_url_text').val();

      // mailto
      if (link.search('@') != -1 && /(http|ftp|https):\/\//i.test(link) === false)
      {
        link = 'mailto:' + link;
      }
      // url, not anchor
      else if (link.search('#') != 0)
      {
        if ($('#redactor_link_blank').prop('checked'))
        {
          target = ' target="_blank"';
          targetBlank = '_blank';
        }

        // test url (add protocol)
        var pattern = '((xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}';
        var re = new RegExp('^(http|ftp|https)://' + pattern, 'i');
        var re2 = new RegExp('^' + pattern, 'i');

        if (link.search(re) == -1 && link.search(re2) == 0 && this.opts.linkProtocol)
        {
          link = this.opts.linkProtocol + link;
        }
      }

      text = text.replace(/<|>/g, '');
      var extra = '&nbsp;';
      if (this.browser('mozilla'))
      {
        extra = '&nbsp;';
      }

      this.linkInsert('<a href="' + link + '"' + target + '>' + text + '</a>' + extra, $.trim(text), link, targetBlank);

    },
    linkInsert: function (a, text, link, target)
    {
      this.selectionRestore();

      if (text !== '')
      {
        if (this.insert_link_node)
        {
          this.bufferSet();

          $(this.insert_link_node).text(text).attr('href', link);

          if (target !== '')
          {
            $(this.insert_link_node).attr('target', target);
          }
          else
          {
            $(this.insert_link_node).removeAttr('target');
          }
        }
        else
        {
          var $a = $(a).addClass('redactor-added-link');
          this.exec('inserthtml', this.outerHtml($a), false);

          var link = this.$editor.find('a.redactor-added-link');

          link.removeAttr('style').removeClass('redactor-added-link').each(function()
          {
            if (this.className == '') $(this).removeAttr('class');
          });

        }

        this.sync();
      }

      // link tooltip
      setTimeout($.proxy(function()
      {
        if (this.opts.observeLinks) this.observeLinks();

      }, this), 5);

      this.modalClose();
    },

    // FILE
    fileShow: function ()
    {

      this.selectionSave();

      var callback = $.proxy(function()
      {
        var sel = this.getSelection();

        var text = '';
        if (this.oldIE()) text = sel.text;
        else text = sel.toString();

        $('#redactor_filename').val(text);

        // dragupload
        if (!this.isMobile() && !this.isIPad())
        {
          this.draguploadInit('#redactor_file', {
            url: this.opts.fileUpload,
            uploadFields: this.opts.uploadFields,
            success: $.proxy(this.fileCallback, this),
            error: $.proxy( function(obj, json)
            {
              this.callback('fileUploadError', json);

            }, this),
            uploadParam: this.opts.fileUploadParam
          });
        }

        this.uploadInit('redactor_file', {
          auto: true,
          url: this.opts.fileUpload,
          success: $.proxy(this.fileCallback, this),
          error: $.proxy(function(obj, json)
          {
            this.callback('fileUploadError', json);

          }, this)
        });

      }, this);

      this.modalInit(this.opts.curLang.file, this.opts.modal_file, 500, callback);
    },
    fileCallback: function(json)
    {

      this.selectionRestore();

      if (json !== false)
      {

        var text = $('#redactor_filename').val();
        if (text === '') text = json.filename;

        var link = '<a href="' + json.filelink + '" id="filelink-marker">' + text + '</a>';

        // chrome fix
        if (this.browser('webkit') && !!this.window.chrome)
        {
          link = link + '&nbsp;';
        }

        this.execCommand('inserthtml', link, false);

        var linkmarker = $(this.$editor.find('a#filelink-marker'));
        if (linkmarker.size() != 0) linkmarker.removeAttr('id');
        else linkmarker = false;

        this.sync();

        // file upload callback
        this.callback('fileUpload', linkmarker, json);
      }

      this.modalClose();
    },

    // IMAGE
    imageShow: function()
    {

      this.selectionSave();

      var callback = $.proxy(function()
      {
        // json
        if (this.opts.imageGetJson)
        {

          $.getJSON(this.opts.imageGetJson, $.proxy(function(data)
          {
            var folders = {}, count = 0;

            // folders
            $.each(data, $.proxy(function(key, val)
            {
              if (typeof val.folder !== 'undefined')
              {
                count++;
                folders[val.folder] = count;
              }

            }, this));

            var folderclass = false;
            $.each(data, $.proxy(function(key, val)
            {
              // title
              var thumbtitle = '';
              if (typeof val.title !== 'undefined') thumbtitle = val.title;

              var folderkey = 0;
              if (!$.isEmptyObject(folders) && typeof val.folder !== 'undefined')
              {
                folderkey = folders[val.folder];
                if (folderclass === false) folderclass = '.redactorfolder' + folderkey;
              }

              var img = $('<img src="' + val.thumb + '" class="redactorfolder redactorfolder' + folderkey + '" rel="' + val.image + '" title="' + thumbtitle + '" />');
              $('#redactor_image_box').append(img);
              $(img).click($.proxy(this.imageThumbClick, this));

            }, this));

            // folders
            if (!$.isEmptyObject(folders))
            {
              $('.redactorfolder').hide();
              $(folderclass).show();

              var onchangeFunc = function(e)
              {
                $('.redactorfolder').hide();
                $('.redactorfolder' + $(e.target).val()).show();
              };

              var select = $('<select id="redactor_image_box_select">');
              $.each( folders, function(k, v)
              {
                select.append( $('<option value="' + v + '">' + k + '</option>'));
              });

              $('#redactor_image_box').before(select);
              select.change(onchangeFunc);
            }
          }, this));

        }
        else
        {
          $('#redactor-tab-control-2').remove();
        }

        if (this.opts.imageUpload || this.opts.s3)
        {
          // dragupload
          if (!this.isMobile()  && !this.isIPad() && this.opts.s3 === false)
          {
            if ($('#redactor_file' ).length)
            {
              this.draguploadInit('#redactor_file', {
                url: this.opts.imageUpload,
                uploadFields: this.opts.uploadFields,
                success: $.proxy(this.imageCallback, this),
                error: $.proxy(function(obj, json)
                {
                  this.callback('imageUploadError', json);

                }, this),
                uploadParam: this.opts.imageUploadParam
              });
            }
          }

          if (this.opts.s3 === false)
          {
            // ajax upload
            this.uploadInit('redactor_file', {
              auto: true,
              url: this.opts.imageUpload,
              success: $.proxy(this.imageCallback, this),
              error: $.proxy(function(obj, json)
              {
                this.callback('imageUploadError', json);

              }, this)
            });
          }
          // s3 upload
          else
          {
            $('#redactor_file').on('change.redactor', $.proxy(this.s3handleFileSelect, this));
          }

        }
        else
        {
          $('.redactor_tab').hide();
          if (!this.opts.imageGetJson)
          {
            $('#redactor_tabs').remove();
            $('#redactor_tab3').show();
          }
          else
          {
            $('#redactor-tab-control-1').remove();
            $('#redactor-tab-control-2').addClass('redactor_tabs_act');
            $('#redactor_tab2').show();
          }
        }

        if (!this.opts.imageTabLink && (this.opts.imageUpload || this.opts.imageGetJson))
        {
          $('#redactor-tab-control-3').hide();
        }

        $('#redactor_upload_btn').click($.proxy(this.imageCallbackLink, this));

        if (!this.opts.imageUpload && !this.opts.imageGetJson)
        {
          setTimeout(function()
          {
            $('#redactor_file_link').focus();

          }, 200);
        }

      }, this);

      this.modalInit(this.opts.curLang.image, this.opts.modal_image, 610, callback);

    },
    imageEdit: function(image)
    {
      var $el = image;
      var parent = $el.parent().parent();

      var callback = $.proxy(function()
      {
        $('#redactor_file_alt').val($el.attr('alt'));
        $('#redactor_image_edit_src').attr('href', $el.attr('src'));

        if ($el.css('display') == 'block' && $el.css('float') == 'none')
        {
          $('#redactor_form_image_align').val('center');
        }
        else
        {
          $('#redactor_form_image_align').val($el.css('float'));
        }

        if ($(parent).get(0).tagName === 'A')
        {
          $('#redactor_file_link').val($(parent).attr('href'));

          if ($(parent).attr('target') == '_blank')
          {
            $('#redactor_link_blank').prop('checked', true);
          }
        }

        $('#redactor_image_delete_btn').click($.proxy(function()
        {
          this.imageRemove($el);

        }, this));

        $('#redactorSaveBtn').click($.proxy(function()
        {
          this.imageSave($el);

        }, this));

      }, this);

      this.modalInit(this.opts.curLang.edit, this.opts.modal_image_edit, 380, callback);

    },
    imageRemove: function(el)
    {
      var parentLink = $(el).parent().parent();
      var parent = $(el).parent();
      var parentEl = false;

      if (parentLink.length && parentLink[0].tagName === 'A')
      {
        parentEl = true;
        $(parentLink).remove();
      }
      else if (parent.length && parent[0].tagName === 'A')
      {
        parentEl = true;
        $(parent).remove();
      }
      else
      {
        $(el).remove();
      }

      if (parent.length && parent[0].tagName === 'P')
      {
        this.focusWithSaveScroll();

        if (parentEl === false) this.selectionStart(parent);
      }

      // delete callback
      this.callback('imageDelete', el);

      this.modalClose();
      this.sync();
    },
    imageSave: function(el)
    {
      this.imageResizeHide(false);

      var $el = $(el);
      var parent = $el.parent();

      $el.attr('alt', $('#redactor_file_alt').val());

      var floating = $('#redactor_form_image_align').val();
      var margin = '';

      if (floating === 'left')
      {
        margin = '0 ' + this.opts.imageFloatMargin + ' ' + this.opts.imageFloatMargin + ' 0';
        $el.css({ 'float': 'left', 'margin': margin });
      }
      else if (floating === 'right')
      {
        margin = '0 0 ' + this.opts.imageFloatMargin + ' ' + this.opts.imageFloatMargin + '';
        $el.css({ 'float': 'right', 'margin': margin });
      }
      else if (floating === 'center')
      {
        $el.css({ 'float': '', 'display': 'block', 'margin': 'auto' });
      }
      else
      {
        $el.css({ 'float': '', 'display': '', 'margin': '' });
      }

      // as link
      var link = $.trim($('#redactor_file_link').val());
      if (link !== '')
      {
        var target = false;
        if ($('#redactor_link_blank').prop('checked'))
        {
          target = true;
        }

        if (parent.get(0).tagName !== 'A')
        {
          var a = $('<a href="' + link + '">' + this.outerHtml(el) + '</a>');

          if (target)
          {
            a.attr('target', '_blank');
          }

          $el.replaceWith(a);
        }
        else
        {
          parent.attr('href', link);
          if (target)
          {
            parent.attr('target', '_blank');
          }
          else
          {
            parent.removeAttr('target');
          }
        }
      }
      else
      {
        if (parent.get(0).tagName === 'A')
        {
          parent.replaceWith(this.outerHtml(el));
        }
      }

      this.modalClose();
      this.observeImages();
      this.sync();

    },
    imageResizeHide: function(e)
    {
      if (e !== false && $(e.target).parent().size() != 0 && $(e.target).parent()[0].id === 'redactor-image-box')
      {
        return false;
      }

      var imageBox = this.$editor.find('#redactor-image-box');
      if (imageBox.size() == 0)
      {
        return false;
      }

      this.$editor.find('#redactor-image-editter, #redactor-image-resizer').remove();

      imageBox.find('img').css({
        marginTop: imageBox[0].style.marginTop,
        marginBottom: imageBox[0].style.marginBottom,
        marginLeft: imageBox[0].style.marginLeft,
        marginRight: imageBox[0].style.marginRight
      });

      imageBox.css('margin', '');


      imageBox.find('img').css('opacity', '');
      imageBox.replaceWith(function()
      {
        return $(this).contents();
      });

      $(document).off('click.redactor-image-resize-hide');
      this.$editor.off('click.redactor-image-resize-hide');
      this.$editor.off('keydown.redactor-image-delete');

      this.sync()

    },
    imageResize: function(image)
    {
      var $image = $(image);

      $image.on('mousedown', $.proxy(function()
      {
        this.imageResizeHide(false);
      }, this));

      $image.on('dragstart', $.proxy(function()
      {
        this.$editor.on('drop.redactor-image-inside-drop', $.proxy(function()
        {
          setTimeout($.proxy(function()
          {
            this.observeImages();
            this.$editor.off('drop.redactor-image-inside-drop');
            this.sync();

          }, this), 1);

        },this));
      }, this));

      $image.on('click', $.proxy(function(e)
      {
        if (this.$editor.find('#redactor-image-box').size() != 0)
        {
          return false;
        }

        var clicked = false,
        start_x,
        start_y,
        ratio = $image.width() / $image.height(),
        min_w = 20,
        min_h = 10;

        var imageResizer = this.imageResizeControls($image);

        // resize
        var isResizing = false;
        if (imageResizer !== false)
        {
          imageResizer.on('mousedown', function(e)
          {
            isResizing = true;
            e.preventDefault();

            ratio = $image.width() / $image.height();

            start_x = Math.round(e.pageX - $image.eq(0).offset().left);
            start_y = Math.round(e.pageY - $image.eq(0).offset().top);

          });

          $(this.document.body).on('mousemove', $.proxy(function(e)
          {
            if (isResizing)
            {
              var mouse_x = Math.round(e.pageX - $image.eq(0).offset().left) - start_x;
              var mouse_y = Math.round(e.pageY - $image.eq(0).offset().top) - start_y;

              var div_h = $image.height();

              var new_h = parseInt(div_h, 10) + mouse_y;
              var new_w = Math.round(new_h * ratio);

              if (new_w > min_w)
              {
                $image.width(new_w);

                if (new_w < 100)
                {
                  this.imageEditter.css({
                    marginTop: '-7px',
                    marginLeft: '-13px',
                    fontSize: '9px',
                    padding: '3px 5px'
                  });
                }
                else
                {
                  this.imageEditter.css({
                    marginTop: '-11px',
                    marginLeft: '-18px',
                    fontSize: '11px',
                    padding: '7px 10px'
                  });
                }
              }

              start_x = Math.round(e.pageX - $image.eq(0).offset().left);
              start_y = Math.round(e.pageY - $image.eq(0).offset().top);

              this.sync()
            }
          }, this)).on('mouseup', function()
          {
            isResizing = false;
          });
        }


        this.$editor.on('keydown.redactor-image-delete', $.proxy(function(e)
        {
          var key = e.which;

          if (this.keyCode.BACKSPACE == key || this.keyCode.DELETE == key)
          {
            this.bufferSet(false);
            this.imageResizeHide(false);
            this.imageRemove($image);
          }

        }, this));

        $(document).on('click.redactor-image-resize-hide', $.proxy(this.imageResizeHide, this));
        this.$editor.on('click.redactor-image-resize-hide', $.proxy(this.imageResizeHide, this));


      }, this));
    },
    imageResizeControls: function($image)
    {
      var imageBox = $('<span id="redactor-image-box" data-redactor="verified">');
      imageBox.css({
        position: 'relative',
        display: 'inline-block',
        lineHeight: 0,
        outline: '1px dashed rgba(0, 0, 0, .6)',
        'float': $image.css('float')
      });
      imageBox.attr('contenteditable', false);

      if ($image[0].style.margin != 'auto')
      {
        imageBox.css({
          marginTop: $image[0].style.marginTop,
          marginBottom: $image[0].style.marginBottom,
          marginLeft: $image[0].style.marginLeft,
          marginRight: $image[0].style.marginRight
        });

        $image.css('margin', '');
      }
      else
      {
        imageBox.css({ 'display': 'block', 'margin': 'auto' });
      }

      $image.css('opacity', .5).after(imageBox);

      // editter
      this.imageEditter = $('<span id="redactor-image-editter" data-redactor="verified">' + this.opts.curLang.edit + '</span>');
      this.imageEditter.css({
        position: 'absolute',
        zIndex: 5,
        top: '50%',
        left: '50%',
        marginTop: '-11px',
        marginLeft: '-18px',
        lineHeight: 1,
        backgroundColor: '#000',
        color: '#fff',
        fontSize: '11px',
        padding: '7px 10px',
        cursor: 'pointer'
      });
      this.imageEditter.attr('contenteditable', false);
      this.imageEditter.on('click', $.proxy(function()
      {
        this.imageEdit($image);
      }, this));
      imageBox.append(this.imageEditter);

      // resizer
      if (this.opts.imageResizable)
      {
        var imageResizer = $('<span id="redactor-image-resizer" data-redactor="verified"></span>');
        imageResizer.css({
          position: 'absolute',
          zIndex: 2,
          lineHeight: 1,
          cursor: 'nw-resize',
          bottom: '-4px',
          right: '-5px',
          border: '1px solid #fff',
          backgroundColor: '#000',
          width: '8px',
          height: '8px'
        });
        imageResizer.attr('contenteditable', false);
        imageBox.append(imageResizer);

        imageBox.append($image);

        return imageResizer;
      }
      else
      {
        imageBox.append($image);

        return false;
      }
    },
    imageThumbClick: function(e)
    {
      var img = '<img id="image-marker" src="' + $(e.target).attr('rel') + '" alt="' + $(e.target).attr('title') + '" />';

      var parent = this.getParent();
      if (this.opts.paragraphy && $(parent).closest('li').size() == 0) img = '<p>' + img + '</p>';

      this.imageInsert(img, true);
    },
    imageCallbackLink: function()
    {
      var val = $('#redactor_file_link').val();

      if (val !== '')
      {
        var data = '<img id="image-marker" src="' + val + '" />';
        if (this.opts.linebreaks === false) data = '<p>' + data + '</p>';

        this.imageInsert(data, true);

      }
      else this.modalClose();
    },
    imageCallback: function(data)
    {
      this.imageInsert(data);
    },
    imageInsert: function(json, link)
    {
      this.selectionRestore();

      if (json !== false)
      {
        var html = '';
        if (link !== true)
        {
          html = '<img id="image-marker" src="' + json.filelink + '" />';

          var parent = this.getParent();
          if (this.opts.paragraphy && $(parent).closest('li').size() == 0)
          {
            html = '<p>' + html + '</p>';
          }
        }
        else
        {
          html = json;
        }

        this.execCommand('inserthtml', html, false);

        var image = $(this.$editor.find('img#image-marker'));

        if (image.length) image.removeAttr('id');
        else image = false;

        this.sync();

        // upload image callback
        link !== true && this.callback('imageUpload', image, json);
      }

      this.modalClose();
      this.observeImages();
    },

    // PROGRESS BAR
    buildProgressBar: function()
    {
      if ($('#redactor-progress').size() != 0) return;

      this.$progressBar = $('<div id="redactor-progress"><span></span></div>');
      $(document.body).append(this.$progressBar);
    },
    showProgressBar: function()
    {
      this.buildProgressBar();
      $('#redactor-progress').fadeIn();
    },
    hideProgressBar: function()
    {
      $('#redactor-progress').fadeOut(1500);
    },

    // MODAL
    modalTemplatesInit: function()
    {
      $.extend( this.opts,
      {
        modal_file: String()
        + '<section id="redactor-modal-file-insert">'
          + '<form id="redactorUploadFileForm" method="post" action="" enctype="multipart/form-data">'
            + '<label>' + this.opts.curLang.filename + '</label>'
            + '<input type="text" id="redactor_filename" class="redactor_input" />'
            + '<div style="margin-top: 7px;">'
              + '<input type="file" id="redactor_file" name="' + this.opts.fileUploadParam + '" />'
            + '</div>'
          + '</form>'
        + '</section>',

        modal_image_edit: String()
        + '<section id="redactor-modal-image-edit">'
          + '<label>' + this.opts.curLang.title + '</label>'
          + '<input type="text" id="redactor_file_alt" class="redactor_input" />'
          + '<label>' + this.opts.curLang.link + '</label>'
          + '<input type="text" id="redactor_file_link" class="redactor_input" />'
          + '<label><input type="checkbox" id="redactor_link_blank"> ' + this.opts.curLang.link_new_tab + '</label>'
          + '<label>' + this.opts.curLang.image_position + '</label>'
          + '<select id="redactor_form_image_align">'
            + '<option value="none">' + this.opts.curLang.none + '</option>'
            + '<option value="left">' + this.opts.curLang.left + '</option>'
            + '<option value="center">' + this.opts.curLang.center + '</option>'
            + '<option value="right">' + this.opts.curLang.right + '</option>'
          + '</select>'
        + '</section>'
        + '<footer>'
          + '<button id="redactor_image_delete_btn" class="redactor_modal_btn redactor_modal_delete_btn">' + this.opts.curLang._delete + '</button>'
          + '<button class="redactor_modal_btn redactor_btn_modal_close">' + this.opts.curLang.cancel + '</button>'
          + '<button id="redactorSaveBtn" class="redactor_modal_btn redactor_modal_action_btn">' + this.opts.curLang.save + '</button>'
        + '</footer>',

        modal_image: String()
        + '<section id="redactor-modal-image-insert">'
          + '<div id="redactor_tabs">'
            + '<a href="#" id="redactor-tab-control-1" class="redactor_tabs_act">' + this.opts.curLang.upload + '</a>'
            + '<a href="#" id="redactor-tab-control-2">' + this.opts.curLang.choose + '</a>'
            + '<a href="#" id="redactor-tab-control-3">' + this.opts.curLang.link + '</a>'
          + '</div>'
          + '<form id="redactorInsertImageForm" method="post" action="" enctype="multipart/form-data">'
            + '<div id="redactor_tab1" class="redactor_tab">'
              + '<input type="file" id="redactor_file" name="' + this.opts.imageUploadParam + '" />'
            + '</div>'
            + '<div id="redactor_tab2" class="redactor_tab" style="display: none;">'
              + '<div id="redactor_image_box"></div>'
            + '</div>'
          + '</form>'
          + '<div id="redactor_tab3" class="redactor_tab" style="display: none;">'
            + '<label>' + this.opts.curLang.image_web_link + '</label>'
            + '<input type="text" name="redactor_file_link" id="redactor_file_link" class="redactor_input"  /><br><br>'
          + '</div>'
        + '</section>'
        + '<footer>'
          + '<button class="redactor_modal_btn redactor_btn_modal_close">' + this.opts.curLang.cancel + '</button>'
          + '<button class="redactor_modal_btn redactor_modal_action_btn" id="redactor_upload_btn">' + this.opts.curLang.insert + '</button>'
        + '</footer>',

        modal_link: String()
        + '<section id="redactor-modal-link-insert">'
          + '<select id="redactor-predefined-links" style="width: 99.5%; display: none;"></select>'
          + '<label>URL</label>'
          + '<input type="text" class="redactor_input" id="redactor_link_url" />'
          + '<label>' + this.opts.curLang.text + '</label>'
          + '<input type="text" class="redactor_input" id="redactor_link_url_text" />'
          + '<label><input type="checkbox" id="redactor_link_blank"> ' + this.opts.curLang.link_new_tab + '</label>'
        + '</section>'
        + '<footer>'
          + '<button class="redactor_modal_btn redactor_btn_modal_close">' + this.opts.curLang.cancel + '</button>'
          + '<button id="redactor_insert_link_btn" class="redactor_modal_btn redactor_modal_action_btn">' + this.opts.curLang.insert + '</button>'
        + '</footer>',

        modal_table: String()
        + '<section id="redactor-modal-table-insert">'
          + '<label>' + this.opts.curLang.rows + '</label>'
          + '<input type="text" size="5" value="2" id="redactor_table_rows" />'
          + '<label>' + this.opts.curLang.columns + '</label>'
          + '<input type="text" size="5" value="3" id="redactor_table_columns" />'
        + '</section>'
        + '<footer>'
          + '<button class="redactor_modal_btn redactor_btn_modal_close">' + this.opts.curLang.cancel + '</button>'
          + '<button id="redactor_insert_table_btn" class="redactor_modal_btn redactor_modal_action_btn">' + this.opts.curLang.insert + '</button>'
        + '</footer>',

        modal_video: String()
        + '<section id="redactor-modal-video-insert">'
          + '<form id="redactorInsertVideoForm">'
            + '<label>' + this.opts.curLang.video_html_code + '</label>'
            + '<textarea id="redactor_insert_video_area" style="width: 99%; height: 160px;"></textarea>'
          + '</form>'
        + '</section>'
        + '<footer>'
          + '<button class="redactor_modal_btn redactor_btn_modal_close">' + this.opts.curLang.cancel + '</button>'
          + '<button id="redactor_insert_video_btn" class="redactor_modal_btn redactor_modal_action_btn">' + this.opts.curLang.insert + '</button>'
        + '</footer>'

      });
    },
    modalInit: function(title, content, width, callback)
    {
      this.modalSetOverlay();

      this.$redactorModalWidth = width;
      this.$redactorModal = $('#redactor_modal');

      if (!this.$redactorModal.length)
      {
        this.$redactorModal = $('<div id="redactor_modal" style="display: none;" />');
        this.$redactorModal.append($('<div id="redactor_modal_close">&times;</div>'));
        this.$redactorModal.append($('<header id="redactor_modal_header" />'));
        this.$redactorModal.append($('<div id="redactor_modal_inner" />'));
        this.$redactorModal.appendTo(document.body);
      }

      $('#redactor_modal_close').on('click', $.proxy(this.modalClose, this));
      $(document).on('keyup', $.proxy(this.modalCloseHandler, this));
      this.$editor.on('keyup', $.proxy(this.modalCloseHandler, this));

      this.modalSetContent(content);
      this.modalSetTitle(title);
      this.modalSetDraggable();
      this.modalLoadTabs();
      this.modalOnCloseButton();
      this.modalSetButtonsWidth();

      this.saveModalScroll = this.document.body.scrollTop;
      if (this.opts.autoresize === false)
      {
        this.saveModalScroll = this.$editor.scrollTop();
      }

      if (this.isMobile() === false) this.modalShowOnDesktop();
      else this.modalShowOnMobile();

      // modal actions callback
      if (typeof callback === 'function')
      {
        callback();
      }

      // modal shown callback
      setTimeout($.proxy(function()
      {
        this.callback('modalOpened', this.$redactorModal);

      }, this), 11);

      // fix bootstrap modal focus
      $(document).off('focusin.modal');

      // enter
      this.$redactorModal.find('input[type=text]').on('keypress', $.proxy(function(e)
      {
        if (e.which === 13)
        {
          this.$redactorModal.find('.redactor_modal_action_btn').click();
          e.preventDefault();
        }
      }, this));

      return this.$redactorModal;

    },
    modalShowOnDesktop: function()
    {
      this.$redactorModal.css({
        position: 'fixed',
        top: '-2000px',
        left: '50%',
        width: this.$redactorModalWidth + 'px',
        marginLeft: '-' + (this.$redactorModalWidth / 2) + 'px'
      }).show();

      this.modalSaveBodyOveflow = $(document.body).css('overflow');
      $(document.body).css('overflow', 'hidden');

      setTimeout($.proxy(function()
      {
        var height = this.$redactorModal.outerHeight();
        this.$redactorModal.css({
          top: '50%',
          height: 'auto',
          minHeight: 'auto',
          marginTop: '-' + (height + 10) / 2 + 'px'
        });
      }, this), 15);
    },
    modalShowOnMobile: function()
    {
      this.$redactorModal.css({
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: '0',
        left: '0',
        margin: '0',
        minHeight: '300px'
      }).show();
    },
    modalSetContent: function(content)
    {
      this.modalcontent = false;
      if (content.indexOf('#') == 0)
      {
        this.modalcontent = $(content);
        $('#redactor_modal_inner').empty().append(this.modalcontent.html());
        this.modalcontent.html('');

      }
      else
      {
        $('#redactor_modal_inner').empty().append(content);
      }
    },
    modalSetTitle: function(title)
    {
      this.$redactorModal.find('#redactor_modal_header').html(title);
    },
    modalSetButtonsWidth: function()
    {
      var buttons = this.$redactorModal.find('footer button').not('.redactor_modal_btn_hidden');
      var buttonsSize = buttons.size();
      if (buttonsSize > 0)
      {
        $(buttons).css('width', (this.$redactorModalWidth/buttonsSize) + 'px')
      }
    },
    modalOnCloseButton: function()
    {
      this.$redactorModal.find('.redactor_btn_modal_close').on('click', $.proxy(this.modalClose, this));
    },
    modalSetOverlay: function()
    {
      if (this.opts.modalOverlay)
      {
        this.$redactorModalOverlay = $('#redactor_modal_overlay');
        if (!this.$redactorModalOverlay.length)
        {
          this.$redactorModalOverlay = $('<div id="redactor_modal_overlay" style="display: none;"></div>');
          $('body').prepend(this.$redactorModalOverlay);
        }

        this.$redactorModalOverlay.show().on('click', $.proxy(this.modalClose, this));
      }
    },
    modalSetDraggable: function()
    {
      if (typeof $.fn.draggable !== 'undefined')
      {
        this.$redactorModal.draggable({ handle: '#redactor_modal_header' });
        this.$redactorModal.find('#redactor_modal_header').css('cursor', 'move');
      }
    },
    modalLoadTabs: function()
    {
      var $redactor_tabs = $('#redactor_tabs');
      if (!$redactor_tabs.length) return false;

      var that = this;
      $redactor_tabs.find('a').each(function(i, s)
      {
        i++;
        $(s).on('click', function(e)
        {
          e.preventDefault();

          $redactor_tabs.find('a').removeClass('redactor_tabs_act');
          $(this).addClass('redactor_tabs_act');
          $('.redactor_tab').hide();
          $('#redactor_tab' + i ).show();
          $('#redactor_tab_selected').val(i);

          if (that.isMobile() === false)
          {
            var height = that.$redactorModal.outerHeight();
            that.$redactorModal.css('margin-top', '-' + (height + 10) / 2 + 'px');
          }
        });
      });

    },
    modalCloseHandler: function(e)
    {
      if (e.keyCode === this.keyCode.ESC)
      {
        this.modalClose();
        return false;
      }
    },
    modalClose: function()
    {
      $('#redactor_modal_close').off('click', this.modalClose);
      $('#redactor_modal').fadeOut('fast', $.proxy(function()
      {
        var redactorModalInner = $('#redactor_modal_inner');

        if (this.modalcontent !== false)
        {
          this.modalcontent.html(redactorModalInner.html());
          this.modalcontent = false;
        }

        redactorModalInner.html('');

        if (this.opts.modalOverlay)
        {
          $('#redactor_modal_overlay').hide().off('click', this.modalClose);
        }

        $(document).off('keyup', this.modalCloseHandler);
        this.$editor.off('keyup', this.modalCloseHandler);

        this.selectionRestore();

        // restore scroll
        if (this.opts.autoresize && this.saveModalScroll)
        {
          $(this.document.body).scrollTop(this.saveModalScroll);
        }
        else if (this.opts.autoresize === false && this.saveModalScroll)
        {
          this.$editor.scrollTop(this.saveModalScroll);
        }

        this.callback('modalClosed');

      }, this));


      if (this.isMobile() === false)
      {
        $(document.body).css('overflow', this.modalSaveBodyOveflow ? this.modalSaveBodyOveflow : 'visible');
      }

      return false;
    },
    modalSetTab: function(num)
    {
      $('.redactor_tab').hide();
      $('#redactor_tabs').find('a').removeClass('redactor_tabs_act').eq(num - 1).addClass('redactor_tabs_act');
      $('#redactor_tab' + num).show();
    },

    // S3
    s3handleFileSelect: function(e)
    {
      var files = e.target.files;

      for (var i = 0, f; f = files[i]; i++)
      {
        this.s3uploadFile(f);
      }
    },
    s3uploadFile: function(file)
    {
      this.s3executeOnSignedUrl(file, $.proxy(function(signedURL)
      {
        this.s3uploadToS3(file, signedURL);
      }, this));
    },
    s3executeOnSignedUrl: function(file, callback)
    {
      var xhr = new XMLHttpRequest();

      var mark = '?';
      if (this.opts.s3.search(/\?/) != '-1') mark = '&';

      xhr.open('GET', this.opts.s3 + mark + 'name=' + file.name + '&type=' + file.type, true);

      // Hack to pass bytes through unprocessed.
      if (xhr.overrideMimeType) xhr.overrideMimeType('text/plain; charset=x-user-defined');

      var that = this;
      xhr.onreadystatechange = function(e)
      {
        if (this.readyState == 4 && this.status == 200)
        {
          that.showProgressBar();
          callback(decodeURIComponent(this.responseText));
        }
        else if(this.readyState == 4 && this.status != 200)
        {
          //setProgress(0, 'Could not contact signing script. Status = ' + this.status);
        }
      };

      xhr.send();
    },
    s3createCORSRequest: function(method, url)
    {
      var xhr = new XMLHttpRequest();
      if ("withCredentials" in xhr)
      {
        xhr.open(method, url, true);
      }
      else if (typeof XDomainRequest != "undefined")
      {
        xhr = new XDomainRequest();
        xhr.open(method, url);
      }
      else
      {
        xhr = null;
      }

      return xhr;
    },
    s3uploadToS3: function(file, url)
    {
      var xhr = this.s3createCORSRequest('PUT', url);
      if (!xhr)
      {
        //setProgress(0, 'CORS not supported');
      }
      else
      {
        xhr.onload = $.proxy(function()
        {
          if (xhr.status == 200)
          {
            //setProgress(100, 'Upload completed.');

            this.hideProgressBar();

            var s3image = url.split('?');

            if (!s3image[0])
            {
               // url parsing is fail
               return false;
            }

            this.selectionRestore();

            var html = '';
            html = '<img id="image-marker" src="' + s3image[0] + '" />';
            if (this.opts.paragraphy) html = '<p>' + html + '</p>';

            this.execCommand('inserthtml', html, false);

            var image = $(this.$editor.find('img#image-marker'));

            if (image.length) image.removeAttr('id');
            else image = false;

            this.sync();

            // upload image callback
            this.callback('imageUpload', image, false);

            this.modalClose();
            this.observeImages();

          }
          else
          {
            //setProgress(0, 'Upload error: ' + xhr.status);
          }
        }, this);

        xhr.onerror = function()
        {
          //setProgress(0, 'XHR error.');
        };

        xhr.upload.onprogress = function(e)
        {
          /*
          if (e.lengthComputable)
          {
            var percentLoaded = Math.round((e.loaded / e.total) * 100);
            setProgress(percentLoaded, percentLoaded == 100 ? 'Finalizing.' : 'Uploading.');
          }
          */
        };

        xhr.setRequestHeader('Content-Type', file.type);
        xhr.setRequestHeader('x-amz-acl', 'public-read');

        xhr.send(file);
      }
    },

    // UPLOAD
    uploadInit: function(el, options)
    {
      this.uploadOptions = {
        url: false,
        success: false,
        error: false,
        start: false,
        trigger: false,
        auto: false,
        input: false
      };

      $.extend(this.uploadOptions, options);

      var $el = $('#' + el);

      // Test input or form
      if ($el.length && $el[0].tagName === 'INPUT')
      {
        this.uploadOptions.input = $el;
        this.el = $($el[0].form);
      }
      else this.el = $el;

      this.element_action = this.el.attr('action');

      // Auto or trigger
      if (this.uploadOptions.auto)
      {
        $(this.uploadOptions.input).change($.proxy(function(e)
        {
          this.el.submit(function(e)
          {
            return false;
          });

          this.uploadSubmit(e);

        }, this));

      }
      else if (this.uploadOptions.trigger)
      {
        $('#' + this.uploadOptions.trigger).click($.proxy(this.uploadSubmit, this));
      }
    },
    uploadSubmit: function(e)
    {
      this.showProgressBar();
      this.uploadForm(this.element, this.uploadFrame());
    },
    uploadFrame: function()
    {
      this.id = 'f' + Math.floor(Math.random() * 99999);

      var d = this.document.createElement('div');
      var iframe = '<iframe style="display:none" id="' + this.id + '" name="' + this.id + '"></iframe>';

      d.innerHTML = iframe;
      $(d).appendTo("body");

      // Start
      if (this.uploadOptions.start) this.uploadOptions.start();

      $( '#' + this.id ).load($.proxy(this.uploadLoaded, this));

      return this.id;
    },
    uploadForm: function(f, name)
    {
      if (this.uploadOptions.input)
      {
        var formId = 'redactorUploadForm' + this.id,
          fileId = 'redactorUploadFile' + this.id;

        this.form = $('<form  action="' + this.uploadOptions.url + '" method="POST" target="' + name + '" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data" />');

        // append hidden fields
        if (this.opts.uploadFields !== false && typeof this.opts.uploadFields === 'object')
        {
          $.each(this.opts.uploadFields, $.proxy(function(k, v)
          {
            if (v != null && v.toString().indexOf('#') === 0) v = $(v).val();

            var hidden = $('<input/>', {
              'type': "hidden",
              'name': k,
              'value': v
            });

            $(this.form).append(hidden);

          }, this));
        }

        var oldElement = this.uploadOptions.input;
        var newElement = $(oldElement).clone();

        $(oldElement).attr('id', fileId).before(newElement).appendTo(this.form);

        $(this.form).css('position', 'absolute')
            .css('top', '-2000px')
            .css('left', '-2000px')
            .appendTo('body');

        this.form.submit();

      }
      else
      {
        f.attr('target', name)
          .attr('method', 'POST')
          .attr('enctype', 'multipart/form-data')
          .attr('action', this.uploadOptions.url);

        this.element.submit();
      }
    },
    uploadLoaded: function()
    {
      var i = $( '#' + this.id)[0], d;

      if (i.contentDocument) d = i.contentDocument;
      else if (i.contentWindow) d = i.contentWindow.document;
      else d = window.frames[this.id].document;

      // Success
      if (this.uploadOptions.success)
      {
        this.hideProgressBar();

        if (typeof d !== 'undefined')
        {
          // Remove bizarre <pre> tag wrappers around our json data:
          var rawString = d.body.innerHTML;
          var jsonString = rawString.match(/\{(.|\n)*\}/)[0];

          jsonString = jsonString.replace(/^\[/, '');
          jsonString = jsonString.replace(/\]$/, '');

          var json = $.parseJSON(jsonString);

          if (typeof json.error == 'undefined') this.uploadOptions.success(json);
          else
          {
            this.uploadOptions.error(this, json);
            this.modalClose();
          }
        }
        else
        {
          this.modalClose();
          alert('Upload failed!');
        }
      }

      this.el.attr('action', this.element_action);
      this.el.attr('target', '');
    },

    // DRAGUPLOAD
    draguploadInit: function (el, options)
    {
      this.draguploadOptions = $.extend({
        url: false,
        success: false,
        error: false,
        preview: false,
        uploadFields: false,
        text: this.opts.curLang.drop_file_here,
        atext: this.opts.curLang.or_choose,
        uploadParam: false
      }, options);

      if (window.FormData === undefined) return false;

      this.droparea = $('<div class="redactor_droparea"></div>');
      this.dropareabox = $('<div class="redactor_dropareabox">' + this.draguploadOptions.text + '</div>');
      this.dropalternative = $('<div class="redactor_dropalternative">' + this.draguploadOptions.atext + '</div>');

      this.droparea.append(this.dropareabox);

      $(el).before(this.droparea);
      $(el).before(this.dropalternative);

      // drag over
      this.dropareabox.on('dragover', $.proxy(function()
      {
        return this.draguploadOndrag();

      }, this));

      // drag leave
      this.dropareabox.on('dragleave', $.proxy(function()
      {
        return this.draguploadOndragleave();

      }, this));

      // drop
      this.dropareabox.get(0).ondrop = $.proxy(function(e)
      {
        e.preventDefault();

        this.dropareabox.removeClass('hover').addClass('drop');
        this.showProgressBar();
        this.dragUploadAjax(this.draguploadOptions.url, e.dataTransfer.files[0], false, e, this.draguploadOptions.uploadParam);

      }, this );
    },
    dragUploadAjax: function(url, file, directupload, e, uploadParam)
    {
      if (!directupload)
      {
        var xhr = $.ajaxSettings.xhr();
        if (xhr.upload)
        {
          xhr.upload.addEventListener('progress', $.proxy(this.uploadProgress, this), false);
        }

        $.ajaxSetup({
          xhr: function () { return xhr; }
        });
      }

      // drop callback
      this.callback('drop', e);

      var fd = new FormData();

      // append file data
      if (uploadParam !== false)
      {
        fd.append(uploadParam, file);
      }
      else
      {
        fd.append('file', file);
      }

      // append hidden fields
      if (this.opts.uploadFields !== false && typeof this.opts.uploadFields === 'object')
      {
        $.each(this.opts.uploadFields, $.proxy(function(k, v)
        {
          if (v != null && v.toString().indexOf('#') === 0) v = $(v).val();
          fd.append(k, v);

        }, this));
      }

      $.ajax({
        url: url,
        dataType: 'html',
        data: fd,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        success: $.proxy(function(data)
        {
          data = data.replace(/^\[/, '');
          data = data.replace(/\]$/, '');

          var json = (typeof data === 'string' ? $.parseJSON(data) : data);

          this.hideProgressBar();

          if (directupload)
          {
              var $img = $('<img>');
            $img.attr('src', json.filelink).attr('id', 'drag-image-marker');

            this.insertNodeToCaretPositionFromPoint(e, $img[0]);

            var image = $(this.$editor.find('img#drag-image-marker'));
            if (image.length) image.removeAttr('id');
            else image = false;

            this.sync();
            this.observeImages();

            // upload callback
            if (image) this.callback('imageUpload', image, json);

            // error callback
            if (typeof json.error !== 'undefined') this.callback('imageUploadError', json);
          }
          else
          {
            if (typeof json.error == 'undefined')
            {
              this.draguploadOptions.success(json);
            }
            else
            {
              this.draguploadOptions.error(this, json);
              this.draguploadOptions.success(false);
            }
          }

        }, this)
      });
    },
    draguploadOndrag: function()
    {
      this.dropareabox.addClass('hover');
      return false;
    },
    draguploadOndragleave: function()
    {
      this.dropareabox.removeClass('hover');
      return false;
    },
    uploadProgress: function(e, text)
    {
      var percent = e.loaded ? parseInt(e.loaded / e.total * 100, 10) : e;
      this.dropareabox.text('Loading ' + percent + '% ' + (text || ''));
    },

    // UTILS
    isMobile: function()
    {
      return /(iPhone|iPod|BlackBerry|Android)/.test(navigator.userAgent);
    },
    isIPad: function()
    {
      return /iPad/.test(navigator.userAgent);
    },
    normalize: function(str)
    {
      if (typeof(str) === 'undefined') return 0;
      return parseInt(str.replace('px',''), 10);
    },
    outerHtml: function(el)
    {
      return $('<div>').append($(el).eq(0).clone()).html();
    },
    stripHtml: function(html)
    {
      var tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    },
    isString: function(obj)
    {
      return Object.prototype.toString.call(obj) == '[object String]';
    },
    isEmpty: function(html)
    {
      html = html.replace(/&#x200b;|<br>|<br\/>|&nbsp;/gi, '');
      html = html.replace(/\s/g, '');
      html = html.replace(/^<p>[^\W\w\D\d]*?<\/p>$/i, '');

      return html == '';
    },
    getInternetExplorerVersion: function()
    {
      var rv = false;
      if (navigator.appName == 'Microsoft Internet Explorer')
      {
        var ua = navigator.userAgent;
        var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
        {
          rv = parseFloat(RegExp.$1);
        }
      }

      return rv;
    },
    isIe11: function()
    {
      return !!navigator.userAgent.match(/Trident\/7\./);
    },
    browser: function(browser)
    {
      var ua = navigator.userAgent.toLowerCase();
      var match = /(opr)[\/]([\w.]+)/.exec( ua ) ||
            /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
            /(webkit)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua) ||
            /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
            /(msie) ([\w.]+)/.exec( ua ) ||
            ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec( ua ) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
            [];

      if (browser == 'version') return match[2];
      if (browser == 'webkit') return (match[1] == 'chrome' || match[1] == 'webkit');
      if (match[1] == 'rv') return browser == 'msie';
      if (match[1] == 'opr') return browser == 'webkit';

      return browser == match[1];

    },
    oldIE: function()
    {
      if (this.browser('msie') && parseInt(this.browser('version'), 10) < 9) return true;
      return false;
    },
    getFragmentHtml: function (fragment)
    {
      var cloned = fragment.cloneNode(true);
      var div = this.document.createElement('div');

      div.appendChild(cloned);
      return div.innerHTML;
    },
    extractContent: function()
    {
      var node = this.$editor[0];
      var frag = this.document.createDocumentFragment();
      var child;

      while ((child = node.firstChild))
      {
        frag.appendChild(child);
      }

      return frag;
    },
    isParentRedactor: function(el)
    {
      if (!el) return false;
      if (this.opts.iframe) return el;

      if ($(el).parents('div.redactor_editor').length == 0 || $(el).hasClass('redactor_editor')) return false;
      else return el;
    },
    currentOrParentIs: function(tagName)
    {
      var parent = this.getParent(), current = this.getCurrent();
      return parent && parent.tagName === tagName ? parent : current && current.tagName === tagName ? current : false;
    },
    isEndOfElement: function()
    {
      var current = this.getBlock();
      var offset = this.getCaretOffset(current);

      var text = $.trim($(current).text()).replace(/\n\r\n/g, '');

      var len = text.length;

      if (offset == len) return true;
      else return false;
    },
    isFocused: function()
    {
      var el, sel = this.getSelection();

      if (sel && sel.rangeCount && sel.rangeCount > 0) el = sel.getRangeAt(0).startContainer;
      if (!el) return false;
      if (this.opts.iframe)
      {
        if (this.getCaretOffsetRange().equals()) return !this.$editor.is(el);
        else return true;
      }

      return $(el).closest('div.redactor_editor').length != 0;
    },
    removeEmptyAttr: function (el, attr)
    {
      if ($(el).attr(attr) == '') $(el).removeAttr(attr);
    },
    removeFromArrayByValue: function(array, value)
    {
      var index = null;

      while ((index = array.indexOf(value)) !== -1)
      {
        array.splice(index, 1);
      }

      return array;
    }

  };

  // constructor
  Redactor.prototype.init.prototype = Redactor.prototype;

  // LINKIFY
  $.Redactor.fn.formatLinkify = function(protocol, convertLinks, convertImageLinks, convertVideoLinks, linkSize)
  {
    var url = /(((https?|ftps?):\/\/)|www[.][^\s])(.+?\..+?)([.),]?)(\s|\.\s+|\)|$)/gi,
      rProtocol = /(https?|ftp):\/\//i,
      urlImage = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/gi;

    var childNodes = (this.$editor ? this.$editor.get(0) : this).childNodes, i = childNodes.length;
    while (i--)
    {
      var n = childNodes[i];
      if (n.nodeType === 3)
      {
        var html = n.nodeValue;

        // youtube & vimeo
        if (convertVideoLinks && html)
        {
          var iframeStart = '<iframe width="500" height="281" src="',
            iframeEnd = '" frameborder="0" allowfullscreen></iframe>';

          if (html.match(reUrlYoutube))
          {
            html = html.replace(reUrlYoutube, iframeStart + '//www.youtube.com/embed/$1' + iframeEnd);
            $(n).after(html).remove();
          }
          else if (html.match(reUrlVimeo))
          {
            html = html.replace(reUrlVimeo, iframeStart + '//player.vimeo.com/video/$2' + iframeEnd);
            $(n).after(html).remove();
          }
        }

        // image
        if (convertImageLinks && html && html.match(urlImage))
        {
          html = html.replace(urlImage, '<img src="$1">');

          $(n).after(html).remove();
        }

        // link
        if (convertLinks && html && html.match(url))
        {
          var matches = html.match(url);

          for (var i in matches)
          {
            var href = matches[i];
            var text = href;

            var space = '';
            if (href.match(/\s$/) !== null) space = ' ';

            var addProtocol = protocol;
            if (href.match(rProtocol) !== null) addProtocol = '';

            if (text.length > linkSize) text = text.substring(0, linkSize) + '...';

            text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

            /*
              To handle URLs which may have $ characters in them, need to escape $ -> $$ to prevent $1 from getting treated as a backreference.
              See https://gotofritz.net/blog/code-snippets/escaping-in-replace-strings-in-javascript/
            */
            var escapedBackReferences = text.replace('$', '$$$');

            html = html.replace(href, '<a href=\"' + addProtocol + $.trim(href) + '\">' + $.trim(escapedBackReferences) + '</a>' + space);
          }

          $(n).after(html).remove();
        }
      }
      else if (n.nodeType === 1 && !/^(a|button|textarea)$/i.test(n.tagName))
      {
        $.Redactor.fn.formatLinkify.call(n, protocol, convertLinks, convertImageLinks, convertVideoLinks, linkSize);
      }
    }
  };

})(jQuery);
(function() {
  $(function() {
    var all_guides, all_manuals, all_presentations, download_essay, download_guide, download_manual, download_module, download_presentation, download_textbook, email, facebook, google, publish_textbook, twitter,
      _this = this;
    download_textbook = $('.download-textbook');
    download_textbook.click(function(e) {
      var textbook;
      textbook = $('#textbook-title').text();
      return ga.event('Textbook', 'Download', textbook);
    });
    download_module = $('.download-module');
    download_module.click(function(e) {
      var module;
      module = $('#module-title').text();
      return ga.event('Module', 'Download', module);
    });
    all_manuals = $('#download-all-manuals');
    all_manuals.click(function(e) {
      return ga.event('Instructor Manual', 'Download', 'All Manuals');
    });
    download_manual = $('.download-manual');
    download_manual.click(function(e) {
      var module;
      module = $('#module-title').text();
      return ga.event('Instructor Manual', 'Download', module);
    });
    all_guides = $('#download-all-guides');
    all_guides.click(function(e) {
      return ga.event('Anticipation Guide', 'Download', 'All Guides');
    });
    download_guide = $('.download-guide');
    download_guide.click(function(e) {
      var guide;
      guide = $(e.target).text();
      return ga.event('Anticipation Guide', 'Download', guide);
    });
    all_presentations = $('#download-all-presentations');
    all_presentations.click(function(e) {
      return ga.event('PowerPoint Presentation', 'Download', 'All Presentations');
    });
    download_presentation = $('.download-presentation');
    download_presentation.click(function(e) {
      var presentation;
      presentation = $(e.target).text();
      return ga.event('PowerPoint Presentation', 'Download', presentation);
    });
    all_presentations = $('#download-all-teaching-topics');
    all_presentations.click(function(e) {
      return ga.event('Teaching Topics', 'Download', 'All Topics');
    });
    download_essay = $('.download-essay');
    download_essay.click(function(e) {
      var essay;
      essay = $(e.target).data('name');
      return ga.event('Teaching Topics', 'Download', essay);
    });
    publish_textbook = $('#publish-textbook');
    publish_textbook.click(function(e) {
      var textbook_title;
      textbook_title = $('#textbook_edition_title').text();
      return ga.event('Textbook', 'Publish', textbook_title);
    });
    facebook = $('.share-facebook');
    facebook.click(function(e) {
      var module;
      module = $('#module-title').text();
      return ga.event('Share', 'Facebook', module);
    });
    twitter = $('.share-twitter');
    twitter.click(function(e) {
      var module;
      module = $('#module-title').text();
      return ga.event('Share', 'Twitter', module);
    });
    google = $('.share-google-plus');
    google.click(function(e) {
      var module;
      module = $('#module-title').text();
      return ga.event('Share', 'Google Plus', module);
    });
    email = $('.share-email');
    return email.click(function(e) {
      var module;
      module = $('#module-title').text();
      return ga.event('Share', 'Email', module);
    });
  });

}).call(this);
// Knockout JavaScript library v3.1.0
// (c) Steven Sanderson - https://knockoutjs.com/
// License: MIT (https://www.opensource.org/licenses/mit-license.php)

(function() {(function(p){var A=this||(0,eval)("this"),w=A.document,K=A.navigator,t=A.jQuery,C=A.JSON;(function(p){"function"===typeof require&&"object"===typeof exports&&"object"===typeof module?p(module.exports||exports):"function"===typeof define&&define.amd?define(["exports"],p):p(A.ko={})})(function(z){function G(a,c){return null===a||typeof a in M?a===c:!1}function N(a,c){var d;return function(){d||(d=setTimeout(function(){d=p;a()},c))}}function O(a,c){var d;return function(){clearTimeout(d);d=setTimeout(a,
c)}}function H(b,c,d,e){a.d[b]={init:function(b,h,g,k,l){var n,r;a.ba(function(){var g=a.a.c(h()),k=!d!==!g,s=!r;if(s||c||k!==n)s&&a.ca.fa()&&(r=a.a.lb(a.e.childNodes(b),!0)),k?(s||a.e.U(b,a.a.lb(r)),a.gb(e?e(l,g):l,b)):a.e.da(b),n=k},null,{G:b});return{controlsDescendantBindings:!0}}};a.g.aa[b]=!1;a.e.Q[b]=!0}var a="undefined"!==typeof z?z:{};a.b=function(b,c){for(var d=b.split("."),e=a,f=0;f<d.length-1;f++)e=e[d[f]];e[d[d.length-1]]=c};a.s=function(a,c,d){a[c]=d};a.version="3.1.0";a.b("version",
a.version);a.a=function(){function b(a,b){for(var c in a)a.hasOwnProperty(c)&&b(c,a[c])}function c(a,b){if(b)for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return a}function d(a,b){a.__proto__=b;return a}var e={__proto__:[]}instanceof Array,f={},h={};f[K&&/Firefox\/2/i.test(K.userAgent)?"KeyboardEvent":"UIEvents"]=["keyup","keydown","keypress"];f.MouseEvents="click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave".split(" ");b(f,function(a,b){if(b.length)for(var c=0,
d=b.length;c<d;c++)h[b[c]]=a});var g={propertychange:!0},k=w&&function(){for(var a=3,b=w.createElement("div"),c=b.getElementsByTagName("i");b.innerHTML="\x3c!--[if gt IE "+ ++a+"]><i></i><![endif]--\x3e",c[0];);return 4<a?a:p}();return{mb:["authenticity_token",/^__RequestVerificationToken(_.*)?$/],r:function(a,b){for(var c=0,d=a.length;c<d;c++)b(a[c],c)},l:function(a,b){if("function"==typeof Array.prototype.indexOf)return Array.prototype.indexOf.call(a,b);for(var c=0,d=a.length;c<d;c++)if(a[c]===
b)return c;return-1},hb:function(a,b,c){for(var d=0,e=a.length;d<e;d++)if(b.call(c,a[d],d))return a[d];return null},ma:function(b,c){var d=a.a.l(b,c);0<d?b.splice(d,1):0===d&&b.shift()},ib:function(b){b=b||[];for(var c=[],d=0,e=b.length;d<e;d++)0>a.a.l(c,b[d])&&c.push(b[d]);return c},ya:function(a,b){a=a||[];for(var c=[],d=0,e=a.length;d<e;d++)c.push(b(a[d],d));return c},la:function(a,b){a=a||[];for(var c=[],d=0,e=a.length;d<e;d++)b(a[d],d)&&c.push(a[d]);return c},$:function(a,b){if(b instanceof Array)a.push.apply(a,
b);else for(var c=0,d=b.length;c<d;c++)a.push(b[c]);return a},Y:function(b,c,d){var e=a.a.l(a.a.Sa(b),c);0>e?d&&b.push(c):d||b.splice(e,1)},na:e,extend:c,ra:d,sa:e?d:c,A:b,Oa:function(a,b){if(!a)return a;var c={},d;for(d in a)a.hasOwnProperty(d)&&(c[d]=b(a[d],d,a));return c},Fa:function(b){for(;b.firstChild;)a.removeNode(b.firstChild)},ec:function(b){b=a.a.R(b);for(var c=w.createElement("div"),d=0,e=b.length;d<e;d++)c.appendChild(a.M(b[d]));return c},lb:function(b,c){for(var d=0,e=b.length,g=[];d<
e;d++){var k=b[d].cloneNode(!0);g.push(c?a.M(k):k)}return g},U:function(b,c){a.a.Fa(b);if(c)for(var d=0,e=c.length;d<e;d++)b.appendChild(c[d])},Bb:function(b,c){var d=b.nodeType?[b]:b;if(0<d.length){for(var e=d[0],g=e.parentNode,k=0,h=c.length;k<h;k++)g.insertBefore(c[k],e);k=0;for(h=d.length;k<h;k++)a.removeNode(d[k])}},ea:function(a,b){if(a.length){for(b=8===b.nodeType&&b.parentNode||b;a.length&&a[0].parentNode!==b;)a.shift();if(1<a.length){var c=a[0],d=a[a.length-1];for(a.length=0;c!==d;)if(a.push(c),
c=c.nextSibling,!c)return;a.push(d)}}return a},Db:function(a,b){7>k?a.setAttribute("selected",b):a.selected=b},ta:function(a){return null===a||a===p?"":a.trim?a.trim():a.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")},oc:function(b,c){for(var d=[],e=(b||"").split(c),g=0,k=e.length;g<k;g++){var h=a.a.ta(e[g]);""!==h&&d.push(h)}return d},kc:function(a,b){a=a||"";return b.length>a.length?!1:a.substring(0,b.length)===b},Sb:function(a,b){if(a===b)return!0;if(11===a.nodeType)return!1;if(b.contains)return b.contains(3===
a.nodeType?a.parentNode:a);if(b.compareDocumentPosition)return 16==(b.compareDocumentPosition(a)&16);for(;a&&a!=b;)a=a.parentNode;return!!a},Ea:function(b){return a.a.Sb(b,b.ownerDocument.documentElement)},eb:function(b){return!!a.a.hb(b,a.a.Ea)},B:function(a){return a&&a.tagName&&a.tagName.toLowerCase()},q:function(b,c,d){var e=k&&g[c];if(!e&&t)t(b).bind(c,d);else if(e||"function"!=typeof b.addEventListener)if("undefined"!=typeof b.attachEvent){var h=function(a){d.call(b,a)},f="on"+c;b.attachEvent(f,
h);a.a.u.ja(b,function(){b.detachEvent(f,h)})}else throw Error("Browser doesn't support addEventListener or attachEvent");else b.addEventListener(c,d,!1)},ha:function(b,c){if(!b||!b.nodeType)throw Error("element must be a DOM node when calling triggerEvent");var d;"input"===a.a.B(b)&&b.type&&"click"==c.toLowerCase()?(d=b.type,d="checkbox"==d||"radio"==d):d=!1;if(t&&!d)t(b).trigger(c);else if("function"==typeof w.createEvent)if("function"==typeof b.dispatchEvent)d=w.createEvent(h[c]||"HTMLEvents"),
d.initEvent(c,!0,!0,A,0,0,0,0,0,!1,!1,!1,!1,0,b),b.dispatchEvent(d);else throw Error("The supplied element doesn't support dispatchEvent");else if(d&&b.click)b.click();else if("undefined"!=typeof b.fireEvent)b.fireEvent("on"+c);else throw Error("Browser doesn't support triggering events");},c:function(b){return a.v(b)?b():b},Sa:function(b){return a.v(b)?b.o():b},ua:function(b,c,d){if(c){var e=/\S+/g,g=b.className.match(e)||[];a.a.r(c.match(e),function(b){a.a.Y(g,b,d)});b.className=g.join(" ")}},Xa:function(b,
c){var d=a.a.c(c);if(null===d||d===p)d="";var e=a.e.firstChild(b);!e||3!=e.nodeType||a.e.nextSibling(e)?a.e.U(b,[b.ownerDocument.createTextNode(d)]):e.data=d;a.a.Vb(b)},Cb:function(a,b){a.name=b;if(7>=k)try{a.mergeAttributes(w.createElement("<input name='"+a.name+"'/>"),!1)}catch(c){}},Vb:function(a){9<=k&&(a=1==a.nodeType?a:a.parentNode,a.style&&(a.style.zoom=a.style.zoom))},Tb:function(a){if(k){var b=a.style.width;a.style.width=0;a.style.width=b}},ic:function(b,c){b=a.a.c(b);c=a.a.c(c);for(var d=
[],e=b;e<=c;e++)d.push(e);return d},R:function(a){for(var b=[],c=0,d=a.length;c<d;c++)b.push(a[c]);return b},mc:6===k,nc:7===k,oa:k,ob:function(b,c){for(var d=a.a.R(b.getElementsByTagName("input")).concat(a.a.R(b.getElementsByTagName("textarea"))),e="string"==typeof c?function(a){return a.name===c}:function(a){return c.test(a.name)},g=[],k=d.length-1;0<=k;k--)e(d[k])&&g.push(d[k]);return g},fc:function(b){return"string"==typeof b&&(b=a.a.ta(b))?C&&C.parse?C.parse(b):(new Function("return "+b))():
null},Ya:function(b,c,d){if(!C||!C.stringify)throw Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from https://www.json.org/json2.js");return C.stringify(a.a.c(b),c,d)},gc:function(c,d,e){e=e||{};var g=e.params||{},k=e.includeFields||this.mb,h=c;if("object"==typeof c&&"form"===a.a.B(c))for(var h=c.action,f=k.length-1;0<=f;f--)for(var u=a.a.ob(c,k[f]),D=u.length-1;0<=D;D--)g[u[D].name]=
u[D].value;d=a.a.c(d);var y=w.createElement("form");y.style.display="none";y.action=h;y.method="post";for(var p in d)c=w.createElement("input"),c.name=p,c.value=a.a.Ya(a.a.c(d[p])),y.appendChild(c);b(g,function(a,b){var c=w.createElement("input");c.name=a;c.value=b;y.appendChild(c)});w.body.appendChild(y);e.submitter?e.submitter(y):y.submit();setTimeout(function(){y.parentNode.removeChild(y)},0)}}}();a.b("utils",a.a);a.b("utils.arrayForEach",a.a.r);a.b("utils.arrayFirst",a.a.hb);a.b("utils.arrayFilter",
a.a.la);a.b("utils.arrayGetDistinctValues",a.a.ib);a.b("utils.arrayIndexOf",a.a.l);a.b("utils.arrayMap",a.a.ya);a.b("utils.arrayPushAll",a.a.$);a.b("utils.arrayRemoveItem",a.a.ma);a.b("utils.extend",a.a.extend);a.b("utils.fieldsIncludedWithJsonPost",a.a.mb);a.b("utils.getFormFields",a.a.ob);a.b("utils.peekObservable",a.a.Sa);a.b("utils.postJson",a.a.gc);a.b("utils.parseJson",a.a.fc);a.b("utils.registerEventHandler",a.a.q);a.b("utils.stringifyJson",a.a.Ya);a.b("utils.range",a.a.ic);a.b("utils.toggleDomNodeCssClass",
a.a.ua);a.b("utils.triggerEvent",a.a.ha);a.b("utils.unwrapObservable",a.a.c);a.b("utils.objectForEach",a.a.A);a.b("utils.addOrRemoveItem",a.a.Y);a.b("unwrap",a.a.c);Function.prototype.bind||(Function.prototype.bind=function(a){var c=this,d=Array.prototype.slice.call(arguments);a=d.shift();return function(){return c.apply(a,d.concat(Array.prototype.slice.call(arguments)))}});a.a.f=new function(){function a(b,h){var g=b[d];if(!g||"null"===g||!e[g]){if(!h)return p;g=b[d]="ko"+c++;e[g]={}}return e[g]}
var c=0,d="__ko__"+(new Date).getTime(),e={};return{get:function(c,d){var e=a(c,!1);return e===p?p:e[d]},set:function(c,d,e){if(e!==p||a(c,!1)!==p)a(c,!0)[d]=e},clear:function(a){var b=a[d];return b?(delete e[b],a[d]=null,!0):!1},L:function(){return c++ +d}}};a.b("utils.domData",a.a.f);a.b("utils.domData.clear",a.a.f.clear);a.a.u=new function(){function b(b,c){var e=a.a.f.get(b,d);e===p&&c&&(e=[],a.a.f.set(b,d,e));return e}function c(d){var e=b(d,!1);if(e)for(var e=e.slice(0),k=0;k<e.length;k++)e[k](d);
a.a.f.clear(d);a.a.u.cleanExternalData(d);if(f[d.nodeType])for(e=d.firstChild;d=e;)e=d.nextSibling,8===d.nodeType&&c(d)}var d=a.a.f.L(),e={1:!0,8:!0,9:!0},f={1:!0,9:!0};return{ja:function(a,c){if("function"!=typeof c)throw Error("Callback must be a function");b(a,!0).push(c)},Ab:function(c,e){var k=b(c,!1);k&&(a.a.ma(k,e),0==k.length&&a.a.f.set(c,d,p))},M:function(b){if(e[b.nodeType]&&(c(b),f[b.nodeType])){var d=[];a.a.$(d,b.getElementsByTagName("*"));for(var k=0,l=d.length;k<l;k++)c(d[k])}return b},
removeNode:function(b){a.M(b);b.parentNode&&b.parentNode.removeChild(b)},cleanExternalData:function(a){t&&"function"==typeof t.cleanData&&t.cleanData([a])}}};a.M=a.a.u.M;a.removeNode=a.a.u.removeNode;a.b("cleanNode",a.M);a.b("removeNode",a.removeNode);a.b("utils.domNodeDisposal",a.a.u);a.b("utils.domNodeDisposal.addDisposeCallback",a.a.u.ja);a.b("utils.domNodeDisposal.removeDisposeCallback",a.a.u.Ab);(function(){a.a.Qa=function(b){var c;if(t)if(t.parseHTML)c=t.parseHTML(b)||[];else{if((c=t.clean([b]))&&
c[0]){for(b=c[0];b.parentNode&&11!==b.parentNode.nodeType;)b=b.parentNode;b.parentNode&&b.parentNode.removeChild(b)}}else{var d=a.a.ta(b).toLowerCase();c=w.createElement("div");d=d.match(/^<(thead|tbody|tfoot)/)&&[1,"<table>","</table>"]||!d.indexOf("<tr")&&[2,"<table><tbody>","</tbody></table>"]||(!d.indexOf("<td")||!d.indexOf("<th"))&&[3,"<table><tbody><tr>","</tr></tbody></table>"]||[0,"",""];b="ignored<div>"+d[1]+b+d[2]+"</div>";for("function"==typeof A.innerShiv?c.appendChild(A.innerShiv(b)):
c.innerHTML=b;d[0]--;)c=c.lastChild;c=a.a.R(c.lastChild.childNodes)}return c};a.a.Va=function(b,c){a.a.Fa(b);c=a.a.c(c);if(null!==c&&c!==p)if("string"!=typeof c&&(c=c.toString()),t)t(b).html(c);else for(var d=a.a.Qa(c),e=0;e<d.length;e++)b.appendChild(d[e])}})();a.b("utils.parseHtmlFragment",a.a.Qa);a.b("utils.setHtml",a.a.Va);a.w=function(){function b(c,e){if(c)if(8==c.nodeType){var f=a.w.xb(c.nodeValue);null!=f&&e.push({Rb:c,cc:f})}else if(1==c.nodeType)for(var f=0,h=c.childNodes,g=h.length;f<g;f++)b(h[f],
e)}var c={};return{Na:function(a){if("function"!=typeof a)throw Error("You can only pass a function to ko.memoization.memoize()");var b=(4294967296*(1+Math.random())|0).toString(16).substring(1)+(4294967296*(1+Math.random())|0).toString(16).substring(1);c[b]=a;return"\x3c!--[ko_memo:"+b+"]--\x3e"},Hb:function(a,b){var f=c[a];if(f===p)throw Error("Couldn't find any memo with ID "+a+". Perhaps it's already been unmemoized.");try{return f.apply(null,b||[]),!0}finally{delete c[a]}},Ib:function(c,e){var f=
[];b(c,f);for(var h=0,g=f.length;h<g;h++){var k=f[h].Rb,l=[k];e&&a.a.$(l,e);a.w.Hb(f[h].cc,l);k.nodeValue="";k.parentNode&&k.parentNode.removeChild(k)}},xb:function(a){return(a=a.match(/^\[ko_memo\:(.*?)\]$/))?a[1]:null}}}();a.b("memoization",a.w);a.b("memoization.memoize",a.w.Na);a.b("memoization.unmemoize",a.w.Hb);a.b("memoization.parseMemoText",a.w.xb);a.b("memoization.unmemoizeDomNodeAndDescendants",a.w.Ib);a.Ga={throttle:function(b,c){b.throttleEvaluation=c;var d=null;return a.h({read:b,write:function(a){clearTimeout(d);
d=setTimeout(function(){b(a)},c)}})},rateLimit:function(a,c){var d,e,f;"number"==typeof c?d=c:(d=c.timeout,e=c.method);f="notifyWhenChangesStop"==e?O:N;a.Ma(function(a){return f(a,d)})},notify:function(a,c){a.equalityComparer="always"==c?null:G}};var M={undefined:1,"boolean":1,number:1,string:1};a.b("extenders",a.Ga);a.Fb=function(b,c,d){this.target=b;this.za=c;this.Qb=d;this.sb=!1;a.s(this,"dispose",this.F)};a.Fb.prototype.F=function(){this.sb=!0;this.Qb()};a.N=function(){a.a.sa(this,a.N.fn);this.H=
{}};var F="change";z={V:function(b,c,d){var e=this;d=d||F;var f=new a.Fb(e,c?b.bind(c):b,function(){a.a.ma(e.H[d],f)});e.o&&e.o();e.H[d]||(e.H[d]=[]);e.H[d].push(f);return f},notifySubscribers:function(b,c){c=c||F;if(this.qb(c))try{a.k.jb();for(var d=this.H[c].slice(0),e=0,f;f=d[e];++e)f.sb||f.za(b)}finally{a.k.end()}},Ma:function(b){var c=this,d=a.v(c),e,f,h;c.ia||(c.ia=c.notifySubscribers,c.notifySubscribers=function(a,b){b&&b!==F?"beforeChange"===b?c.bb(a):c.ia(a,b):c.cb(a)});var g=b(function(){d&&
h===c&&(h=c());e=!1;c.Ka(f,h)&&c.ia(f=h)});c.cb=function(a){e=!0;h=a;g()};c.bb=function(a){e||(f=a,c.ia(a,"beforeChange"))}},qb:function(a){return this.H[a]&&this.H[a].length},Wb:function(){var b=0;a.a.A(this.H,function(a,d){b+=d.length});return b},Ka:function(a,c){return!this.equalityComparer||!this.equalityComparer(a,c)},extend:function(b){var c=this;b&&a.a.A(b,function(b,e){var f=a.Ga[b];"function"==typeof f&&(c=f(c,e)||c)});return c}};a.s(z,"subscribe",z.V);a.s(z,"extend",z.extend);a.s(z,"getSubscriptionsCount",
z.Wb);a.a.na&&a.a.ra(z,Function.prototype);a.N.fn=z;a.tb=function(a){return null!=a&&"function"==typeof a.V&&"function"==typeof a.notifySubscribers};a.b("subscribable",a.N);a.b("isSubscribable",a.tb);a.ca=a.k=function(){function b(a){d.push(e);e=a}function c(){e=d.pop()}var d=[],e,f=0;return{jb:b,end:c,zb:function(b){if(e){if(!a.tb(b))throw Error("Only subscribable things can act as dependencies");e.za(b,b.Kb||(b.Kb=++f))}},t:function(a,d,e){try{return b(),a.apply(d,e||[])}finally{c()}},fa:function(){if(e)return e.ba.fa()},
pa:function(){if(e)return e.pa}}}();a.b("computedContext",a.ca);a.b("computedContext.getDependenciesCount",a.ca.fa);a.b("computedContext.isInitial",a.ca.pa);a.m=function(b){function c(){if(0<arguments.length)return c.Ka(d,arguments[0])&&(c.P(),d=arguments[0],c.O()),this;a.k.zb(c);return d}var d=b;a.N.call(c);a.a.sa(c,a.m.fn);c.o=function(){return d};c.O=function(){c.notifySubscribers(d)};c.P=function(){c.notifySubscribers(d,"beforeChange")};a.s(c,"peek",c.o);a.s(c,"valueHasMutated",c.O);a.s(c,"valueWillMutate",
c.P);return c};a.m.fn={equalityComparer:G};var E=a.m.hc="__ko_proto__";a.m.fn[E]=a.m;a.a.na&&a.a.ra(a.m.fn,a.N.fn);a.Ha=function(b,c){return null===b||b===p||b[E]===p?!1:b[E]===c?!0:a.Ha(b[E],c)};a.v=function(b){return a.Ha(b,a.m)};a.ub=function(b){return"function"==typeof b&&b[E]===a.m||"function"==typeof b&&b[E]===a.h&&b.Yb?!0:!1};a.b("observable",a.m);a.b("isObservable",a.v);a.b("isWriteableObservable",a.ub);a.T=function(b){b=b||[];if("object"!=typeof b||!("length"in b))throw Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");
b=a.m(b);a.a.sa(b,a.T.fn);return b.extend({trackArrayChanges:!0})};a.T.fn={remove:function(b){for(var c=this.o(),d=[],e="function"!=typeof b||a.v(b)?function(a){return a===b}:b,f=0;f<c.length;f++){var h=c[f];e(h)&&(0===d.length&&this.P(),d.push(h),c.splice(f,1),f--)}d.length&&this.O();return d},removeAll:function(b){if(b===p){var c=this.o(),d=c.slice(0);this.P();c.splice(0,c.length);this.O();return d}return b?this.remove(function(c){return 0<=a.a.l(b,c)}):[]},destroy:function(b){var c=this.o(),d=
"function"!=typeof b||a.v(b)?function(a){return a===b}:b;this.P();for(var e=c.length-1;0<=e;e--)d(c[e])&&(c[e]._destroy=!0);this.O()},destroyAll:function(b){return b===p?this.destroy(function(){return!0}):b?this.destroy(function(c){return 0<=a.a.l(b,c)}):[]},indexOf:function(b){var c=this();return a.a.l(c,b)},replace:function(a,c){var d=this.indexOf(a);0<=d&&(this.P(),this.o()[d]=c,this.O())}};a.a.r("pop push reverse shift sort splice unshift".split(" "),function(b){a.T.fn[b]=function(){var a=this.o();
this.P();this.kb(a,b,arguments);a=a[b].apply(a,arguments);this.O();return a}});a.a.r(["slice"],function(b){a.T.fn[b]=function(){var a=this();return a[b].apply(a,arguments)}});a.a.na&&a.a.ra(a.T.fn,a.m.fn);a.b("observableArray",a.T);var I="arrayChange";a.Ga.trackArrayChanges=function(b){function c(){if(!d){d=!0;var c=b.notifySubscribers;b.notifySubscribers=function(a,b){b&&b!==F||++f;return c.apply(this,arguments)};var k=[].concat(b.o()||[]);e=null;b.V(function(c){c=[].concat(c||[]);if(b.qb(I)){var d;
if(!e||1<f)e=a.a.Aa(k,c,{sparse:!0});d=e;d.length&&b.notifySubscribers(d,I)}k=c;e=null;f=0})}}if(!b.kb){var d=!1,e=null,f=0,h=b.V;b.V=b.subscribe=function(a,b,d){d===I&&c();return h.apply(this,arguments)};b.kb=function(b,c,l){function h(a,b,c){return r[r.length]={status:a,value:b,index:c}}if(d&&!f){var r=[],m=b.length,q=l.length,s=0;switch(c){case "push":s=m;case "unshift":for(c=0;c<q;c++)h("added",l[c],s+c);break;case "pop":s=m-1;case "shift":m&&h("deleted",b[s],s);break;case "splice":c=Math.min(Math.max(0,
0>l[0]?m+l[0]:l[0]),m);for(var m=1===q?m:Math.min(c+(l[1]||0),m),q=c+q-2,s=Math.max(m,q),B=[],u=[],D=2;c<s;++c,++D)c<m&&u.push(h("deleted",b[c],c)),c<q&&B.push(h("added",l[D],c));a.a.nb(u,B);break;default:return}e=r}}}};a.ba=a.h=function(b,c,d){function e(){q=!0;a.a.A(v,function(a,b){b.F()});v={};x=0;n=!1}function f(){var a=g.throttleEvaluation;a&&0<=a?(clearTimeout(t),t=setTimeout(h,a)):g.wa?g.wa():h()}function h(){if(!r&&!q){if(y&&y()){if(!m){p();return}}else m=!1;r=!0;try{var b=v,d=x;a.k.jb({za:function(a,
c){q||(d&&b[c]?(v[c]=b[c],++x,delete b[c],--d):v[c]||(v[c]=a.V(f),++x))},ba:g,pa:!x});v={};x=0;try{var e=c?s.call(c):s()}finally{a.k.end(),d&&a.a.A(b,function(a,b){b.F()}),n=!1}g.Ka(l,e)&&(g.notifySubscribers(l,"beforeChange"),l=e,g.wa&&!g.throttleEvaluation||g.notifySubscribers(l))}finally{r=!1}x||p()}}function g(){if(0<arguments.length){if("function"===typeof B)B.apply(c,arguments);else throw Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
return this}n&&h();a.k.zb(g);return l}function k(){return n||0<x}var l,n=!0,r=!1,m=!1,q=!1,s=b;s&&"object"==typeof s?(d=s,s=d.read):(d=d||{},s||(s=d.read));if("function"!=typeof s)throw Error("Pass a function that returns the value of the ko.computed");var B=d.write,u=d.disposeWhenNodeIsRemoved||d.G||null,D=d.disposeWhen||d.Da,y=D,p=e,v={},x=0,t=null;c||(c=d.owner);a.N.call(g);a.a.sa(g,a.h.fn);g.o=function(){n&&!x&&h();return l};g.fa=function(){return x};g.Yb="function"===typeof d.write;g.F=function(){p()};
g.ga=k;var w=g.Ma;g.Ma=function(a){w.call(g,a);g.wa=function(){g.bb(l);n=!0;g.cb(g)}};a.s(g,"peek",g.o);a.s(g,"dispose",g.F);a.s(g,"isActive",g.ga);a.s(g,"getDependenciesCount",g.fa);u&&(m=!0,u.nodeType&&(y=function(){return!a.a.Ea(u)||D&&D()}));!0!==d.deferEvaluation&&h();u&&k()&&u.nodeType&&(p=function(){a.a.u.Ab(u,p);e()},a.a.u.ja(u,p));return g};a.$b=function(b){return a.Ha(b,a.h)};z=a.m.hc;a.h[z]=a.m;a.h.fn={equalityComparer:G};a.h.fn[z]=a.h;a.a.na&&a.a.ra(a.h.fn,a.N.fn);a.b("dependentObservable",
a.h);a.b("computed",a.h);a.b("isComputed",a.$b);(function(){function b(a,f,h){h=h||new d;a=f(a);if("object"!=typeof a||null===a||a===p||a instanceof Date||a instanceof String||a instanceof Number||a instanceof Boolean)return a;var g=a instanceof Array?[]:{};h.save(a,g);c(a,function(c){var d=f(a[c]);switch(typeof d){case "boolean":case "number":case "string":case "function":g[c]=d;break;case "object":case "undefined":var n=h.get(d);g[c]=n!==p?n:b(d,f,h)}});return g}function c(a,b){if(a instanceof Array){for(var c=
0;c<a.length;c++)b(c);"function"==typeof a.toJSON&&b("toJSON")}else for(c in a)b(c)}function d(){this.keys=[];this.ab=[]}a.Gb=function(c){if(0==arguments.length)throw Error("When calling ko.toJS, pass the object you want to convert.");return b(c,function(b){for(var c=0;a.v(b)&&10>c;c++)b=b();return b})};a.toJSON=function(b,c,d){b=a.Gb(b);return a.a.Ya(b,c,d)};d.prototype={save:function(b,c){var d=a.a.l(this.keys,b);0<=d?this.ab[d]=c:(this.keys.push(b),this.ab.push(c))},get:function(b){b=a.a.l(this.keys,
b);return 0<=b?this.ab[b]:p}}})();a.b("toJS",a.Gb);a.b("toJSON",a.toJSON);(function(){a.i={p:function(b){switch(a.a.B(b)){case "option":return!0===b.__ko__hasDomDataOptionValue__?a.a.f.get(b,a.d.options.Pa):7>=a.a.oa?b.getAttributeNode("value")&&b.getAttributeNode("value").specified?b.value:b.text:b.value;case "select":return 0<=b.selectedIndex?a.i.p(b.options[b.selectedIndex]):p;default:return b.value}},X:function(b,c,d){switch(a.a.B(b)){case "option":switch(typeof c){case "string":a.a.f.set(b,a.d.options.Pa,
p);"__ko__hasDomDataOptionValue__"in b&&delete b.__ko__hasDomDataOptionValue__;b.value=c;break;default:a.a.f.set(b,a.d.options.Pa,c),b.__ko__hasDomDataOptionValue__=!0,b.value="number"===typeof c?c:""}break;case "select":if(""===c||null===c)c=p;for(var e=-1,f=0,h=b.options.length,g;f<h;++f)if(g=a.i.p(b.options[f]),g==c||""==g&&c===p){e=f;break}if(d||0<=e||c===p&&1<b.size)b.selectedIndex=e;break;default:if(null===c||c===p)c="";b.value=c}}}})();a.b("selectExtensions",a.i);a.b("selectExtensions.readValue",
a.i.p);a.b("selectExtensions.writeValue",a.i.X);a.g=function(){function b(b){b=a.a.ta(b);123===b.charCodeAt(0)&&(b=b.slice(1,-1));var c=[],d=b.match(e),g,m,q=0;if(d){d.push(",");for(var s=0,B;B=d[s];++s){var u=B.charCodeAt(0);if(44===u){if(0>=q){g&&c.push(m?{key:g,value:m.join("")}:{unknown:g});g=m=q=0;continue}}else if(58===u){if(!m)continue}else if(47===u&&s&&1<B.length)(u=d[s-1].match(f))&&!h[u[0]]&&(b=b.substr(b.indexOf(B)+1),d=b.match(e),d.push(","),s=-1,B="/");else if(40===u||123===u||91===
u)++q;else if(41===u||125===u||93===u)--q;else if(!g&&!m){g=34===u||39===u?B.slice(1,-1):B;continue}m?m.push(B):m=[B]}}return c}var c=["true","false","null","undefined"],d=/^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i,e=RegExp("\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*'|/(?:[^/\\\\]|\\\\.)*/w*|[^\\s:,/][^,\"'{}()/:[\\]]*[^\\s,\"'{}()/:[\\]]|[^\\s]","g"),f=/[\])"'A-Za-z0-9_$]+$/,h={"in":1,"return":1,"typeof":1},g={};return{aa:[],W:g,Ra:b,qa:function(e,l){function f(b,e){var l,k=a.getBindingHandler(b);
if(k&&k.preprocess?e=k.preprocess(e,b,f):1){if(k=g[b])l=e,0<=a.a.l(c,l)?l=!1:(k=l.match(d),l=null===k?!1:k[1]?"Object("+k[1]+")"+k[2]:l),k=l;k&&m.push("'"+b+"':function(_z){"+l+"=_z}");q&&(e="function(){return "+e+" }");h.push("'"+b+"':"+e)}}l=l||{};var h=[],m=[],q=l.valueAccessors,s="string"===typeof e?b(e):e;a.a.r(s,function(a){f(a.key||a.unknown,a.value)});m.length&&f("_ko_property_writers","{"+m.join(",")+" }");return h.join(",")},bc:function(a,b){for(var c=0;c<a.length;c++)if(a[c].key==b)return!0;
return!1},va:function(b,c,d,e,g){if(b&&a.v(b))!a.ub(b)||g&&b.o()===e||b(e);else if((b=c.get("_ko_property_writers"))&&b[d])b[d](e)}}}();a.b("expressionRewriting",a.g);a.b("expressionRewriting.bindingRewriteValidators",a.g.aa);a.b("expressionRewriting.parseObjectLiteral",a.g.Ra);a.b("expressionRewriting.preProcessBindings",a.g.qa);a.b("expressionRewriting._twoWayBindings",a.g.W);a.b("jsonExpressionRewriting",a.g);a.b("jsonExpressionRewriting.insertPropertyAccessorsIntoJson",a.g.qa);(function(){function b(a){return 8==
a.nodeType&&h.test(f?a.text:a.nodeValue)}function c(a){return 8==a.nodeType&&g.test(f?a.text:a.nodeValue)}function d(a,d){for(var e=a,g=1,k=[];e=e.nextSibling;){if(c(e)&&(g--,0===g))return k;k.push(e);b(e)&&g++}if(!d)throw Error("Cannot find closing comment tag to match: "+a.nodeValue);return null}function e(a,b){var c=d(a,b);return c?0<c.length?c[c.length-1].nextSibling:a.nextSibling:null}var f=w&&"\x3c!--test--\x3e"===w.createComment("test").text,h=f?/^\x3c!--\s*ko(?:\s+([\s\S]+))?\s*--\x3e$/:/^\s*ko(?:\s+([\s\S]+))?\s*$/,
g=f?/^\x3c!--\s*\/ko\s*--\x3e$/:/^\s*\/ko\s*$/,k={ul:!0,ol:!0};a.e={Q:{},childNodes:function(a){return b(a)?d(a):a.childNodes},da:function(c){if(b(c)){c=a.e.childNodes(c);for(var d=0,e=c.length;d<e;d++)a.removeNode(c[d])}else a.a.Fa(c)},U:function(c,d){if(b(c)){a.e.da(c);for(var e=c.nextSibling,g=0,k=d.length;g<k;g++)e.parentNode.insertBefore(d[g],e)}else a.a.U(c,d)},yb:function(a,c){b(a)?a.parentNode.insertBefore(c,a.nextSibling):a.firstChild?a.insertBefore(c,a.firstChild):a.appendChild(c)},rb:function(c,
d,e){e?b(c)?c.parentNode.insertBefore(d,e.nextSibling):e.nextSibling?c.insertBefore(d,e.nextSibling):c.appendChild(d):a.e.yb(c,d)},firstChild:function(a){return b(a)?!a.nextSibling||c(a.nextSibling)?null:a.nextSibling:a.firstChild},nextSibling:function(a){b(a)&&(a=e(a));return a.nextSibling&&c(a.nextSibling)?null:a.nextSibling},Xb:b,lc:function(a){return(a=(f?a.text:a.nodeValue).match(h))?a[1]:null},wb:function(d){if(k[a.a.B(d)]){var g=d.firstChild;if(g){do if(1===g.nodeType){var f;f=g.firstChild;
var h=null;if(f){do if(h)h.push(f);else if(b(f)){var q=e(f,!0);q?f=q:h=[f]}else c(f)&&(h=[f]);while(f=f.nextSibling)}if(f=h)for(h=g.nextSibling,q=0;q<f.length;q++)h?d.insertBefore(f[q],h):d.appendChild(f[q])}while(g=g.nextSibling)}}}}})();a.b("virtualElements",a.e);a.b("virtualElements.allowedBindings",a.e.Q);a.b("virtualElements.emptyNode",a.e.da);a.b("virtualElements.insertAfter",a.e.rb);a.b("virtualElements.prepend",a.e.yb);a.b("virtualElements.setDomNodeChildren",a.e.U);(function(){a.J=function(){this.Nb=
{}};a.a.extend(a.J.prototype,{nodeHasBindings:function(b){switch(b.nodeType){case 1:return null!=b.getAttribute("data-bind");case 8:return a.e.Xb(b);default:return!1}},getBindings:function(a,c){var d=this.getBindingsString(a,c);return d?this.parseBindingsString(d,c,a):null},getBindingAccessors:function(a,c){var d=this.getBindingsString(a,c);return d?this.parseBindingsString(d,c,a,{valueAccessors:!0}):null},getBindingsString:function(b){switch(b.nodeType){case 1:return b.getAttribute("data-bind");
case 8:return a.e.lc(b);default:return null}},parseBindingsString:function(b,c,d,e){try{var f=this.Nb,h=b+(e&&e.valueAccessors||""),g;if(!(g=f[h])){var k,l="with($context){with($data||{}){return{"+a.g.qa(b,e)+"}}}";k=new Function("$context","$element",l);g=f[h]=k}return g(c,d)}catch(n){throw n.message="Unable to parse bindings.\nBindings value: "+b+"\nMessage: "+n.message,n;}}});a.J.instance=new a.J})();a.b("bindingProvider",a.J);(function(){function b(a){return function(){return a}}function c(a){return a()}
function d(b){return a.a.Oa(a.k.t(b),function(a,c){return function(){return b()[c]}})}function e(a,b){return d(this.getBindings.bind(this,a,b))}function f(b,c,d){var e,g=a.e.firstChild(c),k=a.J.instance,f=k.preprocessNode;if(f){for(;e=g;)g=a.e.nextSibling(e),f.call(k,e);g=a.e.firstChild(c)}for(;e=g;)g=a.e.nextSibling(e),h(b,e,d)}function h(b,c,d){var e=!0,g=1===c.nodeType;g&&a.e.wb(c);if(g&&d||a.J.instance.nodeHasBindings(c))e=k(c,null,b,d).shouldBindDescendants;e&&!n[a.a.B(c)]&&f(b,c,!g)}function g(b){var c=
[],d={},e=[];a.a.A(b,function y(g){if(!d[g]){var k=a.getBindingHandler(g);k&&(k.after&&(e.push(g),a.a.r(k.after,function(c){if(b[c]){if(-1!==a.a.l(e,c))throw Error("Cannot combine the following bindings, because they have a cyclic dependency: "+e.join(", "));y(c)}}),e.length--),c.push({key:g,pb:k}));d[g]=!0}});return c}function k(b,d,k,f){var h=a.a.f.get(b,r);if(!d){if(h)throw Error("You cannot apply bindings multiple times to the same element.");a.a.f.set(b,r,!0)}!h&&f&&a.Eb(b,k);var l;if(d&&"function"!==
typeof d)l=d;else{var n=a.J.instance,m=n.getBindingAccessors||e,x=a.h(function(){(l=d?d(k,b):m.call(n,b,k))&&k.D&&k.D();return l},null,{G:b});l&&x.ga()||(x=null)}var t;if(l){var w=x?function(a){return function(){return c(x()[a])}}:function(a){return l[a]},z=function(){return a.a.Oa(x?x():l,c)};z.get=function(a){return l[a]&&c(w(a))};z.has=function(a){return a in l};f=g(l);a.a.r(f,function(c){var d=c.pb.init,e=c.pb.update,g=c.key;if(8===b.nodeType&&!a.e.Q[g])throw Error("The binding '"+g+"' cannot be used with virtual elements");
try{"function"==typeof d&&a.k.t(function(){var a=d(b,w(g),z,k.$data,k);if(a&&a.controlsDescendantBindings){if(t!==p)throw Error("Multiple bindings ("+t+" and "+g+") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");t=g}}),"function"==typeof e&&a.h(function(){e(b,w(g),z,k.$data,k)},null,{G:b})}catch(f){throw f.message='Unable to process binding "'+g+": "+l[g]+'"\nMessage: '+f.message,f;}})}return{shouldBindDescendants:t===p}}
function l(b){return b&&b instanceof a.I?b:new a.I(b)}a.d={};var n={script:!0};a.getBindingHandler=function(b){return a.d[b]};a.I=function(b,c,d,e){var g=this,k="function"==typeof b&&!a.v(b),f,h=a.h(function(){var f=k?b():b,l=a.a.c(f);c?(c.D&&c.D(),a.a.extend(g,c),h&&(g.D=h)):(g.$parents=[],g.$root=l,g.ko=a);g.$rawData=f;g.$data=l;d&&(g[d]=l);e&&e(g,c,l);return g.$data},null,{Da:function(){return f&&!a.a.eb(f)},G:!0});h.ga()&&(g.D=h,h.equalityComparer=null,f=[],h.Jb=function(b){f.push(b);a.a.u.ja(b,
function(b){a.a.ma(f,b);f.length||(h.F(),g.D=h=p)})})};a.I.prototype.createChildContext=function(b,c,d){return new a.I(b,this,c,function(a,b){a.$parentContext=b;a.$parent=b.$data;a.$parents=(b.$parents||[]).slice(0);a.$parents.unshift(a.$parent);d&&d(a)})};a.I.prototype.extend=function(b){return new a.I(this.D||this.$data,this,null,function(c,d){c.$rawData=d.$rawData;a.a.extend(c,"function"==typeof b?b():b)})};var r=a.a.f.L(),m=a.a.f.L();a.Eb=function(b,c){if(2==arguments.length)a.a.f.set(b,m,c),
c.D&&c.D.Jb(b);else return a.a.f.get(b,m)};a.xa=function(b,c,d){1===b.nodeType&&a.e.wb(b);return k(b,c,l(d),!0)};a.Lb=function(c,e,g){g=l(g);return a.xa(c,"function"===typeof e?d(e.bind(null,g,c)):a.a.Oa(e,b),g)};a.gb=function(a,b){1!==b.nodeType&&8!==b.nodeType||f(l(a),b,!0)};a.fb=function(a,b){!t&&A.jQuery&&(t=A.jQuery);if(b&&1!==b.nodeType&&8!==b.nodeType)throw Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");b=b||A.document.body;h(l(a),
b,!0)};a.Ca=function(b){switch(b.nodeType){case 1:case 8:var c=a.Eb(b);if(c)return c;if(b.parentNode)return a.Ca(b.parentNode)}return p};a.Pb=function(b){return(b=a.Ca(b))?b.$data:p};a.b("bindingHandlers",a.d);a.b("applyBindings",a.fb);a.b("applyBindingsToDescendants",a.gb);a.b("applyBindingAccessorsToNode",a.xa);a.b("applyBindingsToNode",a.Lb);a.b("contextFor",a.Ca);a.b("dataFor",a.Pb)})();var L={"class":"className","for":"htmlFor"};a.d.attr={update:function(b,c){var d=a.a.c(c())||{};a.a.A(d,function(c,
d){d=a.a.c(d);var h=!1===d||null===d||d===p;h&&b.removeAttribute(c);8>=a.a.oa&&c in L?(c=L[c],h?b.removeAttribute(c):b[c]=d):h||b.setAttribute(c,d.toString());"name"===c&&a.a.Cb(b,h?"":d.toString())})}};(function(){a.d.checked={after:["value","attr"],init:function(b,c,d){function e(){return d.has("checkedValue")?a.a.c(d.get("checkedValue")):b.value}function f(){var g=b.checked,f=r?e():g;if(!a.ca.pa()&&(!k||g)){var h=a.k.t(c);l?n!==f?(g&&(a.a.Y(h,f,!0),a.a.Y(h,n,!1)),n=f):a.a.Y(h,f,g):a.g.va(h,d,"checked",
f,!0)}}function h(){var d=a.a.c(c());b.checked=l?0<=a.a.l(d,e()):g?d:e()===d}var g="checkbox"==b.type,k="radio"==b.type;if(g||k){var l=g&&a.a.c(c())instanceof Array,n=l?e():p,r=k||l;k&&!b.name&&a.d.uniqueName.init(b,function(){return!0});a.ba(f,null,{G:b});a.a.q(b,"click",f);a.ba(h,null,{G:b})}}};a.g.W.checked=!0;a.d.checkedValue={update:function(b,c){b.value=a.a.c(c())}}})();a.d.css={update:function(b,c){var d=a.a.c(c());"object"==typeof d?a.a.A(d,function(c,d){d=a.a.c(d);a.a.ua(b,c,d)}):(d=String(d||
""),a.a.ua(b,b.__ko__cssValue,!1),b.__ko__cssValue=d,a.a.ua(b,d,!0))}};a.d.enable={update:function(b,c){var d=a.a.c(c());d&&b.disabled?b.removeAttribute("disabled"):d||b.disabled||(b.disabled=!0)}};a.d.disable={update:function(b,c){a.d.enable.update(b,function(){return!a.a.c(c())})}};a.d.event={init:function(b,c,d,e,f){var h=c()||{};a.a.A(h,function(g){"string"==typeof g&&a.a.q(b,g,function(b){var h,n=c()[g];if(n){try{var r=a.a.R(arguments);e=f.$data;r.unshift(e);h=n.apply(e,r)}finally{!0!==h&&(b.preventDefault?
b.preventDefault():b.returnValue=!1)}!1===d.get(g+"Bubble")&&(b.cancelBubble=!0,b.stopPropagation&&b.stopPropagation())}})})}};a.d.foreach={vb:function(b){return function(){var c=b(),d=a.a.Sa(c);if(!d||"number"==typeof d.length)return{foreach:c,templateEngine:a.K.Ja};a.a.c(c);return{foreach:d.data,as:d.as,includeDestroyed:d.includeDestroyed,afterAdd:d.afterAdd,beforeRemove:d.beforeRemove,afterRender:d.afterRender,beforeMove:d.beforeMove,afterMove:d.afterMove,templateEngine:a.K.Ja}}},init:function(b,
c){return a.d.template.init(b,a.d.foreach.vb(c))},update:function(b,c,d,e,f){return a.d.template.update(b,a.d.foreach.vb(c),d,e,f)}};a.g.aa.foreach=!1;a.e.Q.foreach=!0;a.d.hasfocus={init:function(b,c,d){function e(e){b.__ko_hasfocusUpdating=!0;var k=b.ownerDocument;if("activeElement"in k){var f;try{f=k.activeElement}catch(h){f=k.body}e=f===b}k=c();a.g.va(k,d,"hasfocus",e,!0);b.__ko_hasfocusLastValue=e;b.__ko_hasfocusUpdating=!1}var f=e.bind(null,!0),h=e.bind(null,!1);a.a.q(b,"focus",f);a.a.q(b,"focusin",
f);a.a.q(b,"blur",h);a.a.q(b,"focusout",h)},update:function(b,c){var d=!!a.a.c(c());b.__ko_hasfocusUpdating||b.__ko_hasfocusLastValue===d||(d?b.focus():b.blur(),a.k.t(a.a.ha,null,[b,d?"focusin":"focusout"]))}};a.g.W.hasfocus=!0;a.d.hasFocus=a.d.hasfocus;a.g.W.hasFocus=!0;a.d.html={init:function(){return{controlsDescendantBindings:!0}},update:function(b,c){a.a.Va(b,c())}};H("if");H("ifnot",!1,!0);H("with",!0,!1,function(a,c){return a.createChildContext(c)});var J={};a.d.options={init:function(b){if("select"!==
a.a.B(b))throw Error("options binding applies only to SELECT elements");for(;0<b.length;)b.remove(0);return{controlsDescendantBindings:!0}},update:function(b,c,d){function e(){return a.a.la(b.options,function(a){return a.selected})}function f(a,b,c){var d=typeof b;return"function"==d?b(a):"string"==d?a[b]:c}function h(c,d){if(r.length){var e=0<=a.a.l(r,a.i.p(d[0]));a.a.Db(d[0],e);m&&!e&&a.k.t(a.a.ha,null,[b,"change"])}}var g=0!=b.length&&b.multiple?b.scrollTop:null,k=a.a.c(c()),l=d.get("optionsIncludeDestroyed");
c={};var n,r;r=b.multiple?a.a.ya(e(),a.i.p):0<=b.selectedIndex?[a.i.p(b.options[b.selectedIndex])]:[];k&&("undefined"==typeof k.length&&(k=[k]),n=a.a.la(k,function(b){return l||b===p||null===b||!a.a.c(b._destroy)}),d.has("optionsCaption")&&(k=a.a.c(d.get("optionsCaption")),null!==k&&k!==p&&n.unshift(J)));var m=!1;c.beforeRemove=function(a){b.removeChild(a)};k=h;d.has("optionsAfterRender")&&(k=function(b,c){h(0,c);a.k.t(d.get("optionsAfterRender"),null,[c[0],b!==J?b:p])});a.a.Ua(b,n,function(c,e,g){g.length&&
(r=g[0].selected?[a.i.p(g[0])]:[],m=!0);e=b.ownerDocument.createElement("option");c===J?(a.a.Xa(e,d.get("optionsCaption")),a.i.X(e,p)):(g=f(c,d.get("optionsValue"),c),a.i.X(e,a.a.c(g)),c=f(c,d.get("optionsText"),g),a.a.Xa(e,c));return[e]},c,k);a.k.t(function(){d.get("valueAllowUnset")&&d.has("value")?a.i.X(b,a.a.c(d.get("value")),!0):(b.multiple?r.length&&e().length<r.length:r.length&&0<=b.selectedIndex?a.i.p(b.options[b.selectedIndex])!==r[0]:r.length||0<=b.selectedIndex)&&a.a.ha(b,"change")});a.a.Tb(b);
g&&20<Math.abs(g-b.scrollTop)&&(b.scrollTop=g)}};a.d.options.Pa=a.a.f.L();a.d.selectedOptions={after:["options","foreach"],init:function(b,c,d){a.a.q(b,"change",function(){var e=c(),f=[];a.a.r(b.getElementsByTagName("option"),function(b){b.selected&&f.push(a.i.p(b))});a.g.va(e,d,"selectedOptions",f)})},update:function(b,c){if("select"!=a.a.B(b))throw Error("values binding applies only to SELECT elements");var d=a.a.c(c());d&&"number"==typeof d.length&&a.a.r(b.getElementsByTagName("option"),function(b){var c=
0<=a.a.l(d,a.i.p(b));a.a.Db(b,c)})}};a.g.W.selectedOptions=!0;a.d.style={update:function(b,c){var d=a.a.c(c()||{});a.a.A(d,function(c,d){d=a.a.c(d);b.style[c]=d||""})}};a.d.submit={init:function(b,c,d,e,f){if("function"!=typeof c())throw Error("The value for a submit binding must be a function");a.a.q(b,"submit",function(a){var d,e=c();try{d=e.call(f.$data,b)}finally{!0!==d&&(a.preventDefault?a.preventDefault():a.returnValue=!1)}})}};a.d.text={init:function(){return{controlsDescendantBindings:!0}},
update:function(b,c){a.a.Xa(b,c())}};a.e.Q.text=!0;a.d.uniqueName={init:function(b,c){if(c()){var d="ko_unique_"+ ++a.d.uniqueName.Ob;a.a.Cb(b,d)}}};a.d.uniqueName.Ob=0;a.d.value={after:["options","foreach"],init:function(b,c,d){function e(){g=!1;var e=c(),f=a.i.p(b);a.g.va(e,d,"value",f)}var f=["change"],h=d.get("valueUpdate"),g=!1;h&&("string"==typeof h&&(h=[h]),a.a.$(f,h),f=a.a.ib(f));!a.a.oa||"input"!=b.tagName.toLowerCase()||"text"!=b.type||"off"==b.autocomplete||b.form&&"off"==b.form.autocomplete||
-1!=a.a.l(f,"propertychange")||(a.a.q(b,"propertychange",function(){g=!0}),a.a.q(b,"focus",function(){g=!1}),a.a.q(b,"blur",function(){g&&e()}));a.a.r(f,function(c){var d=e;a.a.kc(c,"after")&&(d=function(){setTimeout(e,0)},c=c.substring(5));a.a.q(b,c,d)})},update:function(b,c,d){var e=a.a.c(c());c=a.i.p(b);if(e!==c)if("select"===a.a.B(b)){var f=d.get("valueAllowUnset");d=function(){a.i.X(b,e,f)};d();f||e===a.i.p(b)?setTimeout(d,0):a.k.t(a.a.ha,null,[b,"change"])}else a.i.X(b,e)}};a.g.W.value=!0;a.d.visible=
{update:function(b,c){var d=a.a.c(c()),e="none"!=b.style.display;d&&!e?b.style.display="":!d&&e&&(b.style.display="none")}};(function(b){a.d[b]={init:function(c,d,e,f,h){return a.d.event.init.call(this,c,function(){var a={};a[b]=d();return a},e,f,h)}}})("click");a.C=function(){};a.C.prototype.renderTemplateSource=function(){throw Error("Override renderTemplateSource");};a.C.prototype.createJavaScriptEvaluatorBlock=function(){throw Error("Override createJavaScriptEvaluatorBlock");};a.C.prototype.makeTemplateSource=
function(b,c){if("string"==typeof b){c=c||w;var d=c.getElementById(b);if(!d)throw Error("Cannot find template with ID "+b);return new a.n.j(d)}if(1==b.nodeType||8==b.nodeType)return new a.n.Z(b);throw Error("Unknown template type: "+b);};a.C.prototype.renderTemplate=function(a,c,d,e){a=this.makeTemplateSource(a,e);return this.renderTemplateSource(a,c,d)};a.C.prototype.isTemplateRewritten=function(a,c){return!1===this.allowTemplateRewriting?!0:this.makeTemplateSource(a,c).data("isRewritten")};a.C.prototype.rewriteTemplate=
function(a,c,d){a=this.makeTemplateSource(a,d);c=c(a.text());a.text(c);a.data("isRewritten",!0)};a.b("templateEngine",a.C);a.Za=function(){function b(b,c,d,g){b=a.g.Ra(b);for(var k=a.g.aa,l=0;l<b.length;l++){var n=b[l].key;if(k.hasOwnProperty(n)){var r=k[n];if("function"===typeof r){if(n=r(b[l].value))throw Error(n);}else if(!r)throw Error("This template engine does not support the '"+n+"' binding within its templates");}}d="ko.__tr_ambtns(function($context,$element){return(function(){return{ "+a.g.qa(b,
{valueAccessors:!0})+" } })()},'"+d.toLowerCase()+"')";return g.createJavaScriptEvaluatorBlock(d)+c}var c=/(<([a-z]+\d*)(?:\s+(?!data-bind\s*=\s*)[a-z0-9\-]+(?:=(?:\"[^\"]*\"|\'[^\']*\'))?)*\s+)data-bind\s*=\s*(["'])([\s\S]*?)\3/gi,d=/\x3c!--\s*ko\b\s*([\s\S]*?)\s*--\x3e/g;return{Ub:function(b,c,d){c.isTemplateRewritten(b,d)||c.rewriteTemplate(b,function(b){return a.Za.dc(b,c)},d)},dc:function(a,f){return a.replace(c,function(a,c,d,e,n){return b(n,c,d,f)}).replace(d,function(a,c){return b(c,"\x3c!-- ko --\x3e",
"#comment",f)})},Mb:function(b,c){return a.w.Na(function(d,g){var k=d.nextSibling;k&&k.nodeName.toLowerCase()===c&&a.xa(k,b,g)})}}}();a.b("__tr_ambtns",a.Za.Mb);(function(){a.n={};a.n.j=function(a){this.j=a};a.n.j.prototype.text=function(){var b=a.a.B(this.j),b="script"===b?"text":"textarea"===b?"value":"innerHTML";if(0==arguments.length)return this.j[b];var c=arguments[0];"innerHTML"===b?a.a.Va(this.j,c):this.j[b]=c};var b=a.a.f.L()+"_";a.n.j.prototype.data=function(c){if(1===arguments.length)return a.a.f.get(this.j,
b+c);a.a.f.set(this.j,b+c,arguments[1])};var c=a.a.f.L();a.n.Z=function(a){this.j=a};a.n.Z.prototype=new a.n.j;a.n.Z.prototype.text=function(){if(0==arguments.length){var b=a.a.f.get(this.j,c)||{};b.$a===p&&b.Ba&&(b.$a=b.Ba.innerHTML);return b.$a}a.a.f.set(this.j,c,{$a:arguments[0]})};a.n.j.prototype.nodes=function(){if(0==arguments.length)return(a.a.f.get(this.j,c)||{}).Ba;a.a.f.set(this.j,c,{Ba:arguments[0]})};a.b("templateSources",a.n);a.b("templateSources.domElement",a.n.j);a.b("templateSources.anonymousTemplate",
a.n.Z)})();(function(){function b(b,c,d){var e;for(c=a.e.nextSibling(c);b&&(e=b)!==c;)b=a.e.nextSibling(e),d(e,b)}function c(c,d){if(c.length){var e=c[0],f=c[c.length-1],h=e.parentNode,m=a.J.instance,q=m.preprocessNode;if(q){b(e,f,function(a,b){var c=a.previousSibling,d=q.call(m,a);d&&(a===e&&(e=d[0]||b),a===f&&(f=d[d.length-1]||c))});c.length=0;if(!e)return;e===f?c.push(e):(c.push(e,f),a.a.ea(c,h))}b(e,f,function(b){1!==b.nodeType&&8!==b.nodeType||a.fb(d,b)});b(e,f,function(b){1!==b.nodeType&&8!==
b.nodeType||a.w.Ib(b,[d])});a.a.ea(c,h)}}function d(a){return a.nodeType?a:0<a.length?a[0]:null}function e(b,e,h,n,r){r=r||{};var m=b&&d(b),m=m&&m.ownerDocument,q=r.templateEngine||f;a.Za.Ub(h,q,m);h=q.renderTemplate(h,n,r,m);if("number"!=typeof h.length||0<h.length&&"number"!=typeof h[0].nodeType)throw Error("Template engine must return an array of DOM nodes");m=!1;switch(e){case "replaceChildren":a.e.U(b,h);m=!0;break;case "replaceNode":a.a.Bb(b,h);m=!0;break;case "ignoreTargetNode":break;default:throw Error("Unknown renderMode: "+
e);}m&&(c(h,n),r.afterRender&&a.k.t(r.afterRender,null,[h,n.$data]));return h}var f;a.Wa=function(b){if(b!=p&&!(b instanceof a.C))throw Error("templateEngine must inherit from ko.templateEngine");f=b};a.Ta=function(b,c,h,n,r){h=h||{};if((h.templateEngine||f)==p)throw Error("Set a template engine before calling renderTemplate");r=r||"replaceChildren";if(n){var m=d(n);return a.h(function(){var f=c&&c instanceof a.I?c:new a.I(a.a.c(c)),p=a.v(b)?b():"function"==typeof b?b(f.$data,f):b,f=e(n,r,p,f,h);
"replaceNode"==r&&(n=f,m=d(n))},null,{Da:function(){return!m||!a.a.Ea(m)},G:m&&"replaceNode"==r?m.parentNode:m})}return a.w.Na(function(d){a.Ta(b,c,h,d,"replaceNode")})};a.jc=function(b,d,f,h,r){function m(a,b){c(b,s);f.afterRender&&f.afterRender(b,a)}function q(a,c){s=r.createChildContext(a,f.as,function(a){a.$index=c});var d="function"==typeof b?b(a,s):b;return e(null,"ignoreTargetNode",d,s,f)}var s;return a.h(function(){var b=a.a.c(d)||[];"undefined"==typeof b.length&&(b=[b]);b=a.a.la(b,function(b){return f.includeDestroyed||
b===p||null===b||!a.a.c(b._destroy)});a.k.t(a.a.Ua,null,[h,b,q,f,m])},null,{G:h})};var h=a.a.f.L();a.d.template={init:function(b,c){var d=a.a.c(c());"string"==typeof d||d.name?a.e.da(b):(d=a.e.childNodes(b),d=a.a.ec(d),(new a.n.Z(b)).nodes(d));return{controlsDescendantBindings:!0}},update:function(b,c,d,e,f){var m=c(),q;c=a.a.c(m);d=!0;e=null;"string"==typeof c?c={}:(m=c.name,"if"in c&&(d=a.a.c(c["if"])),d&&"ifnot"in c&&(d=!a.a.c(c.ifnot)),q=a.a.c(c.data));"foreach"in c?e=a.jc(m||b,d&&c.foreach||
[],c,b,f):d?(f="data"in c?f.createChildContext(q,c.as):f,e=a.Ta(m||b,f,c,b)):a.e.da(b);f=e;(q=a.a.f.get(b,h))&&"function"==typeof q.F&&q.F();a.a.f.set(b,h,f&&f.ga()?f:p)}};a.g.aa.template=function(b){b=a.g.Ra(b);return 1==b.length&&b[0].unknown||a.g.bc(b,"name")?null:"This template engine does not support anonymous templates nested within its templates"};a.e.Q.template=!0})();a.b("setTemplateEngine",a.Wa);a.b("renderTemplate",a.Ta);a.a.nb=function(a,c,d){if(a.length&&c.length){var e,f,h,g,k;for(e=
f=0;(!d||e<d)&&(g=a[f]);++f){for(h=0;k=c[h];++h)if(g.value===k.value){g.moved=k.index;k.moved=g.index;c.splice(h,1);e=h=0;break}e+=h}}};a.a.Aa=function(){function b(b,d,e,f,h){var g=Math.min,k=Math.max,l=[],n,p=b.length,m,q=d.length,s=q-p||1,t=p+q+1,u,w,y;for(n=0;n<=p;n++)for(w=u,l.push(u=[]),y=g(q,n+s),m=k(0,n-1);m<=y;m++)u[m]=m?n?b[n-1]===d[m-1]?w[m-1]:g(w[m]||t,u[m-1]||t)+1:m+1:n+1;g=[];k=[];s=[];n=p;for(m=q;n||m;)q=l[n][m]-1,m&&q===l[n][m-1]?k.push(g[g.length]={status:e,value:d[--m],index:m}):
n&&q===l[n-1][m]?s.push(g[g.length]={status:f,value:b[--n],index:n}):(--m,--n,h.sparse||g.push({status:"retained",value:d[m]}));a.a.nb(k,s,10*p);return g.reverse()}return function(a,d,e){e="boolean"===typeof e?{dontLimitMoves:e}:e||{};a=a||[];d=d||[];return a.length<=d.length?b(a,d,"added","deleted",e):b(d,a,"deleted","added",e)}}();a.b("utils.compareArrays",a.a.Aa);(function(){function b(b,c,f,h,g){var k=[],l=a.h(function(){var l=c(f,g,a.a.ea(k,b))||[];0<k.length&&(a.a.Bb(k,l),h&&a.k.t(h,null,[f,
l,g]));k.length=0;a.a.$(k,l)},null,{G:b,Da:function(){return!a.a.eb(k)}});return{S:k,h:l.ga()?l:p}}var c=a.a.f.L();a.a.Ua=function(d,e,f,h,g){function k(b,c){v=r[c];u!==c&&(z[b]=v);v.Ia(u++);a.a.ea(v.S,d);s.push(v);y.push(v)}function l(b,c){if(b)for(var d=0,e=c.length;d<e;d++)c[d]&&a.a.r(c[d].S,function(a){b(a,d,c[d].ka)})}e=e||[];h=h||{};var n=a.a.f.get(d,c)===p,r=a.a.f.get(d,c)||[],m=a.a.ya(r,function(a){return a.ka}),q=a.a.Aa(m,e,h.dontLimitMoves),s=[],t=0,u=0,w=[],y=[];e=[];for(var z=[],m=[],
v,x=0,A,C;A=q[x];x++)switch(C=A.moved,A.status){case "deleted":C===p&&(v=r[t],v.h&&v.h.F(),w.push.apply(w,a.a.ea(v.S,d)),h.beforeRemove&&(e[x]=v,y.push(v)));t++;break;case "retained":k(x,t++);break;case "added":C!==p?k(x,C):(v={ka:A.value,Ia:a.m(u++)},s.push(v),y.push(v),n||(m[x]=v))}l(h.beforeMove,z);a.a.r(w,h.beforeRemove?a.M:a.removeNode);for(var x=0,n=a.e.firstChild(d),E;v=y[x];x++){v.S||a.a.extend(v,b(d,f,v.ka,g,v.Ia));for(t=0;q=v.S[t];n=q.nextSibling,E=q,t++)q!==n&&a.e.rb(d,q,E);!v.Zb&&g&&(g(v.ka,
v.S,v.Ia),v.Zb=!0)}l(h.beforeRemove,e);l(h.afterMove,z);l(h.afterAdd,m);a.a.f.set(d,c,s)}})();a.b("utils.setDomNodeChildrenFromArrayMapping",a.a.Ua);a.K=function(){this.allowTemplateRewriting=!1};a.K.prototype=new a.C;a.K.prototype.renderTemplateSource=function(b){var c=(9>a.a.oa?0:b.nodes)?b.nodes():null;if(c)return a.a.R(c.cloneNode(!0).childNodes);b=b.text();return a.a.Qa(b)};a.K.Ja=new a.K;a.Wa(a.K.Ja);a.b("nativeTemplateEngine",a.K);(function(){a.La=function(){var a=this.ac=function(){if(!t||
!t.tmpl)return 0;try{if(0<=t.tmpl.tag.tmpl.open.toString().indexOf("__"))return 2}catch(a){}return 1}();this.renderTemplateSource=function(b,e,f){f=f||{};if(2>a)throw Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");var h=b.data("precompiled");h||(h=b.text()||"",h=t.template(null,"{{ko_with $item.koBindingContext}}"+h+"{{/ko_with}}"),b.data("precompiled",h));b=[e.$data];e=t.extend({koBindingContext:e},f.templateOptions);e=t.tmpl(h,b,e);e.appendTo(w.createElement("div"));
t.fragments={};return e};this.createJavaScriptEvaluatorBlock=function(a){return"{{ko_code ((function() { return "+a+" })()) }}"};this.addTemplate=function(a,b){w.write("<script type='text/html' id='"+a+"'>"+b+"\x3c/script>")};0<a&&(t.tmpl.tag.ko_code={open:"__.push($1 || '');"},t.tmpl.tag.ko_with={open:"with($1) {",close:"} "})};a.La.prototype=new a.C;var b=new a.La;0<b.ac&&a.Wa(b);a.b("jqueryTmplTemplateEngine",a.La)})()})})();})();
/*
 Knockout.Punches
 Enhanced binding syntaxes for Knockout 3+
 (c) Michael Best
 License: MIT (https://www.opensource.org/licenses/mit-license.php)
 Version 0.4.0
*/

(function(d){"function"===typeof define&&define.amd?define(["knockout"],d):d(ko)})(function(d){function k(a,b){return s(z(a),"preprocess",b)}function z(a){return"object"===typeof a?a:d.getBindingHandler(a)||(d.bindingHandlers[a]={})}function s(a,b,c){if(a[b]){var f=a[b];a[b]=function(a,b,d){if(a=f.call(this,a,b,d))return c.call(this,a,b,d)}}else a[b]=c;return a}function p(a){var b=d.bindingProvider.instance;if(b.preprocessNode){var c=b.preprocessNode;b.preprocessNode=function(b){var d=c.call(this,
b);d||(d=a.call(this,b));return d}}else b.preprocessNode=a}function B(a,b){var c=d.getBindingHandler;d.getBindingHandler=function(f){var d;return c(f)||(d=f.match(a))&&b(d,f)}}function t(a){if(-1===a.indexOf("|"))return a;var b=a.match(/"([^"\\]|\\.)*"|'([^'\\]|\\.)*'|\|\||[|:]|[^\s|:"'][^|:"']*[^\s|:"']|[^\s|:"']/g);if(b&&1<b.length){b.push("|");a=b[0];for(var c,d,e=!1,h=!1,A=0,C=1;d=b[C];++C)"|"===d?(e&&(":"===c&&(a+="undefined"),a+=")",++A),e=h=!0):(h?(A||(!/^[$_a-zA-Z][$\w]*$/.test(a)||/^(true|false|null|undefined)$/.test(a))||
(a="$data."+a),a="ko.filters['"+d+"']("+a):e&&":"===d?(":"===c&&(a+="undefined"),a+=","):a+=d,h=!1),c=d}return a}function u(a){k(a,t)}function v(a,b,c){function f(c){e[c]&&(e[c]=function(f,e){var g=Array.prototype.slice.call(arguments,0);g[1]=function(){var b={};b[a]=e();return b};return d.bindingHandlers[b][c].apply(this,g)})}var e=d.utils.extend({},this);f("init");f("update");e.preprocess&&(e.preprocess=null);d.virtualElements.allowedBindings[b]&&(d.virtualElements.allowedBindings[c]=!0);return e}
function w(a,b){var c=d.getBindingHandler(a);if(c){var f=c.getNamespacedHandler||v;c.getNamespacedHandler=function(){return k(f.apply(this,arguments),b)}}}function D(a,b,c){if("{"!==a.charAt(0))return a;a=d.expressionRewriting.parseObjectLiteral(a);d.utils.arrayForEach(a,function(a){c(b+E+a.key,a.value)})}function n(a){k(a,D)}function m(a){return/^([$_a-z][$\w]*|.+(\.\s*[$_a-z][$\w]*|\[.+\]))$/i.test(a)?"function(_x,_y,_z){return("+a+")(_x,_y,_z);}":a}function q(a){k(a,m)}function r(a,b,c){a=z(a);
a._propertyPreprocessors||(s(a,"preprocess",N),a._propertyPreprocessors={});s(a._propertyPreprocessors,b,c)}function N(a,b,c){if("{"!==a.charAt(0))return a;a=d.expressionRewriting.parseObjectLiteral(a);var f=[],e=this._propertyPreprocessors||{};d.utils.arrayForEach(a,function(a){var b=a.key;a=a.value;e[b]&&(a=e[b](a,b,c));a&&f.push("'"+b+"':"+a)});return"{"+f.join(",")+"}"}function x(a){return function(b){return"function("+a+"){return("+b+");}"}}function F(a,b,c){function d(a){var h=a.match(/^([\s\S]*)}}([\s\S]*?)\{\{([\s\S]*)$/);
h?(d(h[1]),b(h[2]),c(h[3])):c(a)}if(a=a.match(/^([\s\S]*?)\{\{([\s\S]*)}}([\s\S]*)$/))b(a[1]),d(a[2]),b(a[3])}function G(a){return null==a?"":a.trim?a.trim():a.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")}function H(a){if(3===a.nodeType&&a.nodeValue&&-1!==a.nodeValue.indexOf("{{")&&"TEXTAREA"!=(a.parentNode||{}).nodeName){var b=[];F(a.nodeValue,function(a){a&&b.push(document.createTextNode(a))},function(c){c&&b.push.apply(b,O.wrapExpression(G(c),a))});if(b.length){if(a.parentNode){for(var c=0,
d=b.length,e=a.parentNode;c<d;++c)e.insertBefore(b[c],a);e.removeChild(a)}return b}}}function I(){p(H)}function J(a){if(1===a.nodeType&&a.attributes.length)for(var b=a.getAttribute(y),c=d.utils.arrayPushAll([],a.attributes),f=c.length,e=0;e<f;++e){var h=c[e];if(h.specified&&h.name!=y&&-1!==h.value.indexOf("{{")){var g=[],k="";F(h.value,function(a){a&&g.push('"'+a.replace(/"/g,'\\"')+'"')},function(a){a&&(k=a,g.push("ko.unwrap("+a+")"))});1<g.length&&(k='""+'+g.join("+"));if(k){var l=h.name.toLowerCase(),
l=P.attributeBinding(l,k,a)||K(l,k,a),b=b?b+(","+l):l;a.setAttribute(y,b);a.removeAttribute(h.name)}}}}function K(a,b,c){return d.getBindingHandler(a)?a+":"+b:"attr."+a+":"+b}function L(){p(J)}var l=d.unwrap,g=d.punches={utils:{addBindingPreprocessor:k,addNodePreprocessor:p,addBindingHandlerCreator:B,setBindingPreprocessor:k,setNodePreprocessor:p}};g.enableAll=function(){I();L();n("attr");n("css");n("event");n("style");u("text");u("html");w("attr",t);q("click");q("submit");q("optionsAfterRender");
w("event",m);r("template","beforeRemove",m);r("template","afterAdd",m);r("template","afterRender",m)};d.filters={uppercase:function(a){return String.prototype.toUpperCase.call(l(a))},lowercase:function(a){return String.prototype.toLowerCase.call(l(a))},"default":function(a,b){a=l(a);return"function"===typeof a?a:"string"===typeof a?""===G(a)?b:a:null==a||0==a.length?b:a},replace:function(a,b,c){return String.prototype.replace.call(l(a),b,c)},fit:function(a,b,c,d){a=l(a);if(b&&(""+a).length>b)switch(c=
""+(c||"..."),b-=c.length,a=""+a,d){case "left":return c+a.slice(-b);case "middle":return d=Math.ceil(b/2),a.substr(0,d)+c+a.slice(d-b);default:return a.substr(0,b)+c}else return a},json:function(a,b,c){return d.toJSON(a,c,b)},number:function(a){return(+l(a)).toLocaleString()}};g.textFilter={preprocessor:t,enableForBinding:u};var E=".";B(/([^\.]+)\.(.+)/,function(a,b){var c=a[1],f=d.bindingHandlers[c];if(f)return c=(f.getNamespacedHandler||v).call(f,a[2],c,b),d.bindingHandlers[b]=c});g.namespacedBinding=
{defaultGetHandler:v,setDefaultBindingPreprocessor:w,preprocessor:D,enableForBinding:n};g.wrappedCallback={preprocessor:m,enableForBinding:q};g.preprocessBindingProperty={setPreprocessor:r};var M=x("$data,$event");g.expressionCallback={makePreprocessor:x,eventPreprocessor:M,enableForBinding:function(a,b){b=Array.prototype.slice.call(arguments,1).join();k(a,x(b))}};d.bindingHandlers.on={getNamespacedHandler:function(a){a=d.getBindingHandler("event"+E+a);return k(a,M)}};if(!d.virtualElements.allowedBindings.html){var Q=
d.bindingHandlers.html.update;d.bindingHandlers.html.update=function(a,b){if(8===a.nodeType){var c=l(b());null!=c?(c=d.utils.parseHtmlFragment(""+c),d.virtualElements.setDomNodeChildren(a,c)):d.virtualElements.emptyNode(a)}else Q(a,b)};d.virtualElements.allowedBindings.html=!0}var O=g.interpolationMarkup={preprocessor:H,enable:I,wrapExpression:function(a,b){var c=b?b.ownerDocument:document,d=c.createComment("/ko"),e=a[0];return"#"===e?[c.createComment("ko "+a.slice(1))]:"/"===e?[d]:"{"===e&&"}"===
a[a.length-1]?[c.createComment("ko html:"+a.slice(1,-1)),d]:[c.createComment("ko text:"+a),d]}},y="data-bind",P=g.attributeInterpolationMarkup={preprocessor:J,enable:L,attributeBinding:K};return g});
(function() {
  ko.subscribable.fn.watch = function(targetOrCallback, options, callback, context) {
    var type;
    type = typeof targetOrCallback;
    switch (false) {
      case !(type === 'boolean' || type === 'undefined'):
        ko.watch(this, {
          enabled: targetOrCallback !== false
        });
        break;
      case !(type === 'function' && !ko.isSubscribable(targetOrCallback)):
        ko.watch(this, options || {}, targetOrCallback, context || this);
        break;
      default:
        ko.watch(targetOrCallback, options, callback, context || this);
    }
    return this;
  };

  ko.watch = function(target, options, callback, context) {
    var watchChildren;
    watchChildren = function(child, parent, grandParents, stopWatching, keepOffParentList) {
      var c, newParent, parents, s, subscriptions, _i, _j, _len, _len1, _ref, _results;
      if (!child) {
        return;
      }
      if (!(child === target || child.watchable || (typeof child === 'object' && child.watchable !== false))) {
        return;
      }
      if (options.enabled != null) {
        child.watchable = options.enabled;
      }
      if (child.watchable === false) {
        return;
      }
      if (child === parent || ko.utils.arrayIndexOf(grandParents, child) > -1) {
        return;
      }
      parents = [].concat(grandParents, (parent && parent !== target ? parent : []));
      newParent = (!keepOffParentList ? child : void 0);
      if (ko.isSubscribable(child)) {
        if (!callback) {
          return;
        }
        if (typeof child.pop === 'function') {
          child.subscribe((function(changes) {
            return ko.utils.arrayForEach(changes, function(item) {
              var returnValue;
              returnValue = callback.call(context, parents, child, item);
              if (returnValue != null) {
                context(returnValue);
              }
              if (!item.moved) {
                return setTimeout((function() {
                  return watchChildren(item.value, newParent, parents, item.status === 'deleted');
                }), 0);
              }
            });
          }), void 0, 'arrayChange');
          return watchChildren(child(), newParent, parents, stopWatching, true);
        } else {
          if (stopWatching) {
            subscriptions = child.H || child._subscriptions;
            if (subscriptions && subscriptions.change) {
              _ref = subscriptions.change;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                s = _ref[_i];
                if (s._watcher === context) {
                  s.dispose();
                }
              }
            }
            return watchChildren(child(), newParent, parents, true, true);
          } else {
            if (options.enabled === true && child.watchable === false) {
              return;
            }
            child.subscribe(function() {
              var returnValue;
              if (child.watchable !== false) {
                returnValue = callback.call(context, parents, child);
                if (returnValue != null) {
                  return context(returnValue);
                }
              }
            }, null, 'change')._watcher = context;
            return watchChildren(child(), newParent, parents);
          }
        }
      } else {
        switch (Object.prototype.toString.call(child)) {
          case '[object Object]':
            return ko.utils.objectForEach(child, function(property, sub) {
              watchChildren(sub, newParent, parents, stopWatching);
              if (sub && !sub['_field']) {
                return sub['_field'] = property;
              }
            });
          case '[object Array]':
            _results = [];
            for (_j = 0, _len1 = child.length; _j < _len1; _j++) {
              c = child[_j];
              _results.push(watchChildren(c, newParent, parents, stopWatching));
            }
            return _results;
        }
      }
    };
    if (typeof options === 'function') {
      context = context || callback;
      callback = options;
      options = {};
    }
    if (context == null) {
      context = this;
    }
    if (typeof target === 'function' && !ko.isSubscribable(target)) {
      return ko.computed(target, callback, options);
    }
    return watchChildren(target, null, []);
  };

}).call(this);
(function() {
  ko.bindingHandlers.editor = {
    init: function(element, valueAccessor, allBindings) {
      var editor, isComputed, klass, observable, type, value;
      observable = valueAccessor();
      value = ko.unwrap(observable);
      element = $(element);
      element.html(value);
      type = allBindings.get('editorType') || 'full';
      klass = type.charAt(0).toUpperCase() + type.slice(1);
      isComputed = ko.isComputed(observable);
      editor = new Noba.Editor[klass](element, {
        onChange: function(content) {
          return observable(isComputed ? {
            content: content,
            editor: this
          } : content);
        }
      });
      return observable(isComputed ? {
        content: "" + value + " ",
        editor: editor
      } : value);
    }
  };

}).call(this);
(function() {
  ko.bindingHandlers.log = {
    update: function(element, valueAccessor, allBindings) {
      var observable, value;
      observable = valueAccessor();
      value = ko.unwrap(observable);
      return console.log(value);
    }
  };

}).call(this);
(function() {
  ko.bindingHandlers.modal = {
    init: function(element, valueAccessor) {
      var observable, value;
      observable = valueAccessor();
      value = ko.unwrap(observable);
      element = $(element);
      element.modal({
        show: value
      });
      if (ko.isObservable(observable)) {
        element.on('hide.bs.modal', function() {
          return observable(false);
        });
      }
      return ko.utils.domNodeDisposal.addDisposeCallback(element[0], function() {
        return element.modal('destroy');
      });
    },
    update: function(element, valueAccessor) {
      var action, value;
      value = ko.unwrap(valueAccessor());
      action = value ? 'show' : 'hide';
      return $(element).modal(action);
    }
  };

}).call(this);
(function() {
  ko.bindingHandlers.selectTags = {
    init: function(element, valueAccessor, allBindings) {
      var observable, options, select2, value;
      if (!(element.tagName === 'INPUT' && element.getAttribute('type') === 'text')) {
        throw Error('The selectTags binding can only be used with a text field.');
      }
      observable = valueAccessor();
      value = ko.unwrap(observable);
      element = $(element);
      element.on('change', function(e) {
        return observable(e.val);
      });
      options = {
        url: allBindings.get('selectSource'),
        multiple: true,
        browse: true,
        allowCreate: true
      };
      select2 = new Noba.Select2(element, value, options);
      return ko.utils.domNodeDisposal.addDisposeCallback(element, select2.destroy);
    }
  };

  ko.bindingHandlers.selectMultiple = {
    init: function(element, valueAccessor, allBindings) {
      var observable, options, select2, value;
      observable = valueAccessor();
      value = ko.unwrap(observable);
      $(element).on('change', function(e) {
        return observable(e.val);
      });
      options = {
        url: allBindings.get('selectSource'),
        browse: true,
        multiple: true
      };
      select2 = new Noba.Select2(element, value, options);
      return ko.utils.domNodeDisposal.addDisposeCallback(element, select2.destroy);
    }
  };

}).call(this);
(function() {
  ko.filters.markdown = function(value) {
    value = ko.unwrap(value);
    if (value) {
      return value.replace(/\*(.+?)\*/g, '<em>$1</em>');
    }
  };

}).call(this);
(function() {
  ko.subscribable.fn.blank = function() {
    var value;
    value = this();
    return !value || value === '';
  };

  ko.subscribable.fn.present = function() {
    var value;
    value = this();
    return value && value !== '';
  };

  ko.subscribable.fn.empty = function() {
    var value;
    value = this();
    return value.length === 0;
  };

  ko.subscribable.fn.any = function() {
    var value;
    value = this();
    return value.length !== 0;
  };

}).call(this);
(function() {
  ko.observableArray.fn.find = function(name, value) {
    var item, _i, _len, _ref;
    _ref = this();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (ko.unwrap(item[name]) === value && !item._destroy) {
        return item;
      }
    }
    return null;
  };

  ko.observableArray.fn.select = function(name, value) {
    var item, _i, _len, _ref, _results;
    _ref = this();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (ko.unwrap(item[name]) === value && !item._destroy) {
        _results.push(item);
      }
    }
    return _results;
  };

  ko.observableArray.fn.filteredBy = function(name, value) {
    var _this = this;
    return ko.computed(function() {
      return _this.select(name, value);
    });
  };

}).call(this);
(function() {
  ko.subscribable.fn.trimmed = function() {
    return ko.computed({
      read: function() {
        var _ref;
        return ((_ref = this()) != null ? _ref.trim() : void 0) || '';
      },
      write: function(value) {
        this((value != null ? value.trim() : void 0) || '');
        return this.valueHasMutated();
      },
      owner: this
    });
  };

}).call(this);
(function() {
  var Store,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  namespace({
    Noba: Store = (function() {
      function Store(url, options) {
        this.url = url;
        this.options = options;
        this.handleChange = __bind(this.handleChange, this);
        this.persist = __bind(this.persist, this);
        this.watch = __bind(this.watch, this);
        this.status = ko.observable('clean');
        this.shouldPersist = ko.computed(this.persist).extend({
          rateLimit: 1000
        });
      }

      Store.prototype.watch = function(target) {
        this.target = target;
        if (this.changes) {
          return;
        }
        this.changes = {};
        if (this.target.beforeWatch) {
          this.target.beforeWatch();
        }
        ko.watch(this, {
          enabled: false
        });
        return ko.watch(this.target, this.handleChange);
      };

      Store.prototype.persist = function() {
        var data,
          _this = this;
        if (this.status() !== 'dirty') {
          return;
        }
        data = {};
        if (this.options.prefix) {
          data[this.options.prefix] = this.changes;
        } else {
          $.extend(data, this.changes);
        }
        if (this.options.method) {
          data['_method'] = this.options.method;
        }
        this.changes = {};
        return $.ajax({
          url: this.url,
          type: 'POST',
          data: data,
          success: function(data) {
            return _this.status('saved');
          },
          error: function() {
            return _this.status('error');
          }
        });
      };

      Store.prototype.handleChange = function(parents, child, item) {
        var field, value;
        switch (parents.length) {
          case 0:
            field = child['_field'];
            value = ko.toJS(child);
            break;
          case 1:
            field = child['_field'];
            value = parents[0].toJS();
            break;
          default:
            field = parents[1]['_field'];
            value = parents[0].toJS();
        }
        if (typeof value === 'object' && value.length === 0) {
          value = '_';
        }
        this.changes[field] = value;
        this.status('dirty');
        return null;
      };

      return Store;

    })()
  });

}).call(this);
(function() {
  ko.punches.interpolationMarkup.enable();

  ko.punches.attributeInterpolationMarkup.enable();

  ko.punches.textFilter.enableForBinding('text');

  ko.punches.textFilter.enableForBinding('html');

}).call(this);
(function($){    
// jQuery autoGrowInput plugin by James Padolsey
// See related thread: https://stackoverflow.com/questions/931207/is-there-a-jquery-autogrow-plugin-for-text-fields
    
    $.fn.autoGrowInput = function(o) {
        o = $.extend({ maxWidth: 1000, minWidth: 0, comfortZone: 30 }, o);
        
        this.filter('input:text').each(function(){
            var minWidth = o.minWidth || $(this).width(),
                val = '',
                input = $(this),
                testSubject = $('<tester/>').css({
                    position: 'absolute',
                    top: -9999,
                    left: -9999,
                    width: 'auto',
                    fontSize: input.css('fontSize'),
                    fontFamily: input.css('fontFamily'),
                    fontWeight: input.css('fontWeight'),
                    letterSpacing: input.css('letterSpacing'),
                    whiteSpace: 'nowrap'
                }),
                check = function() {
                    
                    if (val === (val = input.val())) {return;}
                    
                    // Enter new content into testSubject
                    var escaped = val.replace(/&/g, '&amp;').replace(/\s/g,'&nbsp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    testSubject.html(escaped);
                    
                    // Calculate new width + whether to change
                    var testerWidth = testSubject.width(),
                        newWidth = (testerWidth + o.comfortZone) >= minWidth ? testerWidth + o.comfortZone : minWidth,
                        currentWidth = input.width(),
                        isValidWidthChange = (newWidth < currentWidth && newWidth >= minWidth)
                                             || (newWidth > minWidth && newWidth < o.maxWidth);
                    
                    // Animate width
                    if (isValidWidthChange) {
                        input.width(newWidth);
                    }
                    
                };
                
            testSubject.insertAfter(input);
            
            $(this).bind('keyup keydown blur update', check);
            check();
        });
        
        return this;
    
    };

})(jQuery);
(function() {
  $(function() {
    return $('input[data-autogrow]').autoGrowInput();
  });

}).call(this);
(function() {
  var __slice = [].slice,
    __hasProp = {}.hasOwnProperty;

  $(function() {
    var element, elements, getSetValue, joinValues, selector, selectors, sources, targets, _i, _len;
    elements = $('[data-copy-from]');
    if (elements.length !== 0) {
      getSetValue = function() {
        var args, element, tag;
        element = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        tag = element[0].tagName;
        if (tag === "SELECT") {
          element = element.find('option:selected');
        }
        return element[tag === "INPUT" ? 'val' : 'text'].apply(element, args);
      };
      joinValues = function() {
        var input, inputs, value, values;
        inputs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        values = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = inputs.length; _i < _len; _i++) {
            input = inputs[_i];
            _results.push($.trim(getSetValue(input)));
          }
          return _results;
        })();
        values = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = values.length; _i < _len; _i++) {
            value = values[_i];
            if (value) {
              _results.push(value);
            }
          }
          return _results;
        })();
        return values.join(' ');
      };
      targets = {};
      sources = {};
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        element = elements[_i];
        element = $(element);
        element.attr('data-copy-default', getSetValue(element));
        selectors = element.attr('data-copy-from');
        if (sources[selectors] == null) {
          sources[selectors] = (function() {
            var _j, _len1, _ref, _results;
            _ref = selectors.match(/#[a-z]+[_a-z0-9-]*/ig);
            _results = [];
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              selector = _ref[_j];
              _results.push($(selector));
            }
            return _results;
          })();
        }
        if (targets[selectors] == null) {
          targets[selectors] = [];
        }
        targets[selectors].push(element);
      }
      return setInterval(function() {
        var currentValue, inputs, newValue, target, value, _results;
        _results = [];
        for (selectors in sources) {
          if (!__hasProp.call(sources, selectors)) continue;
          inputs = sources[selectors];
          value = joinValues.apply(null, inputs);
          _results.push((function() {
            var _j, _len1, _ref, _results1;
            _ref = targets[selectors];
            _results1 = [];
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              target = _ref[_j];
              currentValue = getSetValue(target);
              newValue = value || target.attr('data-copy-default');
              if (currentValue !== newValue) {
                _results1.push(getSetValue(target, newValue));
              } else {
                _results1.push(void 0);
              }
            }
            return _results1;
          })());
        }
        return _results;
      }, 50);
    }
  });

}).call(this);
/**
 * Intro.js v0.9.0
 * https://github.com/usablica/intro.js
 * MIT licensed
 *
 * Copyright (C) 2013 usabli.ca - A weekend project by Afshin Mehrabani (@afshinmeh)
 */


(function (root, factory) {
  if (typeof exports === 'object') {
    // CommonJS
    factory(exports);
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['exports'], factory);
  } else {
    // Browser globals
    factory(root);
  }
} (this, function (exports) {
  //Default config/variables
  var VERSION = '0.9.0';

  /**
   * IntroJs main class
   *
   * @class IntroJs
   */
  function IntroJs(obj) {
    this._targetElement = obj;

    this._options = {
      /* Next button label in tooltip box */
      nextLabel: 'Next &rarr;',
      /* Previous button label in tooltip box */
      prevLabel: '&larr; Back',
      /* Skip button label in tooltip box */
      skipLabel: 'Skip',
      /* Done button label in tooltip box */
      doneLabel: 'Done',
      /* Default tooltip box position */
      tooltipPosition: 'bottom',
      /* Next CSS class for tooltip boxes */
      tooltipClass: '',
      /* Close introduction when pressing Escape button? */
      exitOnEsc: true,
      /* Close introduction when clicking on overlay layer? */
      exitOnOverlayClick: true,
      /* Show step numbers in introduction? */
      showStepNumbers: true,
      /* Let user use keyboard to navigate the tour? */
      keyboardNavigation: true,
      /* Show tour control buttons? */
      showButtons: true,
      /* Show tour bullets? */
      showBullets: true,
      /* Scroll to highlighted element? */
      scrollToElement: true,
      /* Set the overlay opacity */
      overlayOpacity: 0.8
    };
  }

  /**
   * Initiate a new introduction/guide from an element in the page
   *
   * @api private
   * @method _introForElement
   * @param {Object} targetElm
   * @returns {Boolean} Success or not?
   */
  function _introForElement(targetElm) {
    var introItems = [],
        self = this;

    if (this._options.steps) {
      //use steps passed programmatically
      var allIntroSteps = [];

      for (var i = 0, stepsLength = this._options.steps.length; i < stepsLength; i++) {
        var currentItem = _cloneObject(this._options.steps[i]);
        //set the step
        currentItem.step = introItems.length + 1;
        //use querySelector function only when developer used CSS selector
        if (typeof(currentItem.element) === 'string') {
          //grab the element with given selector from the page
          currentItem.element = document.querySelector(currentItem.element);
        }

        //intro without element
        if (!currentItem.selector && (typeof(currentItem.element) === 'undefined' || currentItem.element == null)) {
          var floatingElementQuery = document.querySelector(".introjsFloatingElement");

          if (floatingElementQuery == null) {
            floatingElementQuery = document.createElement('div');
            floatingElementQuery.className = 'introjsFloatingElement';

            document.body.appendChild(floatingElementQuery);
          }

          currentItem.element  = floatingElementQuery;
          currentItem.position = 'floating';
        }

        if (currentItem.selector || currentItem.element != null) {
          introItems.push(currentItem);
        }
      }

    } else {
       //use steps from data-* annotations
      var allIntroSteps = targetElm.querySelectorAll('*[data-intro]');
      //if there's no element to intro
      if (allIntroSteps.length < 1) {
        return false;
      }

      //first add intro items with data-step
      for (var i = 0, elmsLength = allIntroSteps.length; i < elmsLength; i++) {
        var currentElement = allIntroSteps[i];
        var step = parseInt(currentElement.getAttribute('data-step'), 10);

        if (step > 0) {
          introItems[step - 1] = {
            element: currentElement,
            intro: currentElement.getAttribute('data-intro'),
            step: parseInt(currentElement.getAttribute('data-step'), 10),
            tooltipClass: currentElement.getAttribute('data-tooltipClass'),
            position: currentElement.getAttribute('data-position') || this._options.tooltipPosition
          };
        }
      }

      //next add intro items without data-step
      //todo: we need a cleanup here, two loops are redundant
      var nextStep = 0;
      for (var i = 0, elmsLength = allIntroSteps.length; i < elmsLength; i++) {
        var currentElement = allIntroSteps[i];

        if (currentElement.getAttribute('data-step') == null) {

          while (true) {
            if (typeof introItems[nextStep] == 'undefined') {
              break;
            } else {
              nextStep++;
            }
          }

          introItems[nextStep] = {
            element: currentElement,
            intro: currentElement.getAttribute('data-intro'),
            step: nextStep + 1,
            tooltipClass: currentElement.getAttribute('data-tooltipClass'),
            position: currentElement.getAttribute('data-position') || this._options.tooltipPosition
          };
        }
      }
    }

    //removing undefined/null elements
    var tempIntroItems = [];
    for (var z = 0; z < introItems.length; z++) {
      introItems[z] && tempIntroItems.push(introItems[z]);  // copy non-empty values to the end of the array
    }

    introItems = tempIntroItems;

    //Ok, sort all items with given steps
    introItems.sort(function (a, b) {
      return a.step - b.step;
    });

    //set it to the introJs object
    self._introItems = introItems;

    //add overlay layer to the page
    if(_addOverlayLayer.call(self, targetElm)) {
      //then, start the show
      _nextStep.call(self);

      var skipButton     = targetElm.querySelector('.introjs-skipbutton'),
          nextStepButton = targetElm.querySelector('.introjs-nextbutton');

      self._onKeyDown = function(e) {
        if (e.keyCode === 27 && self._options.exitOnEsc == true) {
          //escape key pressed, exit the intro
          _exitIntro.call(self, targetElm);
          //check if any callback is defined
          if (self._introExitCallback != undefined) {
            self._introExitCallback.call(self);
          }
        } else if(e.keyCode === 37) {
          //left arrow
          _previousStep.call(self);
        } else if (e.keyCode === 39 || e.keyCode === 13) {
          //right arrow or enter
          _nextStep.call(self);
          //prevent default behaviour on hitting Enter, to prevent steps being skipped in some browsers
          if(e.preventDefault) {
            e.preventDefault();
          } else {
            e.returnValue = false;
          }
        }
      };

      self._onResize = function(e) {
        _setHelperLayerPosition.call(self, document.querySelector('.introjs-helperLayer'));
      };

      if (window.addEventListener) {
        if (this._options.keyboardNavigation) {
          window.addEventListener('keydown', self._onKeyDown, true);
        }
        //for window resize
        window.addEventListener("resize", self._onResize, true);
      } else if (document.attachEvent) { //IE
        if (this._options.keyboardNavigation) {
          document.attachEvent('onkeydown', self._onKeyDown);
        }
        //for window resize
        document.attachEvent("onresize", self._onResize);
      }
    }
    return false;
  }

 /*
   * makes a copy of the object
   * @api private
   * @method _cloneObject
  */
  function _cloneObject(object) {
      if (object == null || typeof (object) != 'object' || typeof (object.nodeType) != 'undefined') {
          return object;
      }
      var temp = {};
      for (var key in object) {
          temp[key] = _cloneObject(object[key]);
      }
      return temp;
  }
  /**
   * Go to specific step of introduction
   *
   * @api private
   * @method _goToStep
   */
  function _goToStep(step) {
    //because steps starts with zero
    this._currentStep = step - 2;
    if (typeof (this._introItems) !== 'undefined') {
      _nextStep.call(this);
    }
  }

  /**
   * Go to next step on intro
   *
   * @api private
   * @method _nextStep
   */
  function _nextStep() {
    this._direction = 'forward';

    if (typeof (this._currentStep) === 'undefined') {
      this._currentStep = 0;
    } else {
      ++this._currentStep;
    }

    if ((this._introItems.length) <= this._currentStep) {
      //end of the intro
      //check if any callback is defined
      if (typeof (this._introCompleteCallback) === 'function') {
        this._introCompleteCallback.call(this);
      }
      _exitIntro.call(this, this._targetElement);
      return;
    }

    var nextStep = this._introItems[this._currentStep];
    if (typeof (this._introBeforeChangeCallback) !== 'undefined') {
      this._introBeforeChangeCallback.call(this, nextStep.element);
    }

    _showElement.call(this, nextStep);
  }

  /**
   * Go to previous step on intro
   *
   * @api private
   * @method _nextStep
   */
  function _previousStep() {
    this._direction = 'backward';

    if (this._currentStep === 0) {
      return false;
    }

    var nextStep = this._introItems[--this._currentStep];
    if (typeof (this._introBeforeChangeCallback) !== 'undefined') {
      this._introBeforeChangeCallback.call(this, nextStep.element);
    }

    _showElement.call(this, nextStep);
  }

  /**
   * Exit from intro
   *
   * @api private
   * @method _exitIntro
   * @param {Object} targetElement
   */
  function _exitIntro(targetElement) {
    //remove overlay layer from the page
    var overlayLayer = targetElement.querySelector('.introjs-overlay');

    //return if intro already completed or skipped
    if (overlayLayer == null) {
      return;
    }

    //for fade-out animation
    overlayLayer.style.opacity = 0;
    setTimeout(function () {
      if (overlayLayer.parentNode) {
        overlayLayer.parentNode.removeChild(overlayLayer);
      }
    }, 500);

    //remove all helper layers
    var helperLayer = targetElement.querySelector('.introjs-helperLayer');
    if (helperLayer) {
      helperLayer.parentNode.removeChild(helperLayer);
    }

    //remove intro floating element
    var floatingElement = document.querySelector('.introjsFloatingElement');
    if (floatingElement) {
      floatingElement.parentNode.removeChild(floatingElement);
    }

    //remove `introjs-showElement` class from the element
    var showElement = document.querySelector('.introjs-showElement');
    if (showElement) {
      showElement.className = showElement.className.replace(/introjs-[a-zA-Z]+/g, '').replace(/^\s+|\s+$/g, ''); // This is a manual trim.
    }

    //remove `introjs-fixParent` class from the elements
    var fixParents = document.querySelectorAll('.introjs-fixParent');
    if (fixParents && fixParents.length > 0) {
      for (var i = fixParents.length - 1; i >= 0; i--) {
        fixParents[i].className = fixParents[i].className.replace(/introjs-fixParent/g, '').replace(/^\s+|\s+$/g, '');
      };
    }

    //clean listeners
    if (window.removeEventListener) {
      window.removeEventListener('keydown', this._onKeyDown, true);
    } else if (document.detachEvent) { //IE
      document.detachEvent('onkeydown', this._onKeyDown);
    }

    //set the step to zero
    this._currentStep = undefined;
  }

  /**
   * Render tooltip box in the page
   *
   * @api private
   * @method _placeTooltip
   * @param {Object} targetElement
   * @param {Object} tooltipLayer
   * @param {Object} arrowLayer
   */
  function _placeTooltip(targetElement, tooltipLayer, arrowLayer, helperNumberLayer) {
    var tooltipCssClass = '',
        currentStepObj,
        tooltipOffset,
        targetElementOffset;

    //reset the old style
    tooltipLayer.style.top        = null;
    tooltipLayer.style.right      = null;
    tooltipLayer.style.bottom     = null;
    tooltipLayer.style.left       = null;
    tooltipLayer.style.marginLeft = null;
    tooltipLayer.style.marginTop  = null;

    arrowLayer.style.display = 'inherit';

    if (typeof(helperNumberLayer) != 'undefined' && helperNumberLayer != null) {
      helperNumberLayer.style.top  = null;
      helperNumberLayer.style.left = null;
    }

    //prevent error when `this._currentStep` is undefined
    if (!this._introItems[this._currentStep]) return;

    //if we have a custom css class for each step
    currentStepObj = this._introItems[this._currentStep];
    if (typeof (currentStepObj.tooltipClass) === 'string') {
      tooltipCssClass = currentStepObj.tooltipClass;
    } else {
      tooltipCssClass = this._options.tooltipClass;
    }

    tooltipLayer.className = ('introjs-tooltip ' + tooltipCssClass).replace(/^\s+|\s+$/g, '');

    //custom css class for tooltip boxes
    var tooltipCssClass = this._options.tooltipClass;

    currentTooltipPosition = this._introItems[this._currentStep].position;
    switch (currentTooltipPosition) {
      case 'top':
      case 'top-left-aligned':
        tooltipLayer.style.left = '15px';
        tooltipLayer.style.top = '-' + (_getOffset(tooltipLayer).height + 10) + 'px';
        arrowLayer.className = 'introjs-arrow bottom';
        break;
      case 'top-middle-aligned':
        tooltipLayer.style.left   = (targetElementOffset.width / 2 - tooltipOffset.width / 2) + 'px';
        tooltipLayer.style.top = '-' + (_getOffset(tooltipLayer).height + 10) + 'px';
        arrowLayer.className = 'introjs-arrow bottom-middle';
        break;
      case 'top-right-aligned':
        tooltipLayer.style.right = '0px';
        tooltipLayer.style.top = '-' + (_getOffset(tooltipLayer).height + 10) + 'px';
        arrowLayer.className = 'introjs-arrow bottom-right';
        break;

      case 'right':
        tooltipLayer.style.left = (_getOffset(targetElement).width + 20) + 'px';
        arrowLayer.className = 'introjs-arrow left';
        break;
      case 'left':
        if (this._options.showStepNumbers == true) {
          tooltipLayer.style.top = '15px';
        }
        tooltipLayer.style.right = (_getOffset(targetElement).width + 20) + 'px';
        arrowLayer.className = 'introjs-arrow right';
        break;
      case 'floating':
        arrowLayer.style.display = 'none';

        //we have to adjust the top and left of layer manually for intro items without element
        tooltipOffset = _getOffset(tooltipLayer);

        tooltipLayer.style.left   = '50%';
        tooltipLayer.style.top    = '50%';
        tooltipLayer.style.marginLeft = '-' + (tooltipOffset.width / 2)  + 'px';
        tooltipLayer.style.marginTop  = '-' + (tooltipOffset.height / 2) + 'px';

        if (typeof(helperNumberLayer) != 'undefined' && helperNumberLayer != null) {
          helperNumberLayer.style.left = '-' + ((tooltipOffset.width / 2) + 18) + 'px';
          helperNumberLayer.style.top  = '-' + ((tooltipOffset.height / 2) + 18) + 'px';
        }

        break;
      case 'bottom-right-aligned':
        arrowLayer.className      = 'introjs-arrow top-right';
        tooltipLayer.style.right  = '0px';
        tooltipLayer.style.bottom = '-' + (_getOffset(tooltipLayer).height + 10) + 'px';
        break;
      case 'bottom-middle-aligned':
        targetElementOffset = _getOffset(targetElement);
        tooltipOffset       = _getOffset(tooltipLayer);

        arrowLayer.className      = 'introjs-arrow top-middle';
        tooltipLayer.style.left   = (targetElementOffset.width / 2 - tooltipOffset.width / 2) + 'px';
        tooltipLayer.style.bottom = '-' + (tooltipOffset.height + 10) + 'px';
        break;
      case 'bottom-left-aligned':
      // Bottom-left-aligned is the same as the default bottom
      case 'bottom':
      // Bottom going to follow the default behavior
      default:
        tooltipLayer.style.bottom = '-' + (_getOffset(tooltipLayer).height + 10) + 'px';
        arrowLayer.className = 'introjs-arrow top';
        break;
    }
  }

  /**
   * Update the position of the helper layer on the screen
   *
   * @api private
   * @method _setHelperLayerPosition
   * @param {Object} helperLayer
   */
  function _setHelperLayerPosition(helperLayer) {
    if (helperLayer) {
      //prevent error when `this._currentStep` in undefined
      if (!this._introItems[this._currentStep]) return;

      var currentElement  = this._introItems[this._currentStep];

      if (currentElement.selector) {
        currentElement.element = document.querySelector(currentElement.selector);
        currentElement.element.offsetHeight;
      }

      var elementPosition = _getOffset(currentElement.element),
          widthHeightPadding = 16;

      if (currentElement.position == 'floating') {
        widthHeightPadding = 0;
      }

      //set new position to helper layer
      helperLayer.setAttribute('style', 'width: ' + (elementPosition.width  + widthHeightPadding)  + 'px; ' +
                                        'height:' + (elementPosition.height + widthHeightPadding)  + 'px; ' +
                                        'top:'    + (elementPosition.top    - 8)   + 'px;' +
                                        'left: '  + (elementPosition.left - 8)   + 'px;');
    }
  }

  /**
   * Show an element on the page
   *
   * @api private
   * @method _showElement
   * @param {Object} targetElement
   */
  function _showElement(targetElement) {
    if (targetElement.selector) {
      targetElement.element = document.querySelector(targetElement.selector);
      targetElement.element.offsetHeight;
    }

    if (typeof (this._introChangeCallback) !== 'undefined') {
      this._introChangeCallback.call(this, targetElement.element);
    }

    var self = this,
        oldHelperLayer = document.querySelector('.introjs-helperLayer'),
        elementPosition = _getOffset(targetElement.element);

    if (oldHelperLayer != null) {
      var oldHelperNumberLayer = oldHelperLayer.querySelector('.introjs-helperNumberLayer'),
          oldtooltipLayer      = oldHelperLayer.querySelector('.introjs-tooltiptext'),
          oldArrowLayer        = oldHelperLayer.querySelector('.introjs-arrow'),
          oldtooltipContainer  = oldHelperLayer.querySelector('.introjs-tooltip'),
          skipTooltipButton    = oldHelperLayer.querySelector('.introjs-skipbutton'),
          prevTooltipButton    = oldHelperLayer.querySelector('.introjs-prevbutton'),
          nextTooltipButton    = oldHelperLayer.querySelector('.introjs-nextbutton');

      //hide the tooltip
      oldtooltipContainer.style.opacity = 0;
      oldtooltipContainer.style.display = 'none';
      oldtooltipContainer.offsetHeight;

      if (oldHelperNumberLayer != null) {
        var lastIntroItem = this._introItems[(targetElement.step - 2 >= 0 ? targetElement.step - 2 : 0)];

        if (lastIntroItem != null && (this._direction == 'forward' && lastIntroItem.position == 'floating') || (this._direction == 'backward' && targetElement.position == 'floating')) {
          oldHelperNumberLayer.style.opacity = 0;
        }
      }

      //set new position to helper layer
      _setHelperLayerPosition.call(self, oldHelperLayer);

      //remove `introjs-fixParent` class from the elements
      var fixParents = document.querySelectorAll('.introjs-fixParent');
      if (fixParents && fixParents.length > 0) {
        for (var i = fixParents.length - 1; i >= 0; i--) {
          fixParents[i].className = fixParents[i].className.replace(/introjs-fixParent/g, '').replace(/^\s+|\s+$/g, '');
        };
      }

      //remove old classes
      var oldShowElement = document.querySelector('.introjs-showElement');
      if (oldShowElement) {
        oldShowElement.className = oldShowElement.className.replace(/introjs-[a-zA-Z]+/g, '').replace(/^\s+|\s+$/g, '');
      }

      //we should wait until the CSS3 transition is competed (it's 0.3 sec) to prevent incorrect `height` and `width` calculation
      if (self._lastShowElementTimer) {
        clearTimeout(self._lastShowElementTimer);
      }
      self._lastShowElementTimer = setTimeout(function() {
        //set current step to the label
        if (oldHelperNumberLayer != null) {
          oldHelperNumberLayer.innerHTML = targetElement.step;
        }
        //set current tooltip text
        oldtooltipLayer.innerHTML = targetElement.intro;
        oldtooltipContainer.style.display = 'block';
        oldtooltipContainer.offsetHeight;
        //set the tooltip position
        _placeTooltip.call(self, targetElement.element, oldtooltipContainer, oldArrowLayer, oldHelperNumberLayer);

        //change active bullet
        oldHelperLayer.querySelector('.introjs-bullets li > a.active').className = '';
        oldHelperLayer.querySelector('.introjs-bullets li > a[data-stepnumber="' + targetElement.step + '"]').className = 'active';

        //show the tooltip
        oldtooltipContainer.style.opacity = 1;
        if (oldHelperNumberLayer) oldHelperNumberLayer.style.opacity = 1;

        //add target element position style
        targetElement.element.className += ' introjs-showElement';
      }, 350);

    } else {
      var helperLayer       = document.createElement('div'),
          arrowLayer        = document.createElement('div'),
          tooltipLayer      = document.createElement('div'),
          tooltipTextLayer  = document.createElement('div'),
          bulletsLayer      = document.createElement('div'),
          buttonsLayer      = document.createElement('div');

      helperLayer.className = 'introjs-helperLayer';

      //set new position to helper layer
      _setHelperLayerPosition.call(self, helperLayer);

      //add helper layer to target element
      this._targetElement.appendChild(helperLayer);

      arrowLayer.className = 'introjs-arrow';

      tooltipTextLayer.className = 'introjs-tooltiptext';
      tooltipTextLayer.innerHTML = targetElement.intro;

      bulletsLayer.className = 'introjs-bullets';

      if (this._options.showBullets === false) {
        bulletsLayer.style.display = 'none';
      }

      var ulContainer = document.createElement('ul');

      for (var i = 0, stepsLength = this._introItems.length; i < stepsLength; i++) {
        var innerLi    = document.createElement('li');
        var anchorLink = document.createElement('a');

        anchorLink.onclick = function() {
          self.goToStep(this.getAttribute('data-stepnumber'));
        };

        if (i === 0) anchorLink.className = "active";

        anchorLink.href = 'javascript:void(0);';
        anchorLink.innerHTML = "&nbsp;";
        anchorLink.setAttribute('data-stepnumber', this._introItems[i].step);

        innerLi.appendChild(anchorLink);
        ulContainer.appendChild(innerLi);
      }

      bulletsLayer.appendChild(ulContainer);

      buttonsLayer.className = 'introjs-tooltipbuttons';
      if (this._options.showButtons === false) {
        buttonsLayer.style.display = 'none';
      }

      tooltipLayer.className = 'introjs-tooltip';
      tooltipLayer.appendChild(tooltipTextLayer);
      tooltipLayer.appendChild(bulletsLayer);

      //add helper layer number
      if (this._options.showStepNumbers == true) {
        var helperNumberLayer = document.createElement('span');
        helperNumberLayer.className = 'introjs-helperNumberLayer';
        helperNumberLayer.innerHTML = targetElement.step;
        helperLayer.appendChild(helperNumberLayer);
      }
      tooltipLayer.appendChild(arrowLayer);
      helperLayer.appendChild(tooltipLayer);

      //next button
      var nextTooltipButton = document.createElement('a');

      nextTooltipButton.onclick = function() {
        if (self._introItems.length - 1 != self._currentStep) {
          _nextStep.call(self);
        }
      };

      nextTooltipButton.href = 'javascript:void(0);';
      nextTooltipButton.innerHTML = this._options.nextLabel;

      //previous button
      var prevTooltipButton = document.createElement('a');

      prevTooltipButton.onclick = function() {
        if (self._currentStep != 0) {
          _previousStep.call(self);
        }
      };

      prevTooltipButton.href = 'javascript:void(0);';
      prevTooltipButton.innerHTML = this._options.prevLabel;

      //skip button
      var skipTooltipButton = document.createElement('a');
      skipTooltipButton.className = 'introjs-button introjs-skipbutton';
      skipTooltipButton.href = 'javascript:void(0);';
      skipTooltipButton.innerHTML = this._options.skipLabel;

      skipTooltipButton.onclick = function() {
        if (self._introItems.length - 1 == self._currentStep && typeof (self._introCompleteCallback) === 'function') {
          self._introCompleteCallback.call(self);
        }

        if (self._introItems.length - 1 != self._currentStep && typeof (self._introExitCallback) === 'function') {
          self._introExitCallback.call(self);
        }

        _exitIntro.call(self, self._targetElement);
      };

      buttonsLayer.appendChild(skipTooltipButton);

      //in order to prevent displaying next/previous button always
      if (this._introItems.length > 1) {
        buttonsLayer.appendChild(prevTooltipButton);
        buttonsLayer.appendChild(nextTooltipButton);
      }

      tooltipLayer.appendChild(buttonsLayer);

      //set proper position
      _placeTooltip.call(self, targetElement.element, tooltipLayer, arrowLayer, helperNumberLayer);


      //add target element position style
      targetElement.element.className += ' introjs-showElement';
    }

    if (this._currentStep == 0 && this._introItems.length > 1) {
      prevTooltipButton.className = 'introjs-button introjs-prevbutton introjs-disabled';
      nextTooltipButton.className = 'introjs-button introjs-nextbutton';
      skipTooltipButton.innerHTML = this._options.skipLabel;
    } else if (this._introItems.length - 1 == this._currentStep || this._introItems.length == 1) {
      skipTooltipButton.innerHTML = this._options.doneLabel;
      prevTooltipButton.className = 'introjs-button introjs-prevbutton';
      nextTooltipButton.className = 'introjs-button introjs-nextbutton introjs-disabled';
    } else {
      prevTooltipButton.className = 'introjs-button introjs-prevbutton';
      nextTooltipButton.className = 'introjs-button introjs-nextbutton';
      skipTooltipButton.innerHTML = this._options.skipLabel;
    }

    //Set focus on "next" button, so that hitting Enter always moves you onto the next step
    nextTooltipButton.focus();


    var currentElementPosition = _getPropValue(targetElement.element, 'position');
    if (currentElementPosition !== 'absolute' &&
        currentElementPosition !== 'relative') {
      //change to new intro item
      targetElement.element.className += ' introjs-relativePosition';
    }

    var parentElm = targetElement.element.parentNode;
    while (parentElm != null) {
      if (parentElm.tagName.toLowerCase() === 'body') break;

      //fix The Stacking Contenxt problem.
      //More detail: https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context
      var zIndex = _getPropValue(parentElm, 'z-index');
      var opacity = parseFloat(_getPropValue(parentElm, 'opacity'));
      if (/[0-9]+/.test(zIndex) || opacity < 1) {
        parentElm.className += ' introjs-fixParent';
      }

      parentElm = parentElm.parentNode;
    }

    if (!_elementInViewport(targetElement.element) && this._options.scrollToElement === true) {
      var rect = targetElement.element.getBoundingClientRect(),
        winHeight=_getWinSize().height,
        top = rect.bottom - (rect.bottom - rect.top),
        bottom = rect.bottom - winHeight;

      //Scroll up
      if (top < 0 || targetElement.element.clientHeight > winHeight) {
        window.scrollBy(0, top - 30); // 30px padding from edge to look nice

      //Scroll down
      } else {
        window.scrollBy(0, bottom + 100); // 70px + 30px padding from edge to look nice
      }
    }

    if (typeof (this._introAfterChangeCallback) !== 'undefined') {
        this._introAfterChangeCallback.call(this, targetElement.element);
    }
  }

  /**
   * Get an element CSS property on the page
   * Thanks to JavaScript Kit: https://www.javascriptkit.com/dhtmltutors/dhtmlcascade4.shtml
   *
   * @api private
   * @method _getPropValue
   * @param {Object} element
   * @param {String} propName
   * @returns Element's property value
   */
  function _getPropValue (element, propName) {
    var propValue = '';
    if (element.currentStyle) { //IE
      propValue = element.currentStyle[propName];
    } else if (document.defaultView && document.defaultView.getComputedStyle) { //Others
      propValue = document.defaultView.getComputedStyle(element, null).getPropertyValue(propName);
    }

    //Prevent exception in IE
    if (propValue && propValue.toLowerCase) {
      return propValue.toLowerCase();
    } else {
      return propValue;
    }
  }

  /**
   * Provides a cross-browser way to get the screen dimensions
   * via: https://stackoverflow.com/questions/5864467/internet-explorer-innerheight
   *
   * @api private
   * @method _getWinSize
   * @returns {Object} width and height attributes
   */
  function _getWinSize() {
    if (window.innerWidth != undefined) {
      return { width: window.innerWidth, height: window.innerHeight };
    } else {
      var D = document.documentElement;
      return { width: D.clientWidth, height: D.clientHeight };
    }
  }

  /**
   * Add overlay layer to the page
   * https://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
   *
   * @api private
   * @method _elementInViewport
   * @param {Object} el
   */
  function _elementInViewport(el) {
    var rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      (rect.bottom+80) <= window.innerHeight && // add 80 to get the text right
      rect.right <= window.innerWidth
    );
  }

  /**
   * Add overlay layer to the page
   *
   * @api private
   * @method _addOverlayLayer
   * @param {Object} targetElm
   */
  function _addOverlayLayer(targetElm) {
    var overlayLayer = document.createElement('div'),
        styleText = '',
        self = this;

    //set css class name
    overlayLayer.className = 'introjs-overlay';

    //check if the target element is body, we should calculate the size of overlay layer in a better way
    if (targetElm.tagName.toLowerCase() === 'body') {
      styleText += 'top: 0;bottom: 0; left: 0;right: 0;position: fixed;';
      overlayLayer.setAttribute('style', styleText);
    } else {
      //set overlay layer position
      var elementPosition = _getOffset(targetElm);
      if (elementPosition) {
        styleText += 'width: ' + elementPosition.width + 'px; height:' + elementPosition.height + 'px; top:' + elementPosition.top + 'px;left: ' + elementPosition.left + 'px;';
        overlayLayer.setAttribute('style', styleText);
      }
    }

    targetElm.appendChild(overlayLayer);

    overlayLayer.onclick = function() {
      if (self._options.exitOnOverlayClick == true) {
        _exitIntro.call(self, targetElm);

        //check if any callback is defined
        if (self._introExitCallback != undefined) {
          self._introExitCallback.call(self);
        }
      }
    };

    setTimeout(function() {
      styleText += 'opacity: ' + self._options.overlayOpacity.toString() + ';';
      overlayLayer.setAttribute('style', styleText);
    }, 10);

    return true;
  }

  /**
   * Get an element position on the page
   * Thanks to `meouw`: https://stackoverflow.com/a/442474/375966
   *
   * @api private
   * @method _getOffset
   * @param {Object} element
   * @returns Element's position info
   */
  function _getOffset(element) {
    var elementPosition = {};

    //set width
    elementPosition.width = element.offsetWidth;

    //set height
    elementPosition.height = element.offsetHeight;

    //calculate element top and left
    var _x = 0;
    var _y = 0;
    while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
      _x += element.offsetLeft;
      _y += element.offsetTop;
      element = element.offsetParent;
    }
    //set top
    elementPosition.top = _y;
    //set left
    elementPosition.left = _x;

    return elementPosition;
  }

  /**
   * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
   * via: https://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
   *
   * @param obj1
   * @param obj2
   * @returns obj3 a new object based on obj1 and obj2
   */
  function _mergeOptions(obj1,obj2) {
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
  }

  var introJs = function (targetElm) {
    if (typeof (targetElm) === 'object') {
      //Ok, create a new instance
      return new IntroJs(targetElm);

    } else if (typeof (targetElm) === 'string') {
      //select the target element with query selector
      var targetElement = document.querySelector(targetElm);

      if (targetElement) {
        return new IntroJs(targetElement);
      } else {
        throw new Error('There is no element with given selector.');
      }
    } else {
      return new IntroJs(document.body);
    }
  };

  /**
   * Current IntroJs version
   *
   * @property version
   * @type String
   */
  introJs.version = VERSION;

  //Prototype
  introJs.fn = IntroJs.prototype = {
    clone: function () {
      return new IntroJs(this);
    },
    setOption: function(option, value) {
      this._options[option] = value;
      return this;
    },
    setOptions: function(options) {
      this._options = _mergeOptions(this._options, options);
      return this;
    },
    start: function () {
      _introForElement.call(this, this._targetElement);
      return this;
    },
    goToStep: function(step) {
      _goToStep.call(this, step);
      return this;
    },
    nextStep: function() {
      _nextStep.call(this);
      return this;
    },
    previousStep: function() {
      _previousStep.call(this);
      return this;
    },
    exit: function() {
      _exitIntro.call(this, this._targetElement);
    },
    refresh: function() {
      _setHelperLayerPosition.call(this, document.querySelector('.introjs-helperLayer'));
      return this;
    },
    onbeforechange: function(providedCallback) {
      if (typeof (providedCallback) === 'function') {
        this._introBeforeChangeCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onbeforechange was not a function');
      }
      return this;
    },
    onchange: function(providedCallback) {
      if (typeof (providedCallback) === 'function') {
        this._introChangeCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onchange was not a function.');
      }
      return this;
    },
    onafterchange: function(providedCallback) {
      if (typeof (providedCallback) === 'function') {
        this._introAfterChangeCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onafterchange was not a function');
      }
      return this;
    },
    oncomplete: function(providedCallback) {
      if (typeof (providedCallback) === 'function') {
        this._introCompleteCallback = providedCallback;
      } else {
        throw new Error('Provided callback for oncomplete was not a function.');
      }
      return this;
    },
    onexit: function(providedCallback) {
      if (typeof (providedCallback) === 'function') {
        this._introExitCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onexit was not a function.');
      }
      return this;
    }
  };

  exports.introJs = introJs;
  return introJs;
}));
(function() {
  $(function() {
    var startIntro;
    startIntro = function() {
      var complete, hasSearched, interval, intro, searchInput, searchTerm, startTyping, stopTyping;
      $('#textbook-builder .affix-tester').css('bottom', 330);
      $(window).trigger('resize');
      intro = introJs();
      intro.setOptions({
        showBullets: false,
        showStepNumbers: false,
        skipLabel: 'Close',
        steps: [
          {
            intro: 'This is the textbook builder.'
          }, {
            element: '#search-results',
            intro: "Here are modules that may be added to your textbook. Use the scroll bar to see them all.",
            position: 'top'
          }, {
            element: '#builder-section-list-wrapper',
            intro: "This is where modules can be added to your textbook from the list on the left. Use the scroll bar on the right to see all the modules in your book.",
            position: 'top'
          }, {
            element: '.noba-col-sidebar .input-group',
            intro: "You can filter the available modules by typing in a search term.",
            position: 'top'
          }, {
            element: '#search-results .noba-list-wrapper > li li.empty + li > a.link',
            selector: '#search-results .noba-list-wrapper > li li.empty + li > a.link',
            intro: "To add new modules to your textbook, drag modules from the left…",
            position: 'top'
          }, {
            element: '#builder-section-list-wrapper',
            intro: "… and drop them on the right.",
            position: 'top'
          }, {
            element: '#builder-section-list-wrapper .noba-list-wrapper > li:first-child > ul > li.empty + li > a.link',
            intro: "Reorder modules in your textbook by dragging them up and down.",
            position: 'top'
          }, {
            element: '#builder-section-list-wrapper .noba-list-wrapper > li:first-child > ul > li.empty + li .builder-chapter-remove',
            intro: "Remove modules from your textbook by hovering over the module and clicking the X.",
            position: 'left'
          }, {
            element: '#builder-section-list-wrapper .noba-list-wrapper > li:first-child > .noba-list-header > input',
            intro: "Rename units by clicking here and typing a new name."
          }, {
            element: '#builder-section-list-wrapper .noba-list-wrapper > li:first-child > .noba-list-header',
            intro: "Reorder units by dragging the section name up and down."
          }, {
            element: 'article > header .redactor_box',
            intro: "Change the title of your textbook by clicking here and typing a new title."
          }, {
            element: 'article > header .btn-translucent',
            intro: "If you'd like, you may choose a different color for your textbook cover.",
            position: 'left'
          }, {
            element: '.noba-navbar-bottom .navbar-right .btn-group',
            intro: "When your changes are complete, publish them by clicking here.",
            position: 'top-right-aligned'
          }
        ]
      });
      interval = null;
      hasSearched = false;
      searchInput = $('.noba-search-form input');
      searchTerm = 'Happiness';
      startTyping = function(input, term) {
        var index,
          _this = this;
        index = 0;
        input.focus();
        return interval = setInterval(function() {
          index += 1;
          if (index > term.length) {
            return stopTyping(searchInput, searchTerm);
          } else {
            return input.val(term.slice(0, index));
          }
        }, 160);
      };
      stopTyping = function(input, text) {
        if (text == null) {
          text = "";
        }
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
        return input.val(text);
      };
      intro.onchange(function(target) {
        var color;
        target = $(target);
        color = target.hasClass('btn-translucent') ? $('.polygons-wrapper').css('background-color') : '';
        $('article > header .btn-translucent').css('background-color', color);
        if (hasSearched) {
          return stopTyping(searchInput, searchTerm);
        } else if (target.hasClass('input-group')) {
          hasSearched = true;
          return startTyping(searchInput, searchTerm);
        } else {
          return stopTyping(searchInput);
        }
      });
      complete = function() {
        $('#textbook-builder .affix-tester').css({
          bottom: ''
        });
        $(window).trigger('resize');
        $('article > header .btn-translucent').css('background-color', '');
        return stopTyping(searchInput);
      };
      intro.onexit(complete);
      intro.oncomplete(complete);
      return intro.start();
    };
    return $(document).on('click', '[data-start-intro]', function(e) {
      e.preventDefault();
      return startIntro();
    });
  });

}).call(this);
(function() {
  $(function() {
    var hasScrolled, max, min, navigation, parent;
    navigation = $('.noba-navbar-transparent')[0];
    if (navigation) {
      hasScrolled = false;
      parent = $(document);
      min = 150;
      max = 400;
      return parent.scroll(function() {
        var opacity;
        if (!hasScrolled) {
          hasScrolled = true;
          opacity = Math.min(Math.max((parent.scrollTop() - min) / (max - min), 0), 1);
          navigation.style.backgroundColor = "rgba(37, 44, 67, " + opacity + ")";
          return setTimeout(function() {
            return hasScrolled = false;
          }, 10);
        }
      });
    }
  });

}).call(this);
(function() {
  $(function() {
    if ($('[data-oauth="facebook"]').length) {
      $('body').prepend('<div id="fb-root"></div>');
      return $.ajax({
        url: "" + window.location.protocol + "//connect.facebook.net/en_US/all.js",
        dataType: 'script',
        cache: true
      });
    }
  });

  window.fbAsyncInit = function() {
    FB.init({
      appId: '1381909972033956',
      cookie: true
    });
    return $('[data-oauth="facebook"]').click(function(e) {
      e.preventDefault();
      return FB.login(function(response) {
        if (response.authResponse) {
          return window.location = '/accounts/auth/facebook';
        }
      });
    });
  };

}).call(this);
(function() {
  $(function() {
    var link, _i, _len, _ref, _results;
    _ref = $('[data-oauth="twitter"]');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      link = _ref[_i];
      _results.push((function(link) {
        link = $(link);
        return link.click(function(e) {
          var oauthInterval, oauthWindow;
          e.preventDefault();
          oauthWindow = window.open(link.attr('href'), 'oauthwindow', 'location=0,status=0,width=800,height=400');
          return oauthInterval = window.setInterval(function() {
            if (oauthWindow.closed) {
              return window.clearInterval(oauthInterval);
            }
          }, 200);
        });
      })(link));
    }
    return _results;
  });

}).call(this);
(function () {
  var LATIN_MAP = {
    'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A', 'Æ': 'AE', 'Ç':
    'C', 'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E', 'Ì': 'I', 'Í': 'I', 'Î': 'I',
    'Ï': 'I', 'Ð': 'D', 'Ñ': 'N', 'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö':
    'O', 'Ő': 'O', 'Ø': 'O', 'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U', 'Ű': 'U',
    'Ý': 'Y', 'Þ': 'TH', 'ß': 'ss', 'à':'a', 'á':'a', 'â': 'a', 'ã': 'a', 'ä':
    'a', 'å': 'a', 'æ': 'ae', 'ç': 'c', 'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
    'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i', 'ð': 'd', 'ñ': 'n', 'ò': 'o', 'ó':
    'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ő': 'o', 'ø': 'o', 'ù': 'u', 'ú': 'u',
    'û': 'u', 'ü': 'u', 'ű': 'u', 'ý': 'y', 'þ': 'th', 'ÿ': 'y'
}
var LATIN_SYMBOLS_MAP = {
    '©':'(c)'
}
var GREEK_MAP = {
    'α':'a', 'β':'b', 'γ':'g', 'δ':'d', 'ε':'e', 'ζ':'z', 'η':'h', 'θ':'8',
    'ι':'i', 'κ':'k', 'λ':'l', 'μ':'m', 'ν':'n', 'ξ':'3', 'ο':'o', 'π':'p',
    'ρ':'r', 'σ':'s', 'τ':'t', 'υ':'y', 'φ':'f', 'χ':'x', 'ψ':'ps', 'ω':'w',
    'ά':'a', 'έ':'e', 'ί':'i', 'ό':'o', 'ύ':'y', 'ή':'h', 'ώ':'w', 'ς':'s',
    'ϊ':'i', 'ΰ':'y', 'ϋ':'y', 'ΐ':'i',
    'Α':'A', 'Β':'B', 'Γ':'G', 'Δ':'D', 'Ε':'E', 'Ζ':'Z', 'Η':'H', 'Θ':'8',
    'Ι':'I', 'Κ':'K', 'Λ':'L', 'Μ':'M', 'Ν':'N', 'Ξ':'3', 'Ο':'O', 'Π':'P',
    'Ρ':'R', 'Σ':'S', 'Τ':'T', 'Υ':'Y', 'Φ':'F', 'Χ':'X', 'Ψ':'PS', 'Ω':'W',
    'Ά':'A', 'Έ':'E', 'Ί':'I', 'Ό':'O', 'Ύ':'Y', 'Ή':'H', 'Ώ':'W', 'Ϊ':'I',
    'Ϋ':'Y'
}
var TURKISH_MAP = {
    'ş':'s', 'Ş':'S', 'ı':'i', 'İ':'I', 'ç':'c', 'Ç':'C', 'ü':'u', 'Ü':'U',
    'ö':'o', 'Ö':'O', 'ğ':'g', 'Ğ':'G'
}
var RUSSIAN_MAP = {
    'а':'a', 'б':'b', 'в':'v', 'г':'g', 'д':'d', 'е':'e', 'ё':'yo', 'ж':'zh',
    'з':'z', 'и':'i', 'й':'j', 'к':'k', 'л':'l', 'м':'m', 'н':'n', 'о':'o',
    'п':'p', 'р':'r', 'с':'s', 'т':'t', 'у':'u', 'ф':'f', 'х':'h', 'ц':'c',
    'ч':'ch', 'ш':'sh', 'щ':'sh', 'ъ':'', 'ы':'y', 'ь':'', 'э':'e', 'ю':'yu',
    'я':'ya',
    'А':'A', 'Б':'B', 'В':'V', 'Г':'G', 'Д':'D', 'Е':'E', 'Ё':'Yo', 'Ж':'Zh',
    'З':'Z', 'И':'I', 'Й':'J', 'К':'K', 'Л':'L', 'М':'M', 'Н':'N', 'О':'O',
    'П':'P', 'Р':'R', 'С':'S', 'Т':'T', 'У':'U', 'Ф':'F', 'Х':'H', 'Ц':'C',
    'Ч':'Ch', 'Ш':'Sh', 'Щ':'Sh', 'Ъ':'', 'Ы':'Y', 'Ь':'', 'Э':'E', 'Ю':'Yu',
    'Я':'Ya'
}
var UKRAINIAN_MAP = {
    'Є':'Ye', 'І':'I', 'Ї':'Yi', 'Ґ':'G', 'є':'ye', 'і':'i', 'ї':'yi', 'ґ':'g'
}
var CZECH_MAP = {
    'č':'c', 'ď':'d', 'ě':'e', 'ň': 'n', 'ř':'r', 'š':'s', 'ť':'t', 'ů':'u',
    'ž':'z', 'Č':'C', 'Ď':'D', 'Ě':'E', 'Ň': 'N', 'Ř':'R', 'Š':'S', 'Ť':'T',
    'Ů':'U', 'Ž':'Z'
}

var POLISH_MAP = {
    'ą':'a', 'ć':'c', 'ę':'e', 'ł':'l', 'ń':'n', 'ó':'o', 'ś':'s', 'ź':'z',
    'ż':'z', 'Ą':'A', 'Ć':'C', 'Ę':'e', 'Ł':'L', 'Ń':'N', 'Ó':'o', 'Ś':'S',
    'Ź':'Z', 'Ż':'Z'
}

var LATVIAN_MAP = {
    'ā':'a', 'č':'c', 'ē':'e', 'ģ':'g', 'ī':'i', 'ķ':'k', 'ļ':'l', 'ņ':'n',
    'š':'s', 'ū':'u', 'ž':'z', 'Ā':'A', 'Č':'C', 'Ē':'E', 'Ģ':'G', 'Ī':'i',
    'Ķ':'k', 'Ļ':'L', 'Ņ':'N', 'Š':'S', 'Ū':'u', 'Ž':'Z'
}

var ALL_DOWNCODE_MAPS=new Array()
ALL_DOWNCODE_MAPS[0]=LATIN_MAP
ALL_DOWNCODE_MAPS[1]=LATIN_SYMBOLS_MAP
ALL_DOWNCODE_MAPS[2]=GREEK_MAP
ALL_DOWNCODE_MAPS[3]=TURKISH_MAP
ALL_DOWNCODE_MAPS[4]=RUSSIAN_MAP
ALL_DOWNCODE_MAPS[5]=UKRAINIAN_MAP
ALL_DOWNCODE_MAPS[6]=CZECH_MAP
ALL_DOWNCODE_MAPS[7]=POLISH_MAP
ALL_DOWNCODE_MAPS[8]=LATVIAN_MAP

var Downcoder = new Object();
Downcoder.Initialize = function()
{
    if (Downcoder.map) // already made
        return ;
    Downcoder.map ={}
    Downcoder.chars = '' ;
    for(var i in ALL_DOWNCODE_MAPS)
    {
        var lookup = ALL_DOWNCODE_MAPS[i]
        for (var c in lookup)
        {
            Downcoder.map[c] = lookup[c] ;
            Downcoder.chars += c ;
        }
     }
    Downcoder.regex = new RegExp('[' + Downcoder.chars + ']|[^' + Downcoder.chars + ']+','g') ;
}

downcode= function( slug )
{
    Downcoder.Initialize() ;
    var downcoded = "";
    var pieces = slug.match(Downcoder.regex);
    if(pieces)
    {
        for (var i = 0 ; i < pieces.length ; i++)
        {
            if (pieces[i].length == 1)
            {
                var mapped = Downcoder.map[pieces[i]] ;
                if (mapped != null)
                {
                    downcoded+=mapped;
                    continue ;
                }
            }
            downcoded+=pieces[i];
        }
    }
    else
    {
        downcoded = slug;
    }
    return downcoded;
}


window.parameterize = function (s, num_chars) {
    // changes, e.g., "Petty theft" to "petty_theft"
    // remove all these words from the string before urlifying
    s = downcode(s);
    //
    // if downcode doesn't hit, the char will be stripped here
    s = s.replace(/[^-\w\s]/g, '');  // remove unneeded chars
    s = s.replace(/^\s+|\s+$/g, ''); // trim leading/trailing spaces
    s = s.replace(/[-\s]+/g, '-');   // convert spaces to hyphens
    s = s.toLowerCase();             // convert to lowercase
    return s.substring(0, num_chars);// trim to first num_chars chars
}
})();
/**
 * placeholder - HTML5 input placeholder polyfill
 * Copyright (c) 2012 DIY Co
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @author Brian Reavis <brian@thirdroute.com>
 */


(function($) {

  var NATIVE_SUPPORT = ('placeholder' in document.createElement('input'));
  var CSS_PROPERTIES = [
    '-moz-box-sizing', '-webkit-box-sizing', 'box-sizing',
    'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
    'line-height', 'font-size', 'font-family', 'width', 'height',
    'top', 'left', 'right', 'bottom'
  ];

  var setupPlaceholder = function(input, options) {
    var i, evt, text, styles, zIndex, marginTop, dy, attrNode;
    var $input = $(input), $placeholder;

    try {
      attrNode = $input[0].getAttributeNode('placeholder');
      if (!attrNode) return;
      text = $input[0].getAttribute('placeholder');
      if (!text || !text.length) return;
      $input[0].setAttribute('placeholder', '');
      $input.data('placeholder', text);
    } catch (e) {
      return;
    }

    // enumerate textbox styles for mimicking
    styles = {};
    for (i = 0; i < CSS_PROPERTIES.length; i++) {
      styles[CSS_PROPERTIES[i]] = $input.css(CSS_PROPERTIES[i]);
    }
    zIndex = parseInt($input.css('z-index'), 10);
    if (isNaN(zIndex) || !zIndex) zIndex = 1;

    // create the placeholder
    $placeholder = $('<span>').addClass('placeholder').html(text);
    $placeholder.css(styles);
    $placeholder.css({
      'cursor': $input.css('cursor') || 'text',
      'display': 'block',
      'position': 'absolute',
      'overflow': 'hidden',
      'z-index': zIndex + 1,
      'background': 'none',
      'border-top-style': 'solid',
      'border-right-style': 'solid',
      'border-bottom-style': 'solid',
      'border-left-style': 'solid',
      'border-top-color': 'transparent',
      'border-right-color': 'transparent',
      'border-bottom-color': 'transparent',
      'border-left-color': 'transparent'
    });
    $placeholder.insertBefore($input);
    $placeholder.parent().css('position', 'relative');

    // compensate for y difference caused by absolute / relative difference (line-height factor)
    var inputOffset = $input.offset();
    var placeholderOffset = $placeholder.offset();
    dx = inputOffset.left - placeholderOffset.left;
    dy = inputOffset.top - placeholderOffset.top;
    marginTop = parseInt($placeholder.css('margin-top'));
    if (isNaN(marginTop)) marginTop = 0;
    $placeholder.css('margin-top', marginTop + dy);
    $placeholder.css('left', dx);

    // event handlers + add to document
    $placeholder.on('mousedown', function() {
      if (!$input.is(':enabled')) return;
      window.setTimeout(function(){
        $input.trigger('focus');
      }, 0);
    });

    $input.on('focus.placeholder', function() {
      $placeholder.hide();
    });
    $input.on('blur.placeholder', function() {
      $placeholder.toggle(!$.trim($input.val()).length);
    });

    $input[0].onpropertychange = function() {
      if (event.propertyName === 'value') {
        $input.trigger('focus.placeholder');
      }
    };

    $input.trigger('blur.placeholder');
  };

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  $.fn.placeholder = function(options) {
    var $this = this;
    options = options || {};

    if (NATIVE_SUPPORT && !options.force) {
      return this;
    }

    window.setTimeout(function() {
      $this.each(function() {
        var tagName = this.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea') {
          setupPlaceholder(this, options);
        }
      });
    }, 0);

    return this;
  };

})(jQuery);
(function() {
  $(function() {
    var body, measureScrollBar, msViewportStyle;
    $('input[placeholder], textarea[placeholder]').placeholder();
    if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
      msViewportStyle = document.createElement('style');
      msViewportStyle.appendChild(document.createTextNode('@-ms-viewport{width:auto!important}'));
      document.getElementsByTagName('head')[0].appendChild(msViewportStyle);
    }
    $('#modal').on('hidden.bs.modal', function() {
      return $(this).removeData('bs.modal');
    });
    body = $(document.body);
    measureScrollBar = function() {
      var div, width;
      div = document.createElement('div');
      div.className = 'scrollbar-measure';
      document.body.appendChild(div);
      width = div.offsetWidth - div.clientWidth;
      document.body.removeChild(div);
      return width;
    };
    body.on('show.bs.modal', function() {
      var el, width, _i, _j, _len, _len1, _ref, _ref1, _results;
      if (this.clientHeight <= window.innerHeight) {
        return;
      }
      if (width = measureScrollBar()) {
        body.css('padding-right', width);
        _ref = $('.navbar-fixed-top, .navbar-fixed-bottom');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          el = _ref[_i];
          $(el).data('orig-right', $(el).css('right'));
          $(el).css('right', "" + width + "px");
        }
        _ref1 = $('.affix');
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          el = _ref1[_j];
          $(el).data('orig-margin-left', $(el).css('margin-left'));
          _results.push($(el).css('margin-left', "0.00001px"));
        }
        return _results;
      }
    });
    return body.on('hidden.bs.modal', function() {
      var el, _i, _j, _len, _len1, _ref, _ref1, _results;
      body.css('padding-right', 0);
      _ref = $('.navbar-fixed-top, .navbar-fixed-bottom');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        $(el).css('right', $(el).data('orig-right'));
      }
      _ref1 = $('.affix');
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        el = _ref1[_j];
        _results.push($(el).css('margin-left', $(el).data('orig-margin-left')));
      }
      return _results;
    });
  });

}).call(this);
(function() {
  namespace({
    Noba: {
      rateable: function(selector) {
        var range, _i, _len, _ref, _results;
        _ref = $(selector);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          range = _ref[_i];
          _results.push((function(range) {
            var checked, options;
            range = $(range);
            options = range.parents('.rating-question').find('input[type="radio"]');
            checked = options.index(options.filter(':checked'));
            if (checked < 0) {
              checked = parseInt(options.length / 2, 10);
            }
            return range.slider({
              min: 0,
              max: options.length - 1,
              value: checked,
              animate: "fast",
              create: function(event, ui) {
                var target;
                target = $(event.target);
                return target.append("<div class='ui-slider-track'></div>");
              },
              slide: function(event, ui) {
                return $(options.get(ui.value)).prop('checked', true);
              }
            });
          })(range));
        }
        return _results;
      }
    }
  });

}).call(this);
(function() {
  $(function() {
    var redactorExt, templates;
    templates = function() {
      var modals;
      return modals = {
        modal_image: "        <section id='redactor-modal-image'>          <div id='redactor-progress' class='redactor-progress redactor-progress-striped' style='display: none;'>            <div id='redactor-progress-bar' class='redactor-progress-bar' style='width: 100%;'></div>          </div>          <form id='redactorInsertImageForm' method='post' action=' enctype='multipart/form-data' role='form'>            <div class='form-group'>              <input type='file' id='redactor_file' name='file' />            </div>          </form>          <a href='#' class='btn btn-default redactor_btn_modal_close pull-right'>Cancel</a>          <input type='button' name='upload' class='btn btn-primary' id='redactor_upload_btn' value='Insert' />        </section>        ",
        modal_image_edit: "        <section id='redactor-modal-image-edit'>          <form role='role'>            <div class='form-group'>              <label for='redactor_file_alt'>Caption</label>              <textarea id='redactor_file_alt' name='redactor_file_alt' class='form-control redactor_input' rows=6 />            </div>            <div class='form-group'>              <label for='redactor_file_title'>Title</label>              <input id='redactor_file_title' name='redactor_file_title' class='form-control redactor_input'/>            </div>            <div class='form-group'>              <label for='redactor_file_long_desc'>Long Description</label>              <select id='redactor_file_long_desc' name='redactor_file_long_desc' class='form-control'>                " + (typeof long_descriptions !== "undefined" && long_descriptions !== null ? long_descriptions : void 0) + "              </select>            </div>            <div class='form-group'>              <label for='redactor_form_image_align'>Alignment</label>              <select id='redactor_form_image_align' name='redactor_form_image_align' class='form-control'>                <option value='full'>Inline, Caption Below</option>                <option value='right-inline'>Inline, Caption Left</option>                <option value='left-inline'>Inline, Caption Right</option>                <option value='left'>Floating Left</option>                <option value='right'>Floating Right</option>              </select>            </div>          </form>          <a href='#' class='btn btn-default redactor_btn_modal_close pull-right'>Cancel</a>          <a href='#' id='redactor_image_delete_btn' class='btn btn-default pull-right'>Delete</a>          <input type='button' name='save' class='btn btn-primary' id='redactorSaveBtn' value='Save' />        </section>        ",
        modal_file: "        <section id='redactor-modal-file-insert'>          <form id='redactorUploadFileForm' method='post' action=' enctype='multipart/form-data'>            <label>" + this.opts.curLang.filename + "</label>            <input type='text' id='redactor_filename' class='redactor_input' />            <div style='margin-top: 7px;'>              <input type='file' id='redactor_file' name='" + this.opts.fileUploadParam + "' />            </div>          </form>        </section>        ",
        modal_link: "        <section id='redactor-modal-link-insert'>          <select id='redactor-predefined-links' style='width: 99.5%; display: none;'></select>          <label>URL</label>          <input type='text' class='redactor_input' id='redactor_link_url' />          <label>" + this.opts.curLang.text + "</label>          <input type='text' class='redactor_input' id='redactor_link_url_text' />          <label><input type='checkbox' id='redactor_link_blank'>" + this.opts.curLang.link_new_tab + "</label>        </section>        <footer>          <button class='redactor_modal_btn redactor_btn_modal_close'>" + this.opts.curLang.cancel + "</button>          <button id='redactor_insert_link_btn' class='redactor_modal_btn redactor_modal_action_btn'>" + this.opts.curLang.insert + "</button>        </footer>        ",
        modal_table: "        <section id='redactor-modal-table-insert'>          <label>" + this.opts.curLang.rows + "</label>          <input type='text' size='5' value='2' id='redactor_table_rows' />          <label>" + this.opts.curLang.columns + "</label>          <input type='text' size='5' value='3' id='redactor_table_columns' />        </section>        <footer>          <button class='redactor_modal_btn redactor_btn_modal_close'>" + this.opts.curLang.cancel + "</button>          <button id='redactor_insert_table_btn' class='redactor_modal_btn redactor_modal_action_btn'>" + this.opts.curLang.insert + "</button>        </footer>        ",
        modal_video: "        <section id='redactor-modal-video-insert'>          <form id='redactorInsertVideoForm'>            <label>" + this.opts.curLang.video_html_code + "</label>            <textarea id='redactor_insert_video_area' style='width: 99%; height: 160px;'></textarea>          </form>        </section>        <footer>          <button class='redactor_modal_btn redactor_btn_modal_close'>" + this.opts.curLang.cancel + "</button>          <button id='redactor_insert_video_btn' class='redactor_modal_btn redactor_modal_action_btn'>" + this.opts.curLang.insert + "</button>        </footer>        "
      };
    };
    redactorExt = {
      modalTemplatesInit: function() {
        return $.extend(this.opts, $.proxy(templates, this)());
      },
      modalSetDraggable: function() {},
      imageEdit: function(el) {
        var callback, caption, figure, image, parent;
        image = $(el);
        parent = image.parent();
        figure = image.parents('figure');
        caption = figure.children('figcaption');
        callback = $.proxy(function() {
          var align, long_descriptions;
          long_descriptions = null;
          align = figure.attr('data-align');
          if (!align || align.trim() === '') {
            align = 'full';
          }
          $('#redactor_form_image_align').val(align);
          $('#redactor_file_alt').val(caption.text());
          $('#redactor_file_title').val(image.context.alt);
          $('#redactor_file_long_desc').val(image.attr('longdesc'));
          if (parent.get(0).tagName === 'A') {
            $('#redactor_file_link').val(parent.attr('href'));
          }
          $('#redactor_image_edit_src').attr('href', image.attr('src'));
          $('#redactor_image_delete_btn').click($.proxy((function() {
            return this.imageRemove(image);
          }), this));
          return $('#redactorSaveBtn').click($.proxy((function() {
            return this.imageSave(image);
          }), this));
        }, this);
        return this.modalInit('Edit Image', this.opts.modal_image_edit, 600, callback);
      },
      imageSave: function(el) {
        var align, alt, caption, figure, image, link, longdesc, parent, title;
        this.imageResizeHide(false);
        image = $(el);
        parent = image.parent();
        figure = image.parents('figure');
        caption = figure.children('figcaption');
        title = $('#redactor_file_alt').val();
        alt = $('#redactor_file_title').val();
        longdesc = $('#redactor_file_long_desc').val();
        image.context.alt = alt;
        image.context.title = alt;
        image.attr('longdesc', longdesc);
        align = $('#redactor_form_image_align').val();
        caption.text(title);
        figure.attr('data-align', align);
        link = $.trim($('#redactor_file_link').val());
        if (link === '') {
          if (parent.get(0).tagName === 'A') {
            parent.replaceWith(this.outerHtml(image));
          }
        } else {
          if (parent.get(0).tagName === 'A') {
            parent.attr('href', link);
          } else {
            image.replaceWith("<a href='" + link + "'>" + (this.outerHtml(image)) + "</a>");
          }
        }
        this.callback('imageSave', image);
        this.modalClose();
        this.observeImages();
        return this.sync();
      },
      imageRemove: function(image) {
        var figure, parent;
        figure = image.parents('figure');
        parent = figure.parent();
        figure.remove();
        if (parent.length && parent[0].tagName === 'P') {
          this.focusWithSaveScroll();
          this.selectionStart(parent);
        }
        this.callback('imageDelete', image);
        this.modalClose();
        return this.sync();
      },
      imageResize: function(image) {
        var $figure, $image, $parent;
        $image = $(image);
        $figure = null;
        $parent = null;
        $image.on('mousedown', $.proxy(function() {
          return this.imageResizeHide(false);
        }, this));
        $image.on('dragstart', $.proxy(function() {
          return this.$editor.on('drop.redactor-image-inside-drop', $.proxy(function() {
            return setTimeout($.proxy(function() {
              this.observeImages();
              this.$editor.off('drop.redactor-image-inside-drop');
              return this.sync();
            }, this), 1);
          }, this));
        }, this));
        return $image.on('click', $.proxy(function() {
          var clicked, imageResizer, isResizing, min_h, min_w, ratio, start_x, start_y;
          if (this.$editor.find('#redactor-image-box').size() !== 0) {
            return false;
          }
          clicked = false;
          isResizing = false;
          start_x = null;
          start_y = null;
          ratio = $image.width() / $image.height();
          min_w = 20;
          min_h = 10;
          imageResizer = this.imageResizeControls($image);
          if (imageResizer) {
            imageResizer.on('mousedown', function(e) {
              isResizing = true;
              e.preventDefault();
              ratio = $image.width() / $image.height();
              start_x = Math.round(e.pageX - $image.eq(0).offset().left);
              return start_y = Math.round(e.pageY - $image.eq(0).offset().top);
            });
            $(this.document.body).on('mousemove', $.proxy(function(e) {
              var box, div_h, mouse_x, mouse_y, new_h, new_h_percent, new_w, new_w_percent;
              if (!isResizing) {
                return;
              }
              $figure || ($figure = $image.parents('figure'));
              $parent || ($parent = $figure.parent());
              mouse_x = Math.round(e.pageX - $image.eq(0).offset().left) - start_x;
              mouse_y = Math.round(e.pageY - $image.eq(0).offset().top) - start_y;
              div_h = $image.height();
              new_h = parseInt(div_h, 10) + mouse_y;
              new_w = Math.round(new_h * ratio);
              new_h_percent = (new_h / $parent.height()) * 100;
              new_w_percent = (new_w / $parent.width()) * 100;
              if (new_w > min_w && new_w_percent <= 100) {
                box = document.getElementById('redactor-image-box');
                if (box) {
                  $(box).width(new_w_percent + '%');
                }
                $image.width(new_w_percent + '%');
                $figure.width(new_w_percent + '%');
              }
              start_x = Math.round(e.pageX - $image.eq(0).offset().left);
              start_y = Math.round(e.pageY - $image.eq(0).offset().top);
              return this.sync();
            }, this));
            $(this.document.body).on('mouseup', function() {
              return isResizing = false;
            });
          }
          this.$editor.on('keydown.redactor-image-delete', $.proxy(function(e) {
            var key;
            key = e.which;
            if (this.keyCode.BACKSPACE === key || this.keyCode.DELETE === key) {
              this.bufferSet(false);
              this.imageResizeHide(false);
              return this.imageRemove($image);
            }
          }, this));
          $(document).on('click.redactor-image-resize-hide', $.proxy(this.imageResizeHide, this));
          return this.$editor.on('click.redactor-image-resize-hide', $.proxy(this.imageResizeHide, this));
        }, this));
      },
      imageResizeControls: function($image) {
        var figure, imageBox, imageResizer;
        figure = $image.parents('figure');
        imageBox = $('<span id="redactor-image-box" data-redactor="verified">');
        imageBox.attr('contenteditable', false);
        imageBox.css({
          width: $image[0].style.width
        });
        $image.css({
          opacity: 0.5
        }).after(imageBox);
        this.imageEditter = $("<span id='redactor-image-editter' data-redactor='verified'>" + this.opts.curLang.edit + "</span>");
        this.imageEditter.attr('contenteditable', false);
        this.imageEditter.on('click', $.proxy(function() {
          return this.imageEdit($image);
        }, this));
        imageBox.append(this.imageEditter);
        if (this.opts.imageResizable) {
          imageResizer = $('<span id="redactor-image-resizer" data-redactor="verified"></span>');
          imageResizer.attr('contenteditable', false);
          imageBox.append(imageResizer);
          imageBox.append($image);
          return imageResizer;
        } else {
          imageBox.append($image);
          return false;
        }
      },
      imageResizeHide: function(e) {
        var image, imageBox, parent;
        parent = $(e.target).parent();
        if (e && parent.size() !== 0 && parent[0].id === 'redactor-image-box') {
          return false;
        }
        imageBox = this.$editor.find('#redactor-image-box');
        if (imageBox.size() === 0) {
          return false;
        }
        this.$editor.find('#redactor-image-editter, #redactor-image-resizer').remove();
        image = imageBox.find('img');
        image.css({
          opacity: ''
        });
        imageBox.css({
          width: ''
        });
        imageBox.replaceWith(function() {
          return $(this).contents();
        });
        $(document).off('click.redactor-image-resize-hide');
        this.$editor.off('click.redactor-image-resize-hide');
        this.$editor.off('keydown.redactor-image-delete');
        return this.sync();
      }
    };
    $.Redactor.opts.langs.en.or_choose = 'Or choose an image';
    $.Redactor.opts.langs.en.drop_file_here = 'Drop image here';
    return $.extend($.Redactor.prototype, redactorExt);
  });

}).call(this);
(function() {
  $(function() {
    return $('[data-spy="smart-affix"]').each(function() {
      var $spy, data, parent, resize;
      $spy = $(this);
      data = $spy.data();
      if (data['offsetTop'] == null) {
        data['offsetTop'] = -81;
      }
      data.offset = {
        top: $spy.offset().top + (data.offsetTop || 0)
      };
      $spy.after("<div class='affix-spacer' />");
      $spy.next('.affix-spacer').height($spy.height());
      $spy.affix(data);
      parent = $spy.parent();
      resize = function() {
        var width;
        width = parent.width();
        return $spy.css('width', parent.width());
      };
      resize();
      return $(window).resize(resize);
    });
  });

}).call(this);
(function() {
  $(function() {
    $('.share-url input').click(function() {
      return this.select();
    });
    $('[data-share-receipt-url]').click(function(e) {
      e.preventDefault();
      return $.ajax({
        url: $(this).data('share-receipt-url'),
        type: 'POST',
        dataType: 'json',
        data: {
          service: $(this).data('share-receipt-service')
        }
      });
    });
    return $(document).on('shown.bs.modal', function(e) {
      var button, clone, _i, _len, _ref, _results;
      _ref = $(e.target).find('.twitter-follow-button');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        button = _ref[_i];
        clone = $(button).clone();
        _results.push($(button).replaceWith(clone));
      }
      return _results;
    });
  });

}).call(this);
(function() {
  $(function() {
    return $('table.search-results').on('click', 'td', function() {
      var parent;
      parent = $(this).parents('[data-result]');
      return $.post('/found', {
        result: parent.attr('data-result')
      });
    });
  });

}).call(this);
/*
Copyright 2012 Igor Vaynberg

Version: 3.3.2 Timestamp: Mon Mar 25 12:14:18 PDT 2013

This software is licensed under the Apache License, Version 2.0 (the "Apache License") or the GNU
General Public License version 2 (the "GPL License"). You may choose either license to govern your
use of this software only upon the condition that you accept all of the terms of either the Apache
License or the GPL License.

You may obtain a copy of the Apache License and the GPL License at:

    https://www.apache.org/licenses/LICENSE-2.0
    https://www.gnu.org/licenses/gpl-2.0.html

Unless required by applicable law or agreed to in writing, software distributed under the
Apache License or the GPL Licesnse is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the Apache License and the GPL License for
the specific language governing permissions and limitations under the Apache License and the GPL License.
*/

 (function ($) {
  if(typeof $.fn.each2 == "undefined"){
    $.fn.extend({
      /*
      * 4-10 times faster .each replacement
      * use it carefully, as it overrides jQuery context of element on each iteration
      */
      each2 : function (c) {
        var j = $([0]), i = -1, l = this.length;
        while (
          ++i < l
          && (j.context = j[0] = this[i])
          && c.call(j[0], i, j) !== false //"this"=DOM, i=index, j=jQuery object
        );
        return this;
      }
    });
  }
})(jQuery);

(function ($, undefined) {
    "use strict";
    /*global document, window, jQuery, console */

    if (window.Select2 !== undefined) {
        return;
    }

    var KEY, AbstractSelect2, SingleSelect2, MultiSelect2, nextUid, sizer,
        lastMousePosition, $document;

    KEY = {
        TAB: 9,
        ENTER: 13,
        ESC: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        HOME: 36,
        END: 35,
        BACKSPACE: 8,
        DELETE: 46,
        isArrow: function (k) {
            k = k.which ? k.which : k;
            switch (k) {
            case KEY.LEFT:
            case KEY.RIGHT:
            case KEY.UP:
            case KEY.DOWN:
                return true;
            }
            return false;
        },
        isControl: function (e) {
            var k = e.which;
            switch (k) {
            case KEY.SHIFT:
            case KEY.CTRL:
            case KEY.ALT:
                return true;
            }

            if (e.metaKey) return true;

            return false;
        },
        isFunctionKey: function (k) {
            k = k.which ? k.which : k;
            return k >= 112 && k <= 123;
        }
    };

    $document = $(document);

    nextUid=(function() { var counter=1; return function() { return counter++; }; }());

    function indexOf(value, array) {
        var i = 0, l = array.length;
        for (; i < l; i = i + 1) {
            if (equal(value, array[i])) return i;
        }
        return -1;
    }

    /**
     * Compares equality of a and b
     * @param a
     * @param b
     */
    function equal(a, b) {
        if (a === b) return true;
        if (a === undefined || b === undefined) return false;
        if (a === null || b === null) return false;
        if (a.constructor === String) return a+'' === b+''; // IE requires a+'' instead of just a
        if (b.constructor === String) return b+'' === a+''; // IE requires b+'' instead of just b
        return false;
    }

    /**
     * Splits the string into an array of values, trimming each value. An empty array is returned for nulls or empty
     * strings
     * @param string
     * @param separator
     */
    function splitVal(string, separator) {
        var val, i, l;
        if (string === null || string.length < 1) return [];
        val = string.split(separator);
        for (i = 0, l = val.length; i < l; i = i + 1) val[i] = $.trim(val[i]);
        return val;
    }

    function getSideBorderPadding(element) {
        return element.outerWidth(false) - element.width();
    }

    function installKeyUpChangeEvent(element) {
        var key="keyup-change-value";
        element.bind("keydown", function () {
            if ($.data(element, key) === undefined) {
                $.data(element, key, element.val());
            }
        });
        element.bind("keyup", function () {
            var val= $.data(element, key);
            if (val !== undefined && element.val() !== val) {
                $.removeData(element, key);
                element.trigger("keyup-change");
            }
        });
    }

    $document.bind("mousemove", function (e) {
        lastMousePosition = {x: e.pageX, y: e.pageY};
    });

    /**
     * filters mouse events so an event is fired only if the mouse moved.
     *
     * filters out mouse events that occur when mouse is stationary but
     * the elements under the pointer are scrolled.
     */
    function installFilteredMouseMove(element) {
      element.bind("mousemove", function (e) {
            var lastpos = lastMousePosition;
            if (lastpos === undefined || lastpos.x !== e.pageX || lastpos.y !== e.pageY) {
                $(e.target).trigger("mousemove-filtered", e);
            }
        });
    }

    /**
     * Debounces a function. Returns a function that calls the original fn function only if no invocations have been made
     * within the last quietMillis milliseconds.
     *
     * @param quietMillis number of milliseconds to wait before invoking fn
     * @param fn function to be debounced
     * @param ctx object to be used as this reference within fn
     * @return debounced version of fn
     */
    function debounce(quietMillis, fn, ctx) {
        ctx = ctx || undefined;
        var timeout;
        return function () {
            var args = arguments;
            window.clearTimeout(timeout);
            timeout = window.setTimeout(function() {
                fn.apply(ctx, args);
            }, quietMillis);
        };
    }

    /**
     * A simple implementation of a thunk
     * @param formula function used to lazily initialize the thunk
     * @return {Function}
     */
    function thunk(formula) {
        var evaluated = false,
            value;
        return function() {
            if (evaluated === false) { value = formula(); evaluated = true; }
            return value;
        };
    };

    function installDebouncedScroll(threshold, element) {
        var notify = debounce(threshold, function (e) { element.trigger("scroll-debounced", e);});
        element.bind("scroll", function (e) {
            if (indexOf(e.target, element.get()) >= 0) notify(e);
        });
    }

    function focus($el) {
        if ($el[0] === document.activeElement) return;

        /* set the focus in a 0 timeout - that way the focus is set after the processing
            of the current event has finished - which seems like the only reliable way
            to set focus */
        window.setTimeout(function() {
            var el=$el[0], pos=$el.val().length, range;

            $el.focus();

            /* make sure el received focus so we do not error out when trying to manipulate the caret.
                sometimes modals or others listeners may steal it after its set */
            if ($el.is(":visible") && el === document.activeElement) {

                /* after the focus is set move the caret to the end, necessary when we val()
                    just before setting focus */
                if(el.setSelectionRange)
                {
                    el.setSelectionRange(pos, pos);
                }
                else if (el.createTextRange) {
                    range = el.createTextRange();
                    range.collapse(false);
                    range.select();
                }
            }
        }, 0);
    }

    function killEvent(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    function killEventImmediately(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
    }

    function measureTextWidth(e) {
        if (!sizer){
          var style = e[0].currentStyle || window.getComputedStyle(e[0], null);
          sizer = $(document.createElement("div")).css({
              position: "absolute",
              left: "-10000px",
              top: "-10000px",
              display: "none",
              fontSize: style.fontSize,
              fontFamily: style.fontFamily,
              fontStyle: style.fontStyle,
              fontWeight: style.fontWeight,
              letterSpacing: style.letterSpacing,
              textTransform: style.textTransform,
              whiteSpace: "nowrap"
          });
            sizer.attr("class","select2-sizer");
          $("body").append(sizer);
        }
        sizer.text(e.val());
        return sizer.width();
    }

    function syncCssClasses(dest, src, adapter) {
        var classes, replacements = [], adapted;

        classes = dest.attr("class");
        if (classes) {
            classes = '' + classes; // for IE which returns object
            $(classes.split(" ")).each2(function() {
                if (this.indexOf("select2-") === 0) {
                    replacements.push(this);
                }
            });
        }
        classes = src.attr("class");
        if (classes) {
            classes = '' + classes; // for IE which returns object
            $(classes.split(" ")).each2(function() {
                if (this.indexOf("select2-") !== 0) {
                    adapted = adapter(this);
                    if (adapted) {
                        replacements.push(this);
                    }
                }
            });
        }
        dest.attr("class", replacements.join(" "));
    }


    function markMatch(text, term, markup, escapeMarkup) {
        var match=text.toUpperCase().indexOf(term.toUpperCase()),
            tl=term.length;

        if (match<0) {
            markup.push(escapeMarkup(text));
            return;
        }

        markup.push(escapeMarkup(text.substring(0, match)));
        markup.push("<span class='select2-match'>");
        markup.push(escapeMarkup(text.substring(match, match + tl)));
        markup.push("</span>");
        markup.push(escapeMarkup(text.substring(match + tl, text.length)));
    }

    /**
     * Produces an ajax-based query function
     *
     * @param options object containing configuration paramters
     * @param options.transport function that will be used to execute the ajax request. must be compatible with parameters supported by $.ajax
     * @param options.url url for the data
     * @param options.data a function(searchTerm, pageNumber, context) that should return an object containing query string parameters for the above url.
     * @param options.dataType request data type: ajax, jsonp, other datatatypes supported by jQuery's $.ajax function or the transport function if specified
     * @param options.traditional a boolean flag that should be true if you wish to use the traditional style of param serialization for the ajax request
     * @param options.quietMillis (optional) milliseconds to wait before making the ajaxRequest, helps debounce the ajax function if invoked too often
     * @param options.results a function(remoteData, pageNumber) that converts data returned form the remote request to the format expected by Select2.
     *      The expected format is an object containing the following keys:
     *      results array of objects that will be used as choices
     *      more (optional) boolean indicating whether there are more results available
     *      Example: {results:[{id:1, text:'Red'},{id:2, text:'Blue'}], more:true}
     */
    function ajax(options) {
        var timeout, // current scheduled but not yet executed request
            requestSequence = 0, // sequence used to drop out-of-order responses
            handler = null,
            quietMillis = options.quietMillis || 100,
            ajaxUrl = options.url,
            self = this;

        return function (query) {
            window.clearTimeout(timeout);
            timeout = window.setTimeout(function () {
                requestSequence += 1; // increment the sequence
                var requestNumber = requestSequence, // this request's sequence number
                    data = options.data, // ajax data function
                    url = ajaxUrl, // ajax url string or function
                    transport = options.transport || $.ajax,
                    type = options.type || 'GET', // set type of request (GET or POST)
                    params = {};

                data = data ? data.call(self, query.term, query.page, query.context) : null;
                url = (typeof url === 'function') ? url.call(self, query.term, query.page, query.context) : url;

                if( null !== handler) { handler.abort(); }

                if (options.params) {
                    if ($.isFunction(options.params)) {
                        $.extend(params, options.params.call(self));
                    } else {
                        $.extend(params, options.params);
                    }
                }

                $.extend(params, {
                    url: url,
                    dataType: options.dataType,
                    data: data,
                    type: type,
                    cache: false,
                    success: function (data) {
                        if (requestNumber < requestSequence) {
                            return;
                        }
                        // TODO - replace query.page with query so users have access to term, page, etc.
                        var results = options.results(data, query.page);
                        query.callback(results);
                    }
                });
                handler = transport.call(self, params);
            }, quietMillis);
        };
    }

    /**
     * Produces a query function that works with a local array
     *
     * @param options object containing configuration parameters. The options parameter can either be an array or an
     * object.
     *
     * If the array form is used it is assumed that it contains objects with 'id' and 'text' keys.
     *
     * If the object form is used ti is assumed that it contains 'data' and 'text' keys. The 'data' key should contain
     * an array of objects that will be used as choices. These objects must contain at least an 'id' key. The 'text'
     * key can either be a String in which case it is expected that each element in the 'data' array has a key with the
     * value of 'text' which will be used to match choices. Alternatively, text can be a function(item) that can extract
     * the text.
     */
    function local(options) {
        var data = options, // data elements
            dataText,
            tmp,
            text = function (item) { return ""+item.text; }; // function used to retrieve the text portion of a data item that is matched against the search

     if ($.isArray(data)) {
            tmp = data;
            data = { results: tmp };
        }

     if ($.isFunction(data) === false) {
            tmp = data;
            data = function() { return tmp; };
        }

        var dataItem = data();
        if (dataItem.text) {
            text = dataItem.text;
            // if text is not a function we assume it to be a key name
            if (!$.isFunction(text)) {
                dataText = data.text; // we need to store this in a separate variable because in the next step data gets reset and data.text is no longer available
                text = function (item) { return item[dataText]; };
            }
        }

        return function (query) {
            var t = query.term, filtered = { results: [] }, process;
            if (t === "") {
                query.callback(data());
                return;
            }

            process = function(datum, collection) {
                var group, attr;
                datum = datum[0];
                if (datum.children) {
                    group = {};
                    for (attr in datum) {
                        if (datum.hasOwnProperty(attr)) group[attr]=datum[attr];
                    }
                    group.children=[];
                    $(datum.children).each2(function(i, childDatum) { process(childDatum, group.children); });
                    if (group.children.length || query.matcher(t, text(group), datum)) {
                        collection.push(group);
                    }
                } else {
                    if (query.matcher(t, text(datum), datum)) {
                        collection.push(datum);
                    }
                }
            };

            $(data().results).each2(function(i, datum) { process(datum, filtered.results); });
            query.callback(filtered);
        };
    }

    // TODO javadoc
    function tags(data) {
        var isFunc = $.isFunction(data);
        return function (query) {
            var t = query.term, filtered = {results: []};
            $(isFunc ? data() : data).each(function () {
                var isObject = this.text !== undefined,
                    text = isObject ? this.text : this;
                if (t === "" || query.matcher(t, text)) {
                    filtered.results.push(isObject ? this : {id: this, text: this});
                }
            });
            query.callback(filtered);
        };
    }

    /**
     * Checks if the formatter function should be used.
     *
     * Throws an error if it is not a function. Returns true if it should be used,
     * false if no formatting should be performed.
     *
     * @param formatter
     */
    function checkFormatter(formatter, formatterName) {
        if ($.isFunction(formatter)) return true;
        if (!formatter) return false;
        throw new Error("formatterName must be a function or a falsy value");
    }

    function evaluate(val) {
        return $.isFunction(val) ? val() : val;
    }

    function countResults(results) {
        var count = 0;
        $.each(results, function(i, item) {
            if (item.children) {
                count += countResults(item.children);
            } else {
                count++;
            }
        });
        return count;
    }

    /**
     * Default tokenizer. This function uses breaks the input on substring match of any string from the
     * opts.tokenSeparators array and uses opts.createSearchChoice to create the choice object. Both of those
     * two options have to be defined in order for the tokenizer to work.
     *
     * @param input text user has typed so far or pasted into the search field
     * @param selection currently selected choices
     * @param selectCallback function(choice) callback tho add the choice to selection
     * @param opts select2's opts
     * @return undefined/null to leave the current input unchanged, or a string to change the input to the returned value
     */
    function defaultTokenizer(input, selection, selectCallback, opts) {
        var original = input, // store the original so we can compare and know if we need to tell the search to update its text
            dupe = false, // check for whether a token we extracted represents a duplicate selected choice
            token, // token
            index, // position at which the separator was found
            i, l, // looping variables
            separator; // the matched separator

        if (!opts.createSearchChoice || !opts.tokenSeparators || opts.tokenSeparators.length < 1) return undefined;

        while (true) {
            index = -1;

            for (i = 0, l = opts.tokenSeparators.length; i < l; i++) {
                separator = opts.tokenSeparators[i];
                index = input.indexOf(separator);
                if (index >= 0) break;
            }

            if (index < 0) break; // did not find any token separator in the input string, bail

            token = input.substring(0, index);
            input = input.substring(index + separator.length);

            if (token.length > 0) {
                token = opts.createSearchChoice(token, selection);
                if (token !== undefined && token !== null && opts.id(token) !== undefined && opts.id(token) !== null) {
                    dupe = false;
                    for (i = 0, l = selection.length; i < l; i++) {
                        if (equal(opts.id(token), opts.id(selection[i]))) {
                            dupe = true; break;
                        }
                    }

                    if (!dupe) selectCallback(token);
                }
            }
        }

        if (original!==input) return input;
    }

    /**
     * Creates a new class
     *
     * @param superClass
     * @param methods
     */
    function clazz(SuperClass, methods) {
        var constructor = function () {};
        constructor.prototype = new SuperClass;
        constructor.prototype.constructor = constructor;
        constructor.prototype.parent = SuperClass.prototype;
        constructor.prototype = $.extend(constructor.prototype, methods);
        return constructor;
    }

    AbstractSelect2 = clazz(Object, {

        // abstract
        bind: function (func) {
            var self = this;
            return function () {
                func.apply(self, arguments);
            };
        },

        // abstract
        init: function (opts) {
            var results, search, resultsSelector = ".select2-results", mask;

            // prepare options
            this.opts = opts = this.prepareOpts(opts);

            this.id=opts.id;

            // destroy if called on an existing component
            if (opts.element.data("select2") !== undefined &&
                opts.element.data("select2") !== null) {
                this.destroy();
            }

            this.enabled=true;
            this.container = this.createContainer();

            this.containerId="s2id_"+(opts.element.attr("id") || "autogen"+nextUid());
            this.containerSelector="#"+this.containerId.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1');
            this.container.attr("id", this.containerId);

            // cache the body so future lookups are cheap
            this.body = thunk(function() { return opts.element.closest("body"); });

            syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);

            this.container.css(evaluate(opts.containerCss));
            this.container.addClass(evaluate(opts.containerCssClass));

            this.elementTabIndex = this.opts.element.attr("tabIndex");

            // swap container for the element
            this.opts.element
                .data("select2", this)
                .addClass("select2-offscreen")
                .bind("focus.select2", function() { $(this).select2("focus"); })
                .attr("tabIndex", "-1")
                .before(this.container);
            this.container.data("select2", this);

            this.dropdown = this.container.find(".select2-drop");
            this.dropdown.addClass(evaluate(opts.dropdownCssClass));
            this.dropdown.data("select2", this);

            this.results = results = this.container.find(resultsSelector);
            this.search = search = this.container.find("input.select2-input");

            search.attr("tabIndex", this.elementTabIndex);

            this.resultsPage = 0;
            this.context = null;

            // initialize the container
            this.initContainer();

            installFilteredMouseMove(this.results);
            this.dropdown.delegate(resultsSelector, "mousemove-filtered touchstart touchmove touchend", this.bind(this.highlightUnderEvent));

            installDebouncedScroll(80, this.results);
            this.dropdown.delegate(resultsSelector, "scroll-debounced", this.bind(this.loadMoreIfNeeded));

            // if jquery.mousewheel plugin is installed we can prevent out-of-bounds scrolling of results via mousewheel
            if ($.fn.mousewheel) {
                results.mousewheel(function (e, delta, deltaX, deltaY) {
                    var top = results.scrollTop(), height;
                    if (deltaY > 0 && top - deltaY <= 0) {
                        results.scrollTop(0);
                        killEvent(e);
                    } else if (deltaY < 0 && results.get(0).scrollHeight - results.scrollTop() + deltaY <= results.height()) {
                        results.scrollTop(results.get(0).scrollHeight - results.height());
                        killEvent(e);
                    }
                });
            }

            installKeyUpChangeEvent(search);
            search.bind("keyup-change input paste", this.bind(this.updateResults));
            search.bind("focus", function () { search.addClass("select2-focused"); });
            search.bind("blur", function () { search.removeClass("select2-focused");});

            this.dropdown.delegate(resultsSelector, "mouseup", this.bind(function (e) {
                if ($(e.target).closest(".select2-result-selectable").length > 0) {
                    this.highlightUnderEvent(e);
                    this.selectHighlighted(e);
                }
            }));

            // trap all mouse events from leaving the dropdown. sometimes there may be a modal that is listening
            // for mouse events outside of itself so it can close itself. since the dropdown is now outside the select2's
            // dom it will trigger the popup close, which is not what we want
            this.dropdown.bind("click mouseup mousedown", function (e) { e.stopPropagation(); });

            if ($.isFunction(this.opts.initSelection)) {
                // initialize selection based on the current value of the source element
                this.initSelection();

                // if the user has provided a function that can set selection based on the value of the source element
                // we monitor the change event on the element and trigger it, allowing for two way synchronization
                this.monitorSource();
            }

            if (opts.element.is(":disabled") || opts.element.is("[readonly='readonly']")) this.disable();
        },

        // abstract
        destroy: function () {
            var select2 = this.opts.element.data("select2");

            if (this.propertyObserver) { delete this.propertyObserver; this.propertyObserver = null; }

            if (select2 !== undefined) {

                select2.container.remove();
                select2.dropdown.remove();
                select2.opts.element
                    .removeClass("select2-offscreen")
                    .removeData("select2")
                    .unbind(".select2")
                    .attr({"tabIndex": this.elementTabIndex})
                    .show();
            }
        },

        // abstract
        prepareOpts: function (opts) {
            var element, select, idKey, ajaxUrl;

            element = opts.element;

            if (element.get(0).tagName.toLowerCase() === "select") {
                this.select = select = opts.element;
            }

            if (select) {
                // these options are not allowed when attached to a select because they are picked up off the element itself
                $.each(["id", "multiple", "ajax", "query", "createSearchChoice", "initSelection", "data", "tags"], function () {
                    if (this in opts) {
                        throw new Error("Option '" + this + "' is not allowed for Select2 when attached to a <select> element.");
                    }
                });
            }

            opts = $.extend({}, {
                populateResults: function(container, results, query) {
                    var populate,  data, result, children, id=this.opts.id, self=this;

                    populate=function(results, container, depth) {

                        var i, l, result, selectable, disabled, compound, node, label, innerContainer, formatted;

                        results = opts.sortResults(results, container, query);

                        for (i = 0, l = results.length; i < l; i = i + 1) {

                            result=results[i];

                            disabled = (result.disabled === true);
                            selectable = (!disabled) && (id(result) !== undefined);

                            compound=result.children && result.children.length > 0;

                            node=$("<li></li>");
                            node.addClass("select2-results-dept-"+depth);
                            node.addClass("select2-result");
                            node.addClass(selectable ? "select2-result-selectable" : "select2-result-unselectable");
                            if (disabled) { node.addClass("select2-disabled"); }
                            if (compound) { node.addClass("select2-result-with-children"); }
                            node.addClass(self.opts.formatResultCssClass(result));

                            label=$(document.createElement("div"));
                            label.addClass("select2-result-label");

                            formatted=opts.formatResult(result, label, query, self.opts.escapeMarkup);
                            if (formatted!==undefined) {
                                label.html(formatted);
                            }

                            node.append(label);

                            if (compound) {

                                innerContainer=$("<ul></ul>");
                                innerContainer.addClass("select2-result-sub");
                                populate(result.children, innerContainer, depth+1);
                                node.append(innerContainer);
                            }

                            node.data("select2-data", result);
                            container.append(node);
                        }
                    };

                    populate(results, container, 0);
                }
            }, $.fn.select2.defaults, opts);

            if (typeof(opts.id) !== "function") {
                idKey = opts.id;
                opts.id = function (e) { return e[idKey]; };
            }

            if ($.isArray(opts.element.data("select2Tags"))) {
                if ("tags" in opts) {
                    throw "tags specified as both an attribute 'data-select2-tags' and in options of Select2 " + opts.element.attr("id");
                }
                opts.tags=opts.element.data("select2Tags");
            }

            if (select) {
                opts.query = this.bind(function (query) {
                    var data = { results: [], more: false },
                        term = query.term,
                        children, firstChild, process;

                    process=function(element, collection) {
                        var group;
                        if (element.is("option")) {
                            if (query.matcher(term, element.text(), element)) {
                                collection.push({id:element.attr("value"), text:element.text(), element: element.get(), css: element.attr("class"), disabled: equal(element.attr("disabled"), "disabled") });
                            }
                        } else if (element.is("optgroup")) {
                            group={text:element.attr("label"), children:[], element: element.get(), css: element.attr("class")};
                            element.children().each2(function(i, elm) { process(elm, group.children); });
                            if (group.children.length>0) {
                                collection.push(group);
                            }
                        }
                    };

                    children=element.children();

                    // ignore the placeholder option if there is one
                    if (this.getPlaceholder() !== undefined && children.length > 0) {
                        firstChild = children[0];
                        if ($(firstChild).text() === "") {
                            children=children.not(firstChild);
                        }
                    }

                    children.each2(function(i, elm) { process(elm, data.results); });

                    query.callback(data);
                });
                // this is needed because inside val() we construct choices from options and there id is hardcoded
                opts.id=function(e) { return e.id; };
                opts.formatResultCssClass = function(data) { return data.css; };
            } else {
                if (!("query" in opts)) {

                    if ("ajax" in opts) {
                        ajaxUrl = opts.element.data("ajax-url");
                        if (ajaxUrl && ajaxUrl.length > 0) {
                            opts.ajax.url = ajaxUrl;
                        }
                        opts.query = ajax.call(opts.element, opts.ajax);
                    } else if ("data" in opts) {
                        opts.query = local(opts.data);
                    } else if ("tags" in opts) {
                        opts.query = tags(opts.tags);
                        if (opts.createSearchChoice === undefined) {
                            opts.createSearchChoice = function (term) { return {id: term, text: term}; };
                        }
                        if (opts.initSelection === undefined) {
                            opts.initSelection = function (element, callback) {
                                var data = [];
                                $(splitVal(element.val(), opts.separator)).each(function () {
                                    var id = this, text = this, tags=opts.tags;
                                    if ($.isFunction(tags)) tags=tags();
                                    $(tags).each(function() { if (equal(this.id, id)) { text = this.text; return false; } });
                                    data.push({id: id, text: text});
                                });

                                callback(data);
                            };
                        }
                    }
                }
            }
            if (typeof(opts.query) !== "function") {
                throw "query function not defined for Select2 " + opts.element.attr("id");
            }

            return opts;
        },

        /**
         * Monitor the original element for changes and update select2 accordingly
         */
        // abstract
        monitorSource: function () {
            var el = this.opts.element, sync;

            el.bind("change.select2", this.bind(function (e) {
                if (this.opts.element.data("select2-change-triggered") !== true) {
                    this.initSelection();
                }
            }));

            sync = this.bind(function () {

                var enabled, readonly, self = this;

                // sync enabled state

                enabled = this.opts.element.attr("disabled") !== "disabled";
                readonly = this.opts.element.attr("readonly") === "readonly";

                enabled = enabled && !readonly;

                if (this.enabled !== enabled) {
                    if (enabled) {
                        this.enable();
                    } else {
                        this.disable();
                    }
                }


                syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);
                this.container.addClass(evaluate(this.opts.containerCssClass));

                syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass);
                this.dropdown.addClass(evaluate(this.opts.dropdownCssClass));

            });

            // mozilla and IE
            el.bind("propertychange.select2 DOMAttrModified.select2", sync);
            // safari and chrome
            if (typeof WebKitMutationObserver !== "undefined") {
                if (this.propertyObserver) { delete this.propertyObserver; this.propertyObserver = null; }
                this.propertyObserver = new WebKitMutationObserver(function (mutations) {
                    mutations.forEach(sync);
                });
                this.propertyObserver.observe(el.get(0), { attributes:true, subtree:false });
            }
        },

        /**
         * Triggers the change event on the source element
         */
        // abstract
        triggerChange: function (details) {

            details = details || {};
            details= $.extend({}, details, { type: "change", val: this.val() });
            // prevents recursive triggering
            this.opts.element.data("select2-change-triggered", true);
            this.opts.element.trigger(details);
            this.opts.element.data("select2-change-triggered", false);

            // some validation frameworks ignore the change event and listen instead to keyup, click for selects
            // so here we trigger the click event manually
            this.opts.element.click();

            // ValidationEngine ignorea the change event and listens instead to blur
            // so here we trigger the blur event manually if so desired
            if (this.opts.blurOnChange)
                this.opts.element.blur();
        },

        // abstract
        enable: function() {
            if (this.enabled) return;

            this.enabled=true;
            this.container.removeClass("select2-container-disabled");
            this.opts.element.removeAttr("disabled");
        },

        // abstract
        disable: function() {
            if (!this.enabled) return;

            this.close();

            this.enabled=false;
            this.container.addClass("select2-container-disabled");
            this.opts.element.attr("disabled", "disabled");
        },

        // abstract
        opened: function () {
            return this.container.hasClass("select2-dropdown-open");
        },

        // abstract
        positionDropdown: function() {
            var offset = this.container.offset(),
                height = this.container.outerHeight(false),
                width = this.container.outerWidth(false),
                dropHeight = this.dropdown.outerHeight(false),
              viewPortRight = $(window).scrollLeft() + $(window).width(),
                viewportBottom = $(window).scrollTop() + $(window).height(),
                dropTop = offset.top + height,
                dropLeft = offset.left,
                enoughRoomBelow = dropTop + dropHeight <= viewportBottom,
                enoughRoomAbove = (offset.top - dropHeight) >= this.body().scrollTop(),
              dropWidth = this.dropdown.outerWidth(false),
              enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight,
                aboveNow = this.dropdown.hasClass("select2-drop-above"),
                bodyOffset,
                above,
                css;

            //console.log("below/ droptop:", dropTop, "dropHeight", dropHeight, "sum", (dropTop+dropHeight)+" viewport bottom", viewportBottom, "enough?", enoughRoomBelow);
            //console.log("above/ offset.top", offset.top, "dropHeight", dropHeight, "top", (offset.top-dropHeight), "scrollTop", this.body().scrollTop(), "enough?", enoughRoomAbove);

            // fix positioning when body has an offset and is not position: static

            if (this.body().css('position') !== 'static') {
                bodyOffset = this.body().offset();
                dropTop -= bodyOffset.top;
                dropLeft -= bodyOffset.left;
            }

            // always prefer the current above/below alignment, unless there is not enough room

            if (aboveNow) {
                above = true;
                if (!enoughRoomAbove && enoughRoomBelow) above = false;
            } else {
                above = false;
                if (!enoughRoomBelow && enoughRoomAbove) above = true;
            }

            if (!enoughRoomOnRight) {
               dropLeft = offset.left + width - dropWidth;
            }

            if (above) {
                dropTop = offset.top - dropHeight;
                this.container.addClass("select2-drop-above");
                this.dropdown.addClass("select2-drop-above");
            }
            else {
                this.container.removeClass("select2-drop-above");
                this.dropdown.removeClass("select2-drop-above");
            }

            css = $.extend({
                top: dropTop,
                left: dropLeft,
                width: width
            }, evaluate(this.opts.dropdownCss));

            this.dropdown.css(css);
        },

        // abstract
        shouldOpen: function() {
            var event;

            if (this.opened()) return false;

            event = $.Event("opening");
            this.opts.element.trigger(event);
            return !event.isDefaultPrevented();
        },

        // abstract
        clearDropdownAlignmentPreference: function() {
            // clear the classes used to figure out the preference of where the dropdown should be opened
            this.container.removeClass("select2-drop-above");
            this.dropdown.removeClass("select2-drop-above");
        },

        /**
         * Opens the dropdown
         *
         * @return {Boolean} whether or not dropdown was opened. This method will return false if, for example,
         * the dropdown is already open, or if the 'open' event listener on the element called preventDefault().
         */
        // abstract
        open: function () {

            if (!this.shouldOpen()) return false;

            window.setTimeout(this.bind(this.opening), 1);

            return true;
        },

        /**
         * Performs the opening of the dropdown
         */
        // abstract
        opening: function() {
            var cid = this.containerId,
                scroll = "scroll." + cid,
                resize = "resize."+cid,
                orient = "orientationchange."+cid,
                mask;

            this.clearDropdownAlignmentPreference();

            this.container.addClass("select2-dropdown-open").addClass("select2-container-active");


            if(this.dropdown[0] !== this.body().children().last()[0]) {
                this.dropdown.detach().appendTo(this.body());
            }

            this.updateResults(true);

            // create the dropdown mask if doesnt already exist
            mask = $("#select2-drop-mask");
            if (mask.length == 0) {
                mask = $(document.createElement("div"));
                mask.attr("id","select2-drop-mask").attr("class","select2-drop-mask");
                mask.hide();
                mask.appendTo(this.body());
                mask.bind("mousedown touchstart", function (e) {
                    var dropdown = $("#select2-drop"), self;
                    if (dropdown.length > 0) {
                        self=dropdown.data("select2");
                        if (self.opts.selectOnBlur) {
                            self.selectHighlighted({noFocus: true});
                        }
                        self.close();
                    }
                });
            }

            // ensure the mask is always right before the dropdown
            if (this.dropdown.prev()[0] !== mask[0]) {
                this.dropdown.before(mask);
            }

            // move the global id to the correct dropdown
            $("#select2-drop").removeAttr("id");
            this.dropdown.attr("id", "select2-drop");

            // show the elements
            mask.css(_makeMaskCss());
            mask.show();
            this.dropdown.show();
            this.positionDropdown();

            this.dropdown.addClass("select2-drop-active");
            this.ensureHighlightVisible();

            // attach listeners to events that can change the position of the container and thus require
            // the position of the dropdown to be updated as well so it does not come unglued from the container
            var that = this;
            this.container.parents().add(window).each(function () {
                $(this).bind(resize+" "+scroll+" "+orient, function (e) {
                    $("#select2-drop-mask").css(_makeMaskCss());
                    that.positionDropdown();
                });
            });

            this.focusSearch();

            function _makeMaskCss() {
                return {
                    width  : Math.max(document.documentElement.scrollWidth,  $(window).width()),
                    height : Math.max(document.documentElement.scrollHeight, $(window).height())
                }
            }
        },

        // abstract
        close: function () {
            if (!this.opened()) return;

            var cid = this.containerId,
                scroll = "scroll." + cid,
                resize = "resize."+cid,
                orient = "orientationchange."+cid;

            // unbind event listeners
            this.container.parents().add(window).each(function () { $(this).unbind(scroll).unbind(resize).unbind(orient); });

            this.clearDropdownAlignmentPreference();

            $("#select2-drop-mask").hide();
            this.dropdown.removeAttr("id"); // only the active dropdown has the select2-drop id
            this.dropdown.hide();
            this.container.removeClass("select2-dropdown-open");
            this.results.empty();
            this.clearSearch();
            this.search.removeClass("select2-active");
            this.opts.element.trigger($.Event("close"));
        },

        // abstract
        clearSearch: function () {

        },

        //abstract
        getMaximumSelectionSize: function() {
            return evaluate(this.opts.maximumSelectionSize);
        },

        // abstract
        ensureHighlightVisible: function () {
            var results = this.results, children, index, child, hb, rb, y, more;

            index = this.highlight();

            if (index < 0) return;

            if (index == 0) {

                // if the first element is highlighted scroll all the way to the top,
                // that way any unselectable headers above it will also be scrolled
                // into view

                results.scrollTop(0);
                return;
            }

            children = this.findHighlightableChoices();

            child = $(children[index]);

            hb = child.offset().top + child.outerHeight(true);

            // if this is the last child lets also make sure select2-more-results is visible
            if (index === children.length - 1) {
                more = results.find("li.select2-more-results");
                if (more.length > 0) {
                    hb = more.offset().top + more.outerHeight(true);
                }
            }

            rb = results.offset().top + results.outerHeight(true);
            if (hb > rb) {
                results.scrollTop(results.scrollTop() + (hb - rb));
            }
            y = child.offset().top - results.offset().top;

            // make sure the top of the element is visible
            if (y < 0 && child.css('display') != 'none' ) {
                results.scrollTop(results.scrollTop() + y); // y is negative
            }
        },

        // abstract
        findHighlightableChoices: function() {
            var h=this.results.find(".select2-result-selectable:not(.select2-selected):not(.select2-disabled)");
            return this.results.find(".select2-result-selectable:not(.select2-selected):not(.select2-disabled)");
        },

        // abstract
        moveHighlight: function (delta) {
            var choices = this.findHighlightableChoices(),
                index = this.highlight();

            while (index > -1 && index < choices.length) {
                index += delta;
                var choice = $(choices[index]);
                if (choice.hasClass("select2-result-selectable") && !choice.hasClass("select2-disabled") && !choice.hasClass("select2-selected")) {
                    this.highlight(index);
                    break;
                }
            }
        },

        // abstract
        highlight: function (index) {
            var choices = this.findHighlightableChoices(),
                choice,
                data;

            if (arguments.length === 0) {
                return indexOf(choices.filter(".select2-highlighted")[0], choices.get());
            }

            if (index >= choices.length) index = choices.length - 1;
            if (index < 0) index = 0;

            this.results.find(".select2-highlighted").removeClass("select2-highlighted");

            choice = $(choices[index]);
            choice.addClass("select2-highlighted");

            this.ensureHighlightVisible();

            data = choice.data("select2-data");
            if (data) {
                this.opts.element.trigger({ type: "highlight", val: this.id(data), choice: data });
            }
        },

        // abstract
        countSelectableResults: function() {
            return this.findHighlightableChoices().length;
        },

        // abstract
        highlightUnderEvent: function (event) {
            var el = $(event.target).closest(".select2-result-selectable");
            if (el.length > 0 && !el.is(".select2-highlighted")) {
            var choices = this.findHighlightableChoices();
                this.highlight(choices.index(el));
            } else if (el.length == 0) {
                // if we are over an unselectable item remove al highlights
                this.results.find(".select2-highlighted").removeClass("select2-highlighted");
            }
        },

        // abstract
        loadMoreIfNeeded: function () {
            var results = this.results,
                more = results.find("li.select2-more-results"),
                below, // pixels the element is below the scroll fold, below==0 is when the element is starting to be visible
                offset = -1, // index of first element without data
                page = this.resultsPage + 1,
                self=this,
                term=this.search.val(),
                context=this.context;

            if (more.length === 0) return;
            below = more.offset().top - results.offset().top - results.height();

            if (below <= this.opts.loadMorePadding) {
                more.addClass("select2-active");
                this.opts.query({
                        element: this.opts.element,
                        term: term,
                        page: page,
                        context: context,
                        matcher: this.opts.matcher,
                        callback: this.bind(function (data) {

                    // ignore a response if the select2 has been closed before it was received
                    if (!self.opened()) return;


                    self.opts.populateResults.call(this, results, data.results, {term: term, page: page, context:context});
                    self.postprocessResults(data, false, false);

                    if (data.more===true) {
                        more.detach().appendTo(results).text(self.opts.formatLoadMore(page+1));
                        window.setTimeout(function() { self.loadMoreIfNeeded(); }, 10);
                    } else {
                        more.remove();
                    }
                    self.positionDropdown();
                    self.resultsPage = page;
                    self.context = data.context;
                })});
            }
        },

        /**
         * Default tokenizer function which does nothing
         */
        tokenize: function() {

        },

        /**
         * @param initial whether or not this is the call to this method right after the dropdown has been opened
         */
        // abstract
        updateResults: function (initial) {
            var search = this.search,
                results = this.results,
                opts = this.opts,
                data,
                self = this,
                input,
                term = search.val(),
                lastTerm=$.data(this.container, "select2-last-term");

            // prevent duplicate queries against the same term
            if (initial !== true && lastTerm && equal(term, lastTerm)) return;

            $.data(this.container, "select2-last-term", term);

            // if the search is currently hidden we do not alter the results
            if (initial !== true && (this.showSearchInput === false || !this.opened())) {
                return;
            }

            function postRender() {
                results.scrollTop(0);
                search.removeClass("select2-active");
                self.positionDropdown();
            }

            function render(html) {
                results.html(html);
                postRender();
            }

            var maxSelSize = this.getMaximumSelectionSize();
            if (maxSelSize >=1) {
                data = this.data();
                if ($.isArray(data) && data.length >= maxSelSize && checkFormatter(opts.formatSelectionTooBig, "formatSelectionTooBig")) {
                  render("<li class='select2-selection-limit'>" + opts.formatSelectionTooBig(maxSelSize) + "</li>");
                  return;
                }
            }

            if (search.val().length < opts.minimumInputLength) {
                if (checkFormatter(opts.formatInputTooShort, "formatInputTooShort")) {
                    render("<li class='select2-no-results'>" + opts.formatInputTooShort(search.val(), opts.minimumInputLength) + "</li>");
                } else {
                    render("");
                }
                return;
            }

            if (opts.maximumInputLength && search.val().length > opts.maximumInputLength) {
                if (checkFormatter(opts.formatInputTooLong, "formatInputTooLong")) {
                    render("<li class='select2-no-results'>" + opts.formatInputTooLong(search.val(), opts.maximumInputLength) + "</li>");
                } else {
                    render("");
                }
                return;
            }

            if (opts.formatSearching && this.findHighlightableChoices().length === 0) {
                render("<li class='select2-searching'>" + opts.formatSearching() + "</li>");
            }

            search.addClass("select2-active");

            // give the tokenizer a chance to pre-process the input
            input = this.tokenize();
            if (input != undefined && input != null) {
                search.val(input);
            }

            this.resultsPage = 1;

            opts.query({
                element: opts.element,
                    term: search.val(),
                    page: this.resultsPage,
                    context: null,
                    matcher: opts.matcher,
                    callback: this.bind(function (data) {
                var def; // default choice

                // ignore a response if the select2 has been closed before it was received
                if (!this.opened()) {
                    this.search.removeClass("select2-active");
                    return;
                }

                // save context, if any
                this.context = (data.context===undefined) ? null : data.context;
                // create a default choice and prepend it to the list
                if (this.opts.createSearchChoice && search.val() !== "") {
                    def = this.opts.createSearchChoice.call(null, search.val(), data.results);
                    if (def !== undefined && def !== null && self.id(def) !== undefined && self.id(def) !== null) {
                        if ($(data.results).filter(
                            function () {
                                return equal(self.id(this), self.id(def));
                            }).length === 0) {
                            data.results.push(def);
                        }
                    }
                }

                if (data.results.length === 0 && checkFormatter(opts.formatNoMatches, "formatNoMatches")) {
                    render("<li class='select2-no-results'>" + opts.formatNoMatches(search.val()) + "</li>");
                    return;
                }

                results.empty();
                self.opts.populateResults.call(this, results, data.results, {term: search.val(), page: this.resultsPage, context:null});

                if (data.more === true && checkFormatter(opts.formatLoadMore, "formatLoadMore")) {
                    results.append("<li class='select2-more-results'>" + self.opts.escapeMarkup(opts.formatLoadMore(this.resultsPage)) + "</li>");
                    window.setTimeout(function() { self.loadMoreIfNeeded(); }, 10);
                }

                this.postprocessResults(data, initial);

                postRender();

                this.opts.element.trigger({ type: "loaded", data:data });
            })});
        },

        // abstract
        cancel: function () {
            this.close();
        },

        // abstract
        blur: function () {
            // if selectOnBlur == true, select the currently highlighted option
            if (this.opts.selectOnBlur)
                this.selectHighlighted({noFocus: true});

            this.close();
            this.container.removeClass("select2-container-active");
            // synonymous to .is(':focus'), which is available in jquery >= 1.6
            if (this.search[0] === document.activeElement) { this.search.blur(); }
            this.clearSearch();
            this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
        },

        // abstract
        focusSearch: function () {
            focus(this.search);
        },

        // abstract
        selectHighlighted: function (options) {
            var index=this.highlight(),
                highlighted=this.results.find(".select2-highlighted"),
                data = highlighted.closest('.select2-result').data("select2-data");

            if (data) {
                this.highlight(index);
                this.onSelect(data, options);
            }
        },

        // abstract
        getPlaceholder: function () {
            return this.opts.element.attr("placeholder") ||
                this.opts.element.attr("data-placeholder") || // jquery 1.4 compat
                this.opts.element.data("placeholder") ||
                this.opts.placeholder;
        },

        /**
         * Get the desired width for the container element.  This is
         * derived first from option `width` passed to select2, then
         * the inline 'style' on the original element, and finally
         * falls back to the jQuery calculated element width.
         */
        // abstract
        initContainerWidth: function () {
            function resolveContainerWidth() {
                var style, attrs, matches, i, l;

                if (this.opts.width === "off") {
                    return null;
                } else if (this.opts.width === "element"){
                    return this.opts.element.outerWidth(false) === 0 ? 'auto' : this.opts.element.outerWidth(false) + 'px';
                } else if (this.opts.width === "copy" || this.opts.width === "resolve") {
                    // check if there is inline style on the element that contains width
                    style = this.opts.element.attr('style');
                    if (style !== undefined) {
                        attrs = style.split(';');
                        for (i = 0, l = attrs.length; i < l; i = i + 1) {
                            matches = attrs[i].replace(/\s/g, '')
                                .match(/width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/);
                            if (matches !== null && matches.length >= 1)
                                return matches[1];
                        }
                    }

                    if (this.opts.width === "resolve") {
                        // next check if css('width') can resolve a width that is percent based, this is sometimes possible
                        // when attached to input type=hidden or elements hidden via css
                        style = this.opts.element.css('width');
                        if (style.indexOf("%") > 0) return style;

                        // finally, fallback on the calculated width of the element
                        return (this.opts.element.outerWidth(false) === 0 ? 'auto' : this.opts.element.outerWidth(false) + 'px');
                    }

                    return null;
                } else if ($.isFunction(this.opts.width)) {
                    return this.opts.width();
                } else {
                    return this.opts.width;
               }
            };

            var width = resolveContainerWidth.call(this);
            if (width !== null) {
                this.container.css("width", width);
            }
        }
    });

    SingleSelect2 = clazz(AbstractSelect2, {

        // single

    createContainer: function () {
            var container = $(document.createElement("div")).attr({
                "class": "select2-container"
            }).html([
                "<a href='javascript:void(0)' onclick='return false;' class='select2-choice' tabindex='-1'>",
                "   <span></span><abbr class='select2-search-choice-close' style='display:none;'></abbr>",
                "   <div><b></b></div>" ,
                "</a>",
                "<input class='select2-focusser select2-offscreen' type='text'/>",
                "<div class='select2-drop' style='display:none'>" ,
                "   <div class='select2-search'>" ,
                "       <input type='text' autocomplete='off' class='select2-input'/>" ,
                "   </div>" ,
                "   <ul class='select2-results'>" ,
                "   </ul>" ,
                "</div>"].join(""));
            return container;
        },

        // single
        disable: function() {
            if (!this.enabled) return;

            this.parent.disable.apply(this, arguments);

            this.focusser.attr("disabled", "disabled");
        },

        // single
        enable: function() {
            if (this.enabled) return;

            this.parent.enable.apply(this, arguments);

            this.focusser.removeAttr("disabled");
        },

        // single
        opening: function () {
            this.parent.opening.apply(this, arguments);
            this.focusser.attr("disabled", "disabled");

            this.opts.element.trigger($.Event("open"));
        },

        // single
        close: function () {
            if (!this.opened()) return;
            this.parent.close.apply(this, arguments);
            this.focusser.removeAttr("disabled");
            focus(this.focusser);
        },

        // single
        focus: function () {
            if (this.opened()) {
                this.close();
            } else {
                this.focusser.removeAttr("disabled");
                this.focusser.focus();
            }
        },

        // single
        isFocused: function () {
            return this.container.hasClass("select2-container-active");
        },

        // single
        cancel: function () {
            this.parent.cancel.apply(this, arguments);
            this.focusser.removeAttr("disabled");
            this.focusser.focus();
        },

        // single
        initContainer: function () {

            var selection,
                container = this.container,
                dropdown = this.dropdown,
                clickingInside = false;

            this.showSearch(this.opts.minimumResultsForSearch >= 0);

            this.selection = selection = container.find(".select2-choice");

            this.focusser = container.find(".select2-focusser");

            // rewrite labels from original element to focusser
            this.focusser.attr("id", "s2id_autogen"+nextUid());
            $("label[for='" + this.opts.element.attr("id") + "']")
                .attr('for', this.focusser.attr('id'));

            this.search.bind("keydown", this.bind(function (e) {
                if (!this.enabled) return;

                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                    // prevent the page from scrolling
                    killEvent(e);
                    return;
                }

                switch (e.which) {
                    case KEY.UP:
                    case KEY.DOWN:
                        this.moveHighlight((e.which === KEY.UP) ? -1 : 1);
                        killEvent(e);
                        return;
                    case KEY.TAB:
                    case KEY.ENTER:
                        this.selectHighlighted();
                        killEvent(e);
                        return;
                    case KEY.ESC:
                        this.cancel(e);
                        killEvent(e);
                        return;
                }
            }));

            this.search.bind("blur", this.bind(function(e) {
                // a workaround for chrome to keep the search field focussed when the scroll bar is used to scroll the dropdown.
                // without this the search field loses focus which is annoying
                if (document.activeElement === this.body().get(0)) {
                    window.setTimeout(this.bind(function() {
                        this.search.focus();
                    }), 0);
                }
            }));

            this.focusser.bind("keydown", this.bind(function (e) {
                if (!this.enabled) return;

                if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC) {
                    return;
                }

                if (this.opts.openOnEnter === false && e.which === KEY.ENTER) {
                    killEvent(e);
                    return;
                }

                if (e.which == KEY.DOWN || e.which == KEY.UP
                    || (e.which == KEY.ENTER && this.opts.openOnEnter)) {
                    this.open();
                    killEvent(e);
                    return;
                }

                if (e.which == KEY.DELETE || e.which == KEY.BACKSPACE) {
                    if (this.opts.allowClear) {
                        this.clear();
                    }
                    killEvent(e);
                    return;
                }
            }));


            installKeyUpChangeEvent(this.focusser);
            this.focusser.bind("keyup-change input", this.bind(function(e) {
                if (this.opened()) return;
                this.open();
                if (this.showSearchInput !== false) {
                    this.search.val(this.focusser.val());
                }
                this.focusser.val("");
                killEvent(e);
            }));

            selection.delegate("abbr", "mousedown", this.bind(function (e) {
                if (!this.enabled) return;
                this.clear();
                killEventImmediately(e);
                this.close();
                this.selection.focus();
            }));

            selection.bind("mousedown", this.bind(function (e) {
                clickingInside = true;

                if (this.opened()) {
                    this.close();
                } else if (this.enabled) {
                    this.open();
                }

                killEvent(e);

                clickingInside = false;
            }));

            dropdown.bind("mousedown", this.bind(function() { this.search.focus(); }));

            selection.bind("focus", this.bind(function(e) {
                killEvent(e);
            }));

            this.focusser.bind("focus", this.bind(function(){
                this.container.addClass("select2-container-active");
            })).bind("blur", this.bind(function() {
                if (!this.opened()) {
                    this.container.removeClass("select2-container-active");
                }
            }));
            this.search.bind("focus", this.bind(function(){
                this.container.addClass("select2-container-active");
            }))

            this.initContainerWidth();
            this.setPlaceholder();

        },

        // single
        clear: function(triggerChange) {
            var data=this.selection.data("select2-data");
            if (data) { // guard against queued quick consecutive clicks
                this.opts.element.val("");
                this.selection.find("span").empty();
                this.selection.removeData("select2-data");
                this.setPlaceholder();

                if (triggerChange !== false){
                    this.opts.element.trigger({ type: "removed", val: this.id(data), choice: data });
                    this.triggerChange({removed:data});
                }
            }
        },

        /**
         * Sets selection based on source element's value
         */
        // single
        initSelection: function () {
            var selected;
            if (this.opts.element.val() === "" && this.opts.element.text() === "") {
                this.close();
                this.setPlaceholder();
            } else {
                var self = this;
                this.opts.initSelection.call(null, this.opts.element, function(selected){
                    if (selected !== undefined && selected !== null) {
                        self.updateSelection(selected);
                        self.close();
                        self.setPlaceholder();
                    }
                });
            }
        },

        // single
        prepareOpts: function () {
            var opts = this.parent.prepareOpts.apply(this, arguments);

            if (opts.element.get(0).tagName.toLowerCase() === "select") {
                // install the selection initializer
                opts.initSelection = function (element, callback) {
                    var selected = element.find(":selected");
                    // a single select box always has a value, no need to null check 'selected'
                    if ($.isFunction(callback))
                        callback({id: selected.attr("value"), text: selected.text(), element:selected});
                };
            } else if ("data" in opts) {
                // install default initSelection when applied to hidden input and data is local
                opts.initSelection = opts.initSelection || function (element, callback) {
                    var id = element.val();
                    //search in data by id, storing the actual matching item
                    var match = null;
                    opts.query({
                        matcher: function(term, text, el){
                            var is_match = equal(id, opts.id(el));
                            if (is_match) {
                                match = el;
                            }
                            return is_match;
                        },
                        callback: !$.isFunction(callback) ? $.noop : function() {
                            callback(match);
                        }
                    });
                };
            }

            return opts;
        },

        // single
        getPlaceholder: function() {
            // if a placeholder is specified on a single select without the first empty option ignore it
            if (this.select) {
                if (this.select.find("option").first().text() !== "") {
                    return undefined;
                }
            }

            return this.parent.getPlaceholder.apply(this, arguments);
        },

        // single
        setPlaceholder: function () {
            var placeholder = this.getPlaceholder();

            if (this.opts.element.val() === "" && placeholder !== undefined) {

                // check for a first blank option if attached to a select
                if (this.select && this.select.find("option:first").text() !== "") return;

                this.selection.find("span").html(this.opts.escapeMarkup(placeholder));

                this.selection.addClass("select2-default");

                this.selection.find("abbr").hide();
            }
        },

        // single
        postprocessResults: function (data, initial, noHighlightUpdate) {
            var selected = 0, self = this, showSearchInput = true;

            // find the selected element in the result list

            this.findHighlightableChoices().each2(function (i, elm) {
                if (equal(self.id(elm.data("select2-data")), self.opts.element.val())) {
                    selected = i;
                    return false;
                }
            });

            // and highlight it
            if (noHighlightUpdate !== false) {
                this.highlight(selected);
            }

            // hide the search box if this is the first we got the results and there are a few of them

            if (initial === true) {
                var min=this.opts.minimumResultsForSearch;
                showSearchInput  = min < 0 ? false : countResults(data.results) >= min;
                this.showSearch(showSearchInput);
            }

        },

        // single
        showSearch: function(showSearchInput) {
            this.showSearchInput = showSearchInput;

            this.dropdown.find(".select2-search")[showSearchInput ? "removeClass" : "addClass"]("select2-search-hidden");
            //add "select2-with-searchbox" to the container if search box is shown
            $(this.dropdown, this.container)[showSearchInput ? "addClass" : "removeClass"]("select2-with-searchbox");
        },

        // single
        onSelect: function (data, options) {
            var old = this.opts.element.val();

            this.opts.element.val(this.id(data));
            this.updateSelection(data);

            this.opts.element.trigger({ type: "selected", val: this.id(data), choice: data });

            this.close();

            if (!options || !options.noFocus)
                this.selection.focus();

            if (!equal(old, this.id(data))) { this.triggerChange(); }
        },

        // single
        updateSelection: function (data) {

            var container=this.selection.find("span"), formatted;

            this.selection.data("select2-data", data);

            container.empty();
            formatted=this.opts.formatSelection(data, container);
            if (formatted !== undefined) {
                container.append(this.opts.escapeMarkup(formatted));
            }

            this.selection.removeClass("select2-default");

            if (this.opts.allowClear && this.getPlaceholder() !== undefined) {
                this.selection.find("abbr").show();
            }
        },

        // single
        val: function () {
            var val, triggerChange = false, data = null, self = this;

            if (arguments.length === 0) {
                return this.opts.element.val();
            }

            val = arguments[0];

            if (arguments.length > 1) {
                triggerChange = arguments[1];
            }

            if (this.select) {
                this.select
                    .val(val)
                    .find(":selected").each2(function (i, elm) {
                        data = {id: elm.attr("value"), text: elm.text(), element: elm.get(0)};
                        return false;
                    });
                this.updateSelection(data);
                this.setPlaceholder();
                if (triggerChange) {
                    this.triggerChange();
                }
            } else {
                if (this.opts.initSelection === undefined) {
                    throw new Error("cannot call val() if initSelection() is not defined");
                }
                // val is an id. !val is true for [undefined,null,'',0] - 0 is legal
                if (!val && val !== 0) {
                    this.clear(triggerChange);
                    if (triggerChange) {
                        this.triggerChange();
                    }
                    return;
                }
                this.opts.element.val(val);
                this.opts.initSelection(this.opts.element, function(data){
                    self.opts.element.val(!data ? "" : self.id(data));
                    self.updateSelection(data);
                    self.setPlaceholder();
                    if (triggerChange) {
                        self.triggerChange();
                    }
                });
            }
        },

        // single
        clearSearch: function () {
            this.search.val("");
            this.focusser.val("");
        },

        // single
        data: function(value) {
            var data;

            if (arguments.length === 0) {
                data = this.selection.data("select2-data");
                if (data == undefined) data = null;
                return data;
            } else {
                if (!value || value === "") {
                    this.clear();
                } else {
                    this.opts.element.val(!value ? "" : this.id(value));
                    this.updateSelection(value);
                }
            }
        }
    });

    MultiSelect2 = clazz(AbstractSelect2, {

        // multi
        createContainer: function () {
            var container = $(document.createElement("div")).attr({
                "class": "select2-container select2-container-multi"
            }).html([
                "    <ul class='select2-choices'>",
                //"<li class='select2-search-choice'><span>California</span><a href="javascript:void(0)" class="select2-search-choice-close"></a></li>" ,
                "  <li class='select2-search-field'>" ,
                "    <input type='text' autocomplete='off' class='select2-input'>" ,
                "  </li>" ,
                "</ul>" ,
                "<div class='select2-drop select2-drop-multi' style='display:none;'>" ,
                "   <ul class='select2-results'>" ,
                "   </ul>" ,
                "</div>"].join(""));
      return container;
        },

        // multi
        prepareOpts: function () {
            var opts = this.parent.prepareOpts.apply(this, arguments);

            // TODO validate placeholder is a string if specified

            if (opts.element.get(0).tagName.toLowerCase() === "select") {
                // install sthe selection initializer
                opts.initSelection = function (element, callback) {

                    var data = [];

                    element.find(":selected").each2(function (i, elm) {
                        data.push({id: elm.attr("value"), text: elm.text(), element: elm[0]});
                    });
                    callback(data);
                };
            } else if ("data" in opts) {
                // install default initSelection when applied to hidden input and data is local
                opts.initSelection = opts.initSelection || function (element, callback) {
                    var ids = splitVal(element.val(), opts.separator);
                    //search in data by array of ids, storing matching items in a list
                    var matches = [];
                    opts.query({
                        matcher: function(term, text, el){
                            var is_match = $.grep(ids, function(id) {
                                return equal(id, opts.id(el));
                            }).length;
                            if (is_match) {
                                matches.push(el);
                            }
                            return is_match;
                        },
                        callback: !$.isFunction(callback) ? $.noop : function() {
                            callback(matches);
                        }
                    });
                };
            }

            return opts;
        },

        // multi
        initContainer: function () {

            var selector = ".select2-choices", selection;

            this.searchContainer = this.container.find(".select2-search-field");
            this.selection = selection = this.container.find(selector);

            // rewrite labels from original element to focusser
            this.search.attr("id", "s2id_autogen"+nextUid());
            $("label[for='" + this.opts.element.attr("id") + "']")
                .attr('for', this.search.attr('id'));

            this.search.bind("input paste", this.bind(function() {
                if (!this.enabled) return;
                if (!this.opened()) {
                    this.open();
                }
            }));

            this.search.bind("keydown", this.bind(function (e) {
                if (!this.enabled) return;

                if (e.which === KEY.BACKSPACE && this.search.val() === "") {
                    this.close();

                    var choices,
                        selected = selection.find(".select2-search-choice-focus");
                    if (selected.length > 0) {
                        this.unselect(selected.first());
                        this.search.width(10);
                        killEvent(e);
                        return;
                    }

                    choices = selection.find(".select2-search-choice:not(.select2-locked)");
                    if (choices.length > 0) {
                        choices.last().addClass("select2-search-choice-focus");
                    }
                } else {
                    selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
                }

                if (this.opened()) {
                    switch (e.which) {
                    case KEY.UP:
                    case KEY.DOWN:
                        this.moveHighlight((e.which === KEY.UP) ? -1 : 1);
                        killEvent(e);
                        return;
                    case KEY.ENTER:
                    case KEY.TAB:
                        this.selectHighlighted();
                        killEvent(e);
                        return;
                    case KEY.ESC:
                        this.cancel(e);
                        killEvent(e);
                        return;
                    }
                }

                if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e)
                 || e.which === KEY.BACKSPACE || e.which === KEY.ESC) {
                    return;
                }

                if (e.which === KEY.ENTER) {
                    if (this.opts.openOnEnter === false) {
                        return;
                    } else if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) {
                        return;
                    }
                }

                this.open();

                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                    // prevent the page from scrolling
                    killEvent(e);
                }

                if (e.which === KEY.ENTER) {
                    // prevent form from being submitted
                    killEvent(e);
                }

            }));

            this.search.bind("keyup", this.bind(this.resizeSearch));

            this.search.bind("blur", this.bind(function(e) {
                this.container.removeClass("select2-container-active");
                this.search.removeClass("select2-focused");
                if (!this.opened()) this.clearSearch();
                e.stopImmediatePropagation();
            }));

            this.container.delegate(selector, "mousedown", this.bind(function (e) {
                if (!this.enabled) return;
                if ($(e.target).closest(".select2-search-choice").length > 0) {
                    // clicked inside a select2 search choice, do not open
                    return;
                }
                this.clearPlaceholder();
                this.open();
                this.focusSearch();
                e.preventDefault();
            }));

            this.container.delegate(selector, "focus", this.bind(function () {
                if (!this.enabled) return;
                this.container.addClass("select2-container-active");
                this.dropdown.addClass("select2-drop-active");
                this.clearPlaceholder();
            }));

            this.initContainerWidth();

            // set the placeholder if necessary
            this.clearSearch();
        },

        // multi
        enable: function() {
            if (this.enabled) return;

            this.parent.enable.apply(this, arguments);

            this.search.removeAttr("disabled");
        },

        // multi
        disable: function() {
            if (!this.enabled) return;

            this.parent.disable.apply(this, arguments);

            this.search.attr("disabled", true);
        },

        // multi
        initSelection: function () {
            var data;
            if (this.opts.element.val() === "" && this.opts.element.text() === "") {
                this.updateSelection([]);
                this.close();
                // set the placeholder if necessary
                this.clearSearch();
            }
            if (this.select || this.opts.element.val() !== "") {
                var self = this;
                this.opts.initSelection.call(null, this.opts.element, function(data){
                    if (data !== undefined && data !== null) {
                        self.updateSelection(data);
                        self.close();
                        // set the placeholder if necessary
                        self.clearSearch();
                    }
                });
            }
        },

        // multi
        clearSearch: function () {
            var placeholder = this.getPlaceholder();

            if (placeholder !== undefined  && this.getVal().length === 0 && this.search.hasClass("select2-focused") === false) {
                this.search.val(placeholder).addClass("select2-default");
                // stretch the search box to full width of the container so as much of the placeholder is visible as possible
                // we could call this.resizeSearch(), but we do not because that requires a sizer and we do not want to create one so early because of a firefox bug, see #944
                this.search.width(this.getMaxSearchWidth());
            } else {
                this.search.val("").width(10);
            }
        },

        // multi
        clearPlaceholder: function () {
            if (this.search.hasClass("select2-default")) {
                this.search.val("").removeClass("select2-default");
            }
        },

        // multi
        opening: function () {
            this.clearPlaceholder(); // should be done before super so placeholder is not used to search
            this.resizeSearch();

            this.parent.opening.apply(this, arguments);

            this.focusSearch();

            this.opts.element.trigger($.Event("open"));
        },

        // multi
        close: function () {
            if (!this.opened()) return;
            this.parent.close.apply(this, arguments);
        },

        // multi
        focus: function () {
            this.close();
            this.search.focus();
            //this.opts.element.triggerHandler("focus");
        },

        // multi
        isFocused: function () {
            return this.search.hasClass("select2-focused");
        },

        // multi
        updateSelection: function (data) {
            var ids = [], filtered = [], self = this;

            // filter out duplicates
            $(data).each(function () {
                if (indexOf(self.id(this), ids) < 0) {
                    ids.push(self.id(this));
                    filtered.push(this);
                }
            });
            data = filtered;

            this.selection.find(".select2-search-choice").remove();
            $(data).each(function () {
                self.addSelectedChoice(this);
            });
            self.postprocessResults();
        },

        // multi
        tokenize: function() {
            var input = this.search.val();
            input = this.opts.tokenizer(input, this.data(), this.bind(this.onSelect), this.opts);
            if (input != null && input != undefined) {
                this.search.val(input);
                if (input.length > 0) {
                    this.open();
                }
            }

        },

        // multi
        onSelect: function (data, options) {
            this.addSelectedChoice(data);

            this.opts.element.trigger({ type: "selected", val: this.id(data), choice: data });

            if (this.select || !this.opts.closeOnSelect) this.postprocessResults();

            if (this.opts.closeOnSelect) {
                this.close();
                this.search.width(10);
            } else {
                if (this.countSelectableResults()>0) {
                    this.search.width(10);
                    this.resizeSearch();
                    if (this.getMaximumSelectionSize() > 0 && this.val().length >= this.getMaximumSelectionSize()) {
                        // if we reached max selection size repaint the results so choices
                        // are replaced with the max selection reached message
                        this.updateResults(true);
                    }
                    this.positionDropdown();
                } else {
                    // if nothing left to select close
                    this.close();
                    this.search.width(10);
                }
            }

            // since its not possible to select an element that has already been
            // added we do not need to check if this is a new element before firing change
            this.triggerChange({ added: data });

            if (!options || !options.noFocus)
                this.focusSearch();
        },

        // multi
        cancel: function () {
            this.close();
            this.focusSearch();
        },

        addSelectedChoice: function (data) {
            var enableChoice = !data.locked,
                enabledItem = $(
                    "<li class='select2-search-choice'>" +
                    "    <div></div>" +
                    "    <a href='#' onclick='return false;' class='select2-search-choice-close' tabindex='-1'></a>" +
                    "</li>"),
                disabledItem = $(
                    "<li class='select2-search-choice select2-locked'>" +
                    "<div></div>" +
                    "</li>");
            var choice = enableChoice ? enabledItem : disabledItem,
                id = this.id(data),
                val = this.getVal(),
                formatted;

            formatted=this.opts.formatSelection(data, choice.find("div"));
            if (formatted != undefined) {
                choice.find("div").replaceWith("<div>"+this.opts.escapeMarkup(formatted)+"</div>");
            }

            if(enableChoice){
              choice.find(".select2-search-choice-close")
                  .bind("mousedown", killEvent)
                  .bind("click dblclick", this.bind(function (e) {
                  if (!this.enabled) return;

                  $(e.target).closest(".select2-search-choice").fadeOut('fast', this.bind(function(){
                      this.unselect($(e.target));
                      this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
                      this.close();
                      this.focusSearch();
                  })).dequeue();
                  killEvent(e);
              })).bind("focus", this.bind(function () {
                  if (!this.enabled) return;
                  this.container.addClass("select2-container-active");
                  this.dropdown.addClass("select2-drop-active");
              }));
            }

            choice.data("select2-data", data);
            choice.insertBefore(this.searchContainer);

            val.push(id);
            this.setVal(val);
        },

        // multi
        unselect: function (selected) {
            var val = this.getVal(),
                data,
                index;

            selected = selected.closest(".select2-search-choice");

            if (selected.length === 0) {
                throw "Invalid argument: " + selected + ". Must be .select2-search-choice";
            }

            data = selected.data("select2-data");

            if (!data) {
                // prevent a race condition when the 'x' is clicked really fast repeatedly the event can be queued
                // and invoked on an element already removed
                return;
            }

            index = indexOf(this.id(data), val);

            if (index >= 0) {
                val.splice(index, 1);
                this.setVal(val);
                if (this.select) this.postprocessResults();
            }
            selected.remove();

            this.opts.element.trigger({ type: "removed", val: this.id(data), choice: data });
            this.triggerChange({ removed: data });
        },

        // multi
        postprocessResults: function () {
            var val = this.getVal(),
                choices = this.results.find(".select2-result"),
                compound = this.results.find(".select2-result-with-children"),
                self = this;

            choices.each2(function (i, choice) {
                var id = self.id(choice.data("select2-data"));
                if (indexOf(id, val) >= 0) {
                    choice.addClass("select2-selected");
                    // mark all children of the selected parent as selected
                    choice.find(".select2-result-selectable").addClass("select2-selected");
                }
            });

            compound.each2(function(i, choice) {
                // hide an optgroup if it doesnt have any selectable children
                if (!choice.is('.select2-result-selectable')
                    && choice.find(".select2-result-selectable:not(.select2-selected)").length === 0) {
                    choice.addClass("select2-selected");
                }
            });

            if (this.highlight() == -1){
                self.highlight(0);
            }

        },

        // multi
        getMaxSearchWidth: function() {
            return this.selection.width() - getSideBorderPadding(this.search);
        },

        // multi
        resizeSearch: function () {
            var minimumWidth, left, maxWidth, containerLeft, searchWidth,
              sideBorderPadding = getSideBorderPadding(this.search);

            minimumWidth = measureTextWidth(this.search) + 10;

            left = this.search.offset().left;

            maxWidth = this.selection.width();
            containerLeft = this.selection.offset().left;

            searchWidth = maxWidth - (left - containerLeft) - sideBorderPadding;

            if (searchWidth < minimumWidth) {
                searchWidth = maxWidth - sideBorderPadding;
            }

            if (searchWidth < 40) {
                searchWidth = maxWidth - sideBorderPadding;
            }

            if (searchWidth <= 0) {
              searchWidth = minimumWidth;
            }

            this.search.width(searchWidth);
        },

        // multi
        getVal: function () {
            var val;
            if (this.select) {
                val = this.select.val();
                return val === null ? [] : val;
            } else {
                val = this.opts.element.val();
                return splitVal(val, this.opts.separator);
            }
        },

        // multi
        setVal: function (val) {
            var unique;
            if (this.select) {
                this.select.val(val);
            } else {
                unique = [];
                // filter out duplicates
                $(val).each(function () {
                    if (indexOf(this, unique) < 0) unique.push(this);
                });
                this.opts.element.val(unique.length === 0 ? "" : unique.join(this.opts.separator));
            }
        },

        // multi
        val: function () {
            var val, triggerChange = false, data = [], self=this;

            if (arguments.length === 0) {
                return this.getVal();
            }

            val = arguments[0];

            if (arguments.length > 1) {
                triggerChange = arguments[1];
            }

            // val is an id. !val is true for [undefined,null,'',0] - 0 is legal
            if (!val && val !== 0) {
                this.opts.element.val("");
                this.updateSelection([]);
                this.clearSearch();
                if (triggerChange) {
                    this.triggerChange();
                }
                return;
            }

            // val is a list of ids
            this.setVal(val);

            if (this.select) {
                this.opts.initSelection(this.select, this.bind(this.updateSelection));
                if (triggerChange) {
                    this.triggerChange();
                }
            } else {
                if (this.opts.initSelection === undefined) {
                    throw new Error("val() cannot be called if initSelection() is not defined");
                }

                this.opts.initSelection(this.opts.element, function(data){
                    var ids=$(data).map(self.id);
                    self.setVal(ids);
                    self.updateSelection(data);
                    self.clearSearch();
                    if (triggerChange) {
                        self.triggerChange();
                    }
                });
            }
            this.clearSearch();
        },

        // multi
        onSortStart: function() {
            if (this.select) {
                throw new Error("Sorting of elements is not supported when attached to <select>. Attach to <input type='hidden'/> instead.");
            }

            // collapse search field into 0 width so its container can be collapsed as well
            this.search.width(0);
            // hide the container
            this.searchContainer.hide();
        },

        // multi
        onSortEnd:function() {

            var val=[], self=this;

            // show search and move it to the end of the list
            this.searchContainer.show();
            // make sure the search container is the last item in the list
            this.searchContainer.appendTo(this.searchContainer.parent());
            // since we collapsed the width in dragStarted, we resize it here
            this.resizeSearch();

            // update selection

            this.selection.find(".select2-search-choice").each(function() {
                val.push(self.opts.id($(this).data("select2-data")));
            });
            this.setVal(val);
            this.triggerChange();
        },

        // multi
        data: function(values) {
            var self=this, ids;
            if (arguments.length === 0) {
                 return this.selection
                     .find(".select2-search-choice")
                     .map(function() { return $(this).data("select2-data"); })
                     .get();
            } else {
                if (!values) { values = []; }
                ids = $.map(values, function(e) { return self.opts.id(e); });
                this.setVal(ids);
                this.updateSelection(values);
                this.clearSearch();
            }
        }
    });

    $.fn.select2 = function () {

        var args = Array.prototype.slice.call(arguments, 0),
            opts,
            select2,
            value, multiple, allowedMethods = ["val", "destroy", "opened", "open", "close", "focus", "isFocused", "container", "onSortStart", "onSortEnd", "enable", "disable", "positionDropdown", "data", "clearSearch"];

        this.each(function () {
            if (args.length === 0 || typeof(args[0]) === "object") {
                opts = args.length === 0 ? {} : $.extend({}, args[0]);
                opts.element = $(this);

                if (opts.element.get(0).tagName.toLowerCase() === "select") {
                    multiple = opts.element.attr("multiple");
                } else {
                    multiple = opts.multiple || false;
                    if ("tags" in opts) {opts.multiple = multiple = true;}
                }

                select2 = multiple ? new MultiSelect2() : new SingleSelect2();
                select2.init(opts);
            } else if (typeof(args[0]) === "string") {

                if (indexOf(args[0], allowedMethods) < 0) {
                    throw "Unknown method: " + args[0];
                }

                value = undefined;
                select2 = $(this).data("select2");
                if (select2 === undefined) return;
                if (args[0] === "container") {
                    value=select2.container;
                } else {
                    value = select2[args[0]].apply(select2, args.slice(1));
                }
                if (value !== undefined) {return false;}
            } else {
                throw "Invalid arguments to select2 plugin: " + args;
            }
        });
        return (value === undefined) ? this : value;
    };

    // plugin defaults, accessible to users
    $.fn.select2.defaults = {
        width: "copy",
        loadMorePadding: 0,
        closeOnSelect: true,
        openOnEnter: true,
        containerCss: {},
        dropdownCss: {},
        containerCssClass: "",
        dropdownCssClass: "",
        formatResult: function(result, container, query, escapeMarkup) {
            var markup=[];
            markMatch(result.text, query.term, markup, escapeMarkup);
            return markup.join("");
        },
        formatSelection: function (data, container) {
            return data ? data.text : undefined;
        },
        sortResults: function (results, container, query) {
            return results;
        },
        formatResultCssClass: function(data) {return undefined;},
        formatNoMatches: function () { return "No matches found"; },
        formatInputTooShort: function (input, min) { var n = min - input.length; return "Please enter " + n + " more character" + (n == 1? "" : "s"); },
        formatInputTooLong: function (input, max) { var n = input.length - max; return "Please delete " + n + " character" + (n == 1? "" : "s"); },
        formatSelectionTooBig: function (limit) { return "You can only select " + limit + " item" + (limit == 1 ? "" : "s"); },
        formatLoadMore: function (pageNumber) { return "Loading more results..."; },
        formatSearching: function () { return "Searching..."; },
        minimumResultsForSearch: 0,
        minimumInputLength: 0,
        maximumInputLength: null,
        maximumSelectionSize: 0,
        id: function (e) { return e.id; },
        matcher: function(term, text) {
            return (''+text).toUpperCase().indexOf((''+term).toUpperCase()) >= 0;
        },
        separator: ",",
        tokenSeparators: [],
        tokenizer: defaultTokenizer,
        escapeMarkup: function (markup) {
            var replace_map = {
                '\\': '&#92;',
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&apos;',
                "/": '&#47;'
            };

            return String(markup).replace(/[&<>"'\/\\]/g, function (match) {
                    return replace_map[match[0]];
            });
        },
        blurOnChange: false,
        selectOnBlur: false,
        adaptContainerCssClass: function(c) { return c; },
        adaptDropdownCssClass: function(c) { return null; }
    };

    // exports
    window.Select2 = {
        query: {
            ajax: ajax,
            local: local,
            tags: tags
        }, util: {
            debounce: debounce,
            markMatch: markMatch
        }, "class": {
            "abstract": AbstractSelect2,
            "single": SingleSelect2,
            "multi": MultiSelect2
        }
    };

}(jQuery));
(function() {
  var Select2,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  namespace({
    Noba: Select2 = (function() {
      Select2.prototype.SEPARATOR = "\t";

      function Select2(element, value, options) {
        this.value = value;
        this.preventBrowsing = __bind(this.preventBrowsing, this);
        this.initSelection = __bind(this.initSelection, this);
        this.formatSelection = __bind(this.formatSelection, this);
        this.formatResult = __bind(this.formatResult, this);
        this.format = __bind(this.format, this);
        this.escapeMarkup = __bind(this.escapeMarkup, this);
        this.destroy = __bind(this.destroy, this);
        this.configure = __bind(this.configure, this);
        this.initialize = __bind(this.initialize, this);
        this.element = $(element);
        if (typeof value !== 'object') {
          this.value = [this.value];
        }
        this.configure(options);
        this.initialize();
        if (!options.browse) {
          this.preventBrowsing();
        }
      }

      Select2.prototype.initialize = function() {
        this.element.val(this.value.join(this.SEPARATOR));
        return this.element.select2(this.options);
      };

      Select2.prototype.configure = function(options) {
        this.options = {
          dropdownCssClass: 'bigdrop',
          separator: this.SEPARATOR
        };
        if (options.allowCreate) {
          this.options.createSearchChoice = function(term) {
            return {
              id: term,
              text: term
            };
          };
        }
        if (options.url) {
          this.url = options.url;
          $.extend(this.options, {
            ajax: {
              url: options.url,
              quietMillis: 100,
              dataType: 'json',
              data: function(term, page) {
                return {
                  query: term,
                  page: page,
                  per_page: 20
                };
              },
              results: function(data) {
                return {
                  results: data.results,
                  more: data.more
                };
              }
            },
            escapeMarkup: this.escapeMarkup,
            formatResult: this.formatResult,
            formatSelection: this.formatSelection,
            initSelection: this.initSelection
          });
        }
        if (options.multiple) {
          switch (this.element.get(0).tagName) {
            case 'SELECT':
              return this.element.attr('multiple', true);
            case 'INPUT':
              return this.options.multiple = true;
          }
        }
      };

      Select2.prototype.destroy = function() {
        return this.element.select2('destroy');
      };

      Select2.prototype.escapeMarkup = function(markup) {
        return markup;
      };

      Select2.prototype.format = function(text, image) {
        if (image) {
          text = "" + image + " " + text;
        }
        return text;
      };

      Select2.prototype.formatResult = function(result, container, query, escapeMarkup) {
        var markup;
        if (result.excerpt) {
          return this.format(result.excerpt, result.image);
        }
        markup = [];
        window.Select2.util.markMatch(result.text, query.term, markup, escapeMarkup);
        return this.format(markup.join(''), result.image);
      };

      Select2.prototype.formatSelection = function(result) {
        return this.format(result.text, result.image);
      };

      Select2.prototype.initSelection = function(element, callback) {
        if (this.value.length !== 0) {
          return $.ajax("" + this.url + "/" + (this.value.join(' ')), {
            dataType: 'json'
          }).done(function(data) {
            return callback(data.results);
          });
        }
      };

      Select2.prototype.preventBrowsing = function() {
        var container, input;
        container = this.element.select2('container');
        input = container.find('.select2-input');
        input.on('keyup', function(e) {
          var value;
          value = input.val().trim();
          if (value === '' && container.hasClass('select2-dropdown-open')) {
            return this.element.select2('close');
          }
        });
        return this.element.on('opening', function(e) {
          var value;
          value = input.val().trim();
          if (value === '') {
            return e.preventDefault();
          }
        });
      };

      return Select2;

    })()
  });

}).call(this);
(function() {
  $(function() {
    var select, _i, _len, _ref, _results;
    _ref = $("select.select2, input.select2");
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      select = _ref[_i];
      _results.push((function(select) {
        var value;
        select = $(select);
        value = select.val().split("\t");
        return new Noba.Select2(select, value, {
          allowCreate: select.data('allow-create'),
          browse: select.data('browse') === 'yes',
          multiple: select.data('multiple'),
          url: select.data('url')
        });
      })(select));
    }
    return _results;
  });

}).call(this);
(function() {
  namespace({
    Noba: {
      sortable: function(list) {
        var axis, connection, containment, options, preventSort, scrollHandler, scrollOffset, scrollParent, setScrollInterval, tempPlaceholder;
        list = $(list);
        axis = list.data('axis');
        connection = list.data('connected-to');
        containment = list.data('containment');
        preventSort = list.data('prevent-sort');
        tempPlaceholder = null;
        scrollParent = null;
        scrollOffset = null;
        scrollHandler = null;
        setScrollInterval = function(handler) {
          return scrollHandler = setInterval(function() {
            return scrollParent.scrollTop = handler();
          }, 10);
        };
        options = {};
        if (axis) {
          options.axis = axis;
        }
        options.cancel = 'input';
        if (connection) {
          options.connectWith = "[data-connected-to='" + connection + "']";
        }
        options.containment = containment;
        options.cursor = 'move';
        options.distance = 3;
        options.forcePlaceholderSize = true;
        options.handle = list.attr('data-handle');
        options.items = '> li:not(.empty):not(.template)';
        options.placeholder = 'placeholder';
        options.scroll = true;
        options.scrollSensitivity = 40;
        options.scrollSpeed = 25;
        options.tolerance = 'pointer';
        options.helper = function(event, element) {
          element.addClass('ui-sortable-helper-start');
          return element;
        };
        options.start = function(event, ui) {
          var ghost;
          scrollParent = ui.helper.scrollParent();
          scrollOffset = scrollParent.offset();
          scrollParent = scrollParent[0];
          ui.helper.removeClass('ui-sortable-helper-start');
          if (preventSort) {
            ghost = ui.helper.clone();
            ghost.attr('style', '');
            ghost.addClass('ghost');
            ui.helper.after(ghost);
            ghost.before('<li class="placeholder temp"></li>');
            tempPlaceholder = ui.placeholder.after('<li class="placeholder temp"></li>').next();
          } else {
            ui.helper.after('<li class="placeholder temp"></li>');
          }
          return ui.helper.find('[data-sortable="yes"]').hide();
        };
        options.sort = function(event, ui) {
          if (!scrollOffset) {
            return;
          }
          clearInterval(scrollHandler);
          if ((scrollOffset.top + scrollParent.offsetHeight) - event.pageY < options.scrollSensitivity) {
            return setScrollInterval(function() {
              return scrollParent.scrollTop + options.scrollSpeed / 3;
            });
          } else if (event.pageY - scrollOffset.top < options.scrollSensitivity) {
            return setScrollInterval(function() {
              return scrollParent.scrollTop - options.scrollSpeed / 3;
            });
          }
        };
        if (preventSort) {
          options.change = function(event, ui) {
            if (ui.placeholder.parents(preventSort).length !== 0) {
              return ui.placeholder.after(tempPlaceholder);
            } else {
              return tempPlaceholder.remove();
            }
          };
        }
        options.over = function(event, ui) {
          var empty;
          empty = $(event.target).children('li.empty');
          if (empty && empty.siblings('li:not(.placeholder)').not(empty).length === 0) {
            return empty.addClass('only-child');
          }
        };
        options.stop = function(event, ui) {
          clearInterval(scrollHandler);
          ui.item.siblings('li.empty').removeClass('only-child');
          ui.item.siblings('li.placeholder, li.ghost').remove();
          list.find('li.placeholder, li.ghost').remove();
          $('li.placeholder.temp').remove();
          ui.item.find('[data-sortable="yes"]').show();
          if (preventSort && ui.item.parents(preventSort).length !== 0) {
            event.preventDefault();
          }
        };
        return list.sortable(options);
      }
    }
  });

  $(function() {
    var fnScrollParent, list, _i, _len, _ref, _results;
    fnScrollParent = $.fn.scrollParent;
    $.fn.extend({
      scrollParent: function() {
        var parent;
        parent = this.data('scroll-parent');
        if (parent == null) {
          parent = this.parent().data('scroll-parent');
        }
        if (parent == null) {
          return fnScrollParent.apply(this);
        }
        if (parent === 'document') {
          return $(document);
        } else {
          return $(parent);
        }
      }
    });
    _ref = $('[data-sortable="yes"]');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      list = _ref[_i];
      _results.push(Noba.sortable(list));
    }
    return _results;
  });

}).call(this);
(function($) {
var version = '1.5.0',
    optionOverrides = {},
    defaults = {
      exclude: [],
      excludeWithin:[],
      offset: 0,

      // one of 'top' or 'left'
      direction: 'top',

      // jQuery set of elements you wish to scroll (for $.smoothScroll).
      //  if null (default), $('html, body').firstScrollable() is used.
      scrollElement: null,

      // only use if you want to override default behavior
      scrollTarget: null,

      // fn(opts) function to be called before scrolling occurs.
      // `this` is the element(s) being scrolled
      beforeScroll: function() {},

      // fn(opts) function to be called after scrolling occurs.
      // `this` is the triggering element
      afterScroll: function() {},
      easing: 'swing',
      speed: 400,

      // coefficient for "auto" speed
      autoCoefficient: 2,

      // $.fn.smoothScroll only: whether to prevent the default click action
      preventDefault: true
    },

    getScrollable = function(opts) {
      var scrollable = [],
          scrolled = false,
          dir = opts.dir && opts.dir === 'left' ? 'scrollLeft' : 'scrollTop';

      this.each(function() {

        if (this === document || this === window) { return; }
        var el = $(this);
        if ( el[dir]() > 0 ) {
          scrollable.push(this);
        } else {
          // if scroll(Top|Left) === 0, nudge the element 1px and see if it moves
          el[dir](1);
          scrolled = el[dir]() > 0;
          if ( scrolled ) {
            scrollable.push(this);
          }
          // then put it back, of course
          el[dir](0);
        }
      });

      // If no scrollable elements, fall back to <body>,
      // if it's in the jQuery collection
      // (doing this because Safari sets scrollTop async,
      // so can't set it to 1 and immediately get the value.)
      if (!scrollable.length) {
        this.each(function() {
          if (this.nodeName === 'BODY') {
            scrollable = [this];
          }
        });
      }

      // Use the first scrollable element if we're calling firstScrollable()
      if ( opts.el === 'first' && scrollable.length > 1 ) {
        scrollable = [ scrollable[0] ];
      }

      return scrollable;
    };

$.fn.extend({
  scrollable: function(dir) {
    var scrl = getScrollable.call(this, {dir: dir});
    return this.pushStack(scrl);
  },
  firstScrollable: function(dir) {
    var scrl = getScrollable.call(this, {el: 'first', dir: dir});
    return this.pushStack(scrl);
  },

  smoothScroll: function(options, extra) {
    options = options || {};

    if ( options === 'options' ) {
      if ( !extra ) {
        return this.first().data('ssOpts');
      }
      return this.each(function() {
        var $this = $(this),
            opts = $.extend($this.data('ssOpts') || {}, extra);

        $(this).data('ssOpts', opts);
      });
    }

    var opts = $.extend({}, $.fn.smoothScroll.defaults, options),
        locationPath = $.smoothScroll.filterPath(location.pathname);

    this
    .off('click.smoothscroll')
    .on('click.smoothscroll', opts.delegate, function(event) { // CUSTOM: allow delegation.
      var link = this,
          $link = $(this),
          thisOpts = $.extend({}, opts, $link.data('ssOpts') || {}),
          exclude = opts.exclude,
          excludeWithin = thisOpts.excludeWithin,
          elCounter = 0, ewlCounter = 0,
          include = true,
          clickOpts = {},
          hostMatch = ((location.hostname === link.hostname) || !link.hostname),
          pathMatch = thisOpts.scrollTarget || ( $.smoothScroll.filterPath(link.pathname) || locationPath ) === locationPath,
          thisHash = escapeSelector(link.hash);

      if ( !thisOpts.scrollTarget && (!hostMatch || !pathMatch || !thisHash) ) {
        include = false;
      } else {
        while (include && elCounter < exclude.length) {
          if ($link.is(escapeSelector(exclude[elCounter++]))) {
            include = false;
          }
        }
        while ( include && ewlCounter < excludeWithin.length ) {
          if ($link.closest(excludeWithin[ewlCounter++]).length) {
            include = false;
          }
        }
      }

      if ( include ) {

        if ( thisOpts.preventDefault ) {
          event.preventDefault();
        }

        $.extend( clickOpts, thisOpts, {
          scrollTarget: thisOpts.scrollTarget || thisHash,
          link: link
        });

        $.smoothScroll( clickOpts );
      }
    });

    return this;
  }
});

$.smoothScroll = function(options, px) {
  if ( options === 'options' && typeof px === 'object' ) {
    return $.extend(optionOverrides, px);
  }
  var opts, $scroller, scrollTargetOffset, speed, delta,
      scrollerOffset = 0,
      offPos = 'offset',
      scrollDir = 'scrollTop',
      aniProps = {},
      aniOpts = {};

  if (typeof options === 'number') {
    opts = $.extend({link: null}, $.fn.smoothScroll.defaults, optionOverrides);
    scrollTargetOffset = options;
  } else {
    opts = $.extend({link: null}, $.fn.smoothScroll.defaults, options || {}, optionOverrides);
    if (opts.scrollElement) {
      offPos = 'position';
      if (opts.scrollElement.css('position') === 'static') {
        opts.scrollElement.css('position', 'relative');
      }
    }
  }

  scrollDir = opts.direction === 'left' ? 'scrollLeft' : scrollDir;

  if ( opts.scrollElement ) {
    $scroller = opts.scrollElement;
    if ( !(/^(?:HTML|BODY)$/).test($scroller[0].nodeName) ) {
      scrollerOffset = $scroller[scrollDir]();
    }
  } else {
    $scroller = $('html, body').firstScrollable(opts.direction);
  }

  // beforeScroll callback function must fire before calculating offset
  opts.beforeScroll.call($scroller, opts);

  scrollTargetOffset = (typeof options === 'number') ? options :
                        px ||
                        ( $(opts.scrollTarget)[offPos]() &&
                        $(opts.scrollTarget)[offPos]()[opts.direction] ) ||
                        0;

  aniProps[scrollDir] = scrollTargetOffset + scrollerOffset + opts.offset;
  speed = opts.speed;

  // automatically calculate the speed of the scroll based on distance / coefficient
  if (speed === 'auto') {

    // $scroller.scrollTop() is position before scroll, aniProps[scrollDir] is position after
    // When delta is greater, speed will be greater.
    delta = aniProps[scrollDir] - $scroller.scrollTop();
    if(delta < 0) {
      delta *= -1;
    }

    // Divide the delta by the coefficient
    speed = delta / opts.autoCoefficient;
  }

  aniOpts = {
    duration: speed,
    easing: opts.easing,
    complete: function() {
      opts.afterScroll.call(opts.link, opts);
    }
  };

  if (opts.step) {
    aniOpts.step = opts.step;
  }

  if ($scroller.length) {
    $scroller.stop().animate(aniProps, aniOpts);
  } else {
    opts.afterScroll.call(opts.link, opts);
  }
};

$.smoothScroll.version = version;
$.smoothScroll.filterPath = function(string) {
  string = string || '';
  return string
    .replace(/^\//,'')
    .replace(/(?:index|default).[a-zA-Z]{3,4}$/,'')
    .replace(/\/$/,'');
};

// default options
$.fn.smoothScroll.defaults = defaults;

function escapeSelector (str) {
  return str.replace(/(:|\.)/g,'\\$1');
}

})(jQuery);
(function() {
  $(function() {
    var parent, _i, _len, _ref, _results;
    _ref = $('[data-smooth-scroll]');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      parent = _ref[_i];
      parent = $(parent);
      _results.push((function(parent) {
        var offset, selector, track;
        offset = parent.data('smooth-scroll-offset') || -80;
        offset = parseInt(offset, 10);
        selector = parent.data('smooth-scroll') || 'a';
        track = parent.data('smooth-scroll-track') === "yes";
        return parent.smoothScroll({
          delegate: selector,
          offset: offset,
          beforeScroll: function(el) {
            return $(el.link).addClass('activating');
          },
          afterScroll: function(el) {
            var scrollTop;
            $(el.link).removeClass('activating');
            if (track && history.replaceState) {
              scrollTop = $(document).scrollTop();
              history.replaceState(null, null, "" + location.pathname + ($(el.link).attr('href')));
              return $(document).scrollTop(scrollTop);
            }
          }
        });
      })(parent));
    }
    return _results;
  });

}).call(this);
(function() {
  $(function() {
    return $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
      return $($(e.target).attr('href')).find("[autofocus]").focus();
    });
  });

}).call(this);
(function() {
  namespace({
    Noba: {
      utilities: {
        scrollIntoView: function(el, options) {
          var height, offset, parent, parentHeight, parentScrollTop, top;
          offset = +(options.offset || 0);
          top = el[0].offsetTop;
          height = el.height();
          parent = $(options.parent || window);
          parentScrollTop = parent.scrollTop();
          parentHeight = parent.height();
          if (parentScrollTop > top) {
            if (!options.parent) {
              parent = null;
            }
            $.smoothScroll('options', {
              scrollElement: parent
            });
            return $.smoothScroll(top - parentScrollTop - parentHeight);
          } else if (parentScrollTop + parentHeight < top + height) {
            if (!options.parent) {
              parent = null;
            }
            $.smoothScroll('options', {
              scrollElement: parent
            });
            return $.smoothScroll(top - parentScrollTop);
          }
        }
      }
    }
  });

  namespace({
    Noba: {
      utilities: {
        copyToClipboard: function(element, help_container, help_text) {
          var temp;
          clearTimeout(help_container.data('timeout'));
          setTimeout(function() {
            return help_container.fadeTo(0, 500);
          }, 100);
          temp = $('<input>');
          $('body').append(temp);
          temp.val($(element).attr('href')).select();
          document.execCommand("copy");
          temp.remove();
          help_container.html(help_text);
          return setTimeout(function() {
            return help_container.fadeTo(500, 0);
          }, 5000);
        }
      }
    }
  });

}).call(this);
(function() {
  $(function() {
    var openedModalLink;
    openedModalLink = null;
    $(document).on('show.bs.modal', function(e) {
      return openedModalLink = $(e.relatedTarget);
    });
    $(document).on('hide.bs.modal', function(e) {
      if (openedModalLink) {
        openedModalLink.focus();
      }
      return openedModalLink = null;
    });
    $('a.skip-link').click(function(e) {
      return $($(this).attr('href')).attr('tabIndex', -1).focus();
    });
    return $('a.skip-link').focus(function(e) {
      return $('[autofocus]').attr('autofocus', null);
    });
  });

}).call(this);
/*! Lazy Load 1.9.3 - MIT license - Copyright 2010-2013 Mika Tuupola */

!function(a,b,c,d){var e=a(b);a.fn.lazyload=function(f){function g(){var b=0;i.each(function(){var c=a(this);if(!j.skip_invisible||c.is(":visible"))if(a.abovethetop(this,j)||a.leftofbegin(this,j));else if(a.belowthefold(this,j)||a.rightoffold(this,j)){if(++b>j.failure_limit)return!1}else c.trigger("appear"),b=0})}var h,i=this,j={threshold:0,failure_limit:0,event:"scroll",effect:"show",container:b,data_attribute:"original",skip_invisible:!0,appear:null,load:null,placeholder:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"};return f&&(d!==f.failurelimit&&(f.failure_limit=f.failurelimit,delete f.failurelimit),d!==f.effectspeed&&(f.effect_speed=f.effectspeed,delete f.effectspeed),a.extend(j,f)),h=j.container===d||j.container===b?e:a(j.container),0===j.event.indexOf("scroll")&&h.bind(j.event,function(){return g()}),this.each(function(){var b=this,c=a(b);b.loaded=!1,(c.attr("src")===d||c.attr("src")===!1)&&c.is("img")&&c.attr("src",j.placeholder),c.one("appear",function(){if(!this.loaded){if(j.appear){var d=i.length;j.appear.call(b,d,j)}a("<img />").bind("load",function(){var d=c.attr("data-"+j.data_attribute);c.hide(),c.is("img")?c.attr("src",d):c.css("background-image","url('"+d+"')"),c[j.effect](j.effect_speed),b.loaded=!0;var e=a.grep(i,function(a){return!a.loaded});if(i=a(e),j.load){var f=i.length;j.load.call(b,f,j)}}).attr("src",c.attr("data-"+j.data_attribute))}}),0!==j.event.indexOf("scroll")&&c.bind(j.event,function(){b.loaded||c.trigger("appear")})}),e.bind("resize",function(){g()}),/(?:iphone|ipod|ipad).*os 5/gi.test(navigator.appVersion)&&e.bind("pageshow",function(b){b.originalEvent&&b.originalEvent.persisted&&i.each(function(){a(this).trigger("appear")})}),a(c).ready(function(){g()}),this},a.belowthefold=function(c,f){var g;return g=f.container===d||f.container===b?(b.innerHeight?b.innerHeight:e.height())+e.scrollTop():a(f.container).offset().top+a(f.container).height(),g<=a(c).offset().top-f.threshold},a.rightoffold=function(c,f){var g;return g=f.container===d||f.container===b?e.width()+e.scrollLeft():a(f.container).offset().left+a(f.container).width(),g<=a(c).offset().left-f.threshold},a.abovethetop=function(c,f){var g;return g=f.container===d||f.container===b?e.scrollTop():a(f.container).offset().top,g>=a(c).offset().top+f.threshold+a(c).height()},a.leftofbegin=function(c,f){var g;return g=f.container===d||f.container===b?e.scrollLeft():a(f.container).offset().left,g>=a(c).offset().left+f.threshold+a(c).width()},a.inviewport=function(b,c){return!(a.rightoffold(b,c)||a.leftofbegin(b,c)||a.belowthefold(b,c)||a.abovethetop(b,c))},a.extend(a.expr[":"],{"below-the-fold":function(b){return a.belowthefold(b,{threshold:0})},"above-the-top":function(b){return!a.belowthefold(b,{threshold:0})},"right-of-screen":function(b){return a.rightoffold(b,{threshold:0})},"left-of-screen":function(b){return!a.rightoffold(b,{threshold:0})},"in-viewport":function(b){return a.inviewport(b,{threshold:0})},"above-the-fold":function(b){return!a.belowthefold(b,{threshold:0})},"right-of-fold":function(b){return a.rightoffold(b,{threshold:0})},"left-of-fold":function(b){return!a.rightoffold(b,{threshold:0})}})}(jQuery,window,document);
/* Copyright (c) 2012, 2014 Hyeonje Alex Jun and other contributors
 * Licensed under the MIT License
 */

(function (factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {
  'use strict';

  // The default settings for the plugin
  var defaultSettings = {
    wheelSpeed: 1,
    wheelPropagation: false,
    minScrollbarLength: null,
    maxScrollbarLength: null,
    useBothWheelAxes: false,
    useKeyboard: true,
    suppressScrollX: false,
    suppressScrollY: false,
    scrollXMarginOffset: 0,
    scrollYMarginOffset: 0,
    includePadding: false
  };

  var getEventClassName = (function () {
    var incrementingId = 0;
    return function () {
      var id = incrementingId;
      incrementingId += 1;
      return '.perfect-scrollbar-' + id;
    };
  }());

  $.fn.perfectScrollbar = function (suppliedSettings, option) {

    return this.each(function () {
      // Use the default settings
      var settings = $.extend(true, {}, defaultSettings),
          $this = $(this);

      if (typeof suppliedSettings === "object") {
        // But over-ride any supplied
        $.extend(true, settings, suppliedSettings);
      } else {
        // If no settings were supplied, then the first param must be the option
        option = suppliedSettings;
      }

      // Catch options

      if (option === 'update') {
        if ($this.data('perfect-scrollbar-update')) {
          $this.data('perfect-scrollbar-update')();
        }
        return $this;
      }
      else if (option === 'destroy') {
        if ($this.data('perfect-scrollbar-destroy')) {
          $this.data('perfect-scrollbar-destroy')();
        }
        return $this;
      }

      if ($this.data('perfect-scrollbar')) {
        // if there's already perfect-scrollbar
        return $this.data('perfect-scrollbar');
      }


      // Or generate new perfectScrollbar

      // Set class to the container
      $this.addClass('ps-container');

      var $scrollbarXRail = $("<div class='ps-scrollbar-x-rail'></div>").appendTo($this),
          $scrollbarYRail = $("<div class='ps-scrollbar-y-rail'></div>").appendTo($this),
          $scrollbarX = $("<div class='ps-scrollbar-x'></div>").appendTo($scrollbarXRail),
          $scrollbarY = $("<div class='ps-scrollbar-y'></div>").appendTo($scrollbarYRail),
          scrollbarXActive,
          scrollbarYActive,
          containerWidth,
          containerHeight,
          contentWidth,
          contentHeight,
          scrollbarXWidth,
          scrollbarXLeft,
          scrollbarXBottom = parseInt($scrollbarXRail.css('bottom'), 10),
          isScrollbarXUsingBottom = scrollbarXBottom === scrollbarXBottom, // !isNaN
          scrollbarXTop = isScrollbarXUsingBottom ? null : parseInt($scrollbarXRail.css('top'), 10),
          scrollbarYHeight,
          scrollbarYTop,
          scrollbarYRight = parseInt($scrollbarYRail.css('right'), 10),
          isScrollbarYUsingRight = scrollbarYRight === scrollbarYRight, // !isNaN
          scrollbarYLeft = isScrollbarYUsingRight ? null: parseInt($scrollbarYRail.css('left'), 10),
          isRtl = $this.css('direction') === "rtl",
          eventClassName = getEventClassName(),
          railBorderXWidth = parseInt($scrollbarXRail.css('borderLeftWidth'), 10) + parseInt($scrollbarXRail.css('borderRightWidth'), 10),
          railBorderYWidth = parseInt($scrollbarXRail.css('borderTopWidth'), 10) + parseInt($scrollbarXRail.css('borderBottomWidth'), 10);

      var updateContentScrollTop = function (currentTop, deltaY) {
        var newTop = currentTop + deltaY,
            maxTop = containerHeight - scrollbarYHeight;

        if (newTop < 0) {
          scrollbarYTop = 0;
        }
        else if (newTop > maxTop) {
          scrollbarYTop = maxTop;
        }
        else {
          scrollbarYTop = newTop;
        }

        var scrollTop = parseInt(scrollbarYTop * (contentHeight - containerHeight) / (containerHeight - scrollbarYHeight), 10);
        $this.scrollTop(scrollTop);
      };

      var updateContentScrollLeft = function (currentLeft, deltaX) {
        var newLeft = currentLeft + deltaX,
            maxLeft = containerWidth - scrollbarXWidth;

        if (newLeft < 0) {
          scrollbarXLeft = 0;
        }
        else if (newLeft > maxLeft) {
          scrollbarXLeft = maxLeft;
        }
        else {
          scrollbarXLeft = newLeft;
        }

        var scrollLeft = parseInt(scrollbarXLeft * (contentWidth - containerWidth) / (containerWidth - scrollbarXWidth), 10);
        $this.scrollLeft(scrollLeft);
      };

      var getSettingsAdjustedThumbSize = function (thumbSize) {
        if (settings.minScrollbarLength) {
          thumbSize = Math.max(thumbSize, settings.minScrollbarLength);
        }
        if (settings.maxScrollbarLength) {
          thumbSize = Math.min(thumbSize, settings.maxScrollbarLength);
        }
        return thumbSize;
      };

      var updateScrollbarCss = function () {
        var scrollbarXStyles = {width: containerWidth, display: scrollbarXActive ? "inherit": "none"};
        if (isRtl) {
          scrollbarXStyles.left = $this.scrollLeft() + containerWidth - contentWidth;
        } else {
          scrollbarXStyles.left = $this.scrollLeft();
        }
        if (isScrollbarXUsingBottom) {
          scrollbarXStyles.bottom = scrollbarXBottom - $this.scrollTop();
        } else {
          scrollbarXStyles.top = scrollbarXTop + $this.scrollTop();
        }
        $scrollbarXRail.css(scrollbarXStyles);

        var scrollbarYStyles = {top: $this.scrollTop(), height: containerHeight, display: scrollbarYActive ? "inherit": "none"};

        if (isScrollbarYUsingRight) {
          if (isRtl) {
            scrollbarYStyles.right = contentWidth - $this.scrollLeft() - scrollbarYRight - $scrollbarY.outerWidth();
          } else {
            scrollbarYStyles.right = scrollbarYRight - $this.scrollLeft();
          }
        } else {
          if (isRtl) {
            scrollbarYStyles.left = $this.scrollLeft() + containerWidth * 2 - contentWidth - scrollbarYLeft - $scrollbarY.outerWidth();
          } else {
            scrollbarYStyles.left = scrollbarYLeft + $this.scrollLeft();
          }
        }
        $scrollbarYRail.css(scrollbarYStyles);

        $scrollbarX.css({left: scrollbarXLeft, width: scrollbarXWidth - railBorderXWidth});
        $scrollbarY.css({top: scrollbarYTop, height: scrollbarYHeight - railBorderYWidth});

        if (scrollbarXActive) {
          $this.addClass('ps-active-x');
        } else {
          $this.removeClass('ps-active-x');
        }

        if (scrollbarYActive) {
          $this.addClass('ps-active-y');
        } else {
          $this.removeClass('ps-active-y');
        }
      };

      var updateBarSizeAndPosition = function () {
        containerWidth = settings.includePadding ? $this.innerWidth() : $this.width();
        containerHeight = settings.includePadding ? $this.innerHeight() : $this.height();
        contentWidth = $this.prop('scrollWidth');
        contentHeight = $this.prop('scrollHeight');

        if (!settings.suppressScrollX && containerWidth + settings.scrollXMarginOffset < contentWidth) {
          scrollbarXActive = true;
          scrollbarXWidth = getSettingsAdjustedThumbSize(parseInt(containerWidth * containerWidth / contentWidth, 10));
          scrollbarXLeft = parseInt($this.scrollLeft() * (containerWidth - scrollbarXWidth) / (contentWidth - containerWidth), 10);
        }
        else {
          scrollbarXActive = false;
          scrollbarXWidth = 0;
          scrollbarXLeft = 0;
          $this.scrollLeft(0);
        }

        if (!settings.suppressScrollY && containerHeight + settings.scrollYMarginOffset < contentHeight) {
          scrollbarYActive = true;
          scrollbarYHeight = getSettingsAdjustedThumbSize(parseInt(containerHeight * containerHeight / contentHeight, 10));
          scrollbarYTop = parseInt($this.scrollTop() * (containerHeight - scrollbarYHeight) / (contentHeight - containerHeight), 10);
        }
        else {
          scrollbarYActive = false;
          scrollbarYHeight = 0;
          scrollbarYTop = 0;
          $this.scrollTop(0);
        }

        if (scrollbarYTop >= containerHeight - scrollbarYHeight) {
          scrollbarYTop = containerHeight - scrollbarYHeight;
        }
        if (scrollbarXLeft >= containerWidth - scrollbarXWidth) {
          scrollbarXLeft = containerWidth - scrollbarXWidth;
        }

        updateScrollbarCss();
      };

      var bindMouseScrollXHandler = function () {
        var currentLeft,
            currentPageX;

        $scrollbarX.bind('mousedown' + eventClassName, function (e) {
          currentPageX = e.pageX;
          currentLeft = $scrollbarX.position().left;
          $scrollbarXRail.addClass('in-scrolling');
          e.stopPropagation();
          e.preventDefault();
        });

        $(document).bind('mousemove' + eventClassName, function (e) {
          if ($scrollbarXRail.hasClass('in-scrolling')) {
            updateContentScrollLeft(currentLeft, e.pageX - currentPageX);
            updateBarSizeAndPosition();
            e.stopPropagation();
            e.preventDefault();
          }
        });

        $(document).bind('mouseup' + eventClassName, function (e) {
          if ($scrollbarXRail.hasClass('in-scrolling')) {
            $scrollbarXRail.removeClass('in-scrolling');
          }
        });

        currentLeft =
        currentPageX = null;
      };

      var bindMouseScrollYHandler = function () {
        var currentTop,
            currentPageY;

        $scrollbarY.bind('mousedown' + eventClassName, function (e) {
          currentPageY = e.pageY;
          currentTop = $scrollbarY.position().top;
          $scrollbarYRail.addClass('in-scrolling');
          e.stopPropagation();
          e.preventDefault();
        });

        $(document).bind('mousemove' + eventClassName, function (e) {
          if ($scrollbarYRail.hasClass('in-scrolling')) {
            updateContentScrollTop(currentTop, e.pageY - currentPageY);
            updateBarSizeAndPosition();
            e.stopPropagation();
            e.preventDefault();
          }
        });

        $(document).bind('mouseup' + eventClassName, function (e) {
          if ($scrollbarYRail.hasClass('in-scrolling')) {
            $scrollbarYRail.removeClass('in-scrolling');
          }
        });

        currentTop =
        currentPageY = null;
      };

      // check if the default scrolling should be prevented.
      var shouldPreventDefault = function (deltaX, deltaY) {
        var scrollTop = $this.scrollTop();
        if (deltaX === 0) {
          if (!scrollbarYActive) {
            return false;
          }
          if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= contentHeight - containerHeight && deltaY < 0)) {
            return !settings.wheelPropagation;
          }
        }

        var scrollLeft = $this.scrollLeft();
        if (deltaY === 0) {
          if (!scrollbarXActive) {
            return false;
          }
          if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= contentWidth - containerWidth && deltaX > 0)) {
            return !settings.wheelPropagation;
          }
        }
        return true;
      };

      // bind handlers
      var bindMouseWheelHandler = function () {
        var shouldPrevent = false;

        var getDeltaFromEvent = function (e) {
          var deltaX = e.originalEvent.deltaX,
              deltaY = -1 * e.originalEvent.deltaY;

          if (typeof deltaX === "undefined" || typeof deltaY === "undefined") {
            // OS X Safari
            deltaX = -1 * e.originalEvent.wheelDeltaX / 6;
            deltaY = e.originalEvent.wheelDeltaY / 6;
          }

          return [deltaX, deltaY];
        };

        var mousewheelHandler = function (e) {
          var delta = getDeltaFromEvent(e);

          var deltaX = delta[0],
              deltaY = delta[1];

          shouldPrevent = false;
          if (!settings.useBothWheelAxes) {
            // deltaX will only be used for horizontal scrolling and deltaY will
            // only be used for vertical scrolling - this is the default
            $this.scrollTop($this.scrollTop() - (deltaY * settings.wheelSpeed));
            $this.scrollLeft($this.scrollLeft() + (deltaX * settings.wheelSpeed));
          } else if (scrollbarYActive && !scrollbarXActive) {
            // only vertical scrollbar is active and useBothWheelAxes option is
            // active, so let's scroll vertical bar using both mouse wheel axes
            if (deltaY) {
              $this.scrollTop($this.scrollTop() - (deltaY * settings.wheelSpeed));
            } else {
              $this.scrollTop($this.scrollTop() + (deltaX * settings.wheelSpeed));
            }
            shouldPrevent = true;
          } else if (scrollbarXActive && !scrollbarYActive) {
            // useBothWheelAxes and only horizontal bar is active, so use both
            // wheel axes for horizontal bar
            if (deltaX) {
              $this.scrollLeft($this.scrollLeft() + (deltaX * settings.wheelSpeed));
            } else {
              $this.scrollLeft($this.scrollLeft() - (deltaY * settings.wheelSpeed));
            }
            shouldPrevent = true;
          }

          // update bar position
          updateBarSizeAndPosition();

          shouldPrevent = (shouldPrevent || shouldPreventDefault(deltaX, deltaY));
          if (shouldPrevent) {
            e.stopPropagation();
            e.preventDefault();
          }
        };

        if (typeof window.onwheel !== "undefined") {
          $this.bind('wheel' + eventClassName, mousewheelHandler);
        } else if (typeof window.onmousewheel !== "undefined") {
          $this.bind('mousewheel' + eventClassName, mousewheelHandler);
        }

        // fix Firefox scroll problem
        $this.bind('MozMousePixelScroll' + eventClassName, function (e) {
          if (shouldPrevent) {
            e.preventDefault();
          }
        });
      };

      var bindKeyboardHandler = function () {
        var hovered = false;
        $this.bind('mouseenter' + eventClassName, function (e) {
          hovered = true;
        });
        $this.bind('mouseleave' + eventClassName, function (e) {
          hovered = false;
        });

        var shouldPrevent = false;
        $(document).bind('keydown' + eventClassName, function (e) {
          if (e.isDefaultPrevented && e.isDefaultPrevented()) {
            return;
          }

          if (!hovered || $(document.activeElement).is(":input,[contenteditable]")) {
            return;
          }

          var deltaX = 0,
              deltaY = 0;

          switch (e.which) {
          case 37: // left
            deltaX = -30;
            break;
          case 38: // up
            deltaY = 30;
            break;
          case 39: // right
            deltaX = 30;
            break;
          case 40: // down
            deltaY = -30;
            break;
          case 33: // page up
            deltaY = 90;
            break;
          case 32: // space bar
          case 34: // page down
            deltaY = -90;
            break;
          case 35: // end
            deltaY = -containerHeight;
            break;
          case 36: // home
            deltaY = containerHeight;
            break;
          default:
            return;
          }

          $this.scrollTop($this.scrollTop() - deltaY);
          $this.scrollLeft($this.scrollLeft() + deltaX);

          shouldPrevent = shouldPreventDefault(deltaX, deltaY);
          if (shouldPrevent) {
            e.preventDefault();
          }
        });
      };

      var bindRailClickHandler = function () {
        var stopPropagation = function (e) { e.stopPropagation(); };

        $scrollbarY.bind('click' + eventClassName, stopPropagation);
        $scrollbarYRail.bind('click' + eventClassName, function (e) {
          var halfOfScrollbarLength = parseInt(scrollbarYHeight / 2, 10),
              positionTop = e.pageY - $scrollbarYRail.offset().top - halfOfScrollbarLength,
              maxPositionTop = containerHeight - scrollbarYHeight,
              positionRatio = positionTop / maxPositionTop;

          if (positionRatio < 0) {
            positionRatio = 0;
          } else if (positionRatio > 1) {
            positionRatio = 1;
          }

          $this.scrollTop((contentHeight - containerHeight) * positionRatio);
        });

        $scrollbarX.bind('click' + eventClassName, stopPropagation);
        $scrollbarXRail.bind('click' + eventClassName, function (e) {
          var halfOfScrollbarLength = parseInt(scrollbarXWidth / 2, 10),
              positionLeft = e.pageX - $scrollbarXRail.offset().left - halfOfScrollbarLength,
              maxPositionLeft = containerWidth - scrollbarXWidth,
              positionRatio = positionLeft / maxPositionLeft;

          if (positionRatio < 0) {
            positionRatio = 0;
          } else if (positionRatio > 1) {
            positionRatio = 1;
          }

          $this.scrollLeft((contentWidth - containerWidth) * positionRatio);
        });
      };

      // bind mobile touch handler
      var bindMobileTouchHandler = function () {
        var applyTouchMove = function (differenceX, differenceY) {
          $this.scrollTop($this.scrollTop() - differenceY);
          $this.scrollLeft($this.scrollLeft() - differenceX);

          // update bar position
          updateBarSizeAndPosition();
        };

        var startCoords = {},
            startTime = 0,
            speed = {},
            breakingProcess = null,
            inGlobalTouch = false;

        $(window).bind("touchstart" + eventClassName, function (e) {
          inGlobalTouch = true;
        });
        $(window).bind("touchend" + eventClassName, function (e) {
          inGlobalTouch = false;
        });

        $this.bind("touchstart" + eventClassName, function (e) {
          var touch = e.originalEvent.targetTouches[0];

          startCoords.pageX = touch.pageX;
          startCoords.pageY = touch.pageY;

          startTime = (new Date()).getTime();

          if (breakingProcess !== null) {
            clearInterval(breakingProcess);
          }

          e.stopPropagation();
        });
        $this.bind("touchmove" + eventClassName, function (e) {
          if (!inGlobalTouch && e.originalEvent.targetTouches.length === 1) {
            var touch = e.originalEvent.targetTouches[0];

            var currentCoords = {};
            currentCoords.pageX = touch.pageX;
            currentCoords.pageY = touch.pageY;

            var differenceX = currentCoords.pageX - startCoords.pageX,
              differenceY = currentCoords.pageY - startCoords.pageY;

            applyTouchMove(differenceX, differenceY);
            startCoords = currentCoords;

            var currentTime = (new Date()).getTime();

            var timeGap = currentTime - startTime;
            if (timeGap > 0) {
              speed.x = differenceX / timeGap;
              speed.y = differenceY / timeGap;
              startTime = currentTime;
            }

            e.preventDefault();
          }
        });
        $this.bind("touchend" + eventClassName, function (e) {
          clearInterval(breakingProcess);
          breakingProcess = setInterval(function () {
            if (Math.abs(speed.x) < 0.01 && Math.abs(speed.y) < 0.01) {
              clearInterval(breakingProcess);
              return;
            }

            applyTouchMove(speed.x * 30, speed.y * 30);

            speed.x *= 0.8;
            speed.y *= 0.8;
          }, 10);
        });
      };

      var bindScrollHandler = function () {
        $this.bind('scroll' + eventClassName, function (e) {
          updateBarSizeAndPosition();
        });
      };

      var destroy = function () {
        $this.unbind(eventClassName);
        $(window).unbind(eventClassName);
        $(document).unbind(eventClassName);
        $this.data('perfect-scrollbar', null);
        $this.data('perfect-scrollbar-update', null);
        $this.data('perfect-scrollbar-destroy', null);
        $scrollbarX.remove();
        $scrollbarY.remove();
        $scrollbarXRail.remove();
        $scrollbarYRail.remove();

        // clean all variables
        $scrollbarXRail =
        $scrollbarYRail =
        $scrollbarX =
        $scrollbarY =
        scrollbarXActive =
        scrollbarYActive =
        containerWidth =
        containerHeight =
        contentWidth =
        contentHeight =
        scrollbarXWidth =
        scrollbarXLeft =
        scrollbarXBottom =
        isScrollbarXUsingBottom =
        scrollbarXTop =
        scrollbarYHeight =
        scrollbarYTop =
        scrollbarYRight =
        isScrollbarYUsingRight =
        scrollbarYLeft =
        isRtl =
        eventClassName = null;
      };

      var ieSupport = function (version) {
        $this.addClass('ie').addClass('ie' + version);

        var bindHoverHandlers = function () {
          var mouseenter = function () {
            $(this).addClass('hover');
          };
          var mouseleave = function () {
            $(this).removeClass('hover');
          };
          $this.bind('mouseenter' + eventClassName, mouseenter).bind('mouseleave' + eventClassName, mouseleave);
          $scrollbarXRail.bind('mouseenter' + eventClassName, mouseenter).bind('mouseleave' + eventClassName, mouseleave);
          $scrollbarYRail.bind('mouseenter' + eventClassName, mouseenter).bind('mouseleave' + eventClassName, mouseleave);
          $scrollbarX.bind('mouseenter' + eventClassName, mouseenter).bind('mouseleave' + eventClassName, mouseleave);
          $scrollbarY.bind('mouseenter' + eventClassName, mouseenter).bind('mouseleave' + eventClassName, mouseleave);
        };

        var fixIe6ScrollbarPosition = function () {
          updateScrollbarCss = function () {
            var scrollbarXStyles = {left: scrollbarXLeft + $this.scrollLeft(), width: scrollbarXWidth};
            if (isScrollbarXUsingBottom) {
              scrollbarXStyles.bottom = scrollbarXBottom;
            } else {
              scrollbarXStyles.top = scrollbarXTop;
            }
            $scrollbarX.css(scrollbarXStyles);

            var scrollbarYStyles = {top: scrollbarYTop + $this.scrollTop(), height: scrollbarYHeight};
            if (isScrollbarYUsingRight) {
              scrollbarYStyles.right = scrollbarYRight;
            } else {
              scrollbarYStyles.left = scrollbarYLeft;
            }

            $scrollbarY.css(scrollbarYStyles);
            $scrollbarX.hide().show();
            $scrollbarY.hide().show();
          };
        };

        if (version === 6) {
          bindHoverHandlers();
          fixIe6ScrollbarPosition();
        }
      };

      var supportsTouch = (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch);

      var initialize = function () {
        var ieMatch = navigator.userAgent.toLowerCase().match(/(msie) ([\w.]+)/);
        if (ieMatch && ieMatch[1] === 'msie') {
          // must be executed at first, because 'ieSupport' may addClass to the container
          ieSupport(parseInt(ieMatch[2], 10));
        }

        updateBarSizeAndPosition();
        bindScrollHandler();
        bindMouseScrollXHandler();
        bindMouseScrollYHandler();
        bindRailClickHandler();
        bindMouseWheelHandler();

        if (supportsTouch) {
          bindMobileTouchHandler();
        }
        if (settings.useKeyboard) {
          bindKeyboardHandler();
        }
        $this.data('perfect-scrollbar', $this);
        $this.data('perfect-scrollbar-update', updateBarSizeAndPosition);
        $this.data('perfect-scrollbar-destroy', destroy);
      };

      // initialize
      initialize();

      return $this;
    });
  };
}));
(function() {
  var Replayer,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  namespace({
    Noba: {
      Event: Replayer = (function() {
        function Replayer(events, crosshair) {
          this.events = events;
          this.crosshair = crosshair;
          this.handleEvent = __bind(this.handleEvent, this);
          this.replayEvent = __bind(this.replayEvent, this);
          this.replay = __bind(this.replay, this);
          this.previousX = 0;
        }

        Replayer.prototype.replay = function() {
          this.multiplier = 1;
          return this.replayEvent(0);
        };

        Replayer.prototype.replayEvent = function(index) {
          var event,
            _this = this;
          event = this.events[index];
          if (!event) {
            this.replayEvent(0);
            return;
          }
          if (window.replayPaused == null) {
            return setTimeout(function() {
              _this.handleEvent(event);
              return _this.replayEvent(index + 1);
            }, (event.d || 0) * this.multiplier);
          }
        };

        Replayer.prototype.handleEvent = function(event) {
          var element, text;
          if (!this.replaying) {
            this.replaying = true;
            this.crosshair.show();
          }
          if ('f' in event) {
            this.callback = event.f;
          }
          if (event.x) {
            this.previousY = event.y;
            this.crosshair.css({
              left: event.x + 'px',
              top: event.y + 'px'
            });
          }
          if (event.c) {
            this.crosshair.attr('data-cursor', event.c);
          }
          if (event.e) {
            element = $(event.s);
            switch (event.e) {
              case 'addClass':
                element.addClass(event.k);
                break;
              case 'removeClass':
                element.removeClass(event.k);
                break;
              case 'key':
                switch (event.k) {
                  case 'backspace':
                    text = element.text().slice(0, -1);
                    element.text(text);
                    break;
                  default:
                    text = element.text();
                    element.text(text + event.k);
                }
            }
          }
          if (this.callback) {
            return this.callback(event);
          }
        };

        return Replayer;

      })()
    }
  });

}).call(this);
(function() {
  $(function() {
    var builderEvents, replayer, setHeight;
    if ($('body').hasClass('home')) {
      $('img[data-original]').lazyload({
        skip_invisible: false,
        container: $('.noba-authors-overflow'),
        failure_limit: 100
      });
      $('.noba-authors-overflow').perfectScrollbar();
      $('.noba-authors-controls a').smoothScroll({
        offset: 0,
        direction: 'left',
        scrollElement: $('.noba-authors-overflow')
      });
      setHeight = function() {
        return $('[data-auto-size]').each(function() {
          var height, ratio, section, width;
          section = $(this);
          width = $(window).width();
          ratio = Math.min($(window).height() / width, 0.68);
          height = ratio * width;
          return section.css('height', height);
        });
      };
      $(window).on('resize', function() {
        return setHeight();
      });
      $(window).load(function() {
        return setHeight();
      });
      setHeight();
      builderEvents = function() {
        var chapterAging, chapterCognitive, chapterPlaceholder, chapterSocial, chapters, deleteAging, dragAgingOn, dragAgingUp;
        chapters = $('#textbook-builder ul.noba-list > li');
        chapterAging = $(chapters[0]);
        chapterCognitive = $(chapters[1]);
        chapterSocial = $(chapters[2]);
        chapterPlaceholder = $(chapters[3]);
        dragAgingUp = function(event) {
          if (event.y == null) {
            return;
          }
          chapterAging.css({
            left: 0,
            top: event.y - 33,
            position: 'absolute'
          });
          if (event.y === 206) {
            chapterPlaceholder.show();
            chapterSocial.before(chapterPlaceholder);
          }
          if (event.y === 120) {
            return chapterCognitive.before(chapterPlaceholder);
          }
        };
        dragAgingOn = function(event) {
          if (event.x == null) {
            return;
          }
          chapterSocial.after(chapterPlaceholder);
          chapterPlaceholder.show();
          chapterAging.show();
          return chapterAging.css({
            left: event.x - 66,
            top: 216.5,
            position: 'absolute'
          });
        };
        deleteAging = function() {
          chapterAging.hide();
          chapterPlaceholder.hide();
          chapterSocial.css({
            left: '',
            top: '',
            position: ''
          });
          return chapterCognitive.css({
            left: '',
            top: '',
            position: ''
          });
        };
        return [
          {
            x: 42,
            y: 250
          }, {
            d: 30,
            c: 'move',
            f: dragAgingUp
          }, {
            x: 42,
            y: 250,
            d: 17
          }, {
            x: 42,
            y: 246,
            d: 18
          }, {
            x: 42,
            y: 243,
            d: 17
          }, {
            x: 43,
            y: 239,
            d: 17
          }, {
            x: 43,
            y: 235,
            d: 17
          }, {
            x: 43,
            y: 232,
            d: 18
          }, {
            x: 43,
            y: 228,
            d: 17
          }, {
            x: 43,
            y: 224,
            d: 17
          }, {
            x: 43,
            y: 221,
            d: 18
          }, {
            x: 43,
            y: 217,
            d: 18
          }, {
            x: 44,
            y: 214,
            d: 18
          }, {
            x: 44,
            y: 210,
            d: 18
          }, {
            x: 44,
            y: 206,
            d: 17
          }, {
            x: 44,
            y: 203,
            d: 17
          }, {
            x: 44,
            y: 199,
            d: 18
          }, {
            x: 44,
            y: 196,
            d: 18
          }, {
            x: 45,
            y: 192,
            d: 17
          }, {
            x: 45,
            y: 189,
            d: 18
          }, {
            x: 45,
            y: 185,
            d: 17
          }, {
            x: 45,
            y: 182,
            d: 18
          }, {
            x: 45,
            y: 179,
            d: 17
          }, {
            x: 45,
            y: 175,
            d: 17
          }, {
            x: 46,
            y: 172,
            d: 17
          }, {
            x: 46,
            y: 169,
            d: 18
          }, {
            x: 46,
            y: 165,
            d: 17
          }, {
            x: 46,
            y: 162,
            d: 18
          }, {
            x: 46,
            y: 159,
            d: 18
          }, {
            x: 46,
            y: 156,
            d: 18
          }, {
            x: 46,
            y: 153,
            d: 17
          }, {
            x: 47,
            y: 150,
            d: 17
          }, {
            x: 47,
            y: 147,
            d: 17
          }, {
            x: 47,
            y: 144,
            d: 17
          }, {
            x: 47,
            y: 141,
            d: 17
          }, {
            x: 47,
            y: 138,
            d: 18
          }, {
            x: 47,
            y: 135,
            d: 17
          }, {
            x: 47,
            y: 133,
            d: 17
          }, {
            x: 47,
            y: 130,
            d: 17
          }, {
            x: 48,
            y: 127,
            d: 18
          }, {
            x: 48,
            y: 125,
            d: 17
          }, {
            x: 48,
            y: 122,
            d: 17
          }, {
            x: 48,
            y: 120,
            d: 18
          }, {
            x: 48,
            y: 117,
            d: 17
          }, {
            x: 48,
            y: 115,
            d: 18
          }, {
            x: 48,
            y: 112,
            d: 18
          }, {
            x: 48,
            y: 110,
            d: 17
          }, {
            x: 48,
            y: 108,
            d: 18
          }, {
            x: 49,
            y: 106,
            d: 18
          }, {
            x: 49,
            y: 104,
            d: 18
          }, {
            x: 49,
            y: 102,
            d: 17
          }, {
            x: 49,
            y: 100,
            d: 18
          }, {
            x: 49,
            y: 98,
            d: 17
          }, {
            x: 49,
            y: 96,
            d: 17
          }, {
            x: 49,
            y: 94,
            d: 17
          }, {
            x: 49,
            y: 93,
            d: 17
          }, {
            x: 49,
            y: 91,
            d: 18
          }, {
            x: 49,
            y: 90,
            d: 17
          }, {
            x: 49,
            y: 88,
            d: 18
          }, {
            x: 49,
            y: 87,
            d: 17
          }, {
            x: 49,
            y: 86,
            d: 17
          }, {
            x: 50,
            y: 84,
            d: 17
          }, {
            x: 50,
            y: 83,
            d: 18
          }, {
            x: 50,
            y: 82,
            d: 18
          }, {
            x: 50,
            y: 81,
            d: 17
          }, {
            x: 50,
            y: 80,
            d: 18
          }, {
            x: 50,
            y: 79,
            d: 18
          }, {
            x: 50,
            y: 78,
            d: 17
          }, {
            x: 50,
            y: 78,
            d: 18
          }, {
            x: 50,
            y: 77,
            d: 18
          }, {
            x: 50,
            y: 76,
            d: 17
          }, {
            x: 50,
            y: 76,
            d: 18
          }, {
            x: 50,
            y: 75,
            d: 17
          }, {
            x: 50,
            y: 75,
            d: 18
          }, {
            x: 50,
            y: 75,
            d: 17
          }, {
            x: 50,
            y: 75,
            d: 18
          }, {
            x: 50,
            y: 75,
            d: 18
          }, {
            x: 50,
            y: 74.5,
            d: 18
          }, {
            d: 250,
            c: 'arrow',
            f: null
          }, {
            x: 51,
            y: 74,
            d: 500
          }, {
            x: 54,
            y: 74,
            d: 17
          }, {
            x: 61,
            y: 75,
            d: 18
          }, {
            x: 68,
            y: 75,
            d: 17
          }, {
            x: 75,
            y: 76,
            d: 16
          }, {
            x: 82,
            y: 76,
            d: 18
          }, {
            x: 90,
            y: 77,
            d: 17
          }, {
            x: 97,
            y: 77,
            d: 17
          }, {
            x: 105,
            y: 78,
            d: 17
          }, {
            x: 113,
            y: 78,
            d: 18
          }, {
            x: 120,
            y: 79,
            d: 17
          }, {
            x: 128,
            y: 79,
            d: 18
          }, {
            x: 136,
            y: 80,
            d: 17
          }, {
            x: 144,
            y: 80,
            d: 17
          }, {
            x: 152,
            y: 81,
            d: 18
          }, {
            x: 160,
            y: 81,
            d: 17
          }, {
            x: 168,
            y: 82,
            d: 17
          }, {
            x: 176,
            y: 82,
            d: 18
          }, {
            x: 184,
            y: 83,
            d: 17
          }, {
            x: 192,
            y: 83,
            d: 17
          }, {
            x: 200,
            y: 83,
            d: 18
          }, {
            x: 208,
            y: 83,
            d: 17
          }, {
            x: 216,
            y: 83,
            d: 18
          }, {
            x: 224,
            y: 83,
            d: 17
          }, {
            x: 232,
            y: 83,
            d: 17
          }, {
            x: 240,
            y: 83,
            d: 17
          }, {
            x: 248,
            y: 83,
            d: 18
          }, {
            x: 256,
            y: 83,
            d: 17
          }, {
            x: 264,
            y: 83,
            d: 17
          }, {
            x: 272,
            y: 83,
            d: 18
          }, {
            x: 280,
            y: 83,
            d: 17
          }, {
            x: 288,
            y: 83,
            d: 18
          }, {
            x: 292,
            y: 83,
            d: 17
          }, {
            x: 299,
            y: 83,
            d: 18
          }, {
            x: 306,
            y: 83,
            d: 17
          }, {
            x: 313,
            y: 83,
            d: 18
          }, {
            x: 319,
            y: 83,
            d: 17
          }, {
            x: 325,
            y: 83,
            d: 18
          }, {
            x: 330,
            y: 83,
            d: 16
          }, {
            x: 335,
            y: 83,
            d: 17
          }, {
            x: 339,
            y: 83,
            d: 17
          }, {
            x: 343,
            y: 83,
            d: 16
          }, {
            x: 346,
            y: 83,
            d: 18
          }, {
            x: 349,
            y: 83,
            d: 17
          }, {
            e: 'addClass',
            s: '#builder-remove',
            k: 'hover'
          }, {
            x: 351,
            y: 83,
            d: 18
          }, {
            x: 353,
            y: 83,
            d: 17
          }, {
            x: 355,
            y: 83,
            d: 18
          }, {
            x: 356,
            y: 83,
            d: 17
          }, {
            x: 357,
            y: 83,
            d: 17
          }, {
            x: 354,
            y: 83,
            d: 18,
            c: 'pointer'
          }, {
            x: 354,
            y: 83,
            d: 66
          }, {
            d: 500,
            c: 'arrow',
            e: 'removeClass',
            s: '#builder-remove',
            k: 'hover',
            f: deleteAging
          }, {
            x: 356,
            y: 81,
            d: 1000,
            f: null
          }, {
            x: 356,
            y: 78,
            d: 17
          }, {
            x: 354,
            y: 74,
            d: 18
          }, {
            x: 353,
            y: 71,
            d: 18
          }, {
            x: 351,
            y: 68,
            d: 16
          }, {
            x: 350,
            y: 63,
            d: 18
          }, {
            x: 349,
            y: 59,
            d: 17
          }, {
            x: 346,
            y: 51,
            d: 17
          }, {
            x: 343,
            y: 46,
            d: 17
          }, {
            x: 340,
            y: 40,
            d: 19
          }, {
            x: 336,
            y: 36,
            d: 18
          }, {
            x: 334,
            y: 34,
            d: 15
          }, {
            x: 332,
            y: 31,
            d: 16
          }, {
            x: 331,
            y: 29,
            d: 18
          }, {
            x: 328,
            y: 26,
            d: 17
          }, {
            x: 325,
            y: 23,
            d: 17
          }, {
            x: 320,
            y: 19,
            d: 17
          }, {
            x: 317,
            y: 16,
            d: 17
          }, {
            x: 315,
            y: 14,
            d: 32,
            c: 'text'
          }, {
            x: 314,
            y: 14,
            d: 18
          }, {
            x: 312,
            y: 13,
            d: 1
          }, {
            x: 311,
            y: 13,
            d: 30
          }, {
            x: 311,
            y: 13,
            d: 20
          }, {
            d: 400,
            e: 'addClass',
            s: '#builder-header',
            k: 'cursor cursor-blinking'
          }, {
            d: 400,
            e: 'removeClass',
            s: '#builder-header',
            k: 'cursor-blinking'
          }, {
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 200,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 200,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 150,
            e: 'key',
            s: '#builder-header',
            k: 'C'
          }, {
            d: 100,
            e: 'key',
            s: '#builder-header',
            k: 'h'
          }, {
            d: 100,
            e: 'key',
            s: '#builder-header',
            k: 'i'
          }, {
            d: 100,
            e: 'key',
            s: '#builder-header',
            k: 'l'
          }, {
            d: 200,
            e: 'key',
            s: '#builder-header',
            k: 'd'
          }, {
            d: 200,
            e: 'key',
            s: '#builder-header',
            k: 'h'
          }, {
            d: 100,
            e: 'key',
            s: '#builder-header',
            k: 'o'
          }, {
            d: 100,
            e: 'key',
            s: '#builder-header',
            k: 'o'
          }, {
            d: 100,
            e: 'key',
            s: '#builder-header',
            k: 'd'
          }, {
            d: 100,
            e: 'key',
            s: '#builder-header',
            k: ' '
          }, {
            d: 200,
            e: 'key',
            s: '#builder-header',
            k: 'P'
          }, {
            d: 100,
            e: 'key',
            s: '#builder-header',
            k: 's'
          }, {
            d: 100,
            e: 'key',
            s: '#builder-header',
            k: 'y'
          }, {
            d: 100,
            e: 'key',
            s: '#builder-header',
            k: 'c'
          }, {
            d: 100,
            e: 'key',
            s: '#builder-header',
            k: 'h'
          }, {
            d: 200,
            e: 'key',
            s: '#builder-header',
            k: 'o'
          }, {
            d: 200,
            e: 'key',
            s: '#builder-header',
            k: 'l'
          }, {
            d: 100,
            e: 'key',
            s: '#builder-header',
            k: 'o'
          }, {
            d: 100,
            e: 'key',
            s: '#builder-header',
            k: 'g'
          }, {
            d: 100,
            e: 'key',
            s: '#builder-header',
            k: 'y'
          }, {
            e: 'addClass',
            s: '#builder-header',
            k: 'cursor-blinking'
          }, {
            x: 310,
            y: 13,
            d: 1000
          }, {
            x: 309,
            y: 13,
            d: 18
          }, {
            x: 308,
            y: 14,
            d: 18
          }, {
            x: 305,
            y: 15,
            d: 17
          }, {
            x: 302,
            y: 17,
            d: 18
          }, {
            x: 297,
            y: 19,
            d: 17
          }, {
            x: 292,
            y: 22,
            d: 18
          }, {
            x: 285,
            y: 25,
            d: 18
          }, {
            x: 277,
            y: 28,
            d: 17,
            c: 'arrow'
          }, {
            x: 269,
            y: 32,
            d: 17
          }, {
            x: 260,
            y: 36,
            d: 17
          }, {
            x: 249,
            y: 41,
            d: 18
          }, {
            x: 238,
            y: 46,
            d: 18
          }, {
            x: 226,
            y: 52,
            d: 18
          }, {
            x: 214,
            y: 58,
            d: 17
          }, {
            x: 200,
            y: 64,
            d: 18
          }, {
            x: 186,
            y: 71,
            d: 18
          }, {
            x: 171,
            y: 77,
            d: 18
          }, {
            x: 156,
            y: 85,
            d: 17
          }, {
            x: 140,
            y: 92,
            d: 18
          }, {
            x: 124,
            y: 100,
            d: 18
          }, {
            x: 107,
            y: 107,
            d: 17
          }, {
            x: 90,
            y: 115,
            d: 17
          }, {
            x: 72,
            y: 124,
            d: 17
          }, {
            x: 54,
            y: 132,
            d: 18
          }, {
            x: 36,
            y: 140,
            d: 17
          }, {
            x: 18,
            y: 149,
            d: 17
          }, {
            x: -1,
            y: 157,
            d: 18
          }, {
            x: -19,
            y: 166,
            d: 17
          }, {
            d: 600,
            c: 'move',
            f: dragAgingOn,
            e: 'removeClass',
            s: '#builder-header',
            k: 'cursor cursor-blinking'
          }, {
            x: -150,
            y: 261,
            d: 18
          }, {
            x: -136,
            y: 261,
            d: 17
          }, {
            x: -122,
            y: 261,
            d: 18
          }, {
            x: -110,
            y: 261,
            d: 18
          }, {
            x: -97,
            y: 261,
            d: 18
          }, {
            x: -86,
            y: 261,
            d: 17
          }, {
            x: -75,
            y: 261,
            d: 18
          }, {
            x: -64,
            y: 261,
            d: 17
          }, {
            x: -54,
            y: 261,
            d: 17
          }, {
            x: -45,
            y: 261,
            d: 18
          }, {
            x: -36,
            y: 261,
            d: 18
          }, {
            x: -27,
            y: 261,
            d: 17
          }, {
            x: -19,
            y: 261,
            d: 18
          }, {
            x: -12,
            y: 261,
            d: 17
          }, {
            x: -5,
            y: 261,
            d: 18
          }, {
            x: 2,
            y: 261,
            d: 18
          }, {
            x: 8,
            y: 261,
            d: 17
          }, {
            x: 14,
            y: 261,
            d: 17
          }, {
            x: 19,
            y: 261,
            d: 18
          }, {
            x: 24,
            y: 261,
            d: 17
          }, {
            x: 29,
            y: 261,
            d: 17
          }, {
            x: 33,
            y: 261,
            d: 18
          }, {
            x: 37,
            y: 261,
            d: 17
          }, {
            x: 41,
            y: 261,
            d: 18
          }, {
            x: 44,
            y: 261,
            d: 17
          }, {
            x: 47,
            y: 261,
            d: 18
          }, {
            x: 50,
            y: 261,
            d: 18
          }, {
            x: 52,
            y: 261,
            d: 17
          }, {
            x: 54,
            y: 261,
            d: 18
          }, {
            x: 56,
            y: 261,
            d: 17
          }, {
            x: 58,
            y: 261,
            d: 18
          }, {
            x: 59,
            y: 261,
            d: 17
          }, {
            x: 61,
            y: 261,
            d: 18
          }, {
            x: 62,
            y: 261,
            d: 18
          }, {
            x: 63,
            y: 261,
            d: 17
          }, {
            x: 64,
            y: 261,
            d: 18
          }, {
            x: 64,
            y: 261,
            d: 18
          }, {
            x: 65,
            y: 261,
            d: 17
          }, {
            x: 65,
            y: 261,
            d: 18
          }, {
            x: 65,
            y: 261,
            d: 17
          }, {
            x: 66,
            y: 261,
            d: 18
          }, {
            x: 66,
            y: 261,
            d: 17
          }, {
            x: 66,
            y: 261,
            d: 18
          }, {
            x: 66,
            y: 261,
            d: 18
          }, {
            x: 66,
            y: 261,
            d: 17
          }, {
            x: 66,
            y: 261,
            d: 17
          }, {
            d: 300,
            c: 'arrow',
            f: null
          }, {
            x: 66,
            y: 259,
            d: 800
          }, {
            x: 71,
            y: 256,
            d: 17
          }, {
            x: 78,
            y: 252,
            d: 17
          }, {
            x: 89,
            y: 244,
            d: 18
          }, {
            x: 97,
            y: 238,
            d: 17
          }, {
            x: 104,
            y: 233,
            d: 18
          }, {
            x: 115,
            y: 224,
            d: 17
          }, {
            x: 122,
            y: 218,
            d: 17
          }, {
            x: 129,
            y: 210,
            d: 17
          }, {
            x: 135,
            y: 203,
            d: 18
          }, {
            x: 141,
            y: 196,
            d: 17
          }, {
            x: 150,
            y: 187,
            d: 18
          }, {
            x: 155,
            y: 180,
            d: 17
          }, {
            x: 160,
            y: 175,
            d: 18
          }, {
            x: 164,
            y: 167,
            d: 17
          }, {
            x: 168,
            y: 161,
            d: 17
          }, {
            x: 171,
            y: 157,
            d: 16
          }, {
            x: 175,
            y: 150,
            d: 18
          }, {
            x: 178,
            y: 146,
            d: 17
          }, {
            x: 182,
            y: 139,
            d: 17
          }, {
            x: 186,
            y: 132,
            d: 18
          }, {
            x: 191,
            y: 125,
            d: 18
          }, {
            x: 198,
            y: 118,
            d: 17
          }, {
            x: 204,
            y: 110,
            d: 15
          }, {
            x: 207,
            y: 104,
            d: 18
          }, {
            x: 212,
            y: 97,
            d: 17
          }, {
            x: 215,
            y: 92,
            d: 18
          }, {
            x: 219,
            y: 86,
            d: 17
          }, {
            x: 224,
            y: 78,
            d: 17
          }, {
            x: 225,
            y: 73,
            d: 24
          }, {
            x: 228,
            y: 67,
            d: 11
          }, {
            x: 231,
            y: 63,
            d: 17
          }, {
            x: 232,
            y: 60,
            d: 17
          }, {
            x: 233,
            y: 57,
            d: 17
          }, {
            x: 234,
            y: 55,
            d: 17
          }, {
            x: 234,
            y: 53,
            d: 17
          }, {
            x: 235,
            y: 51,
            d: 17
          }, {
            x: 236,
            y: 48,
            d: 17
          }, {
            x: 237,
            y: 46,
            d: 17
          }, {
            x: 237,
            y: 45,
            d: 18
          }, {
            x: 238,
            y: 42,
            d: 17
          }, {
            x: 239,
            y: 40,
            d: 18
          }, {
            x: 240,
            y: 38,
            d: 17
          }, {
            x: 240,
            y: 37,
            d: 16
          }, {
            x: 241,
            y: 35,
            d: 17
          }, {
            x: 242,
            y: 32,
            d: 18
          }, {
            x: 242,
            y: 30,
            d: 18
          }, {
            x: 242,
            y: 29,
            d: 16
          }, {
            x: 242,
            y: 27,
            d: 17
          }, {
            x: 243,
            y: 26,
            d: 18,
            c: 'text'
          }, {
            x: 243,
            y: 23,
            d: 18
          }, {
            x: 243,
            y: 22,
            d: 17
          }, {
            x: 243,
            y: 20,
            d: 18
          }, {
            x: 243,
            y: 20,
            d: 17
          }, {
            x: 243,
            y: 18,
            d: 17
          }, {
            x: 243,
            y: 17,
            d: 17
          }, {
            x: 243,
            y: 17,
            d: 19
          }, {
            x: 243,
            y: 16,
            d: 17
          }, {
            x: 243,
            y: 15,
            d: 17
          }, {
            x: 243,
            y: 14,
            d: 17
          }, {
            x: 243,
            y: 13,
            d: 34
          }, {
            x: 243,
            y: 12,
            d: 33
          }, {
            d: 400,
            e: 'addClass',
            s: '#builder-header',
            k: 'cursor cursor-blinking'
          }, {
            d: 400,
            e: 'removeClass',
            s: '#builder-header',
            k: 'cursor-blinking'
          }, {
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 200,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 200,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 50,
            e: 'key',
            s: '#builder-header',
            k: 'backspace'
          }, {
            d: 150,
            e: 'key',
            s: '#builder-header',
            k: 'D'
          }, {
            d: 100,
            e: 'key',
            s: '#builder-header',
            k: 'e'
          }, {
            d: 200,
            e: 'key',
            s: '#builder-header',
            k: 'v'
          }, {
            d: 200,
            e: 'key',
            s: '#builder-header',
            k: 'e'
          }, {
            d: 200,
            e: 'key',
            s: '#builder-header',
            k: 'l'
          }, {
            d: 200,
            e: 'key',
            s: '#builder-header',
            k: 'o'
          }, {
            d: 100,
            e: 'key',
            s: '#builder-header',
            k: 'p'
          }, {
            d: 200,
            e: 'key',
            s: '#builder-header',
            k: 'm'
          }, {
            d: 100,
            e: 'key',
            s: '#builder-header',
            k: 'e'
          }, {
            d: 100,
            e: 'key',
            s: '#builder-header',
            k: 'n'
          }, {
            d: 200,
            e: 'key',
            s: '#builder-header',
            k: 't'
          }, {
            d: 200,
            e: 'key',
            s: '#builder-header',
            k: 'a'
          }, {
            d: 100,
            e: 'key',
            s: '#builder-header',
            k: 'l'
          }, {
            d: 100,
            e: 'key',
            s: '#builder-header',
            k: ' '
          }, {
            d: 200,
            e: 'key',
            s: '#builder-header',
            k: 'P'
          }, {
            d: 100,
            e: 'key',
            s: '#builder-header',
            k: 's'
          }, {
            d: 100,
            e: 'key',
            s: '#builder-header',
            k: 'y'
          }, {
            d: 100,
            e: 'key',
            s: '#builder-header',
            k: 'c'
          }, {
            d: 100,
            e: 'key',
            s: '#builder-header',
            k: 'h'
          }, {
            d: 200,
            e: 'key',
            s: '#builder-header',
            k: 'o'
          }, {
            d: 200,
            e: 'key',
            s: '#builder-header',
            k: 'l'
          }, {
            d: 100,
            e: 'key',
            s: '#builder-header',
            k: 'o'
          }, {
            d: 100,
            e: 'key',
            s: '#builder-header',
            k: 'g'
          }, {
            d: 100,
            e: 'key',
            s: '#builder-header',
            k: 'y'
          }, {
            e: 'addClass',
            s: '#builder-header',
            k: 'cursor-blinking'
          }, {
            x: 242,
            y: 15,
            d: 1000
          }, {
            x: 235,
            y: 23,
            d: 18
          }, {
            x: 228,
            y: 31,
            d: 17
          }, {
            x: 221,
            y: 40,
            d: 18
          }, {
            x: 214,
            y: 47,
            d: 17
          }, {
            x: 208,
            y: 55,
            d: 17,
            c: 'arrow'
          }, {
            x: 201,
            y: 63,
            d: 18
          }, {
            x: 195,
            y: 70,
            d: 17
          }, {
            x: 189,
            y: 77,
            d: 17
          }, {
            x: 183,
            y: 84,
            d: 17
          }, {
            x: 177,
            y: 91,
            d: 17
          }, {
            x: 171,
            y: 98,
            d: 17
          }, {
            x: 165,
            y: 105,
            d: 17
          }, {
            x: 160,
            y: 111,
            d: 18
          }, {
            x: 155,
            y: 118,
            d: 18
          }, {
            x: 149,
            y: 124,
            d: 18
          }, {
            x: 144,
            y: 130,
            d: 18
          }, {
            x: 139,
            y: 136,
            d: 18
          }, {
            x: 134,
            y: 142,
            d: 18
          }, {
            x: 129,
            y: 147,
            d: 17
          }, {
            x: 125,
            y: 153,
            d: 18
          }, {
            x: 120,
            y: 158,
            d: 18
          }, {
            x: 116,
            y: 163,
            d: 17
          }, {
            x: 111,
            y: 168,
            d: 17
          }, {
            x: 107,
            y: 173,
            d: 17
          }, {
            x: 103,
            y: 178,
            d: 18
          }, {
            x: 99,
            y: 183,
            d: 18
          }, {
            x: 96,
            y: 187,
            d: 17
          }, {
            x: 92,
            y: 191,
            d: 18
          }, {
            x: 88,
            y: 195,
            d: 18
          }, {
            x: 85,
            y: 199,
            d: 18
          }, {
            x: 82,
            y: 203,
            d: 17
          }, {
            x: 79,
            y: 207,
            d: 17
          }, {
            x: 76,
            y: 210,
            d: 17
          }, {
            x: 73,
            y: 214,
            d: 17
          }, {
            x: 70,
            y: 217,
            d: 17
          }, {
            x: 68,
            y: 220,
            d: 17
          }, {
            x: 65,
            y: 223,
            d: 17
          }, {
            x: 63,
            y: 226,
            d: 18
          }, {
            x: 60,
            y: 228,
            d: 17
          }, {
            x: 58,
            y: 231,
            d: 18
          }, {
            x: 56,
            y: 233,
            d: 17
          }, {
            x: 55,
            y: 235,
            d: 17
          }, {
            x: 53,
            y: 237,
            d: 17
          }, {
            x: 51,
            y: 239,
            d: 17
          }, {
            x: 50,
            y: 241,
            d: 17
          }, {
            x: 48,
            y: 243,
            d: 18
          }, {
            x: 47,
            y: 244,
            d: 17
          }, {
            x: 46,
            y: 245,
            d: 18
          }, {
            x: 45,
            y: 246,
            d: 17
          }, {
            x: 44,
            y: 247,
            d: 17
          }, {
            x: 44,
            y: 248,
            d: 18
          }, {
            x: 43,
            y: 249,
            d: 18
          }, {
            x: 43,
            y: 249,
            d: 17
          }, {
            x: 42,
            y: 250,
            d: 18
          }, {
            x: 42,
            y: 250,
            d: 18
          }, {
            x: 42,
            y: 250,
            d: 18
          }, {
            d: 400,
            c: 'arrow',
            e: 'removeClass',
            s: '#builder-header',
            k: 'cursor cursor-blinking'
          }
        ];
      };
      replayer = new window.Noba.Event.Replayer(builderEvents(), $('.crosshair'));
      return replayer.replay();
    }
  });

}).call(this);
(function() {
  $(function() {
    var facetsStacked, input, inputs, request, results, saveHistory, sortable, _i, _len;
    results = $('#search-results');
    facetsStacked = $('#search-facets-stacked');
    sortable = results.data('contains-sortables');
    saveHistory = results.data('save-history');
    request = null;
    if (results.length !== 0) {
      inputs = $('.noba-search-form input[type="text"]');
      for (_i = 0, _len = inputs.length; _i < _len; _i++) {
        input = inputs[_i];
        $(input).data('previous-value', $(input).val());
      }
      setInterval(function() {
        var _j, _len1, _results;
        if (request) {
          return;
        }
        _results = [];
        for (_j = 0, _len1 = inputs.length; _j < _len1; _j++) {
          input = inputs[_j];
          _results.push((function(input) {
            var currentValue, except, id, tags, topics;
            input = $(input);
            currentValue = input.val();
            if (currentValue !== input.data('previous-value') || input.data('refresh') === "yes") {
              input.data('previous-value', currentValue);
              input.data('refresh', false);
              except = (function() {
                var _k, _len2, _ref, _results1;
                _ref = $('.builder-section-list').find('li input[type="hidden"]');
                _results1 = [];
                for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
                  id = _ref[_k];
                  _results1.push(id.value);
                }
                return _results1;
              })();
              topics = location.search.match(/[?&]topics=(\d+)/);
              if (topics != null) {
                topics = topics[1];
              }
              tags = location.search.match(/[?&]tags=(\d+)/);
              if (tags != null) {
                tags = tags[1];
              }
              if (history.replaceState && saveHistory) {
                history.replaceState(null, null, location.pathname + '?' + $.param({
                  query: currentValue,
                  topics: topics,
                  tags: tags
                }));
              }
              return request = $.ajax({
                url: '/modules.js',
                data: $.param({
                  query: currentValue,
                  except: except,
                  topics: topics,
                  tags: tags,
                  sortable: sortable
                }),
                dataType: 'html'
              }).done(function(html) {
                var content;
                content = $("<div>").append($.parseHTML(html));
                results.html(content.find('#search-results-new').html());
                facetsStacked.html(content.find('#search-facets-stacked-new').html());
                Noba.sortable($('#search-results').find('[data-sortable]'));
                return request = null;
              });
            }
          })(input));
        }
        return _results;
      }, 300);
      return inputs.keydown(function(e) {
        if (e.keyCode === 13) {
          e.preventDefault();
          return inputs.blur();
        }
      });
    }
  });

}).call(this);
(function() {
  $(function() {
    var button, link, modal,
      _this = this;
    $('.noba-tooltip').tooltip({
      container: 'body'
    });
    $('.noba-nav-menu').click(function(e) {
      e.preventDefault();
      return $(this).next('.nav').toggleClass('active');
    });
    if (modal = location.hash.match(/#([a-z-]+)/i)) {
      $("#modal-" + modal[1]).modal();
    }
    $(document).on('shown.bs.modal', function(e) {
      return $(e.target).find('[autofocus]').add($(e.target).find('button.close')).focus();
    });
    $(document).on('shown.bs.modal', function(e) {
      return $(e.target).find('input.select2').select2('clearSearch');
    });
    if ($.support.touch) {
      $('body').addClass('touch-enabled');
    }
    button = $('.btn-download');
    button.click(function(e) {
      var checkStatus, interval, target, url;
      target = $(event.currentTarget);
      e.preventDefault();
      target.addClass('disabled');
      url = target.attr('href');
      checkStatus = function() {
        return $.getJSON(url).done(function(data) {
          if (data.building) {
            return target.addClass('pdf-generating');
          } else {
            target.removeClass('pdf-generating disabled');
            clearInterval(interval);
            return window.location = url;
          }
        });
      };
      interval = setInterval(checkStatus, 1000);
      return checkStatus();
    });
    link = $('.copy-link');
    return link.click(function(e) {
      e.preventDefault();
      return Noba.utilities.copyToClipboard($(this), $(this).next('.copy-container'), 'Link copied successfully!');
    });
  });

}).call(this);
