const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    dueDate: {
      type: Date,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Add index for better query performance
taskSchema.index({ user: 1, status: 1 });

taskSchema.methods.toJSON = function () {
  const task = this.toObject();
  task.id = task._id;
  delete task._id;
  delete task.__v;
  return task;
};

module.exports = mongoose.model('Task', taskSchema);
