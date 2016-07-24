// # StorageDB
//
// StorageDB is a simple database that uses localStorage for its persistence.
//
// StorageDB models the `PouchDB` api with a changes feed, post, put and remove.
//
//
// ## API
const api = {
  // > changes
  changes: changes,
  // get
  get: get,
  // > put
  put: put,
  // > post
  post: post,
  // > remove
  remove: remove,
  // > map
  map: map,
  // > filter
  filter: filter,
  // > reduce
  reduce: reduce
}

var _dbName = null
const _listeners = {
  error: [],
  change: [],
  complete: []
}
var _docs = []

// ### createDB
//
// ```
// var db = StorageDB('mydb')
// ```
//
module.exports = function (name) {
  _dbName = name
  return api
}

// ### changes
//
// Changes Feed will notify any registered function when a
// change has occured, by default it will provide an emitted
// list of all documents when first registered.
//
// Example:
//
// ```
// db
//   .changes({ include_docs: true, live: true })
//   .on('change', function (chg) {
//     console.log(chg)
//   })
// ```
//
function changes (options) {
  setTimeout(_ => {
    _docs = _getData()
    _docs.map(doc => {
      _listeners.change.map(fn => fn({doc: doc}))
    })
  }
  , 0)

  return {
    on: (ev, fn) => _addListener(ev, fn)
  }
}

// ### post document
//
// post document creates a new json document with a generated
// id and rev.
//
// ``` js
// db.post({ foo: 'bar'})
// ```
//
function post (doc) {
  try {
    doc._id = _makeid()
    doc._rev = _generateRev()
    _docs.push(doc)
    _setData()
    _listeners.change.map(fn => fn({doc: doc}))
    return { ok: true, id: doc._id, rev: doc._rev }
  } catch (e) {
    return { ok: false, message: e.message }
  }
}

// ### put document
//
// put document will take a document that should have a
// id which must be unique
//
// ``` js
// db.put({ _id: '1', _rev: '1-1', foo: 'bar'})
// ```
//
function put (doc) {
  _delete(doc)
  doc._rev = _generateRev(doc._rev)
  _docs.push(doc)
  _setData()
  _listeners.change.map(fn => fn({doc: doc}))
  return { ok: true, id: doc._id, rev: doc._rev }
}

// ### remove
//
// removes a document from the database
// the document must match the id and rev
//
// ```
// db.remove({ _id: '1', _rev: '1-1', foo: 'bar'})
// ```
//
function remove (doc) {
  _delete(doc)
  _listeners.change.map(fn => fn({doc: null}))
  return { ok: true }
}

// ### get
//
// ``` js
// db.get(1)
// ```
//
function get (id) {
  const results = _docs.filter(doc => doc._id === id)
  if (!results) { return null }
  return results[0]
}

// ### map
//
// map over all documents in the database
// and appy the passed in function to return
// a new set of results
//
// ``` js
// db.map(doc => doc._id)
// ```
//
function map (fn) {
  return _docs
    .filter(doc => !doc._deleted)
    .map(fn)
}

// ### filter
//
// the filter function will apply a filter function to all
// docs in the database
//
// ``` js
// db.filter(doc => doc.foo === 'bar')
// ```
//
function filter (fn) {
  return _docs
    .filter(doc => !doc._deleted)
    .filter(fn)
}

// ### reduce
//
// the reduce function will perform a reduce
// and return the result
//
// ``` js
// db.reduce((acc, v) => 1, 0)
// ```
//

function reduce (fn, seed) {
  return _docs
    .filter(doc => !doc._deleted)
    .reduce(fn, seed)
}

// create a unique id
function _makeid () {
  var text = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (var i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

// generate Rev ID
function _generateRev (old) {
  if (!old) { old = '0-unknown' }
  return parseInt(old.split('-')[0], 10) + 1 + '-' + _makeid()
}

// get Data from storage
function _getData () {
  return JSON.parse(window.localStorage.getItem(_dbName) || '[]')
}

// set Data from storage
function _setData () {
  window.localStorage.setItem(_dbName, JSON.stringify(_docs))
}

// add Listener
function _addListener (ev, fn) {
  _listeners[ev].push(fn)
}

// internal delete document
function _delete (doc) {
  var old = get(doc._id)
  if (old) { old._deleted = true }
}
