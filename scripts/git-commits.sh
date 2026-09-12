#!/bin/bash
set -e

# Unstage all files first
git reset

# Add Ivy API client
git add scripts/api.ts
git commit -m "feat: add Ivy API client"

# Implement authentication
git add app/login app/api/auth components/AuthProvider.tsx
git commit -m "feat: implement authentication"

# Add API discovery scripts
git add scripts/verify-documentation.ts
git commit -m "feat: add API discovery scripts"

# Collect complete property dataset
# Only add the complete json files and the fetch scripts
git add scripts/fetch-all-*.ts
git add data/*_complete.json
git add data/*_offset_*.json || true
git commit -m "feat: collect complete property dataset"

# Implement data analysis
git add scripts/solve-questions.ts
git commit -m "feat: implement data analysis"

# Add documentation discrepancy findings
git add data/findings.json
git commit -m "feat: add documentation discrepancy findings"

# Implement listings page
git add app/listings/page.tsx components/ListingCard.tsx components/ListingsFilter.tsx components/Navbar.tsx
git commit -m "feat: implement listings page"

# Implement listing details
git add app/listings/\[id\]
git commit -m "feat: implement listing details"

# Implement favourites
git add app/favourites app/api/favourites
git commit -m "feat: implement favourites"

# Implement rentals
git add app/rentals app/api/rentals components/RentalCard.tsx
git commit -m "feat: implement rentals"

# Implement projects
git add app/projects app/api/projects components/ProjectCard.tsx
git commit -m "feat: implement projects"

# Add insights dashboard
git add app/insights app/api/insights
git commit -m "feat: add insights dashboard"

# Validate API and frontend flows
git add test-filters.js test-limit.js
git commit -m "test: validate API and frontend flows"

# Add investigation and submission documentation
git add submission.json README.md
git commit -m "docs: add investigation and submission documentation"

# Prepare Vercel deployment
git add .
git commit -m "chore: prepare Vercel deployment"
