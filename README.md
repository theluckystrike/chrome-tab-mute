# chrome-tab-mute — Tab Audio Control for Extensions
> **Built by [Zovo](https://zovo.one)** | `npm i chrome-tab-mute`

Mute, unmute, toggle, mute-all, mute-background, and domain-based muting.

```typescript
import { TabMute } from 'chrome-tab-mute';
await TabMute.muteBackground();
await TabMute.muteByDomain('youtube.com');
const audible = await TabMute.getAudible();
```
MIT License
