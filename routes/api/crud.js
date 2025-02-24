const express = require('express');
const router = express.Router();
// const connection = require('../../database/database');



router.get('/blogs', (req, res) => {
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
        res.json(results);
    });

});

router.get('/blogs/:id', (req, res) => {
    const blogId = req.params.id;
    const query = `
      SELECT blogs.*, users.username, users.email	
      FROM blogs
      JOIN users ON blogs.author_id = users.user_id
      WHERE blogs.blog_id = ?
    `;
    connection.query(query, [blogId], (err, results) => {
        if (err) {
            console.error('Error fetching blog:', err);
            return res.status(500).send('Error fetching blog');
        }
        if (results.length === 0) {
            return res.status(404).send('Blog not found');
        }
        res.json(results);
    });
});


// Handle blog posting
router.post('/blogs', (req, res) => {
    const { title, content, author_id, created_at, updated_at } = req.body;
    console.log('Received Body:', req.body); // Debugging step
    if (!title || !content || !author_id) {
        return res.status(400).json({ message: 'Title, content, and author are required.' });
    }

    // Convert ISO 8601 datetime to MySQL datetime format
    const createdAt = new Date(created_at).toISOString().slice(0, 19).replace('T', ' ');
    const updatedAt = new Date(updated_at).toISOString().slice(0, 19).replace('T', ' ');

    const query = 'INSERT INTO blogs (title, content, author_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [title, content, author_id, createdAt, updatedAt], (err, result) => {
        if (err) {
            console.error('Error inserting blog post:', err);
            return res.status(500).json({ message: 'Error inserting blog post' });
        }
        res.status(201).json({ message: 'Blog post created successfully', blogId: result.insertId });
    });
});

router.post('/blogs/edit/:id', (req, res) => {
    console.log('Received Body:', req.body); // Debugging step

    const blogId = req.params.id;
    const { blog_title, text_content } = req.body;

    if (!blog_title || !text_content) {
        return res.status(400).json({ message: 'Title and content are required.' });
    }

    const query = 'UPDATE blogs SET title = ?, content = ?, updated_at = ? WHERE blog_id = ?';
    const updated_at = new Date();

    connection.query(query, [blog_title, text_content, updated_at, blogId], (err, result) => {
        if (err) {
            console.error('Error updating blog post:', err);
            return res.status(500).json({ message: 'Error updating blog post' });
        }

        res.json({ message: 'Blog post updated successfully' });
    });
});

// Handle blog deletion
router.get('/blogs/delete/:id', (req, res) => {
    const blogId = req.params.id;
    const query = 'DELETE FROM blogs WHERE blog_id = ?';
    connection.query(query, [blogId], (err, result) => {
        if (err) {
            console.error('Error deleting blog post:', err);
            return res.status(500).json({ message: 'Error deleting blog post' });
        }
        res.json({ message: 'Blog post deleted successfully' });
    });
});

// Get all pricing
router.get('/pricing', (req, res) => {
    const query = 'SELECT * FROM pricing';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching pricing:', err);
            return res.status(500).send('Error fetching pricing');
        }
        res.json(results);
    });
});

// Get a single pricing by ID
router.get('/pricing/:id', (req, res) => {
    const pricingId = req.params.id;
    const query = 'SELECT * FROM pricing WHERE pricing_id = ?';
    connection.query(query, [pricingId], (err, results) => {
        if (err) {
            console.error('Error fetching pricing:', err);
            return res.status(500).send('Error fetching pricing');
        }
        if (results.length === 0) {
            return res.status(404).send('Pricing not found');
        }
        res.json(results);
    });
});

// Create a new pricing
router.post('/pricing', (req, res) => {
    const { pricing_name, event_id, price, currency, description } = req.body;
    const created_at = new Date();
    const updated_at = new Date();

    const query = 'INSERT INTO pricing (pricing_name, event_id, price, currency, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [pricing_name, event_id, price, currency, description, created_at, updated_at], (err, result) => {
        if (err) {
            console.error('Error inserting pricing:', err);
            return res.status(500).json({ message: 'Error inserting pricing' });
        }
        res.status(201).json({ message: 'Pricing created successfully', pricingId: result.insertId });
    });
});

// Update an existing pricing
router.post('/pricing/edit/:id', (req, res) => {
    const pricingId = req.params.id;
    const { pricing_name, event_id, price, currency, description } = req.body;

    if (!pricing_name || !event_id || !price || !currency || !description) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const query = 'UPDATE pricing SET pricing_name = ?, event_id = ?, price = ?, currency = ?, description = ?, updated_at = ? WHERE pricing_id = ?';
    const updated_at = new Date();

    connection.query(query, [pricing_name, event_id, price, currency, description, updated_at, pricingId], (err, result) => {
        if (err) {
            console.error('Error updating pricing:', err);
            return res.status(500).json({ message: 'Error updating pricing' });
        }

        res.json({ message: 'Pricing updated successfully' });
    });
});

