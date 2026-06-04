# Database Cleanup Report for Production Deployment

**Project:** Care24  
**Cleanup Date:** June 3, 2026  
**Cleanup Type:** Pre-Deployment Production Data Cleanup  
**Status:** ⏳ PENDING EXECUTION

---

## Executive Summary

This report documents the database cleanup procedure for removing test, QA, regression, and UAT data from the Care24 application database before production deployment. 

**IMPORTANT:** This is an internship project, not a live healthcare company. The cleanup is conservative and only removes data that is clearly identified as test data (emails/names containing: test, demo, qa, uat, example, sample, dev, staging). Legitimate caregiver and user accounts are preserved.

**Status:** ⏳ **PENDING EXECUTION**

The cleanup script has been prepared but not yet executed. Execute the script before proceeding with production deployment.

---

## Cleanup Objectives

### Primary Objectives

1. **Remove test data only** from user-generated collections
2. **Preserve admin accounts** for continued platform administration
3. **Preserve legitimate caregiver accounts** for continued platform operation
4. **Preserve legitimate user accounts** for continued platform operation
5. **Preserve service categories** for platform functionality
6. **Preserve system settings** for platform configuration
7. **Maintain application structure** for seamless deployment

### Secondary Objectives

1. Ensure data integrity after cleanup
2. Verify admin access remains functional
3. Verify legitimate caregiver access remains functional
4. Verify legitimate user access remains functional
5. Confirm platform configuration is intact
6. Document all changes for audit trail

---

## Data Preservation Policy

### PRESERVED (Do Not Delete)

#### 1. Admin Accounts
- **Collection:** `users`
- **Filter:** `role: 'admin'`
- **Reason:** Required for platform administration
- **Preserved Fields:** All fields

#### 2. Legitimate User Accounts
- **Collection:** `users`
- **Filter:** `role: { $ne: 'admin' }` AND email/name does NOT contain test patterns
- **Test Patterns:** test, demo, qa, uat, example, sample, dev, staging
- **Reason:** Preserve legitimate users for internship project
- **Preserved Fields:** All fields

#### 3. Legitimate Caregiver Accounts
- **Collection:** `caregivers`
- **Filter:** Linked to legitimate users (not test patterns)
- **Reason:** Preserve legitimate caregivers for internship project
- **Preserved Fields:** All fields (including ratings and reviews)

#### 4. Legitimate Patient Profiles
- **Collection:** `patients`
- **Filter:** Linked to legitimate users (not test patterns)
- **Reason:** Preserve legitimate patients for internship project
- **Preserved Fields:** All fields

#### 5. Service Categories
- **Collection:** `servicecategories`
- **Filter:** All documents
- **Reason:** Core platform functionality
- **Preserved Categories:**
  - Nursing Care
  - Elderly Attendant
  - Physiotherapy
  - Post-Hospital Care
- **Preserved Fields:** All fields

#### 6. System Settings
- **Collection:** `systemsettings`
- **Filter:** All documents
- **Reason:** Platform configuration
- **Preserved Settings:**
  - Support Phone
  - Support Email
  - Office Address
  - Social Links (Facebook, Instagram, LinkedIn, Twitter)
- **Preserved Fields:** All fields

### REMOVED (Test Data Only)

#### 1. Test User Accounts
- **Collection:** `users`
- **Filter:** `role: { $ne: 'admin' }` AND email/name contains test patterns
- **Test Patterns:** test, demo, qa, uat, example, sample, dev, staging
- **Reason:** Remove test/demo/QA/UAT accounts
- **Affected Roles:**
  - `user` (Patient accounts)
  - `caregiver` (Caregiver accounts)

#### 2. Test Patient Profiles
- **Collection:** `patients`
- **Filter:** Linked to test users
- **Reason:** Remove test patient data
- **Deleted Fields:** All fields

#### 3. Test Caregiver Profiles
- **Collection:** `caregivers`
- **Filter:** Linked to test users
- **Reason:** Remove test caregiver data
- **Deleted Fields:** All fields
- **Note:** Ratings reset to 0, reviewCount reset to 0 for test caregivers only

#### 4. Test Bookings
- **Collection:** `bookings`
- **Filter:** Linked to test patients or test caregivers
- **Reason:** Remove test bookings
- **Deleted Statuses:**
  - Pending
  - Confirmed
  - Active
  - Completed
  - Cancelled
