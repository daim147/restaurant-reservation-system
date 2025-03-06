import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Changed from 'https://api.foodics.dev/v5' to use the proxy
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${process.env.VUE_APP_FOODICS_TOKEN}`,
  },
});

export default {
  // Get all branches with sections and tables
  getBranches() {
    return api.get('/branches', {
      params: {
        'include[0]': 'sections',
        'include[1]': 'sections.tables',
      },
    });
  },

  // Get a specific branch with sections and tables
  getBranch(branchId) {
    return api.get(`/branches/${branchId}`, {
      params: {
        'include[0]': 'sections',
        'include[1]': 'sections.tables',
      },
    });
  },

  // Enable branch reservation
  enableBranchReservation(branchId) {
    return api.put(`/branches/${branchId}`, {
      accepts_reservations: true,
    });
  },

  // Disable branch reservation
  disableBranchReservation(branchId) {
    return api.put(`/branches/${branchId}`, {
      accepts_reservations: false,
    });
  },

  // Update branch reservation settings
  updateBranchSettings(branchId, settings) {
    return api.put(`/branches/${branchId}`, settings);
  },
};
