export const environment = {
  production: true,
  apiUrl: '/api',
  socketUrl: '',
  uploadUrl: '/uploads',
  
  // Configuration cartes
  mapConfig: {
    defaultCenter: [0.4162, 9.4673], // Gabon centre
    defaultZoom: 6,
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
  },
  
  // Configuration mobile
  mobile: {
    breakpoints: {
      xs: 576,
      sm: 768,
      md: 992,
      lg: 1200,
      xl: 1400
    },
    touchEnabled: true,
    swipeGestures: true
  },
  
  // Configuration PWA
  pwa: {
    enabled: true,
    updateAvailable: false,
    promptForUpdate: true
  },
  
  // Configuration logging
  logging: {
    level: 'error',
    enableConsole: false,
    enableRemote: true
  },
  
  // Configuration uploads
  upload: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    compressionQuality: 0.8
  },
  
  // Features flags
  features: {
    notifications: true,
    offline: true,
    caching: true,
    analytics: true,
    camera: true,
    geolocation: true
  }
};