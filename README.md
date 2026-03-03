# chrome-tab-mute

Mute and unmute tabs in Chrome extensions.

## Overview

chrome-tab-mute provides utilities to control audio muting for individual tabs.

## Installation

```bash
npm install chrome-tab-mute
```

## Usage

```javascript
import { TabMute } from 'chrome-tab-mute';

await TabMute.mute(tabId);
await TabMute.unmute(tabId);
const isMuted = await TabMute.isMuted(tabId);
```

## API

- `mute(tabId)` - Mute tab
- `unmute(tabId)` - Unmute tab
- `isMuted(tabId)` - Check muted state

## License

MIT
