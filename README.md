# chrome-tab-mute

[![npm version](https://img.shields.io/npm/v/chrome-tab-mute)](https://npmjs.com/package/chrome-tab-mute)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Chrome Web Extension](https://img.shields.io/badge/Chrome-Web%20Extension-orange.svg)](https://developer.chrome.com/docs/extensions/)
[![CI Status](https://github.com/theluckystrike/chrome-tab-mute/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/chrome-tab-mute/actions)
[![Discord](https://img.shields.io/badge/Discord-Zovo-blueviolet.svg?logo=discord)](https://discord.gg/zovo)
[![Website](https://img.shields.io/badge/Website-zovo.one-blue)](https://zovo.one)
[![GitHub Stars](https://img.shields.io/github/stars/theluckystrike/chrome-tab-mute?style=social)](https://github.com/theluckystrike/chrome-tab-mute)

> Mute and unmute tabs in Chrome extensions.

**chrome-tab-mute** provides utilities to control audio muting for individual tabs. Part of the Zovo Chrome extension utilities.

Part of the [Zovo](https://zovo.one) developer tools family.

## Overview

chrome-tab-mute provides utilities to control audio muting for individual tabs.

## Features

- ✅ **Mute/Unmute** - Control tab audio
- ✅ **Check State** - Get current mute state
- ✅ **Bulk Operations** - Mute/unmute multiple tabs
- ✅ **TypeScript Support** - Full type definitions included

## Installation

```bash
npm install chrome-tab-mute
```

## Usage

```javascript
import { TabMute } from 'chrome-tab-mute';

// Mute a tab
await TabMute.mute(tabId);

// Unmute a tab
await TabMute.unmute(tabId);

// Check if muted
const isMuted = await TabMute.isMuted(tabId);

// Toggle mute state
await TabMute.toggle(tabId);
```

## API

### Methods

| Method | Description |
|--------|-------------|
| `TabMute.mute(tabId)` | Mute tab |
| `TabMute.unmute(tabId)` | Unmute tab |
| `TabMute.toggle(tabId)` | Toggle mute state |
| `TabMute.isMuted(tabId)` | Check muted state |
| `TabMute.muteAll(windowId?)` | Mute all tabs in window |

## License

MIT — [Zovo](https://zovo.one)

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/mute-feature`
3. **Make** your changes
4. **Test** your changes: `npm test`
5. **Commit** your changes: `git commit -m 'Add new feature'`
6. **Push** to the branch: `git push origin feature/mute-feature`
7. **Submit** a Pull Request

## See Also

### Related Zovo Repositories

- [chrome-tab-pin](https://github.com/theluckystrike/chrome-tab-pin) - Tab pinning
- [chrome-tab-groups-api](https://github.com/theluckystrike/chrome-tab-groups-api) - Tab groups
- [chrome-tab-discard](https://github.com/theluckystrike/chrome-tab-discard) - Tab discarding

### Zovo Chrome Extensions

- [Zovo Tab Manager](https://chrome.google.com/webstore/detail/zovo-tab-manager) - Manage tabs efficiently
- [Zovo Focus](https://chrome.google.com/webstore/detail/zovo-focus) - Block distractions

Visit [zovo.one](https://zovo.one) for more information.
