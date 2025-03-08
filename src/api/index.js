import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Using Proxy
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${process.env.VUE_APP_FOODICS_TOKEN}`,
  },
});

// Response interceptor for handling errors
api.interceptors.response.use(
  response => {
    // Success case - just return the response
    return response;
  },
  error => {
    // Format error message
    let errorMessage = 'An error occurred. Please try again.';

    if (error.response && error.response.data) {
      const { data } = error.response;

      if (data.errors) {
        const errorKeys = Object.keys(data.errors);
        if (errorKeys.length > 0) {
          const firstKey = errorKeys[0];
          const firstValue = data.errors[firstKey][0];
          errorMessage = `Error with ${firstKey}: ${firstValue}`;
        }
      } else if (data.message) {
        errorMessage = data.message;
      }
    }

    // Create enhanced error object
    const enhancedError = {
      originalError: error,
      message: errorMessage,
    };

    console.error('API Error:', enhancedError);

    // Reject with enhanced error
    return Promise.reject(enhancedError);
  }
);

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
