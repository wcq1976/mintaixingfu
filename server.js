const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 飞书配置
const APP_ID = 'cli_a91b69b43db8dcd5';
const APP_SECRET = 'TsulBstUxSIc8cxluDPVBckxNKC5p4Tj';
const APP_TOKEN = 'QfHJbi4LYacz50s1PUAcnwBZnMd';

// 表ID
const TABLE_CUSTOMERS = 'tblPwNgcMwDeQSjb';
const TABLE_REVIEWS = 'tblchlWWhxy3qHyY';
const TABLE_TASKS = 'tblR8izzCJbPVuzj';
const TABLE_COMMENTS = 'tblXK3RnJoPRcIii';

let accessToken = '';
let tokenExpire = 0;

async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpire) return accessToken;
  const res = await axios.post('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    app_id: APP_ID,
    app_secret: APP_SECRET
  });
  accessToken = res.data.tenant_access_token;
  tokenExpire = Date.now() + (res.data.expire - 300) * 1000;
  return accessToken;
}

async function getRecords(tableId) {
  const token = await getAccessToken();
  const res = await axios.get(`https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${tableId}/records`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data.items || [];
}

async function addRecord(tableId, data) {
  const token = await getAccessToken();
  const fields = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null && value !== '') {
      fields[key] = value;
    }
  }
  const res = await axios.post(`https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${tableId}/records`, {
    fields
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data;
}

// API路由
app.get('/api/customers', async (req, res) => {
  try {
    const records = await getRecords(TABLE_CUSTOMERS);
    res.json({ items: records });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const result = await addRecord(TABLE_CUSTOMERS, req.body);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/reviews', async (req, res) => {
  try {
    const records = await getRecords(TABLE_REVIEWS);
    res.json({ items: records });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const result = await addRecord(TABLE_REVIEWS, req.body);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/tasks', async (req, res) => {
  try {
    const records = await getRecords(TABLE_TASKS);
    res.json({ items: records });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const result = await addRecord(TABLE_TASKS, req.body);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/comments', async (req, res) => {
  try {
    const records = await getRecords(TABLE_COMMENTS);
    res.json({ items: records });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/comments', async (req, res) => {
  try {
    const result = await addRecord(TABLE_COMMENTS, req.body);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
