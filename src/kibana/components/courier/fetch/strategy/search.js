define(function (require) {

  return {
    clientMethod: 'msearch',

    /**
     * Flatten a series of requests into as ES request body
     * @param  {array} requests - the requests to serialize
     * @return {string} - the request body
     */
    requestStatesToBody: function (states) {
      return states.map(function (state) {
        return JSON.stringify({
            index: state.index,
            type: state.type
          })
          + '\n'
          + JSON.stringify(state.body);

      }).join('\n') + '\n';
    },

    /**
     * Fetch the multiple responses from the ES Response
     * @param  {object} resp - The response sent from Elasticsearch
     * @return {array} - the list of responses
     */
    getResponses: function (resp) {
      return resp.responses;
    },

    /**
     * Resolve a single request using a single response from an msearch
     * @param  {object} req - The request object, with a defer and source property
     * @param  {object} resp - An object from the mget response's "docs" array
     * @return {Promise} - the promise created by responding to the request
     */
    resolveRequest: function (req, resp) {
      req.defer.resolve(resp);
    },

    /**
     * Get the doc requests from the courier that are ready to be fetched
     * @param {array} pendingRequests - The list of pending requests, from
     *                                  which the requests to make should be
     *                                  removed
     * @return {array} - The filtered request list, pulled from
     *                   the courier's _pendingRequests queue
     */
    getPendingRequests: function (pendingRequests) {
      return pendingRequests.splice(0).filter(function (req) {
        // filter by type first
        if (req.source._getType() === 'search') return true;
        else pendingRequests.push(req);
      });
    }
  };

});