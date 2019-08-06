const bcrypt = require('bcrypt');
const pg = require('pg');
const pool = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432'
});

var xxx = false;

class passwordBcrypt {
    cryptPassword(saltRounds, ssn, res) {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(ssn.password, salt, function(err, hash) {
                // Store hash in your password DB.
                console.log('HASHHHH',hash, ssn);
                pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [ssn.name, ssn.email, hash], (error, results) => {
                    console.log(error, results);
                    if (error) {
                        console.log('an error occured');
                    }
                    res.json({
                        ok: true,
                        success: true,
                        message: 'Sikeres reg',
                    });
                })
            });
        });
    }

    comparePassword(password, hash) {
        bcrypt.compare(password, hash, function(err, res) {
            console.log('res', res);
            xxx = res;
            return res;

            // res == true or false
        });
        return xxx
    }

}

module.exports = passwordBcrypt;