import { TaskStatus } from "../tasks.model";
import { IsOptional, IsIn, IsNotEmpty } from "class-validator";

export default class GetTasksFilterDto{

    @IsOptional()
    @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
    status: TaskStatus;

    @IsOptional()
    @IsNotEmpty()
    searchTerm: string;
}