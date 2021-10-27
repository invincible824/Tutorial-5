db.counters.remove({})
db.waitlist.remove({})
db.counters.insert({_id:'issues', current:0})

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
db.count.remove({});
db.count.insert({_id:'count', value : 0})
function getNextSequenceValue(){
    var sequenceDocument = db.count.findAndModify(
       {
          query:{_id: 'count' },
          update: {$inc:{value:1}},
          "new":true
       });
    return sequenceDocument.value;
 }



db.waitlist.remove({});

const waitlist_queue = [
  { 
    _id: getNextSequenceValue(),
    id: 1, 
    name: 'Hu', 
    phone:154,
    created: new Date('2019-01-15')
  },
  {
    _id: getNextSequenceValue(),
    id: 2, 
    name: 'Yuxuan',
    phone: 489748,
    created: new Date('2019-01-16')
  },
];

db.waitlist.insertMany(waitlist_queue);
const count = db.waitlist.count();
print('Inserted', count, 'issues');

db.waitlist.createIndex({ id: 1 }, { unique: true });
db.waitlist.createIndex({ name: 1 });
db.waitlist.createIndex({ created: 1 });



