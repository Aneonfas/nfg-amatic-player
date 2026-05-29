# NFG A-Matic Player

NFG A-Matic Player is a Windows runtime for installing and running screen-aware automation packages.

## Official links

- Website: https://nfg-system.online/
- Recommended installer: https://nfg-system.online/download
- Portable ZIP: https://nfg-system.online/download/portable
- GitHub release: https://github.com/Aneonfas/nfg-amatic-player/releases/tag/player-0.1.4-beta.1
- Package catalog: https://nfg-system.online/packages/
- Support: https://nfg-system.online/support
- Discord support: https://nfg-system.online/discord

## Current beta

- Player: `0.1.4-beta.1`
- Runtime/Core: `0.1.11`
- Platform: Windows x64
- Status: beta, unsigned

## Downloads

Recommended installer:

```text
NFG_A-Matic_Player_Setup_0.1.4-beta.1_win-x64.exe
```

Portable fallback archive:

```text
NFG_A-Matic_Player_0.1.4-beta.1_win-x64.zip
```

Release assets are hosted on GitHub Releases:

https://github.com/Aneonfas/nfg-amatic-player/releases/tag/player-0.1.4-beta.1

## Verification

- Installer SHA256: `1F73BAEFC8AC0E5B8A0C3B8002D7378A2AEE3ACB255D030E78CDE24F71321A4D`
- Portable ZIP SHA256: `AD7331E06A339BE03A43E685612E5543A3E5A5F0C6146CECEC90C67560C15597`

## Packages

Current public package:

- Foxhole Helper `0.4.5`

The package catalog source lives in:

https://github.com/Aneonfas/nfg-amatic-packages

## Website deployment

The website is served by the Cloudflare Worker `polished-poetry-b345` on `nfg-system.online`.

Source:

- `index.html`, `foxhole-clicker/`, `packages/`, `support/` - static site pages.
- `assets/` - CSS, JavaScript, brand assets, and public screenshots.
- `worker.js` - lightweight Cloudflare Worker router that serves site files from this repository and redirects downloads to GitHub Releases.
- `wrangler.toml` - deployment metadata for the Worker name and compatibility date.

## Notes

NFG A-Matic Player is currently in beta.

Known limitations:

- No Player auto-updater yet.
- Windows may show SmartScreen or Unknown Publisher warnings because the installer is not Authenticode-signed yet.
- Studio is not publicly distributed yet.
