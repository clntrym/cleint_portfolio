// Centralized API Client
const AppApi = {
  baseUrl: 'api/',

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') || endpoint.startsWith('api/') 
      ? endpoint 
      : `${this.baseUrl}${endpoint}`;

    const config = {
      headers: {
        'Accept': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        if (response.status === 401) {
          // If unauthorized and currently in admin route, notify and redirect
          if (window.AppStore) {
            window.AppStore.setAuth(null);
          }
        }
        const errorMsg = data?.message || (typeof data === 'string' ? data : 'An error occurred');
        throw new Error(errorMsg);
      }

      return data;
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err);
      throw err;
    }
  },

  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(fullUrl, { method: 'GET' });
  },

  post(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body
    });
  },

  put(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body
    });
  },

  delete(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(fullUrl, { method: 'DELETE' });
  },

  upload(file, type = 'projects') {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);
    return this.request('api/upload.php', {
      method: 'POST',
      body: formData
    });
  },

  uploadResume(file) {
    const formData = new FormData();
    formData.append('resume', file);
    return this.request('api/resume.php', {
      method: 'POST',
      body: formData
    });
  }
};
