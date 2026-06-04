# Settings Usage Report

**Project:** Care24  
**Report Date:** June 3, 2026  
**Report Type:** SystemSetting Field Usage Audit  
**Status:** ✅ COMPLETED

---

## Executive Summary

This report audits all remaining SystemSetting fields to verify their usage across the application. The audit identifies which fields are actively rendered in the UI and which fields are stored but never displayed.

**Overall Findings:**
- **Total Fields Audited:** 10
- **Actively Used Fields:** 7
- **Unused Fields:** 3
- **Recommendation:** Remove 3 unused optional fields

---

## Field-by-Field Analysis

### 1. Support Phone

| Attribute | Value |
|-----------|-------|
| **Database Field Name** | `supportPhone` |
| **Field Type** | String (Required) |
| **Frontend Components** | AdminDashboard.tsx, Footer.tsx, Navbar.tsx |
| **UI Locations** | 
| - AdminDashboard.tsx | Settings form input (line 1248, 1376) |
| - Footer.tsx | Footer contact section (line 135-142) |
| - Navbar.tsx | Navbar support line (line 76-80, 124) |
| **Actively Used** | ✅ YES |
| **Can Be Safely Removed** | ❌ NO |
| **Usage Notes** | Displayed in 3 locations: admin settings form, footer, and navbar. Critical for user support. |

---

### 2. Support Email

| Attribute | Value |
|-----------|-------|
| **Database Field Name** | `supportEmail` |
| **Field Type** | String (Required) |
| **Frontend Components** | AdminDashboard.tsx, Footer.tsx, Navbar.tsx, UserDashboard.tsx |
| **UI Locations** |
| - AdminDashboard.tsx | Settings form input (line 1258, 1386) |
| - Footer.tsx | Footer contact section (line 144-152) |
| - Navbar.tsx | Navbar support section (line 68-72) |
| - UserDashboard.tsx | Long-term care plan message (line 1795) |
| **Actively Used** | ✅ YES |
| **Can Be Safely Removed** | ❌ NO |
| **Usage Notes** | Displayed in 4 locations: admin settings form, footer, navbar, and user dashboard. Critical for user support and long-term care inquiries. |

---

### 3. Office Address

| Attribute | Value |
|-----------|-------|
| **Database Field Name** | `officeAddress` |
| **Field Type** | String (Required) |
| **Frontend Components** | AdminDashboard.tsx, Footer.tsx |
| **UI Locations** |
| - AdminDashboard.tsx | Settings form input (line 1268, 1396) |
| - Footer.tsx | Footer contact section (line 126-133) |
| **Actively Used** | ✅ YES |
| **Can Be Safely Removed** | ❌ NO |
| **Usage Notes** | Displayed in 2 locations: admin settings form and footer. Important for physical location information. |

---

### 4. WhatsApp Number

| Attribute | Value |
|-----------|-------|
| **Database Field Name** | `whatsappNumber` |
| **Field Type** | String (Optional) |
| **Frontend Components** | AdminDashboard.tsx, careStore.ts |
| **UI Locations** |
| - AdminDashboard.tsx | Settings form input (line 1277) |
| - careStore.ts | Type definition only (line 133) |
| **Actively Used** | ❌ NO |
| **Can Be Safely Removed** | ✅ YES |
| **Usage Notes** | **FLAGGED AS UNUSED** - Stored in database and editable in admin settings form, but never rendered anywhere in the public-facing application. No WhatsApp integration or display found in any component. |

---

### 5. Support Hours

| Attribute | Value |
|-----------|-------|
| **Database Field Name** | `supportHours` |
| **Field Type** | String (Optional) |
| **Frontend Components** | AdminDashboard.tsx, careStore.ts |
| **UI Locations** |
| - AdminDashboard.tsx | Settings form input (line 1286) |
| - careStore.ts | Type definition only (line 134) |
| **Actively Used** | ❌ NO |
| **Can Be Safely Removed** | ✅ YES |
| **Usage Notes** | **FLAGGED AS UNUSED** - Stored in database and editable in admin settings form, but never rendered anywhere in the public-facing application. No business hours display found in any component. |

---

### 6. Emergency Contact

