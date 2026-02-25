# AA Header Integration Guide

## 🎯 Objective
Integrate the new `aa-header.liquid` section into the Shopify theme to replace the legacy Dawn header.

---

## 📋 Current Status

### ✅ Completed
- New `sections/aa-header.liquid` created with Bulma navbar
- Alpine.js state management implemented
- Comprehensive tests created and passed
- Documentation completed

### ⚠️ Pending
- Integration into template JSON files
- Testing on live Shopify store
- Migration of custom CSS from old header
- Verification of merchant customizations

---

## 🔧 Integration Steps

### Step 1: Update Header Group JSON

**File**: `sections/header-group.json`

**Current Configuration:**
```json
{
  "sections": {
    "header": {
      "type": "header",
      "custom_css": [
        ".header-wrapper {background-image: linear-gradient(...)}"
      ],
      "settings": {
        "logo_position": "middle-left",
        "menu": "theme-trade-main-menu-copy",
        "menu_type_desktop": "mega",
        "sticky_header_type": "reduce-logo-size",
        ...
      }
    }
  }
}
```

**New Configuration:**
```json
{
  "sections": {
    "aa-header": {
      "type": "aa-header",
      "settings": {
        "logo_width": 150,
        "logo_position": "left",
        "menu": "theme-trade-main-menu-copy",
        "enable_search": true,
        "sticky_header_type": "on-scroll-up",
        "show_line_separator": true,
        "color_scheme": "scheme-4"
      }
    }
  },
  "order": [
    "aa-header"
  ]
}
```

### Step 2: Migrate Custom CSS

The current header has custom gradient background CSS:
```css
.header-wrapper {
  background-image: linear-gradient(
    115deg,
    rgba(35, 31, 32, 1) 0%,
    rgba(83, 50, 120, 1) 50%,
    rgba(244, 67, 108, 1) 100%
  ) !important;
}
```

**Options:**

**Option A: Add to aa-header.liquid inline styles**
```liquid
<style>
  .aa-header {
    background-image: linear-gradient(
      115deg,
      rgba(35, 31, 32, 1) 0%,
      rgba(83, 50, 120, 1) 50%,
      rgba(244, 67, 108, 1) 100%
    );
  }
</style>
```

**Option B: Add as custom CSS in theme customizer**
- Go to Theme Editor
- Select AA Header section
- Add custom CSS in section settings

**Option C: Create custom Bulma theme file**
- Add to `src/bulma/sass/custom/_header.scss`
- Rebuild CSS

### Step 3: Settings Migration Mapping

| Old Setting | New Setting | Notes |
|------------|-------------|-------|
| `logo_position: "middle-left"` | `logo_position: "left"` | Simplified options |
| `mobile_logo_position: "center"` | N/A | Always centered on mobile |
| `menu: "theme-trade-main-menu-copy"` | `menu: "theme-trade-main-menu-copy"` | Same |
| `menu_type_desktop: "mega"` | N/A | Dropdown only (mega menu not implemented yet) |
| `sticky_header_type: "reduce-logo-size"` | `sticky_header_type: "on-scroll-up"` | Closest match |
| `show_line_separator: false` | `show_line_separator: true` | Inverted default |
| `color_scheme: "scheme-4"` | `color_scheme: "scheme-4"` | Same |
| `enable_country_selector: true` | N/A | Not implemented yet |
| `enable_language_selector: false` | N/A | Not implemented yet |
| `enable_customer_avatar: false` | N/A | Always shows account icon |
| `margin_bottom: 0` | N/A | Controlled by CSS |
| `padding_top: 20` | N/A | Controlled by CSS |
| `padding_bottom: 12` | N/A | Controlled by CSS |

### Step 4: Test in Theme Editor

1. **Backup Current Configuration:**
   ```bash
   cp sections/header-group.json sections/header-group.json.backup
   ```

2. **Update header-group.json** (see Step 1)

3. **Test in Shopify Theme Editor:**
   - Navigate to: `https://[your-store].myshopify.com/admin/themes/[theme-id]/editor`
   - Verify the new header appears
   - Check all navigation links work
   - Test mobile menu toggle
   - Verify cart count displays

4. **If Issues Occur:**
   - Restore backup: `cp sections/header-group.json.backup sections/header-group.json`
   - Review error messages
   - Check browser console

### Step 5: Update All Template JSON Files

The following template files reference the header group:
- All files in `templates/` directory (34 files)

**No changes needed** - Template JSON files reference the header-group.json, which we're updating.

---

## 🚨 Known Limitations

### Features Not Yet Implemented

1. **Mega Menu**
   - Current: Dropdown menus only
   - Old header: Had mega menu support
   - Workaround: Use dropdown menus for now
   - Future: Can be added in enhancement

2. **Country/Language Selectors**
   - Current: Not implemented
   - Old header: Had localization forms
   - Workaround: Add as separate section if needed
   - Future: Can be added in enhancement

3. **Logo Size Reduction on Scroll**
   - Current: Sticky header without size change
   - Old header: Had `reduce-logo-size` option
   - Workaround: Use `on-scroll-up` or `always` sticky
   - Future: Can be added with CSS transition

4. **Custom Spacing Settings**
   - Current: Fixed spacing via CSS
   - Old header: Had padding/margin settings
   - Workaround: Modify CSS in `aa-header.liquid`
   - Future: Can add schema settings

