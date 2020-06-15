const fs = require('fs'),
  path = require('path'),
  basename = path.basename(__filename);

const libs = {};

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const lib = require(path.join(__dirname, file));
    libs[lib.name] = lib;
  });

module.exports = libs;