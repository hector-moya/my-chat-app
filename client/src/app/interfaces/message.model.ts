import { User } from "./user.model";

export interface Message {
    _id?: string;
    userId?: string | User;
    user?: User;
    imageUrl?: string;
    message: string;
    channelId: string;
    createdAt: Date;
}
