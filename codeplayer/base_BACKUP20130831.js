$(document).ready(function () {

  //for using the test array (comment below line for new file)
  //arr = arr2;

  //editor currently in focus
  var focusedEditor;

  //keep track of array index
  var arrIndex = 0;

  //get length from beginning of doc to caret
  var lengthToCursor;

  //for determining if a cursor activity is mouse change of text being added/removed
  var cursorPurpose;

  //hold the current tab depth (in spaces)
  var htmlTabDepth = 0;
  var cssTabDepth = 0;
  var jsTabDepth = 0;

  //spaces to be add (represents tabs)
  var spacesToAdd = "";

  //method that enables inserting strings at a certain index
  String.prototype.insertAt = function(index, string) { 
    return this.substr(0, index) + string + this.substr(index);
  }

  //function that checks for whitespace
  function hasWhiteSpace(string)
  {
    return /\w/gi.test(string);
  }

  //all editors use the following notation for the keyevents (stored as a string): "[editor]: [@@command or character]|[char total count]|[cursor line number],[cursor char number]"
  var htmleditor = CodeMirror.fromTextArea(document.getElementById("htmlcode"), {
    mode: "text/html",
    lineNumbers: true,
    lineWrapping: true,
    smartIndent: false,
    tabSize: 2,
    indentWithTabs: true,
    showCursorWhenSelecting: true,
    theme: 'monokai',
    extraKeys: {
      Enter: function(cm) {
        spacesToAdd = "";
        if (htmlTabDepth != 0)
        {
          for (var h = 1; h <= htmlTabDepth; h++) {
            spacesToAdd += " ";
            if (h % 2 == 0)
            {
              arr[arrIndex] = "htmleditor: @@tab|" + (lengthToCursor + h);
              arrIndex++;
            }
          };
        }
        cm.replaceSelection("\n" + spacesToAdd, "end");
      },
      Tab: function(cm) {
        var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
        cm.replaceSelection(spaces, "end", "+input");
        if(!hasWhiteSpace(htmleditor.getLine(htmleditor.getCursor().line)))
        {
          htmlTabDepth += 2;
        }
      }
    },
    onKeyEvent: function(editor, event){
      event = $.event.fix(event);

      if(event.type == "keydown") {

        lengthToCursor = htmleditor.indexFromPos(htmleditor.getCursor());

        if (event.keyCode == 8)//backspace
        {
          arr[arrIndex] = "htmleditor: @@backspace|" + lengthToCursor;
            arrIndex++;
          if(!hasWhiteSpace(htmleditor.getLine(htmleditor.getCursor().line)) && htmleditor.getLine(htmleditor.getCursor().line).length % 2 == 1)
          {
            htmlTabDepth -= 2;
          }
        }
        else if (event.keyCode == 13)//enter key
        {
          arr[arrIndex] = "htmleditor: @@enter|" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 32)//tab key
        {
          arr[arrIndex] = "htmleditor: @@space|" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 9)//tab key
        {
          arr[arrIndex] = "htmleditor: @@tab|" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 37)//left arrow
        {
          arr[arrIndex] = "htmleditor: @@arrowLeft|" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 38)//up arrow
        {
          arr[arrIndex] = "htmleditor: @@arrowUp|" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 39)//right arrow
        {
          arr[arrIndex] = "htmleditor: @@arrowRight|" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 40)//down arrow
        {
          arr[arrIndex] = "htmleditor: @@arrowDown|" + lengthToCursor;
          arrIndex++;
        }
      }
      else if (event.type == "keypress")
      {
        if(event.keyCode != 32)
        {
          //event.which is used instead of event.keyCode as event.which can determine capital letter or not
          var charAdded = String.fromCharCode(event.which);

          arr[arrIndex] = "htmleditor: " + charAdded + "|" + lengthToCursor;
          arrIndex++;
          console.log(arr);
        }
      }
      cursorPurpose = htmleditor.getValue();
    }
  });

  //initialize css editor
  var csseditor = CodeMirror.fromTextArea(document.getElementById("csscode"), {
    mode: "css",
    lineNumbers: true,
    lineWrapping: true,
    smartIndent: false,
    tabSize: 2,
    indentWithTabs: true,
    showCursorWhenSelecting: true,
    theme: 'monokai',
    extraKeys: {
      Enter: function(cm) {
        spacesToAdd = "";
        if (cssTabDepth != 0)
        {
          for (var h = 1; h <= cssTabDepth; h++) {
            spacesToAdd += " ";
            if (h % 2 == 0)
            {
              arr[arrIndex] = "csseditor: @@tab|" + (lengthToCursor + h);
              arrIndex++;
            }
          };
        }
        cm.replaceSelection("\n" + spacesToAdd, "end");
      },
      Tab: function(cm) {
        var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
        cm.replaceSelection(spaces, "end", "+input");
        if(!hasWhiteSpace(csseditor.getLine(csseditor.getCursor().line)))
        {
          cssTabDepth += 2;
        }
      }
    },
    onKeyEvent: function(editor, event){
      event = $.event.fix(event);

      if(event.type == "keydown") {

        lengthToCursor = csseditor.indexFromPos(csseditor.getCursor());

        if (event.keyCode == 8)//backspace
        {
          arr[arrIndex] = "csseditor: @@backspace|" + lengthToCursor;
            arrIndex++;
          if(!hasWhiteSpace(csseditor.getLine(csseditor.getCursor().line)) && csseditor.getLine(csseditor.getCursor().line).length % 2 == 1)
          {
            cssTabDepth -= 2;
          }
        }
        else if (event.keyCode == 13)//enter key
        {
          arr[arrIndex] = "csseditor: @@enter|" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 32)//tab key
        {
          arr[arrIndex] = "csseditor: @@space|" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 9)//tab key
        {
          arr[arrIndex] = "csseditor: @@tab|" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 37)//left arrow
        {
          arr[arrIndex] = "csseditor: @@arrowLeft|" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 38)//up arrow
        {
          arr[arrIndex] = "csseditor: @@arrowUp|" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 39)//right arrow
        {
          arr[arrIndex] = "csseditor: @@arrowRight|" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 40)//down arrow
        {
          arr[arrIndex] = "csseditor: @@arrowDown|" + lengthToCursor;
          arrIndex++;
        }
      }
      else if (event.type == "keypress")
      {
        if(event.keyCode != 32)
        {
          //event.which is used instead of event.keyCode as event.which can determine capital letter or not
          var charAdded = String.fromCharCode(event.which);

          arr[arrIndex] = "csseditor: " + charAdded + "|" + lengthToCursor;
          arrIndex++;
          console.log(arr);
        }
      }
      cursorPurpose = csseditor.getValue();
    }
  });

  //initialize js editor
  var jseditor = CodeMirror.fromTextArea(document.getElementById("jscode"), {
    mode: "javascript",
    lineNumbers: true,
    lineWrapping: true,
    smartIndent: false,
    tabSize: 2,
    indentWithTabs: true,
    showCursorWhenSelecting: true,
    theme: 'monokai',
    extraKeys: {
      Enter: function(cm) {
        spacesToAdd = "";
        if (jsTabDepth != 0)
        {
          for (var h = 1; h <= jsTabDepth; h++) {
            spacesToAdd += " ";
            if (h % 2 == 0)
            {
              arr[arrIndex] = "jseditor: @@tab|" + (lengthToCursor + h);
              arrIndex++;
            }
          };
        }
        cm.replaceSelection("\n" + spacesToAdd, "end");
      },
      Tab: function(cm) {
        var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
        cm.replaceSelection(spaces, "end", "+input");
        if(!hasWhiteSpace(jseditor.getLine(jseditor.getCursor().line)))
        {
          jsTabDepth += 2;
        }
      }
    },
    onKeyEvent: function(editor, event){
      event = $.event.fix(event);

      if(event.type == "keydown") {

        lengthToCursor = jseditor.indexFromPos(jseditor.getCursor());

        if (event.keyCode == 8)//backspace
        {
          arr[arrIndex] = "jseditor: @@backspace|" + lengthToCursor;
            arrIndex++;
          if(!hasWhiteSpace(jseditor.getLine(jseditor.getCursor().line)) && jseditor.getLine(jseditor.getCursor().line).length % 2 == 1)
          {
            jsTabDepth -= 2;
          }
        }
        else if (event.keyCode == 13)//enter key
        {
          arr[arrIndex] = "jseditor: @@enter|" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 32)//tab key
        {
          arr[arrIndex] = "jseditor: @@space|" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 9)//tab key
        {
          arr[arrIndex] = "jseditor: @@tab|" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 37)//left arrow
        {
          arr[arrIndex] = "jseditor: @@arrowLeft|" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 38)//up arrow
        {
          arr[arrIndex] = "jseditor: @@arrowUp|" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 39)//right arrow
        {
          arr[arrIndex] = "jseditor: @@arrowRight|" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 40)//down arrow
        {
          arr[arrIndex] = "jseditor: @@arrowDown|" + lengthToCursor;
          arrIndex++;
        }
      }
      else if (event.type == "keypress")
      {
        if(event.keyCode != 32)
        {
          //event.which is used instead of event.keyCode as event.which can determine capital letter or not
          var charAdded = String.fromCharCode(event.which);

          arr[arrIndex] = "jseditor: " + charAdded + "|" + lengthToCursor;
          arrIndex++;
          console.log(arr);
        }
      }
      cursorPurpose = jseditor.getValue();
    }
  });

  //quick reset since we are using a textarea instead of div
  htmleditor.setValue("");
  csseditor.setValue("");
  jseditor.setValue("");

  //used for the delayed liveconnect style update of iframe
  var delay;

  //sends editor code changes to iframe and updates the iframe
  htmleditor.on("change", function() {
    clearTimeout(delay);
    delay = setTimeout(updatePreview, 300);
  });

  csseditor.on("change", function() {
    clearTimeout(delay);
    delay = setTimeout(updatePreview, 300);
  });

  jseditor.on("change", function() {
    clearTimeout(delay);
    delay = setTimeout(updatePreview, 300);
  });

  //used for selecting the editor that is in focus
  htmleditor.on("focus", function() {
    focusedEditor = htmleditor;
  });

  csseditor.on("focus", function() {
    focusedEditor = csseditor;
  });

  jseditor.on("focus", function() {
    focusedEditor = jseditor;
  });

  //used to determine if the cursor activity is caused by mouse or not
  htmleditor.on("cursorActivity", function() {
    lengthToCursor = htmleditor.indexFromPos(htmleditor.getCursor());

    if(htmleditor.getValue() == cursorPurpose && arr[arrIndex-1].indexOf("@@arrow") == -1)
    {
      arr[arrIndex] = "htmleditor: @@mouseChange|" + lengthToCursor;
      arrIndex++;
    }
  });

  csseditor.on("cursorActivity", function() {
    lengthToCursor = htmleditor.indexFromPos(htmleditor.getCursor());

    if(csseditor.getValue() == cursorPurpose && arr[arrIndex-1].indexOf("@@arrow") == -1)
    {
      arr[arrIndex] = "csseditor: @@mouseChange|" + lengthToCursor;
      arrIndex++;
    }
  });

  jseditor.on("cursorActivity", function() {
    lengthToCursor = htmleditor.indexFromPos(htmleditor.getCursor());

    if(jseditor.getValue() == cursorPurpose && arr[arrIndex-1].indexOf("@@arrow") == -1)
    {
      arr[arrIndex] = "jseditor: @@mouseChange|" + lengthToCursor;
      arrIndex++;
    }
  });

  //typewriter syle effect
  $("#generateCode").on("click", function() {
    //another reset just to make sure
    htmleditor.setValue("");
    csseditor.setValue("");
    jseditor.setValue("");

    //reiterate the command storing array
    for (var i = 0; i < arr.length; i++) {
      (function(i){
        //puts short pause in between each item of the array
        setTimeout(function(){
          var targetEditor = arr[i].split(": ")[0];
          var arg = arr[i].split(": ")[1];
          //for printing out commands to be copied to file (TODO: write commands to file directly| possible solution: test cursor distance and append)
          console.log("arr[" + i + "] = " + arr[i]);
          //determine if @@command or char
          if (arg.indexOf("@@") != -1)
          {
            if (targetEditor == "htmleditor")
            {
              if (arg.indexOf("@@enter") != -1)
              {
                var charInsert = parseInt(arg.split("|")[1]);
                var row = htmleditor.posFromIndex(charInsert).line;
                var col = htmleditor.posFromIndex(charInsert).ch + 1;
                htmleditor.setValue(htmleditor.getValue().insertAt(charInsert, "\n"));
                htmleditor.setCursor({line: row , ch: col });
                htmleditor.focus();

              }
              else if (arg.indexOf("@@backspace") != -1)
              {
                var charReplace = parseInt(arg.split("|")[1])-1;
                var row = htmleditor.posFromIndex(charReplace).line;
                var col = htmleditor.posFromIndex(charReplace).ch;
                var cursorPos = arg.split("|")[2];
                htmleditor.setValue(htmleditor.getValue().slice(0,charReplace) + htmleditor.getValue().slice((charReplace+1), htmleditor.getValue().length));
                htmleditor.focus();
                htmleditor.setCursor({line: row , ch: col });
              }
              else if (arg.indexOf("@@space") != -1)
              {
                var charInsert = parseInt(arg.split("|")[1]);
                var row = htmleditor.posFromIndex(charInsert).line;
                var col = htmleditor.posFromIndex(charInsert).ch + 1;
                htmleditor.setValue(htmleditor.getValue().insertAt(charInsert, " "));
                htmleditor.focus();
                htmleditor.setCursor({line: row , ch: col });
              }
              else if (arg.indexOf("@@tab") != -1)
              {
                var charInsert = parseInt(arg.split("|")[1]);
                var row = htmleditor.posFromIndex(charInsert).line;
                var col = htmleditor.posFromIndex(charInsert).ch + 1;
                htmleditor.setValue(htmleditor.getValue().insertAt(charInsert, "  "));
                htmleditor.focus();
                htmleditor.setCursor({line: row , ch: col });
              }
              else if (arg.indexOf("@@arrow") != -1)
              {
                var charInsert = parseInt(arg.split("|")[1]);
                var row = htmleditor.posFromIndex(charInsert).line;
                var col = htmleditor.posFromIndex(charInsert).ch;
                htmleditor.focus();
                htmleditor.setCursor({line: row , ch: col });
              }
              else if (arg.indexOf("@@mouseChange") != -1)
              {
                var charInsert = parseInt(arg.split("|")[1]);
                var row = htmleditor.posFromIndex(charInsert).line;
                var col = htmleditor.posFromIndex(charInsert).ch;
                htmleditor.focus();
                htmleditor.setCursor({line: row , ch: col });
              }
            }
            else  if (targetEditor == "csseditor")
            {
              if (arg.indexOf("@@enter") != -1)
              {
                var charInsert = parseInt(arg.split("|")[1]);
                var row = csseditor.posFromIndex(charInsert).line;
                var col = csseditor.posFromIndex(charInsert).ch;
                csseditor.setValue(csseditor.getValue().insertAt(charInsert, "\n"));
                csseditor.setCursor({line: row , ch: col });
                csseditor.focus();
              }
              else if (arg.indexOf("@@backspace") != -1)
              {
                var charReplace = parseInt(arg.split("|")[1])-1;
                var row = csseditor.posFromIndex(charReplace).line;
                var col = csseditor.posFromIndex(charReplace).ch;
                var cursorPos = arg.split("|")[2];
                csseditor.setValue(csseditor.getValue().slice(0,charReplace) + csseditor.getValue().slice((charReplace+1), csseditor.getValue().length));
                csseditor.focus();
                csseditor.setCursor({line: row , ch: col });
              }
              else if (arg.indexOf("@@space") != -1)
              {
                var charInsert = parseInt(arg.split("|")[1]);
                var row = csseditor.posFromIndex(charInsert).line;
                var col = csseditor.posFromIndex(charInsert).ch + 1;
                csseditor.setValue(csseditor.getValue().insertAt(charInsert, " "));
                csseditor.focus();
                csseditor.setCursor({line: row , ch: col });
              }
              else if (arg.indexOf("@@tab") != -1)
              {
                var charInsert = parseInt(arg.split("|")[1]);
                var row = csseditor.posFromIndex(charInsert).line;
                var col = csseditor.posFromIndex(charInsert).ch + 1;
                csseditor.setValue(csseditor.getValue().insertAt(charInsert, "  "));
                csseditor.focus();
                csseditor.setCursor({line: row , ch: col });
              }
              else if (arg.indexOf("@@arrow") != -1)
              {
                var charInsert = parseInt(arg.split("|")[1]);
                var row = csseditor.posFromIndex(charInsert).line;
                var col = csseditor.posFromIndex(charInsert).ch;
                csseditor.focus();
                csseditor.setCursor({line: row , ch: col });
              }
              else if (arg.indexOf("@@mouseChange") != -1)
              {
                var charInsert = parseInt(arg.split("|")[1]);
                var row = csseditor.posFromIndex(charInsert).line;
                var col = csseditor.posFromIndex(charInsert).ch;
                csseditor.focus();
                csseditor.setCursor({line: row , ch: col });
              }
            }
            else  if (targetEditor == "jseditor")
            {
              if (arg.indexOf("@@enter") != -1)
              {
                var charInsert = parseInt(arg.split("|")[1]);
                var row = jseditor.posFromIndex(charInsert).line;
                var col = jseditor.posFromIndex(charInsert).ch;
                jseditor.setValue(jseditor.getValue().insertAt(charInsert, "\n"));
                jseditor.setCursor({line: row , ch: col });
                jseditor.focus();
              }
              else if (arg.indexOf("@@backspace") != -1)
              {
                var charReplace = parseInt(arg.split("|")[1])-1;
                var row = jseditor.posFromIndex(charReplace).line;
                var col = jseditor.posFromIndex(charReplace).ch;
                var cursorPos = arg.split("|")[2];
                jseditor.setValue(jseditor.getValue().slice(0,charReplace) + jseditor.getValue().slice((charReplace+1), jseditor.getValue().length));
                jseditor.focus();
                jseditor.setCursor({line: row , ch: col });
              }
              else if (arg.indexOf("@@space") != -1)
              {
                var charInsert = parseInt(arg.split("|")[1]);
                var row = jseditor.posFromIndex(charInsert).line;
                var col = jseditor.posFromIndex(charInsert).ch + 1;
                jseditor.setValue(jseditor.getValue().insertAt(charInsert, " "));
                jseditor.focus();
                jseditor.setCursor({line: row , ch: col });
              }
              else if (arg.indexOf("@@tab") != -1)
              {
                var charInsert = parseInt(arg.split("|")[1]);
                var row = jseditor.posFromIndex(charInsert).line;
                var col = jseditor.posFromIndex(charInsert).ch + 1;
                jseditor.setValue(jseditor.getValue().insertAt(charInsert, "  "));
                jseditor.focus();
                jseditor.setCursor({line: row , ch: col });
              }
              else if (arg.indexOf("@@arrow") != -1)
              {
                var charInsert = parseInt(arg.split("|")[1]);
                var row = jseditor.posFromIndex(charInsert).line;
                var col = jseditor.posFromIndex(charInsert).ch;
                jseditor.focus();
                jseditor.setCursor({line: row , ch: col });
              }
              else if (arg.indexOf("@@mouseChange") != -1)
              {
                var charInsert = parseInt(arg.split("|")[1]);
                var row = jseditor.posFromIndex(charInsert).line;
                var col = jseditor.posFromIndex(charInsert).ch;
                jseditor.focus();
                jseditor.setCursor({line: row , ch: col });
              }
            }
          }
          else
          {
            if (targetEditor == "htmleditor")
            {
              var charInsert = parseInt(arg.split("|")[1]);
              var row = htmleditor.posFromIndex(charInsert).line;
              var col = htmleditor.posFromIndex(charInsert).ch + 1;
              htmleditor.setValue(htmleditor.getValue().insertAt(charInsert, arg.split("|")[0]));
              htmleditor.focus();
              htmleditor.setCursor({line: row , ch: col });
            }
            if (targetEditor == "csseditor")
            {
              var charInsert = parseInt(arg.split("|")[1]);
              var row = csseditor.posFromIndex(charInsert).line;
              var col = csseditor.posFromIndex(charInsert).ch + 1;
              csseditor.setValue(csseditor.getValue().insertAt(charInsert, arg.split("|")[0]));
              csseditor.focus();
              csseditor.setCursor({line: row , ch: col });
            }
            if (targetEditor == "jseditor")
            {
              var charInsert = parseInt(arg.split("|")[1]);
              var row = jseditor.posFromIndex(charInsert).line;
              var col = jseditor.posFromIndex(charInsert).ch + 1;
              jseditor.setValue(jseditor.getValue().insertAt(charInsert, arg.split("|")[0]));
              jseditor.focus();
              jseditor.setCursor({line: row , ch: col });
            }
          }
        //the delay that is added to each command (which is a multiple of i) (for default 50-60)
        }, 60 * i);
      }(i));  
    };
  });

  $("#buttonGenerate").on("click", function() {
    htmleditor.setValue('<html>\n  <head>\n    <title></title>\n    <script src=\"https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js\"></script>\n    <script>\n      window.jQuery || document.write(\'<script type=\"text/javascript\" src=\"jquery-1.10.2.js\"><\\/script><script type=\"text/javascript\" src=\"jquery-migrate-1.1.0.js\"><\\/script>\');\n    </script>\n  </head>\n  <body>\n    <div>hello.</div>\n  </body>\n</html>');
    csseditor.setValue("div {\n  background-color: #ff0000;\n  height: 400px;\n  font-size: 100pt;\n  text-align: center;\n  cursor: pointer;\n  display: none;\n}\n\n.blue {\n  background-color: #0000ff;\n  color: #ffffff;\n}");
    setTimeout(jsDelay_Demo, 300);
  });

  function updatePreview() {
    var previewFrame = document.getElementById('result');
    var preview = previewFrame.contentDocument || previewFrame.contentWindow.document;
    preview.open();
    preview.write(htmleditor.getValue());
    var style = document.createElement("style");
    style.innerHTML = csseditor.getValue();
    preview.getElementsByTagName('head')[0].appendChild(style);
    var script = document.createElement("script");
    script.innerHTML = jseditor.getValue();
    preview.getElementsByTagName('head')[0].appendChild(script);
    preview.close();
  }

  function jsDelay_Demo() {
    jseditor.setValue("$(document).ready(function () {\n  $(window).on(\"load\", function() {\n    $(\"div\").fadeIn(1000);\n  });\n\n  $(\"div\").on(\"mouseover\", function() {\n    $(\"div\").toggleClass(\"blue\");\n  });\n\n  $(\"div\").on(\"mouseout\", function() {\n    $(\"div\").toggleClass(\"blue\");\n  });\n});");
  }

  setTimeout(updatePreview, 300);
});