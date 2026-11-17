const botao = document.querySelector("#botao-encurtar")
const inputUrl = document.querySelector("#url")
const formulario = document.querySelector("#form-url")


formulario.addEventListener("submit", (evento) => {
    evento.preventDefault()
    recebeUrl()
})

const lista = document.querySelector("#lista-links")

async function recebeUrl() {
    const url = inputUrl.value.trim()
    try {
        const resposta = await fetch("http://localhost:3000/urls", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url
            })

        })
        const dados = await resposta.json()
        console.log("Status:", resposta.status)
        console.log("Dados:", dados.erros)
        if (!resposta.ok) {
            if (resposta.status === 400) {
                if (dados.erros.hostname)
                    alert("	Domínio inválido")
                if (dados.erros.dominio)
                    alert("Verifique o endereço informado")
                if (dados.erros.protocolo)
                    alert("Utilize HTTP ou HTTPS")
                if (dados.erros.vazio)
                    alert("Informe uma URL")
                if (dados.erros.tipo)
                    alert("Tipo de dado inválido")
            } else
                alert("Ocorreu um erro no servidor")
        }
        else {
            atualizaLista()
        }
    } catch (error) {
        console.error(error)
        alert("Não foi possível conectar ao servidor")
    }
}

async function atualizaLista() {
    try {
        const resposta = await fetch("http://localhost:3000/urls")
        if (!resposta.ok) {
            throw new Error("Erro ao carregar os links")
        }
        const dados = await resposta.json()
        const linkContainer = document.querySelector("#links-container")
        linkContainer.innerHTML = ""
        for (const link of dados.toReversed()) {
            const card = document.createElement("div")
            card.classList.add("link-card")

            const linkElemento = document.createElement("a")
            const codigo = document.createElement("p")
            const acesso = document.createElement("span")

            linkElemento.classList.add("link")
            codigo.classList.add("codigo")
            acesso.classList.add("acesso")

            codigo.textContent = link.url_original
            linkElemento.textContent = `meulink.com/${link.codigo}`
            linkElemento.href = `http://localhost:3000/${link.codigo}`
            linkElemento.target = "_blank"
            linkElemento.rel = "noopener noreferrer"
            acesso.textContent = `Total de acessos: ${link.acessos}`

            card.appendChild(linkElemento)
            card.appendChild(codigo)
            card.appendChild(acesso)

            linkContainer.appendChild(card)
        }
    } catch (error) {
        console.error(error)
        alert("Não foi possível conectar ao servidor")
    }

}
