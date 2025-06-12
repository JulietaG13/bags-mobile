import { $ } from '@wdio/globals'
import Page from './page';

class LoginScreenPage extends Page {
    
    // Main container
    public get screenContainer() {
        return $('~login-screen-container');
    }

    // Header elements
    public get header() {
        return $('~login-header');
    }

    // Form container
    public get formContainer() {
        return $('~login-form-container');
    }

    // Input fields
    public get emailInput() {
        return $('~login-email-input');
    }

    public get passwordInput() {
        return $('~login-password-input');
    }

    // Buttons
    public get submitButton() {
        return $('~login-submit-button');
    }

    public get goToRegisterButton() {
        return $('~login-goto-register-button');
    }

    // Error elements
    public get errorContainer() {
        return $('~login-error-container');
    }

    public get errorText() {
        return $('~login-error-text');
    }

    /**
     * Methods to interact with the login screen
     */

    /**
     * Wait for login screen to be fully loaded - simplified to wait only for essential interactive elements
     */
    public async waitForLoginScreenLoaded() {
        // Only wait for the essential interactive elements that users need
        // Use longer timeout for first element as navigation might take time
        console.log('[LOGIN PAGE] Waiting for login screen elements to load...');
        
        try {
            await this.emailInput.waitForDisplayed({ timeout: 20000 });
            console.log('[LOGIN PAGE] Email input found');
            
            await this.passwordInput.waitForDisplayed({ timeout: 10000 });
            console.log('[LOGIN PAGE] Password input found');
            
            await this.submitButton.waitForDisplayed({ timeout: 10000 });
            console.log('[LOGIN PAGE] Submit button found');
            
            console.log('[LOGIN PAGE] All login screen elements loaded successfully');
        } catch (error) {
            console.log('[LOGIN PAGE] Error waiting for login screen elements:', error.message);
            throw error;
        }
    }

    /**
     * Verify all login screen elements are visible
     */
    public async verifyLoginScreenElements() {
        await expect(this.screenContainer).toBeDisplayed();
        await expect(this.header).toBeDisplayed();
        await expect(this.formContainer).toBeDisplayed();
        await expect(this.emailInput).toBeDisplayed();
        await expect(this.passwordInput).toBeDisplayed();
        await expect(this.submitButton).toBeDisplayed();
        await expect(this.goToRegisterButton).toBeDisplayed();
    }

    /**
     * Fill in the email field
     */
    public async fillEmail(email: string) {
        await this.emailInput.waitForDisplayed({ timeout: 10000 });
        await this.emailInput.clearValue();
        await this.emailInput.setValue(email);
    }

    /**
     * Fill in the password field
     */
    public async fillPassword(password: string) {
        await this.passwordInput.waitForDisplayed({ timeout: 10000 });
        await this.passwordInput.clearValue();
        await this.passwordInput.setValue(password);
    }

    /**
     * Fill in both email and password fields
     */
    public async fillLoginForm(email: string, password: string) {
        await this.fillEmail(email);
        await this.fillPassword(password);
    }

    /**
     * Tap the Sign In button
     */
    public async tapSignIn() {
        await this.submitButton.waitForDisplayed({ timeout: 15000 });
        await this.submitButton.waitForEnabled({ timeout: 15000 });
        await this.submitButton.click();
    }

    /**
     * Tap the "Don't have an account? Sign Up" button
     */
    public async tapGoToRegister() {
        await this.goToRegisterButton.waitForDisplayed({ timeout: 15000 });
        await this.goToRegisterButton.waitForEnabled({ timeout: 15000 });
        await this.goToRegisterButton.click();
    }

    /**
     * Perform complete login flow
     */
    public async performLogin(email: string, password: string) {
        await this.waitForLoginScreenLoaded();
        await this.fillLoginForm(email, password);
        await this.tapSignIn();
    }

    /**
     * Check if error message is displayed
     */
    public async isErrorDisplayed(): Promise<boolean> {
        try {
            await this.errorContainer.waitForDisplayed({ timeout: 5000 });
            return await this.errorContainer.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    /**
     * Get error message text
     */
    public async getErrorText(): Promise<string> {
        await this.errorText.waitForDisplayed({ timeout: 10000 });
        return await this.errorText.getText();
    }

    /**
     * Verify login screen is displayed
     */
    public async isLoginScreenDisplayed(): Promise<boolean> {
        try {
            await this.screenContainer.waitForDisplayed({ timeout: 5000 });
            return await this.screenContainer.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    /**
     * Wait for submit button to be enabled (when form is valid)
     */
    public async waitForSubmitButtonEnabled() {
        await this.submitButton.waitForEnabled({ timeout: 10000 });
    }

    /**
     * Check if submit button is enabled
     */
    public async isSubmitButtonEnabled(): Promise<boolean> {
        return await this.submitButton.isEnabled();
    }

    /**
     * Navigate to login screen (override from base class)
     */
    public async open() {
        await this.goToWelcomeScreen();
    }
}

export default new LoginScreenPage(); 