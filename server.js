// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// مجلد الملفات الثابتة
app.use(express.static(path.join(__dirname, 'public')));

const FILE = 'codes.json';

// إضافة كود جديد
app.post('/addCode', (req, res) => {
  const { name, date } = req.body;
  if (!name || !date) return res.status(400).json({ error: 'Missing name or date' });

  // توليد كود جديد
  const newCode = "MSC-" + Math.floor(1000 + Math.random() * 9000);

  // قراءة البيانات
  let data = [];
  if (fs.existsSync(FILE)) data = JSON.parse(fs.readFileSync(FILE));

  // البحث عن الزبون اليوم
  let user = data.find(u => u.name === name && u.date === date);
  if (!user) {
    user = { name, date, codes: [] };
    data.push(user);
  }

  // الحد الأقصى 5 أكواد
  if (user.codes.length >= 5) return res.json({ status: 'limit', codes: user.codes });

  user.codes.push(newCode);

  // حفظ البيانات
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

  res.json({ status: 'success', code: newCode, codes: user.codes });
});

// استرجاع جميع الأكواد
app.get('/getCodes', (req, res) => {
  let data = [];
  if (fs.existsSync(FILE)) data = JSON.parse(fs.readFileSync(FILE));
  res.json(data);
});

// تشغيل السيرفر
app.listen(3000, () => console.log('Server running on http://localhost:3000'));

