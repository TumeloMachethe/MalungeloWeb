MALUNGELO PROPERTIES — MOBILE UPDATE (14 SEP 2026)

WHAT CHANGED
- Reduced oversized mobile hero text and section spacing.
- Shortened mobile hero/property hero heights.
- Improved mobile navigation and touch targets.
- Made property cards more compact and fully responsive.
- Added compact 2-column feature tiles on normal phones.
- Changed galleries to swipe-friendly horizontal rows where appropriate.
- Improved album galleries for mobile.
- Made application inputs at least 16px to prevent Safari focus zoom.
- Improved legal pages, thank-you page, footer, floating buttons, and cards.
- Added viewport-fit=cover while preserving pinch zoom/accessibility.
- Added defensive overflow rules to prevent horizontal page overflow.

HOW TO USE
1. Back up the current site.
2. Replace your existing style.css with this style.css.
3. Replace the matching HTML files with the versions in this folder so they use the updated viewport setting.
4. Replace script.js only if you want this package to exactly match the files reviewed for this update; its behaviour was not materially changed.
5. Keep all your existing image/assets files in the same locations; this package contains code files only.
6. Commit/push to GitHub Pages and test on a real phone after deployment.

TESTED RESPONSIVE WIDTHS
- 360px
- 390px
- 430px
- 768px

The tested main/apply/property/album/legal/thank-you layouts did not create horizontal page overflow at those widths.
