/**
 * Test Data for E2E Tests
 * Contains test credentials and sample data
 */

/**
 * Test user credentials
 * IMPORTANT: Update these with real test account credentials before running tests.
 * Without valid credentials, authentication tests will fail.
 *
 * To create a test account:
 * 1. Register a new account on the staging environment
 * 2. Update the phone and password below
 * 3. Run: npx playwright test
 */
export const TEST_USER = {
  phone: "966500000000", // TODO: Replace with real test phone number
  password: "TestPassword123!", // TODO: Replace with real test password
  fullName: "مستخدم اختبار",
};

// Sample career job data
export const SAMPLE_CAREER_JOB = {
  title: "معلم رياضيات",
  rank: "معلم",
  school: "مدرسة الاختبار الثانوية",
  educationalStage: "المرحلة الثانوية",
  startYear: 2020,
  endYear: 2023,
};

// Sample qualification data
export const SAMPLE_QUALIFICATION = {
  degreeType: "بكالوريوس",
  title: "تربية رياضيات",
  grade: "جيد جداً",
  graduationDate: "2019-06-15",
};

// Sample profile data
export const SAMPLE_PROFILE = {
  academicYearId: 1, // Update based on available years
  profileTypeId: 1, // Update based on available types
  templateId: 1,
};

// Test image path (create a test image in this location)
export const TEST_IMAGE_PATH = "e2e/fixtures/test-image.jpg";

// URLs
export const URLS = {
  home: "/",
  login: "/sign/in",
  register: "/sign/up",
  dashboard: "/dashboard",
  accountInfo: "/dashboard/account/info",
  profileData: "/dashboard/account/profile-data",
  changePassword: "/dashboard/account/change-password",
  newProfile: "/dashboard/profile/new",
  imagesTest: "/dashboard/images",
  shareLinksTest: "/dashboard/share-links",
  // Profile URLs
  profiles: "/dashboard/profiles",
  profileEditor: "/dashboard/profile", // + /{id}
  profileSections: "/dashboard/profile", // + /{id}/sections
  // Public profile URL
  publicProfile: "/profile", // + /{token}
};

// Selectors - common selectors used across tests
export const SELECTORS = {
  // Auth
  phoneInput: 'input[name="phone"]',
  passwordInput: 'input[name="password"]',
  loginButton: 'button[type="submit"]',

  // Dashboard
  profileCard: '[data-testid="profile-card"]',
  createProfileButton: '[data-testid="create-profile"]',

  // Forms
  submitButton: 'button[type="submit"]',
  loadingSpinner: '.animate-spin',

  // Messages
  successMessage: '.bg-green-100',
  errorMessage: '.bg-red-100',

  // Profiles
  profileStatusBadge: '[data-testid="profile-status"]',
  publishButton: '[data-testid="publish-profile"]',
  unpublishButton: '[data-testid="unpublish-profile"]',
  shareButton: '[data-testid="share-profile"]',
  deleteProfileButton: '[data-testid="delete-profile"]',
  profileSection: '[data-testid="section"]',
  sectionHeader: '[data-testid="section-header"]',

  // Images
  imageCard: '[data-testid="image-card"]',
  imageGallery: '[data-testid="image-gallery"]',
  uploadZone: '[data-testid="upload-zone"]',
  uploadButton: '[data-testid="upload-button"]',
  deleteImageButton: '[data-testid="delete-image"]',
  editImageButton: '[data-testid="edit-image"]',
  reorderButton: '[data-testid="reorder-images"]',
  dragHandle: '[data-testid="drag-handle"]',

  // Share Links
  shareModal: '[data-testid="share-modal"]',
  shareLinkItem: '[data-testid="share-link-item"]',
  shareLinkList: '[data-testid="share-link-list"]',
  createShareLinkButton: '[data-testid="create-share-link"]',
  copyLinkButton: '[data-testid="copy-link"]',
  deleteShareLinkButton: '[data-testid="delete-share-link"]',
  linkLabel: '[data-testid="link-label"]',
  linkExpiry: '[data-testid="link-expiry"]',
  viewCount: '[data-testid="view-count"]',

  // Modal
  modalOverlay: '[data-testid="modal-overlay"]',
  closeModalButton: '[data-testid="close-modal"]',
  confirmButton: '[data-testid="confirm-button"]',
  cancelButton: '[data-testid="cancel-button"]',
};

// Wait times
export const TIMEOUTS = {
  short: 1000,
  medium: 3000,
  long: 5000,
  apiResponse: 10000,
};
