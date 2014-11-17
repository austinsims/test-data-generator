
    $(document).ready(function() {

        function format(data) {
                function isDate(val) {
                    var d = new Date(val);
                    return !isNaN(d.valueOf());
                }

                // No special formatting for JavaScript keywords
                if (data == "null" || data == "true" || data == "false" || !isNaN(Number(data))) return data;

                // Leave quoted strings alone
                else if ( (data[0] == "\"" && data[data.length-1] == "\"") || (data[0] == "'" && data[data.length-1] == "'") ) return data;

                // Try to detect dates and write them as C# conversion statements
                else if (isDate(data)) return 'Convert.ToDateTime("' + data + '")';

                // Just wrap it up in quotes, escpae backslashes and hope it's supposed to be a string
                else return '"' + data.replace(/\\/, '\\\\') + '"';

        }

            function handle(e) {
                    var delim = $("#delim").val();
                    var className = $("#className").val();
                    var arrVarName = $("#arrVarName").val() || ('sample' + className + 's');
                    var indentNum = Number($("#indent").val()) || 0;
                    var indent = '';
                    for (var i=0; i<indentNum; i++) indent += ' ';

                    var output = '';

                    if (!className)
                            output = 'Please fill out class name above'
                    else {
                            var declaration = null;
                            var radioValue = $("input:radio[name='declaration']:checked").val();
                            if (radioValue == 'var') declaration = 'var';
                            else if (radioValue == 'field') declaration = 'private readonly ' + className + '[]';

                            var arrayIndices = $("input:checkbox[name='arrayIndices']").is(':checked');

                            var lines = $('textarea.input').val().split('\n');
                            var header = null;

                            output += indent +  declaration + ' ' + arrVarName + ' = new[] {\n';

                            for (var i = 0; i < lines.length; i++) {
                                    if (i == 0)
                                            header = lines[i].split(delim);
                                    else {
                                            var cells = lines[i].split(delim);
                                            if (cells.length == 1 && cells[0] == '') continue;
                                            if (i > 1)
                                                    output += ',\n\n';

                                        if (arrayIndices)
                                            output += indent +  '   ' +
                                                ' // ' + String(i-1) + '\n';

                                            output += indent +  '    new ' + className + '() {\n';
                                            for (var j=0; j < header.length; j++) {
                                                    var value = (typeof cells[j] == 'undefined' || cells[j] == '' ? 'null' : format(cells[j]));
                                                    output += indent +  '        ' + header[j].trim() + ' = ' + value.trim() + (j == header.length-1 ? '' : ',') + '\n';
                                            }
                                            output += indent +  '    }';
                                    }
                            }

                            output += '\n' + indent + '};\n';
                    }

                    $('textarea.output').val(output);
            }

            $('textarea, input, :radio, select').on('input propertychange click', handle);
            $('textarea.output').on('click', function(e) { $(e.target).select(); });
    });
