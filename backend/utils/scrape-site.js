const cheerio = require("cheerio");
const axios = require("axios");
const { Agent } = require("https");
const { BASE_URL } = require("../const"); // Ubah sesuai struktur folder kamu

const agent = new Agent({ rejectUnauthorized: false });

const scrapeSite = async (endpoint) => {
  try {
    const fetchSite = await axios.get(`${BASE_URL}${endpoint}`, {
      httpsAgent: agent,
    });
    const html = fetchSite.data;
    const status = fetchSite.status;
    const $ = cheerio.load(html);
    return { $, status };
  } catch (e) {
    return Promise.reject(e);
  }
};

module.exports = { scrapeSite };
