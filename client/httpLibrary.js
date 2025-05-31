class HttpClient {
   // Initialize the HttpClient 
   constructor(baseUrl) {
      this.baseUrl = baseUrl;
   }

   // Core method to send HTTP requests 
   async request(endpoint, method = "GET", data = null, queryParams = {}) {
      const url = new URL(`${this.baseUrl}${endpoint}`);
      Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));

      const options = {
         method,
         headers: { 'Content-Type': 'application/json' }
      };

      // Add body
      if (data && ["POST", "PUT", "PATCH"].includes(method)) {
         options.body = JSON.stringify(data);
         console.log("→ fetch body:", options.body);

      }

      try {
         const response = await fetch(url, options);
         if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
         return await response.json(); // Return parsed JSON 
      } catch (error) {
         return { error: error.message }; // Return error message 
      }
   }

   // Shortcut for GET request with optional query parameters
   get(endpoint, query = {}) {
      return this.request(endpoint, "GET", null, query);
   }

   // Shortcut for POST 
   post(endpoint, data) {
      return this.request(endpoint, "POST", data);
   }

   // Shortcut for PUT 
   put(endpoint, data) {
      return this.request(endpoint, "PUT", data);
   }

   // Shortcut for PATCH 
   patch(endpoint, data) {
      // Exceed Expectation requirement: supports PATCH requests
      return this.request(endpoint, "PATCH", data);
   }

   // Shortcut for DELETE 
   delete(endpoint) {
      return this.request(endpoint, "DELETE");
   }
}

// Make HttpClient available globally 
window.HttpClient = HttpClient;

