import {todoPage} from './todo-list.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

const origFn = browser.driver.controlFlow().execute;

// https://hassantariqblog.wordpress.com/2015/11/09/reduce-speed-of-angular-e2e-protractor-tests/
// browser.driver.controlFlow().execute = function () {
//     let args = arguments;
//
//     // queue 100ms wait between test
//     // This delay is only put here so that you can watch the browser do its thing.
//     // If you're tired of it taking long you can remove this call
//     origFn.call(browser.driver.controlFlow(), function () {
//         return protractor.promise.delayed(100);
//     });
//
//     return origFn.apply(browser.driver.controlFlow(), args);
// };

describe('todo list', () => {
    let page: todoPage;

    beforeEach(() => {
        page = new todoPage();
    });

    it('should get and highlight todos title attribute ', () => {
        page.navigateTo();
        expect(page.gettodoTitle()).toEqual('Todos');
    });

    // Filter by category text box
    it('should type something in filter category box and check that it returned correct element', () => {
        page.navigateTo();
        page.typeACategory('video games');
        expect(page.getUniquetodo('Ipsum esse est ullamco magna tempor ' +
            'anim laborum non officia deserunt veniam commodo. Aute minim ' +
            'incididunt ex commodo.')).toEqual('Ipsum esse est ullamco magna t...');

    });

    // Filter by body text box
    it('should type something in filter body box and check that it returned correct element', () => {
        page.navigateTo();
        page.typeABody('tempor');
        expect(page.getUniquetodo('In sunt ex non tempor cillum commodo ' +
            'amet incididunt anim qui commodo quis. Cillum non labore ex sint ' +
            'esse.')).toEqual('In sunt ex non tempor cillum c...');

    });

    // Filter by body text box and category text box
    it('should type something in filter body box and filter category box and check that it returned correct element', () => {
        page.navigateTo();
        page.typeABody('tempor');
        page.typeACategory('homework');
        expect(page.getUniquetodo('Excepteur irure et mollit esse laboris ad ' +
            'tempor ullamco. Eiusmod nostrud qui veniam adipisicing aliqua voluptate ' +
            'reprehenderit ut amet excepteur.')).toEqual('Excepteur irure et mollit esse...');

    });

    // Filter by status: Incomplete
    it('should click on the complete button one time and check that it returned incomplete todos', () => {
        page.navigateTo();
        page.gettodoByFalseStatus();
        expect(page.getUniquetodo('Proident cupidatat exercitation id ' +
            'ullamco magna do qui aliquip id. Eiusmod labore non nostrud culpa ' +
            'duis incididunt incididunt esse occaecat amet officia.')).toEqual('Proident cupidatat exercitatio...');

    });

    // Filter by status: Complete
    it('should click on the incomplete button one time and check that it returned complete todos', () => {
        page.navigateTo();
        page.gettodoByTrueStatus();
        expect(page.getUniquetodo('Nostrud culpa ut consectetur nulla ' +
            'laboris anim sunt exercitation tempor. Culpa officia eu sint magna ' +
            'reprehenderit ex pariatur tempor aliquip cupidatat qui amet consectetur.')).toEqual('✔ Nostrud culpa ut consectetur n...');

    });

    // Filter by body text box, category text box, status: complete
    it('should type something in filter body box, filter category box and click the incomplete button one time and then check that it returned correct element', () => {
        page.navigateTo();
        page.typeABody('sunt');
        page.typeACategory('software design');
        page.gettodoByTrueStatus();
        expect(page.getUniquetodo('Nostrud proident occaecat in occaecat in ' +
            'anim cupidatat culpa velit mollit exercitation dolor incididunt ut. ' +
            'Sint incididunt consectetur velit sunt officia aliquip.')).toEqual('✔ Nostrud proident occaecat in o...');

    });

    // Filter by body text box, category text box, status: incomplete
    it('should type something in filter body box, filter category box, and click the complete button one time and then check that it returned correct element', () => {
        page.navigateTo();
        page.typeABody('sunt');
        page.typeACategory('software design');
        page.gettodoByFalseStatus();
        expect(page.getUniquetodo('Lorem mollit consequat fugiat amet aute pariatur ' +
            'dolore ullamco cupidatat. Aute elit consequat cupidatat sunt.')).toEqual('Lorem mollit consequat fugiat ...');

    });


        it('Should open the expansion panel and get the owner', () => {
            page.navigateTo();
            page.getOwner('F');

            expect(page.getUniquetodo('Ullamco irure laborum magna dolor non. Anim occaecat adipisicing cillum eu magna in.')).toEqual('✔ Ullamco irure laborum magna do...');

            // This is just to show that the panels can be opened
            browser.actions().sendKeys(Key.TAB).perform();
            browser.actions().sendKeys(Key.ENTER).perform();
        });

        it('Should allow us to filter todos based on owner', () => {
            page.navigateTo();
            page.getOwner('B');

            //Blanche
            expect(page.getUniquetodo('In sunt ex non tempor cillum commodo amet incididunt ' +
                'anim qui commodo quis. Cillum non labore ex sint esse.')).toEqual('In sunt ex non tempor cillum c...');
            //Barry
            expect(page.getUniquetodo('Nisi sit non non sunt veniam pariatur. Elit reprehenderit ' +
                'aliqua consectetur est dolor officia et adipisicing elit officia nisi elit enim nisi.')).toEqual('✔ Nisi sit non non sunt veniam p...');

        });

// For examples testing modal dialog related things, see:
// https://code.tutsplus.com/tutorials/getting-started-with-end-to-end-testing-in-angular-using-protractor--cms-29318
// https://github.com/blizzerand/angular-protractor-demo/tree/final

        it('Should have an add todo button', () => {
            page.navigateTo();
            expect(page.buttonExists()).toBeTruthy();
        });

        it('Should open a dialog box when add todo button is clicked', () => {
            page.navigateTo();
            expect(element(by.css('add-todo')).isPresent()).toBeFalsy('There should not be a modal window yet');
            element(by.id('addNewtodo')).click();
            expect(element(by.css('add-todo')).isPresent()).toBeTruthy('There should be a modal window now');
        });

    it('Should actually add the todo with the information we put in the fields', () => {
        page.navigateTo();
        page.clickAddtodoButton();
        element(by.id('categoryField')).sendKeys('video games');
        // Need to use backspace because the default value is -1. If that changes, this will change too.
        element(by.id('CheckTrue'));
        element(by.id('ownerField')).sendKeys('Roym');
        element(by.id('bodyField')).sendKeys('I will avenge my family, even if it means destroying myself');
        element(by.id('confirmAddtodoButton')).click();
        // This annoying delay is necessary, otherwise it's possible that we execute the `expect`
        // line before the add todo has been fully processed and the new todo is available
        // in the list.
        setTimeout(() => {
            expect(page.getUniquetodo('I will avenge my family, even if it means destroying myself')).toMatch('Roym.*'); // toEqual('Roym');
        }, 10000);
    });

    it('Should allow us to put information into the fields of the add todo dialog', () => {
        page.navigateTo();
        page.clickAddtodoButton();
        expect(element(by.id('categoryField')).isPresent()).toBeTruthy('There should be a category field');
        element(by.id('categoryField')).sendKeys('homework');
        expect(element(by.id('statusField')).isPresent()).toBeTruthy('There should be a status field');
        element(by.id('CheckTrue'));
        expect(element(by.id('ownerField')).isPresent()).toBeTruthy('There should be an owner field');
        element(by.id('ownerField')).sendKeys('Rae');
        expect(element(by.id('bodyField')).isPresent()).toBeTruthy('There should be a body field');
        element(by.id('bodyField')).sendKeys('Hi, Im Royms younger sister, why didnt he save me?');
        element(by.id('exitWithoutAddingButton')).click();
    });

});

