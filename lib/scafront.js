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
     * 指定したファイルのマッチした部分の後に追記する
     * @param input ファイルパス
     * @param str 追記するテキスト
     * @param [regexp] 挿入位置の正規表現
     * @returns {Promise}
     */
    append: function(input, str, regexp) {
        return this._append(input,str,regexp,true);
    },
    /**
     * 指定したファイルのマッチした部分の前に追記する
     * @param input ファイルパス
     * @param str 追記するテキスト
     * @param [regexp] 挿入位置の正規表現
     * @returns {Promise}
     */
    prepend: function(input, str, regexp) {
        return this._append(input,str,regexp,false);
    },

    /**
     * ファイルにテキストを追記する
     * @param input
     * @param str
     * @param regexp
     * @param isAppending
     * @returns {*}
     * @private
     */
    _append: function(input, str, regexp, isAppending) {
        var self = this;
        return this.readFile(input).then(function(file) {
            var result = file.toString();
            if (regexp) {
                var match = result.match(regexp);
                if (match.length !== 0) {
                    var length = isAppending ? match[0].length : 0;
                    result = self.appendText(result,str,match.index+length);
                } else {
                    result += str;
                }
            } else {
                result += str;
            }
            return new Promise(function(resolve,reject) {
                fs.outputFile(input, result, function(err) {
                    if (err) reject(err);
                    resolve('appended: ' + str);
                });
            });
        });
    },

    /**
     * base文字列の指定したindexにstrを差し込む
     * @param base
     * @param str
     * @param index
     * @returns {string}
     */
    appendText: function(base,str,index) {
        var before = base.substr(0, index);
        var after = base.substr(index);
        return before + str + after;
    },

    /**
     * 外部ファイルの読み込み
     * @param input
     * @returns {Promise}
     */
    readFile: function(input) {
        return new Promise(function (resolve, reject) {
            fs.readFile(input, function (err, file) {
                if (err) return reject(err);
                resolve(file);
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