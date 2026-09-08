# Ctrl+Left Click Image Downloader

![Ctrl+Left Click Image Downloader logo](assets/logo-512.png)

A Firefox extension that downloads an image as PNG when you hold **Ctrl** and left-click it. It works across regular websites and includes additional best-resolution detection for Google Images.

## Mozilla Add-ons

The Mozilla Add-ons listing link will be added here as soon as the published AMO URL is confirmed.

## Features

- Ctrl+left-click any visible image to download it.
- Tries linked originals, responsive image sources, and high-resolution Google Images URLs before using the visible image.
- Converts locally to PNG while preserving genuine alpha transparency.
- Uses safe filenames and Firefox's Downloads API.
- Includes an enabled/disabled toolbar toggle.
- Contains no analytics, advertising, tracking, accounts, or developer-operated servers.

## Install

The packaged extension is available at [`dist/ctrl-left-click-image-downloader-1.1.0.zip`](dist/ctrl-left-click-image-downloader-1.1.0.zip). Standard Firefox installations require a Mozilla-signed build; use the Mozilla Add-ons listing once available.

For temporary development installation, open `about:debugging`, choose **This Firefox**, select **Load Temporary Add-on…**, and open `extension/manifest.json`.

## Repository status and license

This is a private, proprietary repository. The software is **not open source**.

Copyright © 2026. All rights reserved. See [LICENSE](LICENSE).
