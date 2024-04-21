import { type Model, Schema, model, models, SchemaDefinitionProperty } from "mongoose";
import { v4 } from "uuid";

export default function getSessionModel(UserModel: Model<any>, name: string) {
    // prettier-ignore
    return models[name] || model(name, new Schema({
        _id: {
            type: String,
            default: v4
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: UserModel,
            required: true
        },
        expiresAt: Date
    } as SchemaDefinitionProperty));
}
