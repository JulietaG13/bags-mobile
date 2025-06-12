class SendScreen {
    // Main container elements
    get sendScreenContainer() { return $('~send-screen-container'); }
    get sendScreenScrollView() { return $('~send-screen-scroll-view'); }

    // Header section
    get sendScreenHeader() { return $('~send-screen-header'); }
    get sendScreenIcon() { return $('~send-screen-icon'); }

    // Amount display section
    get amountDisplayContainer() { return $('~send-screen-amount-display'); }
    get amountDisplayText() { return $('~send-screen-amount-text'); }

    // Loading state
    get loadingText() { return $('~send-screen-loading-text'); }

    // Error display section
    get errorContainer() { return $('~send-screen-error-container'); }
    get errorIcon() { return $('~send-screen-error-icon'); }
    get errorText() { return $('~send-screen-error-text'); }

    // Form section
    get formContainer() { return $('~send-screen-form'); }
    get emailInput() { return $('~send-screen-email-input'); }
    get amountInput() { return $('~send-screen-amount-input'); }
    get submitButton() { return $('~send-screen-submit-button'); }

    /**
     * Wait for send screen to be loaded
     */
    async waitForSendScreenLoaded() {
        await this.sendScreenContainer.waitForDisplayed({ timeout: 15000 });
        await this.sendScreenIcon.waitForDisplayed({ timeout: 5000 });
        await this.amountDisplayContainer.waitForDisplayed({ timeout: 5000 });
        console.log('[SEND PAGE] Send screen loaded successfully');
    }

    /**
     * Check if send screen is displayed
     */
    async isSendScreenDisplayed() {
        return await this.sendScreenContainer.isDisplayed();
    }

    /**
     * Get the displayed amount text
     */
    async getDisplayedAmount() {
        await this.amountDisplayText.waitForDisplayed({ timeout: 5000 });
        return await this.amountDisplayText.getText();
    }

    /**
     * Check if loading text is displayed
     */
    async isLoadingDisplayed() {
        try {
            return await this.loadingText.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    /**
     * Wait for loading to disappear
     */
    async waitForLoadingToDisappear() {
        try {
            await this.loadingText.waitForDisplayed({ timeout: 10000, reverse: true });
            console.log('[SEND PAGE] Loading completed');
        } catch (error) {
            console.log('[SEND PAGE] Loading element not found or already disappeared');
        }
    }

    /**
     * Enter email address
     */
    async enterEmail(email: string) {
        await this.emailInput.waitForDisplayed({ timeout: 5000 });
        await this.emailInput.clearValue();
        await this.emailInput.setValue(email);
        console.log(`[SEND PAGE] Email entered: ${email}`);
    }

    /**
     * Enter amount
     */
    async enterAmount(amount: string) {
        await this.amountInput.waitForDisplayed({ timeout: 5000 });
        await this.amountInput.clearValue();
        await this.amountInput.setValue(amount);
        console.log(`[SEND PAGE] Amount entered: ${amount}`);
    }

    /**
     * Get email input value
     */
    async getEmailValue() {
        await this.emailInput.waitForDisplayed({ timeout: 5000 });
        return await this.emailInput.getValue();
    }

    /**
     * Get amount input value
     */
    async getAmountValue() {
        await this.amountInput.waitForDisplayed({ timeout: 5000 });
        return await this.amountInput.getValue();
    }

    /**
     * Tap submit button
     */
    async tapSubmitButton() {
        await this.submitButton.waitForDisplayed({ timeout: 5000 });
        await this.submitButton.tap();
        console.log('[SEND PAGE] Submit button tapped');
    }

    /**
     * Check if submit button is enabled
     */
    async isSubmitButtonEnabled() {
        await this.submitButton.waitForDisplayed({ timeout: 5000 });
        return await this.submitButton.isEnabled();
    }

    /**
     * Fill transfer form
     */
    async fillTransferForm(email: string, amount: string) {
        await this.enterEmail(email);
        await this.enterAmount(amount);
        console.log(`[SEND PAGE] Transfer form filled - Email: ${email}, Amount: ${amount}`);
    }

    /**
     * Submit transfer
     */
    async submitTransfer(email: string, amount: string) {
        await this.fillTransferForm(email, amount);
        await this.tapSubmitButton();
        console.log('[SEND PAGE] Transfer submitted');
    }

    /**
     * Check if error is displayed
     */
    async isErrorDisplayed() {
        try {
            return await this.errorContainer.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    /**
     * Get error message text
     */
    async getErrorMessage() {
        if (await this.isErrorDisplayed()) {
            await this.errorText.waitForDisplayed({ timeout: 5000 });
            return await this.errorText.getText();
        }
        return null;
    }

    /**
     * Wait for error to appear
     */
    async waitForError() {
        await this.errorContainer.waitForDisplayed({ timeout: 10000 });
        console.log('[SEND PAGE] Error displayed');
    }

    /**
     * Wait for error to disappear
     */
    async waitForErrorToDisappear() {
        try {
            await this.errorContainer.waitForDisplayed({ timeout: 5000, reverse: true });
            console.log('[SEND PAGE] Error disappeared');
        } catch (error) {
            console.log('[SEND PAGE] Error element not found or already disappeared');
        }
    }

    /**
     * Clear form inputs
     */
    async clearForm() {
        await this.emailInput.waitForDisplayed({ timeout: 5000 });
        await this.emailInput.clearValue();
        await this.amountInput.waitForDisplayed({ timeout: 5000 });
        await this.amountInput.clearValue();
        console.log('[SEND PAGE] Form cleared');
    }

    /**
     * Verify amount display updates as user types
     */
    async verifyAmountDisplayUpdates(inputAmount: string, expectedDisplayFormat: string) {
        await this.enterAmount(inputAmount);
        await browser.pause(500); // Allow time for UI to update
        const displayedAmount = await this.getDisplayedAmount();
        
        if (displayedAmount.includes(expectedDisplayFormat)) {
            console.log(`[SEND PAGE] Amount display updated correctly: ${displayedAmount}`);
            return true;
        } else {
            console.log(`[SEND PAGE] Amount display mismatch. Expected: ${expectedDisplayFormat}, Got: ${displayedAmount}`);
            return false;
        }
    }

    /**
     * Verify form validation for email
     */
    async verifyEmailValidation(invalidEmail: string) {
        await this.enterEmail(invalidEmail);
        await this.enterAmount('100');
        await this.tapSubmitButton();
        
        // Check if error appears or button remains disabled
        const isError = await this.isErrorDisplayed();
        const isButtonEnabled = await this.isSubmitButtonEnabled();
        
        console.log(`[SEND PAGE] Email validation check - Error shown: ${isError}, Button enabled: ${isButtonEnabled}`);
        return isError || !isButtonEnabled;
    }

    /**
     * Verify form validation for amount
     */
    async verifyAmountValidation(invalidAmount: string) {
        await this.enterEmail('test@example.com');
        await this.enterAmount(invalidAmount);
        await this.tapSubmitButton();
        
        // Check if error appears or button remains disabled
        const isError = await this.isErrorDisplayed();
        const isButtonEnabled = await this.isSubmitButtonEnabled();
        
        console.log(`[SEND PAGE] Amount validation check - Error shown: ${isError}, Button enabled: ${isButtonEnabled}`);
        return isError || !isButtonEnabled;
    }

    /**
     * Wait for success alert and handle it
     */
    async waitForSuccessAlert() {
        console.log('[SEND PAGE] Waiting for success alert...');
        await browser.pause(2000); // Wait for alert to appear
        
        // Handle success alert - try multiple approaches
        try {
            // Method 1: Try native alert handling
            console.log('[SEND PAGE] Attempting native alert handling...');
            await browser.waitUntil(async () => {
                try {
                    const alertText = await browser.getAlertText();
                    console.log(`[SEND PAGE] Alert detected: ${alertText}`);
                    return true;
                } catch (e) {
                    return false;
                }
            }, { timeout: 3000, timeoutMsg: 'Native alert not detected' });
            
            const alertText = await browser.getAlertText();
            console.log(`[SEND PAGE] Alert text: ${alertText}`);
            await browser.acceptAlert();
            console.log('[SEND PAGE] Native alert accepted');
            return alertText;
        } catch (nativeAlertError) {
            console.log('[SEND PAGE] Native alert handling failed, trying button approach...');
            
            // Method 2: Try to find and tap alert buttons
            try {
                // Look for "Done" or "Send Another" buttons from the success alert
                let alertText = '';
                let buttonTapped = false;
                
                // Try to find "Done" button first
                const doneButton = await $('//android.widget.Button[@text="Done"]');
                if (await doneButton.isDisplayed()) {
                    await doneButton.tap();
                    console.log('[SEND PAGE] Done button in alert tapped');
                    alertText = 'Transfer Successful! (Done button tapped)';
                    buttonTapped = true;
                } else {
                    // Try to find "Send Another" button
                    const sendAnotherButton = await $('//android.widget.Button[@text="Send Another"]');
                    if (await sendAnotherButton.isDisplayed()) {
                        await sendAnotherButton.tap();
                        console.log('[SEND PAGE] Send Another button in alert tapped');
                        alertText = 'Transfer Successful! (Send Another button tapped)';
                        buttonTapped = true;
                    } else {
                        // Try alternative selectors for any button containing success-related text
                        const successButton = await $('//android.widget.Button[contains(@text, "Done") or contains(@text, "OK") or contains(@text, "Send")]');
                        if (await successButton.isDisplayed()) {
                            await successButton.tap();
                            console.log('[SEND PAGE] Success-related button in alert tapped');
                            alertText = 'Transfer Successful! (Success button tapped)';
                            buttonTapped = true;
                        } else {
                            console.log('[SEND PAGE] Could not find alert buttons, alert may have auto-dismissed');
                        }
                    }
                }
                
                if (buttonTapped) {
                    return alertText;
                } else {
                    return null;
                }
            } catch (buttonError) {
                console.log('[SEND PAGE] Button approach failed, alert may have auto-dismissed');
                return null;
            }
        }
    }

    /**
     * Verify all main elements are displayed
     */
    async verifyMainElementsDisplayed() {
        const elements = [
            { element: this.sendScreenIcon, name: 'Send Icon' },
            { element: this.amountDisplayContainer, name: 'Amount Display' },
            { element: this.formContainer, name: 'Form Container' },
            { element: this.emailInput, name: 'Email Input' },
            { element: this.amountInput, name: 'Amount Input' },
            { element: this.submitButton, name: 'Submit Button' }
        ];

        for (const { element, name } of elements) {
            await element.waitForDisplayed({ timeout: 5000 });
            console.log(`[SEND PAGE] ${name} is displayed`);
        }

        console.log('[SEND PAGE] All main elements verified as displayed');
    }

    /**
     * Scroll to element if needed
     */
    async scrollToElement(element: WebdriverIO.Element) {
        try {
            await element.scrollIntoView();
        } catch (err) {
            console.warn('[SEND PAGE] scrollToElement failed:', err.message);
        }
    }

    /**
     * Verify initial state of the screen
     */
    async verifyInitialState() {
        await this.waitForSendScreenLoaded();
        
        // Check initial amount display shows 0.00
        const initialAmount = await this.getDisplayedAmount();
        console.log(`[SEND PAGE] Initial amount display: ${initialAmount}`);
        
        // Check form is empty
        const emailValue = await this.getEmailValue();
        const amountValue = await this.getAmountValue();
        
        console.log(`[SEND PAGE] Initial form state - Email: '${emailValue}', Amount: '${amountValue}'`);
        
        // Check submit button is disabled
        const isButtonEnabled = await this.isSubmitButtonEnabled();
        console.log(`[SEND PAGE] Submit button initially enabled: ${isButtonEnabled}`);
        
        return {
            initialAmount,
            emailValue,
            amountValue,
            isButtonEnabled
        };
    }
}

export default new SendScreen(); 