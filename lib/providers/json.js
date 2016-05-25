'use strict';

const Provider = require('../provider');


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
  Return the list of roles belonging to the given user. The return
  value must be an array.
  Return an empty array of the user has no roles.

  Ex: ['role1', 'role2', ... ]

  The method mey return a promise resolving with the
  expected return value.

  @param user {mixed}
  @return {Array<string>}
  */
  getRoles(user) {
    return this._rules && this._rules['users'] && this._rules['users'][user] && this._rules['users'][user] || [];
  }

  /**
  Return all roles inherited by the specified role.

  The method mey return a promise resolving with the
  expected return value.

  @param role {mixed}
  @return {Array<string>}
  */
  getInheritedRoles(role) {
    return this._rules && this._rules['roles'] && this._rules['roles'][role] && this._rules['roles'][role]['inherited'] || [];
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