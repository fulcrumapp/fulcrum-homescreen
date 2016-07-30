var fs = require('fs');

var template = fs.readFileSync('./template.html').toString();

var js = 'window.AppTemplate = ' + JSON.stringify(template) + ';';

fs.writeFileSync('./template.js', js);
