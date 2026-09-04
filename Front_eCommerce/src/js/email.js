const URL_API = 'http://localhost:5265/api/Emails';
let modoEdicao = false;

document.addEventListener("DOMContentLoaded", listar);

async function listar() {
    const response = await fetch(URL_API);
    const email = await response.json();
    const corpo = document.getElementById('corpo');
    corpo.innerHTML = '';
    email.forEach(a => {
        corpo.innerHTML += `
        <tr>
            <td>${a.emailID}</td>
            <td>${a.clienteID}</td>
            <td>${a.e_mail}</td>
            <td>
            <button class="btn-editar" onclick="put(${a.emailID}, '${a.clienteID}','${a.e_mail}')">Editar</button>
            <button class="btn-excluir" onclick="del(${a.emailID}, '${a.e_mail}')">Excluir</button>
            </td>
        </tr>`;
    });
}
async function salvar() {
    const id = document.getElementById('id').value
    const clienteID = document.getElementById('clienteID').value
    const e_mail = document.getElementById('e_mail').value

    if (!clienteID || !clienteID || !e_mail) {
        alert('Campos obrigatórios não preenchidos, por favor, revise sua requisição!')
        return;
    }
    const email = { emailID: parseInt(id), clienteID: parseInt(clienteID), e_mail: e_mail }
    const metodo = modoEdicao ? 'PUT' : 'POST';
    const urlFinal = modoEdicao ? `${URL_API}/${id}` : URL_API;
    const response = await fetch(urlFinal, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(email)
    });

    if (response.ok) {
        alert(modoEdicao ? "Email atualizado!" : "Email cadastrado com sucesso!");
        limpar();
        listar();
    } else {
        const erro = await response.json();
        alert("Erro: " + (erro.message || "Falha na operação"));
    }

}
function put(id, clienteID, e_mail) {
    document.getElementById('id').value = id;
    document.getElementById('clienteID').value = clienteID;
    document.getElementById('e_mail').value = e_mail;
    modoEdicao = true;
}
async function del(id, e_mail) {
    if (confirm(`Deseja realmente excluir o email ${id}: ${e_mail}?`)) {
        const response = await fetch(`${URL_API}/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            listar();
            document.getElementById('id').value = 0;
            document.getElementById('clienteID').value = null;
            document.getElementById('e_mail').value = '';
            modoEdicao = false;
        }
    }
}
function limpar() {
    document.getElementById('id').value = 0;
    document.getElementById('clienteID').value = '';
    document.getElementById('e_mail').value = '';
    modoEdicao = false;
}