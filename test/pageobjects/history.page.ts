class HistoryScreen {
    // Main container elements
    get historyScreenContainer() { return $('~history-screen-container'); }
    get historyScreenScrollView() { return $('~history-screen-scroll-view'); }

    // Header section
    get historyScreenHeader() { return $('~history-screen-header'); }
    get backButton() { return $('~history-screen-back-button'); }
    get backIcon() { return $('~history-screen-back-icon'); }
    get title() { return $('~history-screen-title'); }

    // Summary section
    get summaryContainer() { return $('~history-screen-summary'); }
    get summaryIcon() { return $('~history-screen-summary-icon'); }
    get summaryTitle() { return $('~history-screen-summary-title'); }
    get summaryCount() { return $('~history-screen-summary-count'); }

    // Error state
    get errorContainer() { return $('~history-screen-error-container'); }
    get errorIcon() { return $('~history-screen-error-icon'); }
    get errorText() { return $('~history-screen-error-text'); }

    // Loading state
    get loadingContainer() { return $('~history-screen-loading-container'); }
    get loadingIndicator() { return $('~history-screen-loading-indicator'); }
    get loadingText() { return $('~history-screen-loading-text'); }

    // Transfers list
    get transfersList() { return $('~history-screen-transfers-list'); }

    // Empty state
    get emptyContainer() { return $('~history-screen-empty-container'); }
    get emptyIcon() { return $('~history-screen-empty-icon'); }
    get emptyTitle() { return $('~history-screen-empty-title'); }
    get emptySubtitle() { return $('~history-screen-empty-subtitle'); }

    /**
     * Wait for history screen to be loaded
     */
    async waitForHistoryScreenLoaded() {
        await this.historyScreenContainer.waitForDisplayed({ timeout: 15000 });
        await this.historyScreenHeader.waitForDisplayed({ timeout: 5000 });
        await this.summaryContainer.waitForDisplayed({ timeout: 5000 });
        console.log('[HISTORY PAGE] History screen loaded successfully');
    }

    /**
     * Check if history screen is displayed
     */
    async isHistoryScreenDisplayed() {
        return await this.historyScreenContainer.isDisplayed();
    }

    /**
     * Tap back button
     */
    async tapBackButton() {
        await this.backButton.waitForDisplayed({ timeout: 5000 });
        await this.backButton.tap();
        console.log('[HISTORY PAGE] Back button tapped');
    }

    /**
     * Get screen title text
     */
    async getTitleText() {
        await this.title.waitForDisplayed({ timeout: 5000 });
        return await this.title.getText();
    }

    /**
     * Get summary title text
     */
    async getSummaryTitleText() {
        await this.summaryTitle.waitForDisplayed({ timeout: 5000 });
        return await this.summaryTitle.getText();
    }

    /**
     * Get summary count text
     */
    async getSummaryCountText() {
        try {
            await this.summaryCount.waitForDisplayed({ timeout: 5000 });
            return await this.summaryCount.getText();
        } catch (error) {
            return null; // Count might not be displayed if no data
        }
    }

    /**
     * Check if loading is displayed
     */
    async isLoadingDisplayed() {
        try {
            return await this.loadingContainer.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    /**
     * Wait for loading to disappear
     */
    async waitForLoadingToDisappear() {
        try {
            await this.loadingContainer.waitForDisplayed({ timeout: 15000, reverse: true });
            console.log('[HISTORY PAGE] Loading completed');
        } catch (error) {
            console.log('[HISTORY PAGE] Loading element not found or already disappeared');
        }
    }

    /**
     * Check if error is displayed
     */
    async isErrorDisplayed() {
        try {
            return await this.errorContainer.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    /**
     * Get error message text
     */
    async getErrorMessage() {
        if (await this.isErrorDisplayed()) {
            await this.errorText.waitForDisplayed({ timeout: 5000 });
            return await this.errorText.getText();
        }
        return null;
    }

    /**
     * Check if empty state is displayed
     */
    async isEmptyStateDisplayed() {
        try {
            return await this.emptyContainer.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    /**
     * Get empty state title text
     */
    async getEmptyStateTitle() {
        if (await this.isEmptyStateDisplayed()) {
            await this.emptyTitle.waitForDisplayed({ timeout: 5000 });
            return await this.emptyTitle.getText();
        }
        return null;
    }

    /**
     * Get empty state subtitle text
     */
    async getEmptyStateSubtitle() {
        if (await this.isEmptyStateDisplayed()) {
            await this.emptySubtitle.waitForDisplayed({ timeout: 5000 });
            return await this.emptySubtitle.getText();
        }
        return null;
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
     * Get all transfer items in the list
     */
    async getTransferItems() {
        if (await this.isTransfersListDisplayed()) {
            await this.transfersList.waitForDisplayed({ timeout: 10000 });
            // Transfer items are rendered as View components with card styling
            const transferItems = await this.transfersList.$$('android.view.ViewGroup');
            return transferItems;
        }
        return [];
    }

    /**
     * Get the count of transfer items
     */
    async getTransferItemsCount() {
        try {
            const transferItems = await this.getTransferItems();
            const count = transferItems.length;
            console.log(`[HISTORY PAGE] Found ${count} transfer items`);
            return count;
        } catch (error) {
            console.log('[HISTORY PAGE] Error counting transfer items:', error.message);
            return 0;
        }
    }

    /**
     * Verify history screen displays correct number of transfers
     */
    async verifyTransferCount(expectedCount: number) {
        await this.waitForLoadingToDisappear();
        
        if (expectedCount === 0) {
            const isEmptyDisplayed = await this.isEmptyStateDisplayed();
            expect(isEmptyDisplayed).toBe(true);
            console.log('[HISTORY PAGE] Empty state verification passed');
        } else {
            const actualCount = await this.getTransferItemsCount();
            expect(actualCount).toBe(expectedCount);
            
            // Also verify summary count if displayed
            const summaryText = await this.getSummaryCountText();
            if (summaryText) {
                expect(summaryText).toContain(expectedCount.toString());
            }
            
            console.log(`[HISTORY PAGE] Transfer count verification passed - Expected: ${expectedCount}, Actual: ${actualCount}`);
        }
    }

    /**
     * Verify all main elements are displayed
     */
    async verifyMainElementsDisplayed() {
        const elements = [
            { element: this.historyScreenHeader, name: 'Header' },
            { element: this.backButton, name: 'Back Button' },
            { element: this.title, name: 'Title' },
            { element: this.summaryContainer, name: 'Summary Container' },
            { element: this.summaryIcon, name: 'Summary Icon' },
            { element: this.summaryTitle, name: 'Summary Title' }
        ];

        for (const { element, name } of elements) {
            await element.waitForDisplayed({ timeout: 5000 });
            console.log(`[HISTORY PAGE] ${name} is displayed`);
        }

        console.log('[HISTORY PAGE] All main elements verified as displayed');
    }

    /**
     * Perform pull-to-refresh
     */
    async performPullToRefresh() {
        await this.historyScreenScrollView.waitForDisplayed({ timeout: 5000 });
        
        // Get the scroll view bounds
        const scrollViewLocation = await this.historyScreenScrollView.getLocation();
        const scrollViewSize = await this.historyScreenScrollView.getSize();
        
        // Calculate coordinates for pull-to-refresh gesture
        const startX = scrollViewLocation.x + scrollViewSize.width / 2;
        const startY = scrollViewLocation.y + 100; // Start a bit down from the top
        const endY = scrollViewLocation.y + scrollViewSize.height / 2; // Pull down to middle
        
        // Perform the pull-to-refresh gesture
        await browser.touchAction([
            { action: 'press', x: startX, y: startY },
            { action: 'wait', ms: 100 },
            { action: 'moveTo', x: startX, y: endY },
            { action: 'release' }
        ]);
        
        console.log('[HISTORY PAGE] Pull-to-refresh gesture performed');
        
        // Wait a moment for the refresh to trigger
        await browser.pause(1000);
    }

    /**
     * Scroll to element if needed
     */
    async scrollToElement(element: WebdriverIO.Element) {
        try {
            await element.scrollIntoView();
            console.log('[HISTORY PAGE] Scrolled to element');
        } catch (error) {
            console.log('[HISTORY PAGE] Could not scroll to element:', error.message);
        }
    }

    /**
     * Wait for screen to be ready (no loading, no errors)
     */
    async waitForScreenReady() {
        await this.waitForHistoryScreenLoaded();
        await this.waitForLoadingToDisappear();
        
        // Check if there are any errors
        const hasError = await this.isErrorDisplayed();
        if (hasError) {
            const errorMessage = await this.getErrorMessage();
            console.warn(`[HISTORY PAGE] Screen loaded with error: ${errorMessage}`);
        }
        
        console.log('[HISTORY PAGE] Screen is ready');
    }
}

export default new HistoryScreen(); 