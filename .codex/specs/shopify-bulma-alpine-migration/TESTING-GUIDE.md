# Task 2 Browser Testing Guide

## 🎯 Testing Objectives

This guide will help you test the Task 2 implementation in the browser to verify:
1. Development mode - Full CSS loads correctly
2. Production mode - Purged CSS loads correctly
3. Theme editor - Design mode works with full CSS
4. Font loading - No font flash (FOUT/FOIT)
5. Alpine.js - No FOUC on components
6. Cart functionality - Add/update/remove works

---

## 🚀 Quick Start: Local HTML Test

### Step 1: Open the Standalone Test Page

```bash
cd /home/alejandro/shopify/custom_trade_shopify_theme
# Open in browser
xdg-open test-task-2.html
# OR
firefox test-task-2.html
# OR
google-chrome test-task-2.html
```

This test page will verify:
- ✅ CSS loading (Bulma loaded, base.css not loaded)
- ✅ x-cloak FOUC prevention
- ✅ Font loading
- ✅ Alpine.js reactivity
- ✅ Cart functionality simulation
- ✅ CSS variables
- ✅ Bulma framework classes

**Expected Results:**
- All tests should show green ✅ checkmarks
- No flash of unstyled content when Alpine.js loads
- Cart add/update/remove should work smoothly

---

## 🏪 Shopify Store Testing

### Prerequisites

1. **Authenticate with Shopify CLI:**
   ```bash
   shopify auth login
   ```

2. **Start Development Server:**
   ```bash
   cd /home/alejandro/shopify/custom_trade_shopify_theme
   shopify theme dev
   ```

   This will:
   - Upload theme as a development theme
   - Start local server at `http://127.0.0.1:9292`
   - Provide theme editor and preview links

---

## Test 1: Development Mode - Full CSS Loads Correctly

### What to Test
Verify that in development mode, the full Bulma CSS is loaded (not purged).

### Steps

1. **Start the development server:**
   ```bash
   shopify theme dev
   ```

2. **Open the local preview:**
   - Navigate to `http://127.0.0.1:9292`

3. **Open Browser DevTools:**
   - Press `F12` or `Ctrl+Shift+I` (Linux/Windows) / `Cmd+Option+I` (Mac)
   - Go to **Network** tab
   - Reload the page (`Ctrl+R` or `Cmd+R`)

4. **Check CSS Loading:**
   - Look for `a-bulma-full.css` in the network requests
   - Verify it loads successfully (Status: 200)
   - Check the console for: `"####### Using Full Bulma CSS #######"`

5. **Verify CSS File:**
   - In **Elements** tab, find `<link>` tags in `<head>`
   - Should see: `<link rel="stylesheet" href="...a-bulma-full.css">`
   - Should NOT see: `a-bulma-purged.css`

### ✅ Expected Results
- ✅ Console shows "Using Full Bulma CSS"
- ✅ `a-bulma-full.css` loads (large file, ~700KB)
- ✅ All Bulma classes work (even unused ones)
- ✅ Theme editor has access to all CSS classes

### ❌ Failure Indicators
- ❌ `a-bulma-purged.css` loads instead
- ❌ Missing Bulma classes cause broken styles
- ❌ Console errors about missing CSS

---

## Test 2: Production Mode - Purged CSS Loads Correctly

### What to Test
Verify that in production mode, the purged Bulma CSS is loaded (optimized).

### Steps

1. **Push theme to unpublished theme slot:**
   ```bash
   shopify theme push --unpublished
   ```

2. **Get the preview link from the output**

3. **Open the preview link in browser**

4. **Open Browser DevTools:**
   - Press `F12`
   - Go to **Network** tab
   - Reload the page

5. **Check CSS Loading:**
   - Look for `a-bulma-purged.css` in the network requests
   - Verify it loads successfully (Status: 200)
   - Should NOT see console message about "Using Full Bulma CSS"

