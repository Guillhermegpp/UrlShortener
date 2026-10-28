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
        const codigo = geraCodigo(texto.url)
    const resultado = await pool.query(
        "INSERT INTO urls (url_original, codigo) VALUES ($1,$2) RETURNING *",
        [texto.url, codigo]
    )

    res.json(resultado.rows[0]) 

})


function geraCodigo(url) {
    const codigo = ""
    return codigo
}


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

