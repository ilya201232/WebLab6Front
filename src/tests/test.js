const {Builder, By} = require('selenium-webdriver');

(async function example() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get('http://localhost:8080/#/clients/Pop%20Bond');

        let init_balance = await driver.findElement(By.name('user_balance')).getText();
        init_balance = parseInt(init_balance.slice(10));
        console.log("Init Balance: " + init_balance);

        await driver.findElement(By.name('buy0')).click();

        await driver.findElement(By.name('buy_input')).sendKeys(10);
        let totalPrice = await driver.findElement(By.name('buy_price')).getText();
        console.log("Total Price: " + totalPrice);
        await driver.findElement(By.name('buy_btn')).click();

        let result_balance = await driver.findElement(By.name('user_balance')).getText();
        result_balance = parseInt(result_balance.slice(10));
        console.log("Result Balance: " + result_balance);

        if (Math.abs(Math.abs(init_balance - result_balance) - totalPrice) <= 2) {
            console.log("Buy Ok!");
        } else {
            throw new Error("[BUY] Resulting balance is not that expected.");
        }

        init_balance = await driver.findElement(By.name('user_balance')).getText();
        init_balance = parseInt(init_balance.slice(10));
        console.log("Init Balance: " + init_balance);

        await driver.findElement(By.name('buy0')).click();

        await driver.findElement(By.name('buy_toggle_btn')).click();
        
        totalPrice = await driver.findElement(By.name('sell_price')).getText();
        console.log("Total Price: " + totalPrice);
        await driver.findElement(By.name('sell_btn')).click();

        result_balance = await driver.findElement(By.name('user_balance')).getText();
        result_balance = parseInt(result_balance.slice(10));
        console.log("Result Balance: " + result_balance);

        if (Math.abs(Math.abs(init_balance - result_balance) - totalPrice) <= 2) {
            console.log("Sell Ok!");
        } else {
            throw new Error("[SELL] Resulting balance is not that expected.");
        }
    } catch (e) {
        console.error(e);
    } finally {
        await driver.quit();
    }
})();
