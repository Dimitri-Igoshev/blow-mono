#!/usr/bin/env node

const { MongoClient } = require('mongodb');

const remoteUri =
  'mongodb://gen_user:%7C1q%3Aam%26%25T7JZiD@109.73.205.45:27017/?authSource=admin&directConnection=true';
const localUri =
  process.env.LOCAL_MONGO_URI ||
  'mongodb://root:example@mongo:27017/blow?authSource=admin';
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

function extractHostname(uri) {
  if (typeof uri !== 'string') {
    return undefined;
  }

  const withoutScheme = uri.replace(/^mongodb(\+srv)?:\/\//, '');
  const withoutAuth = withoutScheme.includes('@')
    ? withoutScheme.split('@')[1]
    : withoutScheme;
  const hostSection = withoutAuth.split('/')[0];

  if (!hostSection) {
    return undefined;
  }

  return hostSection.split(',')[0];
}

function createHelpfulConnectionError(error, description, uri) {
  const hostFromUri = extractHostname(uri);

  const errorCode = error?.code || error?.cause?.code;

  if (errorCode === 'EAI_AGAIN' || errorCode === 'ENOTFOUND') {
    const lookupTarget = hostFromUri ? ` "${hostFromUri}"` : '';
    const hint =
      'The host name could not be resolved. Ensure that your network ' +
      'connection is available and that the configured remote MongoDB ' +
      'server is reachable.';
    return new Error(
      `Failed to connect to ${description}: DNS lookup for${lookupTarget} failed.\n${hint}`,
      { cause: error }
    );
  }

  return new Error(`Failed to connect to ${description}: ${error.message}`, {
    cause: error,
  });
}

async function connectClient(client, description, uri) {
  try {
    await client.connect();
  } catch (error) {
    throw createHelpfulConnectionError(error, description, uri);
  }
}

async function migrate() {
  const remoteClient = new MongoClient(remoteUri);
  const localClient = new MongoClient(localUri);

  console.log('Connecting to remote MongoDB...');
  await connectClient(remoteClient, 'remote MongoDB', remoteUri);
  console.log('Connecting to local MongoDB...');
  await connectClient(localClient, 'local MongoDB', localUri);

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
