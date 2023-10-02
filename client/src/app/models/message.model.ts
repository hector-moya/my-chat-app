import { User } from "./user.model";

export interface Message {
    _id?: string;
    userId: string | User;
    message: string;
    channelId: string;
    createdAt: Date;
}
