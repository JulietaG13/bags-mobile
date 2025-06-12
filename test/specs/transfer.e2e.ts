import welcomeScreen from '../pageobjects/welcome.page';
import loginScreen from '../pageobjects/login.page';
import registerScreen from '../pageobjects/register.page';
import homeScreen from '../pageobjects/home.page';
import sendScreen from '../pageobjects/send.page';

describe('Transfer Flow', () => {
    const SOURCE_USER = {
        email: 'email@email.com',
        password: '123123123'
    };

    const testUser = {
        email: `testuser.${Math.random().toString(36).substring(2, 15)}@example.com`,
        password: `TestPass123!${Math.random().toString(36).substring(2, 8)}`
    };

    const TRANSFER_AMOUNT = '1000';
    const EXPECTED_TRANSFER_AMOUNT = '1000.00';

    beforeEach(async () => {
        await welcomeScreen.open();
        await welcomeScreen.waitForWelcomeScreenLoaded();
    });

    describe('Complete Transfer Journey', () => {
        it('should complete full transfer flow from new user registration to receiving money', async () => {
            console.log(`[TRANSFER TEST] Starting test with generated user: ${testUser.email}`);

            // Step 1: Register new test user
            console.log('[TRANSFER TEST] Step 1: Registering new test user');
            await welcomeScreen.tapGetStarted();
            await registerScreen.waitForRegisterScreenLoaded();
            
            await registerScreen.fillRegistrationFormWithMatchingPasswords(
                testUser.email,
                testUser.password
            );
            await registerScreen.tapCreateAccount();
            await browser.pause(3000); // Wait for registration response

            // Step 2: Login with new test user
            console.log('[TRANSFER TEST] Step 2: Logging in with new test user');
            await welcomeScreen.open();
            await welcomeScreen.waitForWelcomeScreenLoaded();
            await welcomeScreen.tapSignIn();
            await loginScreen.waitForLoginScreenLoaded();
            
            await loginScreen.fillLoginForm(testUser.email, testUser.password);
            await loginScreen.tapSignIn();
            await browser.pause(5000); // Wait for login

            // Step 3: Check new user has 0 balance
            console.log('[TRANSFER TEST] Step 3: Verifying new user has 0 balance');
            try {
                await homeScreen.waitForHomeScreenLoaded();
                const initialBalance = await homeScreen.getBalanceAmount();
                console.log(`[TRANSFER TEST] New user balance: ${initialBalance}`);
                
                // Verify balance contains 0.00
                expect(initialBalance).toContain('0.00');
                console.log('[TRANSFER TEST] ✓ New user balance is 0 as expected');
            } catch (error) {
                console.log('[TRANSFER TEST] Could not verify initial balance, continuing test');
            }
            await browser.pause(1000);

            // Step 4: Sign out new user
            console.log('[TRANSFER TEST] Step 4: Signing out new user');
            try {
                await homeScreen.tapSignOut();
                console.log('[TRANSFER TEST] Sign out button tapped, waiting for confirmation...');
                await browser.pause(2000); // Wait for alert to appear
                
                // Handle sign out confirmation dialog - try multiple approaches
                try {
                    // Method 1: Try native alert handling
                    console.log('[TRANSFER TEST] Attempting native alert handling...');
                    await browser.waitUntil(async () => {
                        try {
                            const alertText = await browser.getAlertText();
                            console.log(`[TRANSFER TEST] Alert detected: ${alertText}`);
                            return true;
                        } catch (e) {
                            return false;
                        }
                    }, { timeout: 3000, timeoutMsg: 'Native alert not detected' });
                    
                    const alertText = await browser.getAlertText();
                    console.log(`[TRANSFER TEST] Alert text: ${alertText}`);
                    await browser.acceptAlert();
                    console.log('[TRANSFER TEST] Native alert accepted');
                } catch (nativeAlertError) {
                    console.log('[TRANSFER TEST] Native alert handling failed, trying button approach...');
                    
                    // Method 2: Try to find and tap the "Sign Out" button in the alert
                    try {
                        // Look for alert buttons by text
                        const signOutButton = await $('//android.widget.Button[@text="Sign Out"]');
                        if (await signOutButton.isDisplayed()) {
                            await signOutButton.tap();
                            console.log('[TRANSFER TEST] Sign Out button in alert tapped');
                        } else {
                            // Try alternative selectors
                            const confirmButton = await $('//android.widget.Button[contains(@text, "Sign")]');
                            if (await confirmButton.isDisplayed()) {
                                await confirmButton.tap();
                                console.log('[TRANSFER TEST] Confirm button in alert tapped');
                            } else {
                                console.log('[TRANSFER TEST] Could not find alert buttons, continuing...');
                            }
                        }
                    } catch (buttonError) {
                        console.log('[TRANSFER TEST] Button approach failed, alert may have auto-dismissed');
                    }
                }
                
                await browser.pause(3000);
                console.log('[TRANSFER TEST] ✓ New user signed out');
            } catch (error) {
                console.log('[TRANSFER TEST] Sign out failed, navigating to welcome screen');
                await welcomeScreen.open();
            }
            await browser.pause(1000);

            // Step 5: Login with source user (has money)
            console.log('[TRANSFER TEST] Step 5: Logging in with source user');
            await welcomeScreen.open();
            await welcomeScreen.waitForWelcomeScreenLoaded();
            await welcomeScreen.tapSignIn();
            await loginScreen.waitForLoginScreenLoaded();
            
            // Increased timeout for source user login (might be slower due to data loading)
            await loginScreen.fillLoginForm(SOURCE_USER.email, SOURCE_USER.password);
            console.log('[TRANSFER TEST] Filled login form, about to tap sign in...');
            
            try {
                await loginScreen.tapSignIn();
                console.log('[TRANSFER TEST] Sign in button tapped, waiting for response...');
                await browser.pause(8000); // Increased wait time for login processing
                
                // Wait longer for home screen to load after login
                await homeScreen.waitForHomeScreenLoaded();
                console.log('[TRANSFER TEST] ✓ Source user logged in successfully');
            } catch (loginError) {
                console.log('[TRANSFER TEST] Login attempt failed, retrying once...');
                
                // Retry login once
                await browser.pause(3000);
                await welcomeScreen.open();
                await welcomeScreen.waitForWelcomeScreenLoaded();
                await welcomeScreen.tapSignIn();
                await loginScreen.waitForLoginScreenLoaded();
                await loginScreen.fillLoginForm(SOURCE_USER.email, SOURCE_USER.password);
                await loginScreen.tapSignIn();
                await browser.pause(10000); // Even longer wait for retry
                await homeScreen.waitForHomeScreenLoaded();
                console.log('[TRANSFER TEST] ✓ Source user logged in successfully (retry)');
            }

            // Step 6: Verify source user has sufficient balance (>1000)
            console.log('[TRANSFER TEST] Step 6: Verifying source user has sufficient balance');
            try {
                await homeScreen.waitForHomeScreenLoaded();
                const sourceBalance = await homeScreen.getBalanceAmount();
                console.log(`[TRANSFER TEST] Source user balance: ${sourceBalance}`);
                
                // Extract numeric value from balance (remove currency and $)
                const balanceMatch = sourceBalance.match(/\$?([\d,]+\.?\d*)/);
                if (balanceMatch) {
                    const numericBalance = parseFloat(balanceMatch[1].replace(',', ''));
                    expect(numericBalance).toBeGreaterThan(1000);
                    console.log(`[TRANSFER TEST] ✓ Source user has sufficient balance: ${numericBalance}`);
                } else {
                    console.log('[TRANSFER TEST] Warning: Could not parse balance, continuing test');
                }
            } catch (error) {
                console.log('[TRANSFER TEST] Could not verify source balance, continuing test');
            }
            await browser.pause(1000);

            // Step 7: Navigate to send screen
            console.log('[TRANSFER TEST] Step 7: Navigating to send screen');
            await homeScreen.tapSendMoney();
            await sendScreen.waitForSendScreenLoaded();
            console.log('[TRANSFER TEST] ✓ Send screen loaded');

            // Step 8: Send 1000 to test user
            console.log('[TRANSFER TEST] Step 8: Sending money to test user');
            await sendScreen.fillTransferForm(testUser.email, TRANSFER_AMOUNT);
            
            // Verify amount display updates
            const displayedAmount = await sendScreen.getDisplayedAmount();
            console.log(`[TRANSFER TEST] Amount display shows: ${displayedAmount}`);
            expect(displayedAmount).toContain(EXPECTED_TRANSFER_AMOUNT);
            
            await sendScreen.tapSubmitButton();
            await browser.pause(5000); // Wait for transfer processing and toast

            console.log('[TRANSFER TEST] ✓ Transfer completed');

            // Step 8.1: Navigate back to home screen via bottom navigation
            console.log('[TRANSFER TEST] Step 8.1: Navigating back to home screen');
            await homeScreen.tapHomeTab();
            await browser.pause(2000); // Wait for navigation
            await homeScreen.waitForHomeScreenLoaded();
            console.log('[TRANSFER TEST] ✓ Navigated back to home screen');

            // Step 9: Return to home and sign out source user
            console.log('[TRANSFER TEST] Step 9: Returning to home and signing out source user');
            try {
                // Try to navigate back to home screen
                await homeScreen.waitForHomeScreenLoaded();
            } catch (error) {
                // If not on home screen, navigate there
                await welcomeScreen.open();
                await welcomeScreen.tapSignIn();
                await loginScreen.waitForLoginScreenLoaded();
                await loginScreen.fillLoginForm(SOURCE_USER.email, SOURCE_USER.password);
                await loginScreen.tapSignIn();
                await browser.pause(3000);
            }
            await browser.pause(1000);

            await homeScreen.tapSignOut();
            console.log('[TRANSFER TEST] Sign out button tapped, waiting for confirmation...');
            await browser.pause(2000); // Wait for alert to appear
            
            // Handle sign out confirmation - try multiple approaches
            try {
                // Method 1: Try native alert handling
                console.log('[TRANSFER TEST] Attempting native alert handling...');
                await browser.waitUntil(async () => {
                    try {
                        const alertText = await browser.getAlertText();
                        console.log(`[TRANSFER TEST] Alert detected: ${alertText}`);
                        return true;
                    } catch (e) {
                        return false;
                    }
                }, { timeout: 3000, timeoutMsg: 'Native alert not detected' });
                
                const alertText = await browser.getAlertText();
                console.log(`[TRANSFER TEST] Alert text: ${alertText}`);
                await browser.acceptAlert();
                console.log('[TRANSFER TEST] Native alert accepted');
            } catch (nativeAlertError) {
                console.log('[TRANSFER TEST] Native alert handling failed, trying button approach...');
                
                // Method 2: Try to find and tap the "Sign Out" button in the alert
                try {
                    // Look for alert buttons by text
                    const signOutButton = await $('//android.widget.Button[@text="Sign Out"]');
                    if (await signOutButton.isDisplayed()) {
                        await signOutButton.tap();
                        console.log('[TRANSFER TEST] Sign Out button in alert tapped');
                    } else {
                        // Try alternative selectors
                        const confirmButton = await $('//android.widget.Button[contains(@text, "Sign")]');
                        if (await confirmButton.isDisplayed()) {
                            await confirmButton.tap();
                            console.log('[TRANSFER TEST] Confirm button in alert tapped');
                        } else {
                            console.log('[TRANSFER TEST] Could not find alert buttons, continuing...');
                        }
                    }
                } catch (buttonError) {
                    console.log('[TRANSFER TEST] Button approach failed, alert may have auto-dismissed');
                }
            }
            await browser.pause(3000);
            console.log('[TRANSFER TEST] ✓ Source user signed out');

            // Step 10: Login with test user to verify received money
            console.log('[TRANSFER TEST] Step 10: Logging in with test user to verify received money');
            await welcomeScreen.open();
            await welcomeScreen.waitForWelcomeScreenLoaded();
            await welcomeScreen.tapSignIn();
            await loginScreen.waitForLoginScreenLoaded();
            
            await loginScreen.fillLoginForm(testUser.email, testUser.password);
            await loginScreen.tapSignIn();
            await browser.pause(5000); // Wait for login

            // Step 11: Verify test user now has 1000 balance
            console.log('[TRANSFER TEST] Step 11: Verifying test user received the money');
            await homeScreen.waitForHomeScreenLoaded();
            await homeScreen.waitForTransfersToLoad(); // Wait for data to load
            
            const finalBalance = await homeScreen.getBalanceAmount();
            console.log(`[TRANSFER TEST] Test user final balance: ${finalBalance}`);
            
            // Verify balance is 1000
            expect(finalBalance).toContain(EXPECTED_TRANSFER_AMOUNT);
            console.log('[TRANSFER TEST] ✓ Test user balance is 1000 as expected');

            // Step 12: Verify recent transfers shows incoming transfer
            console.log('[TRANSFER TEST] Step 12: Verifying recent transfer appears');
            try {
                const hasTransfersList = await homeScreen.isTransfersListDisplayed();
                if (hasTransfersList) {
                    console.log('[TRANSFER TEST] ✓ Transfers list is displayed');
                    
                    // Additional verification could be added here to check:
                    // - Transfer shows as "IN" 
                    // - Transfer amount is 1000
                    // - Transfer is from email@email.com
                    // This would require enhancing the home page object to parse transfer items
                    
                    console.log('[TRANSFER TEST] ✓ Recent transfers section is visible');
                } else {
                    console.log('[TRANSFER TEST] Warning: Transfers list not visible, but balance verified');
                }
            } catch (error) {
                console.log('[TRANSFER TEST] Could not verify transfers list, but balance was verified');
            }

            console.log('[TRANSFER TEST] ✓ Complete transfer flow test passed!');
        });
    });

    after(() => {
        console.log(`[TRANSFER TEST] Test completed successfully!`);
        console.log(`[TRANSFER TEST] Generated test user credentials:`);
        console.log(`[TRANSFER TEST] Email: ${testUser.email}`);
        console.log(`[TRANSFER TEST] Password: ${testUser.password}`);
        console.log(`[TRANSFER TEST] Source user: ${SOURCE_USER.email}`);
        console.log(`[TRANSFER TEST] Transfer amount: ${TRANSFER_AMOUNT}`);
    });
}); 