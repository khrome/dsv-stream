var strangler = require('strangler');
var options = require('dsv-delimiter-configurations');
module.exports = {
    DSV : function(){
        return new strangler.StreamDecomposer(options.DSV);
    },
    CSV : function(){
        return new strangler.StreamDecomposer(options.CSV);
    },
    TSV : function(){
        return new strangler.StreamDecomposer(options.TSV);
    },
    SSV : function(){
        return new strangler.StreamDecomposer(options.SSV);
    },
    rowToObject : function(row, headers){
        var result = {};
        headers.forEach(function(fieldName, index){
            result[fieldName] = row[index] || null;
        })
        return result;
    },
    options : options
};
