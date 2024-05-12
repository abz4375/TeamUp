import mongoose from 'mongoose';
const bcrypt = require('bcrypt'); // Import bcrypt for hashing

const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({
  // id: {
  //   type: Number,
  //   required: true,
  //   unique: true,
  // },
  // name: {
  //   firstName: {
  //     type: String,
  //     required: [true, 'Please add first-name'],
  //   },
  //   lastName: {
  //     type: String,
  //     required: [true, 'Please add last-name'],
  //   },
  // },
  firstName: {
    type: String,
    required: [true, 'Please add first-name'],
  },
  lastName: {
    type: String,
    required: [true, 'Please add last-name'],
  },
  username: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please add password'],
  },
  emailId: {
    type: String,
    required: [true, 'Please add email id'],
    unique: true,
  },
  projects: {
    type: Array,
    // required: [true, 'Please add projects'],
  },
  tasks: {
    type: Array,
    // required: [true, 'Please add tasks'],
  },
  contributions: {
    type: Array,
    // required: [true, 'Please add contributions'],
  },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  const user = this;
  
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  try {
    // generate a salt
    const salt = await bcrypt.genSalt(10);

    // hash the password with the salt
    user.password = await bcrypt.hash(user.password, salt);

    next();
  } catch (error:any) {
    return next(error);
  }
});

userSchema.methods.matchPassword = async function(enteredPassword:string) {
  return await bcrypt.compare(enteredPassword, this.password);
};


export const User = mongoose.models.User || mongoose.model('User', userSchema);

