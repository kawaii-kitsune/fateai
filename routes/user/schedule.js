const express = require('express');
const router = express.Router();
// const connection = require('../../database/database');

router.get('/', (req, res) => {
//   const scheduleQuery = `
//     SELECT 
//     e.event_id,
//     e.title,
//     e.event_date,
//     e.location,
//     e.description AS event_description,
//     GROUP_CONCAT(
//         JSON_OBJECT(
//             'speaker_id', s.speaker_id,
//             'name', CONCAT(s.first_name, ' ', s.last_name),
//             'title', s.title,
//             'organization', s.organization,
//             'email', s.email,
//             'bio', s.bio,
//             'photo_url', s.photo_url
//         )
//     ) AS speakers
// FROM 
//     events e
// LEFT JOIN 
//     event_speakers es ON e.event_id = es.event_id
// LEFT JOIN 
//     speakers s ON es.speaker_id = s.speaker_id
// GROUP BY 
//     e.event_id
// ORDER BY 
//     e.event_date, e.title;

//   `;

//   connection.query(scheduleQuery, (err, schedule) => {
//     if (err) {
//       console.error('Error connecting to the database: ', err.stack);
//       return res.status(500).send('Error connecting to the database');
//     }
//     schedule.forEach(item => {
//       try {
//         item.speakers = JSON.parse(`[${item.speakers}]`);
//       } catch (e) {
//         console.error('Error parsing speakers JSON:', e);
//         item.speakers = []; // Default to an empty array if there's an error
//       }
//     });
    // console.log(schedule);
    res.render('schedule', { schedule });
  });
// });
module.exports = router;