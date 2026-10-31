const express = require("express")
const app = express()

require("dotenv").config()

const { Pool } = require("pg")

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

app.use(express.json())

app.listen(3000)


app.get("/", (req, res) => {
    res.send("Servidor funcionando")
})

app.post("/urls", async (req, res) => {
    const texto = validaUrl(req.body)
    if (!texto.valido)
        return res.status(400).json({
            mensagem: "Dados inválidos",
        })
    while (true) {
        const codigo = geraCodigo(texto.url)
        try {
            const resultado = await pool.query(
                "INSERT INTO urls (url_original, codigo) VALUES ($1,$2) RETURNING *",
                [texto.url, codigo]
            )
            return res.json(resultado.rows[0])
        }
        catch (error) {
            if (error.code === "23505")
                continue
            throw error
        }

    }
})

app.get("/urls", async (req, res) => {

    const resultado = await pool.query("SELECT * FROM urls")

    res.json(resultado.rows)
})

app.get("/:codigo", async (req, res) => {
    const codigo = req.params.codigo

    const resultado = await pool.query('SELECT * FROM urls WHERE codigo = $1', [codigo]);

    if (resultado.rows.length === 0)
        return res.status(404).json({
            mensagem: "URL não encontrada"
        })
    else {
        const [url] = resultado.rows
        await pool.query(
            `UPDATE urls
            SET acessos = acessos + 1
            WHERE codigo = $1
            `,
            [codigo],
        )
        res.redirect(url.url_original)
    }
})




function geraCodigo(caracteres) {
    let codigo = ""

    for (let i = 0; i < 6; i++) {
        let caractere
        do {
            caractere = caracteres[Math.floor(Math.random() * caracteres.length)]
        } while (caractere === "/")
        codigo += caractere
    }
    return codigo
}
//Invoke-RestMethod -Method Post -Uri "http://localhost:3000/urls" -ContentType "application/json" -Body '{"url":"https://google.com"}'

function validaUrl(urls) {
    const { url } = urls
    const resultado = {
        valido: true,
        erros: {}
    }
    if (typeof url === 'string') {
        if (url.trim() !== "") {
            if (!url.startsWith("https://") && !url.startsWith("http://")) {
                resultado.valido = false
                resultado.erros.protocolo = true
            }
        } else {
            resultado.erros.vazio = true
            resultado.valido = false
        }
    }
    else {
        resultado.valido = false
        resultado.erros.tipo = true
    }

    if (resultado.valido === true) {
        resultado.url = url
    }

    return resultado
}

