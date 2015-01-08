'use strict';

var _ = require('lodash');

module.exports = (function(collection, opts){
  var Model = collection.prototype;

  ///////////////////
  // Configuration //
  ///////////////////

  /** Merge Default Options **/
  var options = {
    permitted: []
  };
  if(opts) _.assign(options, opts);
  if(_.isString(options.permitted) && options.permitted.indexOf(' ') >= 0)
    options.permitted = options.permitted.split(' ');

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

  _.assign(Model.attributes, {
    only: function(params){
      if(arguments.length > 1) params = arguments;
      return _.pick(this.toObject(), params);
    },
    except: function(params){
      if(arguments.length > 1) params = arguments;
      return _.omit(this.toObject(), params);
    },

    /**
     * Filter assign to document
     *
     * @param source      {Object}  Source object
     * @param [override]  {Object}  Overrides to apply after filtering
     *
     * @returns {this}
     */
    assign: function(source, override){
      var filtered = params(source, override);
      return _.assign(this, filtered);
    },

    /**
     * Filter assign to a copy of the document
     *
     * @param source      {Object}  Source object
     * @param [override]  {Object}  Overrides to apply after filtering
     *
     * @returns {Document<this>} Copy of the document properties were assigned to
     */
    merge: function(source, override){
      var filtered = params(source, override);
      return _.merge(this, filtered);
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
      return this.assign(source, override).save(_.isFunction(override) ? override : done);
    }
  });

  ////////////////////
  // Static Methods //
  ////////////////////
  
  _.assign(Model, {
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
});
