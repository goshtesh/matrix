chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "connectRequest") {
            connectCodeBlock(request.connectFilter);
        }
    }
);

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "messageRequest") {
            let contactedPeople = [];
            chrome.storage.local.get("contactedPeople", function (result) {
                contactedPeople = result.contactedPeople || [];
                messageCodeBlock(request.text, contactedPeople);
            });
        }
    }
);


async function connectCodeBlock(filter) {
    async function getElementsByXpath(xpathToExecute) {
        var result = [];
        var nodesSnapshot = document.evaluate(xpathToExecute, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
            result.push(nodesSnapshot.snapshotItem(i));
        }
        return result;
    }

    let all_buttons = await getElementsByXpath("//button/span[text()='Connect']/..");
    await new Promise(r => setTimeout(r, 5000));

    let connect_buttons = []
    for (let btn of all_buttons) {
        connect_buttons.push(btn)
    }

    await new Promise(r => setTimeout(r, 5000));
    for (let btn of connect_buttons) {
        btn.click()
        await new Promise(r => setTimeout(r, 2000));
        const sendInvite = document.getElementById("send-invite-modal").innerText
        if (sendInvite.includes("You can customize this invitation")) {
            send = await getElementsByXpath("//button[@aria-label='Send now']")
            send[0].click()
            await new Promise(r => setTimeout(r, 2000));
        } else if (sendInvite.includes("How do you know")) {
            if (filter) {
                searchFilter = "//button[text()=" + JSON.stringify(filter) + "]"
            } else {
                searchFilter = '//button[text()="Other"]'
            }
            const filterApply = await getElementsByXpath(searchFilter)
            filterApply[0].click()
            connect = await getElementsByXpath("//button[@aria-label='Connect']")
            connect[0].click()
            await new Promise(r => setTimeout(r, 2000));
            send = await getElementsByXpath("//button[@aria-label='Send now']")
            send[0].click()
            await new Promise(r => setTimeout(r, 2000));
        }
    }


}


async function messageCodeBlock(message, contactedPeople) {
    async function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }
    async function getElementsByXpath(xpathToExecute, docValue) {
        var result = [];
        if (docValue === null) {
            var nodesSnapshot = document.evaluate(xpathToExecute, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
                result.push(nodesSnapshot.snapshotItem(i));
            }
            return result;
        } else {
            var nodesSnapshot = document.evaluate(xpathToExecute, docValue, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
                result.push(nodesSnapshot.snapshotItem(i));
            }
            return result;
        }
    }
    async function getElementByXpath(xpathToExecute, docValue) {
        if (docValue === null) {
            return document.evaluate(xpathToExecute, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        } else {
            return document.evaluate(xpathToExecute, docValue, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        }
    }
    let url = location.href


    await new Promise(r => setTimeout(r, 5000));
    //TODO: Change all buttons code to use connect and follow as well
    // let all_buttons = await driver.findElements(webdriver.By.xpath("//button/span[text()='Connect' or text()='Message' or text()='Follow']/.."))
    let all_buttons = await getElementsByXpath("//button/span[text()='Message']/..", null)
    let message_buttons = []
    for (let btn of all_buttons) {
        message_buttons.push(btn)
    }
    const length = message_buttons.length
    for (let i = 0; i < length; i++) {
        message_buttons[i].click()
        await new Promise(r => setTimeout(r, 2000));
        greetings = ["Hello", "Hi", "Hey"]
        let names = await getElementByXpath("//h2[contains(@class, 'msg-overlay-bubble-header__title')]/a", null) || await getElementByXpath("//a[contains(@class, 'profile-card-one-to-one__profile-link')]", null)        

        var fullName = names.innerText || names.textContent
        var firstName = fullName.split(' ')[0];

        if (contactedPeople.includes(firstName)) {
            console.log(`Already contacted ${firstName}. Skipping.`);
        }
        else {
            main_div = await getElementByXpath("//div[starts-with(@class, 'msg-form__msg-content-container')]", null)
            main_div.click()

            let sleep_option = await getRandomInt(5000, 10000);
            let greetings_options = await getRandomInt(0, greetings.length);
            let newmessage = greetings[greetings_options] + " " + firstName + "! " + message
            let subject = "Hello"


            let paragraphs = await getElementByXpath("//div[starts-with(@class, 'msg-form__contenteditable')]//p", main_div);
            paragraphs.innerText = newmessage;

            const event = new Event('input', { bubbles: true });
            await paragraphs.dispatchEvent(event);
            // type subject of the message
            // title = await getElementByXpath("//input[@class=' artdeco-text-input--input']", null).sendKeys(subject);
            // await new Promise(r => setTimeout(r, 2000));
            // send message
            submit = await getElementByXpath("//button[@type='submit']", null);
            submit.disabled = false;
            await submit.click();
            await new Promise(r => setTimeout(r, 2000));
        }
        //close div
        let minimize_button = await getElementByXpath("//button[contains(@class, 'msg-overlay-bubble-header__control') and .//*[name()='svg' and @data-test-icon='close-small']]", null);
        minimize_button.click();
        contactedPeople.push(firstName);
        chrome.storage.local.set({ "contactedPeople": contactedPeople });
        await new Promise(r => setTimeout(r, 2000));
    }

}