| Attribute | Value |
|-----------|-------|
| **Database Field Name** | `emergencyContact` |
| **Field Type** | String (Optional) |
| **Frontend Components** | AdminDashboard.tsx, careStore.ts |
| **UI Locations** |
| - AdminDashboard.tsx | Settings form input (line 1295) |
| - careStore.ts | Type definition only (line 136) |
| **Actively Used** | ❌ NO |
| **Can Be Safely Removed** | ✅ YES |
| **Usage Notes** | **FLAGGED AS UNUSED** - Stored in database and editable in admin settings form, but never rendered anywhere in the public-facing application. Note: This is different from patient emergency contact (which is used in patient profiles). This field is for platform-wide emergency contact. |

---

### 7. Facebook URL

| Attribute | Value |
|-----------|-------|
| **Database Field Name** | `facebookUrl` |
| **Field Type** | String (Optional) |
| **Frontend Components** | AdminDashboard.tsx, Footer.tsx |
| **UI Locations** |
| - AdminDashboard.tsx | Settings form input (line 1310) |
| - Footer.tsx | Footer social links section (line 63-67) |
| **Actively Used** | ✅ YES |
| **Can Be Safely Removed** | ❌ NO |
| **Usage Notes** | Displayed in 2 locations: admin settings form and footer social links. Renders as a clickable icon in footer. |

---

### 8. Instagram URL

| Attribute | Value |
|-----------|-------|
| **Database Field Name** | `instagramUrl` |
| **Field Type** | String (Optional) |
| **Frontend Components** | AdminDashboard.tsx, Footer.tsx |
| **UI Locations** |
| - AdminDashboard.tsx | Settings form input (line 1319) |
| - Footer.tsx | Footer social links section (line 68-72) |
| **Actively Used** | ✅ YES |
| **Can Be Safely Removed** | ❌ NO |
| **Usage Notes** | Displayed in 2 locations: admin settings form and footer social links. Renders as a clickable icon in footer. |

---

### 9. LinkedIn URL

| Attribute | Value |
|-----------|-------|
| **Database Field Name** | `linkedinUrl` |
| **Field Type** | String (Optional) |
| **Frontend Components** | AdminDashboard.tsx, Footer.tsx |
| **UI Locations** |
| - AdminDashboard.tsx | Settings form input (line 1328) |
| - Footer.tsx | Footer social links section (line 73-77) |
| **Actively Used** | ✅ YES |
| **Can Be Safely Removed** | ❌ NO |
| **Usage Notes** | Displayed in 2 locations: admin settings form and footer social links. Renders as a clickable icon in footer. |

---

### 10. Twitter/X URL

| Attribute | Value |
|-----------|-------|
| **Database Field Name** | `twitterUrl` |
| **Field Type** | String (Optional) |
| **Frontend Components** | AdminDashboard.tsx, Footer.tsx |
| **UI Locations** |
| - AdminDashboard.tsx | Settings form input (line 1337) |
| - Footer.tsx | Footer social links section (line 78-82) |
| **Actively Used** | ✅ YES |
| **Can Be Safely Removed** | ❌ NO |
| **Usage Notes** | Displayed in 2 locations: admin settings form and footer social links. Renders as a clickable icon in footer. |

---

## Summary Table

| Field | Database Name | UI Components | Display Count | Actively Used | Can Remove |
|-------|---------------|--------------|---------------|---------------|------------|
| Support Phone | `supportPhone` | AdminDashboard, Footer, Navbar | 3 | ✅ YES | ❌ NO |
| Support Email | `supportEmail` | AdminDashboard, Footer, Navbar, UserDashboard | 4 | ✅ YES | ❌ NO |
| Office Address | `officeAddress` | AdminDashboard, Footer | 2 | ✅ YES | ❌ NO |
| WhatsApp Number | `whatsappNumber` | AdminDashboard only (form) | 0 | ❌ NO | ✅ YES |
| Support Hours | `supportHours` | AdminDashboard only (form) | 0 | ❌ NO | ✅ YES |
| Emergency Contact | `emergencyContact` | AdminDashboard only (form) | 0 | ❌ NO | ✅ YES |
| Facebook URL | `facebookUrl` | AdminDashboard, Footer | 2 | ✅ YES | ❌ NO |
| Instagram URL | `instagramUrl` | AdminDashboard, Footer | 2 | ✅ YES | ❌ NO |
| LinkedIn URL | `linkedinUrl` | AdminDashboard, Footer | 2 | ✅ YES | ❌ NO |
| Twitter/X URL | `twitterUrl` | AdminDashboard, Footer | 2 | ✅ YES | ❌ NO |

