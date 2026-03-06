"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CookieConsent, { Cookies } from "react-cookie-consent";

const CookieConsentBanner = () => {
  const [showOptions, setShowOptions] = useState(false);
  const router = useRouter();

  // Cookie categories and their default state
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Always true and cannot be changed
    analytics: true,
    marketing: true,
  });

  // Handler for individual cookie category changes
  const handleCookieCategoryChange = (category) => {
    setCookiePreferences({
      ...cookiePreferences,
      [category]: !cookiePreferences[category],
    });
  };

  // Handler for when user accepts all cookies
  const handleAcceptAll = () => {
    // Set all cookie types to true
    setCookiePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
    });

    // Save preferences to cookies
    Cookies.set("cookieConsent", "accepted_all", { expires: 365 });
    Cookies.set(
      "cookiePreferences",
      JSON.stringify({
        necessary: true,
        analytics: true,
        marketing: true,
      }),
      { expires: 365 },
    );

    // Apply cookie choices (here you would activate your analytics/marketing scripts)
    applyPreferences({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  };

  // Handler for saving current preferences
  const handleSavePreferences = () => {
    // Save current preferences to cookies
    Cookies.set("cookieConsent", "custom", { expires: 365 });
    Cookies.set("cookiePreferences", JSON.stringify(cookiePreferences), {
      expires: 365,
    });

    // Apply the preferences
    applyPreferences(cookiePreferences);
  };

  // Handler for rejecting all optional cookies
  const handleRejectAll = () => {
    const preferences = {
      necessary: true, // Necessary cookies are always accepted
      analytics: false,
      marketing: false,
    };

    setCookiePreferences(preferences);
    Cookies.set("cookieConsent", "rejected_all", { expires: 365 });
    Cookies.set("cookiePreferences", JSON.stringify(preferences), {
      expires: 365,
    });

    // Apply preferences (only necessary cookies)
    applyPreferences(preferences);
  };

  // Function to actually apply the cookie preferences by activating/deactivating scripts
  const applyPreferences = (preferences) => {
    // Here you would implement the logic to enable/disable different scripts based on user preferences

    // Example - Analytics (like Google Analytics)
    if (preferences.analytics) {
      // Enable analytics scripts
      console.log("Analytics cookies enabled");
      // window.gtag = ...
    } else {
      // Disable analytics cookies
      console.log("Analytics cookies disabled");
      // Delete analytics cookies if they exist
    }

    // Example - Marketing cookies
    if (preferences.marketing) {
      // Enable marketing scripts (like Facebook Pixel)
      console.log("Marketing cookies enabled");
      // window.fbq = ...
    } else {
      // Disable marketing cookies
      console.log("Marketing cookies disabled");
      // Delete marketing cookies if they exist
    }
  };

  return (
    <>
      <CookieConsent
        location="bottom"
        buttonText={showOptions ? "Save Preferences" : "Accept All"}
        declineButtonText={showOptions ? "Cancel" : "Reject All"}
        enableDeclineButton
        onAccept={showOptions ? handleSavePreferences : handleAcceptAll}
        onDecline={showOptions ? () => setShowOptions(false) : handleRejectAll}
        style={{ background: "#2B373B", maxHeight: 400 }}
        buttonStyle={{
          background: "#4e503b",
          color: "white",
          fontSize: "13px",
          borderRadius: "3px",
          padding: "8px 16px",
        }}
        declineButtonStyle={{
          background: "transparent",
          border: "1px solid white",
          color: "white",
          fontSize: "13px",
          borderRadius: "3px",
          padding: "8px 16px",
        }}
        expires={365}
      >
        {!showOptions ? (
          <>
            <p>
              This website uses cookies to enhance your experience. By
              continuing to visit this site you agree to our use of cookies.
            </p>
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowOptions(true);
              }}
              style={{
                background: "transparent",
                border: "none",
                textDecoration: "underline",
                color: "white",
                cursor: "pointer",
                marginTop: "10px",
                padding: "0",
              }}
            >
              Customize Preferences
            </button>
          </>
        ) : (
          <div>
            <h3 style={{ marginTop: "0" }}>Cookie Preferences</h3>
            <div style={{ marginBottom: "10px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <input
                  type="checkbox"
                  checked={cookiePreferences.necessary}
                  disabled={true} // Necessary cookies cannot be disabled
                  style={{ marginRight: "8px" }}
                />
                <div>
                  <strong>Necessary Cookies</strong>
                  <p style={{ margin: "2px 0 0", fontSize: "12px" }}>
                    These cookies are required for the website to function
                    properly.
                  </p>
                </div>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <input
                  type="checkbox"
                  checked={cookiePreferences.analytics}
                  onChange={() => handleCookieCategoryChange("analytics")}
                  style={{ marginRight: "8px" }}
                />
                <div>
                  <strong>Analytics Cookies</strong>
                  <p style={{ margin: "2px 0 0", fontSize: "12px" }}>
                    These cookies help us understand how visitors interact with
                    our website.
                  </p>
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={cookiePreferences.marketing}
                  onChange={() => handleCookieCategoryChange("marketing")}
                  style={{ marginRight: "8px" }}
                />
                <div>
                  <strong>Marketing Cookies</strong>
                  <p style={{ margin: "2px 0 0", fontSize: "12px" }}>
                    These cookies are used to track visitors across websites to
                    display relevant advertisements.
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}
      </CookieConsent>
    </>
  );
};

export default CookieConsentBanner;
