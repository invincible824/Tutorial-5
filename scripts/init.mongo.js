/*
 * Run using the mongo shell. For remote databases, ensure that the
 * connection string is supplied in the command line. For example:
 * localhost:
 *   mongo issuetracker scripts/init.mongo.js
 * Atlas:
 *   mongo mongodb+srv://user:pwd@xxx.mongodb.net/issuetracker scripts/init.mongo.js
 * MLab:
 *   mongo mongodb://user:pwd@xxx.mlab.com:33533/issuetracker scripts/init.mongo.js
 */
//auto increase

//init mongo db : waitlist and counter
db.counters.remove({})
db.waitlist.remove({})
db.counters.insert({_id:'issues', current:0})
function getNextSequenceValue(){
    var sequenceDocument = db.count.findAndModify(
       {
          query:{_id: 'count' },
          update: {$inc:{value:1}},
          "new":true
       });
    return sequenceDocument.value;
 }


