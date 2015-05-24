#[This project has been Abandoned!]

A context menu plugin to be used with [jQuery](http://jquery.com).

It supports [bootstrap](http://getbootstrap.com) natively but can be easily used with/without any other framework. Its only hard dependency is [jQuery](http://jquery.com). 

##Installation
**Via Bower**
```
bower install jquery-contextmenu
```
**Manual**

Download [zip](https://github.com/vkbansal/jquery-contextmenu/archive/master.zip)

##Usage
Add required scripts and stylesheets. 
```markup
<link rel="stylesheet" href="path/to/bootstrap.css">
<script src="path/to/jquery.js"></script>
<script src="path/to/contextmenu.min.js"></script>
```
Make a menu.
```markup
<div id="example"></div>

<!-- Container for the menu. Menu should always be wrapped in a container -->
<div id="context-menu" style="display:none">
    <!-- The actual menu that will be displayed-->
    <ul class="dropdown-menu">
        <li><a href="#">Action 1</a></li>
        <li><a href="#">Action 2</a></li>
        <li><a href="#">Action 3</a></li>
        <li class="divider"></li>
        <li><a href="#">Action 4</a></li>
        <li><a href="#">Action 5</a></li>
        <li><a href="#">Action 6</a></li>
    </ul>
</div>
```
> Menu must be placed in a static container preferably under `body`

Display it.
```js
$(document).ready(function(){
    $('#example').contextmenu({
        target: "#context-menu"
    });
});
```

##Options
**options.target**

Type: *String*

The identifier for the container of the menu.


**options.menuIdentifier**

Type: *String*

The identifier for the actual menu.

**options.target**

Type: *String*

The identifier for the container of the menu.


**options.before**

Type: *Function*

Default:
```js
function(){
    return true;
}
```
A function that is called just before showing the menu. If a **falsy** value is returned, the context menu will not be dispalyed. It has two arguments:
- `event` : The browser's original `contextmenu` event.
- `context` : The element where the click occured.

##Events
| event               | fired when                      |
|---------------------|---------------------------------|
| show.menu.context   | Just before menu is to be shown |
| shown.menu.context  | Just after menu is shown        |
| hide.menu.context   | Just after menu is to be hidden |
| hidden.menu.context | Just after menu is hidden       |
| click.item.context  | An item in menu is clicked      |

> **Note**: The context for these events is the menu provided in `target` option while initialization

`click.item.context`, takes two arguments:
- `event` : The browser's original `click` event. 
- `data`: It's an object with two keys, `item` and `context`. `data.item` is the clicked item and `data.context` is where the right click ocurred. 

##Methods
###getMenu
Returns the related menu
```js
$('#example').contextmenu('getMenu');
```

##Examples
coming soon

##Changelog
You can find change log [here](CHANGELOG.md)

##Credits
This project is based on [bootstrap-contextmenu](https://github.com/sydcanem/bootstrap-contextmenu) by [@sydcanem](https://github.com/sydcanem/)

##License
MIT
