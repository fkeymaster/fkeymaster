# FKeymaster

FKeymaster is a simple library for defining and dispatching keyboard shortcuts. It has no dependencies. It's a fork of [keymaster.js][original].

[original]: https://github.com/madrobby/keymaster

## Demonstration

See [live demo][demo].

[demo]: http://fkeymaster.github.com/fkeymaster/

## Basic concept

One global method is exposed, `key` which assign keys when called directly.

At any point in time (even in code other than key handlers),
you can query the `key` object for the state of modifier keys. This
allows easy implementation of things like shift+click handlers. For example,
`key.shift` is `true` if the shift key is currently pressed.

FKeymaster understands the following modifiers:

`⇧`, `shift`, `option`, `⌥`, `alt`, `ctrl`, `control`, `command`, and `⌘`.

The following special keys can be used for keys:

`backspace`, `tab`, `clear`, `enter`, `return`, `esc`, `escape`, `space`,
`up`, `down`, `left`, `right`, `home`, `end`, `pageup`, `pagedown`, `del`, `delete`
and `f1` through `f19`.

### Scope

Scope is an important concept in FKeymaster. The default scope is 'all'. You can assign a key with scope or without. When you don't assign with scope, which mean that key will be activated in any scope.

Use `key.setScope` for switching current scope.

## Assigning keys to handler function

```javascript
// define short of 'a'
key('a', func);

// returning false stops the event and prevents default browser events
key('ctrl+r', function(){ alert('stopped reload!'); return false });

// multiple shortcuts
key('command+r, ctrl+r', func);

// shortcut with a scope
key('o, enter', 'issues', func);
key('o, enter', 'files', func);
key.setScope('issues'); // default scope is 'all'

// sequence key
key(['g', 's'], func);

// query modifier keys
if(key.shift) alert('shift is pressed, OMGZ!');
```

### Using targetSpec

*targetSpec* allows you to specify the elements which receive the events using simple CSS selector.

```js
key('t', { match: '#elem_id' }, func);
key('t', { match: '#elem_id', scope: 'issues' }, func);
key('t', { match: '.class_name' }, func);
key('t', { match: 'textarea' }, func);
key(['t', 'd'], { match: 'input.class_name' }, func);
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

* Comprehensive test suite

## License

* FKeymaster is (c) 2011 FKeymaster contributers and may be freely distributed under the MIT license.
* Keymaster is (c) 2011 Thomas Fuchs and may be freely distributed under the MIT license.

See the `MIT-LICENSE` file.
