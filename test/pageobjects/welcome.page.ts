import { $ } from '@wdio/globals'
import Page from './page';

/**
 * WelcomeScreen page object containing specific selectors and methods
 * for the welcome/landing screen of the Bags mobile app
 */
class WelcomeScreenPage extends Page {
    /**
     * Define selectors using getter methods for welcome screen elements
     */
    
    // Header elements
    public get brandName() {
        return $('~welcome-brand-name');
    }

    public get title() {
        return $('~welcome-title');
    }

    public get subtitle() {
        return $('~welcome-subtitle');
    }

    // Action buttons
    public get getStartedButton() {
        return $('~welcome-get-started-button');
    }

    public get signInButton() {
        return $('~welcome-sign-in-button');
    }

    // Button text elements
    public get getStartedButtonText() {
        return $('~welcome-get-started-text');
    }

    public get signInButtonText() {
        return $('~welcome-sign-in-text');
    }

    // Container elements
    public get welcomeHeaderContainer() {
        return $('~welcome-header-container');
    }

    public get heroSection() {
        return $('~welcome-hero-section');
    }

    public get actionsSection() {
        return $('~welcome-actions-section');
    }

    public get actionsContainer() {
        return $('~welcome-actions-container');
    }

    public get scrollView() {
        return $('~welcome-scroll-view');
    }

    /**
     * Methods to interact with the welcome screen
     */

    /**
     * Wait for welcome screen to be fully loaded
     */
    public async waitForWelcomeScreenLoaded() {
        await this.brandName.waitForDisplayed({ timeout: 15000 });
        await this.getStartedButton.waitForDisplayed({ timeout: 10000 });
        await this.signInButton.waitForDisplayed({ timeout: 10000 });
    }

    /**
     * Verify all welcome screen elements are visible
     */
    public async verifyWelcomeScreenElements() {
        await expect(this.brandName).toBeDisplayed();
        await expect(this.title).toBeDisplayed();
        await expect(this.subtitle).toBeDisplayed();
        await expect(this.getStartedButton).toBeDisplayed();
        await expect(this.signInButton).toBeDisplayed();
    }

    /**
     * Get the brand name text
     */
    public async getBrandNameText(): Promise<string> {
        await this.brandName.waitForDisplayed();
        return await this.brandName.getText();
    }

    /**
     * Get the main title text
     */
    public async getTitleText(): Promise<string> {
        await this.title.waitForDisplayed();
        return await this.title.getText();
    }

    /**
     * Get the subtitle text
     */
    public async getSubtitleText(): Promise<string> {
        await this.subtitle.waitForDisplayed();
        return await this.subtitle.getText();
    }

    /**
     * Tap the "Get Started" button to navigate to registration
     */
    public async tapGetStarted() {
        await this.getStartedButton.waitForDisplayed({ timeout: 15000 });
        await this.getStartedButton.waitForEnabled({ timeout: 15000 });
        await this.getStartedButton.click();
    }

    /**
     * Tap the "Sign In" button to navigate to login
     */
    public async tapSignIn() {
        await this.signInButton.waitForDisplayed({ timeout: 15000 });
        await this.signInButton.waitForEnabled({ timeout: 15000 });
        await this.signInButton.click();
    }

    /**
     * Navigate to welcome screen (override from base class)
     */
    public async open() {
        await this.goToWelcomeScreen();
        await this.waitForWelcomeScreenLoaded();
    }

    /**
     * Verify welcome screen is displayed
     */
    public async isWelcomeScreenDisplayed(): Promise<boolean> {
        try {
            await this.brandName.waitForDisplayed({ timeout: 5000 });
            return await this.brandName.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    /**
     * Verify buttons are enabled
     */
    public async verifyButtonsAreClickable() {
        await this.signInButton.waitForDisplayed({ timeout: 15000 });
        await this.signInButton.waitForEnabled({ timeout: 15000 });
        await this.signInButton.waitForDisplayed({ timeout: 15000 });
        await this.signInButton.waitForEnabled({ timeout: 15000 });
    }

    /**
     * Scroll to actions section if needed
     */
    public async scrollToActions() {
        await this.actionsSection.scrollIntoView();
    }

    /**
     * Wait for and verify the welcome screen animation/gradient is loaded
     */
    public async waitForScreenAnimation() {
        await browser.pause(1000); // Wait for gradient/animation to settle
        await this.brandName.waitForDisplayed();
    }

    /**
     * Verify button texts match expected values
     */
    public async verifyButtonTexts() {
        const getStartedText = await this.getStartedButtonText.getText();
        const signInText = await this.signInButtonText.getText();
        
        await expect(getStartedText).toBe('Get Started');
        await expect(signInText).toBe('Already have an account?');
    }
}

export default new WelcomeScreenPage(); 