const glob = require('glob');
const path = require('path');
const fs = require('fs');
const filter = require('gulp-filter');

const getComponents = () => {
    const files = glob.sync('../src/app/components/**/*.js', null);

    return files
        .map(c => ([path.basename(path.dirname(c)), path.basename(c, '.js') ]))
        .filter(c => c[0] == c[1])
        .map(c => `ui-${c[0]}`);
}

const getComponentsInUse = () => {
    const components = ['ui-grid'];
    
    const files = glob.sync('src/app/**/*.html', null);
    const tagRgx = /<?(ui-[a-zA-Z\-]+)/gm;

    for (let x = 0, len = files.length; x < len; x += 1) {
        const file = fs.readFileSync(path.join(__dirname, '..', files[x])).toString('utf8');
        const matches = file.match(tagRgx);

        if (matches) {
            for (let i = 0; i < matches.length; i += 1) {
                const name = matches[i].replace(tagRgx, '$1');

                if (!components.includes(name)) {
                    components.push(name);
                }
            }
        }
    }

    return components;
}

module.exports = () => {
    const components = getComponentsInUse();

    return filter((file) => {
        if (file.path.indexOf('/app/components') > 0) {
            const name = path.basename(file.path, path.extname(file.path));
            const component = `ui-${name}`;
            return components.includes(component);
        }

        return true;
    });
}