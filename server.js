const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const documentSchema = new mongoose.Schema({
  docType: String,
  fields: { fatherName: String, address: String },
  photo: String,
});

const Document = mongoose.model('Document', documentSchema);

app.get('/documents', async (req, res) => {
  try {
    const documents = await Document.find();
    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/upload', async (req, res) => {
  try {
    const { docType, fields, photo } = req.body;
    const newDocument = new Document({ docType, fields, photo });
    await newDocument.save();
    res.status(201).json({ message: "Document saved successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/delete/:id', async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
