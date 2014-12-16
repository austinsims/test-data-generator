ko.bindingHandlers.hidable = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var e = $(element);
        e.css('position', 'relative');
        closeButton = jQuery('<i class="fa fa-close" style="cursor: pointer; position: absolute; right: 5px; top: 5px"></i>');
        e.append(closeButton);
        e.wrap("<div id='wrapper'></div>");
        uncloseButton = jQuery('<i class="fa fa-question" style="position: absolute; right: 5px; top: 5px; cursor: pointer; display: none"></i>');
        $('#wrapper').append(uncloseButton);
        closeButton.click(function() {
            e.css('display', 'none');
            uncloseButton.css('display', 'block');
        });
        uncloseButton.click(function() {
            uncloseButton.css('display', 'none');
            e.css('display', 'block');
            closeButton.css('display', 'absolute');
        });
    }
}

function Base() {
  var self = this;

  self.className = ko.observable('');
  self.arrVarName = ko.observable();
  self.indent = ko.observable(0);
  self.declaration = ko.observable('var');
  self.delim = ko.observable(',');
}
