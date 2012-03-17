(function() {
  var C3Store, Sequelize, SessionModel, crudl, _;

  Sequelize = require('sequelize');

  crudl = require('crudl-model');

  _ = require('underscore');

  SessionModel = {
    sid: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    data: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  };

  C3Store = (function() {

    function C3Store(SequelizeSession) {
      this.SequelizeSession = SequelizeSession;
      this.Session = crudl(this.SequelizeSession);
    }

    C3Store.prototype.clear = function(callback) {
      var error, success;
      success = function() {
        return typeof callback === "function" ? callback() : void 0;
      };
      error = function(error) {
        return typeof callback === "function" ? callback(error) : void 0;
      };
      return this.Session.clear(success, error);
    };

    C3Store.prototype.destroy = function(sid, callback) {
      var error, q, success;
      success = function() {
        return typeof callback === "function" ? callback() : void 0;
      };
      error = function(error) {
        return typeof callback === "function" ? callback(error) : void 0;
      };
      q = {
        where: {
          sid: sid
        }
      };
      return this.Session["delete"](q, success, error);
    };

    C3Store.prototype.length = function(callback) {
      var error, success;
      success = function(count) {
        return typeof callback === "function" ? callback(count) : void 0;
      };
      error = function(error) {
        return typeof callback === "function" ? callback(null) : void 0;
      };
      return this.Session.count(success, error);
    };

    C3Store.prototype.get = function(sid, callback) {
      var error, q, success;
      success = function(session) {
        if (session) {
          return typeof callback === "function" ? callback(null, JSON.parse(session.data)) : void 0;
        } else {
          return typeof callback === "function" ? callback('session not found') : void 0;
        }
      };
      error = function(error) {
        return typeof callback === "function" ? callback(error) : void 0;
      };
      q = {
        where: {
          sid: sid
        }
      };
      return this.Session.find(q, success, error);
    };

    C3Store.prototype.set = function(sid, session, callback) {
      var error, s, success;
      s = {
        sid: sid,
        data: JSON.stringify(session)
      };
      success = function(session) {
        return typeof callback === "function" ? callback() : void 0;
      };
      error = function(error) {
        return typeof callback === "function" ? callback(error) : void 0;
      };
      return this.Session.create(s, success, error);
    };

    return C3Store;

  })();

  module.exports = function(connect) {
    C3Store.prototype.__proto__ = connect.session.Store.prototype;
    return function(sequelize, model) {
      return new C3Store(sequelize.define('Session', _.extend(SessionModel, model)));
    };
  };

}).call(this);