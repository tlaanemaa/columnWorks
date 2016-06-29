// This is a jQuery plugin that allows working with table columns like a JSON object
// It runs async to avoid blocking the main thread of the browser for too long (async parameters can be adjusted)
// The function that is added is called 'columnWorks' and it takes three arguments:
//    columns:    An array of column names to parse. If an empty array is passed then all columns will be parsed
//    callback:   A callback function that will be called once per row and provided the current row and all column values as JSON object via 'this'
//    options:    A JSON object that allows passing some optional parameters
//      batchSize:    An integer value indicating how many rows should be processed in one batch. Default is calculated from the number of columns so
//                    so that 100 column values get processed per batch
//      endCallback:  A callback function that will be called once columnWorks has finished. No default value

// A closure to wrap this whole thing into a 'module'
(function($){
  'use strict';
  var parseText, asyncLoop;

  // A function to convert table rows to a JSON object
  $.fn.columnWorks = function(columns, callback, options) {
    // Set default value for options and declare variables
    if(options === undefined) options = {};
    var tbl, tblHeads, rws, i;

    // Store the 'this' object
    tbl = this;

    // Create an object that holds column headers
    tblHeads = tbl.find('thead th').map(function() { return $(this).text().trim(); });

    // Assign defaults
    if(columns.length === 0) columns = tblHeads; // Assign all column values to 'columns' if it was empty
    if(options.batchSize === undefined) options.batchSize = Math.floor(100 / columns.length); // Assign default value to options.batchSize if one wasnt provided

    // Show errors in console for
    for(i = 0; i < columns.length; i++) {
      if($.inArray(columns[i], tblHeads) === -1) {
        console.error('columnWorks: Column ' + columns[i] + ' not found in the table!');
        columns.splice(i, 1);
      }
    }

    // Loop over rows
    rws = tbl.find('tbody tr');
    asyncLoop(0, rws.length - 1, options.batchSize, function(i) {
      var obj, j, curCol, inx, colRef, colObj;

      // Create the initial object and add a reference to the row
      obj = {};
      obj.row = $(rws[i]);
      obj.columns = {};

      // Loop columns and fill the columns object with column values
      for(j = 0; j < columns.length; j++) {
        colObj = {};
        curCol = columns[j];
        inx = $.inArray(curCol, tblHeads);
        if(inx === -1) console.error('PANIC!!!');
        colRef = obj.row.find('td:nth-child(' + (inx + 1) + ')');
        colObj.ref = colRef;
        colObj.val = parseText(colRef.text());
        obj.columns[curCol] = colObj;
      }
      callback.call(obj);
    }, options.endCallback);

    // Return 'this' to allow for jQuery chaining
    return this;
  };

  // A small internal function to parse text into numbers or boolean
  parseText = function(txt) {
    var lCase, num;

    // Conver input to a string
    txt = String(txt.trim());

    // If text is blank then just return it back
    if(txt === '') return txt;

    // Check if text is a boolean
    lCase = txt.toLowerCase();
    if(lCase === 'true') return true;
    if(lCase === 'false') return false;

    // Check if text is a number
    num = Number(txt);
    if(!isNaN(num) && isFinite(num)) return num;

    // Return text if all checks failed
    return txt;
  };

  // A small internal function to handle async loops
  asyncLoop = function(from, to, batchSize, action, callback) {
    var looper, j, i;

    // Define the looper function
    looper = function() {
      for(j = 0; j < batchSize; j++) {
        // Do the action and increment i
        action(i);
        i += 1;

        // Check if i has reached the end
        if(i > to) break;
      }

      // Schedule next run or exit
      if(i <= to) {
        setTimeout(looper, 1);
      } else {
        if(callback) setTimeout(callback, 1);
      }
      return null;
    };

    // Set the counter and call the function
    i = from;
    setTimeout(looper, 1);
    return null;
  };

})(jQuery);
