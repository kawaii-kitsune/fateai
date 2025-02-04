const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const connection = require('../../database/database'); // Assuming you have a database connection module

// Set up session middleware
router.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.redirect('/admin/login');
  }
}

// Middleware to check if user is admin
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.username === 'admin') {
    return next();
  } else {
    res.status(403).send('Forbidden');
  }
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/speakers');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Login page
router.get('/login', (req, res) => {
  res.render('admin/login');
});

// Handle login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ?';
  connection.query(query, [username], async (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).send('Error fetching user');
    }
    if (results.length === 0) {
      return res.status(401).send('Invalid username or password');
    }
    const user = results[0];
    if (await bcrypt.compare(password, user.password)) {
      req.session.user = user;
      res.redirect('/admin');
    } else {
      res.status(401).send('Invalid username or password');
    }
  });
});

// Register page
router.get('/register', (req, res) => {
  res.render('admin/register');
});

// Handle registration
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  connection.query(query, [username, email, hashedPassword], (err, result) => {
    if (err) {
      console.error('Error registering user:', err);
      return res.status(500).send('Error registering user');
    }
    res.redirect('/admin/login');
  });
});

// Admin dashboard
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, '../../assets/uploads');
    const files = await fs.promises.readdir(uploadsDir);

    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM users) AS totalUsers,
        (SELECT COUNT(*) FROM events) AS totalEvents,
        (SELECT COUNT(*) FROM blogs) AS totalBlogs
    `;
    const recentActivitiesQuery = `
      SELECT 'Blog' AS type, title AS description, created_at AS date FROM blogs
      UNION
      SELECT 'User' AS type, username AS description, created_at AS date FROM users
      UNION
      SELECT 'Event' AS type, title AS description, created_at AS date FROM events
      ORDER BY date DESC LIMIT 10
    `;
    const usersQuery = 'SELECT * FROM users';
    const eventsQuery = 'SELECT * FROM events';
    const blogsQuery = `
      SELECT blogs.*, users.username AS author
      FROM blogs
      JOIN users ON blogs.author_id = users.user_id
    `;
    const speakersQuery = 'SELECT * FROM speakers';

    const [stats, recentActivities, users, events, blogs, speakers] = await Promise.all([
      new Promise((resolve, reject) => {
        connection.query(statsQuery, (err, results) => {
          if (err) return reject(err);
          resolve(results[0]);
        });
      }),
      new Promise((resolve, reject) => {
        connection.query(recentActivitiesQuery, (err, results) => {
          if (err) return reject(err);
          resolve(results);
        });
      }),
      new Promise((resolve, reject) => {
        connection.query(usersQuery, (err, results) => {
          if (err) return reject(err);
          resolve(results);
        });
      }),
      new Promise((resolve, reject) => {
        connection.query(eventsQuery, (err, results) => {
          if (err) return reject(err);
          resolve(results);
        });
      }),
      new Promise((resolve, reject) => {
        connection.query(blogsQuery, (err, results) => {
          if (err) return reject(err);
          resolve(results);
        });
      }),
      new Promise((resolve, reject) => {
        connection.query(speakersQuery, (err, results) => {
          if (err) return reject(err);
          resolve(results);
        });
      })
    ]);

    res.render('admin/dashboard', { 
      files, 
      stats, 
      recentActivities, 
      users, 
      events, 
      blogs, 
      speakers, 
      user: req.session.user 
    });
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).send('Error fetching dashboard data');
  }
});


// Handle user deletion
router.get('/users/delete/:id', isAdmin, (req, res) => {
  const userId = req.params.id;
  const query = 'DELETE FROM users WHERE user_id = ?';
  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).send('Error deleting user');
    }
    res.redirect('/admin');
  });
});
//=====================================BLOGS=================================

router.get('/blogs', isAuthenticated, (req, res) => {
  const blogsQuery = `
      SELECT blogs.*, users.username AS author
      FROM blogs
      JOIN users ON blogs.author_id = users.user_id
    `;
  connection.query(blogsQuery, (err, results) => {
    if (err) {
      console.error('Error fetching blogs:', err);
      return res.status(500).send('Error fetching blogs');
    }
    res.render('admin/blogs/blogs', { blogs: results, user: req.session.user });
  });
  
});

router.get('/blogs/edit/:id', isAuthenticated, (req, res) => {
  const blogId = req.params.id;
  const query = 'SELECT * FROM blogs WHERE blog_id = ?';
  connection.query(query, [blogId], (err, results) => {
    if (err) {
      console.error('Error fetching blog:', err);
      return res.status(500).send('Error fetching blog');
    }
    if (results.length === 0) {
      return res.status(404).send('Blog not found');
    }
    res.render('admin/blogs/edit-blog', { blog: results[0], user: req.session.user });
  });
});

router.get('/blogs/new', isAuthenticated, (req, res) => {
  res.render('admin/blogs/create-blog', { user: req.session.user });
});

// Handle blog posting
router.post('/blogs', isAuthenticated, (req, res) => {
  const { title, content } = req.body;
  const author_id = req.session.user.id;
  const created_at = new Date();
  const updated_at = new Date();

  const query = 'INSERT INTO blogs (title, content, author_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [title, content, author_id, created_at, updated_at], (err, result) => {
    if (err) {
      console.error('Error inserting blog post:', err);
      const blogsQuery = `
      SELECT blogs.*, users.username AS author
      FROM blogs
      JOIN users ON blogs.author_id = users.user_id
    `;
      connection.query(blogsQuery, (err, results) => {
        if (err) {
          console.error('Error fetching blogs:', err);
          return res.status(500).send('Error fetching blogs');
        }
        return res.render('admin/blogs/blogs', { blogs: results, user: req.session.user, message: 'Error inserting blog post' });
      }); 
    }
    const blogsQuery = `
      SELECT blogs.*, users.username AS author
      FROM blogs
      JOIN users ON blogs.author_id = users.user_id
    `;
      connection.query(blogsQuery, (err, results) => {
        if (err) {
          console.error('Error fetching blogs:', err);
          return res.status(500).send('Error fetching blogs');
        }
        res.render('admin/blogs/blogs', { user: req.session.user,message: 'Blog post created successfully' ,blogs: results });
      }); 
  });
});


router.post('/blogs/edit/:id', (req, res) => {
  console.log('Received Body:', req.body); // Debugging step

  const blogId = req.params.id;
  const { blog_title, text_content } = req.body;

  if (!blog_title || !text_content) {
      return res.status(400).send('Title and content are required.');
  }

  const query = 'UPDATE blogs SET title = ?, content = ?, updated_at = ? WHERE blog_id = ?';
  const updated_at = new Date();

  connection.query(query, [blog_title, text_content, updated_at, blogId], (err, result) => {
      if (err) {
          console.error('Error updating blog post:', err);
          return res.status(500).send('Error updating blog post');
      }
      
      res.render('/admin/blogs', { message: 'Blog post updated successfully', user: req.session.user });
  });
});


// Handle blog deletion
router.get('/blogs/delete/:id', isAdmin, (req, res) => {
  const blogId = req.params.id;
  const query = 'DELETE FROM blogs WHERE blog_id = ?';
  connection.query(query, [blogId], (err, result) => {
    if (err) {
      console.error('Error deleting blog post:', err);
      return res.status(500).send('Error deleting blog post');
    }
    res.render('/admin/blogs', { message: 'Blog post deleted successfully', user: req.session.user });
  });
});

//=====================================BLOGS=================================

// Handle event deletion
router.get('/events/delete/:id', isAdmin, (req, res) => {
  const eventId = req.params.id;
  const query = 'DELETE FROM events WHERE event_id = ?';
  connection.query(query, [eventId], (err, result) => {
    if (err) {
      console.error('Error deleting event:', err);
      return res.status(500).send('Error deleting event');
    }
    res.redirect('/admin');
  });
});

// Handle file deletion
router.get('/files/delete/:filename', isAdmin, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../assets/uploads', filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
      return res.status(500).send('Error deleting file');
    }
    res.redirect('/admin');
  });
});

// Edit speaker page
router.get('/speakers/edit/:id', isAuthenticated, (req, res) => {
  const speakerId = req.params.id;
  const query = 'SELECT * FROM speakers WHERE speaker_id = ?';
  connection.query(query, [speakerId], (err, results) => {
    if (err) {
      console.error('Error fetching speaker:', err);
      return res.status(500).send('Error fetching speaker');
    }
    if (results.length === 0) {
      return res.status(404).send('Speaker not found');
    }
    res.render('admin/edit-speaker', { speaker: results[0] });
  });
});

// Handle speaker editing
router.post('/speakers/edit/:id', isAuthenticated, upload.single('photo'), (req, res) => {
  const speakerId = req.params.id;
  const { first_name, last_name, title, organization, bio, photo_url } = req.body;
  const photo = req.file ? `/uploads/speakers/${req.file.filename}` : photo_url;

  const query = 'UPDATE speakers SET first_name = ?, last_name = ?, title = ?, organization = ?, bio = ?, photo_url = ? WHERE speaker_id = ?';
  connection.query(query, [first_name, last_name, title, organization, bio, photo, speakerId], (err, result) => {
    if (err) {
      console.error('Error updating speaker:', err);
      return res.status(500).send('Error updating speaker');
    }
    res.redirect('/admin');
  });
});

// Handle speaker deletion
router.get('/speakers/delete/:id', isAdmin, (req, res) => {
  const speakerId = req.params.id;
  const query = 'DELETE FROM speakers WHERE speaker_id = ?';
  connection.query(query, [speakerId], (err, result) => {
    if (err) {
      console.error('Error deleting speaker:', err);
      return res.status(500).send('Error deleting speaker');
    }
    res.redirect('/admin');
  });
});

// Handle logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});


module.exports = router;