// let htmlModulePath = '/app/templates/web';
const ROOT_PATH = process.cwd();
const PATHS = {
    // htmlModulePath: htmlModulePath,
    dist: ROOT_PATH + '/dist',
    build: ROOT_PATH + '/build',
    debugTemplates: ROOT_PATH + '/app-debug/templates/game.html',
    // module: ROOT_PATH + htmlModulePath,
    // skin: ROOT_PATH + htmlModulePath + '/skin'
};

module.exports = PATHS;