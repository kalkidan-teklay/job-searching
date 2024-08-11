const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const candidateSchema = new Schema({
  name: String,
  status: {
    type: String,
    enum: ['Pending', 'Hired', 'Rejected'],
    default: 'Pending',
  },
});

const Candidate = mongoose.model('Candidatee', candidateSchema);





module.exports = {
  Candidate,
  HiredCandidate,
  RejectedCandidate,
};
