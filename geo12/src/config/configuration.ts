export default () => ({
    port: parseInt(process.env.PORT || '5000', 10),
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'geoserver',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your_jwt_secret',
        expiresIn: process.env.JWT_EXPIRATION || '1d',
    },
    yandexStorage: {
        accessKeyId: process.env.YANDEX_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.YANDEX_SECRET_ACCESS_KEY || '',
        bucketName: process.env.YANDEX_BUCKET_NAME || '',
        endpoint: 'https://storage.yandexcloud.net',
    },
}); 