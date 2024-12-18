require('dotenv').config();
const express = require('express');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const cron = require('node-cron'); // Requiere la librería node-cron

// le poemas = require('./poemas')
const poemas = [
  {
      texto: `No te amo como si fueras rosa de sal, topacio,
      o flecha de claveles que propagan el fuego:
      te amo como se aman ciertas cosas oscuras,
      secretamente, entre la sombra y el alma.`,
      autor: 'Pablo Neruda'
  },
  {
      texto: `¿Qué es poesía?, dices mientras clavas
      en mi pupila tu pupila azul.
      ¡Qué es poesía! ¿Y tú me lo preguntas?
      Poesía... eres tú.`,
      autor: 'Gustavo Adolfo Bécquer'
  },
  {
      texto: `Mano la verdad me quedé sin poemas,
      jskasjksa, deme tiempo y hoy subo más xd`,
      autor: 'Pirlé re gonorré'
  },
  {
      texto: `Tus manos son mi caricia,
      mis acordes cotidianos.
      Te quiero porque tus manos
      trabajan por la justicia.`,
      autor: 'Mario Benedetti'
  },
  {
      texto: `Verde que te quiero verde.
      Verde viento. Verdes ramas.
      El barco sobre la mar
      y el caballo en la montaña.`,
      autor: 'Federico García Lorca'
  },
  {
      texto: `¿Dónde estarán los siglos, dónde el sueño
      de espadas que los tártaros soñaron,
      dónde los fuertes muros que allanaron,
      dónde el árbol de Adán y la otra leña?`,
      autor: 'Jorge Luis Borges'
  },
  {
      texto: `Caminante, son tus huellas
      el camino y nada más;
      caminante, no hay camino,
      se hace camino al andar.`,
      autor: 'Antonio Machado'
  },
  {
      texto: `Entre ir y quedarse, duda el día,
      enamorado de su transparencia;
      la tarde circular es ya del río,
      y una serenidad se anuncia en el alma.`,
      autor: 'Octavio Paz'
  },
  {
      texto: `Shall I compare thee to a summer's day?
      Thou art more lovely and more temperate:
      Rough winds do shake the darling buds of May,
      And summer's lease hath all too short a date.`,
      autor: 'William Shakespeare'
  },
  {
      texto: `En tu luz aprendo a amar.
      En tu belleza, a escribir poemas.
      Bailas dentro de mi pecho
      donde nadie te ve.`,
      autor: 'Rumi'
  },
  {
      texto: `Hope is the thing with feathers
      That perches in the soul,
      And sings the tune without the words,
      And never stops at all.`,
      autor: 'Emily Dickinson'
  },
  {
      texto: `Dame la mano y danzaremos;
      dame la mano y me amarás.
      Como una sola flor seremos,
      como una flor, y nada más.`,
      autor: 'Gabriela Mistral'
  },
  {
      texto: `Y yo me iré. Y se quedarán los pájaros cantando;
      y se quedará mi huerto, con su verde árbol,
      y con su pozo blanco.`,
      autor: 'Juan Ramón Jiménez'
  },
  {
      texto: `Este que ves, engaño colorido,
      que, del arte ostentando los primores,
      con falsos silogismos de colores
      es cauteloso engaño del sentido.`,
      autor: 'Sor Juana Inés de la Cruz'
  },
  {
      texto: `Dientes de flores, cofia de rocío,
      manos de hierbas, tú, nodriza fina,
      tenme prestas las sábanas terrosas
      y el edredón de musgos escardados.`,
      autor: 'Alfonsina Storni'
  },
  {
      texto: `Hay golpes en la vida, tan fuertes... ¡Yo no sé!
      Golpes como del odio de Dios; como si ante ellos,
      la resaca de todo lo sufrido
      se empozara en el alma... ¡Yo no sé!`,
      autor: 'César Vallejo'
  },
  {
      texto: `La princesa está triste... ¿Qué tendrá la princesa?
      Los suspiros se escapan de su boca de fresa,
      que ha perdido la risa, que ha perdido el color.`,
      autor: 'Rubén Darío'
  },
  {
      texto: `El Poeta es semejante al príncipe de las nubes
      que frecuenta la tormenta y se ríe del arquero;
      exiliado en la tierra, entre burlas y abucheos,
      sus alas de gigante le impiden caminar.`,
      autor: 'Charles Baudelaire'
  },
  {
      texto: `Muy cerca de mi ocaso, yo te bendigo, vida,
      porque nunca me diste ni esperanza fallida,
      ni trabajos injustos, ni pena inmerecida.`,
      autor: 'Amado Nervo'
  },
  {
      texto: `Me celebro y me canto a mí mismo.
      Y lo que yo diga de mí ahora,
      lo digo de ti,
      porque lo que yo tengo lo tienes tú también.`,
      autor: 'Walt Whitman'
  },
  {
      texto: `En mi cuaderno de escolar
      en mi pupitre y los árboles
      en la arena y en la nieve
      escribo tu nombre.`,
      autor: 'Paul Éluard'
  }
];
// exports.module = poemas

const app = express();
const PORT = process.env.PORT || 3000;
//   `El viento susurra entre las hojas,
//    misterios antiguos que nunca se olvidan,
//    y la luna, testigo de historias olvidadas,
//    sigue su danza eterna en la oscuridad.`,

//   `La luna llena ilumina la noche serena,
//    sus rayos bañan el mar tranquilo,
//    y las estrellas, como ojos en el cielo,
//    observan en silencio el eterno destino.`,

//   `Entre las montañas se esconde el sol,
//    su despedida es un poema dorado,
//    mientras las sombras bailan al ritmo
//    de un viento suave que llena de misterio.`,

//   `El océano canta su canción eterna,
//    sus olas acarician la orilla con calma,
//    y en cada brisa que se pierde en el horizonte,
//    se encuentra un nuevo suspiro del alma.`
// ];


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
    <html lang="es">
    <head>

      <style>
          * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
          }
          .poema-container {
              font-family: 'Georgia', serif;
              background: linear-gradient(to bottom right, #fdfcfb, #e2d1c3);
              border-radius: 12px;
              padding: 40px 8px;
              width: 500px;
              max-width: 800px;
              min-width: 400px;
              box-shadow: 0 8px 20px rgba(0, 0, 0, 0.407);
              text-align: center;
              line-height: 1.8;
          }
          .poema-title {
              font-size: 32px;
              font-weight: bold;
              color: #8B0000;
              margin-bottom: 20px;
              text-transform: uppercase;
          }
          .poema {
              font-size: 21px;
              white-space: pre-line;
              color: black;
              margin-bottom: 30px;
              font-style: italic;
          }
          .signature {
              margin-top: 20px;
              font-size: 18px;
              font-style: italic;
              color: #000000;
              font-weight: bold;
          }
          .author {
              margin-top: 10px;
              font-size: 20px;
              font-weight: bold;
              color: #8B0000;
          }
      </style>
  </head>
  
  <body>
      <div class="poema-container">
        <div class="poema-title">Poema del Día</div>
        <div class="poema">${poemaDelDia.texto.split('\n').join('<br>')}</div>
        <div class="autor">- ${poemaDelDia.autor}</div>
        <div class="signature">Con cariño, <br> Tu servicio de Poemas del Día</div>
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
cron.schedule('0 13 * * *', async () => { // COL = 8 AM - USA 13 PM (0 13 * * *)= 8 am
  try { 
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
