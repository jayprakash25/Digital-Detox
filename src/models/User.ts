import mongoose, {Schema, Document} from "mongoose";

//Interest Schema
export interface Interest extends Document{
    name: string;
    description: string;
}

const interestSchema: Schema<Interest> = new Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String},
});

//VideoSchema
export interface Video extends Document {
    youtubeId: string;
    title: string;
    description: string;
    thumbnail: string;
    channelId: string;
    channelTitle: string;
    publishedAt: string;
    interests: mongoose.Types.ObjectId[];
}

const VideoSchema: Schema<Video> = new Schema({
    youtubeId: {type: String, required: true, unique: true},
    title: {type: String, required: true},
    description: {type: String},
    thumbnail: {type: String},
    channelId: {type: String},
    channelTitle: {type: String},
    publishedAt: {type: String},
    interests: [{type: Schema.Types.ObjectId, ref: "Interest"}]
})

// User Schema
export interface User extends Document {
    googleId: string;
    name: string;
    email: string;
    image: string;
    interests: mongoose.Types.ObjectId[];
    strictnessLevel: number;
    notificationsEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema<User> = new Schema({
    googleId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    interests: [{ type: Schema.Types.ObjectId, ref: "Interest" }],
    strictnessLevel: { type: Number, default: 3, min: 1, max: 5 },
    notificationsEnabled: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// UserVideoInteraction Schema
export interface UserVideoInteraction extends Document {
    user: mongoose.Types.ObjectId;
    video: mongoose.Types.ObjectId;
    watchedAt: Date;
    isRelevant: boolean;
}

const UserVideoInteractionSchema: Schema<UserVideoInteraction> = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    video: { type: Schema.Types.ObjectId, ref: "Video", required: true },
    watchedAt: { type: Date, default: Date.now },
    isRelevant: { type: Boolean, required: true }
});

// Create and export models
export const InterestModel = mongoose.models.Interest || mongoose.model<Interest>("Interest", interestSchema);
export const VideoModel = mongoose.models.Video || mongoose.model<Video>("Video", VideoSchema);
export const UserModel = mongoose.models.User || mongoose.model<User>("User", UserSchema);
export const UserVideoInteractionModel = mongoose.models.UserVideoInteraction || mongoose.model<UserVideoInteraction>("UserVideoInteraction", UserVideoInteractionSchema);
