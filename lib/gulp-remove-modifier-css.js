'use strict';

const through = require('through2');
const path = require('path');
const File = require('vinyl');
const getModifiersInUse = require('./gulp-utils.js').getModifiersInUse;

const createFile = (name, arr) => {
    const file = new File(name);
    const content = arr.join('\n\n');
    file.contents = Buffer.from(content, 'utf8');
    file.path = path.join(__dirname, '..', name);
    return file;
}

// file can be a vinyl file object or a string
// when a string it will construct a new one
module.exports = function(file) {
    const modifiers = getModifiersInUse();

    function bufferContents(file, enc, cb) {
        if (file.isNull()) {
            return cb(null, file);
        }

        let contents = file.contents.toString();

        const rgx = /.*\/\/\s?@if-use-mod:([a-zA-Z0-9\-]+)/gm;
        const rgxBlock = /\/\/@if-use-mod-start:([a-zA-Z\-]*)\s*?\n(\s|.)*?\/\/@if-use-mod-end/gm;

        contents = contents.replace(rgx, function (original, modifier) {
            if (modifiers.indexOf(modifier) >= 0) {
                return original;
            } else {
                return '';
            }
        });

        contents = contents.replace(rgxBlock, function (original, modifier) {
            if (modifiers.indexOf(modifier) >= 0) {
                return original;
            } else {
                return '';
            }
        });

        file.contents = new Buffer.from(contents);
        return cb(null, file);
    }

    return through.obj(bufferContents);
};