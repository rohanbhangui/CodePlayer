/*
  ============================Change Log=============================

  - = finished item

  * = very important; top priority

  UPDATE = functionality is improved

  TODO = Things to be completed

  (COMPLETED) = TODO item has been completed and tested

  ----------------------------02/09/2013-----------------------------
  - UPDATE: fully functioning paste functionality added
  - TODO: add bracket autocompletion (COMPLETED | TODO: move off
          autobracketclose addon) (COMPLETED)
  - UPDATE: manual bracket autocompletion bugs fixed


  ----------------------------01/09/2013-----------------------------
  - UPDATE: selection functionality added (prevent arrow keys firing
            when using them for selection)
  - changed character that seperates cursor position from command/
    character
  - TODO: reaction of various keys to selection made (eg. delete
          selection when backspace is pressed | priority: pasting)
  - TODO: add copy, cut and paste functionality (hint: grab clipboard
          contents and write to array instead of detecting change in
          text)
  - UPDATE: basic copy and paste functionality added
  * TODO: get on-select-replace functionality
  * TODO: where when selectiong text the program freezes
  
  ----------------------------31/08/2013-----------------------------
  - replaced setValue method with replaceRange for better focus
    updating
  - TODO: add copy, cut and paste functionality (hint: grab clipboard
          contents and write to file)
  - TODO: add selection functionality

  ===================================================================
*/

//NOTE: some of the descriptions for the css and js editors might not be listed, please see the equivilent html editor for comments

