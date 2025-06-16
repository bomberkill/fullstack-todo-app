export interface Task {
    _id: string;
    title: string;
    description: string;
    completed: boolean;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}