// Delete a pricing
router.get('/pricing/delete/:id', (req, res) => {
    const pricingId = req.params.id;
    const query = 'DELETE FROM pricing WHERE pricing_id = ?';
    connection.query(query, [pricingId], (err, result) => {
        if (err) {
            console.error('Error deleting pricing:', err);
            return res.status(500).json({ message: 'Error deleting pricing' });
        }
        res.json({ message: 'Pricing deleted successfully' });
    });
});

// Get all speakers
router.get('/speakers', (req, res) => {
    const query = 'SELECT * FROM speakers';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching speakers:', err);
            return res.status(500).send('Error fetching speakers');
        }
        res.json(results);
    });
});

// Get a single speaker by ID
router.get('/speakers/:id', (req, res) => {
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
        res.json(results);
    });
});

// Create a new speaker
router.post('/speakers', (req, res) => {
    const { first_name, last_name, title, organization, email, bio, photo_url, session_id } = req.body;
    const created_at = new Date();
    const updated_at = new Date();

    const query = 'INSERT INTO speakers (first_name, last_name, title, organization, email, bio, photo_url, session_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [first_name, last_name, title, organization, email, bio, photo_url, session_id, created_at, updated_at], (err, result) => {
        if (err) {
            console.error('Error inserting speaker:', err);
            return res.status(500).json({ message: 'Error inserting speaker' });
        }
        res.status(201).json({ message: 'Speaker created successfully', speakerId: result.insertId });
    });
});

// Update an existing speaker
router.post('/speakers/edit/:id', (req, res) => {
    const speakerId = req.params.id;
    const { first_name, last_name, title, organization, email, bio, photo_url, session_id } = req.body;

    if (!first_name || !last_name || !title || !organization || !email || !bio || !photo_url || !session_id) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const query = 'UPDATE speakers SET first_name = ?, last_name = ?, title = ?, organization = ?, email = ?, bio = ?, photo_url = ?, session_id = ?, updated_at = ? WHERE speaker_id = ?';
    const updated_at = new Date();

    connection.query(query, [first_name, last_name, title, organization, email, bio, photo_url, session_id, updated_at, speakerId], (err, result) => {
        if (err) {
            console.error('Error updating speaker:', err);
            return res.status(500).json({ message: 'Error updating speaker' });
        }

        res.json({ message: 'Speaker updated successfully' });
    });
});

// Delete a speaker
router.get('/speakers/delete/:id', (req, res) => {
    const speakerId = req.params.id;
    const query = 'DELETE FROM speakers WHERE speaker_id = ?';
    connection.query(query, [speakerId], (err, result) => {
        if (err) {
            console.error('Error deleting speaker:', err);
            return res.status(500).json({ message: 'Error deleting speaker' });
        }
        res.json({ message: 'Speaker deleted successfully' });
    });
});

// Get all events
router.get('/events', (req, res) => {
    const query = `
        SELECT events.event_id, events.title, events.description, events.location, 
               events.event_date, events.created_at,
               COALESCE(GROUP_CONCAT(categories.name SEPARATOR ', '), '') AS categories
        FROM events
        LEFT JOIN event_categories ON events.event_id = event_categories.event_id
        LEFT JOIN categories ON event_categories.category_id = categories.category_id
        GROUP BY events.event_id
        ORDER BY events.event_date DESC;
    `;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching events:', err);
            return res.status(500).send('Error fetching events');
        }
        res.json(results);
    });
});

// Get a single event by ID
router.get('/events/:id', (req, res) => {
    const eventId = req.params.id;
    const query = `
        SELECT events.event_id, events.title, events.description, events.location, 
               events.event_date, events.created_at,
               COALESCE(GROUP_CONCAT(categories.name SEPARATOR ', '), '') AS categories
        FROM events
        LEFT JOIN event_categories ON events.event_id = event_categories.event_id
        LEFT JOIN categories ON event_categories.category_id = categories.category_id
        WHERE events.event_id = ?
        GROUP BY events.event_id;
    `;
    connection.query(query, [eventId], (err, results) => {
        if (err) {
            console.error('Error fetching event:', err);
            return res.status(500).send('Error fetching event');
        }
        if (results.length === 0) {
            return res.status(404).send('Event not found');
        }
        res.json(results[0]); // Return a single event object instead of an array
    });
});

