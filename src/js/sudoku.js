var $ = require('jquery')
  , _ = require('lodash')

var mixins = require('./mixins')

module.exports = (function($, _){
 
  var settings = {};

  function getCell(row, col) {
    return $('input[row='+row+'][col='+col+']');
  }

  function generateRootSolution() {
    var rows = [];

    for (var i=0; i<9; i++) {
      var offset = i ? (3*i % 8) || 8 : 0;
      rows.push(_.rotate(_.range(1,10), offset));
    }

    return rows;

  }

  function generateBoard() {
    var row, col, rows = generateRootSolution();

    for (row = 0; row < 9; row++) {
      for (col = 0; col < 9; col++) {
        var val = rows[row][col];
        getCell(row, col).val(val);
      }
    }

  }

  function focusCell(row, col) {
    getCell(row, col).focus().select();
  }

  function handleCellKeyDown(e) {
    
    // Arrow keys
    if (37 <= e.keyCode && e.keyCode <= 40) {
      e.preventDefault();

      var col = parseInt($(this).attr('col'));
      var row = parseInt($(this).attr('row'));

      switch (e.keyCode) {
        case 37:
          col--;
          break;
        case 38:
          row--;
          break;
        case 39:
          col++;
          break;
        case 40:
          row++;
          break;
      }

      focusCell((row+9) % 9, (col+9) % 9);
    }

  }



  return {
    init: function() {
      generateBoard();

      $('.board').on('keydown', 'input', handleCellKeyDown);

    }

 
  }
})($, _);