import { $ } from '@wdio/globals'
import Page from './page';

class RegisterScreenPage extends Page {
    
    // Main container
    public get screenContainer() {
        return $('~register-screen-container');
    }

    // Header elements
    public get header() {
        return $('~register-header');
    }

    // Form container
    public get formContainer() {
        return $('~register-form-container');
    }

    // Input fields
    public get emailInput() {
        return $('~register-email-input');
    }

    public get passwordInput() {
        return $('~register-password-input');
    }

    public get confirmPasswordInput() {
        return $('~register-confirm-password-input');
    }

    // Buttons
    public get submitButton() {
        return $('~register-submit-button');
    }

    public get goToLoginButton() {
        return $('~register-goto-login-button');
    }

    // Error elements
    public get errorContainer() {
        return $('~register-error-container');
    }

    public get errorText() {
        return $('~register-error-text');
    }

    /**
     * Methods to interact with the register screen
     */

    /**
     * Wait for register screen to be fully loaded - simplified to wait only for essential interactive elements
     */
    public async waitForRegisterScreenLoaded() {
        // Only wait for the essential interactive elements that users need
        // Use longer timeout for first element as navigation might take time
        console.log('[REGISTER PAGE] Waiting for register screen elements to load...');
        
        try {
            await this.emailInput.waitForDisplayed({ timeout: 20000 });
            console.log('[REGISTER PAGE] Email input found');
            
            await this.passwordInput.waitForDisplayed({ timeout: 10000 });
            console.log('[REGISTER PAGE] Password input found');
            
            await this.confirmPasswordInput.waitForDisplayed({ timeout: 10000 });
            console.log('[REGISTER PAGE] Confirm password input found');
            
            await this.submitButton.waitForDisplayed({ timeout: 10000 });
            console.log('[REGISTER PAGE] Submit button found');
            
            console.log('[REGISTER PAGE] All register screen elements loaded successfully');
        } catch (error) {
            console.log('[REGISTER PAGE] Error waiting for register screen elements:', error.message);
            throw error;
        }
    }

    /**
     * Verify all register screen elements are visible
     */
    public async verifyRegisterScreenElements() {
        await expect(this.screenContainer).toBeDisplayed();
        await expect(this.header).toBeDisplayed();
        await expect(this.formContainer).toBeDisplayed();
        await expect(this.emailInput).toBeDisplayed();
        await expect(this.passwordInput).toBeDisplayed();
        await expect(this.confirmPasswordInput).toBeDisplayed();
        await expect(this.submitButton).toBeDisplayed();
        await expect(this.goToLoginButton).toBeDisplayed();
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
     * Fill in the confirm password field
     */
    public async fillConfirmPassword(confirmPassword: string) {
        await this.confirmPasswordInput.waitForDisplayed({ timeout: 10000 });
        await this.confirmPasswordInput.clearValue();
        await this.confirmPasswordInput.setValue(confirmPassword);
    }

    /**
     * Fill in all registration form fields
     */
    public async fillRegistrationForm(email: string, password: string, confirmPassword: string) {
        await this.fillEmail(email);
        await this.fillPassword(password);
        await this.fillConfirmPassword(confirmPassword);
    }

    /**
     * Fill in registration form with matching passwords
     */
    public async fillRegistrationFormWithMatchingPasswords(email: string, password: string) {
        await this.fillRegistrationForm(email, password, password);
    }

    /**
     * Tap the Create Account button
     */
    public async tapCreateAccount() {
        await this.submitButton.waitForDisplayed({ timeout: 15000 });
        await this.submitButton.waitForEnabled({ timeout: 15000 });
        await this.submitButton.click();
    }

    /**
     * Tap the "Already have an account? Sign In" button
     */
    public async tapGoToLogin() {
        await this.goToLoginButton.waitForDisplayed({ timeout: 15000 });
        await this.goToLoginButton.waitForEnabled({ timeout: 15000 });
        await this.goToLoginButton.click();
    }

    /**
     * Perform complete registration flow
     */
    public async performRegistration(email: string, password: string, confirmPassword?: string) {
        const confirmPass = confirmPassword || password;
        await this.waitForRegisterScreenLoaded();
        await this.fillRegistrationForm(email, password, confirmPass);
        await this.tapCreateAccount();
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
     * Verify register screen is displayed
     */
    public async isRegisterScreenDisplayed(): Promise<boolean> {
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
     * Test password mismatch validation
     */
    public async testPasswordMismatch(email: string, password: string, wrongConfirmPassword: string) {
        await this.waitForRegisterScreenLoaded();
        await this.fillRegistrationForm(email, password, wrongConfirmPassword);
        // Form should show validation error for password mismatch
    }

    /**
     * Navigate to register screen (override from base class)
     */
    public async open() {
        await this.goToWelcomeScreen();
    }
}

export default new RegisterScreenPage(); 