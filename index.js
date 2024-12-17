require('dotenv').config();
const express = require('express');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Función para hacer scraping
async function fetchNews() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.premierleague.com/news');

  const headlines = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll('.card .title'),
      (el) => el.textContent.trim()
    )
  );

  await browser.close();
  return headlines.slice(0, 5); // Top 5 noticias
}

// Función para enviar el correo
async function sendEmail(news) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const message = {
    from: process.env.EMAIL,
    to: process.env.RECEIVER_EMAIL,
    subject: 'Premier League Noticias del Día',
    text: `Aquí tienes las últimas noticias:\n\n${news.join('\n\n')}`,
  };

  await transporter.sendMail(message);
}

// Rutas
app.get('/', async (req, res) => {
  try {
    const news = await fetchNews();
    await sendEmail(news);
    res.send('Correo enviado con noticias de la Premier League.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al enviar el correo.');
  }
});

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
