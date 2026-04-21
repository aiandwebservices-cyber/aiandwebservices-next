# GitHub Actions Workflows

## nightly-backup.yml — Nightly Backup

Creates an automated nightly snapshot of the `main` branch at **11:00 PM America/New_York (04:00 UTC)**.

Each run:
1. Creates an annotated git tag (`backup-YYYY-MM-DD-HHMM-EST`) pointing at the current HEAD.
2. Builds a clean `.zip` of the source tree (excludes `node_modules/`, `.next/`, `.git/`, `.vercel/`, `.env*`, build artefacts, and `*.backup-*` files).
3. Publishes a GitHub Release (marked pre-release) with the zip attached and the commit SHA recorded.
4. Prunes releases whose tag starts with `backup-`, keeping only the **90 most recent**; older releases and their tags are deleted automatically.

---

## How to trigger manually

1. Go to the **Actions** tab of the repository on GitHub.
2. Select **Nightly Backup** in the left sidebar.
3. Click **Run workflow** → choose branch `main` → **Run workflow**.

The run will appear in the list within a few seconds.

---

## How to restore from a backup

### Option A — in-place code rollback (git tag)

```bash
git fetch --tags
git reset --hard backup-YYYY-MM-DD-HHMM-EST   # replace with the target tag
git push --force-with-lease origin main
```

Use this when you need the full git history intact and want to roll the live branch back quickly.

### Option B — restore from the zip archive

1. Open the **Releases** page on GitHub and find the desired nightly backup release.
2. Download the attached `.zip` file.
3. Extract and install:

```bash
unzip aiandwebservices-next-backup-YYYY-MM-DD-HHMM-EST.zip -d aiandwebservices-next-restored
cd aiandwebservices-next-restored
npm install
```

Use this when you want a clean directory without touching the live repo.
