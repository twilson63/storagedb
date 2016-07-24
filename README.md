# StorageDB

A browser database api similar to pouchdb wrapped around localStorage.

[See Docs](docs)

## Install

```
npm install storagedb -S
```

## Usage

```
const StorageDB = require('storagedb')
const db = StorageDB('foo')
db.changes({ include_docs: true, live: true})
  .on('change', chg => console.log(chg.doc))
db.post({type: 'widgets', name: 'bar'})
```

## Testing

```
npm test
```

## Contributing

pull requests are welcome

## LICENSE

MIT
