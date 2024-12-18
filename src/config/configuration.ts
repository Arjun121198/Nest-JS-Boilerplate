export default () => ({
    environment: process.env.NODE_ENV || 'local',
    port: parseInt(process.env.PORT, 10) || 3000,
  
    jwt: {
      secret: process.env.JWT_SECRET,
    },
  
    database: {
      mongoUri: process.env.MONGO_URI,
      mongoUriTests: process.env.MONGO_URI_TESTS,
    },
  
    email: {
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10) || 465,
      username: process.env.EMAIL_USERNAME,
      password: process.env.EMAIL_PASSWORD,
      from: process.env.EMAIL_FROM,
    },
  
    cors: {
      origin: process.env.CORS_ORIGIN,
    },
  
    s3: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      region: process.env.S3_REGION,
      bucketName: process.env.S3_BUCKET_NAME,
      baseUrl: process.env.S3_BASE_URL,
    },
  
    blockchain: {
      url: process.env.BLOCKCHAIN_URL,
    },
  });
  