---

## Unused Fields (Flagged for Removal)

### 1. WhatsApp Number (`whatsappNumber`)
- **Status:** Stored but never rendered
- **Current Behavior:** Editable in admin settings form, but not displayed anywhere
- **Recommendation:** Remove unless WhatsApp integration is planned
- **Impact:** Low - no current functionality depends on this field

### 2. Support Hours (`supportHours`)
- **Status:** Stored but never rendered
- **Current Behavior:** Editable in admin settings form, but not displayed anywhere
- **Recommendation:** Remove unless business hours display is planned
- **Impact:** Low - no current functionality depends on this field

### 3. Emergency Contact (`emergencyContact`)
- **Status:** Stored but never rendered
- **Current Behavior:** Editable in admin settings form, but not displayed anywhere
- **Recommendation:** Remove unless platform-wide emergency contact display is planned
- **Impact:** Low - no current functionality depends on this field
- **Note:** This is distinct from patient emergency contact (which is actively used in patient profiles)

---

## Recommendations

### Immediate Actions

1. **Remove Unused Optional Fields**
   - Remove `whatsappNumber` from SystemSetting model
   - Remove `supportHours` from SystemSetting model
   - Remove `emergencyContact` from SystemSetting model
   - Remove corresponding inputs from AdminDashboard settings form
   - Remove from careStore.ts type definition

2. **Keep Actively Used Fields**
   - Retain `supportPhone` - used in 3 locations
   - Retain `supportEmail` - used in 4 locations
   - Retain `officeAddress` - used in 2 locations
   - Retain all social links - each used in 2 locations

### Future Considerations

1. **WhatsApp Integration**
   - If WhatsApp integration is planned, re-add `whatsappNumber` field
   - Add WhatsApp chat button to Footer or Navbar
   - Implement WhatsApp API integration

2. **Business Hours Display**
   - If business hours display is planned, re-add `supportHours` field
   - Display in Footer or Contact section
   - Consider timezone handling

3. **Emergency Contact Display**
   - If platform-wide emergency contact is needed, re-add `emergencyContact` field
   - Display prominently in Footer or Navbar
   - Consider adding emergency hotline button

---

## Risk Assessment

### Removing Unused Fields

| Field | Risk Level | Justification |
|-------|------------|---------------|
| `whatsappNumber` | LOW | Never rendered, no dependencies |
| `supportHours` | LOW | Never rendered, no dependencies |
| `emergencyContact` | LOW | Never rendered, no dependencies |

### Keeping Used Fields

| Field | Risk Level | Justification |
|-------|------------|---------------|
| `supportPhone` | NONE | Used in 3 locations, critical for support |
| `supportEmail` | NONE | Used in 4 locations, critical for support |
| `officeAddress` | NONE | Used in 2 locations, important for location info |
| Social Links | NONE | Each used in 2 locations, important for social presence |

---

## Testing Checklist

### Before Removing Unused Fields
- [ ] Verify no external references to `whatsappNumber`
- [ ] Verify no external references to `supportHours`
- [ ] Verify no external references to `emergencyContact`
- [ ] Confirm no planned features depend on these fields

### After Removing Unused Fields
- [ ] Test admin settings form loads without errors
- [ ] Test settings save without errors
- [ ] Verify all actively used fields still work
- [ ] Verify Footer displays correctly
- [ ] Verify Navbar displays correctly

---

## Conclusion

### Audit Summary
- **Total Fields Audited:** 10
- **Actively Used Fields:** 7 (70%)
- **Unused Fields:** 3 (30%)
- **Fields Recommended for Removal:** 3

### Final Recommendation

**Remove the following unused optional fields:**
1. `whatsappNumber` - Stored but never rendered
2. `supportHours` - Stored but never rendered
3. `emergencyContact` - Stored but never rendered

**Keep the following actively used fields:**
1. `supportPhone` - Used in 3 locations
2. `supportEmail` - Used in 4 locations
3. `officeAddress` - Used in 2 locations
4. `facebookUrl` - Used in 2 locations
5. `instagramUrl` - Used in 2 locations
6. `linkedinUrl` - Used in 2 locations
7. `twitterUrl` - Used in 2 locations

**Status:** ✅ **AUDIT COMPLETE - 3 unused fields identified for removal**

---

**Report End**

*This report documents the usage audit of all remaining SystemSetting fields in the Care24 application as of June 3, 2026.*