- **Deleted Fields:** All fields

#### 5. Test Reviews
- **Collection:** `reviews`
- **Filter:** Linked to test caregivers
- **Reason:** Remove test reviews
- **Deleted Fields:** All fields

#### 6. Test Complaints
- **Collection:** `complaints`
- **Filter:** Linked to test patients or test caregivers
- **Reason:** Remove test complaints
- **Deleted Fields:** All fields

#### 7. Test Inquiries
- **Collection:** `inquiries`
- **Filter:** Linked to test users
- **Reason:** Remove test support requests
- **Deleted Types:**
  - Support requests
  - Coordinator requests
- **Deleted Fields:** All fields

#### 8. Test Notifications
- **Collection:** `notifications`
- **Filter:** Linked to test users
- **Reason:** Remove test notifications
- **Deleted Fields:** All fields

#### 9. Test Care Notes
- **Collection:** `carenotes`
- **Filter:** Linked to test caregivers
- **Reason:** Remove test care notes
- **Deleted Data:**
  - Visit notes
  - Observations
  - Vital sign records
- **Deleted Fields:** All fields

---

## Cleanup Procedure

### Prerequisites

1. **Database Backup**
   - Create a full backup of the database before cleanup
   - Store backup in secure location
   - Verify backup integrity

2. **Environment Setup**
   - Ensure MongoDB connection string is available
   - Set `MONGODB_URI` environment variable
   - Verify database connectivity

3. **Access Verification**
   - Confirm admin account credentials
   - Test admin login functionality
   - Document admin account details

### Execution Steps

#### Step 1: Backup Database
```bash
# Create backup using mongodump
mongodump --uri="mongodb://<connection-string>" --out=backup-$(date +%Y%m%d)

# Or using mongosh
mongosh "mongodb://<connection-string>" --eval "db.copyDatabase('care24', 'care24_backup')"
```

#### Step 2: Execute Cleanup Script
```bash
# Using Node.js
node database_cleanup_script.js

# Or using mongosh
mongosh "mongodb://<connection-string>" database_cleanup_script.js
```

#### Step 3: Verify Cleanup Results
- Review cleanup summary output
- Verify admin accounts preserved
- Verify service categories preserved
- Verify system settings preserved
- Confirm test data removed

#### Step 4: Test Application
- Login as admin
- Verify admin dashboard access
- Verify service categories display
- Verify system settings display
- Test platform functionality

#### Step 5: Deploy to Production
- Proceed with deployment if verification successful
- Roll back from backup if issues detected

---

## Cleanup Script Details

### Script Location
`database_cleanup_script.js`

### Script Functionality

The cleanup script performs the following operations in sequence:

1. **Connect to Database**
   - Uses `MONGODB_URI` environment variable
   - Verifies connection
   - Logs database name

2. **Preserve Admin Accounts**
   - Identifies all users with `role: 'admin'`
   - Stores admin IDs for reference
   - Logs preserved admin accounts

3. **Preserve Service Categories**
   - Identifies all service categories
   - Logs preserved categories
   - Maintains category structure

4. **Preserve System Settings**
   - Identifies all system settings
   - Logs preserved settings
   - Maintains configuration

5. **Identify Test Users**
   - Scans all non-admin users
   - Identifies test users by email/name patterns
   - Test patterns: test, demo, qa, uat, example, sample, dev, staging
   - Separates test users from legitimate users

6. **Remove Test Users**
   - Deletes only users matching test patterns
   - Preserves legitimate users
   - Logs deletion and preservation counts

7. **Remove Test Patient Profiles**
   - Identifies patients linked to test users
   - Deletes only test patient profiles
   - Preserves legitimate patient profiles
   - Logs deletion and preservation counts

8. **Remove Test Caregiver Profiles**
   - Identifies caregivers linked to test users
   - Deletes only test caregiver profiles
   - Preserves legitimate caregiver profiles
   - Logs deletion and preservation counts

9. **Remove Test Bookings**
   - Identifies bookings linked to test patients/caregivers
   - Deletes only test bookings
   - Preserves legitimate bookings
   - Logs deletion and preservation counts

