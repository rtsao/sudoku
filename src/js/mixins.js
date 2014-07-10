var _ = require('lodash')

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
  }
    
});