const URL_API = 'http://localhost:5265/api/Produtos';
let modoEdicao = false;

document.addEventListener("DOMContentLoaded", listar);

async function listar() {
    const response = await fetch(URL_API);
    const produto = await response.json();
    const corpo = document.getElementById('corpo');
    corpo.innerHTML = '';
    produto.forEach(a => {
        corpo.innerHTML += `
        <tr>
            <td>${a.produtoID}</td>
            <td>${a.produtoNome}</td>
            <td>${a.produtoDesc}</td>
            <td>R$ ${a.produtoPreco}</td>
            <td>${a.produtoQuantidade}</td>
            <td>
            <button class="btn-editar" onclick="put(${a.produtoID}, '${a.produtoNome}', '${a.produtoDesc}', '${a.produtoPreco}', '${a.produtoQuantidade}')">Editar</button>
            <button class="btn-excluir" onclick="del(${a.produtoID}, '${a.produtoNome}')">Excluir</button>
            </td>
        </tr>`;
    });
}
async function salvar() {
    const id = document.getElementById('id').value
    const nome = document.getElementById('nome').value
    const desc = document.getElementById('desc').value
    const preco = document.getElementById('preco').value
    const qtd = document.getElementById('qtd').value
    if (!nome || !desc || !preco || !qtd) {
        alert('Campos obrigatórios não preenchidos, por favor, revise sua requisição!')
        return;
    }
    const produto = { produtoID: parseInt(id), produtoNome: nome, produtoDesc: desc, produtoPreco: parseFloat(preco), produtoQuantidade: parseInt(qtd) }
    const metodo = modoEdicao ? 'PUT' : 'POST';
    const urlFinal = modoEdicao ? `${URL_API}/${id}` : URL_API;
    const response = await fetch(urlFinal, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto)
    });

    if (response.ok) {
        alert(modoEdicao ? "Produto atualizado!" : "Produto cadastrado com sucesso!");
    } else {
        const erro = await response.json();
        alert("Erro: " + (erro.message || "Falha na operação"));
    }
    limpar();
    listar();
}
function put(id, nome, desc, preco, qtd) {
    document.getElementById('id').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('desc').value = desc
    document.getElementById('preco').value = preco;
    document.getElementById('qtd').value = qtd
    modoEdicao = true;
}
async function del(id, nome) {
    if (confirm(`Deseja realmente excluir o produto ${id}: ${nome}?`)) {
        const response = await fetch(`${URL_API}/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            listar();
            document.getElementById('id').value = 0;
            document.getElementById('nome').value = '';
            document.getElementById('desc').value = ''
            document.getElementById('preco').value = null;
            document.getElementById('qtd').value = null;
            modoEdicao = false;
        }
    }
}
function limpar() {
    document.getElementById('id').value = 0;
    document.getElementById('nome').value = '';
    document.getElementById('desc').value = ''
    document.getElementById('preco').value = null;
    document.getElementById('qtd').value = null;
    modoEdicao = false;
}