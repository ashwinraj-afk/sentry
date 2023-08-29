const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.static('public'));

app.post('/api/getData', (req, res) => {
    let result = concatstr(req.body.message);
    res.json({ message: result });
});

function concatstr(str) {
    return "Hello  " + str + "  !!!";
}

app.get('/api/fetchData', (req, res) => {
    getPlaceholderResponse(res);
});

async function getPlaceholderResponse(res) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching data.' });
      }
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
