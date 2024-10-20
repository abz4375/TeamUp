import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String, // title of the project
    required: [true, 'Please add title'],
  },
  description: {
    type: String, // project description
  },
  owner: {
    type: String, // email of owner
    required: [true, 'Please add owner'],
  },
  maintainers: {
    type: Array, // array of emails of maintainers
    required: [true, 'Please add maintainers'],
  },
  contributors: {
    type: Array, // array of emails of contributors
    required: [true, 'Please add contributors'],
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
/*
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
*/

export const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

