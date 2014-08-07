/**
 * Created by UAS on 07.08.2014.
 */

var argv = require('minimist')(process.argv.slice(2));
var config = require('./config');


if (argv.h || argv.help) {
    return console.log('Some help might be here');
}

if (!argv.launcher) {
    return console.log('Launcher is not defined. Use --launcher');
}

if (!argv.env) {
    return console.log('Environment vars for launcher is not defined. Use --env');
}


if (argv.launcher !== 'allInOneServer') {
    return console.log('Launcher "' + argv.launcher + '" is not supported');
}
if (!config[argv.launcher]) {
    return console.log('Launcher section is not found in config.js');
}
if (!config[argv.launcher][argv.env]) {
    return console.log('Environment for launcher is not is not found in config.js');
}

if (argv.launcher === 'allInOneServer') {
    var Launcher = require('./launchers-by-config/allInOneServer');
    var launcher = new Launcher(config[argv.launcher][argv.env]);
    launcher.start();
    return;
}