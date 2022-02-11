dsv-stream
==========
I had to parse some 10GB+ CSVs recently and after trying library after library I wound up Having to build my own solution, but it relied on the fact that no line delimiters appeared in quoted text. I also maintain a quote aware delimeter function, so I rebuilt that as [a stream parser](https://www.npmjs.com/package/strangler#stranglerstreamdecomposer), Then built this DSV/CSV/TSV/SSV parsing library.

Installation
------------

    npm install dsv-stream

Usage
-----
Here's a simple example that streams a CSV into a file as JSON, row by row:

```js
    var dsv = require('dsv-stream');
    var stream = fs.createReadStream('data.csv');
    var decomposer = new dsv.CSV();
    var headers;
    let outputFile = 'output.json'
    fs.appendFile(outputFile, '[', function (err) {
        if (err) throw err;
        decomposer.on('row', function(row){
            let trimmed = row.map((field) => field.trim());
            let first = true;
            if(!headers){
                headers = trimmed;
            }else{
                let json = JSON.stringify(dsv.rowToObject(trimmed, headers));
                if(first) first = false;
                else json = ','+json;
                fs.appendFile(outputFile, json, function (err){

                });
                rows.push(dsv.rowToObject(trimmed, headers));
            }
        });
        decomposer.on('complete', function(){
            fs.appendFile(outputFile, ']', function (err) {
                //done, array of objects in `outputFile`
            });
        });
        stream.pipe(decomposer.writer());
    });
```

Testing
-------
Just run:

    mocha

Enjoy,
- Abbey Hawk Sparrow
