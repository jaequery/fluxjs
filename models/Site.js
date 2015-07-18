var mongoose = require('mongoose');

var siteSchema = new mongoose.Schema({
  domain: { type: String, unique: true },
  data: {
    items: [],
    settings: {}
  },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now(), index: true },
  accessed_at: { type: Date, default: Date.now(), index: true }
});

//siteSchema.index({domain: 1}, {unique: true});

module.exports = mongoose.model('Site', siteSchema);
