export function appConfig() {
  return {
    app: {
      url: process.env.APP_URL,
      port: process.env.PORT,
    },
    database: {
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      dbname: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      logLevel: JSON.parse(process.env.DB_LOG),
      entities: JSON.parse(process.env.DB_ENTITIES),
      autoLoadEntities: process.env.DB_AUTOLOAD_ENTITIES === 'true',
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      dropSchema: process.env.DB_DROPSCHEMA === 'true',
    },
    auth: {
      // hashSalt: process.env.HASH_SALT,
      accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
      accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION,
      refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
      refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION,
    },
    otp: {
      expiration: +process.env.SMS_EXPIRAATION,
      smsir: {
        key: process.env.SMS_IR_USER_KEY,
        secret: process.env.SMS_IR_SECRET,
      },
    },
    security: {
      failedLogin: {
        retrys: +process.env.FAILED_LOGIN_RETRY,
        banTime: +process.env.FAILED_LOGIN_BAN_TIME,
      },
    },
  };
}
