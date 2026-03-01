/**
 * Tab Mute — Audio control for Chrome tabs
 */
export class TabMute {
    /** Mute a tab */
    static async mute(tabId: number): Promise<void> { await chrome.tabs.update(tabId, { muted: true }); }

    /** Unmute a tab */
    static async unmute(tabId: number): Promise<void> { await chrome.tabs.update(tabId, { muted: false }); }

    /** Toggle mute */
    static async toggle(tabId: number): Promise<boolean> {
        const tab = await chrome.tabs.get(tabId);
        const muted = !tab.mutedInfo?.muted;
        await chrome.tabs.update(tabId, { muted });
        return muted;
    }

    /** Mute all tabs */
    static async muteAll(): Promise<number> {
        const tabs = await chrome.tabs.query({});
        let count = 0;
        for (const tab of tabs) { if (tab.id) { await chrome.tabs.update(tab.id, { muted: true }); count++; } }
        return count;
    }

    /** Unmute all tabs */
    static async unmuteAll(): Promise<number> {
        const tabs = await chrome.tabs.query({ muted: true });
        let count = 0;
        for (const tab of tabs) { if (tab.id) { await chrome.tabs.update(tab.id, { muted: false }); count++; } }
        return count;
    }

    /** Mute all tabs except active */
    static async muteBackground(): Promise<number> {
        const tabs = await chrome.tabs.query({ active: false });
        let count = 0;
        for (const tab of tabs) { if (tab.id && tab.audible) { await chrome.tabs.update(tab.id, { muted: true }); count++; } }
        return count;
    }

    /** Mute tabs matching domain */
    static async muteByDomain(domain: string): Promise<number> {
        const tabs = await chrome.tabs.query({});
        let count = 0;
        for (const tab of tabs) {
            if (tab.id && tab.url?.includes(domain)) { await chrome.tabs.update(tab.id, { muted: true }); count++; }
        }
        return count;
    }

    /** Get all audible tabs */
    static async getAudible(): Promise<chrome.tabs.Tab[]> { return chrome.tabs.query({ audible: true }); }

    /** Get all muted tabs */
    static async getMuted(): Promise<chrome.tabs.Tab[]> { return chrome.tabs.query({ muted: true }); }
}
