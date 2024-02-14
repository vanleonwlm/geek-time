const db = require('../configs/database.config');

module.exports = {
    list: (columnId, callback) => {
        const sql = 'select * from chapter where is_delete = ? and column_id = ? order by \`rank\` asc';
        db.query(sql, ['n', columnId], (err, rows) => {
            if (err) {
                callback(err, []);
                return;
            }
            callback(null, rows);
        });
    },
}