10. **Remove Test Reviews**
    - Identifies reviews for test caregivers
    - Deletes only test reviews
    - Preserves legitimate reviews
    - Logs deletion and preservation counts

11. **Remove Test Complaints**
    - Identifies complaints from test patients/caregivers
    - Deletes only test complaints
    - Preserves legitimate complaints
    - Logs deletion and preservation counts

12. **Remove Test Inquiries**
    - Identifies inquiries from test users
    - Deletes only test inquiries
    - Preserves legitimate inquiries
    - Logs deletion and preservation counts

13. **Remove Test Notifications**
    - Identifies notifications for test users
    - Deletes only test notifications
    - Preserves legitimate notifications
    - Logs deletion and preservation counts

14. **Remove Test Care Notes**
    - Identifies care notes from test caregivers
    - Deletes only test care notes
    - Preserves legitimate care notes
    - Logs deletion and preservation counts

15. **Reset Test Caregiver Ratings**
    - Resets ratings only for test caregivers
    - Preserves ratings for legitimate caregivers
    - Logs reset count

16. **Generate Summary**
    - Displays records removed by collection
    - Displays records preserved by collection
    - Provides cleanup statistics

---

## Expected Results

### Records Removed (Test Data Only - Estimated)

| Collection | Estimated Count | Status |
|------------|------------------|--------|
| Users (Test) | TBD | ⏳ Pending |
| Patient Profiles (Test) | TBD | ⏳ Pending |
| Caregiver Profiles (Test) | TBD | ⏳ Pending |
| Bookings (Test) | TBD | ⏳ Pending |
| Reviews (Test) | TBD | ⏳ Pending |
| Complaints (Test) | TBD | ⏳ Pending |
| Inquiries (Test) | TBD | ⏳ Pending |
| Notifications (Test) | TBD | ⏳ Pending |
| Care Notes (Test) | TBD | ⏳ Pending |

### Records Preserved (Legitimate Data - Estimated)

| Collection | Estimated Count | Status |
|------------|------------------|--------|
| Admin Accounts | 1+ | ⏳ Pending |
| Legitimate Users | TBD | ⏳ Pending |
| Legitimate Patient Profiles | TBD | ⏳ Pending |
| Legitimate Caregiver Profiles | TBD | ⏳ Pending |
| Legitimate Bookings | TBD | ⏳ Pending |
| Legitimate Reviews | TBD | ⏳ Pending |
| Legitimate Complaints | TBD | ⏳ Pending |
| Legitimate Inquiries | TBD | ⏳ Pending |
| Legitimate Notifications | TBD | ⏳ Pending |
| Legitimate Care Notes | TBD | ⏳ Pending |
| Service Categories | 4+ | ⏳ Pending |
| System Settings | 1 | ⏳ Pending |

---

## Post-Cleanup Verification Checklist

### Admin Access Verification

- [ ] Admin account can login
- [ ] Admin dashboard accessible
- [ ] Admin permissions intact
- [ ] Admin role verification working

### Legitimate User Access Verification

- [ ] Legitimate users can login
- [ ] Legitimate caregivers can login
- [ ] User dashboard accessible
- [ ] Caregiver dashboard accessible

### Platform Configuration Verification

- [ ] Service categories display correctly
- [ ] Service categories functional
- [ ] System settings accessible
- [ ] System settings editable
- [ ] Social links display in footer
- [ ] Support information displays

### Data Integrity Verification

- [ ] No orphaned records
- [ ] No broken references
- [ ] Database indexes intact
- [ ] Collection schemas valid

### Application Functionality Verification

- [ ] User registration works
- [ ] Caregiver registration works
- [ ] Booking creation works
- [ ] Care note submission works
- [ ] Review submission works
- [ ] Complaint submission works
- [ ] Inquiry submission works

---

## Rollback Procedure

If cleanup causes issues, use the following rollback procedure:

### Immediate Rollback

```bash
# Restore from backup using mongorestore
mongorestore --uri="mongodb://<connection-string>" backup-<date>

# Or using mongosh
mongosh "mongodb://<connection-string>" --eval "db.dropDatabase()"
mongosh "mongodb://<connection-string>" --eval "db.copyDatabase('care24_backup', 'care24')"
```

### Verification After Rollback

