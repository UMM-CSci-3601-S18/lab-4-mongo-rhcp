import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material'
import {TodoListService} from "./todo-list.service";
import {Todo} from "./todo";


@Component({
    selector: 'add-todo.component',
    templateUrl: 'add-todo.component.html',
})
export class AddTodoComponent {
    public newTodoCategory:string;
    public newTodoStatus: boolean;
    public newTodoOwner: string;
    public newTodoBody: string;
    private todoAddSuccess : Boolean = false;

    public todos: Todo[];

    constructor(public todoListService: TodoListService,
        public dialogRef: MatDialogRef<AddTodoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    addNewTodo(category: string, status: boolean, owner : string, body : string) : void{

        //Here we clear all the fields, there's probably a better way
        //of doing this could be with forms or something else
        this.newTodoCategory = null;
        this.newTodoStatus = false; // Starts as false because we are working with binary checkbox instead of text-field
        this.newTodoOwner = null;
        this.newTodoBody = null;

        this.todoListService.addNewTodo(category, status, owner, body).subscribe(
            succeeded => {
                this.todoAddSuccess = succeeded;
                // Once we added a new Todo, refresh our todo list.
                // There is a more efficient method where we request for
                // this new todo from the server and add it to todos, but
                // for this lab it's not necessary
                //this.todoListComponent.refreshTodos();
            });
    }

}
