/**
 * Care24 Database Cleanup Script for Production Deployment
 * 
 * This script removes test/demo/QA/UAT data while preserving:
 * - Admin accounts
 * - Legitimate caregiver accounts
 * - Legitimate user accounts
 * - Service categories
 * - System settings
 * - Application configuration
 * 
 * NOTE: This is an internship project, not a live healthcare company.
 * Only data that is clearly test/demo/QA/UAT will be removed.
 * Legitimate caregiver and user accounts will be preserved.
 * 
 * Test data identification patterns:
 * - Email contains: test, demo, qa, uat, example
 * - Name contains: Test, Demo, QA, UAT, Example
 * - Recent test data (last 7 days with test patterns)
 * 
 * Run this script in MongoDB shell or mongosh:
 * mongosh mongodb://<your-connection-string> database_cleanup_script.js
 * 
 * Or use Node.js:
 * node database_cleanup_script.js
 */

// MongoDB connection string - set via environment variable or replace
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/care24';

// Test data patterns to identify
const TEST_PATTERNS = [
  /test/i,
  /demo/i,
  /qa/i,
  /uat/i,
  /example/i,
  /sample/i,
  /dev/i,
  /staging/i
];

// Function to check if data is test data
function isTestData(data) {
  if (!data) return false;
  
  const email = (data.email || '').toLowerCase();
  const name = (data.name || '').toLowerCase();
  
  // Check email for test patterns
  for (const pattern of TEST_PATTERNS) {
    if (pattern.test(email) || pattern.test(name)) {
      return true;
    }
  }
  
  return false;
}

// Cleanup statistics
const cleanupStats = {
  users: { removed: 0, preserved: 0 },
  patients: { removed: 0, preserved: 0 },
  caregivers: { removed: 0, preserved: 0 },
  bookings: { removed: 0, preserved: 0 },
  reviews: { removed: 0, preserved: 0 },
  complaints: { removed: 0, preserved: 0 },
  inquiries: { removed: 0, preserved: 0 },
  notifications: { removed: 0, preserved: 0 },
  careNotes: { removed: 0, preserved: 0 },
  serviceCategories: { removed: 0, preserved: 0 },
  systemSettings: { removed: 0, preserved: 0 }
};

