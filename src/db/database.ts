import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import {appSchema, Database} from '@nozbe/watermelondb';

const version = 1;

const schema = appSchema({version, tables: []});

const adapter = new SQLiteAdapter({schema});

const database = new Database({
  adapter,
  modelClasses: [],
});

export default database;
