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
              'CREATE TABLE IF NOT EXISTS table_users(user_id INTEGER PRIMARY KEY AUTOINCREMENT, user_name VARCHAR(255), user_email VARCHAR(255), user_password VARCHAR(255), profile_image TEXT)',
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
              'CREATE TABLE IF NOT EXISTS table_pets(pet_id INTEGER PRIMARY KEY AUTOINCREMENT, pet_name VARCHAR(255), pet_race VARCHAR(255), user_id INTEGER, FOREIGN KEY(user_id) REFERENCES table_users(user_id))',
              []
            );
          } 
          // else { Caso precise adicionar alguma tabela futuramente
          //   // If the table already exists, alter the table to add the new column
          //   txn.executeSql(
          //     'ALTER TABLE table_pets ADD COLUMN pet_race VARCHAR(255)',
          //     []
          //   );
          // }
        }
      );
    });
  }
  