1. Verify all data restored
2. Test application functionality
3. Verify admin access
4. Document rollback reason

---

## Cleanup Statistics (Post-Execution)

### Records Removed by Collection (Test Data Only)

| Collection | Count | Status |
|------------|-------|--------|
| Users (Test) | - | ⏳ Pending |
| Patient Profiles (Test) | - | ⏳ Pending |
| Caregiver Profiles (Test) | - | ⏳ Pending |
| Bookings (Test) | - | ⏳ Pending |
| Reviews (Test) | - | ⏳ Pending |
| Complaints (Test) | - | ⏳ Pending |
| Inquiries (Test) | - | ⏳ Pending |
| Notifications (Test) | - | ⏳ Pending |
| Care Notes (Test) | - | ⏳ Pending |
| **Total Removed** | **-** | **⏳ Pending** |

### Records Preserved (Legitimate Data)

| Collection | Count | Status |
|------------|-------|--------|
| Admin Accounts | - | ⏳ Pending |
| Legitimate Users | - | ⏳ Pending |
| Legitimate Patient Profiles | - | ⏳ Pending |
| Legitimate Caregiver Profiles | - | ⏳ Pending |
| Legitimate Bookings | - | ⏳ Pending |
| Legitimate Reviews | - | ⏳ Pending |
| Legitimate Complaints | - | ⏳ Pending |
| Legitimate Inquiries | - | ⏳ Pending |
| Legitimate Notifications | - | ⏳ Pending |
| Legitimate Care Notes | - | ⏳ Pending |
| Service Categories | - | ⏳ Pending |
| System Settings | - | ⏳ Pending |
| **Total Preserved** | **-** | **⏳ Pending** |

### Remaining Admin Accounts

| Name | Email | Role | Status |
|------|-------|------|--------|
| - | - | - | ⏳ Pending |

### Remaining Legitimate Users

| Name | Email | Role | Status |
|------|-------|------|--------|
| - | - | - | ⏳ Pending |

### Remaining Service Categories

| Title | Status |
|-------|--------|
| - | ⏳ Pending |

### Remaining System Settings

| Setting | Value | Status |
|---------|-------|--------|
| - | - | ⏳ Pending |

---

## Final Status

**Current Status:** ⏳ **PENDING EXECUTION**

The cleanup script has been prepared and is ready for execution. Execute the script before proceeding with production deployment.

**IMPORTANT:** This cleanup is conservative and only removes data that is clearly identified as test data (emails/names containing: test, demo, qa, uat, example, sample, dev, staging). Legitimate caregiver and user accounts are preserved.

**Next Steps:**

1. Create database backup
2. Execute cleanup script: `node database_cleanup_script.js`
3. Verify cleanup results
4. Verify admin accounts can login
5. Verify legitimate caregivers can login
6. Verify legitimate users can login
7. Test application functionality
8. Update this report with actual statistics
9. Proceed with deployment if verification successful

---

## Execution Log

**Script Execution Date:** -  
**Executed By:** -  
**Execution Duration:** -  
**Backup Created:** -  
**Backup Location:** -  

### Execution Output

```
(Paste script output here after execution)
```

### Issues Encountered

- None (execution pending)

---

## Approval

**Cleanup Script Prepared By:** Cascade AI  
**Date:** June 3, 2026  
**Status:** Ready for Execution  

**Approval Required:** Yes  
**Approved By:** -  
**Approval Date:** -  

---

## Appendix

### A. MongoDB Connection String Format

```
mongodb://[username:password@]host[:port][/[database][?options]]
```

Example:
```
mongodb+srv://admin:password@cluster.mongodb.net/care24
```

### B. Environment Variables

```bash
MONGODB_URI=mongodb://localhost:27017/care24
```

### C. Script Execution Commands

```bash
# Set environment variable
export MONGODB_URI="mongodb://localhost:27017/care24"

# Execute script
node database_cleanup_script.js
```

### D. Backup Commands

```bash
# Create backup
mongodump --uri="$MONGODB_URI" --out=backup-$(date +%Y%m%d)

# Restore backup
mongorestore --uri="$MONGODB_URI" backup-<date>
```

---

**Report End**

*This database cleanup report was prepared on June 3, 2026, for the Care24 application. Execute the cleanup script before production deployment.*
