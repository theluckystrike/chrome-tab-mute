/**
 * Tab Mute — Audio control for Chrome tabs
 */

/** Custom error class for TabMute operations */
export class TabMuteError extends Error {
    constructor(
        message: string,
        public code: string,
        public suggestion?: string
    ) {
        super(message);
        this.name = 'TabMuteError';
        Error.captureStackTrace(this, this.constructor);
    }
}

/** Error codes for TabMute operations */
export const TabMuteErrorCode = {
    TAB_NOT_FOUND: 'TAB_NOT_FOUND',
    INVALID_TAB_ID: 'INVALID_TAB_ID',
    PERMISSION_DENIED: 'PERMISSION_DENIED',
    OPERATION_FAILED: 'OPERATION_FAILED',
    QUERY_FAILED: 'QUERY_FAILED',
} as const;

export class TabMute {
    /** Validate tabId parameter */
    private static validateTabId(tabId: number): void {
        if (typeof tabId !== 'number' || tabId < 0) {
            throw new TabMuteError(
                `Invalid tab ID: ${tabId}. Tab ID must be a positive number.`,
                TabMuteErrorCode.INVALID_TAB_ID,
                'Provide a valid tab ID obtained from chrome.tabs.query or chrome.tabs.create'
            );
        }
    }

    /** Mute a tab */
    static async mute(tabId: number): Promise<void> {
        try {
            this.validateTabId(tabId);
            await chrome.tabs.update(tabId, { muted: true });
        } catch (error) {
            if (error instanceof TabMuteError) throw error;
            if (error instanceof Error && error.message.includes('No tab with id')) {
                throw new TabMuteError(
                    `Tab not found: No tab with ID ${tabId}`,
                    TabMuteErrorCode.TAB_NOT_FOUND,
                    'The tab may have been closed. Verify the tab exists before attempting to mute it.'
                );
            }
            throw new TabMuteError(
                `Failed to mute tab ${tabId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
                TabMuteErrorCode.OPERATION_FAILED,
                'Ensure the tab is valid and you have the "tabs" permission'
            );
        }
    }

    /** Unmute a tab */
    static async unmute(tabId: number): Promise<void> {
        try {
            this.validateTabId(tabId);
            await chrome.tabs.update(tabId, { muted: false });
        } catch (error) {
            if (error instanceof TabMuteError) throw error;
            if (error instanceof Error && error.message.includes('No tab with id')) {
                throw new TabMuteError(
                    `Tab not found: No tab with ID ${tabId}`,
                    TabMuteErrorCode.TAB_NOT_FOUND,
                    'The tab may have been closed. Verify the tab exists before attempting to unmute it.'
                );
            }
            throw new TabMuteError(
                `Failed to unmute tab ${tabId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
                TabMuteErrorCode.OPERATION_FAILED,
                'Ensure the tab is valid and you have the "tabs" permission'
            );
        }
    }

    /** Toggle mute */
    static async toggle(tabId: number): Promise<boolean> {
        try {
            this.validateTabId(tabId);
            const tab = await chrome.tabs.get(tabId);
            if (!tab) {
                throw new TabMuteError(
                    `Tab not found: No tab with ID ${tabId}`,
                    TabMuteErrorCode.TAB_NOT_FOUND,
                    'The tab may have been closed.'
                );
            }
            const muted = !tab.mutedInfo?.muted;
            await chrome.tabs.update(tabId, { muted });
            return muted;
        } catch (error) {
            if (error instanceof TabMuteError) throw error;
            throw new TabMuteError(
                `Failed to toggle mute for tab ${tabId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
                TabMuteErrorCode.OPERATION_FAILED,
                'Ensure the tab is valid'
            );
        }
    }

    /** Mute all tabs */
    static async muteAll(): Promise<{ success: number; failed: number }> {
        try {
            const tabs = await chrome.tabs.query({});
            let success = 0;
            const failed: number[] = [];
            for (const tab of tabs) { 
                if (tab.id) { 
                    try {
                        await chrome.tabs.update(tab.id, { muted: true });
                        success++;
                    } catch {
                        failed.push(tab.id);
                    }
                }
            }
            return { success, failed: failed.length };
        } catch (error) {
            throw new TabMuteError(
                `Failed to query tabs: ${error instanceof Error ? error.message : 'Unknown error'}`,
                TabMuteErrorCode.QUERY_FAILED,
                'Ensure you have the "tabs" permission in your manifest'
            );
        }
    }

    /** Unmute all tabs */
    static async unmuteAll(): Promise<{ success: number; failed: number }> {
        try {
            const tabs = await chrome.tabs.query({ muted: true });
            let success = 0;
            const failed: number[] = [];
            for (const tab of tabs) { 
                if (tab.id) { 
                    try {
                        await chrome.tabs.update(tab.id, { muted: false });
                        success++;
                    } catch {
                        failed.push(tab.id);
                    }
                }
            }
            return { success, failed: failed.length };
        } catch (error) {
            throw new TabMuteError(
                `Failed to query muted tabs: ${error instanceof Error ? error.message : 'Unknown error'}`,
                TabMuteErrorCode.QUERY_FAILED,
                'Ensure you have the "tabs" permission in your manifest'
            );
        }
    }

    /** Mute all tabs except active */
    static async muteBackground(): Promise<{ success: number; failed: number }> {
        try {
            const tabs = await chrome.tabs.query({ active: false });
            let success = 0;
            const failed: number[] = [];
            for (const tab of tabs) { 
                if (tab.id && tab.audible) { 
                    try {
                        await chrome.tabs.update(tab.id, { muted: true });
                        success++;
                    } catch {
                        failed.push(tab.id);
                    }
                }
            }
            return { success, failed: failed.length };
        } catch (error) {
            throw new TabMuteError(
                `Failed to query tabs: ${error instanceof Error ? error.message : 'Unknown error'}`,
                TabMuteErrorCode.QUERY_FAILED,
                'Ensure you have the "tabs" permission in your manifest'
            );
        }
    }

    /** Mute tabs matching domain */
    static async muteByDomain(domain: string): Promise<{ success: number; failed: number; domain: string }> {
        try {
            if (!domain || typeof domain !== 'string') {
                throw new TabMuteError(
                    `Invalid domain: ${domain}. Domain must be a non-empty string.`,
                    TabMuteErrorCode.INVALID_TAB_ID,
                    'Provide a valid domain name (e.g., "example.com")'
                );
            }
            const tabs = await chrome.tabs.query({});
            let success = 0;
            const failed: number[] = [];
            for (const tab of tabs) {
                if (tab.id && tab.url?.includes(domain)) { 
                    try {
                        await chrome.tabs.update(tab.id, { muted: true });
                        success++;
                    } catch {
                        failed.push(tab.id);
                    }
                }
            }
            return { success, failed: failed.length, domain };
        } catch (error) {
            if (error instanceof TabMuteError) throw error;
            throw new TabMuteError(
                `Failed to mute by domain: ${error instanceof Error ? error.message : 'Unknown error'}`,
                TabMuteErrorCode.QUERY_FAILED
            );
        }
    }

    /** Get all audible tabs */
    static async getAudible(): Promise<chrome.tabs.Tab[]> {
        try {
            return await chrome.tabs.query({ audible: true });
        } catch (error) {
            throw new TabMuteError(
                `Failed to query audible tabs: ${error instanceof Error ? error.message : 'Unknown error'}`,
                TabMuteErrorCode.QUERY_FAILED,
                'Ensure you have the "tabs" permission in your manifest'
            );
        }
    }

    /** Get all muted tabs */
    static async getMuted(): Promise<chrome.tabs.Tab[]> {
        try {
            return await chrome.tabs.query({ muted: true });
        } catch (error) {
            throw new TabMuteError(
                `Failed to query muted tabs: ${error instanceof Error ? error.message : 'Unknown error'}`,
                TabMuteErrorCode.QUERY_FAILED,
                'Ensure you have the "tabs" permission in your manifest'
            );
        }
    }
}
