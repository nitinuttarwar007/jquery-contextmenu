((factory)->
    if typeof define is 'function' and define.amd
        define(['jquery'], factory)
    else
        factory(jQuery)
    return
)(($) ->

    # Create the defaults once
    defaults =
        before: -> true
        target: null
        menuIdentifier : ".dropdown-menu"

    ###
        FILETREE CLASS DEFINITION
    ###
    class ContextMenu
        constructor: (@element, options) ->
            @settings = $.extend({}, defaults, options)
            
            $(@element).data('target', options.target) if options.target

            @init()

        init: ->
            $(@element).on('contextmenu.menu.context', @show.bind(@))
            $('html, body').on('click.menu.context', @hide.bind(@))
            return

        destroy: ->
            $(@element).off('.menu.context').data('$.contextmenu', null)
            $('html, body').off('.menu.context')
            return

        show: (event)->
            return if @isDisabled()
            @hide()

            return unless @settings.before.call(this, event, $(event.currentTarget))
            
            relatedTarget = {relatedTarget: @, bubbles: false}

            $menu = @getMenu()
            
            $menu.trigger($.Event('show.menu.context', relatedTarget))

            targetPosition = @_getPosition(event, $menu)
            that = @
            $menu.attr('style', '')
                .css(targetPosition)
                .addClass('open')
                .one('click.menu.context', 'li:not(.divider)', (e)->
                    $menu.trigger($.Event('click.item.context', relatedTarget), $(event.target))
                    that.hide.call(that)
                    false
                ).trigger($.Event('shown.menu.context', relatedTarget))
            
            $('html').on('click.menu.context', $menu.selector, @hide.bind(@))
            
            false

        hide: ->
            $menu = @getMenu()
            
            return unless $menu.hasClass('open')
            
            relatedTarget = {relatedTarget: @}
            
            $menu.trigger($.Event('hide.menu.context', relatedTarget))
            
            $menu.removeClass('open')
                .off('click.menu.context', 'li:not(.divider)')
                .trigger($.Event('hidden.menu.context', relatedTarget))

            $('html').off('click.menu.context', $menu.selector)
            
            false

        isDisabled: ->
            $(@element).hasClass("disabled") or $(@element).attr('disabled')

        getMenu: ->
            selector = $(@element).data('target')

            unless selector
                selector = $(@element).attr('href')
                selector = selector and selector.replace(/.*(?=#[^\s]*$)/, ''); #strip for ie7

            $menu = $(selector)

            unless $menu.length
                $menu = $(@element).find(selector)

            $menu

        _getPosition : (e, $menu)->
            mouseX = e.clientX
            mouseY = e.clientY
            
            limitX = $(window).width()
            limitY = $(window).height()
            
            menuWidth = $menu.find(@settings.menuIdentifier).outerWidth()
            menuHeight = $menu.find(@settings.menuIdentifier).outerHeight()
            
            scrollLeft = $(window).scrollLeft()
            scrollTop = $(window).scrollTop()
            
            menuStyles =
                position : "fixed"
                "z-index" : 9999
            
            menuStyles.top = mouseY + scrollTop
            menuStyles.top -= menuHeight if mouseY + menuHeight > limitY

            menuStyles.left = mouseX + scrollLeft
            menuStyles.left -= menuWidth if mouseX + menuWidth > limitX

            parentOffset = $menu.offsetParent().offset()
            parentScrollLeft = $menu.offsetParent().scrollLeft()
            parentScrollTop = $menu.offsetParent().scrollTop()
            
            menuStyles.left -= parentOffset.left + parentScrollLeft
            menuStyles.top -= parentOffset.top + parentScrollTop

            menuStyles

    ###
        PLUGIN DEFINITION
    ###
    Plugin = (options, obj) ->
        @each( ->
            $this = $(this)
            data = $this.data('$.contextmenu')
            
            unless data
                $this.data("$.contextmenu", (data = new ContextMenu(@, options)))

            if typeof options is 'string' and options.substr(0,1) isnt '_'
                retVal =data[options].call(data,obj)

            return
        )

    old = $.fn.contextmenu

    $.fn.contextmenu = Plugin
    $.fn.contextmenu.Constructor = ContextMenu

    ###
        NO CONFLICT
    ###
    $.fn.contextmenu.noConflict = ->
        $.fn.contextmenu = old
        @

    return
)
