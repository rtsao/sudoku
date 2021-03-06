var _ = require('lodash')

var randMapping = _.shuffle(_.range(1, 10));

_.mixin({

  rotate: function(array, offset) {
    offset = offset % array.length;
    return array.slice(offset).concat(array.slice(0, offset));
  },

  //Chunk source from v3.0 lodash: https://github.com/lodash/lodash/pull/585/files#r13682753
  chunk: function(array, chunkSize) {
    var index = 0,
    length = array ? array.length : 0,
    result = [];

    chunkSize = Math.max(+chunkSize || 1, 1);
    
    while (index < length) {
      result.push(array.slice(index, (index += chunkSize)));
    }
    return result;
  },

  sampleSparse: function(array, sampleSize) {
    var values = _.sample(array, array.length-sampleSize);
    return _.map(array, function(item) {
      if (_.contains(values, item)) {
        return item;
      }
      else {
        return;
      }
    })
  },

  mapMap: function(arrayOfArrays, fn) {
    return _.map(arrayOfArrays, function(array) {
      return _.map(array, function(item) {
        return fn(item);
      })
    })
  },

  randMap: function(i) {
    return randMapping[i-1];
  }

});