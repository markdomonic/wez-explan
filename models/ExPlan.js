const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const slug = require('slugs');

const exPlanSchema = new mongoose.Schema({
  exercise: {
    type: String,
    trim: true,
    required: 'Exercise field is required!'
  },
  slug: String,
  keyPoints: {
    type: String,
    trim: true
  },
  type: String,
  muscleGroup: String,
  bodyPart: String,
  reps: Number,
  time: String,
  intensity: String,
  tags: [String],
  photo: String
});

exPlanSchema.pre('save', function(next) {
  // Only do this if new exercise so if not modified
  if (!this.isModified('exercise')) {
    next(); // skip further code below
    return; // exit pre save routine
  }
  //console.log(this);
  this.slug = slug(this.exercise);
  next();
  // TODO: could result in overlapping slugs so need to make unique
})

// export the ExPlan model
module.exports = mongoose.model('ExPlan', exPlanSchema);
