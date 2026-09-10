import standardsData from '../data/standards.json';
import qcoData from '../data/qco.json';
import labsData from '../data/labs.json';

// In the future, set this to true and provide the actual API base URL.
const USE_REAL_API = false;
const API_BASE = 'https://api.bis-sathi.gov.in/v1';

async function fetchFromApi(endpoint: string) {
  const response = await fetch(`${API_BASE}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

/**
 * API Swap Layer
 * All data fetching across the app should route through these methods.
 * To switch to a live backend, simply toggle USE_REAL_API above.
 */
export const apiClient = {
  getStandards: async () => {
    if (USE_REAL_API) return fetchFromApi('/standards');
    return new Promise(resolve => setTimeout(() => resolve(standardsData), 400));
  },
  
  getStandardById: async (id: string) => {
    if (USE_REAL_API) return fetchFromApi(`/standards/${id}`);
    const std = (standardsData as any[]).find(s => s.id === id);
    return new Promise((resolve, reject) => 
      setTimeout(() => std ? resolve(std) : reject(new Error('Not found')), 200)
    );
  },

  getQCOs: async () => {
    if (USE_REAL_API) return fetchFromApi('/qcos');
    return new Promise(resolve => setTimeout(() => resolve(qcoData), 400));
  },

  getLabs: async () => {
    if (USE_REAL_API) return fetchFromApi('/labs');
    return new Promise(resolve => setTimeout(() => resolve(labsData), 400));
  }
};
