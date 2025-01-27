const routes = require('express').Router();
const profileRoutes = require('./userProfilesRoute');

routes.use('/', profileRoutes);

module.exports = routes;
