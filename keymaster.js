//     keymaster.js
//     (c) 2011 Thomas Fuchs
//     keymaster.js may be freely distributed under the MIT license.

;(function(global){
  var k,
    _handlers = {},
    _mods = { 16: false, 18: false, 17: false, 91: false },
    _scope = 'all',
    // modifier keys
    _MODIFIERS = {
      '⇧': 16, shift: 16,
      option: 18, '⌥': 18, alt: 18,
      ctrl: 17, control: 17,
      command: 91, '⌘': 91
    },
    // special keys
    _MAP = {
      backspace: 8, tab: 9, clear: 12,
      enter: 13, 'return': 13,
      esc: 27, escape: 27, space: 32,
      left: 37, up: 38,
      right: 39, down: 40,
      del: 46, 'delete': 46,
      home: 36, end: 35,
      pageup: 33, pagedown: 34 };

  for (k=1; k<20; k++)
    _MODIFIERS['f' + k] = 111 + k;

  // handle keydown event
  function dispatch(event){
    var key, tagName, handler, k, i, modifiersMatch;
    tagName = (event.target || event.srcElement).tagName;
    key = event.keyCode;
    // if a modifier key, set the key.<modifierkeyname> property to true and return
    if (key == 93 || key == 224) key = 91; // right command on webkit, command on Gecko
    if (key in _mods) {
      _mods[key] = true;
      // 'assignKey' from inside this closure is exported to window.key
      for (k in _MODIFIERS)
        if (_MODIFIERS[k] == key)
          assignKey[k] = true;
      return;
    }

    // abort if no potentially matching shortcuts found
    if (!(key in _handlers))
      return;

    // for each potential shortcut
    _handlers[key].forEach(function(handler){
      // see if it's in the current scope
      if(handler.targetSpec.scope && handler.targetSpec.scope != _scope)
        return;
      // ignore keypressed in any elements that support keyboard data input
      if(handler.targetSpec.id === null &&
          (tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA'))
        return;
      if(handler.targetSpec.id && event.target.id != handler.targetSpec.id)
        return;
      if(handler.targetSpec.tagName && event.target.tagName != handler.targetSpec.tagName)
        return;
      // check if modifiers match if any
      modifiersMatch = handler.mods.length > 0;
      for (k in _mods)
        if ((  !_mods[k] && handler.mods.indexOf(+k) >  -1)
            || (_mods[k] && handler.mods.indexOf(+k) == -1))
          modifiersMatch = false;
      // call the handler and stop the event if neccessary
      if ((handler.mods.length == 0
           && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91])
          || modifiersMatch){
        if (handler.method(event, handler)===false){
          if (event.preventDefault)
            event.preventDefault();
          else
            event.returnValue = false;

          if (event.stopPropagation)
            event.stopPropagation();

          if (event.cancelBubble)
            event.cancelBubble = true;
        }
      }
    });
  };

  // unset modifier keys on keyup
  function clearModifier(event){
    var key = event.keyCode, k;
    if (key == 93 || key == 224)
      key = 91;
    if (key in _mods) {
      _mods[key] = false;
      for (k in _MODIFIERS) if(_MODIFIERS[k] == key)
        assignKey[k] = false;
    }
  };

  // parse and assign shortcut
  function assignKey(key, targetSpec, method){
    var keys, mods, i, mi;
    if (method === undefined) {
      method = targetSpec;
      targetSpec = { id: null };
    }
    if (typeof targetSpec == 'string')
      targetSpec = { scope: targetSpec };
    key = key.replace(/\s/g,'');
    keys = key.split(',');
    // for each shortcut
    keys.forEach(function(originalKey){
      // set modifier keys if any
      mods = [];
      key = originalKey.split('+');
      if(key.length > 1){
        mods = key.slice(0,key.length - 1).map(function(mod){
            return _MODIFIERS[mod];
            });
        key = [key[key.length - 1]];
      }
      // convert to keycode and...
      key = key[0]
      key = key.length > 1 ? _MAP[key] : key.toUpperCase().charCodeAt(0);
      // ...store handler
      if (!(key in _handlers))
        _handlers[key] = [];
      _handlers[key].push({ targetSpec: targetSpec,
                            method: method,
                            key: originalKey,
                            mods: mods });
    });
  };

  function assignKeys(keys, targetSpec, method) {
    if (method === undefined) {
      method = targetSpec;
      targetSpec = { id: null };
    }
    if (typeof targetSpec == 'string')
      targetSpec = { scope: targetSpec };
    if (typeof keys == 'string')
      keys = [keys];

    keys.forEach(function(key, i){
      if (i < keys.length - 1) {
        //create specific scope for current key in sequence
        var newScope = key;
        if (targetSpec.scope)
          newScope = targetSpec.scope + '-' + newScope;
        assignKey(key, targetSpec, function (ev, key) {
          setScope(this.toString());

            // reset scope after 1 second
          _timer = setTimeout(function () {
            setScope('all');
          }, 1000);
        }.bind(newScope));
        targetSpec.scope = newScope;
      } else {
        // last key should perform the method
        assignKey(key, targetSpec, method);
      }
    });
  }

  // initialize key.<modifier> to false
  for (k in _MODIFIERS)
    assignKey[k] = false;

  // set current scope (default 'all')
  function setScope(scope){
    _scope = scope || 'all';
  };

  // cross-browser events
  function addEvent(object, event, method) {
    if (object.addEventListener)
      object.addEventListener(event, method, false);
    else if(object.attachEvent)
      object.attachEvent('on' + event, function(){
          method(window.event);
          });
  };

  // set the handlers globally on document
  addEvent(document, 'keydown', dispatch);
  addEvent(document, 'keyup', clearModifier);

  // set window.key and window.key.setScope
  global.key = assignKeys;
  global.key.setScope = setScope;

  if (typeof module !== 'undefined')
    module.exports = key;

})(this);
