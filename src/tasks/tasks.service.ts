import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import * as uuid from 'uuid/v1';
import CreateTaskDto from './dto/create-task-dto';
import GetTasksFilterDto from './dto/get-tasks-filter.dto';
import { domainToUnicode } from 'url';

@Injectable()
export class TasksService {
    private tasks : Task[] = [];

    getAllTasks(): Task[]{
        return this.tasks;
    }

    getTasksWithFilters(tasksFilterDto: GetTasksFilterDto): Task[]{
        const {status, searchTerm} = tasksFilterDto;
        let tasks = this.getAllTasks();
        if(status){
            tasks = tasks.filter(task => task.status === status);
        }
        if(searchTerm){
            tasks = tasks.filter(task=>
                task.title.includes(searchTerm) || task.description.includes(searchTerm)
            );
        }
        return tasks;
    }

    getTaskById(id: string): Task{
        const found =  this.tasks.find(task=>task.id === id);
        if(!found){
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        return found;
    }

    deleteTaskById(id: string) : boolean{
        const found =  this.tasks.find(task=>task.id === id);
        this.tasks = this.tasks.filter(task => task.id !== found.id);
        return true;
    }

    updateTaskById(id: string, status: TaskStatus) : Task{
        let taskIdx = this.tasks.findIndex(task=>task.id === id);
        this.tasks[taskIdx].status = status;
        return this.tasks[taskIdx];
    }

    createTask(createTaskDto: CreateTaskDto){
        const {title, description} = createTaskDto;
        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        }
        this.tasks.push(task);
        return task;
    }
}
