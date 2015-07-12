'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    config = require('../config/environment'),
    jwt = require('jsonwebtoken'),
    compose = require('composable-middleware'),
    User = require('../api/user/user.model'),
    validateJwt = require('express-jwt')({secret: config.secrets.session});

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
    return compose()
        // Validate jwt
        .use(function(req, res, next) {
            // allow access_token to be passed through query parameter as well
            if(req.query && req.query.hasOwnProperty('access_token')) {
                req.headers.authorization = 'Bearer ' + req.query.access_token;
            }
            validateJwt(req, res, next);
        })
        // Attach user to request
        .use(function(req, res, next) {
            User.findById(req.user._id, function(err, user) {
                if(err) return next(err);
                if(!user) return res.status(401).end();

                req.user = user;
                next();
            });
        });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
    if(!roleRequired) throw new Error('Required role needs to be set');

    return compose()
        .use(isAuthenticated())
        .use(function meetsRequirements(req, res, next) {
            if(config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
                next();
            }
            else {
                res.send(403);
            }
        });
}

/**
 * If there is a user, appends it to the req
 * else req.user would be undefined
 */
function appendUser() {
    return compose()
        // Attach user to request
        .use(function(req, res, next) {
            validateJwt(req, res, function(val) {
                if(_.isUndefined(val)) {
                    User.findById(req.user._id, function(err, user) {
                        if(err) {
                            return next(err);
                        } else if(!user) {
                            req.user = undefined;
                            return next();
                        } else {
                            req.user = user;
                            next();
                        }
                    });
                } else {
                    req.user = undefined;
                    next();
                }
            });
        });
}

/**
 * Takes the token cookie and adds the header
 * for it on the request
 */
function addAuthHeaderFromCookie() {
    return compose()
        .use(function(req, res, next) {
            if(req.cookies.token) {
                req.headers.authorization = 'Bearer ' + _.trim(req.cookies.token, '\"');
            }
            return next();
        });
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id) {
    return jwt.sign({_id: id}, config.secrets.session, {expiresInMinutes: 60 * 5});
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
    if(!req.user) return res.json(404, {message: 'Something went wrong, please try again.'});
    var token = signToken(req.user._id, req.user.role);
    res.cookie('token', JSON.stringify(token));
    res.redirect('/');
}

exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.appendUser = appendUser;
exports.addAuthHeaderFromCookie = addAuthHeaderFromCookie;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;
