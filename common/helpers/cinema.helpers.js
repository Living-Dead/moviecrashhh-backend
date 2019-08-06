class cinemaHelpers {

    imdbSearchFormat(str) {
        var string = '';
        var chart = '';
        for (let i = 0; i < str.length; i++) {

            string = string + str.charAt(i)
                .replace(" ", "_")
                .replace("á", "a")
                .replace("é", "e")
                .replace("í", "i")
                .replace("ó", "o")
                .replace("ö", "o")
                .replace("ő", "o")
                .replace("ú", "u")
                .replace("ű", "u")
                .replace("ü", "u")
                .replace("–", "-")
                .replace(/[^_!a-zA-Z ]/g, "")
                .toLowerCase();

        }
        return string;
    }
    databaseStructure(db) {
        var update = [];
        var settings = '';
        if (db.condition.length > 1) {
            for (let i = 0; i < db.condition.length; i++) {
                update.push(db.condition[i]);
            }
        } else {
            update = db.condition;
        }

        if (typeof db.clause !== 'undefined' && db.clause !== '') {
            //settings = update.join(', ') + db.clause;
            if (db.condition.length > 1) {
                for (let i = 0; i < db.clauseCondition.length; i++) {
                    settings.push(db.caluse + db.clauseCondition[i]);
                }
            }
        } else {
            settings = update.join(', ')
        }

        var query = [db.statement] + [db.tableName] + [settings] + ';';
             console.log(query);
        return query.toString();
    }
}

module.exports = cinemaHelpers;