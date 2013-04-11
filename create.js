
/**
 * a minimal Object.create() shim
 */

module.exports = Object.create

if (!module.exports) {
	function C(){}
	module.exports = function(a){
		C.prototype = a;
		return new C;
	}
}
