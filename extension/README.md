# Ctrl+Left Click Image Downloader

Hold **Ctrl** and left-click an image on any regular website. The extension tries likely full-resolution URLs first, converts the first accessible image to PNG in Firefox, and downloads it. Existing alpha transparency is preserved; opaque sources remain opaque.

Google Images receives additional best-image URL handling, while ordinary websites use links, responsive image sources, data attributes, and the visible image as candidates.

## Temporary installation

1. Open `about:debugging` in Firefox.
2. Choose **This Firefox**.
3. Click **Load Temporary Add-on…**.
4. Select `manifest.json` from the unpacked extension folder.
5. Refresh any tabs that were already open.

Temporary add-ons are removed when Firefox restarts.

## Privacy

The extension contains no analytics, advertising, tracking, accounts, or developer-operated servers. Settings remain in Firefox. A user-triggered download fetches the selected image directly from the website or image host so it can be converted locally to PNG.

## Permissions

- **Access data for all websites:** required to detect Ctrl+left-clicks and fetch image files hosted on arbitrary domains.
- **Download files:** required to save converted PNG files through Firefox's download manager.
- **Store data:** used only for the enabled/disabled preference.
- Some sites block cross-origin or automated image access. The extension tries multiple candidate URLs, including the visible image, and reports failure without disrupting ordinary clicks.
- Firefox's normal download preference still controls whether a save-location dialog appears.

## Mozilla submission

The extension is plain, readable JavaScript with no build step, minification, remote code, or third-party dependencies. Submit the packaged ZIP as a listed extension through addons.mozilla.org or `web-ext sign --channel=listed`. API credentials must be supplied through local environment variables and must never be included in this folder.

## License

Copyright © 2026. All rights reserved. This software is proprietary and is not open source. See `LICENSE`.
