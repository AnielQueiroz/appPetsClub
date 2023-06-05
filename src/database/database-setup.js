// database-setup.js
import { DatabaseConnection } from './database-connection';

const db = DatabaseConnection.getConnection();

export function setupDatabase() {
  return new Promise((resolve, reject) => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_users'",
        [],
        function (tx, res) {
          console.log('ITEM USERS: ', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_users(user_id INTEGER PRIMARY KEY AUTOINCREMENT, user_name VARCHAR(255), user_email VARCHAR(255), user_password VARCHAR(255), profile_image TEXT)',
              [],
              () => {
                // Tabela 'table_users' criada com sucesso
                console.log('table_users criada com sucesso');
              },
              (error) => {
                reject(error);
              }
            );
          }
        }
      );

      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_pets'",
        [],
        function (tx, res) {
          console.log('ITEM PETS: ', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_pets(pet_id INTEGER PRIMARY KEY AUTOINCREMENT, pet_name VARCHAR(255), pet_race VARCHAR(255), is_donating INTEGER DEFAULT 0, is_match INTEGER DEFAULT 0, total_likes INTEGER DEFAULT 0, user_id INTEGER, FOREIGN KEY(user_id) REFERENCES table_users(user_id))',
              [],
              () => {
                // Tabela 'table_pets' criada com sucesso
                console.log('table_pets criada com sucesso');
                resolve();
              },
              (error) => {
                reject(error);
              }
            );
          } else {
            resolve();
          }
        }
      );

      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS table_likes(like_id INTEGER PRIMARY KEY AUTOINCREMENT, pet_id INTEGER, user_id INTEGER, like_date DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(pet_id) REFERENCES table_pets(pet_id), FOREIGN KEY(user_id) REFERENCES table_users(user_id))',
        [],
        () => {
          // Tabela 'table_likes' criada com sucesso
          console.log('table_likes criada com sucesso');
        },
        (error) => {
          reject(error);
        }
      );
      
    });
  });
}
