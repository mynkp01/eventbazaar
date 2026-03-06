enum Query {
  // Vendor
  vendor = "/vendor",
  vendorSignIn = "/vendor-signin",
  vendorSignUp = "/vendor-signup",
  vendorSendOtp = "/vendor-sendotp",
  vendorReSendOtp = "/vendor-resendotp",
  vendorVerifyOtp = "/vendor-verifyotp",
  vendorForgotPin = "/vendor-forgot-pin",
  vendorResetPin = "/vendor-reset-pin",
  vendorSignOut = "/vendor-signout",
  vendorDetails = "/vendor-details",
  vendorVerticalEvent = "/vendor-vertical-event",
  leadsListing = "/lead-generator",
  compareVendor = "/compare-vendor",
  blockUnblockVendor = "/block-unblock-vendor",
  deleteVendor = "/delete-vendor",

  // Vendor Doc
  vendorDocument = "/vendor-document",

  // Project
  project = "/project",

  // Admin
  admin = "/admin",
  adminVendor = "/admin-vendor",
  adminSignOut = "/admin-sign-out",

  // Project Doc
  projectDocument = "/project-document",

  // Values
  lookupValue = "/lookup-value",
  valueLookup = "/value-lookup",
  cityLookup = "/city-lookup",
  roleLookup = "/role-lookup",
  planLookup = "/plan-lookup",
  cityNameList = "/city-name-list",
  state = "/state",

  // Category
  lookupCategory = "/lookup-category",
  categoryLookup = "/category-lookup",
  adminCategoryLookup = "/admin-lookup-category",
  categoryWiseVendorList = "/category-wise-vendor-list",

  // Plan Rule
  planRuleLookup = "/plan-rule-lookup",
  planRule = "/plan-rule",
  planRulePrice = "/plan-rule-price",

  // Plan Features
  planFeature = "/plan-feature",

  // Event Type
  eventType = "/event-type",
  eventTypeLookup = "/event-type-lookup",
  eventVenueLookup = "/event-venue-lookup",
  eventVertical = "/event-vertical",
  eventVerticalLookup = "/event-vertical-lookup",
  eventVerticalAndEventType = "/event-vertical-and-event-type",
  eventTypeWiseSubCategory = "/event-type-wise-sub-category",
  eventCategoryWiseVendorList = "/vendor-list",

  // Business Category
  businessCategory = "/business-category",
  businessCategoryLookup = "/business-category-lookup",

  // Business Sub Category
  businessSubCategory = "/business-sub-category",
  businessSubCategoryLookup = "/business-sub-category-lookup",
  businessSubCategoryFilterList = "/business-sub-category-filter-list",
  businessSubCategoryDetails = "/business-sub-category-details",

  // Chat
  chat = "/chat",
  chatSearch = "/chat-search",
  chatMessage = "/chat-message",

  // FAQ
  faq = "/faq",

  // Review
  review = "/review",

  // Review Comment
  reviewComment = "/review-comment",

  // Brochure
  brochure = "/brochure",

  // Hero Banner
  heroBanner = "/hero-banner",
  heroBannerCover = "/hero-banner-cover",

  // B2B Community
  b2bCommunity = "/b2b-community",

  // Keyword
  keyword = "/keyword",
  keywordLookup = "/keyword-lookup",

  // About Us
  aboutUs = "/about-us",

  // Inspiration Reels
  inspirationReel = "/inspiration-reel",

  // Payment Policies
  paymentPolicy = "/payment-policy",

  // Dashboard
  profileCompletion = "/profile-completion",

  // Vendor Vertical
  vendorVertical = "/vendor-vertical",

  // Razorpay
  orderId = "/order-id",
  verifyPayment = "/verify-payment",
  updateSubscription = "/update-subscription",
  BazaarBuddyOrderId = "/bazaar-buddy/order-id",
  BazaarPaymentVerifyPayment = "/bazaar-buddy/verify-payment",

  // Coupon
  coupon = "/coupon",
  checkCoupon = "/check-coupon",

  // Request Quote
  requestQuote = "/request-quote",

  // City
  city = "/city",
  cityList = "/city-list",
  cityDetails = "/city-details",

  // Plans
  plan = "/plan",

  // Subscriptions
  subscription = "/subscription",

  // Landing
  enquiryMail = "/enquiry-mail",
  verticalWiseVendor = "/vertical-wise-vendor",

  // Common
  verifyOtp = "/verify-otp",
  sendOtp = "/send-otp",
  resendOtp = "/resend-otp",

  // Enterprise
  enterprise = "/enterprise",
  enterpriseSubscription = "/enterprise-subscription",

  // Client
  customerSignup = "/customer-signup",
  customerSendOtp = "/customer-sendotp",
  customerVerifyOtp = "/customer-verifyotp",
  customerResendOtp = "/customer-resendotp",
  customerSignIn = "/customer-signin",
  categoryList = "/category-list",
  customerCategoryList = "/customer-category-list",
  customerSubCategoryList = "/customer-business-sub-category-list",
  customerSignout = "/customer-signout",
  customerLead = "/lead",
  customerToggleLike = "/customer-toggle-like",
  customerFavorite = "/customer-favorite-vendor",
  vendorsMenu = "/vendors-menu-list",
  educationalVideo = "/educational-video",
  educationalVideoList = "/educational-video-list",

  //Customer
  customer = "/customer",

  //Artist
  artist = "/artist",

  //Popular Search
  popularSearch = "/popular-search",

  // Inspiration Gallery
  trendGallery = "/inspiration-gallery",
  trendGalleryFilter = "/inspiration-gallery-filter",

  // Venues
  venue = "/venue",

  // Bazaar Buddy
  bazaarBuddyPlan = "/bazaar-buddy-plan",
  bazaarBuddySubscription = "/bazaar-buddy-subscription",
  bazaarBuddyConsultant = "/bazaar-buddy-consultant",

  // Wordpress
  posts = "/posts",

  //Web Review
  webSiteReview = "/website-review",

  //Career
  career = "/career",

  //Event Log
  requestLog = "/request-log",

  // Utils
  ipIfy = "https://api.ipify.org?format=json",
  metaLookup = "/meta-lookup",
}

export default Query;
