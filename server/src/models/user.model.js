import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userScheam = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },  
        password: {
            type: String,
            required: true,
        },
        tasks: [{
            type: Schema.Types.ObjectId,
            ref: "Task"
        }]
    },
    {
        timestamps: true
    }
);

userScheam.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

userScheam.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(this.password, password);
}

userScheam.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userScheam.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._is,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userScheam);