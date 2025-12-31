import { StorageSerializers, useStorage } from '@vueuse/core';
import { computed, watch, readonly } from 'vue';
import { isUndefined } from 'lodash';
import { config } from '@/config';


// Define user consent state
export interface ConsentState {
  essential: boolean; // Essential cookies/functionality
  analytics?: boolean; // analytics consent (all tools)
  marketing?: boolean; // Marketing related
  preferences?: boolean; // Preference settings
  timestamp: number; // Consent timestamp
  version: number; // Consent version for policy updates
  expiresAt: number; // Consent expiration timestamp
}

// Define region types
export type RegionType = 'gdpr' | 'ccpa' | 'other';

// Region detection result
export interface RegionInfo {
  region: RegionType;
  requiresConsent: boolean;
}

// Default consent state
const defaultConsentState: ConsentState = {
  essential: true, // Essential functionality enabled by default
  analytics: undefined, // analytics disabled by default
  marketing: undefined,
  preferences: undefined,
  timestamp: 0,
  version: 1,
  expiresAt: 0, // Expired by default, will be set when user consents
};

const fullyConsentState: ConsentState = {
  essential: true,
  analytics: true,
  marketing: true,
  preferences: true,
  timestamp: Infinity,
  version: defaultConsentState.version,
  expiresAt: Infinity,
};

// GDPR country list
const GDPR_COUNTRIES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
  'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'IS', 'LI', 'NO'
];

// CCPA state list (California Consumer Privacy Act)
const CCPA_STATES = ['CA'];

// Consent expiration periods by region (in milliseconds)
const CONSENT_EXPIRATION_PERIODS = {
  gdpr: 2 * 365 * 24 * 60 * 60 * 1000,    // 2 years for GDPR
  ccpa: 1 * 365 * 24 * 60 * 60 * 1000,    // 1 year for CCPA
  other: 3 * 365 * 24 * 60 * 60 * 1000,   // 3 years for other regions
} as const;

// Get region type from country data
const getRegionFromCountryData = (countryCode: string, regionCode?: string): RegionType => {
  if (GDPR_COUNTRIES.includes(countryCode)) {
    return 'gdpr';
  }
  if (CCPA_STATES.includes(regionCode || '')) {
    return 'ccpa';
  }
  return 'other';
};

// Cached region consent requirement (only stores whether consent is required, not user location data)
interface CachedRegionConsent extends RegionInfo {
  cachedAt: number;
  expiresAt: number;
}

