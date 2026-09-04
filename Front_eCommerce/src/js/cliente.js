const URL_API = 'http://localhost:5265/api/Clientes';
let modoEdicao = false;

document.addEventListener("DOMContentLoaded", listar);

async function listar() {
    const response = await fetch(URL_API);
    const cliente = await response.json();
    const corpo = document.getElementById('corpo');
    corpo.innerHTML = '';
    cliente.forEach(a => {
        corpo.innerHTML += `
        <tr>
            <td>${a.clienteID}</td>
            <td>${a.clienteNome}</td>
            <td>${a.clienteRua}, ${a.clienteNumeroCasa}, ${a.clienteBairro}</td>
            <td>
            <button class="btn-editar" onclick="put(${a.clienteID}, '${a.clienteNome}', '${a.clienteRua}', '${a.clienteNumeroCasa}', '${a.clienteBairro}')">Editar</button>
            <button class="btn-excluir" onclick="del(${a.clienteID}, '${a.clienteNome}')">Excluir</button>
            </td>
        </tr>`;
    });
}
async function salvar() {
    const id = document.getElementById('id').value
    const nome = document.getElementById('nome').value
    const rua = document.getElementById('rua').value
    const numCasa = document.getElementById('numeroCasa').value
    const bairro = document.getElementById('bairro').value
    if (!nome || !rua || !numCasa || !bairro) {
        alert('Campos obrigatórios não preenchidos, por favor, revise sua requisição!')
        return;
    }
    const cliente = { clienteID: parseInt(id), clienteNome: nome, clienteRua: rua, clienteNumeroCasa: parseInt(numCasa), clienteBairro: bairro }
    const metodo = modoEdicao ? 'PUT' : 'POST';
    const urlFinal = modoEdicao ? `${URL_API}/${id}` : URL_API;
    const response = await fetch(urlFinal, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente)
    });

    if (response.ok) {
        alert(modoEdicao ? "Cliente atualizado!" : "Cliente cadastrado com sucesso!");
        limpar();
        listar();
    } else {
        const erro = await response.json();
        alert("Erro: " + (erro.message || "Falha na operação"));
    }

}
function put(id, nome, rua, numCasa, bairro) {
    document.getElementById('id').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('rua').value = rua
    document.getElementById('numeroCasa').value = numCasa;
    document.getElementById('bairro').value = bairro
    modoEdicao = true;
}
async function del(id, nome) {
    if (confirm(`Deseja realmente excluir o cliente ${id}: ${nome}?`)) {
        const response = await fetch(`${URL_API}/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            listar();
            document.getElementById('id').value = 0;
            document.getElementById('nome').value = '';
            document.getElementById('rua').value = ''
            document.getElementById('numeroCasa').value = null;
            document.getElementById('bairro').value = '';
            modoEdicao = false;
        }
    }
}
function limpar() {
    document.getElementById('id').value = 0;
    document.getElementById('nome').value = '';
    document.getElementById('rua').value = ''
    document.getElementById('numeroCasa').value = null;
    document.getElementById('bairro').value = '';
    modoEdicao = false;
}