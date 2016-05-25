'use strict';

const Provider = require('../provider');
const collect = require('../util/collect');

/**
Basic JSON permissions provider
*/
module.exports = class JsonProvider extends Provider {

  /**
  Create a new instance giving a set of predefined rules
  */
  constructor(rules) {
    super();

    this._rules = rules || {};
  }

  /**
  Return all the roles available for the given user. The return value
  is an object where the keys are the roles available and the values
  are the depth level of each role.

  The method mey return a promise resolving with the
  expected return value.

  @param user {mixed}
  @return {Object<string,number>}
  */
  getRoles(user) {
    const rules = this._rules || {};
    const roles = rules['users'] && rules['users'][user] && rules['users'][user] || [];
    return collect(roles, function(role) {
      return rules['roles'] && rules['roles'][role] && rules['roles'][role]['inherited'];
    });
  }

  /**
  Return all permissions for the specified role.

  The method mey return a promise resolving with the
  expected return value.

  @param role {mixed}
  @return {Array<string>}
  */
  getPermissions(role) {
    return this._rules && this._rules['roles'] && this._rules['roles'][role] && this._rules['roles'][role]['permissions'] || [];
  }

  /**
  Return all attributes for the specified role.

  The method mey return a promise resolving with the
  expected return value.

  @param role {mixed}
  @return {Array<string>}
  */
  getAttributes(role) {
    return this._rules && this._rules['roles'] && this._rules['roles'][role] && this._rules['roles'][role]['attributes'] || [];
  }

}