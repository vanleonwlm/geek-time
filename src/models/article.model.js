const db = require('../configs/database.config');

module.exports = {
    list: (columnId, callback) => {
        const sql = 'select * from article where is_delete = ? and column_id = ?';
        db.query(sql, ['n', columnId], (err, rows) => {
            if (err) {
                callback(err, []);
                return;
            }
            callback(null, rows);
        });
    },

    get: (id, callback) => {
        const sql = 'select * from article where is_delete = ? and id = ?';
        db.query(sql, ['n', id], (err, rows) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, rows.length > 0 ? rows[0] : null);
        });
    },
}
