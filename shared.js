function Base() {
  var self = this;

  self.className = ko.observable('');
  self.arrVarName = ko.observable();
  self.indent = ko.observable(0);
  self.declaration = ko.observable('var');
  self.delim = ko.observable(',');
}
