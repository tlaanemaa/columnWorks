<h2>columnWorks</h2>

This is a simple plugin for jQuery that allows working with a table's columns as if they were a JSON object. It's useful when you need to apply row by row formatting based on column values and the table is provided as HTML or the creation of the table is out of the your hands. The function also tries to parse numbers and booleans that it finds in columns to make life easier. It runs async so it wont block the browser's main thread for too long.

<h4>Usage example</h4>
Say you have table (id: mainTable) about cars with the following columns
<ul>
<li><b>Make</b> - String</li>
<li><b>Model</b> - String</li>
<li><b>Year</b> - Integer formatted as YYYY</li>
<li><b>Owner</b> - String</li>
</ul>
You can make all rows where make is Audi and year is 2010 or later red with the following:
<pre>
$('table#mainTable').columnWorks(['Make', 'Year'], function() {
  if(this.columns['Make'].val === 'Audi' && this.columns['Year'].val >= 2010) {
    this.row.find('td').css({'background-color': '#FF0000'});
  } 
});
</pre>

<h4>Parameters</h4>
<ul>
  <li><b>columns</b><br>An array of column names to be looked at or an empty array. This tells the function which columns it should look at. If an empty array is given then the function will look at all columns. It is recommended that you provide the column names you plan on using as this will make the function run much faster, especially if you are dealing with a larger table</li>
  <li><b>callback</b><br>A callback function that is executed once for each row. Data for the current row is provided via <i>this</i>. The <i>this</i> object's structure is as follows:
    <ul>
      <li><b>this</b></li>
        <ul>
          <li><b>row</b> - jQuery object of current row</li>
          <li><b>columns</b> - JSON object containing row cells
            <ul>
              <li><b><i>column-name</i></b></li>
                <ul>
                  <li><b>val</b> - Parsed value from this cell</li>
                  <li><b>ref</b> - jQuery object of this cell</li>
                </ul>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </li>
  <li><b>options</b><br>Optional parameters
    <ul>
      <li><b>batchSize</b><br> - Rows to process in one batch before allowing the browser to take control for a bit. <i>Default: Calculated based on the number of columns that will be looked at so that not more that 100 cells get looked at in one batch. As an example, if 5 column names are provided then the default will be 20 (100 / 5)</i></li>
      <li><b>endCallback</b><br> - Callback function to execute once columnWorks has finished. <i>No default value</i></li>
    </ul>
  </li>
</ul>

<h4>Extras</h4>
There are two helper functions that could be helpful in other scenarios: <b>parseText</b> and <b>asyncLoop</b>. They are pretty simple so I wont go into details here, have a look at the code, they are at the end.
