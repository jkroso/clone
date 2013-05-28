
/**
 * Module dependencies.
 */

var type = require('type');
var create = require('./create');

/**
 * Clones objects.
 *
 * @param {Mixed} any object
 * @api public
 */

module.exports = function(obj){
  return clone(obj, [], []);
}

/**
 * internal dispatcher. if no specific handlers are
 * available `obj` itself will be returned
 * 
 * @param {X} obj
 * @param {Array} seen
 * @param {Array} copies
 * @return {X}
 * @api private
 */

function clone(obj, seen, copies){
  var fn = handle[type(obj)];
  return fn ? fn(obj, seen, copies) : obj;
}

/**
 * type specific handlers
 * 
 * @param {X} a
 * @param {Array} seen
 * @param {Array} copies
 * @return {X}
 * @api private
 */

var handle = {
  object: function(a, seen, copies){
    var k = seen.indexOf(a);
    if (k >= 0) return copies[k];
    var copy = create(a);
    copies.push(copy);
    seen.push(a);
    for (var k in a) {
      copy[k] = clone(a[k], seen, copies);
    }
    return copy
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
  boolean: unbox
}

function unbox(a){ return a.valueOf() }

function copyArray(a, seen, copies){
  var i = seen.indexOf(a);
  if (i >= 0) return copies[i];
  var copy = new Array(i = a.length);
  seen.push(a);
  copies.push(copy);
  while (i--) {
    copy[i] = clone(a[i], seen, copies);
  }
  return copy;
}

/**
 * Clone `clone`.
 * 
 * @return {Function}
 * @api public
 */

module.exports.self = function(){
  var module = clone;
  for (var k in clone) {
    module += '\nclone.'+k+' = '+clone[k];
  }
  module = eval(module+';clone');
  return function(obj){
    return module(obj, [], []);
  }
}
