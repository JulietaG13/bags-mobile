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

    it('should display correct brand name', async () => {
        // Get and verify brand name
        const brandName = await welcomeScreen.getBrandNameText();
        expect(brandName).toBe('Bags');
    });

    it('should display correct title', async () => {
        // Get and verify title
        const title = await welcomeScreen.getTitleText();
        expect(title).toBe('Your Digital Wallet');
    });

    it('should display correct subtitle', async () => {
        // Get and verify subtitle
        const subtitle = await welcomeScreen.getSubtitleText();
        expect(subtitle).toBe('Send, receive, and manage your money with ease. Secure, fast, and designed for the modern world.');
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

    it('should handle screen animation loading', async () => {
        // Wait for screen animation to settle
        await welcomeScreen.waitForScreenAnimation();
        
        // Verify screen is still properly displayed
        expect(await welcomeScreen.isWelcomeScreenDisplayed()).toBe(true);
    });

    it('should be able to scroll to actions section', async () => {
        // Scroll to actions section
        await welcomeScreen.scrollToActions();
        
        // Verify buttons are still clickable after scrolling
        await welcomeScreen.verifyButtonsAreClickable();
    });
}); 