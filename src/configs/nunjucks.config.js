const nunjucks = require('nunjucks');
const env = require('./base.config');
nunjucks.configure(env.nunjucksTemplatePath, {autoescape: false});

module.exports = nunjucks;
