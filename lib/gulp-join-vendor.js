'use strict';

var through = require('through2');
var path = require('path');
var File = require('vinyl');

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
    const css = [];
    const js = [];

    function bufferContents(file, enc, cb) {
        if (file.isNull()) {
            return callback(null, file);
        }

        const content = file.contents.toString('utf8');
        const rgx = /\/\/\s?@vendor\:\s?["'](.*)["']/gm;
        const files = content.match(rgx);

        if (files) {
            for (let i = 0; i < files.length; i++) {
                const cur = files[i].replace(rgx, '$1');
                const isCSS = cur.match(/\.(css)$/g);
                const isJS = cur.match(/\.(js)$/g);

                if (isJS && !js.includes(`//=require ${cur}`)) {
                    js.push(`//=require ${cur}`);
                } else if (isCSS && !css.includes(`/*=include ${cur} */`)) {
                    css.push(`/*=include ${cur} */`);
                }
            }
        }

        cb();
    }

    function endStream(cb) {
        this.push(createFile(`${file}.scss`, css));
        this.push(createFile(`${file}.js`, js));

        cb();
    }

    return through.obj(bufferContents, endStream);
};