6. **Verify File Size:**
   - Click on `a-bulma-purged.css` in Network tab
   - Check **Size** column
   - Should be significantly smaller (~200-300KB vs ~700KB)

### ✅ Expected Results
- ✅ `a-bulma-purged.css` loads (smaller file)
- ✅ No console message about full CSS
- ✅ All used Bulma classes still work
- ✅ Page loads faster due to smaller CSS

### ❌ Failure Indicators
- ❌ `a-bulma-full.css` loads in production
- ❌ Missing styles due to over-aggressive purging
- ❌ Broken layouts or components

---

## Test 3: Theme Editor - Design Mode Works with Full CSS

### What to Test
Verify that the theme editor loads full CSS for all customization options.

### Steps

1. **Start development server:**
   ```bash
   shopify theme dev
   ```

2. **Open the theme editor link** (provided in terminal output)
   - Usually: `https://[your-store].myshopify.com/admin/themes/[theme-id]/editor`

3. **Open Browser DevTools:**
   - Press `F12`
   - Go to **Console** tab

4. **Check for full CSS message:**
   - Should see: `"####### Using Full Bulma CSS #######"`

5. **Test theme customization:**
   - Try adding/removing sections
   - Change colors, fonts, spacing
   - Verify all options work

6. **Check Network tab:**
   - Verify `a-bulma-full.css` is loaded
   - NOT `a-bulma-purged.css`

### ✅ Expected Results
- ✅ Console shows "Using Full Bulma CSS"
- ✅ `a-bulma-full.css` loads in theme editor
- ✅ All theme customization options work
- ✅ Can add/remove sections without CSS issues
- ✅ Preview updates correctly

### ❌ Failure Indicators
- ❌ Purged CSS loads in theme editor
- ❌ Missing styles when adding new sections
- ❌ Customization options don't apply correctly

---

## Test 4: Font Loading - No Font Flash (FOUT/FOIT)

### What to Test
Verify that custom fonts load without flash of unstyled text (FOUT) or invisible text (FOIT).

### Steps

1. **Open the theme in browser**

2. **Throttle network to simulate slow connection:**
   - Open DevTools (`F12`)
   - Go to **Network** tab
   - Click **No throttling** dropdown
   - Select **Slow 3G** or **Fast 3G**

3. **Reload page and watch text:**
   - Press `Ctrl+Shift+R` (hard reload)
   - Watch the text as it loads
   - Look for font changes or invisible text

4. **Check font preloading:**
   - In **Network** tab, filter by **Font**
   - Look for font files with `Priority: High`
   - Should see `<link rel="preload" as="font">`

5. **Verify font-display:**
   - In **Elements** tab, find `<style>` tag in `<head>`
   - Look for `@font-face` rules
   - Should contain `font-display: swap`

### ✅ Expected Results
- ✅ Text visible immediately (using fallback font)
- ✅ Smooth transition to custom font
- ✅ No invisible text period (FOIT)
- ✅ No jarring font change (minimal FOUT)
- ✅ Fonts preloaded with high priority

### ❌ Failure Indicators
- ❌ Text invisible while fonts load (FOIT)
- ❌ Jarring font change after page loads (FOUT)
- ❌ Fonts not preloaded
- ❌ Missing `font-display: swap`

---

## Test 5: Alpine.js - No FOUC on Components

### What to Test
Verify that Alpine.js components don't flash unstyled content before initialization.

### Steps

1. **Open the theme in browser**

2. **Throttle network (optional):**
   - DevTools > Network > Slow 3G
   - This makes FOUC more visible if present

3. **Hard reload the page:**
   - `Ctrl+Shift+R` or `Cmd+Shift+R`
   - Watch for any flashing content

4. **Check for x-cloak rule:**
   - DevTools > Elements tab
   - Find `<style>` tag in `<head>`
   - Should contain:
     ```css
     [x-cloak] {
       display: none !important;
     }
     ```

