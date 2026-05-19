# Product Requirements Document (PRD): Prestigious Institutional Web Portal

## 1. Executive Summary & Brand Identity
- **Goal:** Develop a prestigious, scholarly institutional web portal. The design must balance traditional authority with modern academic excellence.
- **Primary Color Palette:** Deep Scholarly Blue (`#1D4A7F`), Pure White, and Silver-Grey accents.
- **Typography:**
  - *Headings:* Elegant Serif (Academic/Prestigious weight).
  - *Body Text:* Sans-serif (Modern clarity).
- **Signature Brand Element (The Scholarly Watermark):** A very faint, Silver-Grey Arabic calligraphy pattern used as a background texture in the "About" and "Founder" sections to add a premium, textured feel.

## 2. Global Header & Navigation
- **Placement & Alignment:**
  - **Logo:** Far Left.
  - **Menu:** Center-Right (Home, About, Updates, Contact).
  - **Action Button:** Far Right (GIVE button).
- **Design Rules:** Establish a "Box-Free," high-end look seamlessly integrated with the content. Strictly **no background boxes or borders** around navigation links.
- **Dynamic Behavior:** 
  - 100% Transparent at the top (White text over the Hero video). 
  - Transitions to a solid background with Deep Blue text upon scrolling.
- **Call to Action:** The "GIVE" button must be a rounded-rectangle in Deep Blue featuring a minimalist heart/gift icon.

## 3. Home Page Architecture (The Vertical Stitch)
*The Home Page is a single-page scroll consisting of 9 distinct sections following a strict vertical order:*

1. **Hero Entrance:** A full-screen cinematic drone video of the campus. Includes the institution's name in a large, White Serif overlay.
2. **About DK Intro:** A split-layout with a high-quality campus image on the left and a three-paragraph descriptive text on the right. **Includes the Scholarly Watermark background.**
3. **The Impact Dashboard:** 
   - *Top Row:* Three circular "Global Reach" bubbles (Nations, Campuses, States).
   - *Main Grid:* 12 professional metrics (Doctors, PhDs, etc.) arranged in a staggered grid.
   - *Design:* No boxes. Each item features a minimalist blue icon and a 2px Deep Blue vertical accent line on the left side. 
   - *Animation:* All numbers must have a "Count-up" animation triggered on scroll.
4. **Founder’s Message:** A prestigious section featuring a circular portrait of the Rector and a clean white card containing the full message text. Strictly no "Read More" button; the text must be fully visible. **Includes the Scholarly Watermark background.**
5. **Campus Mosaic Gallery:** A high-definition masonry grid showcasing the Masjid, Library, academic blocks, and student life.
6. **Student Articles Showcase:** A grid of exactly 7 articles (1 Main Featured card + 6 smaller cards). Every "Read Article" link must **redirect to the external digital magazine site** (`inkspiredk.vercel.app`) in a new browser tab.
7. **Achievement Poster Slider:** An infinite horizontal auto-scrolling row of event and achievement posters. Posters must be clickable and "Pinch-to-zoom" enabled for mobile users.
8. **Events Timeline:** A horizontal sliding row of event cards. Each card features a large Deep Blue "Date Bubble" (replacing traditional list or calendar styles) showing the day and month clearly.
9. **Recent Updates:** A 2x2 grid of the four latest news items. Each card includes a thumbnail image, headline, and a Deep Blue category tag (e.g., "Admission" or "Achievement").

## 4. Secondary Page Specifications
### A. "Our Story" (Institutional Profile)
*A single-page narrative scroll that tells the full history of the foundation.*
- **The Genesis:** Starts with a dedicated section for the "Founding Stone" history.
- **Vision & Mission:** A two-column layout explaining the spiritual and academic philosophy.
- **Heritage Album:** A grid-based gallery specifically for "Old Photos" and historical archival images of the campus.

### B. "Updates" (The News Hub)
*A dynamic archive for all institutional activities.*
- **Filter Bar:** A top navigation bar allowing users to filter by: All, News, Events, Achievements, Education, Admission.
- **The Grid:** A 3-column layout of cards using the Deep Blue and White theme.

## 5. Admin Panel & Technical Requirements
### Admin Control Center
*A secure backend portal for staff to manage content dynamically:*
- **News:** Add/Edit news items with category tagging.
- **Events:** Update the Home Page timeline dates and details.
- **Stats:** Modify the numerical counts in the Impact Dashboard.
- **Media:** Upload new posters to the slider and photos to the "Heritage Album."
- **Article Links:** Manage the URLs for the 7 Home Page article cards.

### Technical Standards
- **Mobile Optimization:** Fully responsive with a focus on fast touch-gestures.
- **Performance:** Implement WebP image compression and lazy-loading to ensure a `< 2s` load time.
- **Security:** SSL encryption and secure login for the Admin Panel.

## Final Instruction to Developer
"Construct the portal using Deep Scholarly Blue (`#1D4A7F`) as the anchor color. Maintain a 'Box-Free' transparent header at the top of the Home Page. Ensure the 9 Home Page sections follow the specified vertical order exactly. Apply a subtle Arabic Calligraphy watermark background to Sections 2 and 4. All Student Article cards must redirect to the external magazine URL."
