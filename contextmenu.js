(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else {
    factory(jQuery);
  }
})(function($) {
  var ContextMenu, Plugin, defaults, old;
  defaults = {
    before: function() {
      return true;
    },
    target: null,
    menuIdentifier: ".dropdown-menu"
  };

  /*
      FILETREE CLASS DEFINITION
   */
  ContextMenu = (function() {
    function ContextMenu(element, options) {
      this.element = element;
      this.settings = $.extend({}, defaults, options);
      if (options.target) {
        $(this.element).data('target', options.target);
      }
      this.init();
    }

    ContextMenu.prototype.init = function() {
      $(this.element).on('contextmenu.menu.context', this.show.bind(this));
      $('html, body').on('click.menu.context', this.hide.bind(this));
    };

    ContextMenu.prototype.destroy = function() {
      $(this.element).off('.menu.context').data('$.contextmenu', null);
      $('html, body').off('.menu.context');
    };

    ContextMenu.prototype.show = function(event) {
      var $menu, relatedTarget, targetPosition, that;
      if (this.isDisabled()) {
        return;
      }
      this.hide();
      if (!this.settings.before.call(this, event, $(event.currentTarget))) {
        return;
      }
      relatedTarget = {
        relatedTarget: this,
        bubbles: false
      };
      $menu = this.getMenu();
      $menu.trigger($.Event('show.menu.context', relatedTarget));
      targetPosition = this._getPosition(event, $menu);
      that = this;
      $menu.attr('style', '').css(targetPosition).addClass('open').one('click.menu.context', 'li:not(.divider)', {
        context: event.target
      }, function(e) {
        var data;
        data = {
          item: e.target,
          context: e.data.context
        };
        $menu.trigger('click.item.context', [data]);
        that.hide.call(that);
        return false;
      }).trigger($.Event('shown.menu.context', relatedTarget));
      $('html').on('click.menu.context', $menu.selector, this.hide.bind(this));
      return false;
    };

    ContextMenu.prototype.hide = function() {
      var $menu, relatedTarget;
      $menu = this.getMenu();
      if (!$menu.hasClass('open')) {
        return;
      }
      relatedTarget = {
        relatedTarget: this
      };
      $menu.trigger($.Event('hide.menu.context', relatedTarget));
      $menu.removeClass('open').off('click.menu.context', 'li:not(.divider)').trigger($.Event('hidden.menu.context', relatedTarget));
      $('html').off('click.menu.context', $menu.selector);
      return false;
    };

    ContextMenu.prototype.isDisabled = function() {
      return $(this.element).hasClass("disabled") || $(this.element).attr('disabled');
    };

    ContextMenu.prototype.getMenu = function() {
      var $menu, selector;
      selector = $(this.element).data('target');
      if (!selector) {
        selector = $(this.element).attr('href');
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '');
      }
      $menu = $(selector);
      if (!$menu.length) {
        $menu = $(this.element).find(selector);
      }
      return $menu;
    };

    ContextMenu.prototype._getPosition = function(e, $menu) {
      var limitX, limitY, menuHeight, menuStyles, menuWidth, mouseX, mouseY, parentOffset, parentScrollLeft, parentScrollTop, scrollLeft, scrollTop;
      mouseX = e.clientX;
      mouseY = e.clientY;
      limitX = $(window).width();
      limitY = $(window).height();
      menuWidth = $menu.find(this.settings.menuIdentifier).outerWidth();
      menuHeight = $menu.find(this.settings.menuIdentifier).outerHeight();
      scrollLeft = $(window).scrollLeft();
      scrollTop = $(window).scrollTop();
      menuStyles = {
        position: "fixed",
        "z-index": 9999
      };
      menuStyles.top = mouseY + scrollTop;
      if (mouseY + menuHeight > limitY) {
        menuStyles.top -= menuHeight;
      }
      menuStyles.left = mouseX + scrollLeft;
      if (mouseX + menuWidth > limitX) {
        menuStyles.left -= menuWidth;
      }
      parentOffset = $menu.offsetParent().offset();
      parentScrollLeft = $menu.offsetParent().scrollLeft();
      parentScrollTop = $menu.offsetParent().scrollTop();
      menuStyles.left -= parentOffset.left + parentScrollLeft;
      menuStyles.top -= parentOffset.top + parentScrollTop;
      return menuStyles;
    };

    return ContextMenu;

  })();

  /*
      PLUGIN DEFINITION
   */
  Plugin = function(options, obj) {
    return this.each(function() {
      var $this, data, retVal;
      $this = $(this);
      data = $this.data('$.contextmenu');
      if (!data) {
        $this.data("$.contextmenu", (data = new ContextMenu(this, options)));
      }
      if (typeof options === 'string' && options.substr(0, 1) !== '_') {
        retVal = data[options].call(data, obj);
      }
    });
  };
  old = $.fn.contextmenu;
  $.fn.contextmenu = Plugin;
  $.fn.contextmenu.Constructor = ContextMenu;

  /*
      NO CONFLICT
   */
  $.fn.contextmenu.noConflict = function() {
    $.fn.contextmenu = old;
    return this;
  };
});
