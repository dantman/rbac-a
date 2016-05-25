'use strict';

var deprecate = require('util').deprecate;
var co = require('co');

/**
Provider interface.

This class provides roles, permissions and attributes to check and
validate user access.

Usage

  var user = 123;
  var roles = provider.getRoles(user);
  var permissions = provider.getPermissions(roles[i]);
  var attributes = provider.getAttributes(roles[i]);

Note : methods may return a Promise

Extend concrete providers and implement the declared methods.
*/
module.exports = class Provider {

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
    throw new Error('Not implemented');
  }

  /**
  Return the role hierarchy for the given user. The return value
  must be an object, recursively defining the associated roles for the
  specified user. Return an empty object if user has no roles.

  Ex: {
        "role1": {
          "role1.1": null,
          "role1.2": { ... },
          ...
        },
        "secondary": ...,
        ...
      }

  The method mey return a promise resolving with the
  expected return value.

  @param user {mixed}
  @return {Object<string,number>}
  */
  getRoleHierarchy(user) {
    const provider = this;
    return Promise.resolve().then(function () {
      return provider.getRoles(user)
    }).then(function (roles) {
      const cache = {};

      if ( !Array.isArray(roles) && Object.prototype.toString.call(roles) === '[object Object]' ) {
        // Backwards compatibility with old custom providers
        deprecate(function() {}, 'getRoles():Object is now getRoleHierarchy: Rename your method or implement getRoles():Array and getInheritedRoles():Array')();
        return roles;
      }

      const collect = co.wrap(function *(roles, userRoles, depth) {
        for (let i = 0, iLen = roles.length; i < iLen; ++i) {
          cache[roles[i]] = cache[roles[i]] || depth;
        }

        for (let i = 0, iLen = roles.length; i < iLen; ++i) {
          if (cache[roles[i]] >= depth) {
            let inheritedRoles = yield Promise.resolve(provider.getInheritedRoles(roles[i]));

            if (Array.isArray(inheritedRoles)) {
              userRoles[roles[i]] = yield collect(inheritedRoles, {}, depth + 1);
            } else {
              userRoles[roles[i]] = null;
            }
          }
        }

        return userRoles;
      });

      return collect(roles, {}, 1);
    });
  }

  /**
  Return all roles inherited by the specified role. The return value
  must be an array. Return an empty array if role is missing or
  no roles are inherited by the specified role.

  Ex: ['role1', 'role2', ... ]

  The method mey return a promise resolving with the
  expected return value.

  @param role {mixed}
  @return {Array<string>}
  */
  getInheritedRoles(role) {
    throw new Error('Not implemented');
  }

  /**
  Return all permissions for the specified role. The return value
  must be an array. Return an empty array if role is missing or
  no permission for the specified role.

  Ex: ['permission1', 'permission2', ... ]

  The method mey return a promise resolving with the
  expected return value.

  @param role {mixed}
  @return {Array<string>}
  */
  getPermissions(role) {
    throw new Error('Not implemented');
  }

  /**
  Return all attributes for the specified role. The return value must
  be an array. Return an empty array if role is missing or if no
  attributes for the specified role.

  Ex: ['attribute1', 'attribute2', ... ]

  The method mey return a promise resolving with the
  expected return value.

  @param role {mixed}
  @return {Array<string>}
  */
  getAttributes(role) {
    throw new Error('Not implemented');
  }

}