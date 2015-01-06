'use strict';

var _ = require('lodash');

module.exports = (function(schema, opts){
  ///////////////////
  // Configuration //
  ///////////////////

  /** Merge Default Options **/
  var options = _.merge({
    permitted: [],
    overrideMethods: false
  }, opts);

  /** Reset Permitted Properties **/
  if(!_.isArray(options.permitted) && !_.isString(options.permitted))
    options.permitted = [];

  ////////////////////
  // Helper Methods //
  ////////////////////

  /**
   * Filter data with permitted params and apply overrides
   *
   * @param source      {Object} Source object
   * @param [override]  {Object} Overrides to apply after filtering
   *
   * @returns {Object}  Filtered object with overrides
   */
  var params = function(source, override){
    var filtered = _.pick(source, options.permitted);
    if(_.isPlainObject(override)) _.assign(filtered, override);
    return filtered;
  };

  //////////////////////
  // Instance Methods //
  //////////////////////

  _.assign(schema.methods, {
    only: function(params){
      if(arguments.length > 1) params = arguments;
      return _.pick(this, params);
    },
    except: function(params){
      if(arguments.length > 1) params = arguments;
      return _.omit(this, params);
    },

    /**
     * Perform an update with permitted params
     *
     * @param source      {Object}    Source object
     * @param [override]  {Object}    Overrides to apply after filtering
     * @param [done]      {Function}  Model.save callback
     *
     * @returns {Promise} The promise returned by Model.save
     */
    safeUpdate: function(source, override, done){
      var filtered = params(source, override);
      _.assign(this, filtered);
      return this.save(_.isFunction(override) ? override : done);
    }
  });

  if(options.overrideMethods){
    /** Override Document.update to #safeUpdate **/
    _.assign(schema.methods, {
      update: schema.methods.safeUpdate
    });
  }

  ////////////////////
  // Static Methods //
  ////////////////////
  
  _.assign(schema.statics, {
    only: _.pick,
    except: _.omit,

    /**
     * Perform a create with permitted params
     *
     * @param docs        {Array|Object}  Source object(s)
     * @param [override]  {Object}        Overrides to apply after filtering
     * @param [done]      {Function}      Model.create callback
     *
     * @returns {Promise} Model.create promise
     */
    safeCreate: function(docs, override, done){
      if(!_.isArray(docs)) docs = [docs];
      var filtered = _.map(docs, function(source){
        return params(source, override);
      });
      return this.create(filtered, _.isFunction(override) ? override : done);
    }
  });

  if(options.overrideMethods){
    /** Override Model.create to #safeCreate **/
    _.assign(schema.statics, {
      create: schema.statics.safeCreate
    });
  }
});