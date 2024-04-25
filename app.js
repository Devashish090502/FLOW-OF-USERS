const express = require('express');
const bodyParser = require('body-parser');
const astrologerRoutes = require('./routes/astrologerRoutes');

const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use('/astrologer', astrologerRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
