const fs = require('fs')

const path = [
    '../distributors/output.json',
    '../distributors/megjelenes.xlsx'
];

for (let i = 0; i < path.length; i++) {
	//file{s} removed
    fs.unlink(path[i], (err) => {
        if (err) {
            console.error(err)
            return
        } else {
        	console.log('File(s) removed:', path[i]);
        }
    });
}