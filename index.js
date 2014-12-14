function format(value) {
  function isDate(val) {
    var d = new Date(val);
    return !isNaN(d.valueOf());
  }

  if (value == '') return 'null';

  // No special formatting for boolean literal values or numbers.
  else if (value == "null" || value == "true" || value == "false" || !isNaN(Number(value))) return value;

  // Leave already-quoted strings alone.
  else if (
    (value[0] == "\"" && value[value.length - 1] == "\"") || (value[0] == "'" && value[value.length - 1] == "'")
  ) return value;

  // Try to detect dates and write them as C# conversion statements
  else if (isDate(value)) return 'Convert.ToDateTime("' + value + '")';

  // If none of the above special cases are met... just wrap it
  // up in quotes, escape backslashes and hope it's supposed to be a string
  else return '"' + value.replace(/\\/, '\\\\') + '"';
}

function TestDataGenerator() {
  var self = this;
    Base.call(this);
    self.input = ko.observable('');

    self.output = ko.computed(function() {
        if (!self.className()) {
            return 'Please fill out class name above.';
        }

        var lines = self.input().split('\n');
        var header = lines[0].split(self.delim());
        var body = lines.slice(1);

        var objectList = _.chain(body)
            // Do not try to make objects out of empty lines.
            .filter(function(line) {
                return line != '';
            })
            // Split by the specified delimiter into an array of property values
            .map(function(line) {
                return line.split(self.delim());
            })
            .map(function(valueList) {
                // Change each prop. value into 'propName = value,'
                return _.map(valueList, function(value, index) {
                        if (header[index]) return '        ' + header[index] + ' = ' + format(value) + ',';
                    })
                    .join('\n') + '\n';
            })
            // Add the new keyword, class name and braces to each list of keys and values
            .map(function(objectBody) {
                return '    new ' + self.className() + '() {\n' + objectBody + '    },';
            })
            .value()
            .join('\n');

        // Add the type declaration, assignment operator, braces, etc.
        var testData = self.declaration() + ' '
            + (self.arrVarName() || 'sample' + self.className() + 's' ) + ' = new[] {\n'
            + objectList + '\n'
            + '};';

        // Prepend each line with the specified number of spaces.
        return _.map(testData.split('\n'), function(line) {
                return Array(Number(self.indent()) + 1).join(' ') + line;
            }).join('\n');

    });
}

ko.applyBindings(new TestDataGenerator());
