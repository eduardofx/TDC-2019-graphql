const del = require('del')
const {dest, src, series, watch } = require('gulp');
const ts = require('gulp-typescript')

const tsProject = ts.createProject('tsconfig.json');

const scripts = async () => {
    const tsResult = await tsProject.src()
        .pipe(tsProject());
    return tsResult.js
        .pipe(dest('dist'))
}

const static = async () => {
    return await src(['src/**/*.json']).pipe(dest('dist'));
}

const clean = async () => {
    return await del('dist')
}

const Watch = async () => {
    return watch(['src/**/*.ts','src/**/*.json'], series(clean,static,scripts))
}
//export default build = series(clean,static,scripts)
exports.default = Watch


