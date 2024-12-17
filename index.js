require('dotenv').config();
const express = require('express');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const cron = require('node-cron'); // Requiere la librería node-cron

const app = express();
const PORT = process.env.PORT || 3000;

// Array de poemasa
const poemas = [
  `El viento susurra entre las hojas,
   misterios antiguos que nunca se olvidan,
   y la luna, testigo de historias olvidadas,
   sigue su danza eterna en la oscuridad.`,

  `La luna llena ilumina la noche serena,
   sus rayos bañan el mar tranquilo,
   y las estrellas, como ojos en el cielo,
   observan en silencio el eterno destino.`,

  `Entre las montañas se esconde el sol,
   su despedida es un poema dorado,
   mientras las sombras bailan al ritmo
   de un viento suave que llena de misterio.`,

  `El océano canta su canción eterna,
   sus olas acarician la orilla con calma,
   y en cada brisa que se pierde en el horizonte,
   se encuentra un nuevo suspiro del alma.`
];


// Función para enviar el poema por correo
async function sendPoemEmail() {
  const date = new Date();
  const poemIndex = date.getDate() % poemas.length; // Se elige el poema según el día del mes
  const poemaDelDia = poemas[poemIndex];

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    },
  });

  // HTML con formato para el poema
  const htmlContent = `
    <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f9;
            padding: 20px;
          }
          .poema-container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          .poema {
            font-size: 18px;
            line-height: 1.6;
            color: #333;
            text-align: center;
          }
          .poema-title {
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
            margin-bottom: 20px;
          }
          .signature {
            margin-top: 30px;
            font-style: italic;
            text-align: right;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="poema-container">
          <div class="poema-title">Poema del Día</div>
          <div class="poema">
            ${poemaDelDia.split('\n').join('<br>')}
          </div>
          <div class="signature">
            Con cariño, <br> Tu servicio de Poemas del Día
          </div>
        </div>
      </body>
    </html>
  `;

  const message = {
    from: process.env.EMAIL,
    to: process.env.POEMAS_EMAIL,
    subject: 'Poema del Día',
    html: htmlContent,
  };

  try {
    await transporter.sendMail(message);
    console.log('Poema enviado a los correos');
  } catch (error) {
    console.error('Error al enviar el poema:', error);
  }
}

// Tarea programada para enviar las noticias y el poema a las 9 AM todos los días
cron.schedule('32 19 * * *', async () => {
  try {
    // const news = await fetchNews();
    // await sendNewsEmail(news);
    await sendPoemEmail();
    console.log('Poema enviado.');
  } catch (error) {
    console.error('Error al enviar las noticias y el poema:', error);
  }
});

// Ruta para confirmar que la API está funcionando
app.get('/', (req, res) => {
  res.send('El poema se enviará cada 24 horas');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
