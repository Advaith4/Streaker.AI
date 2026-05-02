const mongoose = require('mongoose');
const xlsx = require('xlsx');
const path = require('path');
const Problem = require('./models/Problem');

const seedDB = async () => {
  try {
    require('dotenv').config({ path: path.join(__dirname, '.env') });
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/java-companion';
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Path to the excel file
    const filePath = path.join(__dirname, 'FINAL450.xlsx');
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rawData = xlsx.utils.sheet_to_json(sheet, { range: 3 });
    
    // Formatting mapping based on typical 450 DSA sheets.
    // Sometimes it's Topic, Problem, etc.
    // Normalize keys
    const formattedData = rawData.map(row => {
      const normalizedRow = {};
      for (const key in row) {
        const cleanKey = key.replace(/[\s:]/g, '').toLowerCase();
        normalizedRow[cleanKey] = row[key];
      }

      const title = normalizedRow['problem'] || normalizedRow['problemname'] || normalizedRow['title'];
      const topic = normalizedRow['topic'] || normalizedRow['topicname'] || normalizedRow['category'];

      return {
        title: title || 'Untitled Problem',
        topic: topic || 'General',
        difficulty: 'Medium',
        solved: false,
        // Google search restricted to GFG → first result is always the exact problem
        gfgUrl: `https://www.google.com/search?q=site:geeksforgeeks.org+${encodeURIComponent(title || '')}`,
        // LeetCode search for closest equivalent
        leetcodeUrl: `https://leetcode.com/search/?q=${encodeURIComponent(title || '')}`,
      };
    }).filter(p => p.title !== 'Untitled Problem');

    // Upsert — preserves solved/notes/code if problem already exists
    const ops = formattedData.map(p => ({
      updateOne: {
        filter: { title: p.title },
        update: { $setOnInsert: { solved: false, notes: '', code: '', solvedAt: null }, $set: { topic: p.topic, difficulty: p.difficulty, gfgUrl: p.gfgUrl, leetcodeUrl: p.leetcodeUrl } },
        upsert: true
      }
    }));
    const result = await Problem.bulkWrite(ops);
    console.log(`Seeded: ${result.upsertedCount} new, ${result.modifiedCount} updated, solved progress preserved.`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
