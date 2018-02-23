import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

import {CustomModule} from '../custom.module';

import {Todo} from './todo';
import {TodoListComponent} from './todo-list.component';
import {TodoListService} from './todo-list.service';

describe('Todo list', () => {

    let todoList: TodoListComponent;
    let fixture: ComponentFixture<TodoListComponent>;

    let todoListServiceStub: {
        getTodos: () => Observable<Todo[]>
    };

    beforeEach(() => {
        // stub TodoService for test purposes
        todoListServiceStub = {
            getTodos: () => Observable.of([
                {
                    _id: '46s4fgh19s8gh54981564sh',
                    owner: 'Socrates',
                    status: true,
                    body: ': And does the same apply to this as the previous ones: it is not ' +
                    'because it is a loved thing that it is loved by those who love it, but it is a ' +
                    'loved thing because it is loved?',
                    category: 'Euthyphro',
                },
                {
                    _id: '56s2fg2sdf8g489s4y9s29hh',
                    owner: 'Dionysus',
                    status: false,
                    body: 'I can\'t describe it. \n' +
                    'But yet I\'ll tell you in a riddling way. \n' +
                    'Have you e\'er felt a sudden lust for soup?',
                    category: 'Frogs',
                },
                {
                    _id: '5189ser4y56se1g89sg614',
                    owner: 'Heracles',
                    status: true,
                    body: 'Soup! Zeus-a-mercy, yes, ten thousand times.',
                    category: 'Frogs',
                },
                {
                    _id: 'g89189s1g6g179s8g4s6d8g54s',
                    owner: 'Descartes',
                    status: false,
                    body: 'Then without doubt I exist also ' +
                    'if he deceives me, and let him deceive me as much as he will, he can ' +
                    'never cause me to be nothing so long as I think that I am something. ',
                    category: 'Meditations',
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [TodoListComponent],
            // providers:    [ TodoListService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers: [{provide: TodoListService, useValue: todoListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]

        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TodoListComponent);
            todoList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('contains all the todos', () => {
        expect(todoList.todos.length).toBe(4);
    });

    it('contains a todo owned by \'Socrates\'', () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === 'Socrates')).toBe(true);
    });

    it('contain a todo owned by \'Descartes\'', () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === 'Descartes')).toBe(true);
    });

    it('doesn\'t contain a todo owned by \'Anselm\'', () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === 'Anselm')).toBe(false);
    });

    it('has two todos of category \'Frogs\'', () => {
        expect(todoList.todos.filter((todo: Todo) => todo.category === 'Frogs').length).toBe(2);
    });
    it('todo list filters by owner', () => {
        expect(todoList.filteredTodos.length).toBe(4);
        todoList.todoOwner = 'a';
        const a: Observable<Todo[]> = todoList.refreshTodos();
        a.do(x => Observable.of(x))
            .subscribe(x => expect(todoList.filteredTodos.length).toBe(3));
    });

    it('todo list filters by status', () => {
        expect(todoList.filteredTodos.length).toBe(4);
        todoList.CheckTrue = true;
        todoList.CheckFalse = false;
        const a: Observable<Todo[]> = todoList.refreshTodos();
        a.do(x => Observable.of(x))
            .subscribe(x => expect(todoList.filteredTodos.length).toBe(2));
    });

    it('todo list filters by owner and status', () => {
        expect(todoList.filteredTodos.length).toBe(4);
        todoList.CheckTrue = false;
        todoList.CheckFalse = true;
        todoList.todoOwner = 'y';
        const a: Observable<Todo[]> = todoList.refreshTodos();
        a.do(x => Observable.of(x))
            .subscribe(x => expect(todoList.filteredTodos.length).toBe(1));
    });

    it('todo list filters by owner, content, and status', () => {
        expect(todoList.filteredTodos.length).toBe(4);
        todoList.CheckTrue = true;
        todoList.CheckFalse = false;
        todoList.todoOwner = 'l';
        todoList.todoBody = 'oup';
        const a: Observable<Todo[]> = todoList.refreshTodos();
        a.do(x => Observable.of(x))
            .subscribe(x => expect(todoList.filteredTodos.length).toBe(1));
    });

});

describe('Misbehaving Todo List', () => {
    let todoList: TodoListComponent;
    let fixture: ComponentFixture<TodoListComponent>;

    let todoListServiceStub: {
        getTodos: () => Observable<Todo[]>
    };

    beforeEach(() => {
        // stub TodoService for test purposes
        todoListServiceStub = {
            getTodos: () => Observable.create(observer => {
                observer.error('Error-prone observable');
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [TodoListComponent],
            providers: [{provide: TodoListService, useValue: todoListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TodoListComponent);
            todoList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('generates an error if we don\'t set up a TodoListService', () => {
        // Since the observer throws an error, we don't expect todos to be defined.
        expect(todoList.todos).toBeUndefined();
    });
});
