const glob = require('glob');
const path = require('path');
const fs = require('fs');
const filter = require('gulp-filter');

const getComponentsInUse = () => {
    const components = [];
    const files = glob.sync('src/app/**/*.html', null);
    const tagRgx = /[<\s](ui-[a-zA-Z\-]+|layout-[a-zA-Z\-]+)/gm;

    for (let x = 0, len = files.length; x < len; x += 1) {
        const file = fs.readFileSync(path.join(__dirname, '..', files[x])).toString('utf8');
        const matches = file.match(tagRgx);

        if (matches) {
            for (let i = 0; i < matches.length; i += 1) {
                const name = matches[i].replace(tagRgx, '$1');
                const componentName = name.split('--')[0];

                if (!components.includes(componentName)) {
                    components.push(componentName);
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
            return components.includes(`ui-${name}`) || components.includes(`layout-${name}`);
        }


        return true;
    });
}