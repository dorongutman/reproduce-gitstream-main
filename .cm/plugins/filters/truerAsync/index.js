module.exports = {
    async: true,
    filter: async (input, callback) => {
        return callback(null, true);
    }
};