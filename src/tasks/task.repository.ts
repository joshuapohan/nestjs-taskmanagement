import { Repository, EntityRepository } from "typeorm";
import { Task } from './task.entity';
import CreateTaskDto from "./dto/create-task-dto";
import { TaskStatus } from "./task-status.enum";
import GetTasksFilterDto from "./dto/get-tasks-filter.dto";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{

    async getTasks(getTasksFilterDto: GetTasksFilterDto ): Promise<Task[]>{
        const { status, searchTerm } = getTasksFilterDto;
        const query = this.createQueryBuilder('task');

        if(status){
            query.andWhere('task.status = :status', { status })
        }

        if(searchTerm){
            query.andWhere('task.title LIKE :search OR task.description LIKE :search', { search: '%' + searchTerm + '%' })
        }

        const tasks = await query.getMany();
        return tasks;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task>{
        let { title, description } = createTaskDto;
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        await task.save();
        return task;        
    }
}