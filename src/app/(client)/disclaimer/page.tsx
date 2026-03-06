"use client";

import { MAILS } from "src/utils/Constant";

const Page = () => {
  return (
    <>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <main className="rounded-lg bg-white p-6 shadow-sm sm:p-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Disclaimer
          </h1>

          <p className="mb-6 text-gray-600">
            <strong>Last updated: 11 March, 2025</strong>
          </p>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              GENERAL DISCLAIMER
            </h2>
            <p className="mb-4 flex gap-2 text-gray-700">
              The information provided on EventBazaar.com (“Platform”) is for
              general informational purposes only. All information on the
              Platform is provided in good faith, however, we make no
              representation or warranty of any kind, express or implied,
              regarding the accuracy, adequacy, validity, reliability,
              availability, or completeness of any information on the Platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              PLATFORM AS A SERVICE DISCLAIMER
            </h2>
            <p className="mb-4 flex gap-2 text-gray-700">
              EventBazaar.com operates as a Platform-as-a-Service connecting
              Consumers with Vendors. We do not:
            </p>
            <ul className="mb-4 ml-10 list-disc space-y-2 text-gray-700">
              <li>Provide event services directly</li>
              <li>Guarantee the accuracy of Vendor information</li>
              <li>Act as an agent for either Consumers or Vendors</li>
              <li>
                Become a party to any contract between Consumers and Vendors
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              EXTERNAL LINKS DISCLAIMER
            </h2>
            <p className="mb-4 flex gap-2 text-gray-700">
              The Platform may contain links to external websites that are not
              provided or maintained by or in any way affiliated with Event
              Bazaar. Please note that we do not guarantee the accuracy,
              relevance, timeliness, or completeness of any information on these
              external websites.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              PROFESSIONAL DISCLAIMER
            </h2>
            <p className="mb-4 flex gap-2 text-gray-700">
              The information provided by Vendors on the Platform should not be
              construed as professional advice. Always seek the advice of
              qualified professionals regarding specific event planning needs.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              COOKIE POLICY DISCLAIMER
            </h2>
            <p className="mb-4 flex gap-2 text-gray-700">
              When accessing EventBazaar.com, you will be presented with a
              choice to either accept all cookies or reject all cookies. This
              binary choice ensures transparency in our data collection
              practices. If you choose to accept cookies, you acknowledge that
              your browsing activity and preferences may be tracked to enhance
              your user experience.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              LIMITATION OF LIABILITY
            </h2>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, WE EXCLUDE
                ALL REPRESENTATIONS, WARRANTIES, AND CONDITIONS RELATING TO OUR
                PLATFORM AND YOUR USE OF THIS PLATFORM. NOTHING IN THIS
                DISCLAIMER WILL:
              </strong>
            </p>
            <ul className="mb-4 ml-10 list-disc space-y-2 text-gray-700">
              <li>
                <strong>
                  LIMIT OR EXCLUDE OUR LIABILITY FOR DEATH OR PERSONAL INJURY;
                </strong>
              </li>
              <li>
                <strong>
                  LIMIT OR EXCLUDE OUR LIABILITY FOR FRAUD OR FRAUDULENT
                  MISREPRESENTATION;
                </strong>
              </li>
              <li>
                <strong>
                  LIMIT ANY OF OUR LIABILITIES IN ANY WAY THAT IS NOT PERMITTED
                  UNDER APPLICABLE LAW; OR
                </strong>
              </li>
              <li>
                <strong>
                  EXCLUDE ANY OF OUR LIABILITIES THAT MAY NOT BE EXCLUDED UNDER
                  APPLICABLE LAW.
                </strong>
              </li>
            </ul>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>
                THE LIMITATIONS AND PROHIBITIONS OF LIABILITY SET FORTH IN THIS
                DISCLAIMER: (A) ARE SUBJECT TO THE PRECEDING PARAGRAPH; AND (B)
                GOVERN ALL LIABILITIES ARISING UNDER THE DISCLAIMER, INCLUDING
                LIABILITIES ARISING IN CONTRACT, IN TORT, AND FOR BREACH OF
                STATUTORY DUTY.
              </strong>
            </p>
            <p className="mb-4 flex gap-2 text-gray-700">
              <strong>
                AS LONG AS THE PLATFORM AND THE INFORMATION AND SERVICES ON THE
                PLATFORM ARE PROVIDED FREE OF CHARGE TO CONSUMERS, WE WILL NOT
                BE LIABLE FOR ANY LOSS OR DAMAGE OF ANY NATURE.
              </strong>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              INDEMNIFICATION
            </h2>
            <p className="mb-4 flex gap-2 text-gray-700">
              You agree to indemnify, defend, and hold harmless EventBazaar.com,
              its officers, directors, employees, agents, and third parties from
              and against all losses, expenses, damages, and costs, including
              reasonable attorneys fees, resulting from any violation of these
              terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              CONTACT US
            </h2>
            <p className="mb-4 flex gap-2 text-gray-700">
              If you have any questions about this Disclaimer, please contact us
              at
              <a className="text-blue-300" href={`mailto:${MAILS.INFO_MAIL}`}>
                {MAILS.INFO_MAIL}
              </a>
            </p>
          </section>
        </main>
      </div>
    </>
  );
};

export default Page;
