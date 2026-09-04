const URL_API = 'http://localhost:5265/api/Estoques';
let modoEdicao = false;

document.addEventListener("DOMContentLoaded", listar);

async function listar() {
    const response = await fetch(URL_API);
    const estoque = await response.json();
    const corpo = document.getElementById('corpo');
    corpo.innerHTML = '';
    estoque.forEach(a => {
        corpo.innerHTML += `
        <tr>
            <td>${a.estoqueID}</td>
            <td>${a.funcionarioID}</td>
            <td>${a.produtoID}</td>
            <td>${a.quantidade}</td>
            <td>
            <button class="btn-editar" onclick="put(${a.estoqueID}, '${a.funcionarioID}', '${a.produtoID}', '${a.quantidade}')">Editar</button>
            <button class="btn-excluir" onclick="del(${a.estoqueID}, '${a.funcionarioID}')">Excluir</button>
            </td>
        </tr>`;
    });
}
async function salvar() {
    const id = document.getElementById('id').value
    const funcionarioID = document.getElementById('funcionarioID').value
    const produtoID = document.getElementById('produtoID').value
    const quantidade = document.getElementById('quantidade').value

    if (!funcionarioID || !produtoID || !quantidade) {
        alert('Campos obrigatórios não preenchidos, por favor, revise sua requisição!')
        return;
    }
    const estoque = { estoqueID: parseInt(id), funcionarioID: parseInt(funcionarioID), produtoID: parseInt(produtoID), quantidade: parseInt(quantidade) }
    const metodo = modoEdicao ? 'PUT' : 'POST';
    const urlFinal = modoEdicao ? `${URL_API}/${id}` : URL_API;
    const response = await fetch(urlFinal, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(estoque)
    });

    if (response.ok) {
        alert(modoEdicao ? "Estoque atualizado!" : "Estoque cadastrado com sucesso!");
        limpar();
        listar();
    } else {
        const erro = await response.json();
        alert("Erro: " + (erro.message || "Falha na operação"));
    }

}
function put(id, funcionarioID, produtoID, quantidade) {
    document.getElementById('id').value = id;
    document.getElementById('funcionarioID').value = funcionarioID;
    document.getElementById('produtoID').value = produtoID
    document.getElementById('quantidade').value = quantidade;
    modoEdicao = true;
}
async function del(id, funcionarioID) {
    if (confirm(`Deseja realmente excluir o estoque ${id} do funcionário ${funcionarioID}?`)) {
        const response = await fetch(`${URL_API}/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            listar();
            document.getElementById('id').value = 0;
            document.getElementById('funcionarioID').value = null;
            document.getElementById('produtoID').value = null;
            document.getElementById('quantidade').value = null;
            modoEdicao = false;
        }
    }
}
function limpar() {
    document.getElementById('id').value = 0;
    document.getElementById('funcionarioID').value = '';
    document.getElementById('produtoID').value = null;
    document.getElementById('quantidade').value = null;
    modoEdicao = false;
}