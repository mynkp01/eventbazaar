"use client";

import { MAILS } from "src/utils/Constant";

const Page = () => {
  return (
    <>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <main className="rounded-lg bg-white p-6 shadow-sm sm:p-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Terms Of Service
          </h1>
          <p className="mb-4 font-bold">Last updated: 11 March, 2025</p>
          <p className="mb-4 text-gray-700">
            Welcome to <strong>EventBazaar.com</strong> (“Company,” “we,” “our,”
            or “us”). These Terms of Service (“Terms”) govern your access to and
            use of the EventBazaar.com platform, website, and services
            (collectively, the “Services”). Please read these Terms carefully.{" "}
            {/* <Link
              href="https://www.eventbazaar.com"
              className="text-blue-600 hover:text-blue-800"
            >
              www.eventbazaar.com
            </Link>{" "}
            (“Platform”), you agree to abide by these{" "}
            <Link
              href={ROUTES.termsConditions}
              className="text-blue-600 hover:text-blue-800"
            >
              Terms & Conditions
            </Link>
            . If you do not agree, you should refrain from using our services. */}
          </p>
          <p className="mb-6 text-gray-700">
            By accessing or using our Services, you agree to be bound by these
            Terms and our Privacy Policy. If you disagree with any part of the
            Terms, you may choose not to access the Services.
          </p>
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              1. DEFINITIONS:{" "}
              <span className="font-normal">In these Terms,</span>
            </h2>
            {/* <p className="mb-4 text-gray-700">
              The following terminology applies to these Terms of Use, the
              Privacy Policy, and Disclaimer Notice:
            </p>
            <p className="mb-4 text-gray-700">
              “User” refers to any individual or business entity accessing the
              Platform, including vendors and consumers.
            </p>
            <p className="mb-4 text-gray-700">
              “Vendor” refers to an event service provider registered on the
              Platform.
            </p>
            <p className="mb-4 text-gray-700">
              “Consumer” refers to an individual or entity using the Platform to
              hire a vendor.
            </p> */}

            <ul className="ml-10 list-disc space-y-1 text-gray-700">
              <li>
                <strong>“Platform”</strong> means the EventBazaar.com website,
                mobile applications, and all related services.
              </li>
              <li>
                <strong>“Consumer”</strong> means any individual or entity that
                uses the Platform to discover, communicate with, or hire
                vendors.
              </li>
              <li>
                <strong>“Vendor”</strong> means any business or individual that
                offers event-related services through the Platform.
              </li>
              <li>
                <strong>“User”</strong> means any individual who accesses or
                uses the Platform, including both Consumers and Vendors.
              </li>
              <li>
                <strong>“Content”</strong> means all information, text,
                graphics, photos, videos, data, or other materials uploaded,
                downloaded, or appearing on the Platform.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              2. ACCOUNT REGISTRATION:
            </h2>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>2.1.</strong>{" "}
              <p>
                <strong> Account Registration:</strong> To access certain
                features of the Platform, you must register for an account. You
                agree to provide accurate, current, and complete information
                during the registration process and to update such information
                to keep it accurate, current, and complete.
              </p>
            </p>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>2.2.</strong>{" "}
              <p>
                <strong> Account Types:</strong> The Platform supports two types
                of accounts:
              </p>
            </p>
            <div className="mb-4 ml-10 list-disc space-y-2 text-gray-700">
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>2.2.1.</strong>{" "}
                <p>
                  <strong> Consumer Account:</strong> Allows individuals to
                  browse vendors, communicate with vendors, and utilize the
                  Platforms services for event planning.
                </p>
              </p>
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>2.2.2.</strong>{" "}
                <p>
                  <strong> Vendor Account:</strong> Allows businesses to create
                  profiles, showcase their services, and connect with potential
                  clients.
                </p>
              </p>
            </div>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>2.3.</strong>{" "}
              <p>
                <strong> Account Security:</strong> You are responsible for
                safeguarding your password and for all activities that occur
                under your account. You agree to notify EventBazaar.com
                immediately of any unauthorized use of your account.
              </p>
            </p>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>2.4.</strong>{" "}
              <p>
                <strong> Public Information:</strong> Basic vendor information
                such as business name will be publicly visible without requiring
                login. However, detailed contact information and portfolios are
                only accessible to registered users. Vendors must ensure that
                their profiles and service listings are truthful and do not
                contain misleading information.
              </p>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              3. VENDOR SUBSCRIPTION MODEL
            </h2>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>3.1.</strong>{" "}
              <p>
                <strong> Subscription Terms:</strong> Vendors must subscribe to
                list their services on the Platform. Subscription options
                include:
              </p>
            </p>
            <div className="mb-4 ml-10 list-disc space-y-2 text-gray-700">
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>3.1.1.</strong> <p>Monthly subscription</p>
              </p>
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>3.1.2.</strong> <p>Yearly subscription</p>
              </p>
            </div>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>3.2.</strong>{" "}
              <p>
                <strong> Payments:</strong> All payments are processed through
                Razorpay, our third-party payment gateway. By using our
                Services, you agree to be bound by Razorpays terms of service.
              </p>
            </p>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>3.3.</strong>{" "}
              <p>
                <strong> Cancellation Policy:</strong> Vendors may cancel their
                subscription at any time with a minimum of 72 hours notice
                before the renewal date. To cancel, vendors must follow the
                cancellation procedure specified in their account settings.
              </p>
            </p>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>3.4.</strong>
              <p>
                <strong>
                  Refund Policy: ONCE SUBSCRIPTION FEES ARE PAID, NO REFUNDS
                  WILL BE ISSUED UNDER ANY CIRCUMSTANCES.{" "}
                </strong>
                This policy applies regardless of the reason for cancellation.
              </p>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              4. PLATFORM USAGE
            </h2>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>4.1.</strong>{" "}
              <p>
                <strong> Consumer Obligations:</strong> As a Consumer, you agree
                to:
              </p>
            </p>
            <div className="mb-4 ml-10 list-disc space-y-2 text-gray-700">
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>4.1.1.</strong> Provide accurate information about your
                event requirements.
              </p>
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>4.1.2.</strong> Communicate respectfully with Vendors.
              </p>
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>4.1.3.</strong> Fulfil any contractual obligations
                entered into with Vendors through the Platform.
              </p>
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>4.1.4.</strong> Leave honest and fair reviews based on
                actual experiences.
              </p>
            </div>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>4.2.</strong>{" "}
              <p>
                <strong> Vendor Obligations:</strong> As a Vendor, you agree to:
              </p>
            </p>
            <div className="mb-4 ml-10 list-disc space-y-2 text-gray-700">
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>4.2.1.</strong> Provide accurate information about your
                services, experience, and capabilities
              </p>
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>4.2.2.</strong> Honor price quotes and service
                descriptions provided through the Platform
              </p>
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>4.2.3.</strong> Maintain required business licenses,
                permits, and insurance as required by applicable laws.
              </p>
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>4.2.4.</strong> Comply with all tax obligations
                including GST requirements.
              </p>
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>4.2.5. </strong> Deliver services as promised or provide
                appropriate notice if circumstances change.
              </p>
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>4.2.6.</strong> Respond to Consumer inquiries within a
                reasonable timeframes.
              </p>
            </div>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>4.3.</strong>{" "}
              <p>
                <strong> Prohibited Activities:</strong> You agree not to:
              </p>
            </p>
            <div className="mb-4 ml-10 list-disc space-y-2 text-gray-700">
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>4.3.1.</strong> Circumvent the Platform for personal
                gains.
              </p>
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>4.3.2.</strong> Create fake accounts or impersonate
                others.
              </p>
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>4.3.3.</strong> Post false, misleading, or deceptive
                content.
              </p>
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>4.3.4.</strong> Harvest or collect user information
                without permission.
              </p>
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>4.3.5.</strong> Use the Platform for any illegal
                purpose.
              </p>
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>4.3.6.</strong> Attempt to gain unauthorized access to
                the Platform or other Users’ accounts.
              </p>
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>4.3.7.</strong> Post content that is offensive, harmful,
                or violates others’ rights.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              5. CONTENT & INTELLECTUAL PROPERTY
            </h2>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>5.1.</strong>{" "}
              <p>
                <strong> Platform Intellectual Property:</strong> The style,
                format, design, and functionality of the Platform are the
                proprietary intellectual property of EventBazaar.com. Users are
                prohibited from copying, modifying, or creating derivative works
                of the Platforms distinctive elements.
              </p>
            </p>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>5.2.</strong>{" "}
              <p>
                <strong> User-Generated Content:</strong> By uploading Content
                to the Platform, you grant EventBazaar.com a non-exclusive,
                worldwide, royalty-free license to use, reproduce, modify,
                adapt, publish, and display such Content for the purposes of
                providing and promoting the Services.
              </p>
            </p>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>5.3.</strong>{" "}
              <p>
                <strong> Vendor Content License:</strong> By uploading photos,
                videos, and other promotional materials, Vendors specifically
                grant EventBazaar.com the right to use such Content for
                marketing and promotional purposes without additional
                compensation or permission.
              </p>
            </p>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>5.4.</strong>{" "}
              <p>
                <strong> Content Restrictions:</strong> You must not upload
                Content that
              </p>
            </p>
            <div className="mb-4 ml-10 list-disc space-y-2 text-gray-700">
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>5.4.1.</strong> Infringes on intellectual property
                rights of others.
              </p>
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>5.4.2.</strong> Contains false, defamatory, or
                misleading information.
              </p>
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>5.4.3.</strong> Violates privacy rights of others.
              </p>
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>5.4.4.</strong> Contains malicious code or links.
              </p>
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>5.4.5.</strong> Constitutes spam or unauthorized
                commercial communications.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              6. REVIEWS & RATINGS
            </h2>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>6.1.</strong>{" "}
              <p>
                <strong> Review Guidelines:</strong> Consumers may leave reviews
                and ratings for Vendors based on genuine experiences. Reviews
                must:
              </p>
            </p>
            <div className="mb-4 ml-10 list-disc space-y-2 text-gray-700">
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>6.1.1.</strong> Be truthful and based on actual
                experiences.
              </p>
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>6.1.2.</strong> Focus on the quality of service
                provided.
              </p>
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>6.1.3.</strong> Not contain offensive, abusive, or
                inappropriate language.
              </p>
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>6.1.4.</strong> Not include personal identifiable
                information about the Vendor beyond what is already public.
              </p>
            </div>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>6.2.</strong>{" "}
              <p>
                <strong> Review Moderation:</strong> EventBazaar.com reserves
                the right to remove reviews that violate these Terms without
                notice. We may, at our discretion, investigate reviews that are
                reported as false or defamatory.
              </p>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              7. VENDOR OBLIGATIONS
            </h2>
            <ul className="ml-10 list-disc space-y-1 text-gray-700">
              <li>
                Vendors must ensure compliance with all applicable laws and
                regulations within the Country of India.
              </li>
              <li>
                Vendors must deliver services as advertised and are responsible
                for any disputes arising from their engagements with Consumers.
              </li>
              <li>
                Vendors must represent their services clearly and only to the
                scope of their actual services without misrepresenting their
                profiles and misleading the Consumers.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              8. LIMITATION OF LIABILITY
            </h2>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>8.1.</strong>{" "}
              <p>
                <strong> Platform role:</strong> EventBazaar.com is an
                aggregator and facilitator only. We connect Consumers with
                Vendors but are not a party to any agreements between them. We
                do not guarantee the quality, safety, or legality of any Vendor
                services.
              </p>
            </p>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>8.2.</strong>{" "}
              <p>
                <strong> Dispute Resolution between users:</strong> Any disputes
                between Consumers and Vendors must be resolved directly between
                the parties involved. EventBazaar.com will not mediate or
                resolve such disputes except in cases involving alleged
                violations of these Terms.
              </p>
            </p>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>8.3.</strong>{" "}
              <p>
                <strong> Accuracy of Information:</strong> While EventBazaar.com
                takes measures to ensure information on the Platform is
                accurate, we cannot guarantee the accuracy, reliability, or
                completeness of all Content. EventBazaar.com will investigate
                reports of false advertising or misrepresentation and may
                suspend or terminate accounts found to be in violation.
              </p>
            </p>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>8.4.</strong>{" "}
              <p>
                <strong> Service Availability:</strong> The Platform is provided
                on an “as is” and “as available” basis. We do not guarantee that
                the Platform will be uninterrupted, timely, secure, or
                error-free.
              </p>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              9. TERMINATION
            </h2>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>9.1.</strong>{" "}
              <p>
                <strong> Termination by EventBazaar.com:</strong>{" "}
                EventBazaar.com reserves the right to suspend or terminate your
                account at any time for violations of these Terms or for any
                other reason at our sole discretion.
              </p>
            </p>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>9.2.</strong>{" "}
              <p>
                <strong> Termination by User:</strong> You may terminate your
                account at any time by following the procedures specified in
                your account settings.
              </p>
            </p>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>9.3.</strong>{" "}
              <p>
                <strong> Effect of Termination:</strong> Upon termination, your
                right to access and use the Platform will immediately cease. All
                provisions of these Terms which by their nature should survive
                termination shall survive, including ownership provisions,
                warranty disclaimers, and limitations of liability.
              </p>
            </p>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>9.4.</strong>{" "}
              <p>
                <strong> Data Retention:</strong> Following account termination,
                your data will be retained for a period of 1 year and then
                permanently deleted.
              </p>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              10 DISPUTE RESOLUTION
            </h2>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>10.1.</strong>{" "}
              <p>
                <strong> Governing Law:</strong> These Terms shall be governed
                by and construed in accordance with the laws of India, without
                regard to its conflict of law provisions.
              </p>
            </p>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>10.2.</strong>{" "}
              <p>
                <strong> Informal Resolution:</strong> Prior to initiating any
                formal legal proceeding, parties agree to attempt to resolve any
                disputes through good faith negotiations or mediation.
              </p>
            </p>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>10.3.</strong>{" "}
              <p>
                <strong> Formal Resolution:</strong> If a dispute cannot be
                resolved informally, it shall be resolved exclusively through
                the courts of Ahmedabad, Gujarat, India.
              </p>
            </p>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>10.4.</strong>{" "}
              <p>
                <strong> Process for Platform Complaints:</strong> For
                complaints regarding the Platform or other users:
              </p>
            </p>
            <div className="mb-4 ml-10 list-disc space-y-2 text-gray-700">
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>10.4.1.</strong> An internal team appointed by Event
                Bazaar will investigate the claim.
              </p>
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>10.4.2.</strong> The matter will first be attempted to
                be resolved through amicable mediation.
              </p>
              <p className="mb-4 flex gap-2 text-gray-700">
                <strong>10.4.3.</strong> If the grievance persists, the matter
                may be taken to a consumer forum or applicable civil courts in
                Ahmedabad, Gujarat.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              11 CHANGES TO TERMS:
            </h2>
            <p className="mb-4 text-gray-700">
              EventBazaar.com reserves the right to modify these Terms at any
              time. We will provide notice of significant changes through the
              Platform or by sending an email to the address associated with
              your account. Your continued use of the Platform after such
              modifications constitutes your acceptance of the revised Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              12 MISCELLANEOUS
            </h2>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>12.1.</strong>{" "}
              <p>
                <strong> Entire Agreement:</strong> These Terms constitute the
                entire agreement between you and EventBazaar.com regarding the
                use of the Services, superseding any prior agreements.
              </p>
            </p>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>12.2.</strong>{" "}
              <p>
                <strong> Severability:</strong> If any provision of these Terms
                is found to be unenforceable, the remaining provisions will
                remain in full force and effect.
              </p>
            </p>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>12.3.</strong>{" "}
              <p>
                <strong> Waiver:</strong> The failure of EventBazaar.com to
                enforce any right or provision of these Terms will not be deemed
                a waiver of such right or provision.
              </p>
            </p>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>12.4.</strong>{" "}
              <p>
                <strong> Contact Information:</strong> For questions about these
                Terms, please contact us at{" "}
                <a
                  className="text-blue-300"
                  href={`mailto:${MAILS.SUPPORT_MAIL}`}
                >
                  {MAILS.SUPPORT_MAIL}
                </a>
              </p>
            </p>
          </section>
        </main>
      </div>
    </>
  );
};

export default Page;
