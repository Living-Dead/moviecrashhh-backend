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
}

module.exports = cinemaHelpers;