# Ivy Homes Property Explorer

A clean, reliable property discovery application built on Next.js 14 (App Router) and Tailwind CSS. 
It integrates directly with the provided Ivy API, incorporating a fully server-side proxy to keep credentials secure and enabling accurate data-quality investigation.

## Features
- **Secure Authentication**: Uses the real Ivy API token flow, automatically refreshing sessions in the background. Token logic and API Keys are fully insulated from the client browser.
- **Robust Discovery**: Paginated browsing for Listings, Rentals, and Projects with functional filtering and sorting (performed reliably via our in-memory server proxy, correcting for the actual API ignoring query parameters).
- **Persistent Favourites**: Saved properties are persisted server-side per-user account, surviving page reloads and re-logins.
- **Data Insights**: A dashboard presenting the computed answers to the 10 data-investigation questions alongside evidence-based data-quality findings.
- **Production Ready**: Verified Vercel deployment with environment variables and secure configuration.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and add your credentials:
   ```bash
   cp .env.example .env.local
   # Fill in IVY_API_KEY, IVY_EMAIL, and IVY_PASSWORD
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Data Investigation Methodology

1. **Discovery & Auditing**: Before building the UI, I wrote `scripts/verify-documentation.ts` to programmatically probe the API endpoints, test pagination limits, filtering parameters, sorting, and field availability against the documented claims.
2. **Collection**: I created standalone data extraction scripts (`scripts/fetch-all-listings.ts`, etc.) to iterate over the APIs and cache the complete dataset into `data/*.json`. This allowed for fast, deterministic analysis without hammering the live service.
3. **Analysis**: `scripts/solve-questions.ts` computed the 10 exact answers based on the local cached datasets and synthesized them with the `findings.json` generated during the audit phase to produce the final `submission.json`.

### Unsuccessful Hypotheses (Distrusted & Confirmed Broken)

- **Query Parameters**: Hypothesized that `/v1/listings`, `/v1/rentals`, and `/v1/projects` would accept documented query parameters for filtering (e.g. `bedroom`, `furnishing`) and sorting (`sort`). **Disproved**: The actual API consistently ignores them and returns unfiltered data, necessitating manual server-side filtering.
- **High Pagination Limits**: Hypothesized that the API would scale dynamically based on the documented `limit` query parameter. **Disproved**: The API threw `500 Internal Server Error` when requesting very large limits (e.g., `limit=6000`), restricting practical collection to smaller batch chunks (e.g., `limit=50`).
- **Pagination Structure**: Hypothesized that the API used `page`/`page_size` based on the documentation payload shape. **Disproved**: The API strictly uses `offset`/`limit`.

### Successful Hypotheses (Verified & Utilized)

- **Token Architecture**: Hypothesized that the login flow issues a standard Bearer token usable for downstream endpoints. **Verified**: The JWT structure was valid, though with a short (15 minute) lifespan requiring background refresh flows.
- **Core Data Model**: Hypothesized that base metrics like location, raw price, and amenities were functional. **Verified**: The majority of the core payload shape was reliable, excluding specifically identified fake listings or corrupt area definitions.
- **Offset Pagination Stability**: Hypothesized that iterating using `offset` with a low `limit` of 50 would remain stable. **Verified**: Successfully used this exact mechanism to download the entire dataset reliably.

### Reproducible Findings

The full list of discrepancies is detailed in `submission.json` and presented on the `/insights` page. Key findings include:
- **Pagination Logic**: The documentation claimed `page`/`page_size` was used, but the actual API strictly uses `offset`/`limit`.
- **Ignored Parameters**: Attempting to filter by `bedroom` or `furnishing` simply returned the entire dataset.
- **Data Corruption**: Several listings reported a `carpet_area` larger than their `super_built_up_area`, and others had highly suspicious zero-values for pricing.

## Future Improvements (With 2 Additional Days)

1. **Database Integration**: Rather than reading JSON files into an in-memory API proxy, I would seed the fetched properties into a Postgres (e.g., Supabase) or Redis database to allow highly optimized, scalable server-side filtering and full-text search.
2. **End-to-End Testing**: Implement Playwright to add automated browser testing covering the critical authentication and filtering flows.
3. **Enhanced Visualizations**: Integrate `recharts` for more interactive graphical analysis of the market distribution on the Insights page.