router.post('/events', (req, res) => {
    const { title, description, location, event_date, categories } = req.body; // Expecting categories as an array
    const created_at = new Date();

    if (!title || !description || !location || !event_date || !categories || categories.length === 0) {
        return res.status(400).json({ message: 'All fields including categories are required.' });
    }

    const insertEventQuery = `
        INSERT INTO events (title, description, location, event_date, created_at) 
        VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(insertEventQuery, [title, description, location, event_date, created_at], (err, result) => {
        if (err) {
            console.error('Error inserting event:', err);
            return res.status(500).json({ message: 'Error inserting event' });
        }

        const eventId = result.insertId;

        // Insert event-category relationships
        const insertEventCategoryQuery = `
            INSERT INTO event_categories (event_id, category_id) VALUES ?
        `;

        const eventCategoryValues = categories.map(categoryId => [eventId, categoryId]);

        connection.query(insertEventCategoryQuery, [eventCategoryValues], (err) => {
            if (err) {
                console.error('Error inserting event categories:', err);
                return res.status(500).json({ message: 'Error inserting event categories' });
            }
            res.status(201).json({ message: 'Event created successfully', eventId });
        });
    });
});


router.post('/events/edit/:id', (req, res) => {
    const eventId = req.params.id;
    const { title, description, location, event_date, categories } = req.body; // Expecting categories as an array
    const updated_at = new Date();

    if (!title || !description || !location || !event_date || !categories || categories.length === 0) {
        return res.status(400).json({ message: 'All fields including categories are required.' });
    }

    const updateEventQuery = `
        UPDATE events 
        SET title = ?, description = ?, location = ?, event_date = ?, updated_at = ? 
        WHERE event_id = ?
    `;

    connection.query(updateEventQuery, [title, description, location, event_date, updated_at, eventId], (err) => {
        if (err) {
            console.error('Error updating event:', err);
            return res.status(500).json({ message: 'Error updating event' });
        }

        // Delete existing categories for the event
        const deleteCategoriesQuery = `
            DELETE FROM event_categories WHERE event_id = ?
        `;

        connection.query(deleteCategoriesQuery, [eventId], (err) => {
            if (err) {
                console.error('Error deleting old event categories:', err);
                return res.status(500).json({ message: 'Error updating event categories' });
            }

            // Insert new categories
            const insertEventCategoryQuery = `
                INSERT INTO event_categories (event_id, category_id) VALUES ?
            `;

            const eventCategoryValues = categories.map(categoryId => [eventId, categoryId]);

            connection.query(insertEventCategoryQuery, [eventCategoryValues], (err) => {
                if (err) {
                    console.error('Error inserting updated event categories:', err);
                    return res.status(500).json({ message: 'Error updating event categories' });
                }
                res.json({ message: 'Event updated successfully' });
            });
        });
    });
});

// Delete an event
router.get('/events/delete/:id', (req, res) => {
    const eventId = req.params.id;

    // First, delete event-category relationships
    const deleteEventCategoriesQuery = `
        DELETE FROM event_categories WHERE event_id = ?
    `;

    connection.query(deleteEventCategoriesQuery, [eventId], (err) => {
        if (err) {
            console.error('Error deleting event categories:', err);
            return res.status(500).json({ message: 'Error deleting event categories' });
        }

        // Then, delete the event
        const deleteEventQuery = `
            DELETE FROM events WHERE event_id = ?
        `;

        connection.query(deleteEventQuery, [eventId], (err) => {
            if (err) {
                console.error('Error deleting event:', err);
                return res.status(500).json({ message: 'Error deleting event' });
            }
            res.json({ message: 'Event deleted successfully' });
        });
    });
});

// Get all categories
router.get('/categories', (req, res) => {
    const query = 'SELECT * FROM categories';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching categories:', err);
            return res.status(500).send('Error fetching categories');
        }
        res.json(results);
    });
});

// Get a single category by ID
router.get('/categories/:id', (req, res) => {
    const categoryId = req.params.id;
    const query = 'SELECT * FROM categories WHERE category_id = ?';
    connection.query(query, [categoryId], (err, results) => {
        if (err) {
            console.error('Error fetching category:', err);
            return res.status(500).send('Error fetching category');
        }
        if (results.length === 0) {
            return res.status(404).send('Category not found');
        }
        res.json(results);
    });
});

// Create a new category
router.post('/categories', (req, res) => {
    const { category_name } = req.body;
    const created_at = new Date();
    const updated_at = new Date();

    const query = 'INSERT INTO categories (category_name, created_at, updated_at) VALUES (?, ?, ?)';
    connection.query(query, [category_name, created_at, updated_at], (err, result) => {
        if (err) {
            console.error('Error inserting category:', err);
            return res.status(500).json({ message: 'Error inserting category' });
        }
        res.status(201).json({ message: 'Category created successfully', categoryId: result.insertId });
    });
});

// Update an existing category
router.post('/categories/edit/:id', (req, res) => {
    const categoryId = req.params.id;
    const { category_name } = req.body;

    if (!category_name) {
        return res.status(400).json({ message: 'Category name is required.' });
    }

    const query = 'UPDATE categories SET category_name = ?, updated_at = ? WHERE category_id = ?';
    const updated_at = new Date();

    connection.query(query, [category_name, updated_at, categoryId], (err, result) => {
        if (err) {
            console.error('Error updating category:', err);
            return res.status(500).json({ message: 'Error updating category' });
        }

        res.json({ message: 'Category updated successfully' });
    });
});

// Delete a category
router.get('/categories/delete/:id', (req, res) => {
    const categoryId = req.params.id;
    const query = 'DELETE FROM categories WHERE category_id = ?';
    connection.query(query, [categoryId], (err, result) => {
        if (err) {
            console.error('Error deleting category:', err);
            return res.status(500).json({ message: 'Error deleting category' });
        }
        res.json({ message: 'Category deleted successfully' });
    });
});


module.exports = router;