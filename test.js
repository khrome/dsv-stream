var dsv = require('./dsv.js');
var should = require("should");
var uuid = require("uuid");
var fs = require("fs");
var GeneratedDocument = require('./generated-document');

var seedList = [
    //'eee8a0ac-73ff-460f-8776-63c1bb764e59',
    '5c22fc68-beee-48e6-b4c4-618135e0565d',
    'b8f50027-cc8b-47f9-aabf-95529421f874',
    '442f686b-7bf4-42cf-80d3-f69f3c6fa8e2'
];

var runTests = function(type){
    describe('dsv-stream', function(){
        runTestsForType('CSV');
        runTestsForType('TSV');
        runTestsForType('SSV');
        runTestsForType('DSV');
        describe('can parse files', function(){
            it('parses NASA patents CSV', function(complete){
                var stream = fs.createReadStream('NASA_Patents.csv');
                var decomposer = new dsv.CSV();
                stream.pipe(decomposer.writer());
                var count = 0;
                var countWithCols = 0;
                decomposer.on('row', function(row){
                    if(row.data.length == 7) countWithCols++;
                    count++;
                });
                decomposer.on('complete', function(){
                    countWithCols.should.equal(1311);
                    count.should.equal(1312);
                    complete();
                });
            });
        })
    });
}

var runTestsForType = function(type){
    describe(type, function(){
        makeRandomFunctionTest(type);
        seedList.forEach(function(seed){
            makeRandomFunctionTest(type, seed);
        });
    });
}

var makeRandomFunctionTest = function(type, seed){
    var random = uuid.v4();
    var test = seed?
        'parses deterministic '+type+':'+seed:
        'parses a random '+type+':'+random;
    it(test, function(complete){
        var virtualCSV = new GeneratedDocument({
            counts : {rows : 100, cols : 10},
            type : type,
            seed : (seed || random)
        });
        var stream = virtualCSV.readableStream();
        stream.pause();
        var decomposer = new dsv[type]();
        var decomposedRows = [];
        var dataRows = [];
        decomposer.on('row', function(row){
            decomposedRows.push(row.data);
        });
        stream.on('row', function(row, data){
            dataRows.push(data);
        });
        var startTest = function(){
            setTimeout(function(){
                stream.pipe(decomposer.writer());
                stream.resume();
            }, 50);
        }
        var done = {};
        var checkComplete = function(){
            if(done.streaming && done.decomposing){
                decomposedRows.should.deepEqual(dataRows);
                complete();
            }
        };
        stream.on('done', function(){
            done.streaming = true;
            checkComplete();
        });
        decomposer.on('complete', function(parsed){
            done.decomposing = true;
            checkComplete();
        });
        startTest();
    });
}

runTests();
