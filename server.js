import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import db from './config/mongoose.js';
import routes from './routes/index.js';

const app = express();
const port = 3000;

// Include static files
app.use(express.static('./assets'));

// Route for CSV path
app.use('/uploads', express.static('./uploads'));

app.use(expressLayouts);

// Extract styles and script from sub pages
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// Set view engine to ejs
app.set('view engine', 'ejs');

// Set views to views folder
app.set('views', './views');

// To read through req use urlEncoder
app.use(express.urlencoded({ extended: true }));

// Set routes
app.use('/', routes);

app.listen(port, (err) => {
    if (err) {
        console.log('Error', err);
        return;
    }
    console.log(`Connected To Server on port: ${port}`);
});
