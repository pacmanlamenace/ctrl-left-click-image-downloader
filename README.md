# Ctrl+Left Click Image Downloader

![Ctrl+Left Click Image Downloader logo](assets/logo-512.png)

A Firefox extension that downloads an image as PNG when you hold **Ctrl** and left-click it. It works across regular websites and includes additional best-resolution detection for Google Images.

## Mozilla Add-ons

[Install Ctrl+Left Click Image Downloader from Mozilla Add-ons](https://addons.mozilla.org/en-US/firefox/addon/ctrl-left-click-img-downloader/)

## Features

- Ctrl+left-click any visible image to download it.
- Tries linked originals, responsive image sources, and high-resolution Google Images URLs before using the visible image.
- Converts locally to PNG while preserving genuine alpha transparency.
- Uses safe filenames and Firefox's Downloads API.
- Includes an enabled/disabled toolbar toggle.
- Contains no analytics, advertising, tracking, accounts, or developer-operated servers.

## Install

The packaged extension is available at [`dist/ctrl-left-click-image-downloader-1.1.0.zip`](dist/ctrl-left-click-image-downloader-1.1.0.zip). For standard Firefox installations, use the signed build from the Mozilla Add-ons listing above.

For temporary development installation, open `about:debugging`, choose **This Firefox**, select **Load Temporary Add-on…**, and open `extension/manifest.json`.

## Repository status and license

Copyright © 2026 CTP (ctp@ctp.cc). All rights reserved. See [LICENSE](LICENSE).
