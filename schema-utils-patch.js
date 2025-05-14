
// Schema utils replacement that skips validation
exports.validate = function(schema, data) { return data; };
exports.validateOptions = function(schema, data) { return data; };
exports.default = exports.validate;
module.exports = exports;