async function performCleanup() {
  console.log('====================================================');
  console.log('   CARE24 DATABASE CLEANUP FOR PRODUCTION');
  console.log('====================================================');
  console.log(`Connecting to: ${MONGODB_URI}`);
  console.log('');

  const mongoose = require('mongoose');
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');
    console.log(`  Database: ${mongoose.connection.name}`);
    console.log('');

    // Get database instance
    const db = mongoose.connection.db;

    // ============================================
    // 1. PRESERVE: Admin Accounts
    // ============================================
    console.log('--- Step 1: Preserving Admin Accounts ---');
    const adminUsers = await db.collection('users').find({ role: 'admin' }).toArray();
    const adminIds = adminUsers.map(u => u._id.toString());
    cleanupStats.users.preserved = adminUsers.length;
    console.log(`✓ Preserved ${adminUsers.length} admin account(s)`);
    adminUsers.forEach(admin => {
      console.log(`  - ${admin.name} (${admin.email})`);
    });
    console.log('');

    // ============================================
    // 2. PRESERVE: Service Categories
    // ============================================
    console.log('--- Step 2: Preserving Service Categories ---');
    const serviceCategories = await db.collection('servicecategories').find({}).toArray();
    cleanupStats.serviceCategories.preserved = serviceCategories.length;
    console.log(`✓ Preserved ${serviceCategories.length} service category/categories`);
    serviceCategories.forEach(cat => {
      console.log(`  - ${cat.title}`);
    });
    console.log('');

    // ============================================
    // 3. PRESERVE: System Settings
    // ============================================
    console.log('--- Step 3: Preserving System Settings ---');
    const systemSettings = await db.collection('systemsettings').find({}).toArray();
    cleanupStats.systemSettings.preserved = systemSettings.length;
    console.log(`✓ Preserved ${systemSettings.length} system setting(s)`);
    console.log('');

    // ============================================
    // 4. REMOVE: Test/Demo/QA/UAT Users (Non-Admin)
    // ============================================
    console.log('--- Step 4: Removing Test/Demo/QA/UAT Users ---');
    const allUsers = await db.collection('users').find({ 
      role: { $ne: 'admin' } 
    }).toArray();
    
    // Identify test users
    const testUserIds = [];
    const legitimateUserIds = [];
    
    allUsers.forEach(user => {
      if (isTestData(user)) {
        testUserIds.push(user._id);
      } else {
        legitimateUserIds.push(user._id);
      }
    });
    
    // Delete only test users
    const usersDeleteResult = await db.collection('users').deleteMany({ 
      _id: { $in: testUserIds }
    });
    cleanupStats.users.removed = usersDeleteResult.deletedCount;
    cleanupStats.users.preserved = legitimateUserIds.length;
    console.log(`✓ Removed ${usersDeleteResult.deletedCount} test user(s)`);
    console.log(`✓ Preserved ${legitimateUserIds.length} legitimate user(s)`);
    console.log('');

    // ============================================
    // 5. REMOVE: Patient Profiles (Test Only)
    // ============================================
    console.log('--- Step 5: Removing Test Patient Profiles ---');
    const allPatients = await db.collection('patients').find({}).toArray();
    
    // Get user IDs for test patients
    const testPatientIds = [];
    const legitimatePatientIds = [];
    
    for (const patient of allPatients) {
      const user = await db.collection('users').findOne({ _id: patient.user });
      if (user && isTestData(user)) {
        testPatientIds.push(patient._id);
      } else {
        legitimatePatientIds.push(patient._id);
      }
    }
    
    // Delete only test patients
    const patientsDeleteResult = await db.collection('patients').deleteMany({ 
      _id: { $in: testPatientIds }
    });
    cleanupStats.patients.removed = patientsDeleteResult.deletedCount;
    cleanupStats.patients.preserved = legitimatePatientIds.length;
    console.log(`✓ Removed ${patientsDeleteResult.deletedCount} test patient profile(s)`);
    console.log(`✓ Preserved ${legitimatePatientIds.length} legitimate patient profile(s)`);
    console.log('');

    // ============================================
    // 6. REMOVE: Caregiver Profiles (Test Only)
    // ============================================
    console.log('--- Step 6: Removing Test Caregiver Profiles ---');
    const allCaregivers = await db.collection('caregivers').find({}).toArray();
    
    // Get user IDs for test caregivers
    const testCaregiverIds = [];
    const legitimateCaregiverIds = [];
    
    for (const caregiver of allCaregivers) {
      const user = await db.collection('users').findOne({ _id: caregiver.user });
      if (user && isTestData(user)) {
        testCaregiverIds.push(caregiver._id);
      } else {
        legitimateCaregiverIds.push(caregiver._id);
      }
    }
    
    // Delete only test caregivers
    const caregiversDeleteResult = await db.collection('caregivers').deleteMany({ 
      _id: { $in: testCaregiverIds }
    });
    cleanupStats.caregivers.removed = caregiversDeleteResult.deletedCount;
    cleanupStats.caregivers.preserved = legitimateCaregiverIds.length;
    console.log(`✓ Removed ${caregiversDeleteResult.deletedCount} test caregiver profile(s)`);
    console.log(`✓ Preserved ${legitimateCaregiverIds.length} legitimate caregiver profile(s)`);
    console.log('');

    // ============================================
    // 7. REMOVE: Bookings (Test Only)
    // ============================================
    console.log('--- Step 7: Removing Test Bookings ---');
    const allBookings = await db.collection('bookings').find({}).toArray();
    
    // Get bookings for test patients/caregivers
    const testBookingIds = [];
    const legitimateBookingIds = [];
    
    for (const booking of allBookings) {
      const patient = await db.collection('patients').findOne({ _id: booking.patient });
      const caregiver = await db.collection('caregivers').findOne({ _id: booking.caregiver });
      
      const patientUser = patient ? await db.collection('users').findOne({ _id: patient.user }) : null;
      const caregiverUser = caregiver ? await db.collection('users').findOne({ _id: caregiver.user }) : null;
      
      if ((patientUser && isTestData(patientUser)) || (caregiverUser && isTestData(caregiverUser))) {
        testBookingIds.push(booking._id);
      } else {
        legitimateBookingIds.push(booking._id);
      }
    }
    
    // Delete only test bookings
    const bookingsDeleteResult = await db.collection('bookings').deleteMany({ 
      _id: { $in: testBookingIds }
    });
    cleanupStats.bookings.removed = bookingsDeleteResult.deletedCount;
    cleanupStats.bookings.preserved = legitimateBookingIds.length;
    console.log(`✓ Removed ${bookingsDeleteResult.deletedCount} test booking(s)`);
    console.log(`✓ Preserved ${legitimateBookingIds.length} legitimate booking(s)`);
    console.log('');

    // ============================================
    // 8. REMOVE: Reviews (Test Only)
    // ============================================
    console.log('--- Step 8: Removing Test Reviews ---');
    const allReviews = await db.collection('reviews').find({}).toArray();
    
    // Get reviews for test caregivers
    const testReviewIds = [];
    const legitimateReviewIds = [];
    
    for (const review of allReviews) {
      const caregiver = await db.collection('caregivers').findOne({ _id: review.caregiver });
      const caregiverUser = caregiver ? await db.collection('users').findOne({ _id: caregiver.user }) : null;
      
      if (caregiverUser && isTestData(caregiverUser)) {
        testReviewIds.push(review._id);
      } else {
        legitimateReviewIds.push(review._id);
      }
    }
    
    // Delete only test reviews
    const reviewsDeleteResult = await db.collection('reviews').deleteMany({ 
      _id: { $in: testReviewIds }
    });
    cleanupStats.reviews.removed = reviewsDeleteResult.deletedCount;
    cleanupStats.reviews.preserved = legitimateReviewIds.length;
    console.log(`✓ Removed ${reviewsDeleteResult.deletedCount} test review(s)`);
    console.log(`✓ Preserved ${legitimateReviewIds.length} legitimate review(s)`);
    console.log('');

    // ============================================
    // 9. REMOVE: Complaints (Test Only)
    // ============================================
    console.log('--- Step 9: Removing Test Complaints ---');
    const allComplaints = await db.collection('complaints').find({}).toArray();
    
    // Get complaints for test patients/caregivers
    const testComplaintIds = [];
    const legitimateComplaintIds = [];
    
    for (const complaint of allComplaints) {
      const patient = await db.collection('patients').findOne({ _id: complaint.patient });
      const caregiver = await db.collection('caregivers').findOne({ _id: complaint.caregiver });
      
      const patientUser = patient ? await db.collection('users').findOne({ _id: patient.user }) : null;
      const caregiverUser = caregiver ? await db.collection('users').findOne({ _id: caregiver.user }) : null;
      
      if ((patientUser && isTestData(patientUser)) || (caregiverUser && isTestData(caregiverUser))) {
        testComplaintIds.push(complaint._id);
      } else {
        legitimateComplaintIds.push(complaint._id);
      }
    }
    
    // Delete only test complaints
    const complaintsDeleteResult = await db.collection('complaints').deleteMany({ 
      _id: { $in: testComplaintIds }
    });
    cleanupStats.complaints.removed = complaintsDeleteResult.deletedCount;
    cleanupStats.complaints.preserved = legitimateComplaintIds.length;
    console.log(`✓ Removed ${complaintsDeleteResult.deletedCount} test complaint(s)`);
    console.log(`✓ Preserved ${legitimateComplaintIds.length} legitimate complaint(s)`);
    console.log('');

    // ============================================
    // 10. REMOVE: Inquiries (Test Only)
    // ============================================
    console.log('--- Step 10: Removing Test Inquiries ---');
    const allInquiries = await db.collection('inquiries').find({}).toArray();
    
    // Get inquiries from test users
    const testInquiryIds = [];
    const legitimateInquiryIds = [];
    
    for (const inquiry of allInquiries) {
      const user = await db.collection('users').findOne({ _id: inquiry.user });
      
      if (user && isTestData(user)) {
        testInquiryIds.push(inquiry._id);
      } else {
        legitimateInquiryIds.push(inquiry._id);
      }
    }
    
    // Delete only test inquiries
    const inquiriesDeleteResult = await db.collection('inquiries').deleteMany({ 
      _id: { $in: testInquiryIds }
    });
    cleanupStats.inquiries.removed = inquiriesDeleteResult.deletedCount;
    cleanupStats.inquiries.preserved = legitimateInquiryIds.length;
    console.log(`✓ Removed ${inquiriesDeleteResult.deletedCount} test inquiry/ies`);
    console.log(`✓ Preserved ${legitimateInquiryIds.length} legitimate inquiry/ies`);
    console.log('');

    // ============================================
    // 11. REMOVE: Notifications (Test Only)
    // ============================================
    console.log('--- Step 11: Removing Test Notifications ---');
    const allNotifications = await db.collection('notifications').find({}).toArray();
    
    // Get notifications for test users
    const testNotificationIds = [];
    const legitimateNotificationIds = [];
    
    for (const notification of allNotifications) {
      const user = await db.collection('users').findOne({ _id: notification.user });
      
      if (user && isTestData(user)) {
        testNotificationIds.push(notification._id);
      } else {
        legitimateNotificationIds.push(notification._id);
      }
    }
    
    // Delete only test notifications
    const notificationsDeleteResult = await db.collection('notifications').deleteMany({ 
      _id: { $in: testNotificationIds }
    });
    cleanupStats.notifications.removed = notificationsDeleteResult.deletedCount;
    cleanupStats.notifications.preserved = legitimateNotificationIds.length;
    console.log(`✓ Removed ${notificationsDeleteResult.deletedCount} test notification(s)`);
    console.log(`✓ Preserved ${legitimateNotificationIds.length} legitimate notification(s)`);
    console.log('');

    // ============================================
    // 12. REMOVE: Care Notes (Test Only)
    // ============================================
    console.log('--- Step 12: Removing Test Care Notes ---');
    const allCareNotes = await db.collection('carenotes').find({}).toArray();
    
    // Get care notes for test caregivers
    const testCareNoteIds = [];
    const legitimateCareNoteIds = [];
    
    for (const careNote of allCareNotes) {
      const caregiver = await db.collection('caregivers').findOne({ _id: careNote.caregiver });
      const caregiverUser = caregiver ? await db.collection('users').findOne({ _id: caregiver.user }) : null;
      
      if (caregiverUser && isTestData(caregiverUser)) {
        testCareNoteIds.push(careNote._id);
      } else {
        legitimateCareNoteIds.push(careNote._id);
      }
    }
    
    // Delete only test care notes
    const careNotesDeleteResult = await db.collection('carenotes').deleteMany({ 
      _id: { $in: testCareNoteIds }
    });
    cleanupStats.careNotes.removed = careNotesDeleteResult.deletedCount;
    cleanupStats.careNotes.preserved = legitimateCareNoteIds.length;
    console.log(`✓ Removed ${careNotesDeleteResult.deletedCount} test care note(s)`);
    console.log(`✓ Preserved ${legitimateCareNoteIds.length} legitimate care note(s)`);
    console.log('');

    // ============================================
    // 13. RESET: Caregiver Ratings (Test Caregivers Only)
    // ============================================
    console.log('--- Step 13: Resetting Test Caregiver Ratings ---');
    const caregiversResetResult = await db.collection('caregivers').updateMany(
      { _id: { $in: testCaregiverIds } },
      { $set: { rating: 0, reviewCount: 0 } }
    );
    console.log(`✓ Reset ratings for ${caregiversResetResult.modifiedCount} test caregiver(s)`);
    console.log('✓ Preserved ratings for legitimate caregivers');
    console.log('');

    // ============================================
    // FINAL SUMMARY
    // ============================================
    console.log('====================================================');
    console.log('           CLEANUP SUMMARY');
    console.log('====================================================');
    console.log('');
    console.log('RECORDS REMOVED (Test Data Only):');
    console.log(`  Users (Test):            ${cleanupStats.users.removed}`);
    console.log(`  Patient Profiles (Test):  ${cleanupStats.patients.removed}`);
    console.log(`  Caregiver Profiles (Test):${cleanupStats.caregivers.removed}`);
    console.log(`  Bookings (Test):         ${cleanupStats.bookings.removed}`);
    console.log(`  Reviews (Test):          ${cleanupStats.reviews.removed}`);
    console.log(`  Complaints (Test):       ${cleanupStats.complaints.removed}`);
    console.log(`  Inquiries (Test):        ${cleanupStats.inquiries.removed}`);
    console.log(`  Notifications (Test):    ${cleanupStats.notifications.removed}`);
    console.log(`  Care Notes (Test):       ${cleanupStats.careNotes.removed}`);
    console.log('');
    console.log('RECORDS PRESERVED (Legitimate Data):');
    console.log(`  Admin Accounts:          ${cleanupStats.users.preserved} (admin role)`);
    console.log(`  Legitimate Users:       ${cleanupStats.users.preserved}`);
    console.log(`  Legitimate Patients:    ${cleanupStats.patients.preserved}`);
    console.log(`  Legitimate Caregivers:  ${cleanupStats.caregivers.preserved}`);
    console.log(`  Legitimate Bookings:    ${cleanupStats.bookings.preserved}`);
    console.log(`  Legitimate Reviews:     ${cleanupStats.reviews.preserved}`);
    console.log(`  Legitimate Complaints:  ${cleanupStats.complaints.preserved}`);
    console.log(`  Legitimate Inquiries:   ${cleanupStats.inquiries.preserved}`);
    console.log(`  Legitimate Notifications:${cleanupStats.notifications.preserved}`);
    console.log(`  Legitimate Care Notes:  ${cleanupStats.careNotes.preserved}`);
    console.log('');
    console.log('PLATFORM CONFIGURATION PRESERVED:');
    console.log(`  Service Categories:      ${cleanupStats.serviceCategories.preserved}`);
    console.log(`  System Settings:         ${cleanupStats.systemSettings.preserved}`);
    console.log('');
    console.log('====================================================');
    console.log('      DATABASE CLEANED FOR DEPLOYMENT');
    console.log('====================================================');
    console.log('');
    console.log('NOTE: Only test data (emails/names containing:');
    console.log('      test, demo, qa, uat, example, sample, dev, staging)');
    console.log('      was removed. Legitimate data preserved.');
    console.log('');
    console.log('Next Steps:');
    console.log('1. Verify admin accounts can login');
    console.log('2. Verify service categories are intact');
    console.log('3. Verify system settings are intact');
    console.log('4. Verify legitimate caregivers can login');
    console.log('5. Verify legitimate users can login');
    console.log('6. Test application functionality');
    console.log('7. Deploy to production');
    console.log('');

    await mongoose.connection.close();
    console.log('Database connection closed.');
    console.log('');

    return cleanupStats;

  } catch (error) {
    console.error('❌ Cleanup failed with error:', error);
    console.error('');
    console.error('CLEANUP FAILED');
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run cleanup if executed directly
if (require.main === module) {
  performCleanup()
    .then(stats => {
      console.log(JSON.stringify(stats, null, 2));
      process.exit(0);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { performCleanup };
