const express = require('express');
const Sentry = require("@sentry/node");
const app = express();
const PORT = 3000;

Sentry.init({
  dsn: "https://07c64b5dc1f3d4688011872ba7ff4e5a@o4504036934418432.ingest.sentry.io/4505788210806784",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({
      tracing: true
    }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({
      app
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!,
});

// Trace incoming requests
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(Sentry.Handlers.errorHandler());

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
