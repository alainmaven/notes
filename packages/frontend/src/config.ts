const config = {
  STRIPE_KEY: "pk_test_51PzFIcHmlQRa0gmLpNgMsSbZZQwDhhpNyYL7JnmDGPdkiOSb2Sil8LxGAhtFYt4ZxlQQpGzCt3OmR66lTvFH8Myw00EflYNlsE",
  // Frontend config
  MAX_ATTACHMENT_SIZE: 5000000,

  //backend config
  s3: {
    REGION: import.meta.env.VITE_REGION,
    BUCKET: import.meta.env.VITE_BUCKET,
  },
  apiGateway: {
    REGION: import.meta.env.VITE_REGION,
    URL: import.meta.env.VITE_API_URL,

  },
  cognito: {
    REGION: import.meta.env.VITE_REGION,
    USER_POOL_ID: import.meta.env.VITE_USER_POOL_ID,
    APP_CLIENT_ID: import.meta.env.VITE_USER_POOL_CLIENT_ID,
    IDENTITY_POOL_ID: import.meta.env.VITE_IDENTITY_POOL_ID,
  },
};

export default config;