5. **Inspect Alpine.js elements:**
   - Look for elements with `x-data`, `x-show`, `x-if`
   - Check if they have `x-cloak` attribute
   - Verify they're hidden until Alpine loads

6. **Check console:**
   - Should NOT see Alpine.js errors
   - Should see Alpine.js initialization

### ✅ Expected Results
- ✅ No flash of unstyled content on page load
- ✅ `[x-cloak]` rule exists in `<style>` tag
- ✅ Alpine.js components hidden until initialized
- ✅ Smooth appearance of interactive elements
- ✅ No console errors

### ❌ Failure Indicators
- ❌ Flash of raw `{{ }}` syntax or unstyled HTML
- ❌ Missing `[x-cloak]` rule
- ❌ Alpine.js components visible before initialization
- ❌ Console errors about Alpine.js

---

## Test 6: Cart Functionality - Add/Update/Remove Works

### What to Test
Verify that cart operations work correctly with Alpine.js store.

### Steps

1. **Open a product page**

2. **Test Add to Cart:**
   - Click "Add to Cart" button
   - Watch for cart count update
   - Check for cart drawer/notification

3. **Open cart (drawer or page):**
   - Click cart icon or navigate to `/cart`

4. **Test Update Quantity:**
   - Change quantity using +/- buttons or input
   - Verify cart total updates
   - Check network tab for `/cart/change.js` request

5. **Test Remove Item:**
   - Click remove/delete button
   - Verify item disappears
   - Check cart count decreases

6. **Check Alpine.js cart store:**
   - Open DevTools > Console
   - Type: `Alpine.store('cart')`
   - Verify it returns cart object with items, item_count, total_price

7. **Verify cart scripts loaded:**
   - DevTools > Network tab
   - Look for:
     - `cart-api.js`
     - `cart-store.js`
     - `cart-fragment.js`
   - All should load with `defer` attribute

### ✅ Expected Results
- ✅ Add to cart works without page reload
- ✅ Cart count updates reactively
- ✅ Quantity changes update total immediately
- ✅ Remove item works instantly
- ✅ Cart drawer opens/closes smoothly
- ✅ All cart scripts load correctly
- ✅ `Alpine.store('cart')` accessible in console

### ❌ Failure Indicators
- ❌ Page reloads on cart operations
- ❌ Cart count doesn't update
- ❌ Quantity changes don't reflect
- ❌ Cart scripts missing or error
- ❌ Console errors about cart store

---

## 🔍 Additional Checks

### Check 1: No Dawn CSS Variables in Inline Styles

**Steps:**
1. Open DevTools > Elements
2. Find `<style>` tag in `<head>`
3. Search for Dawn-specific variables:
   - `--color-background:`
   - `--product-card-`
   - `--buttons-radius:` (should NOT be in inline styles)

**Expected:**
- ✅ Only font faces and `[x-cloak]` rule in inline `<style>`
- ✅ No Dawn CSS variables
- ✅ No box-sizing reset or body grid layout

### Check 2: No base.css Reference

**Steps:**
1. DevTools > Elements
2. Search `<head>` for stylesheet links
3. Look for `base.css`

**Expected:**
- ✅ No `<link>` tag for `base.css`
- ✅ Comment explaining removal: "Dawn base.css removed"

### Check 3: File Size Comparison

**Steps:**
1. DevTools > Network tab
2. Check sizes:
   - `a-bulma-full.css` (dev mode)
   - `a-bulma-purged.css` (production)

**Expected:**
- ✅ Full CSS: ~700KB
- ✅ Purged CSS: ~200-300KB
- ✅ ~70% size reduction

---

## 📊 Test Results Checklist

Use this checklist to track your testing:

### Development Mode
- [ ] Full CSS loads (`a-bulma-full.css`)
- [ ] Console shows "Using Full Bulma CSS"
- [ ] All Bulma classes available
- [ ] Theme editor works correctly

### Production Mode
- [ ] Purged CSS loads (`a-bulma-purged.css`)
- [ ] Smaller file size (~70% reduction)
- [ ] All used styles still work
- [ ] No broken layouts