export function useConsent() {
  // Store user consent state, cached for 1 year
  const rawConsentState = useStorage<ConsentState>('consent-state', null, localStorage, {
    serializer: StorageSerializers.object
  });

  // Cache only the consent requirement, not user location data for privacy
  const cachedRegionConsent = useStorage<CachedRegionConsent | null>('region-consent', null, localStorage, {
    serializer: StorageSerializers.object
  });

  if (cachedRegionConsent.value && cachedRegionConsent.value.expiresAt < Date.now()) {
    cachedRegionConsent.value = null
  }

  // Compute region info from cached consent requirement
  const regionInfo = computed<RegionInfo | null>(() => {
    if (!cachedRegionConsent.value) {
      return null;
    }

    return {
      region: cachedRegionConsent.value.region,
      requiresConsent: cachedRegionConsent.value.requiresConsent,
    };
  });

  // Check version, reset if version doesn't match
  if (rawConsentState.value && rawConsentState.value.version !== defaultConsentState.version) {
    rawConsentState.value = null;
  }
  // Check expiration, reset if expired
  if (rawConsentState.value && rawConsentState.value.expiresAt && rawConsentState.value.expiresAt < Date.now()) {
    rawConsentState.value = null;
  }

  // Handle version checking and migration
  const consentState = computed({
    get: () => {
      // In strict mode, always require consent; otherwise check region requirement
      const requiresConsent = config.consent.strict || regionInfo.value?.requiresConsent;
      if (regionInfo.value && !requiresConsent) {
        return fullyConsentState;
      }

      const current = rawConsentState.value;
      if (!current) {
        return defaultConsentState;
      }
      
      return current;
    },
    set: (value) => {
      rawConsentState.value = value;
    },
  });

  const detectRegion = async (): Promise<RegionInfo> => {
    // Check if we have valid cached data
    if (regionInfo.value) {
      return regionInfo.value;
    }

    try {
      // Use free geolocation API
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();

      const countryCode = data.country_code || 'US';
      const regionCode = data.region_code;

      // Calculate region type and consent requirement
      const region = getRegionFromCountryData(countryCode, regionCode);
      const requiresConsent = region === 'gdpr' || region === 'ccpa';

      // Only cache the consent requirement, not user location data
      const now = Date.now();
      cachedRegionConsent.value = {
        requiresConsent,
        region,
        cachedAt: now,
        expiresAt: now + (7 * 24 * 60 * 60 * 1000), // 7 days
      };

      // Return region info
      return regionInfo.value!;
    } catch (error) {
      console.warn('Failed to detect region:', error);

      // Don't set any fallback data - let regionInfo remain null
      // This will cause needsConsent to return true by default
      throw error;
    }
  };

  // Check if already consented
  const hasConsented = computed(() => {
    return consentState.value.timestamp > 0;
  });

  // Consent UI configuration - defines which options are available in current version
  const consentConfig = computed(() => ({
    showAnalytics: config.vercelAnalytics.enabled || !!config.googleAnalytics.id || !!config.umamiAnalytics.websiteId,
    showMarketing: false, // Currently disabled - can be enabled in future versions
    showPreferences: false, // Currently disabled - can be enabled in future versions
  }));

  // Check if consent feature is enabled
  const hasConsentEnabled = computed(() => {
    return config.consent.enabled && Object.values(consentConfig.value).some(value => value);
  });

  const handleDetectRegion = (enabled: boolean) => {
    if (enabled) {
      detectRegion().catch((error) => {
        console.warn('Auto region detection failed:', error);
      });
      stopWatch();
    }
  }

  // Auto-detect region when consent is enabled and no cached data
  const { stop: stopWatch } = watch(hasConsentEnabled, handleDetectRegion);

  handleDetectRegion(hasConsentEnabled.value)

  // Check if consent modal should be shown
  const needsConsent = computed(() => {
    if (!regionInfo.value) {
      return false;
    }

    // In strict mode, always require consent; otherwise check region requirement
    const requiresConsent = config.consent.strict || regionInfo.value.requiresConsent;
    if (!requiresConsent) {
      return false;
    }

    if (!hasConsented.value) return true;

    // Check if any currently enabled consent options are missing from stored data
    // This handles the case where new consent options are added in new versions
    const current = rawConsentState.value;
    if (consentConfig.value.showAnalytics && isUndefined(current.analytics)) return true;
    if (consentConfig.value.showMarketing && isUndefined(current.marketing)) return true;
    if (consentConfig.value.showPreferences && isUndefined(current.preferences)) return true;
    
    return false;
  });


  // Update consent state
  const updateConsent = (newState: Partial<ConsentState>) => {
    // Calculate expiration based on current region
    const region = regionInfo.value?.region || 'other';
    const expirationPeriod = CONSENT_EXPIRATION_PERIODS[region];
    const expiresAt = Date.now() + expirationPeriod;

    consentState.value = {
      ...consentState.value,
      ...newState,
      timestamp: Date.now(),
      expiresAt,
    };
  };

  // Accept all - only set options that are currently available
  const acceptAll = () => {
    const consentData: Partial<ConsentState> = {
      essential: true,
      timestamp: Date.now(),
      version: 1,
      expiresAt: Date.now() + CONSENT_EXPIRATION_PERIODS[regionInfo.value?.region || 'other']
    };

    if (consentConfig.value.showAnalytics) consentData.analytics = true;
    if (consentConfig.value.showMarketing) consentData.marketing = true;
    if (consentConfig.value.showPreferences) consentData.preferences = true;

    consentState.value = { ...consentState.value, ...consentData };
  };

  // Reject all (except essential)
  const rejectAll = () => {
    const consentData: Partial<ConsentState> = {
      essential: true,
      timestamp: Date.now(),
      version: 1,
      expiresAt: Date.now() + CONSENT_EXPIRATION_PERIODS[regionInfo.value?.region || 'other']
    };

    if (consentConfig.value.showAnalytics) consentData.analytics = false;
    if (consentConfig.value.showMarketing) consentData.marketing = false;
    if (consentConfig.value.showPreferences) consentData.preferences = false;

    consentState.value = { ...consentState.value, ...consentData };
  };

  // Custom settings
  const setCustomConsent = (analytics?: boolean, marketing?: boolean, preferences?: boolean) => {
    const consentData: Partial<ConsentState> = {
      essential: true,
      timestamp: Date.now(),
      version: 1,
      expiresAt: Date.now() + CONSENT_EXPIRATION_PERIODS[regionInfo.value?.region || 'other']
    };

    if (consentConfig.value.showAnalytics) consentData.analytics = !!analytics;
    if (consentConfig.value.showMarketing) consentData.marketing = !!marketing;
    if (consentConfig.value.showPreferences) consentData.preferences = !!preferences;

    consentState.value = { ...consentState.value, ...consentData };
  };

  // Reset consent state
  const resetConsent = () => {
    rawConsentState.value = { ...defaultConsentState };
    cachedRegionConsent.value = null;
  };

  // Readonly consent state for external use
  const readonlyConsentState = computed(() => readonly(consentState.value));

  return {
    consentState: readonlyConsentState,
    regionInfo,
    hasConsented,
    needsConsent,
    hasConsentEnabled,
    detectRegion,
    updateConsent,
    acceptAll,
    rejectAll,
    setCustomConsent,
    resetConsent,
    consentConfig,
  };
}
