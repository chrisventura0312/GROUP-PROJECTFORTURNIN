const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'Username is required!'], 
        minlength: [3, 'Username must be at least 3 characters long!'],
        unique: [true, 'Username is already taken!'], //no duplicates
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        unique: [ true, 'Email is already taken!'],
        match: [/^\S+@\S+\.\S+$/, 'Email is invalid!'], //email format validation
    },
    password: {
    type: String,
    required: [true, 'Password is required!'],
    minlength: [5, 'Password must be at least 5 characters long!'],
    },
});

userSchema.pre('save', async function (next) {
    try {
        // Checking if email is modified to avoid rehashing of same email
        if (this.isModified('email')) {
            const existingUser = await mongoose.model('User').findOne({ email: this.email });
            if (existingUser) {
                const error = new mongoose.Error.ValidationError(this);
                error.errors.email = new mongoose.Error.ValidatorError({
                    message: 'Email is already taken!',
                    type: 'notvalid',
                    path: 'email',
                    value: this.email
                });
                throw error;
            }
        }
    

        // Hash password before saving to database
        const salt = await bcrypt.genSalt(10); //salt rounds for hashing
        const hashedPassword = await bcrypt.hash(this.password, salt); //hashes password
        this.password = hashedPassword; //replaces password with hashed password
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (password) { //compares password with hashed password for login authentication
    try {
    return await bcrypt.compare(password, this.password);
    } catch (error) {
    throw new Error('Invalid password'); //error message if passwords don't match to display on client side
    }
};

module.exports = mongoose.model('User', userSchema);