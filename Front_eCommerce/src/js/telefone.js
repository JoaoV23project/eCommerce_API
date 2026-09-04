const URL_API = 'http://localhost:5265/api/Telefones';
let modoEdicao = false;

document.addEventListener("DOMContentLoaded", listar);

async function listar() {
    const response = await fetch(URL_API);
    const telefone = await response.json();
    const corpo = document.getElementById('corpo');
    corpo.innerHTML = '';
    telefone.forEach(a => {
        corpo.innerHTML += `
        <tr>
            <td>${a.telefoneID}</td>
            <td>${a.clienteID}</td>
            <td>${a.numero}</td>
            <td>
            <button class="btn-editar" onclick="put(${a.telefoneID}, '${a.clienteID}','${a.numero}')">Editar</button>
            <button class="btn-excluir" onclick="del(${a.telefoneID}, '${a.numero}')">Excluir</button>
            </td>
        </tr>`;
    });
}
async function salvar() {
    const id = document.getElementById('id').value
    const clienteID = document.getElementById('clienteID').value
    const numero = document.getElementById('numero').value

    if (!clienteID || !clienteID || !numero) {
        alert('Campos obrigatórios não preenchidos, por favor, revise sua requisição!')
        return;
    }
    const telefone = { telefoneID: parseInt(id), clienteID: parseInt(clienteID), numero: numero }
    const metodo = modoEdicao ? 'PUT' : 'POST';
    const urlFinal = modoEdicao ? `${URL_API}/${id}` : URL_API;
    const response = await fetch(urlFinal, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(telefone)
    });

    if (response.ok) {
        alert(modoEdicao ? "Telefone atualizado!" : "Telefone cadastrado com sucesso!");
        limpar();
        listar();
    } else {
        const erro = await response.json();
        alert("Erro: " + (erro.message || "Falha na operação"));
    }

}
function put(id, clienteID, numero) {
    document.getElementById('id').value = id;
    document.getElementById('clienteID').value = clienteID;
    document.getElementById('numero').value = numero;
    modoEdicao = true;
}
async function del(id, numero) {
    if (confirm(`Deseja realmente excluir o telefone ${id}: ${numero}?`)) {
        const response = await fetch(`${URL_API}/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            listar();
            document.getElementById('id').value = 0;
            document.getElementById('clienteID').value = null;
            document.getElementById('numero').value = '';
            modoEdicao = false;
        }
    }
}
function limpar() {
    document.getElementById('id').value = 0;
    document.getElementById('clienteID').value = '';
    document.getElementById('numero').value = '';
    modoEdicao = false;
}