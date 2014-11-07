((factory)->
    if typeof define is 'function' and define.amd
        define(['jquery'], factory)
    else 
        factory(jQuery)
    return
)(($) ->

    `'use strict'`

    # Create the defaults once
    defaults =
        before: -> true
        target: null
        menuIdentifier : ".dropdown-menu"
        elementScope : null

    ###
        FILETREE CLASS DEFINITION
    ###
    class ContextMenu
        constructor: (@$element, options) ->
            @settings = $.extend {}, defaults, options
            
            @$element.data('target', options.target) if options.target

            @init()

        init: ->
            $@element.on('contextmenu.menu.context', @settings.elementScope, @show.call(@))
            $('html').on('click..menucontext', @hide.call(@))
            return

        destroy: ->
            $@element.off('.menu.context').data('$.contextmenu', null)
            $('html').off('.menu.context')
            return

        show: (event)->
            relatedTarget = {relatedTarget: @}
            return if @isDisabled()
            @hide()
            return unless @settings.before.call(this, event, $(event.currentTarget))

            $menu = @getMenu
            $menu.trigger $.Event('show.menu.context', relatedTarget)

            targetPosition = @_getPosition(e, $menu)
            $menu.attr('style', '')
                .css(targetPosition)
                .addClass('open')
                .one('click.context', 'li.not(.divider)', (e)->
                    $menu.trigger $.Event('click.item.context')
                )
            return

        hide: ->
            return

        isDisabled: ->
            @$element.hasClass "disabled" or @$element.attr('disabled')

        getMenu: ->
            selector = @$element.data('target')

            unless selector
                selector = @$element.attr('href')
                selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); #strip for ie7

            $menu = $(selector)

            unless $menu.length
                $menu @$element.find(selector)

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

            menuStyles

    ###
        PLUGIN DEFINITION
    ###
    Plugin = (options, obj) ->
        @each ->
            $this = $(this)
            data = $this.data('$.contextmenu')
            
            unless data
                $this.data "$.contextmenu", (data = new ContextMenu(@, options))

            if typeof options is 'string' and options.substr(0,1) isnt '_'
                retVal =data[options].call(data,obj)

            return


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
