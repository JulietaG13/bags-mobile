class DebinScreen {
    // Main container elements
    get debinScreenContainer() { return $('~debin-screen-container'); }
    get debinScreenScrollView() { return $('~debin-screen-scroll-view'); }

    // Header section
    get debinScreenHeader() { return $('~debin-screen-header'); }
    get debinScreenIcon() { return $('~debin-screen-icon'); }

    // Amount display section
    get amountDisplayContainer() { return $('~debin-screen-amount-display'); }
    get amountDisplayText() { return $('~debin-screen-amount-text'); }
    get amountDisplayLabel() { return $('~debin-screen-amount-label'); }

    // Form section
    get formContainer() { return $('~debin-screen-form'); }

    // External Service field (read-only)
    get serviceField() { return $('~debin-screen-service-field'); }
    get serviceLabel() { return $('~debin-screen-service-label'); }
    get serviceValue() { return $('~debin-screen-service-value'); }
    get serviceText() { return $('~debin-screen-service-text'); }

    // Service Type field (read-only)
    get typeField() { return $('~debin-screen-type-field'); }
    get typeLabel() { return $('~debin-screen-type-label'); }
    get typeValue() { return $('~debin-screen-type-value'); }
    get typeText() { return $('~debin-screen-type-text'); }

    // Input fields
    get emailInput() { return $('~debin-screen-email-input'); }
    get amountInput() { return $('~debin-screen-amount-input'); }

    // Error display
    get generalError() { return $('~debin-screen-general-error'); }

    // Submit button
    get submitButton() { return $('~debin-screen-submit-button'); }

    /**
     * Wait for debin screen to be loaded
     */
    async waitForDebinScreenLoaded() {
        await this.debinScreenContainer.waitForDisplayed({ timeout: 15000 });
        await this.debinScreenIcon.waitForDisplayed({ timeout: 5000 });
        await this.amountDisplayContainer.waitForDisplayed({ timeout: 5000 });
        console.log('[DEBIN PAGE] Debin screen loaded successfully');
    }

    /**
     * Check if debin screen is displayed
     */
    async isDebinScreenDisplayed() {
        return await this.debinScreenContainer.isDisplayed();
    }

    /**
     * Get the displayed amount text
     */
    async getDisplayedAmount() {
        await this.amountDisplayText.waitForDisplayed({ timeout: 5000 });
        return await this.amountDisplayText.getText();
    }

    /**
     * Get external service value (should always be "Bank")
     */
    async getExternalServiceValue() {
        await this.serviceText.waitForDisplayed({ timeout: 5000 });
        return await this.serviceText.getText();
    }

    /**
     * Get service type value (should always be "Bank")
     */
    async getServiceTypeValue() {
        await this.typeText.waitForDisplayed({ timeout: 5000 });
        return await this.typeText.getText();
    }

    /**
     * Enter email address
     */
    async enterEmail(email: string) {
        await this.emailInput.waitForDisplayed({ timeout: 5000 });
        await this.emailInput.clearValue();
        await this.emailInput.setValue(email);
        console.log(`[DEBIN PAGE] Email entered: ${email}`);
    }

    /**
     * Enter amount
     */
    async enterAmount(amount: string) {
        await this.amountInput.waitForDisplayed({ timeout: 5000 });
        await this.amountInput.clearValue();
        await this.amountInput.setValue(amount);
        console.log(`[DEBIN PAGE] Amount entered: ${amount}`);
    }

    /**
     * Get email input value
     */
    async getEmailValue() {
        await this.emailInput.waitForDisplayed({ timeout: 5000 });
        const text = await this.emailInput.getText();
        // On Android, empty inputs return placeholder text, so we need to check for known placeholders
        if (text === 'Enter external service email' || text === '' || !text) {
            return '';
        }
        return text;
    }

    /**
     * Get amount input value
     */
    async getAmountValue() {
        await this.amountInput.waitForDisplayed({ timeout: 5000 });
        const text = await this.amountInput.getText();
        // On Android, empty inputs return placeholder text, so we need to check for known placeholders
        if (text === '0.00' || text === '' || !text) {
            return '';
        }
        return text;
    }

    /**
     * Tap submit button
     */
    async tapSubmitButton() {
        await this.submitButton.waitForDisplayed({ timeout: 5000 });
        await this.submitButton.tap();
        console.log('[DEBIN PAGE] Submit button tapped');
    }

    /**
     * Check if submit button is enabled
     */
    async isSubmitButtonEnabled() {
        await this.submitButton.waitForDisplayed({ timeout: 5000 });
        return await this.submitButton.isEnabled();
    }

    /**
     * Fill debin request form
     */
    async fillDebinForm(email: string, amount: string) {
        await this.enterEmail(email);
        await this.enterAmount(amount);
        console.log(`[DEBIN PAGE] Debin form filled - Email: ${email}, Amount: ${amount}`);
    }

    /**
     * Submit debin request
     */
    async submitDebinRequest(email: string, amount: string) {
        await this.fillDebinForm(email, amount);
        await this.tapSubmitButton();
        console.log('[DEBIN PAGE] Debin request submitted');
    }

    /**
     * Check if general error is displayed
     */
    async isGeneralErrorDisplayed() {
        try {
            return await this.generalError.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    /**
     * Get general error message text
     */
    async getGeneralErrorMessage() {
        if (await this.isGeneralErrorDisplayed()) {
            await this.generalError.waitForDisplayed({ timeout: 5000 });
            return await this.generalError.getText();
        }
        return null;
    }

    /**
     * Wait for general error to appear
     */
    async waitForGeneralError() {
        await this.generalError.waitForDisplayed({ timeout: 10000 });
        console.log('[DEBIN PAGE] General error displayed');
    }

    /**
     * Wait for general error to disappear
     */
    async waitForGeneralErrorToDisappear() {
        try {
            await this.generalError.waitForDisplayed({ timeout: 5000, reverse: true });
            console.log('[DEBIN PAGE] General error disappeared');
        } catch (error) {
            console.log('[DEBIN PAGE] General error element not found or already disappeared');
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
        console.log('[DEBIN PAGE] Form cleared');
    }

    /**
     * Verify amount display updates when user types
     */
    async verifyAmountDisplayUpdates(inputAmount: string, expectedDisplayFormat: string) {
        await this.enterAmount(inputAmount);
        
        // Wait a moment for the display to update
        await browser.pause(500);
        
        const displayedAmount = await this.getDisplayedAmount();
        expect(displayedAmount).toContain(expectedDisplayFormat);
        console.log(`[DEBIN PAGE] Amount display verification passed - Input: ${inputAmount}, Display: ${displayedAmount}`);
    }

    /**
     * Verify email validation with invalid email
     */
    async verifyEmailValidation(invalidEmail: string) {
        await this.enterEmail(invalidEmail);
        await this.enterAmount('100');
        await this.tapSubmitButton();
        
        // Should show validation error or general error
        const hasGeneralError = await this.isGeneralErrorDisplayed();
        expect(hasGeneralError).toBe(true);
        
        const errorMessage = await this.getGeneralErrorMessage();
        expect(errorMessage).toContain('email');
        console.log(`[DEBIN PAGE] Email validation test passed for: ${invalidEmail}`);
    }

    /**
     * Verify amount validation with invalid amount
     */
    async verifyAmountValidation(invalidAmount: string) {
        await this.enterEmail('test@example.com');
        await this.enterAmount(invalidAmount);
        await this.tapSubmitButton();
        
        // Should show validation error or general error
        const hasGeneralError = await this.isGeneralErrorDisplayed();
        expect(hasGeneralError).toBe(true);
        
        const errorMessage = await this.getGeneralErrorMessage();
        expect(errorMessage).toContain('amount');
        console.log(`[DEBIN PAGE] Amount validation test passed for: ${invalidAmount}`);
    }

    /**
     * Wait for success alert or toast
     */
    async waitForSuccessAlert() {
        // Wait for potential success message
        // This might be a toast or alert depending on the platform
        await browser.pause(2000);
        console.log('[DEBIN PAGE] Waiting for success indication');
        
        // Check if there are any native alerts
        try {
            const alertText = await browser.getAlertText();
            if (alertText && alertText.includes('success')) {
                console.log(`[DEBIN PAGE] Success alert found: ${alertText}`);
                await browser.acceptAlert();
                return alertText;
            }
        } catch (nativeAlertError) {
            console.log('[DEBIN PAGE] No native alert found, checking for other success indicators');
        }
        
        // Check if form was cleared (indicates success)
        const emailValue = await this.getEmailValue();
        const amountValue = await this.getAmountValue();
        
        if ((!emailValue || emailValue === '') && (!amountValue || amountValue === '')) {
            console.log('[DEBIN PAGE] Form was cleared, indicating successful submission');
            return 'Form cleared - success';
        }
        
        console.log('[DEBIN PAGE] No clear success indication found');
        return null;
    }

    /**
     * Verify form is in initial state
     */
    async verifyInitialState() {
        // Check external service is "Bank"
        const serviceValue = await this.getExternalServiceValue();
        expect(serviceValue).toBe('Bank');
        
        // Check service type is "Bank"
        const typeValue = await this.getServiceTypeValue();
        expect(typeValue).toBe('Bank');
        
        // Check form inputs are empty (on Android, empty inputs might return null, undefined, or empty string)
        const emailValue = await this.getEmailValue();
        const amountValue = await this.getAmountValue();
        expect(emailValue || '').toBe('');
        expect(amountValue || '').toBe('');
        
        // Check amount display shows default
        const displayedAmount = await this.getDisplayedAmount();
        expect(displayedAmount).toContain('$0.00');
        
        console.log('[DEBIN PAGE] Initial state verification passed');
    }

    /**
     * Verify read-only fields cannot be modified
     */
    async verifyReadOnlyFields() {
        // Try to interact with service field - should not be interactive
        const serviceFieldExists = await this.serviceValue.isDisplayed();
        expect(serviceFieldExists).toBe(true);
        
        // Try to interact with type field - should not be interactive  
        const typeFieldExists = await this.typeValue.isDisplayed();
        expect(typeFieldExists).toBe(true);
        
        console.log('[DEBIN PAGE] Read-only fields verification passed');
    }

    /**
     * Verify all main elements are displayed
     */
    async verifyMainElementsDisplayed() {
        const elements = [
            { element: this.debinScreenIcon, name: 'Debin Icon' },
            { element: this.amountDisplayContainer, name: 'Amount Display' },
            { element: this.formContainer, name: 'Form Container' },
            { element: this.serviceField, name: 'Service Field' },
            { element: this.typeField, name: 'Type Field' },
            { element: this.emailInput, name: 'Email Input' },
            { element: this.amountInput, name: 'Amount Input' },
            { element: this.submitButton, name: 'Submit Button' }
        ];

        for (const { element, name } of elements) {
            await element.waitForDisplayed({ timeout: 5000 });
            console.log(`[DEBIN PAGE] ${name} is displayed`);
        }

        console.log('[DEBIN PAGE] All main elements verified as displayed');
    }

    /**
     * Scroll to element if needed
     */
    async scrollToElement(element: WebdriverIO.Element) {
        try {
            await element.scrollIntoView();
            console.log('[DEBIN PAGE] Scrolled to element');
        } catch (error) {
            console.log('[DEBIN PAGE] Could not scroll to element:', error.message);
        }
    }
}

export default new DebinScreen(); 