$(document).ready(function () {

  //for using the test array (comment below line for new file)
  arr = arr3;

  //editor currently in focus
  var focusedEditor;

  //keep track of array index
  var arrIndex = 0;

  //get length from beginning of doc to caret
  var lengthToCursor;

  //used for grabing text that has been pasted
  var pastedTextStart;

  //for determining if a cursor activity is mouse change of text being added/removed
  var cursorPurpose;

  //hold the current tab depth (in spaces)
  var htmlTabDepth = 0;
  var cssTabDepth = 0;
  var jsTabDepth = 0;

  //spaces to be add (represents tabs)
  var spacesToAdd = "";

  //how fast characters appear on playback (time between chars in ms) (for default 50-60)
  var typeSpeed = 50;

  //function that checks for whitespace (used for tabbing depth when creating new line)
  function hasWhiteSpace(string)
  {
    return /\w/gi.test(string);
  }

  //all editors use the following notation for the keyevents (stored as a string): "[editor]: [@@command or character]∆[cursor position]{∆[pasted text]∆[pasted text end position]}"
  var htmleditor = CodeMirror.fromTextArea(document.getElementById("htmlcode"), {
    mode: "text/html",
    lineNumbers: true,
    lineWrapping: true,
    smartIndent: false,
    tabSize: 2,
    indentWithTabs: true,
    showCursorWhenSelecting: true,
    theme: 'monokai',
    //extraKeys is like using event.preventDefault()
    extraKeys: {
      Enter: function(cm) {
        spacesToAdd = "";
        if (htmlTabDepth != 0)
        {
          for (var h = 1; h <= htmlTabDepth; h++) {
            spacesToAdd += " ";
            if (h % 2 == 0)
            {
              arr[arrIndex] = "htmleditor: @@tab∆" + (lengthToCursor + (h-1));
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
      },
    },
    onKeyEvent: function(editor, event){
      event = $.event.fix(event);

      lengthToCursor = htmleditor.indexFromPos(htmleditor.getCursor());

      if(event.type == "keydown") {

        if (event.keyCode == 8 && !htmleditor.somethingSelected())//backspace
        {
          arr[arrIndex] = "htmleditor: @@backspace∆" + lengthToCursor;
          arrIndex++;
          if(!hasWhiteSpace(htmleditor.getLine(htmleditor.getCursor().line)) && htmleditor.getLine(htmleditor.getCursor().line).length % 2 == 1)
          {
            htmlTabDepth -= 2;
          }
        }
        else if (event.keyCode == 13)//enter key
        {
          arr[arrIndex] = "htmleditor: @@enter∆" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 32)//space key
        {
          arr[arrIndex] = "htmleditor: @@space∆" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 9)//tab key
        {
          arr[arrIndex] = "htmleditor: @@tab∆" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 37 && !htmleditor.somethingSelected())//left arrow
        {
          arr[arrIndex] = "htmleditor: @@arrowLeft∆" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 38 && !htmleditor.somethingSelected())//up arrow
        {
          arr[arrIndex] = "htmleditor: @@arrowUp∆" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 39 && !htmleditor.somethingSelected())//right arrow
        {
          arr[arrIndex] = "htmleditor: @@arrowRight∆" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 40 && !htmleditor.somethingSelected())//down arrow
        {
          arr[arrIndex] = "htmleditor: @@arrowDown∆" + lengthToCursor;
          arrIndex++;
        }
      }
      else if (event.type == "keypress")
      {
        if(event.keyCode != 32)
        {
          //event.which is used instead of event.keyCode as event.which can determine capital letter or not
          var charAdded = String.fromCharCode(event.which);

          arr[arrIndex] = "htmleditor: " + charAdded + "∆" + lengthToCursor;
          arrIndex++;

          //used for auto closing brackets and quotes
          if (charAdded == "{")
          {
            event.preventDefault();
            arr[arrIndex] = "htmleditor: }∆" + (lengthToCursor + 1);
            arrIndex++;
            htmleditor.replaceRange("{}",{line: htmleditor.posFromIndex(lengthToCursor).line, ch: htmleditor.posFromIndex(lengthToCursor).ch});
            htmleditor.setCursor({line: htmleditor.posFromIndex(lengthToCursor).line, ch: (htmleditor.posFromIndex(lengthToCursor).ch + 1)});
          }
          else if (charAdded == "[")
          {
            event.preventDefault();
            arr[arrIndex] = "htmleditor: ]∆" + (lengthToCursor + 1);
            arrIndex++;
            htmleditor.replaceRange("[]",{line: htmleditor.posFromIndex(lengthToCursor).line, ch: htmleditor.posFromIndex(lengthToCursor).ch});
            htmleditor.setCursor({line: htmleditor.posFromIndex(lengthToCursor).line, ch: (htmleditor.posFromIndex(lengthToCursor).ch + 1)});
          }
          else if (charAdded == "(")
          {
            event.preventDefault();
            arr[arrIndex] = "htmleditor: )∆" + (lengthToCursor + 1);
            arrIndex++;
            htmleditor.replaceRange("()",{line: htmleditor.posFromIndex(lengthToCursor).line, ch: (htmleditor.posFromIndex(lengthToCursor).ch)});
            htmleditor.setCursor({line: htmleditor.posFromIndex(lengthToCursor).line, ch: (htmleditor.posFromIndex(lengthToCursor).ch + 1)});
          }
          else if (charAdded == "\"")
          {
            event.preventDefault();
            arr[arrIndex] = "htmleditor: \"∆" + (lengthToCursor + 1);
            arrIndex++;
            htmleditor.replaceRange("\"\"",{line: htmleditor.posFromIndex(lengthToCursor).line, ch: htmleditor.posFromIndex(lengthToCursor).ch});
            htmleditor.setCursor({line: htmleditor.posFromIndex(lengthToCursor).line, ch: (htmleditor.posFromIndex(lengthToCursor).ch + 1)});
          }
          else if (charAdded == "\'")
          {
            event.preventDefault();
            arr[arrIndex] = "htmleditor: \'∆" + (lengthToCursor + 1);
            arrIndex++;
            htmleditor.replaceRange("\'\'",{line: htmleditor.posFromIndex(lengthToCursor).line, ch: htmleditor.posFromIndex(lengthToCursor).ch});
            htmleditor.setCursor({line: htmleditor.posFromIndex(lengthToCursor).line, ch: (htmleditor.posFromIndex(lengthToCursor).ch + 1)});
          }
        }
      }
      else if (event.type == "keyup")
      {
        if (event.keyCode == 86 && event.ctrlKey)
        {
          var pastedText = htmleditor.getRange({line: htmleditor.posFromIndex(pastedTextStart).line, ch: htmleditor.posFromIndex(pastedTextStart).ch}, {line: htmleditor.posFromIndex(lengthToCursor).line, ch: (htmleditor.posFromIndex(lengthToCursor).ch)});
          console.log(pastedText);

          arr[arrIndex] = "htmleditor: @@pasteContent∆" + pastedTextStart + "∆" + pastedText + "∆" + lengthToCursor;
          arrIndex++;
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
    //extraKeys is like using event.preventDefault()
    extraKeys: {
      Enter: function(cm) {
        spacesToAdd = "";
        if (cssTabDepth != 0)
        {
          for (var h = 1; h <= cssTabDepth; h++) {
            spacesToAdd += " ";
            if (h % 2 == 0)
            {
              arr[arrIndex] = "csseditor: @@tab∆" + (lengthToCursor + (h-1));
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
      },
    },
    onKeyEvent: function(editor, event){
      event = $.event.fix(event);

      lengthToCursor = csseditor.indexFromPos(csseditor.getCursor());

      if(event.type == "keydown") {

        if (event.keyCode == 8 && !csseditor.somethingSelected())//backspace
        {
          arr[arrIndex] = "csseditor: @@backspace∆" + lengthToCursor;
          arrIndex++;
          if(!hasWhiteSpace(csseditor.getLine(csseditor.getCursor().line)) && csseditor.getLine(csseditor.getCursor().line).length % 2 == 1)
          {
            cssTabDepth -= 2;
          }
        }
        else if (event.keyCode == 13)//enter key
        {
          arr[arrIndex] = "csseditor: @@enter∆" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 32)//space key
        {
          arr[arrIndex] = "csseditor: @@space∆" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 9)//tab key
        {
          arr[arrIndex] = "csseditor: @@tab∆" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 37 && !csseditor.somethingSelected())//left arrow
        {
          arr[arrIndex] = "csseditor: @@arrowLeft∆" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 38 && !csseditor.somethingSelected())//up arrow
        {
          arr[arrIndex] = "csseditor: @@arrowUp∆" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 39 && !csseditor.somethingSelected())//right arrow
        {
          arr[arrIndex] = "csseditor: @@arrowRight∆" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 40 && !csseditor.somethingSelected())//down arrow
        {
          arr[arrIndex] = "csseditor: @@arrowDown∆" + lengthToCursor;
          arrIndex++;
        }
      }
      else if (event.type == "keypress")
      {
        if(event.keyCode != 32)
        {
          //event.which is used instead of event.keyCode as event.which can determine capital letter or not
          var charAdded = String.fromCharCode(event.which);

          arr[arrIndex] = "csseditor: " + charAdded + "∆" + lengthToCursor;
          arrIndex++;

          //used for auto closing brackets and quotes
          if (charAdded == "{")
          {
            event.preventDefault();
            arr[arrIndex] = "csseditor: }∆" + (lengthToCursor + 1);
            arrIndex++;
            csseditor.replaceRange("{}",{line: csseditor.posFromIndex(lengthToCursor).line, ch: csseditor.posFromIndex(lengthToCursor).ch});
            csseditor.setCursor({line: csseditor.posFromIndex(lengthToCursor).line, ch: (csseditor.posFromIndex(lengthToCursor).ch + 1)});
          }
          else if (charAdded == "[")
          {
            event.preventDefault();
            arr[arrIndex] = "csseditor: ]∆" + (lengthToCursor + 1);
            arrIndex++;
            csseditor.replaceRange("[]",{line: csseditor.posFromIndex(lengthToCursor).line, ch: csseditor.posFromIndex(lengthToCursor).ch});
            csseditor.setCursor({line: csseditor.posFromIndex(lengthToCursor).line, ch: (csseditor.posFromIndex(lengthToCursor).ch + 1)});
          }
          else if (charAdded == "(")
          {
            event.preventDefault();
            arr[arrIndex] = "csseditor: )∆" + (lengthToCursor + 1);
            arrIndex++;
            csseditor.replaceRange("()",{line: csseditor.posFromIndex(lengthToCursor).line, ch: (csseditor.posFromIndex(lengthToCursor).ch)});
            csseditor.setCursor({line: csseditor.posFromIndex(lengthToCursor).line, ch: (csseditor.posFromIndex(lengthToCursor).ch + 1)});
          }
          else if (charAdded == "\"")
          {
            event.preventDefault();
            arr[arrIndex] = "csseditor: \"∆" + (lengthToCursor + 1);
            arrIndex++;
            csseditor.replaceRange("\"\"",{line: csseditor.posFromIndex(lengthToCursor).line, ch: csseditor.posFromIndex(lengthToCursor).ch});
            csseditor.setCursor({line: csseditor.posFromIndex(lengthToCursor).line, ch: (csseditor.posFromIndex(lengthToCursor).ch + 1)});
          }
          else if (charAdded == "\'")
          {
            event.preventDefault();
            arr[arrIndex] = "csseditor: \'∆" + (lengthToCursor + 1);
            arrIndex++;
            csseditor.replaceRange("\'\'",{line: csseditor.posFromIndex(lengthToCursor).line, ch: csseditor.posFromIndex(lengthToCursor).ch});
            csseditor.setCursor({line: csseditor.posFromIndex(lengthToCursor).line, ch: (csseditor.posFromIndex(lengthToCursor).ch + 1)});
          }
        }
      }
      else if (event.type == "keyup")
      {
        if (event.keyCode == 86 && event.ctrlKey)
        {
          var pastedText = csseditor.getRange({line: csseditor.posFromIndex(pastedTextStart).line, ch: csseditor.posFromIndex(pastedTextStart).ch}, {line: csseditor.posFromIndex(lengthToCursor).line, ch: (csseditor.posFromIndex(lengthToCursor).ch)});
          console.log(pastedText);

          arr[arrIndex] = "csseditor: @@pasteContent∆" + pastedTextStart + "∆" + pastedText + "∆" + lengthToCursor;
          arrIndex++;
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
    //extraKeys is like using event.preventDefault()
    extraKeys: {
      Enter: function(cm) {
        spacesToAdd = "";
        if (jsTabDepth != 0)
        {
          for (var h = 1; h <= jsTabDepth; h++) {
            spacesToAdd += " ";
            if (h % 2 == 0)
            {
              arr[arrIndex] = "jseditor: @@tab∆" + (lengthToCursor + (h-1));
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
      },
    },
    onKeyEvent: function(editor, event){
      event = $.event.fix(event);

      lengthToCursor = jseditor.indexFromPos(jseditor.getCursor());

      if(event.type == "keydown") {

        if (event.keyCode == 8 && !jseditor.somethingSelected())//backspace
        {
          arr[arrIndex] = "jseditor: @@backspace∆" + lengthToCursor;
          arrIndex++;
          if(!hasWhiteSpace(jseditor.getLine(jseditor.getCursor().line)) && jseditor.getLine(jseditor.getCursor().line).length % 2 == 1)
          {
            jsTabDepth -= 2;
          }
        }
        else if (event.keyCode == 13)//enter key
        {
          arr[arrIndex] = "jseditor: @@enter∆" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 32)//space key
        {
          arr[arrIndex] = "jseditor: @@space∆" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 9)//tab key
        {
          arr[arrIndex] = "jseditor: @@tab∆" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 37 && !jseditor.somethingSelected())//left arrow
        {
          arr[arrIndex] = "jseditor: @@arrowLeft∆" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 38 && !jseditor.somethingSelected())//up arrow
        {
          arr[arrIndex] = "jseditor: @@arrowUp∆" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 39 && !jseditor.somethingSelected())//right arrow
        {
          arr[arrIndex] = "jseditor: @@arrowRight∆" + lengthToCursor;
          arrIndex++;
        }
        else if (event.keyCode == 40 && !jseditor.somethingSelected())//down arrow
        {
          arr[arrIndex] = "jseditor: @@arrowDown∆" + lengthToCursor;
          arrIndex++;
        }
      }
      else if (event.type == "keypress")
      {
        if(event.keyCode != 32)
        {
          //event.which is used instead of event.keyCode as event.which can determine capital letter or not
          var charAdded = String.fromCharCode(event.which);

          arr[arrIndex] = "jseditor: " + charAdded + "∆" + lengthToCursor;
          arrIndex++;

          //used for auto closing brackets and quotes
          if (charAdded == "{")
          {
            event.preventDefault();
            arr[arrIndex] = "jseditor: }∆" + (lengthToCursor + 1);
            arrIndex++;
            jseditor.replaceRange("{}",{line: jseditor.posFromIndex(lengthToCursor).line, ch: jseditor.posFromIndex(lengthToCursor).ch});
            jseditor.setCursor({line: jseditor.posFromIndex(lengthToCursor).line, ch: (jseditor.posFromIndex(lengthToCursor).ch + 1)});
          }
          else if (charAdded == "[")
          {
            event.preventDefault();
            arr[arrIndex] = "jseditor: ]∆" + (lengthToCursor + 1);
            arrIndex++;
            jseditor.replaceRange("[]",{line: jseditor.posFromIndex(lengthToCursor).line, ch: jseditor.posFromIndex(lengthToCursor).ch});
            jseditor.setCursor({line: jseditor.posFromIndex(lengthToCursor).line, ch: (jseditor.posFromIndex(lengthToCursor).ch + 1)});
          }
          else if (charAdded == "(")
          {
            event.preventDefault();
            arr[arrIndex] = "jseditor: )∆" + (lengthToCursor + 1);
            arrIndex++;
            jseditor.replaceRange("()",{line: jseditor.posFromIndex(lengthToCursor).line, ch: (jseditor.posFromIndex(lengthToCursor).ch)});
            jseditor.setCursor({line: jseditor.posFromIndex(lengthToCursor).line, ch: (jseditor.posFromIndex(lengthToCursor).ch + 1)});
          }
          else if (charAdded == "\"")
          {
            event.preventDefault();
            arr[arrIndex] = "jseditor: \"∆" + (lengthToCursor + 1);
            arrIndex++;
            jseditor.replaceRange("\"\"",{line: jseditor.posFromIndex(lengthToCursor).line, ch: jseditor.posFromIndex(lengthToCursor).ch});
            jseditor.setCursor({line: jseditor.posFromIndex(lengthToCursor).line, ch: (jseditor.posFromIndex(lengthToCursor).ch + 1)});
          }
          else if (charAdded == "\'")
          {
            event.preventDefault();
            arr[arrIndex] = "jseditor: \'∆" + (lengthToCursor + 1);
            arrIndex++;
            jseditor.replaceRange("\'\'",{line: jseditor.posFromIndex(lengthToCursor).line, ch: jseditor.posFromIndex(lengthToCursor).ch});
            jseditor.setCursor({line: jseditor.posFromIndex(lengthToCursor).line, ch: (jseditor.posFromIndex(lengthToCursor).ch + 1)});
          }
        }
      }
      else if (event.type == "keyup")
      {
        if (event.keyCode == 86 && event.ctrlKey)
        {
          var pastedText = jseditor.getRange({line: jseditor.posFromIndex(pastedTextStart).line, ch: jseditor.posFromIndex(pastedTextStart).ch}, {line: jseditor.posFromIndex(lengthToCursor).line, ch: (jseditor.posFromIndex(lengthToCursor).ch)});
          console.log(pastedText);

          arr[arrIndex] = "jseditor: @@pasteContent∆" + pastedTextStart + "∆" + pastedText + "∆" + lengthToCursor;
          arrIndex++;
        }

      }
      cursorPurpose = jseditor.getValue();
    }
  });

  //editor instances reset
  htmleditor.setValue("");
  csseditor.setValue("");
  jseditor.setValue("");

  //set default focus
  htmleditor.focus();

  //used for the delayed updating of iframe preview
  var delay;

  //sends editor code changes to iframe and updates the iframe
  htmleditor.on("change", function(event) {
    clearTimeout(delay);
    delay = setTimeout(updatePreview, 300);
  });

  //used for pasting and getting cursor index before change
  htmleditor.on("beforeChange", function(event) {
    pastedTextStart = lengthToCursor;
  });

  //used for selecting the editor that is in focus
  htmleditor.on("focus", function() {
    focusedEditor = htmleditor;
  });

  //sends editor code changes to iframe and updates the iframe
  csseditor.on("change", function(event) {
    clearTimeout(delay);
    delay = setTimeout(updatePreview, 300);
  });

  //used for pasting and getting cursor index before change
  csseditor.on("beforeChange", function(event) {
    pastedTextStart = lengthToCursor;
  });

  //used for selecting the editor that is in focus
  csseditor.on("focus", function() {
    focusedEditor = csseditor;
  });

  //sends editor code changes to iframe and updates the iframe
  jseditor.on("change", function(event) {
    clearTimeout(delay);
    delay = setTimeout(updatePreview, 300);
  });

  //used for pasting and getting cursor index before change
  jseditor.on("beforeChange", function(event) {
    pastedTextStart = lengthToCursor;
  });

  //used for selecting the editor that is in focus
  jseditor.on("focus", function() {
    focusedEditor = jseditor;
  });

  //used to determine if the cursor activity is caused by mouse or not (also checks for selections made)
  htmleditor.on("cursorActivity", function() {

    lengthToCursor = htmleditor.indexFromPos(htmleditor.getCursor());

    if(htmleditor.somethingSelected())
    {
      arr[arrIndex] = "htmleditor: @@selectionChange∆" + htmleditor.getCursor("anchor").line + "," + htmleditor.getCursor("anchor").ch + "{}" + htmleditor.getCursor("head").line + "," + htmleditor.getCursor("head").ch;
      arrIndex++;
    }
    else if(htmleditor.getValue() == cursorPurpose && arr[arrIndex-1].indexOf("@@arrow") == -1 && !htmleditor.somethingSelected() && htmleditor.getValue() != "" && arr[arrIndex-1].indexOf("}") == -1 && arr[arrIndex-1].indexOf(")") == -1 && arr[arrIndex-1].indexOf("]") == -1 && arr[arrIndex-1].indexOf("\"") == -1 && arr[arrIndex-1].indexOf("\'") == -1)
    {
      arr[arrIndex] = "htmleditor: @@mouseChange∆" + lengthToCursor;
      arrIndex++;
    }
  });

  //used to determine if the cursor activity is caused by mouse or not (also checks for selections made)
  csseditor.on("cursorActivity", function() {

    lengthToCursor = csseditor.indexFromPos(csseditor.getCursor());

    if(csseditor.somethingSelected())
    {
      arr[arrIndex] = "csseditor: @@selectionChange∆" + csseditor.getCursor("anchor").line + "," + csseditor.getCursor("anchor").ch + "{}" + csseditor.getCursor("head").line + "," + csseditor.getCursor("head").ch;
      arrIndex++;
    }
    else if(csseditor.getValue() == cursorPurpose && arr[arrIndex-1].indexOf("@@arrow") == -1 && !csseditor.somethingSelected() && csseditor.getValue() != "" && arr[arrIndex-1].indexOf("}") == -1 && arr[arrIndex-1].indexOf(")") == -1 && arr[arrIndex-1].indexOf("]") == -1 && arr[arrIndex-1].indexOf("\"") == -1 && arr[arrIndex-1].indexOf("\'") == -1)
    {
      arr[arrIndex] = "csseditor: @@mouseChange∆" + lengthToCursor;
      arrIndex++;
    }
  });

  //used to determine if the cursor activity is caused by mouse or not (also checks for selections made)
  jseditor.on("cursorActivity", function() {

    lengthToCursor = jseditor.indexFromPos(jseditor.getCursor());

    if(jseditor.somethingSelected())
    {
      arr[arrIndex] = "jseditor: @@selectionChange∆" + jseditor.getCursor("anchor").line + "," + jseditor.getCursor("anchor").ch + "{}" + jseditor.getCursor("head").line + "," + jseditor.getCursor("head").ch;
      arrIndex++;
    }
    else if(jseditor.getValue() == cursorPurpose && arr[arrIndex-1].indexOf("@@arrow") == -1 && !jseditor.somethingSelected() && jseditor.getValue() != "" && arr[arrIndex-1].indexOf("}") == -1 && arr[arrIndex-1].indexOf(")") == -1 && arr[arrIndex-1].indexOf("]") == -1 && arr[arrIndex-1].indexOf("\"") == -1 && arr[arrIndex-1].indexOf("\'") == -1)
    {
      arr[arrIndex] = "jseditor: @@mouseChange∆" + lengthToCursor;
      arrIndex++;
    }
  });

  //typewriter syle effect
  $("#generateCode").on("click", function() {
    //TODO: add a play and pause button

    //clear the editors to begin the playback
    htmleditor.setValue("");
    csseditor.setValue("");
    jseditor.setValue("");

    //reapply focus onto first editor than is edited
    if (arr[0].split(": ")[0] == "htmleditor")
    {
      htmleditor.focus();
    }
    else if (arr[0].split(": ")[0] == "csseditor")
    {
      csseditor.focus();
    }
    else if (arr[0].split(": ")[0] == "jseditor")
    {
      jseditor.focus();
    }

    //reiterate the command storing array (TODO: consider using setInterval instead of for loop for stopping playback)
    for (var i = 0; i < arr.length; i++) {
      (function(i){
        setTimeout(function(){
          var targetEditor = arr[i].split(": ")[0];
          var arg = arr[i].split(": ")[1];
          //for printing out commands to be copied to file (TODO: write commands to file directly)
          console.log("arr[" + i + "] = " + arr[i]);
          //determine if @@command or char
          if (arg.indexOf("@@") != -1)
          {
            if (targetEditor == "htmleditor")
            {
              if (arg.indexOf("@@enter") != -1)
              {
                var charInsert = parseInt(arg.split("∆")[1]);
                var row = htmleditor.posFromIndex(charInsert).line;
                var col = htmleditor.posFromIndex(charInsert).ch;
                htmleditor.replaceRange("\n", {line: row, ch: (col)});
                htmleditor.focus();
                htmleditor.setCursor({line: row , ch: col });
              }
              else if (arg.indexOf("@@backspace") != -1)
              {
                var charReplace = parseInt(arg.split("∆")[1])-1;
                var row = htmleditor.posFromIndex(charReplace).line;
                var col = htmleditor.posFromIndex(charReplace).ch;
                var row2 = htmleditor.posFromIndex(charReplace+1).line;
                var col2 = htmleditor.posFromIndex(charReplace+1).ch;
                htmleditor.replaceRange("", {line: row, ch: col}, {line: row2, ch: col2});
                htmleditor.focus();
                htmleditor.setCursor({line: row , ch: (col+1) });
              }
              else if (arg.indexOf("@@space") != -1)
              {
                var charInsert = parseInt(arg.split("∆")[1]);
                var row = htmleditor.posFromIndex(charInsert).line;
                var col = htmleditor.posFromIndex(charInsert).ch;
                htmleditor.replaceRange(" ", {line: row, ch: col});
                htmleditor.focus();
                htmleditor.setCursor({line: row , ch: (col + 1)});
              }
              else if (arg.indexOf("@@tab") != -1)
              {
                var charInsert = parseInt(arg.split("∆")[1]);
                var row = htmleditor.posFromIndex(charInsert).line;
                var col = htmleditor.posFromIndex(charInsert).ch;
                htmleditor.replaceRange("  ", {line: row, ch: col});
                htmleditor.focus();
                htmleditor.setCursor({line: row , ch: col});
              }
              else if (arg.indexOf("@@arrow") != -1)
              {
                var charInsert = parseInt(arg.split("∆")[1]);
                var row = htmleditor.posFromIndex(charInsert).line;
                var col = htmleditor.posFromIndex(charInsert).ch;
                htmleditor.focus();
                htmleditor.setCursor({line: row , ch: col });
              }
              else if (arg.indexOf("@@mouseChange") != -1)
              {
                var charInsert = parseInt(arg.split("∆")[1]);
                var row = htmleditor.posFromIndex(charInsert).line;
                var col = htmleditor.posFromIndex(charInsert).ch;
                htmleditor.focus();
                htmleditor.setCursor({line: row , ch: col });
              }
              else if (arg.indexOf("@@selectionChange") != -1)
              {
                var rowAnc = arg.split("∆")[1].split("{}")[0].split(",")[0];
                var colAnc = arg.split("∆")[1].split("{}")[0].split(",")[1];
                var rowHead = arg.split("∆")[1].split("{}")[1].split(",")[0];
                var colHead = arg.split("∆")[1].split("{}")[1].split(",")[1];
                htmleditor.focus();
                htmleditor.setSelection({line: rowAnc, ch: colAnc}, {line: rowHead, ch: colHead});
              }
              else if (arg.indexOf("@@pasteContent") != -1)
              {
                var charInsert = parseInt(arg.split("∆")[1]);
                var row = htmleditor.posFromIndex(charInsert).line;
                var col = htmleditor.posFromIndex(charInsert).ch;
                htmleditor.replaceRange(arg.split("∆")[2], {line: row, ch: col});
                htmleditor.focus();
                htmleditor.setCursor({line: htmleditor.posFromIndex(parseInt(arg.split("∆")[3])).line , ch: htmleditor.posFromIndex(parseInt(arg.split("∆")[3])).ch});
              }
            }
            else if (targetEditor == "csseditor")
            {
              if (arg.indexOf("@@enter") != -1)
              {
                var charInsert = parseInt(arg.split("∆")[1]);
                var row = csseditor.posFromIndex(charInsert).line;
                var col = csseditor.posFromIndex(charInsert).ch;
                csseditor.replaceRange("\n", {line: row, ch: col});
                csseditor.focus();

              }
              else if (arg.indexOf("@@backspace") != -1)
              {
                var charReplace = parseInt(arg.split("∆")[1])-1;
                var row = csseditor.posFromIndex(charReplace).line;
                var col = csseditor.posFromIndex(charReplace).ch;
                var row2 = csseditor.posFromIndex(charReplace+1).line;
                var col2 = csseditor.posFromIndex(charReplace+1).ch;
                csseditor.replaceRange("", {line: row, ch: col}, {line: row2, ch: col2});
                csseditor.focus();
                csseditor.setCursor({line: row , ch: col });
              }
              else if (arg.indexOf("@@space") != -1)
              {
                var charInsert = parseInt(arg.split("∆")[1]);
                var row = csseditor.posFromIndex(charInsert).line;
                var col = csseditor.posFromIndex(charInsert).ch;
                csseditor.replaceRange(" ", {line: row, ch: col});
                csseditor.focus();
                csseditor.setCursor({line: row , ch: (col + 1)});
              }
              else if (arg.indexOf("@@tab") != -1)
              {
                var charInsert = parseInt(arg.split("∆")[1]);
                var row = csseditor.posFromIndex(charInsert).line;
                var col = csseditor.posFromIndex(charInsert).ch;
                csseditor.replaceRange("  ", {line: row, ch: col});
                csseditor.focus();
                csseditor.setCursor({line: row , ch: (col + 1)});
              }
              else if (arg.indexOf("@@arrow") != -1)
              {
                var charInsert = parseInt(arg.split("∆")[1]);
                var row = csseditor.posFromIndex(charInsert).line;
                var col = csseditor.posFromIndex(charInsert).ch;
                csseditor.focus();
                csseditor.setCursor({line: row , ch: col });
              }
              else if (arg.indexOf("@@mouseChange") != -1)
              {
                var charInsert = parseInt(arg.split("∆")[1]);
                var row = csseditor.posFromIndex(charInsert).line;
                var col = csseditor.posFromIndex(charInsert).ch;
                csseditor.focus();
                csseditor.setCursor({line: row , ch: col });
              }
              else if (arg.indexOf("@@selectionChange") != -1)
              {
                var rowAnc = arg.split("∆")[1].split("{}")[0].split(",")[0];
                var colAnc = arg.split("∆")[1].split("{}")[0].split(",")[1];
                var rowHead = arg.split("∆")[1].split("{}")[1].split(",")[0];
                var colHead = arg.split("∆")[1].split("{}")[1].split(",")[1];
                csseditor.focus();
                csseditor.setSelection({line: rowAnc, ch: colAnc}, {line: rowHead, ch: colHead});
              }
              else if (arg.indexOf("@@pasteContent") != -1)
              {
                var charInsert = parseInt(arg.split("∆")[1]);
                var row = csseditor.posFromIndex(charInsert).line;
                var col = csseditor.posFromIndex(charInsert).ch;
                csseditor.replaceRange(arg.split("∆")[2], {line: row, ch: col});
                csseditor.focus();
                csseditor.setCursor({line: csseditor.posFromIndex(parseInt(arg.split("∆")[3])).line , ch: csseditor.posFromIndex(parseInt(arg.split("∆")[3])).ch});
              }
            }
            else if (targetEditor == "jseditor")
            {
              if (arg.indexOf("@@enter") != -1)
              {
                var charInsert = parseInt(arg.split("∆")[1]);
                var row = jseditor.posFromIndex(charInsert).line;
                var col = jseditor.posFromIndex(charInsert).ch;
                jseditor.replaceRange("\n", {line: row, ch: col});
                jseditor.focus();

              }
              else if (arg.indexOf("@@backspace") != -1)
              {
                var charReplace = parseInt(arg.split("∆")[1])-1;
                var row = jseditor.posFromIndex(charReplace).line;
                var col = jseditor.posFromIndex(charReplace).ch;
                var row2 = jseditor.posFromIndex(charReplace+1).line;
                var col2 = jseditor.posFromIndex(charReplace+1).ch;
                jseditor.replaceRange("", {line: row, ch: col}, {line: row2, ch: col2});
                jseditor.focus();
                jseditor.setCursor({line: row , ch: col });
              }
              else if (arg.indexOf("@@space") != -1)
              {
                var charInsert = parseInt(arg.split("∆")[1]);
                var row = jseditor.posFromIndex(charInsert).line;
                var col = jseditor.posFromIndex(charInsert).ch;
                jseditor.replaceRange(" ", {line: row, ch: col});
                jseditor.focus();
                jseditor.setCursor({line: row , ch: (col + 1)});
              }
              else if (arg.indexOf("@@tab") != -1)
              {
                var charInsert = parseInt(arg.split("∆")[1]);
                var row = jseditor.posFromIndex(charInsert).line;
                var col = jseditor.posFromIndex(charInsert).ch;
                jseditor.replaceRange("  ", {line: row, ch: col});
                jseditor.focus();
                jseditor.setCursor({line: row , ch: (col + 1)});
              }
              else if (arg.indexOf("@@arrow") != -1)
              {
                var charInsert = parseInt(arg.split("∆")[1]);
                var row = jseditor.posFromIndex(charInsert).line;
                var col = jseditor.posFromIndex(charInsert).ch;
                jseditor.focus();
                jseditor.setCursor({line: row , ch: col });
              }
              else if (arg.indexOf("@@mouseChange") != -1)
              {
                var charInsert = parseInt(arg.split("∆")[1]);
                var row = jseditor.posFromIndex(charInsert).line;
                var col = jseditor.posFromIndex(charInsert).ch;
                jseditor.focus();
                jseditor.setCursor({line: row , ch: col });
              }
              else if (arg.indexOf("@@selectionChange") != -1)
              {
                var rowAnc = arg.split("∆")[1].split("{}")[0].split(",")[0];
                var colAnc = arg.split("∆")[1].split("{}")[0].split(",")[1];
                var rowHead = arg.split("∆")[1].split("{}")[1].split(",")[0];
                var colHead = arg.split("∆")[1].split("{}")[1].split(",")[1];
                jseditor.focus();
                jseditor.setSelection({line: rowAnc, ch: colAnc}, {line: rowHead, ch: colHead});
              }
              else if (arg.indexOf("@@pasteContent") != -1)
              {
                var charInsert = parseInt(arg.split("∆")[1]);
                var row = jseditor.posFromIndex(charInsert).line;
                var col = jseditor.posFromIndex(charInsert).ch;
                jseditor.replaceRange(arg.split("∆")[2], {line: row, ch: col});
                jseditor.focus();
                jseditor.setCursor({line: jseditor.posFromIndex(parseInt(arg.split("∆")[3])).line , ch: jseditor.posFromIndex(parseInt(arg.split("∆")[3])).ch});
              }
            }
          }
          else
          {
            if (targetEditor == "htmleditor")
            {
              var charInsert = parseInt(arg.split("∆")[1]);
              var row = htmleditor.posFromIndex(charInsert).line;
              var col = htmleditor.posFromIndex(charInsert).ch;
              htmleditor.replaceRange(arg.split("∆")[0], {line: row, ch: col});
              htmleditor.setCursor({line: row , ch: (col + 1)});
            }
            else if (targetEditor == "csseditor")
            {
              var charInsert = parseInt(arg.split("∆")[1]);
              var row = csseditor.posFromIndex(charInsert).line;
              var col = csseditor.posFromIndex(charInsert).ch;
              csseditor.replaceRange(arg.split("∆")[0], {line: row, ch: col});

              //used for checking if the text is pasted or is a character and sets the cursor accordingly
              csseditor.setCursor({line: row , ch: (col + 1)});
            }
            else if (targetEditor == "jseditor")
            {
              var charInsert = parseInt(arg.split("∆")[1]);
              var row = jseditor.posFromIndex(charInsert).line;
              var col = jseditor.posFromIndex(charInsert).ch;
              jseditor.replaceRange(arg.split("∆")[0], {line: row, ch: col});

              //used for checking if the text is pasted or is a character and sets the cursor accordingly
              jseditor.setCursor({line: row , ch: (col + 1)});
            }
          }
        }, typeSpeed * i);
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
    if (csseditor.getValue() != "" && htmleditor.getValue() != "")
    {
      var style = document.createElement("style");
      style.innerHTML = csseditor.getValue();
      preview.getElementsByTagName('head')[0].appendChild(style);
    }
    if (jseditor.getValue() != "" && htmleditor.getValue() != "")
    {
      var script = document.createElement("script");
      script.innerHTML = jseditor.getValue();
      preview.getElementsByTagName('head')[0].appendChild(script);
    }
    preview.close();
  }

  function jsDelay_Demo() {
    jseditor.setValue("$(document).ready(function () {\n  $(window).on(\"load\", function() {\n    $(\"div\").fadeIn(1000);\n  });\n\n  $(\"div\").on(\"mouseover\", function() {\n    $(\"div\").toggleClass(\"blue\");\n  });\n\n  $(\"div\").on(\"mouseout\", function() {\n    $(\"div\").toggleClass(\"blue\");\n  });\n});");
  }

  //on load reset (dirty way)
  setTimeout(updatePreview, 300);
});