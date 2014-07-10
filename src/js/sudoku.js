var $ = require('jquery')
  , _ = require('lodash');

window.jQuery = $;

var velocity = require('velocity-animate')
var velocityui = require('velocity-animate/velocity.ui')
var animations = require('./animations')
var mixins = require('./mixins')

module.exports = (function($, _){
 
  var settings = {
    puzzles: {
      easy: '84....539...98..179716.5.2..54873...3....284..8.4917..2.8346......2.9...43....1.2',
      moderate: '....986...8.7......35.....15.1.....2.2914...5........631...5.......1..4......7.2.',
      hard: '....2..36.1...7..................1....364......9...75........2..7...45......3....'
    },
    difficulty: 'moderate'
  };

  var boardCache = {};

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

  // Animate appropriate row/column upon invalid entry
  function highlightCells(cells) {
    cells.velocity('callout.sectionInvalid')
      .eq(index)
      .children()
      .velocity('callout.shake');
  }

  // Determine if input is valid
  function isValidInput(input, row, col, region) {

    input = parseInt(input);
    var regionIndex = 3*(row % 3) + (col % 3);



    if (!(1 <= input && input <= 9)) {
      boardCache.rows[row][col] = undefined;
      boardCache.cols[col][row] = undefined;
      boardCache.regions[region][regionIndex] = undefined;
      return false 
    }

    if ((index = _.indexOf(boardCache.rows[row],input)) >= 0) {
      highlightCells($('[row='+row+']').parent());
      return false

    }
    if ((index = _.indexOf(boardCache.cols[col],input)) >= 0) {
      highlightCells($('[col='+col+']').parent());
      return false
    }
    if ((index = _.indexOf(boardCache.regions[region],input)) >= 0) {
      highlightCells($('[region='+region+']').children());
      return false
    }

    boardCache.rows[row][col] = input;
    boardCache.cols[col][row] = input;
    boardCache.regions[region][regionIndex] = input;

    return true;
  }

  function generateBoard(puzzle_string) {
    var row, col;

    var cols, regions,
    rows = _.chain(puzzle_string.split(''))
      .chunk(9) // Chunk into rows
      .value();

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
      .mapMap(_.randMap) // Randomly map numbers 1-9
      .value();

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

    boardCache.rows = rows;
    boardCache.cols = cols;
    boardCache.regions = regions;

    for (row = 0; row < 9; row++) {
      for (col = 0; col < 9; col++) {
        var val = rows[row][col];
        getCell(row, col).val(val).attr('readonly', !!val).hide();
        
      }
    }
    
    $('input').velocity('transition.perspectiveDownIn',{stagger: 4, drag: true});


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

      getCell((cell.row+9) % 9, (cell.col+9) % 9).focus().select();
    }

    // Number keys 1-9
    else if (49 <= e.keyCode && e.keyCode <= 57 ) {
      $(this).val(String.fromCharCode(e.keyCode));
    }

  }

  function handleCellFocusout(e) {

    var cell = getCellPosition(this);
    var val = $(this).val();

    if (val === '') {
      boardCache.rows[cell.row][cell.col] = undefined;
      boardCache.cols[cell.col][cell.row] = undefined;
      boardCache.regions[cell.region][3*(cell.row%3)+(cell.col%3)] = undefined;
      return;
    }

    if (val == boardCache.rows[cell.row][cell.col]) {
      return;
    }

    if (!$(this).attr('readonly') && !isValidInput(val, cell.row, cell.col, cell.region)) {
      $(this).velocity('transition.cellInvalid', function() {
        $(this).val('');
      });
    }

  }

  function handleDifficultyClick(e) {
    var difficulty = $(this).text();

    if (difficulty !== settings.difficulty) {
      settings.difficulty = difficulty;
      $(this).addClass('active').siblings().removeClass('active');
      resetBoard();
    }

  }

  function resetBoard() {
    $('input').velocity('transition.fadeOut');
    $('.board').velocity('transition.boardReset',function() {
      generateBoard(settings.puzzles[settings.difficulty]);
    });
  }

  return {

    init: function() {
      generateBoard(settings.puzzles[settings.difficulty]);

      $('.board').on('keydown', 'input', handleCellKeyDown);
      $('.board').on('focusout', 'input', handleCellFocusout);
      $('.board').on('click', 'input', function(e) {
        $(this).select();
      });
      $('#difficulty').on('click', 'li', handleDifficultyClick);
      $('#new-game').on('click', _.debounce(function() {
        resetBoard();
      }, 770, {'leading': true, 'trailing': false}));

    }
 
  }

})($, _);