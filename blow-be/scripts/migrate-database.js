#!/usr/bin/env node

const { MongoClient } = require('mongodb');

const REQUIRED_ENV_VARS = ['REMOTE_MONGO_URI'];

for (const envVar of REQUIRED_ENV_VARS) {
  if (!process.env[envVar]) {
    console.error(
      `Missing required environment variable ${envVar}.\n` +
        'Set REMOTE_MONGO_URI to the source connection string (for example: \n' +
        "mongodb://user:password@host:27017/blow?authSource=admin)."
    );
    process.exit(1);
  }
}

const remoteUri = process.env.REMOTE_MONGO_URI;
const localUri =
  process.env.LOCAL_MONGO_URI ||
  'mongodb://root:example@127.0.0.1:27017/blow?authSource=admin';
const dbName = process.env.MONGO_DB_NAME || 'blow';
const batchSize = Number.parseInt(process.env.MIGRATION_BATCH_SIZE || '500', 10);

if (!Number.isFinite(batchSize) || batchSize <= 0) {
  console.error(
    `Invalid MIGRATION_BATCH_SIZE value "${process.env.MIGRATION_BATCH_SIZE}". ` +
      'The value must be a positive integer.'
  );
  process.exit(1);
}

const INDEX_OPTION_KEYS = [
  'name',
  'unique',
  'sparse',
  'expireAfterSeconds',
  'partialFilterExpression',
  'collation',
  'default_language',
  'language_override',
  'textIndexVersion',
  'weights',
  'sphereVersion',
  'bits',
  'min',
  'max',
  'bucketSize',
  'storageEngine',
  'wildcardProjection',
];

async function dropCollectionIfExists(db, collectionName) {
  const existing = await db.listCollections({ name: collectionName }).toArray();
  if (existing.length) {
    await db.collection(collectionName).drop();
  }
}

async function migrate() {
  const remoteClient = new MongoClient(remoteUri);
  const localClient = new MongoClient(localUri);

  console.log('Connecting to remote MongoDB...');
  await remoteClient.connect();
  console.log('Connecting to local MongoDB...');
  await localClient.connect();

  try {
    const remoteDb = remoteClient.db(dbName);
    const localDb = localClient.db(dbName);

    const collections = await remoteDb.listCollections().toArray();
    console.log(`Found ${collections.length} collections in remote database.`);

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;

      if (collectionInfo.type && collectionInfo.type !== 'collection') {
        console.log(`Skipping ${collectionName} (type: ${collectionInfo.type}).`);
        continue;
      }

      if (collectionName.startsWith('system.')) {
        console.log(`Skipping system collection ${collectionName}.`);
        continue;
      }

      console.log(`\nMigrating collection: ${collectionName}`);

      const remoteCollection = remoteDb.collection(collectionName);

      await dropCollectionIfExists(localDb, collectionName);
      const localCollection = localDb.collection(collectionName);

      const cursor = remoteCollection.find({}, { batchSize });
      let batch = [];
      let documentsCopied = 0;

      for await (const document of cursor) {
        batch.push(document);

        if (batch.length >= batchSize) {
          await localCollection.insertMany(batch, { ordered: false });
          documentsCopied += batch.length;
          console.log(`  Copied ${documentsCopied} documents...`);
          batch = [];
        }
      }

      if (batch.length > 0) {
        await localCollection.insertMany(batch, { ordered: false });
        documentsCopied += batch.length;
      }

      console.log(`  Finished data copy (${documentsCopied} documents).`);

      const remoteIndexes = await remoteCollection.indexes();

      for (const index of remoteIndexes) {
        if (index.name === '_id_') {
          continue;
        }

        const options = {};
        for (const key of INDEX_OPTION_KEYS) {
          if (Object.prototype.hasOwnProperty.call(index, key)) {
            options[key] = index[key];
          }
        }

        options.name = options.name || index.name;

        try {
          await localCollection.createIndex(index.key, options);
        } catch (error) {
          console.warn(
            `  Failed to create index ${index.name} on ${collectionName}:`,
            error.message
          );
        }
      }

      console.log(`  Indexes synchronized for ${collectionName}.`);
    }

    console.log('\nDatabase migration completed successfully.');
  } finally {
    await remoteClient.close();
    await localClient.close();
  }
}

migrate().catch((error) => {
  console.error('Database migration failed:', error);
  process.exit(1);
});
