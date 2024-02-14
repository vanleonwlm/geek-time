const db = require('../configs/database.config');

module.exports = {
    list: (callback) => {
        const sql = `select * from \`column\` where is_delete = ? order by create_time asc`;
        db.query(sql, ['n'], (err, rows) => {
            if (err) {
                throw err;
            }
            callback(null, rows);
        });
    },

    get: (id, callback) => {
        const sql = `select * from \`column\` where is_delete = ? and id = ?`;
        db.query(sql, ['n', id], (err, rows) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, rows.length > 0 ? rows[0] : null);
        });
    },
}
