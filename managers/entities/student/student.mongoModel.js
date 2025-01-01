const mongoose = require('mongoose');

// Define Student schema
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now }, // Optional timestamp
});

// Define virtual for "classroom" reference
studentSchema.virtual('classroom', {
  ref: 'Classroom',         // Model to reference
  localField: '_id',        // Field in this schema
  foreignField: 'students', // Field in the Classroom model
});

// Enable virtuals in output
studentSchema.set('toObject', { virtuals: true });
studentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Student', studentSchema);
