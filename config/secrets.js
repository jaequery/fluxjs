module.exports = {
    mongodb: process.env.MONGODB || 'mongodb://mongodb:27017/flux',
    port: process.env.APP_PORT || '9099',
    password: 'test'
}
