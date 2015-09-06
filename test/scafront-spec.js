var Scaf = require('../index');
var assert = require('power-assert');

describe('Scaf', function() {
    var scaf;
    beforeEach(function() {
        scaf = new Scaf();
    });

    it('init', function() {
        assert(scaf.queue instanceof Array);
    });
    it('prompt', function() {
        assert(scaf.prompt({}) === scaf);
        assert(scaf.queue.length === 1);
        var p = scaf.queue[0]();
        assert(p instanceof Promise);
    });
    it('prompt', function() {
        assert(scaf.prompt({}) === scaf);
        var p = scaf.exec();
        assert(p instanceof Promise);
    });
    it('clear', function() {
        assert(scaf.prompt({}) === scaf);
        assert(scaf.queue.length === 1);
        scaf.clear();
        assert(scaf.queue.length === 0);
    });
    it('generate', function() {
        assert(scaf.generate('../demo/template/sample.ejs','../demo/result/sample.js',{name:'test',type:'testType'}));
        assert(scaf.generate('../demo/template/sample.ejs','../demo/result/sample.js'));
    });
    it('append', function() {
        assert(scaf.append('../demo/result/sample.js','\n//appended text'));
        assert(scaf.append('../demo/result/sample.js') === undefined);
    });
    it('all', function() {
        assert(scaf.all([]) instanceof Promise);
    });
});