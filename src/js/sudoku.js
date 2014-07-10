var $ = require('jquery')
  , _ = require('lodash');

window.jQuery = $;

var velocity = require('velocity-animate')
var velocityui = require('velocity-animate/velocity.ui')
var animations = require('./animations')

var mixins = require('./mixins')

module.exports = (function($, _){
 
  var settings = {};

  var boardCache = {
    rows: [],
    cols: [],
    regions: []
  }

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

  function isValidInput(input, row, col) {
    return false;
  }

  function generateRootSolution() {
    var rows = [];

    for (var i=0; i<9; i++) {
      var offset = i ? (3*i % 8) || 8 : 0;
      rows.push(_.rotate(_.range(1, 10), offset));
    }

    return rows;

  }

  function generateBoard() {
    var row, col;

    var cols, regions, rows = generateRootSolution();

    rows = _.chain(rows)
      .chunk(3) // Chunk rows into bands
      .map(_.shuffle) // Permute rows within each band
      .shuffle() // Permute bands
      .flatten(true) // Flatten bands
      .zip() // Swap row/column
      .chunk(3) // Chunk columns into stacks
      .map(_.shuffle) // Shuffle columns within each stack
      .shuffle() // Permute stacks
      .flatten(true) // Eliminate stack chunks
      .value();

    // Eliminate some values
    rows = _.map(rows,function(row){
        return _.sampleSparse(row,4);
      });

    cols = _.zip(rows);

    regions = _.chain(rows)
      .chunk(3) // Chunk rows into bands
      .zip() // Group rows by position within band
      .mapMap(_.partialRight(_.chunk, 3)) // Chunk each row into 3-column pieces
      .map(_.partialRight(_.flatten, true)) // Group 3-column row pieces by row position in region
      .zip() // Group 3-column row pieces together by region
      .flatten() // Flatten 3-column pieces
      .chunk(9) // Group cells by region
      .map(function(array) { // Group cells into column chunks
        return _.chunk(array, 3)
      })
      .map(function(array) { // Swap row and column within regions
        return _.zip(array) 
      })
      .flatten() // Flatten
      .chunk(9) // Group by region
      .value();


    for (row = 0; row < 9; row++) {
      for (col = 0; col < 9; col++) {
        var val = rows[row][col];
        if (val) {
          getCell(row, col).val(val).attr('readonly', true);
        }
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
    var val = $(this).val();

    if (!$(this).attr('readonly') && !isValidInput(val, cell.row, cell.col)) {
      $(this).velocity('transition.cellInvalid', function() {
        $(this).val('');
      });
    }

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