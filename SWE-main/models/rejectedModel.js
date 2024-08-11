let mongoose = require('mongoose')

const rejectedCandidateSchema = new mongoose.Schema({
    name: String,
  });
  
const RejectedCandidate = mongoose.model('RejectedCandidate', rejectedCandidateSchema);

module.exports = RejectedCandidate