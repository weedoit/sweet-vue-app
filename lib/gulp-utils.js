const glob = require('glob');
const path = require('path');
const fs = require('fs');
const filter = require('gulp-filter');

module.exports.getModifiersInUse = () => {
    const modifiers = [];
    const files = glob.sync('src/app/**/*.html', null);
    const tagRgx = /[\s](ui-[a-zA-Z\-]+--[a-z\-]+)="([a-zA-Z0-9\-]+)"?/gm;

    for (let x = 0, len = files.length; x < len; x += 1) {
        const file = fs.readFileSync(path.join(__dirname, '..', files[x])).toString('utf8');
        const matches = file.match(tagRgx);

        if (matches) {
            for (let i = 0; i < matches.length; i += 1) {
                const name = matches[i].replace(tagRgx, '$1-$2');

                if (!modifiers.includes(name)) {
                    modifiers.push(name);
                }
            }
        }
    }

    return modifiers;
}