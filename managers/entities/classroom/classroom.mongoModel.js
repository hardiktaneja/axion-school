// const { uniqueId } = require('lodash');
const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }]
});

// Enable virtuals in output
classroomSchema.set('toObject', { virtuals: true });
classroomSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Classroom', classroomSchema, 'classrooms');
// module.exports.classroomSchema = classroomSchema;
