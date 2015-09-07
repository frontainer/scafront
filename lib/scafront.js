var inquirer = require('inquirer'),
    fs = require('fs-extra'),
    ejs = require('ejs'),
    _ = require('lodash');

function Scafront() {
    this.queue = [];
}
Scafront.prototype = {
    /**
     * プロンプトを追加する
     * @param inquiry inquirerオプション
     * @returns {Scaf}
     */
    prompt: function(inquiry) {
        this.queue.push(function() {
            var promise = new Promise(function(resolve,reject) {
                inquirer.prompt(inquiry, function( answers ) {
                    resolve(answers);
                }, function(e) {
                    reject(e);
                });
            });
            return promise;
        });
        return this;
    },

    /**
     * キューをクリアする
     * @returns {Scaf}
     */
    clear: function() {
        this.queue = [];
        return this;
    },
    /**
     * プロンプトを実行する
     * @param callback コールバック関数
     * @returns {Promise}
     */
    exec: function(callback) {
        var self = this;

        var promise = new Promise(function(resolve, reject) {
            var index = 0;
            var result = {};
            function _do(q) {
                q().then(function(res) {
                    _.merge(result,res);
                    ++index;
                    if (index === self.queue.length) {
                        if (callback) {
                            callback(result);
                        }
                        return resolve(result);
                    }
                    _do(self.queue[index]);
                }, function(res) {
                    reject(res);
                });
            }
            _do(self.queue[index]);
        });
        return promise;
    },
    /**
     * ファイルの作成
     * @param input テンプレートパス
     * @param output 出力パス
     * @param data テンプレートに渡すパラメータ
     * @returns {Promise}
     */
    generate: function(input, output, data) {
        data = data || {};
        var self = this;
        return new Promise(function(resolve,reject) {
            fs.readFile(input, function(err,file) {
                if (err) reject(err);
                var rendered = self.parse(file.toString(), data);
                fs.outputFile(output, rendered, function(err) {
                    if (err) reject(err);
                    resolve('generated: ' + output);
                });
            });
        });
    },
    /**
     * EJSでパースする
     * @param template
     * @param params
     */
    parse: function(template,params) {
        return ejs.render(template, params);
    },
    /**
     * 指定したファイルに追記する
     * @param input ファイルパス
     * @param str 追記するテキスト
     * @param [regexp] 挿入位置の正規表現
     * @returns {Promise}
     */
    append: function(input, str, regexp) {
        if (!str) return;
        return new Promise(function(resolve,reject) {
            fs.readFile(input, function(err,file) {
                if (err) reject(err);
                var result = file.toString();
                if (regexp) {
                    var match = result.match(regexp);
                    if (match.length !== 0) {
                        var before = result.substr(0, match.index + match[0].length);
                        var after = result.substr(match.index + match[0].length);
                        result = before + str + after;
                    } else {
                        result += str;
                    }
                } else {
                    result += str;
                }
                fs.outputFile(input, result, function(err) {
                    if (err) reject(err);
                    resolve('appended: ' + str);
                });
            });
        });
    },
    /**
     * Promise.allのエイリアス
     * @param arr
     * @returns {Promise}
     */
    all: function(arr) {
        return Promise.all(arr);
    }
};

module.exports = Scafront;