// Module Dependencies
var Q = require('q'),
request = require('request');

// Some URLs to play with, and a queue to keep the code readable
var urls = ['google.com', 'twitter.com', 'facebook.com'],
  queue = [];

// A standard NodeJS function: a parameter and a callback; the callback
// will return error (if any) as first parameter and result as second
// parameter.
function fetchUrl(url) {
  // The 'deferred' object, base of the Promises proposal on CommonJS
  var deferred = Q.defer();

  request({
      url: 'http://' + url
  }, function(err, res, body) {
      if (err) {
          // An error? Reject the promise
          deferred.reject(err);
      } else {
          // Success! Resolve the promise
          // For brevity, on this example we are only interested on the headers
          deferred.resolve(res.headers);
      }
  });

  // Return only the promise which will allow the usage of 'when' and 'then'
  // among others
  return deferred.promise;
}

// For each url, create a function call and addit to the queue ;)
urls.forEach(function(url) {
  queue.push(fetchUrl(url));
});

// Q.all: execute an array of 'promises' and 'then' call either a resolve
// callback (fulfilled promisens) or reject callback (rejected promises)
Q.all(queue).then(function(ful) {

  // All the results from Q.all are on the argument as an array
  console.log('fulfilled', ful);
}, function(rej) {

  // The first rejected (error thrown) will be here only
  console.log('rejected', rej);
}).fail(function(err) {

  // If something whent wrong, then we catch it here, usually when there is no
  // rejected callback.
  console.log('fail', err);
}).fin(function() {

  // Finally statemen; executed no matter of the above results
  console.log('finally');
});