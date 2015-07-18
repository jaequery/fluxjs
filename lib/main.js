var Site = require('../models/Site');

var main = {
    get_site: function(domain, cb){
        Site.findOne({'domain': domain}, function(err, site){
            cb(site);
        });
    },
    save_site: function(items, cb){
        console.log(items);
        cb();
    }
}

module.exports = main
