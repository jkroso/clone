
/**
 * Module dependencies.
 */

var type = require('type');

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
  var fn = clone[type(obj)]
  return fn ? fn(obj) : obj
}

clone.object = function(a){
  var b = {}
  for (var k in a) {
    b[k] = clone(a[k]);
  }
  return b
}

clone.array = function(a){
  var i = a.length
  var copy = new Array(i);
  while (i--) {
    copy[i] = clone(a[i]);
  }
  return copy;
}

clone.regexp = function(a){
  var flags = ''
    + (a.multiline ? 'm' : '')
    + (a.global ? 'g' : '')
    + (a.ignoreCase ? 'i' : '')
  return new RegExp(a.source, flags);
}

clone.date = function(a){
  return new Date(a.getTime());
}

clone.string = unbox
clone.number = unbox
clone.boolean = unbox

function unbox(a){ return a.valueOf() }

/**
 * Clone `clone`.
 * 
 * @return {Function}
 * @api public
 */

clone.self = function(){
  var module = clone
  for (var k in clone) {
    module += '\nclone.'+k+' = '+clone[k]
  }
  return eval(module+';clone')
}