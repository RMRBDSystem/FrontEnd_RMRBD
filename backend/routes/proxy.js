// In your backend server
app.get('/api/proxy-pdf', async (req, res) => {
  try {
    const pdfUrl = req.query.url;
    const response = await fetch(pdfUrl);
    const buffer = await response.buffer();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch PDF' });
  }
}); 