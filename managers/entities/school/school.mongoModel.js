const mongoose = require('mongoose');
// const { classroomSchema } = require('../classroom/classroom.mongoModel');


const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  }],
//   classrooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Classroom" }],
  createdAt: { type: Date, default: Date.now },
});

schoolSchema.virtual("classrooms", {
    ref: "Classroom",
    localField: "_id",
    foreignField: "school",
  });
  
schoolSchema.set('toObject', { virtuals: true });
schoolSchema.set('toJSON', { virtuals: true });
  
module.exports = mongoose.model('School', schoolSchema);

// classrooms.find({ school: { '$in': [ ObjectId("6775599cf9e8a9edcacb849d") ] } })