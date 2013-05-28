
/**
 * Module dependencies.
 */

var type = require('type');
var create = require('./create')

/**
 * Module exports.
 */

module.exports = clone;

/**
 * Clones objects.
 *
 * @param {Mixed} any object
 * @api public
 */

function clone(obj){
  var fn = handle[type(obj)]
  return fn ? fn(obj) : obj
}

var handle = {
  object: function(a){
    var b = create(a);
    for (var k in a) {
      b[k] = clone(a[k]);
    }
    return b
  },
  array: copyArray,
  arguments: copyArray,
  regexp: function(a){
    var flags = ''
      + (a.multiline ? 'm' : '')
      + (a.global ? 'g' : '')
      + (a.ignoreCase ? 'i' : '')
    return new RegExp(a.source, flags);
  },
  date: function(a){
    return new Date(a.getTime());
  },
  string: unbox,
  number: unbox,
  boolean: unbox,
  element: function(a){
    return a.cloneNode(true);
  }
}

function copyArray(a){
  var i = a.length
  var copy = new Array(i);
  while (i--) {
    copy[i] = clone(a[i]);
  }
  return copy;
}

function unbox(a){ return a.valueOf() }