---

## 🎨 Custom CSS Migration

### Current Custom CSS
```css
.header-wrapper {
  background-image: linear-gradient(
    115deg,
    rgba(35, 31, 32, 1) 0%,
    rgba(83, 50, 120, 1) 50%,
    rgba(244, 67, 108, 1) 100%
  ) !important;
}
```

### Recommended Approach

**Add to `sections/aa-header.liquid` in the `<style>` block:**

```liquid
<style>
  .aa-header {
    {% if show_line_separator %}
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    {% endif %}

    /* Custom gradient background */
    background-image: linear-gradient(
      115deg,
      rgba(35, 31, 32, 1) 0%,
      rgba(83, 50, 120, 1) 50%,
      rgba(244, 67, 108, 1) 100%
    );
  }

  /* Ensure text is visible on gradient */
  .aa-header .b-navbar-item,
  .aa-header .b-navbar-link {
    color: white;
  }

  .aa-header .b-navbar-item:hover,
  .aa-header .b-navbar-link:hover {
    color: rgba(255, 255, 255, 0.8);
  }

  .aa-header__logo {
    max-width: {{ section.settings.logo_width }}px;
    height: auto;
  }

  {% if sticky_header_type == 'always' or sticky_header_type == 'on-scroll-up' %}
    .aa-header--sticky {
      position: sticky;
      top: 0;
      z-index: 30;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  {% endif %}

  .aa-header__cart-count {
    position: absolute;
    top: -8px;
    right: -8px;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: 10px;
    background: var(--bulma-primary, #7957d5);
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .aa-header__icon-wrapper {
    position: relative;
    display: inline-block;
  }
</style>
```

---

## 🧪 Testing Checklist

### Before Integration
- [x] New header section created
- [x] Alpine.js integration tested
- [x] Bulma classes verified
- [x] Test file created and passed
- [x] Documentation completed

### During Integration
- [ ] Backup current header-group.json
- [ ] Update header-group.json with new section
- [ ] Add custom gradient CSS
- [ ] Test in theme editor
- [ ] Verify navigation links
- [ ] Test mobile menu
- [ ] Check cart count display
- [ ] Verify Alpine.js cart store

### After Integration
- [ ] Test on multiple browsers
- [ ] Verify responsive design (375px, 768px, 1024px)
- [ ] Check keyboard navigation
- [ ] Test with screen reader
- [ ] Verify SEO structured data
- [ ] Run Lighthouse audit
- [ ] Check page load performance
- [ ] Verify merchant customizations work

---

## 🚀 Quick Integration Command

**Option 1: Manual Update**
1. Edit `sections/header-group.json`
2. Replace `"type": "header"` with `"type": "aa-header"`
3. Update settings as per mapping table
4. Save and test

**Option 2: Automated Script** (if needed)
```bash
# Create backup
cp sections/header-group.json sections/header-group.json.backup

# Update (manual edit recommended)
# Then push to Shopify
shopify theme push
```

---

## 📊 Rollback Plan

If issues occur after integration:

1. **Immediate Rollback:**
   ```bash
   cp sections/header-group.json.backup sections/header-group.json
   shopify theme push
   ```

2. **Verify Rollback:**
   - Check http://127.0.0.1:9292/
   - Verify old header is back
   - Test all functionality

3. **Debug Issues:**
   - Check browser console for errors
   - Review Shopify theme editor errors
   - Verify Alpine.js is loaded
   - Check cart store initialization

---

## 📝 Next Steps After Integration

1. **Task 7: Migrate header to use Alpine.js exclusively**
   - Remove legacy CSS references
   - Add smooth animations
   - Optimize performance

2. **Task 8: Create new footer section with Bulma grid**
   - Similar process to header
   - Use Bulma columns layout

3. **Enhancement: Add Mega Menu Support**
   - Extend dropdown functionality
   - Add multi-column layout
   - Implement in aa-header.liquid

4. **Enhancement: Add Localization**
   - Country selector
   - Language selector
   - Currency selector

---

## 🆘 Troubleshooting

### Issue: Header doesn't appear
**Solution:** Check that `sections/aa-header.liquid` exists and header-group.json references it correctly.

### Issue: Navigation links don't work
**Solution:** Verify menu setting points to correct menu handle in Shopify admin.

### Issue: Cart count doesn't update
**Solution:** Check that Alpine.js cart store is initialized. Run `Alpine.store('cart')` in console.

### Issue: Mobile menu doesn't toggle
**Solution:** Verify Alpine.js is loaded and `x-data` is on header element.

### Issue: Gradient background missing
**Solution:** Add custom CSS to aa-header.liquid style block.

### Issue: Logo too large/small
**Solution:** Adjust `logo_width` setting in header-group.json.

---

## 📞 Support

For issues or questions:
1. Check `.codex/specs/shopify-bulma-alpine-migration/TASK-6-COMPLETE.md`
2. Review test file: `test-task-6-header.html`
3. Check browser console for errors
4. Verify Alpine.js and Bulma are loaded

---

**Last Updated:** December 25, 2025
**Status:** Ready for Integration
**Next Task:** Task 7 - Migrate header to use Alpine.js exclusively
