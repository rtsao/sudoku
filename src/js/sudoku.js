var $ = require('jquery')
  , _ = require('lodash')

var mixins = require('./mixins')

module.exports = (function($, _){
 
  var settings = {};

  function getCell(row, col) {
    return $('input[row='+row+'][col='+col+']');
  }

  function getCellPosition(el) {
 
    var row = parseInt($(el).attr('row'))
      , col = parseInt($(el).attr('col'))
      , region = 3*Math.floor(row/3) + Math.floor(col/3);

    return {
      row: row,
      col: col,
      region: region
    };

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

      var cell = getCellPosition(this);

      switch (e.keyCode) {
        case 37:
          cell.col--;
          break;
        case 38:
          cell.row--;
          break;
        case 39:
          cell.col++;
          break;
        case 40:
          cell.row++;
          break;
      }

      focusCell((cell.row+9) % 9, (cell.col+9) % 9);
    }

    // Number keys 1-9
    else if (49 <= e.keyCode && e.keyCode <= 57 ) {
      $(this).val(String.fromCharCode(e.keyCode));
    }

  }

  function handleCellFocusout(e) {

      var cell = getCellPosition(this);
      console.log('Focusout:', cell);

  }



  return {
    init: function() {
      generateBoard();

      $('.board').on('keydown', 'input', handleCellKeyDown);
      $('.board').on('focusout', 'input', handleCellFocusout);
      $('.board').on( 'click', 'input', function(e) {
        $(this).select();
      });


    }

 
  }
})($, _);