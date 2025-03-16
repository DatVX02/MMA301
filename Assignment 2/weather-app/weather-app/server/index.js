require('dotenv').config(); // Đảm bảo gọi đầu tiên
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Route để lấy thông tin thời tiết
app.get('/api/weather/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY; // Kiểm tra giá trị
    console.log('API Key:', apiKey);

    if (!apiKey) {
      return res.status(500).json({ message: 'API key is missing' });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(404).json({ message: 'City not found' });
  }
});

// Route để lấy thông tin chi tiết
app.get('/api/weather/detail/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY; // Kiểm tra giá trị
    console.log('API Key:', apiKey);

    if (!apiKey) {
      return res.status(500).json({ message: 'API key is missing' });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(404).json({ message: 'City not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