### Theme Editor
- [ ] Full CSS loads in design mode
- [ ] All customization options work
- [ ] Can add/remove sections
- [ ] Preview updates correctly

### Font Loading
- [ ] No FOUT (flash of unstyled text)
- [ ] No FOIT (flash of invisible text)
- [ ] Fonts preloaded
- [ ] `font-display: swap` present

### Alpine.js
- [ ] No FOUC on page load
- [ ] `[x-cloak]` rule exists
- [ ] Components initialize smoothly
- [ ] No console errors

### Cart Functionality
- [ ] Add to cart works
- [ ] Cart count updates
- [ ] Quantity changes work
- [ ] Remove item works
- [ ] Cart drawer functions
- [ ] All cart scripts load

### Additional Checks
- [ ] No Dawn CSS variables in inline styles
- [ ] No `base.css` reference
- [ ] Proper file size reduction
- [ ] No console errors
- [ ] No broken styles

---

## 🐛 Troubleshooting

### Issue: Full CSS loads in production

**Cause:** `settings.force_full_css` might be enabled

**Fix:**
1. Check `config/settings_schema.json`
2. Ensure `force_full_css` is `false` or not set
3. Clear browser cache and reload

### Issue: Styles missing in production

**Cause:** PurgeCSS removed needed classes

**Fix:**
1. Check `src/purge/b-safelist.json`
2. Add missing classes to safelist
3. Rebuild: `npm run build`
4. Re-push theme

### Issue: FOUC visible on Alpine components

**Cause:** `[x-cloak]` rule not loading

**Fix:**
1. Verify `[x-cloak]` rule in `layout/theme.liquid`
2. Check it's in `<style>` tag before Alpine.js loads
3. Ensure Alpine.js loads with `defer`

### Issue: Fonts flashing

**Cause:** Font preloading not working

**Fix:**
1. Verify `<link rel="preload" as="font">` tags
2. Check `font-display: swap` in font faces
3. Ensure fonts load from correct CDN

### Issue: Cart not working

**Cause:** Cart scripts not loading or Alpine store not initialized

**Fix:**
1. Check all cart scripts load: `cart-api.js`, `cart-store.js`, `cart-fragment.js`
2. Verify Alpine.js loads before cart scripts
3. Check console for errors
4. Verify `Alpine.store('cart')` exists

---

## 📝 Reporting Results

After testing, document your findings:

### Test Summary Template

```markdown
## Task 2 Browser Testing Results

**Date:** [Date]
**Tester:** [Your Name]
**Browser:** [Chrome/Firefox/Safari] [Version]
**Store:** [Store URL]

### Test Results

1. **Development Mode:** ✅ PASS / ❌ FAIL
   - Notes: [Any observations]

2. **Production Mode:** ✅ PASS / ❌ FAIL
   - Notes: [Any observations]

3. **Theme Editor:** ✅ PASS / ❌ FAIL
   - Notes: [Any observations]

4. **Font Loading:** ✅ PASS / ❌ FAIL
   - Notes: [Any observations]

5. **Alpine.js FOUC:** ✅ PASS / ❌ FAIL
   - Notes: [Any observations]

6. **Cart Functionality:** ✅ PASS / ❌ FAIL
   - Notes: [Any observations]

### Issues Found
[List any issues or concerns]

### Screenshots
[Attach relevant screenshots]

### Overall Status
✅ Ready for production / ⚠️ Needs fixes / ❌ Major issues
```

---

## 🎉 Success Criteria

Task 2 implementation is considered successful when:

- ✅ All 6 main tests pass
- ✅ No console errors
- ✅ No visual regressions
- ✅ Performance improved (smaller CSS)
- ✅ Theme editor fully functional
- ✅ No FOUC or font flashing
- ✅ Cart operations smooth and reactive

---

**Ready to test?** Start with the local HTML test page, then proceed to Shopify store testing!
