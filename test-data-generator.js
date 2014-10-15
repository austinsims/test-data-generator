var lineReader = require('line-reader');

var firstLine = true;
var header = null;

var fileName = process.argv[2];
var className = process.argv[3];

if (!fileName || !className) {
    console.error('Usage: node test-data-generator.js <csv-path> <class-name>');
}

function formatData(data) {
    if (data == "null" || Number(data)) return data;
    else return '"' + data + '"';
}



lineReader.eachLine(fileName, function(line, last) {
    if (firstLine) {
	header = line.replace('\n','').split(',');
	firstLine = false;
    } else {
	console.log('new ' + className + '() {');
	var row = line.split(',');
	for (var i=0; i < header.length; i++) {
	    console.log('    ' + header[i].trim() + ' = ' + formatData(row[i].trim()) + (i == header.length-1 ? '' : ','));
	}
	console.log('},');
	console.log();
    }
});


