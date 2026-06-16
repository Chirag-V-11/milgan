# Implementation Plan - Improve Contact and Product Details Page CSS

This plan outlines the visual enhancements to make the **Contact Page** and **Product Details Page** user-friendly, high-contrast, and visually premium when rendered on the light gradient background (`.client-body`).

## User Review Required

> [!IMPORTANT]
> The current pages are styled using transparent dark theme variables (`bg-white/[0.03]`, `border-white/10`, and heavy dark shadows) which become practically invisible or poorly readable when displayed on the light cream/yellow gradient background. We will replace these with elegant, high-contrast light-themed panels, readable placeholders, and brand-aligned Navy Blue (`#124B70`) borders and accents.

## Proposed Changes

### 1. Contact Page

#### [MODIFY] [page.tsx](file:///e:/We&You/gee/frontend/src/app/contact/page.tsx)
- **Form Card Background**: Replace `bg-white/[0.03] backdrop-blur-xl border border-white/10` with a solid/semi-translucent white card `bg-white/70 backdrop-blur-xl border border-[#124B70]/10 shadow-[0_20px_50px_rgba(18,75,112,0.08)]` to make the form stand out on the page's light background.
- **Form Inputs**: Change input background and borders from transparent white to an elegant light navy background `bg-[#124B70]/5 border border-[#124B70]/15` with distinct placeholders (`placeholder:text-[#124B70]/40`) and focus styles (`focus:bg-white focus:border-[#124B70]/50`).
- **Submit Button**: Change style to use solid brand Navy Blue (`bg-[#124B70] text-[#FDFDFD] hover:bg-[#124B70]/90`) for maximum visual clarity.
- **Text & Borders**: Adjust secondary descriptions and border separators from `border-white/10` to `border-[#124B70]/15` and update address font colors.

---

### 2. Product Details Page

#### [MODIFY] [page.tsx](file:///e:/We&You/gee/frontend/src/app/product/%5Bid%5D/page.tsx)
- **Image Card**: Adjust shadow from a heavy black shadow to `shadow-[0_20px_50px_rgba(18,75,112,0.08)]` and replace white border with `border-[#124B70]/10`.
- **Dividers**: Replace `bg-white/10` and `border-white/10` separators with `#124B70` at 10% opacity (`bg-[#124B70]/10` and `border-[#124B70]/10`).
- **Ingredient & Infusion Boxes**: Replace `bg-white/[0.03] border-white/10` with readable `bg-white/50 border border-[#124B70]/10 hover:bg-white/80` elements.
- **Size Selector Button**:
  - **Unselected**: Change `border-white/10 bg-white/[0.03]` to `border-[#124B70]/15 bg-white/40 hover:border-[#124B70]/40`.
  - **Selected**: Explicitly set selection background to `#124B70` with white text to avoid color override issues.
- **Soon-to-be-available Platforms (Amazon/Flipkart)**: Update disabled platforms styles from faint white placeholders to clean light gray-blue text elements (`bg-[#124B70]/5 border border-[#124B70]/10 text-[#124B70]/30`).
- **Trust Badges**: Replace transparent/invisible boxes with high-contrast `bg-white/50 border border-[#124B70]/10 hover:bg-white/80` cells.

---

## Verification Plan

### Automated/Compiler Checks
- Verify compilation of both Next.js pages after updates.

### Manual Verification
- Render the Contact Page (`/contact`) in the browser.
- Render a Product Details Page (`/product/1` or similar) in the browser.
- Take snapshots of both desktop and mobile viewports to ensure visual premium quality, readability, and correct alignment.
