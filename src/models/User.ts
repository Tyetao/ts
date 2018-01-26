import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt-nodejs";

const UserSchema = new mongoose.Schema({
  name: {type: String, unique: true},
  password: String
}, { timestamps: true });

UserSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

export const UserModel = mongoose.model('User', UserSchema);
