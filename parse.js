var debug = true;

var csharpDateUnformat = (function(){
    var pattern = /Convert\.ToDateTime\("([^"]*)"\)/;
    return function (value) {
        var ret = pattern.exec(value)
        // If pattern matches, return the value of the first match group
        return ret ? ret.slice(1,2) : null;
    }
})();

var singleQuotedStringPattern = /^'[^'*]'$/;
var doubleQuotedStringPattern = /^"[^"*]"$/;

// This is analogous to the format function in the test data generator
// It unformats the generated csharp code into generally human-readable values
function unformat(value) {
    if (!value)
        return 'null';
    else if (singleQuotedStringPattern.test(value))
        return value.replace(/'/g, '');
    else if (doubleQuotedStringPattern.test(value))
        return value.replace(/"/g, '');
    else if (value === 'true' || value === 'false')
        return value;
    else if (!isNaN(Number(value)))
        return value;
    else {
        var date = csharpDateUnformat(value);
        if (date) return date;
        else return value; // let's hope everything is alright and just return it as-is
    }
}

function tokenize(s) {
  return _.filter(s
    .replace(/\n/g, ' ')
    // TODO: why isn't this replacing all the commas... le sigh
    .replace(/,/g, ' , ')
    .split(/\s/),
    function(s) { return s != ''; });
}

var kvPattern = /[^,|\s]+/;

function Tokens(csharpCode) {
  var tokens = tokenize(csharpCode);

  this.die = function() {
    throw new Error("parsing error, unexpected token: " + tokens[0]);
  }

  this.eatString = function(food) {
    if (_.isString(food)) food = [food];
    while (food.length) {
      if (tokens[0] == food[0]) {
        tokens.shift();
        food.shift();
      }
      else this.die();
    }
  }

  this.peekPattern = function(pattern) {
    return pattern.test(tokens[0]);
  }

  this.peekString = function() {
    return tokens[0];
  }

  this.eatPattern = function(pattern) {
    if (this.peekPattern(pattern))
      return tokens.shift();
    else
      this.die();
  }

}


function Parser() {
  Base.call(this);

  var self = this;
  self.output = ko.observable('');

  // Debug mode
  if (typeof(debug) !== 'undefined' && debug) {
    this.className('Customer')
    this.arrVarName('sampleCustomers');
    this.indent(0);
    this.declaration('var');
    this.delim('\t');
    this.output('var sampleCustomers = new[] {\n    new Customer() {\n        CustomerId = 123456,\n        LastName = "Ortego",\n        FirstName = null,\n        Birthday = Convert.ToDateTime("1/2/14"),\n        LikesCheese = true\n    },\n\n    new Customer() {\n        CustomerId = 234234,\n        LastName = "Carter",\n        FirstName = "Sean",\n        Birthday = Convert.ToDateTime("1/2/14"),\n        LikesCheese = false\n    },\n\n    new Customer() {\n        CustomerId = 311311,\n        LastName = "Riley",\n        FirstName = "Terry",\n        Birthday = Convert.ToDateTime("1/2/14"),\n        LikesCheese = null\n    }\n};\n')
  }

  self.input = ko.computed(function() {
    function not(value) {
      if (_.isNumber(value)) return false; // zero is okay
      else return !value; // the others are strings
    }
    if (_.any([self.className(), self.arrVarName(), self.indent(), self.declaration(), self.delim()], not)) {
      return 'Please fill out the entire form above';
    }

    var tokens = new Tokens(self.output());

    var header = [];
    var body = [];
    try {
      // eat the declaration first. it's for breakfast
      tokens.eatString(tokenize(self.declaration()));
      tokens.eatString(self.arrVarName());
      tokens.eatString(['=', 'new[]', '{']);

      // eat all the instances. yummy
      while (tokens.peekString() != '};') {
        tokens.eatString('new');
        // TODO: Deal with... 'F()' or 'F ()' or just 'F'.
        // TODO: Right now only does F()
        tokens.eatString(self.className() + '()');

        tokens.eatString('{');
        var i = 0;
        var row = {};
        while (tokens.peekString() != '}') {

          // Eat all the tokens
          var key = tokens.eatPattern(kvPattern);
          tokens.eatString('=');
          var value = tokens.eatPattern(kvPattern);
          if (tokens.peekString() == ',')
            tokens.eatString(',');

          // Then digest them into useful energy for later

          // the order of the first instance determines the order for the csv
          if (!header[i])
            header[i] = key;
          row[key] = unformat(value);
          i++;
        }
        tokens.eatString('}');
        if (tokens.peekString() == ',') tokens.eatString(',');
        body.push(row);
      }

      // eat dinner
      tokens.eatString('};');

      // puke everything up in csv form
      return header.join(',') + '\n' +
      _.map(body, function(row) {
          return _.map(header, function(colName) { return row[colName]; }).join(',');
      }).join('\n');

  } catch (e) {
    return e.message;
  }

    return 'Test!';
  });

}

ko.applyBindings(new Parser());
