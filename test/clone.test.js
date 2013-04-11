
/* test dependencies */

var clone = require('..');
var expect = require('expect.js');

function test(clone){
  return function(){
    it('date', function(){
      var obj = new Date;
      var cloned = clone(obj);
      expect(cloned.getTime()).to.be(obj.getTime());
      expect(cloned).not.to.be(obj);
    });

    it('regexp', function(){
      var obj = /hello/i;
      var cloned = clone(obj);
      expect(cloned.toString()).to.be(obj.toString());
      expect(cloned).not.to.be(obj);
    });

    it('array', function(){
      var obj = [1, 2, 3, '4'];
      var cloned = clone(obj);
      expect(cloned).to.eql(obj);
      expect(cloned).not.to.be(obj);
    });

    describe('object', function () {
      it('it should have the same value but different identity', function(){
        var obj = {
          a: 1,
          b: 2,
          c: 3
        };
        var cloned = clone(obj);
        expect(cloned).to.eql(obj);
        expect(cloned).not.to.be(obj);
      });
      
      it('should preserve prototype chains', function () {
        function O(){ this.value = new C }
        function C(){ this.value = 1 }
        var o = new O;
        var cloned = clone(o);
        expect(cloned).to.eql(o);
        expect(cloned instanceof O).to.be(true);
        expect(cloned.value instanceof C).to.be(true);
      });
    })

    if (typeof window != 'undefined') {
      it('element', function () {
        var div = document.createElement('div');
        expect(clone(div).outerHTML).to.eql('<div></div>');
      });
    }

    it('object combined', function(){
      var date = new Date;
      var obj = {
        a: {
          b: [1, 2, date, { hello: 'world' }]
        }
      };
      var cloned = clone(obj);
      expect(cloned).to.eql(obj);
      expect(cloned.a).not.to.be(obj.a);
      expect(cloned.a.b).not.to.be(obj.a.b);
      expect(cloned.a.b[2]).not.to.be(obj.a.b[2]);
      expect(cloned.a.b[2].getTime()).to.be(obj.a.b[2].getTime());
      expect(cloned.a.b[3]).to.eql(obj.a.b[3]);
      expect(cloned.a.b[3]).not.to.be(obj.a.b[3]);
    });
  }
}

describe('acyclic', function(){

  describe('clone', test(clone))

  describe('clone.self()', function(){
    it('should be completly unique', function(){
      var c = clone.self();
      expect(c).not.to.be(clone);
      for (var k in clone) if (k != 'self') {
        expect(c).to.have.property(k);
        expect(c[k]).not.to.be(clone[k]);
      }
    })

    test(clone.self())();
  })
})

describe('cyclic', function(){
  var data = {
    array: [1,2,3],
    date: new Date,
    string: 'string',
    number: 1,
    bool: true,
    function: function(){}
  }
  var pair = clone(data);
  data.pair = pair;
  pair.data = data;
  
  it('should have no problems', function(){
    var b = clone(data);
    expect(b.array).to.eql(data.array);
    expect(b.pair.data).to.be(b);
  })
})
