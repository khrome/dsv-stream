var strangler = require('strangler');
var options = {
    DSV : {
        delimiter : String.fromCharCode(31),
        terminator : String.fromCharCode(30),
        escape : String.fromCharCode(27)
    },
    CSV : {
        delimiter : ',',
        terminator : "\n",
        escape : '\\'
    },
    TSV : {
        delimiter : "\t",
        terminator : "\n",
        escape : '\\'
    },
    SSV : {
        delimiter : ' ',
        terminator : "\n",
        escape : '\\'
    }
}
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
