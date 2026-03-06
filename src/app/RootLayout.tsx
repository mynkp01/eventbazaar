import CookieConsentBanner from "@components/CookieConsent";
import ReduxProvider from "@redux/store/ReduxProvider";
import "ckeditor5/ckeditor5.css";
import Script from "next/script";
import { Suspense } from "react";
import "react-toastify/dist/ReactToastify.css";
import ClientLayout, { Canonicals, ToastContainerComp } from "./ClientLayout";
import "./global.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* <!-- Google tag (gtag.js) --> */}
        <Script
          id="google-tag"
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-KZCZXJQKMK"
        />

        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KZCZXJQKMK');
            `}
        </Script>
        {/* <!-- End Google tag (gtag.js) --> */}

        {/* <!-- Google Tag Manager --> */}
        <Script id="google-tag-manager">
          {`
            (function(w,d,s,l,i){w[l] = w[l] || [];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MH5JDK92');
          `}
        </Script>
        {/* <!-- End Google Tag Manager --> */}

        {/* <!-- Meta Pixel Code --> */}
        {/* <Script id="meta-pixel-code-v2-1">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1625272824864739');
            fbq('track', 'PageView');
          `}
        </Script>

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1625272824864739&ev=PageView&noscript=1"
          />
        </noscript> */}
        {/* <!-- End Meta Pixel Code --> */}

        {/* <!-- Clarity code --> */}
        {/* <Script id="clarity-code-1" type="text/javascript">
          {`       
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "qu78ecu6po");
          `}
        </Script> */}
        {/* <!-- End Clarity code --> */}

        {/* <title>
          {metaTitle
            ? metaTitle
            : `EventBazaar.com - ${currentActive[1] === "" ? "Dashboard" : currentActive[1]?.charAt(0).toUpperCase() + currentActive[1]?.slice(1)} ${currentActive[2] && currentActive[2] !== "option" ? "- " + currentActive[2]?.charAt(0).toUpperCase() + currentActive[2]?.slice(1) : ""}`}
        </title>

        <meta name="description" content={metaDescription} /> */}
        <Suspense>
          <Canonicals />
        </Suspense>
        <meta
          name="facebook-domain-verification"
          content="8q3apfy4dsktriblijb5p6i93ruou3"
        />
        <meta name="robots" content="INDEX,FOLLOW" />
      </head>

      <body className="min-h-screen">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MH5JDK92"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        <ReduxProvider>
          <ToastContainerComp />
          <Script
            id="razorpay-checkout-js"
            src="https://checkout.razorpay.com/v1/checkout.js"
          />
          <ClientLayout>{children}</ClientLayout>
        </ReduxProvider>

        <Script type="text/javascript" id="whatsapp-widget">
          {`
            (function (w, d, s, o, f, js, fjs) {
              w[o] =
                w[o] ||
                function () {
                  (w[o].q = w[o].q || []).push(arguments);
                };
              (js = d.createElement(s)), (fjs = d.getElementsByTagName(s)[0]);
              js.id = o;
              js.src = f;
              js.async = 1;
              fjs.parentNode.insertBefore(js, fjs);
            })(window, document, "script", "dt", "https://d3r49s2alut4u1.cloudfront.net/js/widget.js");
            dt("init", {
              crmWidgetId: "325eb6dc-0900-4e26-9fcd-fcac11ad0159",
              companyName: "EventBazaar.com",
              companyLogoUrl: "",
              phoneNumber: "917069144777"
            });
          `}
        </Script>
        {/* <!-- End Whatsapp Widget Code --> */}

        {/* <!-- Zoho Code --> */}
        {/* <Script id="zoho-1">
          {`
            window.$zoho=window.$zoho || { };$zoho.salesiq=$zoho.salesiq||{ready:function(){ }}
          `}
        </Script>
        <Script
          id="zsiqscript"
          src="https://salesiq.zohopublic.in/widget?wc=siq7eb237f8f5e644ff6b3d813dcc1375981d8271c468e5509555deb95abfe8e09f"
          defer
        ></Script> */}
        {/* <!-- End Zoho Code --> */}
        <CookieConsentBanner />
      </body>
    </html>
  );
}
