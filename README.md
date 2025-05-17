# 📝 Content Summarizer App

A simple and elegant web app that allows users to summarize large blocks of text using the Hugging Face BART model. Built with **Next.js (App Router)**, **Tailwind CSS**, and **Axios**, this app provides fast, accurate, and clean summarization through a beautiful UI.

---

## 🔍 Features

- ✅ Summarize large pieces of text instantly
- ✅ Modern UI using Tailwind CSS
- ✅ Input validation and error handling
- ✅ Real-time loading feedback
- ✅ Powered by Hugging Face’s `facebook/bart-large-cnn` model

---

## 🚀 Live Demo

> Check out the live version of the project [here](https://content-summarizer-msdb.onrender.com)

---

---

## 🛠️ Tech Stack

- **Frontend:** React (Next.js App Router), Tailwind CSS
- **Backend API:** Hugging Face Inference API
- **HTTP Client:** Axios

---

## 📁 Project Structure

/app  
└── /api  
└── /summarize  
└── route.js # Server action using Hugging Face API

└── page.js # Main frontend logic

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/content-summarizer.git
cd content-summarizer

2. Install dependencies

npm install
3. Set up environment variables
Create a .env.local file in the root directory and add your Hugging Face API key:

/env
HUGGINGFACE_API_KEY=your_api_key_here
🧠 You can get an API key from https://huggingface.co/settings/tokens

4. Run the development server

npm run dev
Visit http://localhost:3000 to view the app.

💡 Usage
Paste your text into the textarea.

Click the "Summarize Content" button.

View the summarized output below.

📦 API Integration
Uses the facebook/bart-large-cnn model from Hugging Face:

http

POST https://api-inference.huggingface.co/models/facebook/bart-large-cnn
Payload:

{
  "inputs": "your content to summarize"
}
🙌 Acknowledgements
Hugging Face Transformers

Next.js Documentation

Tailwind CSS Docs
```
