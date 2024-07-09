module.exports = {
    development: { //geliştiricilerin baktığı  veritabanı
        client: 'mysql2',
        connection: {
            host: 'localhost',
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,

        }

    },
}