import { browser } from '@wdio/globals'
import dotenv from 'dotenv';
dotenv.config();

/**
 * Main page object containing all methods, selectors and functionality
 * that is shared across all page objects for React Native/Expo mobile app
 */
export default class Page {
    public async waitForAppReady() {
        // Wait for the app to be fully loaded - longer wait for stability
        console.log('Waiting for app to be ready...');
        await browser.pause(5000);
        
        // Check if app is still running
        try {
            const context = await browser.getContext();
            console.log('App context:', context);
        } catch (error) {
            console.log('Warning: Could not get app context:', error.message);
        }
    }

    public async goToWelcomeScreen() {
        console.log('Navigating to welcome screen...');
        
        try {
            const appId = process.env.APP_PACKAGE;
            if (!appId) throw new Error('APP_PACKAGE not set in .env');

            await browser.execute('mobile: clearApp', { appId });
            await browser.pause(2000);
            await browser.execute('mobile: activateApp', { appId });
            await this.waitForAppReady();

            console.log('App should be ready for testing');
        } catch (error) {
            console.log('Error in goToWelcomeScreen:', error.message);
            throw error;
        }
    }

    /**
     * Wait until the element is displayed within the given timeout.
     * @param element WebdriverIO element
     * @param timeout Timeout in milliseconds (default: 15000)
     */
    public async waitForElementDisplayed(
        element: WebdriverIO.Element,
        timeout = 15000
    ): Promise<void> {
        await element.waitForDisplayed({ timeout });
    }

    /**
     * Wait until the element is clickable within the given timeout.
     * @param element WebdriverIO element
     * @param timeout Timeout in milliseconds (default: 15000)
     */
    public async waitForElementClickable(
        element: WebdriverIO.Element,
        timeout = 15000
    ): Promise<void> {
        await element.waitForDisplayed({ timeout });
        await element.waitForEnabled({ timeout });
    }

    /**
     * Scroll to a native element.
     * This works only if the element is in a scrollable view.
     * @param element WebdriverIO element
     */
    public async scrollToElement(element: WebdriverIO.Element): Promise<void> {
        try {
            await element.scrollIntoView(); // Works for elements in ScrollView or FlatList
        } catch (err) {
            console.warn('scrollToElement failed, possibly not in scrollable container:', err.message);
        }
    }

    /**
     * Check if the app is responsive by verifying active context.
     * For native apps, at least 'NATIVE_APP' should be available.
     */
    public async isAppResponsive(): Promise<boolean> {
        try {
            const currentContext = await browser.getContext();
            return !!currentContext; // returns true if context is available
        } catch (error) {
            console.error('App responsiveness check failed:', error.message);
            return false;
        }
    }
}
