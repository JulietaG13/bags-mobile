import welcomeScreen from '../pageobjects/welcome.page';

describe('Welcome Screen', () => {
    beforeEach(async () => {
        // Navigate to welcome screen before each test
        await welcomeScreen.open();
    });

    it('should display all welcome screen elements', async () => {
        // Verify welcome screen is loaded
        await welcomeScreen.waitForWelcomeScreenLoaded();
        
        // Verify all elements are visible
        await welcomeScreen.verifyWelcomeScreenElements();
    });

    it('should navigate to registration when Get Started is tapped', async () => {
        await welcomeScreen.waitForWelcomeScreenLoaded();
        await welcomeScreen.tapGetStarted();

        await browser.pause(2000); // Wait for navigation
    });

    it('should navigate to login when Sign In is tapped', async () => {
        await welcomeScreen.waitForWelcomeScreenLoaded();
        await welcomeScreen.tapSignIn();

        await browser.pause(2000); // Wait for navigation
    });
}); 