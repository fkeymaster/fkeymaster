/**
 * fkm.js
 * 
 * Copyright 2011 FKeymaster contributors
 *
 * fkm.js may be freely distributed under the MIT license.
 *
 * fkm.js was forked from keymaster.js (c) 2011 Thomas Fuchs
 */

;(function(global) {
  /**
   * Private variables
   */

  /**
   * Setting up console.debug
   */
  // original console.debug
  var _CONSOLE_DEBUG;
  if (typeof console == 'undefined')
    console = {};
  _CONSOLE_DEBUG = console.debug || function(){};
  console.debug = function() {
    if (global.key.DEBUG)
      _CONSOLE_DEBUG.apply(this, arguments);
  }

  //Test a element against a selector
  function matches_sel(elem, selector, first, a, b, c) {
    //Take off first part of selector
    first = (selector = selector.split(".")).shift();
    c = " " + elem.className + " ";
    
    //If there is a first section and it contains an id, check to see if that matches with the element, otherwise return a falsey value
    if (first && ~(a = first.indexOf("#"))
        && (b = first.slice(1 + a), first = first.slice(0, a), elem.id != b)
           ? 0
           //if there is anything left of the first section, test to see if it matches with the element's tag
           : first && elem.nodeName != first.toUpperCase()
             ? 0
             : 1) {
      //Loop through the rest of the selector testing for classNames
      for (a=0, b=selector.length; a<b; a++) {
        if (!~c.indexOf(" " + selector[a] + " "))
          return 0;
      }

      //If everything else matched, return true
      return 1;
    }
  }

  // handle keydown event
  function dispatch(event) {
  };

  function cloneTargetSpec(targetSpec) {
    return {scope: targetSpec.scope,
            match: (targetSpec.match instanceof Array)
                   // don't use reference of array, duplicate it
                   ? targetSpec.match.slice()
                   // null, undefined, string
                   : targetSpec.match
            };
  } 

  function setModifiers(event) {
  }

  function assignKeys(keys, targetSpec, method) {
  }

  // set current scope (default 'all')
  function setScope(scope, keepFallback) {
  };

  // cross-browser events
  function addEvent(object, event, method) {
    if (object.addEventListener)
      object.addEventListener(event, method, false);
    else if (object.attachEvent)
      object.attachEvent('on' + event, function() {
          method(window.event);
          });
  };

  // set the handlers globally on document
  addEvent(document, 'keydown', dispatch);
  addEvent(document, 'keyup', setModifiers);

  // set window.key and window.key.setScope
  global.fkm = assignKeys;
  global.fkm.setScope = setScope;
  global.fkm.DEBUG = false;

})(this);
