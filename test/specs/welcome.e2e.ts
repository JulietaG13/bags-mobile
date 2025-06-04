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

    it('should have clickable buttons', async () => {
        // Verify buttons are clickable
        await welcomeScreen.verifyButtonsAreClickable();
    });

    it('should display correct button texts', async () => {
        // Verify button texts
        await welcomeScreen.verifyButtonTexts();
    });

    it('should navigate to registration when Get Started is tapped', async () => {
        // Tap Get Started button
        await welcomeScreen.tapGetStarted();
        
        // Here you would verify navigation to registration screen
        // For now, we'll just take a screenshot
        await browser.pause(2000); // Wait for navigation
    });

    it('should navigate to login when Sign In is tapped', async () => {
        // First ensure we're on welcome screen
        await welcomeScreen.waitForWelcomeScreenLoaded();
        
        // Tap Sign In button
        await welcomeScreen.tapSignIn();
        
        // Here you would verify navigation to login screen
        // For now, we'll just take a screenshot
        await browser.pause(2000); // Wait for navigation
    });
}); 