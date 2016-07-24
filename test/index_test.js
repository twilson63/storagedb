global.window = {}
global.window.localStorage = require('localStorage')

const StorageDB = require('../')
const test = require('tape')

// currently just tesing happy path

test('create database', t => {
  t.plan(1)

  const db = StorageDB('foo')
  t.ok(db)
})

test('post document', t => {
  t.plan(1)
  const db = StorageDB('foo')
  var result = db.post({foo: 'bar'})
  t.ok(result.ok)
})

test('get document', t => {
  t.plan(1)
  const db = StorageDB('foo')
  var result = db.post({foo: 'bar'})
  var doc = db.get(result.id)
  t.equals(doc.foo, 'bar')
})

test('put document', t => {
  t.plan(1)
  const db = StorageDB('foo')
  var result = db.put({id: 'baz', foo: 'bar'})
  t.ok(result.ok)
})

test('remove document', t => {
  t.plan(2)
  const db = StorageDB('foo')
  const result = db.post({foo: 'bar'})
  t.ok(result.ok)
  const result2 = db.remove({ _id: result.id, _rev: result._rev })
  t.ok(result2.ok)
})
