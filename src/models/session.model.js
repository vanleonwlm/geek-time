const db = require('../configs/database.config');

module.exports = {
    getByToken: (token, callback) => {
        const sql = 'select * from simple_session where is_delete = ? and token = ?';
        db.query(sql, ['N', token], (err, rows) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, rows.length > 0 ? rows[0] : null);
        });
    },

    update: (session, callback) => {
        const sql = 'update simple_session set ? where is_delete = ? and id = ?';
        db.query(sql, [session, 'N', session.id], (err, rows) => {
            if (err) {
                throw err;
            }
            callback(rows);
        });
    },
}
