# keymaster.js

FKeymaster is a simple library for defining and dispatching keyboard shortcuts. It has no dependencies. It's a fork of [keymaster.js][original].

[original]: https://github.com/madrobby/keymaster

## Demonstration

FKeymaster should work with any browser that fires `keyup` and `keydown` events,
and is tested with IE (6+), Safari, Firefox and Chrome.

See [http://madrobby.github.com/keymaster/](http://madrobby.github.com/keymaster/) for a live demo.

## Basic concept

One global method is exposed, `key` which defines shortcuts when
called directly. Use `key.setScope` for switching scope.

At any point in time (even in code other than key shortcut handlers),
you can query the `key` object for the state of modifier keys. This
allows easy implementation of things like shift+click handlers. For example,
`key.shift` is `true` if the shift key is currently pressed.

Keymaster understands the following modifiers:
`⇧`, `shift`, `option`, `⌥`, `alt`, `ctrl`, `control`, `command`, and `⌘`.

The following special keys can be used for shortcuts:
`backspace`, `tab`, `clear`, `enter`, `return`, `esc`, `escape`, `space`,
`up`, `down`, `left`, `right`, `home`, `end`, `pageup`, `pagedown`, `del`, `delete`
and `f1` through `f19`.

## Assigning keys to handler function

```javascript
// define short of 'a'
key('a', function(){ alert('you pressed a!') });

// returning false stops the event and prevents default browser events
key('ctrl+r', function(){ alert('stopped reload!'); return false });

// multiple shortcuts
key('command+r, ctrl+r', function(){ });

// shortcut with a scope
key('o, enter', 'issues', function(){ /* do something */ });
key('o, enter', 'files', function(){ /* do something else */ });
key.setScope('issues'); // default scope is 'all'

// sequence key
key(['g', 's'], function(){ /* do something */ });

// query modifier keys
if(key.shift) alert('shift is pressed, OMGZ!');
```

## Handler function

The handler method is called with two arguments set, the keydown `event` fired, and
an object containing, among others, the following two properties:

`key`: a string that contains the key triggered, e.g. `ctrl+r`
`scope`: a string describing the scope (or `all`)

```javascript
key('⌘+r, ctrl+r', function(event, handler){
  console.log(handler.shortcut, handler.scope);
});

// "ctrl+r", "all"
```

## CoffeeScript

If you're using CoffeeScript, configuring key shortcuts couldn't be simpler:

```coffeescript
key 'a', -> alert('you pressed a!')

key '⌘+r, ctrl+r', ->
  alert 'stopped reload!'
  off

key 'o, enter', 'issues', ->
  whatevs()

alert 'shift is pressed, OMGZ!' if key.shift
```

## Ender support

Add `keymaster` as a top level method to your [Ender](http://ender.no.de) compilation.

    $ ender add keymaster

Use it:

``` js
$.key('⌘+r', function () {
  alert('reload!')
})
```

## TODO

* Make behavior with `INPUT` / `SELECT` / `TEXTAREA` configurable
* Comprehensive test suite

Keymaster is (c) 2011 Thomas Fuchs and may be freely distributed under the MIT license.
See the `MIT-LICENSE` file.
