const express = require('express');
require('dotenv').config();
const Skill = require('./database_handler');
const apiRoutes = require('./routes/api.js');

const cors = require('cors');


const app = express();

app.use(cors({
  origin: 'https://prabesharyal.info.np',
  origin: 'https://prabesharyal-info.web.app'
}));

app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.route('/').get(function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


app.use('/api', apiRoutes);

app.use(function (req, res, next) {
  res.status(404).type('text').send('Not Found');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

const listener = app.listen(process.env.PORT || 5000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  console.log('http://localhost:' + listener.address().port);
});
module.exports = app;
