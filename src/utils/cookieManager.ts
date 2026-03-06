// utils/cookieManager.js
import Cookies from "js-cookie";

/**
 * Cookie management utility functions
 */

// Get the current cookie preferences
export const getCookiePreferences = () => {
  const cookiePreferences = Cookies.get("cookiePreferences");
  if (cookiePreferences) {
    try {
      return JSON.parse(cookiePreferences);
    } catch (error) {
      console.error("Error parsing cookie preferences:", error);
      return {
        necessary: true,
        analytics: false,
        marketing: false,
      };
    }
  }

  // Default if not set
  return {
    necessary: true,
    analytics: false,
    marketing: false,
  };
};

// Check if a specific cookie type is allowed
export const isCookieAllowed = (cookieType) => {
  if (cookieType === "necessary") return true; // Always allow necessary cookies

  const preferences = getCookiePreferences();
  return preferences[cookieType] === true;
};

// Set a cookie only if the type is allowed
export const setCookieIfAllowed = (
  name,
  value,
  options = {},
  cookieType = "necessary",
) => {
  if (isCookieAllowed(cookieType)) {
    Cookies.set(name, value, options);
    return true;
  }
  return false;
};

// Remove specific cookies by type (useful when user changes preferences)
export const removeCookiesByType = (cookieType) => {
  // This is a simplified implementation
  // In a real application, you'd need to maintain a list of cookies by type
  const cookiesByType = {
    analytics: ["_ga", "_gid", "_gat"],
    marketing: ["_fbp", "_pin_unauth"],
  };

  if (cookiesByType[cookieType]) {
    cookiesByType[cookieType].forEach((cookieName) => {
      Cookies.remove(cookieName);
      Cookies.remove(cookieName, { path: "/" });

      // Also try to remove cookies with domain attribute
      // Note: this is not perfect as js-cookie can't always remove cookies set with specific domains
      const domain = window.location.hostname;
      Cookies.remove(cookieName, { domain: domain });
      Cookies.remove(cookieName, { domain: `.${domain}` });
    });
  }
};

// Initial setup for cookies based on saved preferences
export const initializeCookies = () => {
  const preferences = getCookiePreferences();

  // Remove cookies for types that are not allowed
  if (!preferences.analytics) {
    removeCookiesByType("analytics");
  }

  if (!preferences.marketing) {
    removeCookiesByType("marketing");
  }

  // Initialize analytics if allowed
  if (preferences.analytics) {
    // Initialize analytics scripts
    // Example: initializeGoogleAnalytics();
  }

  // Initialize marketing scripts if allowed
  if (preferences.marketing) {
    // Initialize marketing scripts
    // Example: initializeFacebookPixel();
  }

  return preferences;
};

// Example functions for initializing analytics tools
export const initializeGoogleAnalytics = () => {
  if (!isCookieAllowed("analytics")) return;

  // Google Analytics initialization code would go here
  console.log("Google Analytics initialized");
};

export const initializeFacebookPixel = () => {
  if (!isCookieAllowed("marketing")) return;

  // Facebook Pixel initialization code would go here
  console.log("Facebook Pixel initialized");
};
