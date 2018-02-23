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

    typeACategory(Category: string) {
        const input = element(by.id('todoCategory'));
        input.click();
        input.sendKeys(Category);
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
        let input = element(by.id('CheckTrue'));
        input.click();
    }

    gettodoByTrueStatus() {
        let input = element(by.id('CheckFalse'));
        input.click();
    }

    getUniquetodo(body: string) {
        const todo = element(by.id(body)).getText();
        this.highlightElement(by.id(body));

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
        this.highlightElement(by.id('addNewtodo'));
        return element(by.id('addNewtodo')).isPresent();
    }

    clickAddtodoButton(): promise.Promise<void> {
        this.highlightElement(by.id('addNewtodo'));
        return element(by.id('addNewtodo')).click();
    }

}
