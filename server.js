const express = require('express');
const app = express();
const path = require('path');
const indexRouter = require('./routes/user/index');
const blogRouter = require('./routes/user/blog');
const aboutRouter = require('./routes/user/about');
const pricingRouter = require('./routes/user/pricing');
const speakersRouter = require('./routes/user/speakers');
const contactRouter = require('./routes/user/contact');
const scheduleRouter = require('./routes/user/schedule');
const cfpRouter = require('./routes/user/cfp');
const uploadsRouter = require('./routes/user/uploads');
// const adminRouter = require('./routes/admin/index');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api/crud');
const scRoutes = require('./routes/user/sc');
// Serve Bootstrap Icons CSS
// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static assets
app.use('/bootstrap-icons', express.static(path.join(__dirname, 'node_modules/bootstrap-icons/font/')));
app.use('/admin-assets', express.static(path.join(__dirname, './assets/admin')));

app.use('/js', express.static(path.join(__dirname, './assets/js')));
app.use('/css', express.static(path.join(__dirname, './assets/css')));
app.use('/img', express.static(path.join(__dirname, './assets/img')));
app.use('/fonts', express.static(path.join(__dirname, './assets/fonts')));
app.use('/uploads', express.static(path.join(__dirname, './assets/uploads')));
app.use('/admin/assets/uploads/submitions', express.static(path.join(__dirname, './assets/uploads/submitions')));


// Use routers
app.use('/', indexRouter);
app.use('/pricing', pricingRouter);
app.use('/about', aboutRouter);
app.use('/blog', blogRouter);
app.use('/speakers', speakersRouter);
app.use('/contact', contactRouter);
app.use('/schedule', scheduleRouter);
app.use('/cfp', cfpRouter);
app.use('/uploads', uploadsRouter);
// app.use('/admin', adminRouter);
app.use('/api', apiRoutes);
app.use('/sc', scRoutes);
// Start server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});