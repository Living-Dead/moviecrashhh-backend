const dbConfig = require('../../config/config.js');
const cinemaHelpers = require('../../common/helpers/cinema.helpers.js');
let updateHelpers = new cinemaHelpers();

module.exports = {
    updateInsertFlag: function(object) {
    	var update = object;
    	var query = updateHelpers.databaseStructure(update);
    	/*var update = [];
        for (let i = 0; i < object.condition.length; i++) {
            update.push(object.condition[i]);
        }

        var query = [object.statement] +
        	[object.tableName] +
        	update.join(', ') + ';';
        	*/

        dbConfig.query(query, (error, results) => {
            console.log('insert_flag: UPDATE - NULL', results);
        });
    },
};