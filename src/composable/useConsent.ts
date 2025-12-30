import { StorageSerializers, useStorage } from '@vueuse/core';
import { computed } from 'vue';
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
  country: string;
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

// Get region type from cached API data
const getRegionFromCountryData = (data: CachedRegionData): RegionType => {
  const country = data.countryCode || 'US';
  const regionCode = data.regionCode;

  if (GDPR_COUNTRIES.includes(country)) {
    return 'gdpr';
  }
  if (CCPA_STATES.includes(regionCode || '')) {
    return 'ccpa';
  }
  return 'other';
};

// Raw API response data structure
interface RegionApiResponse {
  asn: string;
  city: string;
  continentCode: string;
  country: string;
  countryArea: number;
  countryCallingCode: string;
  countryCapital: string;
  countryCode: string;
  countryCodeIso3: string;
  countryName: string;
  countryPopulation: number;
  countryTld: string;
  currency: string;
  currencyName: string;
  inEu: boolean;
  ip: string;
  languages: string;
  latitude: number;
  longitude: number;
  network: string;
  org: string;
  postal: string | null;
  region: string;
  regionCode: string;
  timezone: string;
  utcOffset: string;
  version: string;
}

// Region cache with expiration (extends API response with cache metadata)
interface CachedRegionData extends RegionApiResponse {
  // Cache metadata
  cachedAt: number;
  expiresAt: number;
}

export function useConsent() {
  // Store user consent state, cached for 1 year
  const rawConsentState = useStorage<ConsentState>('consent-state', null, localStorage);

  // Handle version checking and migration
  const consentState = computed({
    get: () => {
      if (regionInfo.value && !regionInfo.value.requiresConsent) {
        return fullyConsentState;
      }

      const current = rawConsentState.value;
      // Check version, reset if version doesn't match
      if (current.version !== defaultConsentState.version) {
        return defaultConsentState;
      }
      // Check expiration, reset if expired
      if (current.expiresAt && current.expiresAt < Date.now()) {
        return defaultConsentState;
      }
      return current;
    },
    set: (value) => {
      rawConsentState.value = value;
    },
  });

  // Cache region data for 7 days
  const cachedRegionData = useStorage<CachedRegionData | null>('region-cache', null, undefined, {
    serializer: StorageSerializers.object
  });

  // Compute region info from cached data
  const regionInfo = computed<RegionInfo | null>(() => {
    if (!cachedRegionData.value || cachedRegionData.value.expiresAt < Date.now()) {
      return null;
    }

    const data = cachedRegionData.value;
    const region = getRegionFromCountryData(data);
    const requiresConsent = region === 'gdpr' || region === 'ccpa';

    return {
      country: data.countryCode,
      region,
      requiresConsent,
    };
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

      // Convert API response to camelCase and cache
      const now = Date.now();
      cachedRegionData.value = {
        asn: data.asn,
        city: data.city,
        continentCode: data.continent_code,
        country: data.country,
        countryArea: data.country_area,
        countryCallingCode: data.country_calling_code,
        countryCapital: data.country_capital,
        countryCode: data.country_code,
        countryCodeIso3: data.country_code_iso3,
        countryName: data.country_name,
        countryPopulation: data.country_population,
        countryTld: data.country_tld,
        currency: data.currency,
        currencyName: data.currency_name,
        inEu: data.in_eu,
        ip: data.ip,
        languages: data.languages,
        latitude: data.latitude,
        longitude: data.longitude,
        network: data.network,
        org: data.org,
        postal: data.postal,
        region: data.region,
        regionCode: data.region_code,
        timezone: data.timezone,
        utcOffset: data.utc_offset,
        version: data.version,
        cachedAt: now,
        expiresAt: now + (7 * 24 * 60 * 60 * 1000), // 7 days
      };

      // Return computed region info
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

  // Check if consent modal should be shown
  const needsConsent = computed(() => {
    if (!regionInfo.value || !regionInfo.value.requiresConsent) {
      return false
    }

    if (!hasConsented.value) return true;

    // Check if any currently enabled consent options are missing from stored data
    // This handles the case where new consent options are added in new versions
    const current = rawConsentState.value;
    if (consentConfig.value.showAnalytics && isUndefined(current.analytics)) return true;
    if (consentConfig.value.showMarketing && isUndefined(current.marketing)) return true;
    if (consentConfig.value.showPreferences && isUndefined(current.preferences)) return true;

    return regionInfo.value.requiresConsent;
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
    cachedRegionData.value = null;
  };

  return {
    consentState,
    regionInfo,
    hasConsented,
    needsConsent,
    detectRegion,
    updateConsent,
    acceptAll,
    rejectAll,
    setCustomConsent,
    resetConsent,
    consentConfig,
  };
}
