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
  // up in quotes, escpae backslashes and hope it's supposed to be a string
  else return '"' + value.replace(/\\/, '\\\\') + '"';
}

function Base() {
  var self = this;

  self.className = ko.observable('');
  self.arrVarName = ko.observable();
  self.indent = ko.observable(0);
  self.declaration = ko.observable('var');
  self.delim = ko.observable(',');
}
