const cryptoBrowserify = require('crypto-browserify');



for (const key of Object.keys(cryptoBrowserify)) {
  exports[key] =  cryptoBrowserify[key];
}
