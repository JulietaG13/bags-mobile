class HomeScreen {
    // Main container
    get homeScreenContainer() { return $('~home-screen-container'); }
    get homeScreenScrollView() { return $('~home-screen-scroll-view'); }

    // Header section
    get homeScreenHeader() { return $('~home-screen-header'); }
    get homeScreenGreeting() { return $('~home-screen-greeting'); }
    get signOutButton() { return $('~home-sign-out-button'); }

    // Balance card section
    get balanceCard() { return $('~home-balance-card'); }
    get balanceAmount() { return $('~home-balance-amount'); }
    get balanceVisibilityToggle() { return $('~home-balance-visibility-toggle'); }

    // Quick actions section
    get quickActionsSection() { return $('~home-quick-actions-section'); }
    get sendMoneyButton() { return $('~home-send-money-button'); }
    get requestMoneyButton() { return $('~home-request-money-button'); }
    get viewHistoryButton() { return $('~home-view-history-button'); }

    // Transfers section
    get transfersSection() { return $('~home-transfers-section'); }
    get seeAllTransfers() { return $('~home-see-all-transfers'); }
    get loadingContainer() { return $('~home-loading-container'); }
    get transfersList() { return $('~home-transfers-list'); }

    /**
     * Wait for home screen to be loaded
     */
    async waitForHomeScreenLoaded() {
        await this.homeScreenContainer.waitForDisplayed({ timeout: 15000 });
        await this.homeScreenGreeting.waitForDisplayed({ timeout: 5000 });
        console.log('[HOME PAGE] Home screen loaded successfully');
    }

    /**
     * Check if home screen is displayed
     */
    async isHomeScreenDisplayed() {
        return await this.homeScreenContainer.isDisplayed();
    }

    /**
     * Get the greeting text
     */
    async getGreetingText() {
        await this.homeScreenGreeting.waitForDisplayed({ timeout: 5000 });
        return await this.homeScreenGreeting.getText();
    }

    /**
     * Get the balance amount text
     */
    async getBalanceAmount() {
        await this.balanceAmount.waitForDisplayed({ timeout: 5000 });
        return await this.balanceAmount.getText();
    }

    /**
     * Check if balance is visible (not hidden with dots)
     */
    async isBalanceVisible() {
        const balanceText = await this.getBalanceAmount();
        return !balanceText.includes('••••••');
    }

    /**
     * Toggle balance visibility
     */
    async toggleBalanceVisibility() {
        await this.balanceVisibilityToggle.waitForDisplayed({ timeout: 5000 });
        await this.balanceVisibilityToggle.tap();
        console.log('[HOME PAGE] Balance visibility toggled');
    }

    /**
     * Tap sign out button
     */
    async tapSignOut() {
        await this.signOutButton.waitForDisplayed({ timeout: 5000 });
        await this.signOutButton.tap();
        console.log('[HOME PAGE] Sign out button tapped');
    }

    /**
     * Tap send money button
     */
    async tapSendMoney() {
        await this.sendMoneyButton.waitForDisplayed({ timeout: 5000 });
        await this.sendMoneyButton.tap();
        console.log('[HOME PAGE] Send money button tapped');
    }

    /**
     * Tap request money button
     */
    async tapRequestMoney() {
        await this.requestMoneyButton.waitForDisplayed({ timeout: 5000 });
        await this.requestMoneyButton.tap();
        console.log('[HOME PAGE] Request money button tapped');
    }

    /**
     * Tap view history button
     */
    async tapViewHistory() {
        await this.viewHistoryButton.waitForDisplayed({ timeout: 5000 });
        await this.viewHistoryButton.tap();
        console.log('[HOME PAGE] View history button tapped');
    }

    /**
     * Tap see all transfers
     */
    async tapSeeAllTransfers() {
        await this.seeAllTransfers.waitForDisplayed({ timeout: 5000 });
        await this.seeAllTransfers.tap();
        console.log('[HOME PAGE] See all transfers tapped');
    }

    /**
     * Check if transfers are loading
     */
    async isTransfersLoading() {
        try {
            return await this.loadingContainer.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    /**
     * Wait for transfers to load
     */
    async waitForTransfersToLoad() {
        // Wait for loading to disappear or transfers list to appear
        try {
            await this.loadingContainer.waitForDisplayed({ timeout: 3000, reverse: true });
        } catch (error) {
            // Loading might not appear if data loads quickly
        }
        
        try {
            await this.transfersList.waitForDisplayed({ timeout: 10000 });
            console.log('[HOME PAGE] Transfers loaded successfully');
        } catch (error) {
            console.log('[HOME PAGE] No transfers to display or transfers section not visible');
        }
    }

    /**
     * Check if transfers list is displayed
     */
    async isTransfersListDisplayed() {
        try {
            return await this.transfersList.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    /**
     * Refresh the screen by scrolling down
     */
    async refreshScreen() {
        await this.homeScreenScrollView.waitForDisplayed({ timeout: 5000 });
        
        // Perform pull-to-refresh gesture
        const screenSize = await browser.getWindowSize();
        const startY = Math.floor(screenSize.height * 0.3);
        const endY = Math.floor(screenSize.height * 0.7);
        const centerX = Math.floor(screenSize.width * 0.5);

        await browser.touchAction([
            { action: 'press', x: centerX, y: startY },
            { action: 'wait', ms: 100 },
            { action: 'moveTo', x: centerX, y: endY },
            { action: 'release' }
        ]);

        console.log('[HOME PAGE] Refresh gesture performed');
        
        // Wait a moment for refresh to complete
        await browser.pause(2000);
    }

    /**
     * Scroll to bottom of the screen
     */
    async scrollToBottom() {
        await this.homeScreenScrollView.waitForDisplayed({ timeout: 5000 });
        
        const screenSize = await browser.getWindowSize();
        const startY = Math.floor(screenSize.height * 0.7);
        const endY = Math.floor(screenSize.height * 0.3);
        const centerX = Math.floor(screenSize.width * 0.5);

        await browser.touchAction([
            { action: 'press', x: centerX, y: startY },
            { action: 'wait', ms: 100 },
            { action: 'moveTo', x: centerX, y: endY },
            { action: 'release' }
        ]);

        console.log('[HOME PAGE] Scrolled to bottom');
    }

    /**
     * Verify all main sections are displayed
     */
    async verifyMainSectionsDisplayed() {
        const sections = [
            { element: this.homeScreenHeader, name: 'Header' },
            { element: this.balanceCard, name: 'Balance Card' },
            { element: this.quickActionsSection, name: 'Quick Actions' },
            { element: this.transfersSection, name: 'Transfers Section' }
        ];

        for (const section of sections) {
            await section.element.waitForDisplayed({ timeout: 5000 });
            const isDisplayed = await section.element.isDisplayed();
            if (!isDisplayed) {
                throw new Error(`[HOME PAGE] ${section.name} section is not displayed`);
            }
        }

        console.log('[HOME PAGE] All main sections are displayed');
        return true;
    }

    /**
     * Verify quick action buttons are displayed
     */
    async verifyQuickActionButtonsDisplayed() {
        const buttons = [
            { element: this.sendMoneyButton, name: 'Send Money' },
            { element: this.requestMoneyButton, name: 'Request Money' },
            { element: this.viewHistoryButton, name: 'View History' }
        ];

        for (const button of buttons) {
            await button.element.waitForDisplayed({ timeout: 5000 });
            const isDisplayed = await button.element.isDisplayed();
            if (!isDisplayed) {
                throw new Error(`[HOME PAGE] ${button.name} button is not displayed`);
            }
        }

        console.log('[HOME PAGE] All quick action buttons are displayed');
        return true;
    }
}

export default new HomeScreen(); 