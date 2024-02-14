module.exports = {
    isEmpty: (str) => {
        return typeof str == 'undefined' || str == null || str === '';
    },
}
