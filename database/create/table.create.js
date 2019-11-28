const dbConfig = require('../../config/config.js');

dbConfig.on('connect', () => {
  console.log('connected to the db');
});

/**
 * Create Tables
 */
const createTables = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
		now_playing_movies (
			id serial PRIMARY KEY,
			genre VARCHAR[],
			image VARCHAR (250),
			runtime INT,
			director VARCHAR (50),
			release_date DATE,
			description TEXT,
			writer VARCHAR(1000),
			backdrop_path VARCHAR(250),
			movie_type VARCHAR(100),
			awards VARCHAR(250),
			official_website VARCHAR(250),
			movie_name VARCHAR(250),
			imdb_id VARCHAR(120) UNIQUE,
			original_name VARCHAR(250),
			insert_flag INT,
			live_flag INT,
			tmdb_id INT UNIQUE,
			production VARCHAR[]
		);`;

  dbConfig.query(queryText)
    .then((res) => {
      console.log(res);
      dbConfig.end();
    })
    .catch((err) => {
      console.log(err);
      dbConfig.end();
    });
}
