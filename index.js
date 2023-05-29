const express = require('express');
const app = express();
const port = 8000;

app.listen(port, function (err) {
    if (err) {
        console.log('error is running', err)
    }
    console.log('yes express server is running', port);
});