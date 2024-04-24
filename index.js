const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');

const app = express();
const upload = multer(); // Використовуємо multer для обробки form-data

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/test', (req, res) => {
    res.status(200).send("Test")
})

let formDataArray = [];

// Обробка POST запиту
app.post('/notification', upload.none(), (req, res) => {
    // Отримати дані з запиту
    const formData = req.body;

    // Зберегти дані у масиві
    formDataArray.push(formData);

    // Відповісти на запит
    res.send('Дані успішно отримані!');
});

// GET-запит для відображення масиву даних
app.get('/form', (req, res) => {
    // Відправити масив даних у відповідь
    res.json(formDataArray);
});


app.listen(process.env.PORT, () => {
    console.log(`it's running on http://localhost:${process.env.PORT}`);
})
