const botao = document.querySelector("#botao-encurtar")
const inputUrl = document.querySelector("#url")
const formulario = document.querySelector("#form-url")
const mensagem = document.querySelector("#mensagem")


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
        if (!resposta.ok) {
            if (resposta.status === 400) {
                if (dados.erros.hostname)
                    mostrarMensagem("Verifique o endereço informado", "erro")
                if (dados.erros.dominio)
                    mostrarMensagem("Domínio inválido", "erro")
                if (dados.erros.protocolo)
                    mostrarMensagem("Utilize HTTP ou HTTPS", "erro")
                if (dados.erros.vazio)
                    mostrarMensagem("Informe uma URL", "aviso")
                if (dados.erros.tipo)
                    mostrarMensagem("Tipo de dado inválido", "erro")
            } else
                mostrarMensagem("Ocorreu um erro no servidor", "erro")
        }
        else {
            if (dados.jaExiste) {
                mostrarMensagem(`URL já existe

                    URL: ${dados.url_original}
                    Código: ${dados.codigo}`, "aviso")
            } else {
                mostrarMensagem("URL encurtada com sucesso!", "sucesso")
            }
        }

        inputUrl.value = ""
        atualizaLista()
    } catch (error) {
        console.error(error)
        mostrarMensagem("Não foi possível conectar ao servidor", "erro")
    }
}


function mostrarMensagem(texto, tipo) {
    console.log(texto)
    mensagem.classList.remove("sucesso", "aviso", "erro")
    mensagem.textContent = texto
    mensagem.classList.add(tipo)
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
            const botaoRemover = document.createElement("button")

            botaoRemover.textContent = "Remover"
            botaoRemover.classList.add("botao-remover")


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

            card.appendChild(botaoRemover)
            botaoRemover.addEventListener("click", () => {
                if (window.confirm("Deseja realmente excluir?"))
                    removerUrl(link.id)
            })
        }
    } catch (error) {
        console.error(error)
        mostrarMensagem("Não foi possível conectar ao servidor", "erro")
    }

}

async function removerUrl(id) {
    try {
        const resposta = await fetch(`http://localhost:3000/urls/${id}`, {
            method: "DELETE"
        })

        if (!resposta.ok) {
            mostrarMensagem("Erro ao remover URL", "erro")
            return
        }

        mostrarMensagem("URL apagada com sucesso", "sucesso")
        atualizaLista()

    } catch (erro) {
        console.error(erro)
        mostrarMensagem("Não foi possível conectar ao servidor", "erro")
    }
}