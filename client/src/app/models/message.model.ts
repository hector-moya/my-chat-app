export interface Message {
    _id: string;
    userId: string;
    message: string;
    channelId: string;
    createdAt: Date;
}
