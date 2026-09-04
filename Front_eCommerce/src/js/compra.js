const URL_API = 'http://localhost:5265/api/Compras';
let modoEdicao = false;

document.addEventListener("DOMContentLoaded", listar);

async function listar() {
    const response = await fetch(URL_API);
    const compra = await response.json();
    const corpo = document.getElementById('corpo');
    corpo.innerHTML = '';
    compra.forEach(a => {
        corpo.innerHTML += `
        <tr>
            <td>${a.compraID}</td>
            <td>${a.produtoID}</td>
            <td>${a.clienteID}</td>
            <td>${a.compraDia}/${a.compraMes}/${a.compraAno}</td>
            <td>
            <button class="btn-editar" onclick="put(${a.compraID}, '${a.produtoID}','${a.clienteID}', '${a.compraDia}', '${a.compraMes}', '${a.compraAno}')">Editar</button>
            <button class="btn-excluir" onclick="del(${a.compraID}, '${a.clienteID}')">Excluir</button>
            </td>
        </tr>`;
    });
}
async function salvar() {
    const id = document.getElementById('id').value
    const produtoID = document.getElementById('produtoID').value
    const clienteID = document.getElementById('clienteID').value
    const compraDia = document.getElementById('compraDia').value
    const compraMes = document.getElementById('compraMes').value
    const compraAno = document.getElementById('compraAno').value

    if (!clienteID || !produtoID || !compraDia || !compraMes || !compraAno) {
        alert('Campos obrigatórios não preenchidos, por favor, revise sua requisição!')
        return;
    }
    const compra = { compraID: parseInt(id), produtoID: parseInt(produtoID), clienteID: parseInt(clienteID), compraDia: parseInt(compraDia), compraMes: parseInt(compraMes), compraAno: parseInt(compraAno) }
    const metodo = modoEdicao ? 'PUT' : 'POST';
    const urlFinal = modoEdicao ? `${URL_API}/${id}` : URL_API;
    const response = await fetch(urlFinal, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compra)
    });

    if (response.ok) {
        alert(modoEdicao ? "Compra atualizada!" : "Compra cadastrada com sucesso!");
        limpar();
        listar();
    } else {
        const erro = await response.json();
        alert("Erro: " + (erro.message || "Falha na operação"));
    }

}
function put(id, produtoID, clienteID, compraDia, compraMes, compraAno) {
    document.getElementById('id').value = id;
    document.getElementById('produtoID').value = produtoID;
    document.getElementById('clienteID').value = clienteID;
    document.getElementById('compraDia').value = compraDia;
    document.getElementById('compraMes').value = compraMes;
    document.getElementById('compraAno').value = compraAno;
    modoEdicao = true;
}
async function del(id, produtoID) {
    if (confirm(`Deseja realmente excluir a compra ${id}: ${produtoID}?`)) {
        const response = await fetch(`${URL_API}/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            listar();
            document.getElementById('id').value = 0;
            document.getElementById('clienteID').value = null;
            document.getElementById('produtoID').value = null;
            document.getElementById('compraDia').value = null;
            document.getElementById('compraMes').value = null;
            document.getElementById('compraAno').value = null;
            modoEdicao = false;
        }
    }
}
function limpar() {
    document.getElementById('id').value = 0;
    document.getElementById('clienteID').value = null;
    document.getElementById('produtoID').value = null;
    document.getElementById('compraDia').value = null;
    document.getElementById('compraMes').value = null;
    document.getElementById('compraAno').value = null;
    modoEdicao = false;
}