# Developer & Content Management Guide

This guide details how to add, modify, and audit content on this quantitative research portfolio. All content follows strict mathematical and empirical rules: **rigor beats decoration, and synthetic data is always labelled synthetic**.

---

## 1. Updating Personal Information
All global metadata lives in [`data/site.ts`](./data/site.ts). Modifying this file propagates automatically across the navbar, hero, factsheet, contact forms, and SEO metadata.

```typescript
export const siteConfig = {
  name: "MD SAJID AHMAD",
  email: "ahmadmdsajid129@gmail.com",
  location: "Surat, Gujarat, India",
  availableFrom: "Immediate",
  // ...
};
```

---

## 2. Adding a New Quantitative Project
1. Open [`data/projects.ts`](./data/projects.ts).
2. Append a new object following the `ProjectData` TypeScript interface:
   - Include real measured numbers (accuracy, paths, latencies, PR-AUC).
   - Define Truthful Honesty Badges (`verified: true` or `false`).
   - Fill out the **"How this could be wrong"** caveats section.
   - Add 4-6 interview defense talking points.
3. Create the corresponding narrative write-up in `content/projects/<slug>.mdx`.
4. Run `npm run build` to verify static page generation for `/projects/<slug>`.

---

## 3. Appending a Forward-Testing Signal (Cryptographic Audit)
To log a pre-market paper trading signal with a verifiable SHA-256 fingerprint:

1. Run the hashing script:
   ```bash
   npx tsx scripts/append-signal.ts "LONG SPREAD_REVERSION" "<COMMIT_HASH>" "+12.4"
   ```
2. The script calculates the SHA-256 digest of `{ date, timestampUTC, signal, commitHash }` and appends it to [`data/live-signals.json`](./data/live-signals.json).
3. Commit and push to GitHub before the opening bell. Anyone can verify the hash using the on-page **SHA-256 Web Crypto Verifier**.

---

## 4. Logging a Failed Idea to the Anti-Portfolio
In quantitative research, showing what failed is the ultimate test of integrity:

1. Open [`data/antiportfolio.ts`](./data/antiportfolio.ts).
2. Add an entry to `antiPortfolioEntries`:
   - Set status: `"COSTS KILLED IT"`, `"OVERFIT"`, `"NO EDGE OOS"`, or `"DEAD"`.
   - Record the discrepancy between in-sample metric and out-of-sample result.
   - Explain the root cause and architectural pivot.
3. If applicable, author an analytical memo in `content/notes/<slug>.mdx`.
