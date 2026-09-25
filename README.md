# README

Static site with a login gate and a Leaflet/OpenStreetMap view of a secret pin location, deployed to GitHub Pages via GitHub Actions.

> **Note on security:** this is a static site — there is no server. The username/password hashes and the pin coordinates are baked into the deployed JS bundle at build time. The login is a "speed bump," not real access control: anyone inspecting the deployed files can find the pin coordinates regardless of login state, and could brute-force the password hash offline. Don't use this for anything that needs real security.

## Required GitHub repository secrets

Set these under **Settings → Secrets and variables → Actions → New repository secret**. They are only used during the build (to compute password/username hashes and inline the pin data) and are never committed to the repo.

| Secret        | Example            | Notes                                  |
|---------------|---------------------|-----------------------------------------|
| `APP_USERNAME`| `alice`             | Plaintext; hashed at build time         |
| `APP_PASSWORD`| `s3cr3t`            | Plaintext; hashed at build time         |
| `PIN_LAT`     | `48.8584`           | Decimal latitude                        |
| `PIN_LNG`     | `2.2945`            | Decimal longitude                       |
| `PIN_LABEL`   | `Eiffel Tower`      | Popup text shown on the marker          |

## Enabling GitHub Pages

**Settings → Pages → Build and deployment → Source → GitHub Actions**. The workflow at [.github/workflows/deploy.yml](.github/workflows/deploy.yml) builds and deploys on every push to `main`.

## Local development

Generate a local `.env.local` (git-ignored) with hashed test credentials, then run the dev server:

```sh
npm install
APP_USERNAME=testuser APP_PASSWORD=testpass PIN_LAT=48.8584 PIN_LNG=2.2945 PIN_LABEL="Eiffel Tower" node scripts/hash-secrets.mjs .env.local
npm run dev
```
