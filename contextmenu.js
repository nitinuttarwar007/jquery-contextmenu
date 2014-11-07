(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else {
    factory(jQuery);
  }
})(function($) {
  'use strict';
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
    function ContextMenu($element, options) {
      this.$element = $element;
      this.settings = $.extend({}, defaults, options);
      if (options.target) {
        this.$element.data('target', options.target);
      }
      this.init();
    }

    ContextMenu.prototype.init = function() {};

    ContextMenu.prototype.show = function() {};

    ContextMenu.prototype.getMenu = function() {
      var $menu, selector;
      selector = this.$element.data('target');
      if (!selector) {
        selector = this.$element.attr('href');
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '');
      }
      $menu = $(selector);
      if (!$menu.length) {
        $menu(this.$element.find(selector));
      }
      return $menu;
    };

    ContextMenu.prototype._getPosition = function(e, $menu) {
      var limitX, limitY, menuHeight, menuStyles, menuWidth, mouseX, mouseY, scrollLeft, scrollTop;
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
        $this.data("$.contextmenu", (data = new FileTree(this, options)));
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
