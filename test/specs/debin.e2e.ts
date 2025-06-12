import welcomeScreen from '../pageobjects/welcome.page';
import loginScreen from '../pageobjects/login.page';
import registerScreen from '../pageobjects/register.page';
import homeScreen from '../pageobjects/home.page';
import debinScreen from '../pageobjects/debin.page';

describe('Debin Request Flow', () => {
    // Generate a unique test user for this test run
    const testUser = {
        email: `debinuser.${Math.random().toString(36).substring(2, 15)}@example.com`,
        password: `DebinPass123!${Math.random().toString(36).substring(2, 8)}`
    };

    const DEBIN_REQUEST_EMAIL = 'alice@example.com';
    const DEBIN_REQUEST_AMOUNT = '10';
    const EXPECTED_DEBIN_AMOUNT = '10.00';

    beforeEach(async () => {
        await welcomeScreen.open();
        await welcomeScreen.waitForWelcomeScreenLoaded();
    });

    describe('Complete Debin Request Journey', () => {
        it('should complete full debin request flow from registration to verification', async () => {
            console.log(`[DEBIN TEST] Starting test with generated user: ${testUser.email}`);

            // Step 1: Register new test user
            console.log('[DEBIN TEST] Step 1: Registering new test user');
            await welcomeScreen.tapGetStarted();
            await registerScreen.waitForRegisterScreenLoaded();
            
            await registerScreen.fillRegistrationFormWithMatchingPasswords(
                testUser.email,
                testUser.password
            );
            await registerScreen.tapCreateAccount();
            await browser.pause(3000); // Wait for registration response
            console.log('[DEBIN TEST] ✓ New user registered successfully');

            // Step 2: Login with new test user
            console.log('[DEBIN TEST] Step 2: Logging in with new test user');
            await welcomeScreen.open();
            await welcomeScreen.waitForWelcomeScreenLoaded();
            await welcomeScreen.tapSignIn();
            await loginScreen.waitForLoginScreenLoaded();
            
            await loginScreen.fillLoginForm(testUser.email, testUser.password);
            await loginScreen.tapSignIn();
            await browser.pause(5000); // Wait for login
            
            await homeScreen.waitForHomeScreenLoaded();
            console.log('[DEBIN TEST] ✓ New user logged in successfully');

            // Step 3: Click on the request quick action on the home screen
            console.log('[DEBIN TEST] Step 3: Clicking request money quick action');
            await homeScreen.waitForHomeScreenLoaded();
            await homeScreen.tapRequestMoney();
            await browser.pause(2000); // Wait for navigation
            console.log('[DEBIN TEST] ✓ Request money quick action clicked');

            // Step 4: Make a debin request to "alice@example.com" for $10
            console.log('[DEBIN TEST] Step 4: Making debin request');
            await debinScreen.waitForDebinScreenLoaded();
            
            // Verify initial state
            await debinScreen.verifyInitialState();
            
            // Fill the debin form
            await debinScreen.fillDebinForm(DEBIN_REQUEST_EMAIL, DEBIN_REQUEST_AMOUNT);
            
            // Verify amount display updates
            const displayedAmount = await debinScreen.getDisplayedAmount();
            console.log(`[DEBIN TEST] Amount display shows: ${displayedAmount}`);
            expect(displayedAmount).toContain(EXPECTED_DEBIN_AMOUNT);
            
            // Submit the debin request
            await debinScreen.tapSubmitButton();
            console.log('[DEBIN TEST] ✓ Debin request submitted');

            // Step 5: Wait 2 seconds
            console.log('[DEBIN TEST] Step 5: Waiting 2 seconds');
            await browser.pause(2000);
            
            // Check for success indication
            try {
                const successMessage = await debinScreen.waitForSuccessAlert();
                if (successMessage) {
                    console.log(`[DEBIN TEST] Success indication found: ${successMessage}`);
                }
            } catch (error) {
                console.log('[DEBIN TEST] No explicit success message, continuing test');
            }
            console.log('[DEBIN TEST] ✓ Wait completed');

            // Step 6: Go back to the home screen via the nav bar
            console.log('[DEBIN TEST] Step 6: Navigating back to home screen via nav bar');
            await homeScreen.tapHomeTab();
            await browser.pause(2000); // Wait for navigation
            await homeScreen.waitForHomeScreenLoaded();
            console.log('[DEBIN TEST] ✓ Navigated back to home screen');

            // Step 7: Check there is only one transfer item that is for the debin request
            console.log('[DEBIN TEST] Step 7: Verifying exactly one transfer item exists');
            
            // Wait for transfers to load
            await homeScreen.waitForTransfersToLoad();
            
            // Verify exactly one transfer item
            await homeScreen.verifyExactlyOneTransferItem();
            
            console.log('[DEBIN TEST] ✓ Verified exactly one transfer item for the debin request');
            console.log('[DEBIN TEST] ✓ Complete debin request flow test passed successfully');
        });
    });
}); 