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

  return {
 
    generateBoard: function() {
      var row, col,
        rows = generateRootSolution();

      for (row = 0; row < 9; row++) {
        for (col = 0; col < 9; col++) {
          var val = rows[row][col];
          getCell(row, col).val(val);
        }
      }

    }
 
  }
})($, _);