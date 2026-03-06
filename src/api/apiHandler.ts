import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { encrypt } from "src/utils/helper";
import Query from "./Query";
import apiClient from "./apiClient";

export const apiHandler = {
  vendor: {
    vendorSignIn: (payload: any, options?: AxiosRequestConfig<any>) => {
      return apiClient.post(Query.vendorSignIn, payload, options);
    },
    vendorSignUp: (payload: any, options?: AxiosRequestConfig<any>) => {
      return apiClient.post(Query.vendorSignUp, payload, options);
    },
    vendorSendOtp: (payload: any, options?: AxiosRequestConfig<any>) => {
      return apiClient.post(Query.vendorSendOtp, payload, options);
    },
    vendorReSendOtp: (payload: any, options?: AxiosRequestConfig<any>) => {
      return apiClient.post(Query.vendorReSendOtp, payload, options);
    },
    vendorVerifyOtp: (payload: any, options?: AxiosRequestConfig<any>) => {
      return apiClient.post(Query.vendorVerifyOtp, payload, options);
    },
    vendorForgotPin: (payload: any, options?: AxiosRequestConfig<any>) => {
      return apiClient.post(Query.vendorForgotPin, payload, options);
    },
    vendorResetPin: (payload: any, options?: AxiosRequestConfig<any>) => {
      return apiClient.post(Query.vendorResetPin, payload, options);
    },
    vendorSignOut: (payload?: any, options?: AxiosRequestConfig<any>) => {
      return apiClient.post(Query.vendorSignOut, payload, options);
    },
    vendorUpdatePin: (payload: any) => {
      return apiClient.post(`${Query.vendor}-update-pin`, payload);
    },
    deletedVendor: (filterString = "") => {
      return apiClient.get(`${Query.deleteVendor}?${filterString}`);
    },
    revokeVendor: (id: string) => {
      return apiClient.patch(`${Query.vendor}-revoke/${id}`);
    },
    vendorBlockUnblock: (
      id: string,
      payload?: any,
      options?: AxiosRequestConfig<any>,
    ) => {
      return apiClient.put(
        `${Query.blockUnblockVendor}/${id}`,
        payload,
        options,
      );
    },
    vendorDelete: (id: string, payload: any) => {
      return apiClient.put(`${Query.vendor}/${id}`, payload);
    },
    vendorDetails: (id: string, options?: AxiosRequestConfig<any>) => {
      return apiClient.get(`${Query.vendor}/${id}`, options);
    },
    vendorProfileUpdate: (id: string, options?: any) => {
      return apiClient.patch(
        `${Query.vendor}/${id}?update_section=${options.updateSection}`,
        options,
      );
    },
    vendorVerticalAndEvents: (id: string) => {
      return apiClient.get(`${Query.vendorVerticalEvent}/${id}`);
    },
    vendorList(filterString = "") {
      return apiClient.get(`${Query.vendor}?${filterString}`);
    },
    excel(filterString = "") {
      return apiClient.get(`${Query.vendor}-excel?${filterString}`);
    },
    leadsListing(filterString = "") {
      return apiClient.get(`${Query.leadsListing}?${filterString}`);
    },
    updateLeadStatus(id: string, payload: any) {
      return apiClient.patch(`${Query.leadsListing}/${id}`, payload);
    },
    compareVendor(filterString = "") {
      return apiClient.get(`${Query.compareVendor}?${filterString}`);
    },
  },
  vendorDoc: {
    vendorDocument: (payload: any) => {
      return apiClient.post(Query.vendorDocument, payload);
    },
    vendorDocumentList: (vendor_id: string) => {
      return apiClient.get(`${Query.vendorDocument}/${vendor_id}`);
    },
    vendorDocumentDelete: (id: string) => {
      return apiClient.delete(`${Query.vendorDocument}/${id}`);
    },
  },
  project: {
    list: (filterString = "") => {
      return apiClient.get(`${Query.project}?${filterString}`);
    },
    get(id: string) {
      return apiClient.get(`${Query.project}/${id}`);
    },
    post(payload: any) {
      return apiClient.post(Query.project, payload);
    },
    patch(id: string, payload: any) {
      return apiClient.patch(`${Query.project}/${id}`, payload);
    },
    delete(id: string) {
      return apiClient.delete(`${Query.project}/${id}`);
    },
  },
  admin: {
    list: (filterString = "") => {
      return apiClient.get(`${Query.admin}?${filterString}`);
    },
    get(id: string) {
      return apiClient.get(`${Query.admin}/${id}`);
    },
    post(payload: any) {
      return apiClient.post(Query.admin, payload);
    },
    patch(id: string, payload: any) {
      return apiClient.patch(`${Query.admin}/${id}`, payload);
    },
    delete(id: string) {
      return apiClient.delete(`${Query.admin}/${id}`);
    },
    adminVendor(filterString?: string) {
      return apiClient.get(`${Query.adminVendor}/${filterString}`);
    },
    adminSignOut(payload?: any, options?: AxiosRequestConfig<any>) {
      return apiClient.post(Query.adminSignOut, payload, options);
    },
  },
  projectDoc: {
    get(project_id: string) {
      return apiClient.get(`${Query.projectDocument}/${project_id}`);
    },
    post(payload: any) {
      return apiClient.post(Query.projectDocument, payload);
    },
    delete(id: string) {
      return apiClient.delete(`${Query.projectDocument}/${id}`);
    },
  },
  values: {
    list(filterString = "") {
      return apiClient.get(`${Query.lookupValue}?${filterString}`);
    },
    get(id: string) {
      return apiClient.get(`${Query.lookupValue}/${id}`);
    },
    post(payload: any) {
      return apiClient.post(Query.lookupValue, payload);
    },
    patch(id: string, payload: any) {
      return apiClient.patch(`${Query.lookupValue}/${id}`, payload);
    },
    delete(id: string) {
      return apiClient.delete(`${Query.lookupValue}/${id}`);
    },
    lookup(filterString = "") {
      return apiClient.get(`${Query.valueLookup}?${filterString}`);
    },
    cities(filterString = "") {
      return apiClient.get(`${Query.cityLookup}?${filterString}`);
    },
    allCitiesList() {
      return apiClient.get(Query.cityNameList);
    },
    stateList(filterString = "") {
      return apiClient.get(`${Query.state}?${filterString}`);
    },
    cityList(filterString = "") {
      return apiClient.get(`${Query.city}?${filterString}`);
    },
  },
  category: {
    list(filterString = "") {
      return apiClient.get(`${Query.lookupCategory}?${filterString}`);
    },
    get(id: string) {
      return apiClient.get(`${Query.lookupCategory}/${id}`);
    },
    post(payload: any) {
      return apiClient.post(Query.lookupCategory, payload);
    },
    patch(id: string, payload: any) {
      return apiClient.patch(`${Query.lookupCategory}/${id}`, payload);
    },
    delete(id: string) {
      return apiClient.delete(`${Query.lookupCategory}/${id}`);
    },
    lookup(filterString = "") {
      return apiClient.get(`${Query.categoryLookup}?${filterString}`);
    },
    adminCategoryLookup(filterString = "") {
      return apiClient.get(`${Query.adminCategoryLookup}?${filterString}`);
    },
    cities(filterString = "") {
      return apiClient.get(`${Query.lookupCategory}?${filterString}`);
    },
    getCategoryWiseVendorList(filterString = "") {
      return apiClient.get(`${Query.categoryWiseVendorList}?${filterString}`);
    },
  },
  planRule: {
    lookup(filterString = "") {
      return apiClient.get(`${Query.planRuleLookup}?${filterString}`);
    },

    list: (filterString = "") => {
      return apiClient.get(`${Query.planRule}?${filterString}`);
    },
    get(id: string) {
      return apiClient.get(`${Query.planRule}/${id}`);
    },
    post(payload: any) {
      return apiClient.post(Query.planRule, payload);
    },
    patch(id: string, payload: any) {
      return apiClient.patch(`${Query.planRule}/${id}`, payload);
    },
    delete(id: string) {
      return apiClient.delete(`${Query.planRule}/${id}`);
    },
    getPrice(filterString = "") {
      return apiClient.get(`${Query.planRulePrice}?${filterString}`);
    },
  },
  planFeatures: {
    list(filterString = "") {
      return apiClient.get(`${Query.planFeature}?${filterString}`);
    },
  },
  eventType: {
    list(filterString = "") {
      return apiClient.get(`${Query.eventType}?${filterString}`);
    },
    get(id: string) {
      return apiClient.get(`${Query.eventType}/${id}`);
    },
    post(payload: any) {
      return apiClient.post(Query.eventType, payload);
    },
    patch(id: string, payload: any) {
      return apiClient.patch(`${Query.eventType}/${id}`, payload);
    },
    delete(id: string) {
      return apiClient.delete(`${Query.eventType}/${id}`);
    },
    lookup(filterString = "") {
      return apiClient.get(`${Query.eventTypeLookup}?${filterString}`);
    },
    eventVenueLookup(filterString = "") {
      return apiClient.get(`${Query.eventVenueLookup}?${filterString}`);
    },
    eventVerticalAndEventType(filterString = "") {
      return apiClient.get(
        `${Query.eventVerticalAndEventType}?${filterString}`,
      );
    },
    eventTypeWiseSubCategory(filterString = "") {
      return apiClient.get(`${Query.eventTypeWiseSubCategory}?${filterString}`);
    },
    eventCategoryWiseVendor(filterString = "") {
      return apiClient.get(
        `${Query.eventCategoryWiseVendorList}?${filterString}`,
      );
    },
    excel: (filterString = "") => {
      return apiClient.get(`${Query.eventType}-excel?${filterString}`);
    },
  },
  eventVertical: {
    list(filterString = "") {
      return apiClient.get(`${Query.eventVertical}?${filterString}`);
    },
    get(id: string) {
      return apiClient.get(`${Query.eventVertical}/${id}`);
    },
    post(payload: any) {
      return apiClient.post(Query.eventVertical, payload);
    },
    patch(id: string, payload: any) {
      return apiClient.patch(`${Query.eventVertical}/${id}`, payload);
    },
    delete(id: string) {
      return apiClient.delete(`${Query.eventVertical}/${id}`);
    },
    lookup(filterString = "") {
      return apiClient.get(`${Query.eventVerticalLookup}?${filterString}`);
    },
    excel: (filterString = "") => {
      return apiClient.get(`${Query.eventVertical}-excel?${filterString}`);
    },
  },
  businessCategory: {
    list(filterString = "") {
      return apiClient.get(`${Query.businessCategory}?${filterString}`);
    },
    get(id: string) {
      return apiClient.get(`${Query.businessCategory}/${id}`);
    },
    post(payload: any) {
      return apiClient.post(Query.businessCategory, payload);
    },
    patch(id: string, payload: any) {
      return apiClient.patch(`${Query.businessCategory}/${id}`, payload);
    },
    delete(id: string) {
      return apiClient.delete(`${Query.businessCategory}/${id}`);
    },
    lookup(filterString = "") {
      return apiClient.get(`${Query.businessCategoryLookup}?${filterString}`);
    },
    categoryList: () => {
      return apiClient.get(Query.categoryList);
    },
    excel: (filterString = "") => {
      return apiClient.get(`${Query.businessCategory}-excel?${filterString}`);
    },
  },
  businessSubCategory: {
    list(filterString = "") {
      return apiClient.get(`${Query.businessSubCategory}?${filterString}`);
    },
    get(id: string) {
      return apiClient.get(`${Query.businessSubCategory}/${id}`);
    },
    post(payload: any) {
      return apiClient.post(Query.businessSubCategory, payload);
    },
    patch(id: string, payload: any) {
      return apiClient.patch(`${Query.businessSubCategory}/${id}`, payload);
    },
    delete(id: string) {
      return apiClient.delete(`${Query.businessSubCategory}/${id}`);
    },
    lookup(filterString = "") {
      return apiClient.get(
        `${Query.businessSubCategoryLookup}?${filterString}`,
      );
    },
    getBusinessSubCategoryFilterList(filterString = "") {
      return apiClient.get(
        `${Query.businessSubCategoryFilterList}?${filterString}`,
      );
    },
    businessSubCategoryDetails(filterString = "") {
      return apiClient.get(
        `${Query.businessSubCategoryDetails}?${filterString}`,
      );
    },
    excel: (filterString = "") => {
      return apiClient.get(
        `${Query.businessSubCategory}-excel?${filterString}`,
      );
    },
  },
  chat: {
    list(filterString = "") {
      return apiClient.get(`${Query.chat}?${filterString}`);
    },
    post(payload: any) {
      return apiClient.post(Query.chat, payload);
    },
    search(filterString = "") {
      return apiClient.get(`${Query.chatSearch}?${filterString}`);
    },
  },
  chatMessage: {
    list(chat_id: string, filterString = "") {
      return apiClient.get(`${Query.chatMessage}/${chat_id}?${filterString}`);
    },
    post(payload: any) {
      return apiClient.post(Query.chatMessage, payload);
    },
  },
  faq: {
    list: (filterString = "") => {
      return apiClient.get(`${Query.faq}?${filterString}`);
    },
    get: (id: string) => {
      return apiClient.get(`${Query.faq}/${id}`);
    },
    post: (payload: any) => {
      return apiClient.post(Query.faq, payload);
    },
    patch: (id: string, payload: any) => {
      return apiClient.patch(`${Query.faq}/${id}`, payload);
    },
    delete: (id: string) => {
      return apiClient.delete(`${Query.faq}/${id}`);
    },
  },
  review: {
    reviewsListWithPagination: (filterString: string) => {
      return apiClient.get(`${Query.review}/list?${filterString}`);
    },
    list: (filterString = "") => {
      return apiClient.get(`${Query.review}?${filterString}`);
    },
    post: (payload: any) => {
      return apiClient.post(Query.review, payload);
    },
    patch: (id: string, payload: any) => {
      return apiClient.patch(`${Query.review}/${id}`, payload);
    },
    delete: (id: string) => {
      return apiClient.delete(`${Query.review}/${id}`);
    },
  },
  reviewComment: {
    list: (review_id: string, filterString = "") => {
      return apiClient.get(
        `${Query.reviewComment}/${review_id}?${filterString}`,
      );
    },
    post: (payload: any) => {
      return apiClient.post(Query.reviewComment, payload);
    },
    patch: (id: string, payload: any) => {
      return apiClient.patch(`${Query.reviewComment}/${id}`, payload);
    },
    delete: (id: string) => {
      return apiClient.delete(`${Query.reviewComment}/${id}`);
    },
  },
  brochure: {
    post: (payload: any) => {
      return apiClient.post(Query.brochure, payload);
    },
    get: (vendor_id: string) => {
      return apiClient.get(`${Query.brochure}/${vendor_id}`);
    },
    delete: (id: string) => {
      return apiClient.delete(`${Query.brochure}/${id}`);
    },
  },
  heroBanner: {
    post: (payload: any) => {
      return apiClient.post(Query.heroBanner, payload);
    },
    patch: (id: string, payload: any) => {
      return apiClient.patch(`${Query.heroBanner}/${id}`, payload);
    },
    get: (vendor_id: string) => {
      return apiClient.get(`${Query.heroBanner}/${vendor_id}`);
    },
    delete: (id: string) => {
      return apiClient.delete(`${Query.heroBanner}/${id}`);
    },
    deleteCover: (id: string, filterString: string) => {
      return apiClient.delete(`${Query.heroBannerCover}/${id}?${filterString}`);
    },
  },
  b2bCommunity: {
    list(filterString = "") {
      return apiClient.get(`${Query.b2bCommunity}?${filterString}`);
    },
    post(payload: any) {
      return apiClient.post(Query.b2bCommunity, payload);
    },
  },
  keyword: {
    get: (vendor_id: string) => {
      return apiClient.get(`${Query.keyword}/${vendor_id}`);
    },
    post(payload: any) {
      return apiClient.post(Query.keyword, payload);
    },
    lookup() {
      return apiClient.get(Query.keywordLookup);
    },
  },
  aboutUs: {
    get: (vendor_id: string) => {
      return apiClient.get(`${Query.aboutUs}/${vendor_id}`);
    },
    post(payload: any) {
      return apiClient.post(Query.aboutUs, payload);
    },
  },
  inspirationReels: {
    list(filterString = "") {
      return apiClient.get(`${Query.inspirationReel}?${filterString}`);
    },
    get(id: string) {
      return apiClient.get(`${Query.inspirationReel}/${id}`);
    },
    post(payload: any) {
      return apiClient.post(Query.inspirationReel, payload);
    },
    patch(id: string, payload: any) {
      return apiClient.patch(`${Query.inspirationReel}/${id}`, payload);
    },
    delete(id: string) {
      return apiClient.delete(`${Query.inspirationReel}/${id}`);
    },
  },
  paymentPolicies: {
    get(id: string) {
      return apiClient.get(`${Query.paymentPolicy}/${id}`);
    },
    post(payload: any) {
      return apiClient.post(Query.paymentPolicy, payload);
    },
    patch(id: string, payload: any) {
      return apiClient.patch(`${Query.paymentPolicy}/${id}`, payload);
    },
  },
  dashboard: {
    profileCompletion() {
      return apiClient.get(Query.profileCompletion);
    },
  },
  vendorVertical: {
    post(payload: any) {
      return apiClient.post(Query.vendorVertical, payload);
    },
    patch(id: string, payload: any) {
      return apiClient.patch(`${Query.vendorVertical}/${id}`, payload);
    },
    delete(id: string) {
      return apiClient.delete(`${Query.vendorVertical}/${id}`);
    },
    cityGet(id: string) {
      return apiClient.get(`/vendor-wise-city/${id}`);
    },
  },
  razorpay: {
    createOrderID(payload: any) {
      return apiClient.post(Query.orderId, payload);
    },
    verifyPayment(payload: any) {
      return apiClient.post(Query.verifyPayment, payload);
    },
    updateSubscription(payload: any) {
      return apiClient.post(Query.updateSubscription, payload);
    },
    customerCreateOrderID(payload: any) {
      return apiClient.post(Query.BazaarBuddyOrderId, payload);
    },
    customerVerifiy(payload: any) {
      return apiClient.post(Query.BazaarPaymentVerifyPayment, payload);
    },
  },
  couponCode: {
    get(id: string) {
      return apiClient.get(`${Query.coupon}/${id}`);
    },
    checkCoupon(filterString = "") {
      return apiClient.get(`${Query.checkCoupon}?${filterString}`);
    },
    post(payload: any) {
      return apiClient.post(Query.coupon, payload);
    },
    list: (filterString = "") => {
      return apiClient.get(`${Query.coupon}?${filterString}`);
    },
    patch(id: string, payload: any) {
      return apiClient.patch(`${Query.coupon}/${id}`, payload);
    },
    delete: (id: string) => {
      return apiClient.delete(`${Query.coupon}/${id}`);
    },
    excel: (filterString = "") => {
      return apiClient.get(`${Query.coupon}-excel?${filterString}`);
    },
  },
  city: {
    post: (payload: any) => {
      return apiClient.post(Query.city, payload);
    },
    list: (filterString = "") => {
      return apiClient.get(`${Query.cityList}?${filterString}`);
    },
    get(id: string) {
      return apiClient.get(`${Query.city}/${id}`);
    },
    delete: (id: string) => {
      return apiClient.delete(`${Query.city}/${id}`);
    },
    put: (id: string, payload: any) => {
      return apiClient.put(`${Query.city}/${id}`, payload);
    },
    lookup(filterString = "") {
      return apiClient.get(`${Query.cityLookup}?${filterString}`);
    },
    getDetails(filterString = "") {
      return apiClient.get(`${Query.cityDetails}?${filterString}`);
    },
    excel: (filterString = "") => {
      return apiClient.get(`${Query.city}-excel?${filterString}`);
    },
  },
  role: {
    lookup(filterString = "") {
      return apiClient.get(`${Query.roleLookup}?${filterString}`);
    },
  },
  plans: {
    get(id: string) {
      return apiClient.get(`${Query.plan}/${id}`);
    },
    post(payload: any) {
      return apiClient.post(Query.plan, payload);
    },
    list: (filterString = "") => {
      return apiClient.get(`${Query.plan}?${filterString}`);
    },
    patch(id: string, payload: any) {
      return apiClient.patch(`${Query.plan}/${id}`, payload);
    },
    delete(id: string) {
      return apiClient.delete(`${Query.plan}/${id}`);
    },
    lookup(filterString = "") {
      return apiClient.get(`${Query.planLookup}?${filterString}`);
    },
  },
  subscriptions: {
    list: (filterString = "") => {
      return apiClient.get(`${Query.subscription}?${filterString}`);
    },
    excel: (filterString = "") => {
      return apiClient.get(`${Query.subscription}-excel?${filterString}`);
    },
  },
  landing: {
    enquiryMail(payload: any) {
      return apiClient.post(Query.enquiryMail, payload);
    },
    verticalWiseVendor(filterString = "") {
      return apiClient.get(`${Query.verticalWiseVendor}?${filterString}`);
    },
  },
  common: {
    verifyOtp: (payload: any, options?: AxiosRequestConfig<any>) => {
      return apiClient.post(Query.verifyOtp, payload, options);
    },
    sendOtp: (payload: any, options?: AxiosRequestConfig<any>) => {
      return apiClient.post(Query.sendOtp, payload, options);
    },
    reSendOtp: (payload: any, options?: AxiosRequestConfig<any>) => {
      return apiClient.post(Query.resendOtp, payload, options);
    },
  },
  client: {
    customerSignUp: (payload: any) => {
      return apiClient.post(Query.customerSignup, payload);
    },
    customerSendOtp: (payload: any) => {
      return apiClient.post(Query.customerSendOtp, payload);
    },
    customerVerifyOtp: (payload: any) => {
      return apiClient.post(Query.customerVerifyOtp, payload);
    },
    customerReSendOtp: (payload: any) => {
      return apiClient.post(Query.customerResendOtp, payload);
    },
    customerLogin: (payload: any) => {
      return apiClient.post(Query.customerSignIn, payload);
    },
    categoryList: (filterString = "") => {
      return apiClient.get(`${Query.customerCategoryList}?${filterString}`);
    },
    subCategoryList: (filterString = "") => {
      return apiClient.get(`${Query.customerSubCategoryList}?${filterString}`);
    },
    customerSignout: (payload?: any, options?: AxiosRequestConfig<any>) => {
      return apiClient.post(Query.customerSignout, payload, options);
    },
    customerReview(payload?: any) {
      return apiClient.post(Query.review, payload);
    },
    customerLead(payload?: any) {
      return apiClient.post(Query.customerLead, payload);
    },
    vendorDetails(filterString: string) {
      return apiClient.get(`${Query.vendorDetails}?${filterString}`);
    },
    customerToggleLike(id: string, payload?: any) {
      return apiClient.put(`${Query.customerToggleLike}/${id}`, payload);
    },
    customerFavorite(filterString = "") {
      return apiClient.get(`${Query.customerFavorite}?${filterString}`);
    },
    artist() {
      return apiClient.get(Query.artist);
    },
  },
  enterprise: {
    list: (filterString = "") => {
      return apiClient.get(`${Query.enterprise}?${filterString}`);
    },
    excel: (filterString = "") => {
      return apiClient.get(`${Query.enterprise}-excel?${filterString}`);
    },
    get(filterString = "") {
      return apiClient.get(`${Query.enterprise}?${filterString}`);
    },
    post(payload?: any) {
      return apiClient.post(Query.enterprise, payload);
    },
    updateStatus(id: string) {
      return apiClient.patch(`${Query.enterprise}/${id}`);
    },
    delete(id: string, payload: any) {
      return apiClient.post(`${Query.enterprise}/${id}`, payload);
    },
    enterpriseSubscription: (payload: any) => {
      return apiClient.post(Query.enterpriseSubscription, payload);
    },
  },
  requestQuote: {
    list: (filterString = "") => {
      return apiClient.get(`${Query.requestQuote}?${filterString}`);
    },
    excel: (filterString = "") => {
      return apiClient.get(`${Query.requestQuote}-excel?${filterString}`);
    },
    post(payload?: any) {
      return apiClient.post(Query.requestQuote, payload);
    },
    lookup(filterString = "") {
      return apiClient.get(`${Query.eventVenueLookup}?${filterString}`);
    },
  },
  vendorsMenu: {
    get() {
      return apiClient.get(Query.vendorsMenu);
    },
  },
  educationalVideo: {
    list(filterString = "") {
      return apiClient.get(`${Query.educationalVideoList}?${filterString}`);
    },
    get(id: string) {
      return apiClient.get(`${Query.educationalVideo}/${id}`);
    },
    post(payload?: any) {
      return apiClient.post(Query.educationalVideo, payload);
    },
    patch(id: string, payload: any) {
      return apiClient.patch(`${Query.educationalVideo}/${id}`, payload);
    },
  },
  trendGallery: {
    list(filterString = "") {
      return apiClient.get(`${Query.trendGallery}?${filterString}`);
    },
    filterList(filterString = "") {
      return apiClient.get(`${Query.trendGalleryFilter}?${filterString}`);
    },
  },
  artist: {
    list(filterString = "") {
      return apiClient.get(`${Query.artist}?${filterString}`);
    },
    get(id: string) {
      return apiClient.get(`${Query.artist}/${id}`);
    },
    delete(id: string) {
      return apiClient.delete(`${Query.artist}/${id}`);
    },
    post(payload: any) {
      return apiClient.post(`${Query.artist}-add`, payload);
    },
    patch(id: string, payload: any) {
      return apiClient.patch(`${Query.artist}/${id}`, payload);
    },
  },
  popularSearch: {
    list(filterString = "") {
      return apiClient.get(`${Query.popularSearch}?${filterString}`);
    },
    lookup() {
      return apiClient.get(`${Query.popularSearch}-lookup`);
    },
    get(id: string) {
      return apiClient.get(`${Query.popularSearch}/${id}`);
    },
    delete(id: string) {
      return apiClient.delete(`${Query.popularSearch}/${id}`);
    },
    patch(id: string, payload: any) {
      return apiClient.patch(`${Query.popularSearch}/${id}`, payload);
    },
    post(payload: any) {
      return apiClient.post(`${Query.popularSearch}`, payload);
    },
  },
  venue: {
    list: (filterString = "") => {
      return apiClient.get(`${Query.venue}?${filterString}`);
    },
    get: (id: string) => {
      return apiClient.get(`${Query.venue}/${id}`);
    },
    post: (payload: any) => {
      return apiClient.post(Query.venue, payload);
    },
    patch: (id: string, payload: any) => {
      return apiClient.patch(`${Query.venue}/${id}`, payload);
    },
    delete: (id: string) => {
      return apiClient.delete(`${Query.venue}/${id}`);
    },
  },
  customer: {
    list: (filterString = "") => {
      return apiClient.get(`${Query.customer}?${filterString}`);
    },
    excel: (filterString = "") => {
      return apiClient.get(`${Query.customer}-excel?${filterString}`);
    },
    get(id: string) {
      return apiClient.get(`${Query.customer}/${id}`);
    },
    post(payload: any) {
      return apiClient.post(Query.customer, payload);
    },
    patch(id: string, payload: any) {
      return apiClient.patch(`${Query.customer}/${id}`, payload);
    },
    delete(id: string) {
      return apiClient.delete(`${Query.customer}/${id}`);
    },
  },
  bazaarBuddyPlan: {
    list: (filterString = "") => {
      return apiClient.get(`${Query.bazaarBuddyPlan}?${filterString}`);
    },
    get: (id: string) => {
      return apiClient.get(`${Query.bazaarBuddyPlan}/${id}`);
    },
    post: (payload: any) => {
      return apiClient.post(Query.bazaarBuddyPlan, payload);
    },
    patch: (id: string, payload: any) => {
      return apiClient.patch(`${Query.bazaarBuddyPlan}/${id}`, payload);
    },
    delete: (id: string) => {
      return apiClient.delete(`${Query.bazaarBuddyPlan}/${id}`);
    },
    lookup: () => {
      return apiClient.get(`${Query.bazaarBuddyPlan}-lookup`);
    },
    subscriptionList: (filterString = "") => {
      return apiClient.get(`${Query.bazaarBuddySubscription}?${filterString}`);
    },
    excel: (filterString = "") => {
      return apiClient.get(
        `${Query.bazaarBuddySubscription}-excel?${filterString}`,
      );
    },
    planExcel: (filterString = "") => {
      return apiClient.get(`${Query.bazaarBuddyPlan}-excel?${filterString}`);
    },
  },
  bazaarBuddyConsultant: {
    post: (payload: any) => {
      return apiClient.post(Query.bazaarBuddyConsultant, payload);
    },
    list: (filterString = "") => {
      return apiClient.get(`${Query.bazaarBuddyConsultant}?${filterString}`);
    },
    excel: (filterString = "") => {
      return apiClient.get(
        `${Query.bazaarBuddyConsultant}-excel?${filterString}`,
      );
    },
    updateStatus: (id: string) => {
      return apiClient.put(`${Query.bazaarBuddyConsultant}-status/${id}`);
    },
  },
  webSiteReview: {
    list: (filterString = "") => {
      return apiClient.get(`${Query.webSiteReview}?${filterString}`);
    },
    post: (payload: any) => {
      return apiClient.post(`${Query.webSiteReview}-add`, payload);
    },
    patch: (id: string, payload: any) => {
      return apiClient.patch(`${Query.webSiteReview}/${id}`, payload);
    },
    delete: (id: string) => {
      return apiClient.delete(`${Query.webSiteReview}/${id}`);
    },
    get: (id: string) => {
      return apiClient.get(`${Query.webSiteReview}/${id}`);
    },
  },
  career: {
    post: (payload: any) => {
      return apiClient.post(`${Query.career}`, payload);
    },
  },
  eventLog: {
    list: (filterString = "") => {
      return apiClient.get(`${Query.requestLog}?${filterString}`);
    },
  },
  utils: {
    getIp: async () => {
      try {
        const { data } = await axios.get(Query.ipIfy);

        if (data) {
          Cookies.set("clientIP", encrypt(data?.ip));
        }
      } catch (error) {
        console.log(error);
      }
    },
    getMetaDetails: (filterString?: string) => {
      return apiClient.get(`${Query.metaLookup}?${filterString}`);
    },
  },
};
