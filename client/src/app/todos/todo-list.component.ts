import {Component, OnInit} from '@angular/core';
import {TodoListService} from "./todo-list.service";
import {Todo} from "./todo";
import {Observable} from "rxjs";
import {MatDialog} from '@angular/material';
import {AddTodoComponent} from "./add-todo.component"

@Component({
    selector: 'todo-list-component',
    templateUrl: 'todo-list.component.html',
    styleUrls: ['./todo-list.component.css'],
})

export class TodoListComponent implements OnInit {
    //These are public so that tests can reference them (.spec.ts)
    public todos: Todo[];
    public filteredTodos: Todo[];

    public CheckTrue: boolean;
    public CheckFalse: boolean;
    public todoCategory : string;
    public todoStatus : boolean;
    public todoOwner : string;
    public todoBody : string;

    public loadReady: boolean = false;

    //Inject the TodoListService into this component.
    //That's what happens in the following constructor.
    //panelOpenState: boolean = false;
    //We can call upon the service for interacting
    //with the server.
    constructor(public todoListService: TodoListService, public dialog: MatDialog) {

    }

    openDialog(): void {
        let dialogRef = this.dialog.open(AddTodoComponent, {
            width: '500px',
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }


    public filterTodos(searchTrue: boolean, searchFalse: boolean, searchCategory: string, searchBody: string): Todo[] {

        this.filteredTodos = this.todos;

        // Filter by Status
        if (searchTrue !== true && searchTrue !== false) {
            this.CheckTrue = true;
        }
        if (searchFalse !== true && searchFalse !== false) {
            this.CheckFalse = true;
        }
        if (searchTrue !== searchFalse) {
            if (searchTrue) {
                this.filteredTodos = this.filteredTodos.filter(todo => todo.status);
            }
            else {
                this.filteredTodos = this.filteredTodos.filter(todo => ! todo.status);
            }
        }
        else {
            if (! searchTrue) {
                this.filteredTodos = null;
            }
        }


        // Filter by Category
        if (searchCategory != null) {
            searchCategory = searchCategory.toLocaleLowerCase();

            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !searchCategory || todo.category.toLowerCase().indexOf(searchCategory) !== -1;
            });
        }

        // Filter by Body Contents
        if (searchBody != null) {
            searchBody = searchBody.toLocaleLowerCase();

            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !searchBody || todo.body.toLowerCase().indexOf(searchBody) !== -1;
            });
        }

        return this.filteredTodos;
    }

    StatusRefactor(inputStatus: boolean) {
        if (inputStatus) {
            return 'Complete';
        }
        else {
            return 'Incomplete';
        }
    }

    StatusImage(inputStatus: boolean) {
        if (inputStatus) {
            return '✔';
        }
    }

    /**
     * Starts an asynchronous operation to update the todos list
     *
     */
    refreshTodos(): Observable<Todo[]> {
        //Get Todos returns an Observable, basically a "promise" that
        //we will get the data from the server.
        //
        //Subscribe waits until the data is fully downloaded, then
        //performs an action on it (the first lambda)

        let todos : Observable<Todo[]> = this.todoListService.getTodos();
        todos.subscribe(
            todos => {
                this.todos = todos;
                this.filterTodos(this.CheckTrue, this.CheckFalse, this.todoCategory, this.todoBody);
            },
            err => {
                console.log(err);
            });
        return todos;
    }


    loadService(): void {
        this.loadReady = true;
        this.todoListService.getTodos(this.todoOwner).subscribe(
            todos => {
                this.todos = todos;
                this.filteredTodos = this.todos;
            },
            err => {
                console.log(err);
            }
        );
    }


    ngOnInit(): void {
        this.refreshTodos();
        this.loadService();
    }
}
