var Scaf = require('../index');
var scaf = new Scaf();
scaf
    .prompt({
        type: "list",
        name: "type",
        message: "Select file type",
        choices: ['page','service','factory','filter']
    })
    .prompt({
        type: "input",
        name: "name",
        message: "Enter file name",
        filter: function(val) {
            return val;
        },
        validate: function( value ) {
            if (!value) {
                return 'Require file name';
            }
            return true;
        }
    })
    .exec(function(result) {
        scaf.all([
            scaf.generate(__dirname+'/template/sample.ejs',__dirname+'/result/sample.js',result),
            scaf.append(__dirname+'/result/append.js','\n// append',/\/\/ ここから/),
            scaf.prepend(__dirname+'/result/prepend.js','// prepend\n',/\/\/ ここから/)
        ]).then(function(result) {
            console.log(result);
        });
    });