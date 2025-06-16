import mongoose, { Document, Schema, Model, CallbackError } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    createdAt: Date
    updatedAt: Date
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema ({
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false,
    }
},
{
    timestamps: true,
});

UserSchema.pre<IUser>("save", async function(next) {
    if (!this.isModified("password") || !this.password) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as CallbackError | undefined);
    }
});

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", UserSchema) as Model<IUser>;
