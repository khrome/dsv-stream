dsv-stream
==========
I had to parse some 10GB+ CSVs recently and after trying library after library I wound up Having to build my own solution, but it relied on the fact that no line delimiters appeared in quoted text. I also maintain a quote aware delimeter function, so I rebuilt that as [a stream parser](https://www.npmjs.com/package/strangler#stranglerstreamdecomposer), Then built this DSV/CSV/TSV/SSV parsing library.

Installation
------------

    npm install dsv-stream

Usage
-----
Here's a simple example (that ignores the benefits of streaming):

```js
    var dsv = require('dsv-stream');
    var stream = fs.createReadStream('data.csv');
    var decomposer = new dsv.CSV();
    var rows = [];
    var headers;
    decomposer.on('row', function(row){
        if(!headers) headers = row;
        else rows.push(dsv.rowToObject(row, headers));
    });
    decomposer.on('complete', function(){
        // do something with `rows`
    });
    stream.pipe(decomposer.writer());
```

Testing
-------
Just run:

    mocha

Enjoy,
- Abbey Hawk Sparrow
