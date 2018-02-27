import {browser, element, by, promise, ElementFinder} from 'protractor';
import {Key} from 'selenium-webdriver';

export class todoPage {
    navigateTo(): promise.Promise<any> {
        return browser.get('/todos');
    }

    // http://www.assertselenium.com/protractor/highlight-elements-during-your-protractor-test-run/
    highlightElement(byObject) {
        function setStyle(element, style) {
            const previous = element.getAttribute('style');
            element.setAttribute('style', style);
            setTimeout(() => {
                element.setAttribute('style', previous);
            }, 200);
            return 'highlighted';
        }

        return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
    }

    gettodoTitle() {
        const title = element(by.id('todo-list-title')).getText();
        this.highlightElement(by.id('todo-list-title'));

        return title;
    }

    typeACategory(category: string) {
        const input = element(by.id('todoCategory'));
        input.click();
        input.sendKeys(category);
    }

    typeABody(body: string) {
        const input = element(by.id('todoBody'));
        input.click();
        input.sendKeys(body);
    }

    selectUpKey() {
        browser.actions().sendKeys(Key.ARROW_UP).perform();
    }

    backspace() {
        browser.actions().sendKeys(Key.BACK_SPACE).perform();
    }

    getOwner(Owner: string) {
        const input = element(by.id('todoOwner'));
        input.click();
        input.sendKeys(Owner);
        const selectButton = element(by.id('submit'));
        selectButton.click();
    }

    gettodoByFalseStatus() {
        const input = element(by.id('CheckTrue'));
        input.click();
    }

    gettodoByTrueStatus() {
        const input = element(by.id('CheckFalse'));
        input.click();
    }

    getUniquetodo(_id: string) {
        const todo = element(by.id(_id)).getText();
        this.highlightElement(by.id(_id));

        return todo;
    }

    gettodos() {
        return element.all(by.classCategory('todos'));
    }

    clickClearOwnerSearch() {
        const input = element(by.id('OwnerClearSearch'));
        input.click();
    }

    buttonExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('addNewTodo'));
        return element(by.id('addNewTodo')).isPresent();
    }

    clickAddTodoButton(): promise.Promise<void> {
        this.highlightElement(by.id('addNewTodo'));
        return element(by.id('addNewTodo')).click();
    }

}
