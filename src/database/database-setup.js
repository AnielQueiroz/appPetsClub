// database-setup.js
import { DatabaseConnection } from './database-connection';

const db = DatabaseConnection.getConnection();

export function setupDatabase() {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_users'",
        [],
        function (tx, res) {
          console.log('item: ', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_users(user_id INTEGER PRIMARY KEY AUTOINCREMENT, user_name VARCHAR(255), user_email VARCHAR(255), user_password VARCHAR(255))',
              []
            );
          }
        }
      );
  
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_pets'",
        [],
        function (tx, res) {
          console.log('item: ', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_pets(pet_id INTEGER PRIMARY KEY AUTOINCREMENT, pet_name VARCHAR(255), user_id INTEGER, FOREIGN KEY(user_id) REFERENCES table_users(user_id))',
              []
            );
          }
        }
      );
    });
  }
  