const URL_API = 'http://localhost:5265/api/Atendimentos';
let modoEdicao = false;

document.addEventListener("DOMContentLoaded", listar);

async function listar() {
    const response = await fetch(URL_API);
    const atendimento = await response.json();
    const corpo = document.getElementById('corpo');
    corpo.innerHTML = '';
    atendimento.forEach(a => {
        corpo.innerHTML += `
        <tr>
            <td>${a.atendimentoID}</td>
            <td>${a.funcionarioID}</td>
            <td>${a.clienteID}</td>
            <td>${a.atendimentoDia}/${a.atendimentoMes}/${a.atendimentoAno}</td>
            <td>
            <button class="btn-editar" onclick="put(${a.atendimentoID}, '${a.funcionarioID}', '${a.clienteID}', '${a.atendimentoDia}', '${a.atendimentoMes}', '${a.atendimentoAno}')">Editar</button>
            <button class="btn-excluir" onclick="del(${a.atendimentoID}, '${a.funcionarioID}')">Excluir</button>
            </td>
        </tr>`;
    });
}
async function salvar() {
    const id = document.getElementById('id').value
    const funcionarioID = document.getElementById('funcionarioID').value
    const clienteID = document.getElementById('clienteID').value
    const atendimentoDia = document.getElementById('atendimentoDia').value
    const atendimentoMes = document.getElementById('atendimentoMes').value
    const atendimentoAno = document.getElementById('atendimentoAno').value

    if (!funcionarioID || !clienteID || !atendimentoDia || !atendimentoMes || !atendimentoAno) {
        alert('Campos obrigatórios não preenchidos, por favor, revise sua requisição!')
        return;
    }
    const atendimento = { atendimentoID: parseInt(id), funcionarioID: parseInt(funcionarioID), clienteID: parseInt(clienteID), atendimentoDia: parseInt(atendimentoDia), atendimentoMes: parseInt(atendimentoMes), atendimentoAno: parseInt(atendimentoAno) }
    const metodo = modoEdicao ? 'PUT' : 'POST';
    const urlFinal = modoEdicao ? `${URL_API}/${id}` : URL_API;
    const response = await fetch(urlFinal, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(atendimento)
    });

    if (response.ok) {
        alert(modoEdicao ? "Atendimento atualizado!" : "Atendimento cadastrado com sucesso!");
        limpar();
        listar();
    } else {
        const erro = await response.json();
        alert("Erro: " + (erro.message || "Falha na operação"));
    }

}
function put(id, funcionarioID, clienteID, atendimentoDia, atendimentoMes, atendimentoAno) {
    document.getElementById('id').value = id;
    document.getElementById('funcionarioID').value = funcionarioID;
    document.getElementById('clienteID').value = clienteID
    document.getElementById('atendimentoDia').value = atendimentoDia;
    document.getElementById('atendimentoMes').value = atendimentoMes;
    document.getElementById('atendimentoAno').value = atendimentoAno;
    modoEdicao = true;
}
async function del(id, funcionarioID) {
    if (confirm(`Deseja realmente excluir o atendimento ${id} do funcionário ${funcionarioID}?`)) {
        const response = await fetch(`${URL_API}/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            listar();
            document.getElementById('id').value = 0;
            document.getElementById('funcionarioID').value = null;
            document.getElementById('clienteID').value = null;
            document.getElementById('atendimentoDia').value = null;
            document.getElementById('atendimentoMes').value = null;
            document.getElementById('atendimentoAno').value = null;
            modoEdicao = false;
        }
    }
}
function limpar() {
    document.getElementById('id').value = 0;
    document.getElementById('funcionarioID').value = '';
    document.getElementById('clienteID').value = null;
    document.getElementById('atendimentoDia').value = null;
    document.getElementById('atendimentoMes').value = null;
    document.getElementById('atendimentoAno').value = null;
    modoEdicao = false;
}