const URL_API = 'http://localhost:5265/api/Funcionarios';
let modoEdicao = false;

document.addEventListener("DOMContentLoaded", listar);

async function listar() {
    const response = await fetch(URL_API);
    const funcionario = await response.json();
    const corpo = document.getElementById('corpo');
    corpo.innerHTML = '';
    funcionario.forEach(a => {
        corpo.innerHTML += `
        <tr>
            <td>${a.funcionarioID}</td>
            <td>${a.funcionarioNome}</td>
            <td>${a.funcionarioCargo}</td>
            <td>R$ ${a.funcionarioSalario}</td>
            <td>${a.funcionarioContratacaoDia}/${a.funcionarioContratacaoMes}/${a.funcionarioContratacaoAno}</td>
            <td>
            <button class="btn-editar" onclick="put(${a.funcionarioID}, '${a.funcionarioNome}', '${a.funcionarioCargo}', '${a.funcionarioSalario}', '${a.funcionarioContratacaoDia}', '${a.funcionarioContratacaoMes}', '${a.funcionarioContratacaoAno}')">Editar</button>
            <button class="btn-excluir" onclick="del(${a.funcionarioID}, '${a.funcionarioNome}')">Excluir</button>
            </td>
        </tr>`;
    });
}
async function salvar() {
    const id = document.getElementById('id').value
    const nome = document.getElementById('nome').value
    const cargo = document.getElementById('cargo').value
    const salario = document.getElementById('salario').value
    const dia = document.getElementById('dia').value
    const mes = document.getElementById('mes').value
    const ano = document.getElementById('ano').value

    if (!nome || !cargo || !salario || !dia || !mes || !ano) {
        alert('Campos obrigatórios não preenchidos, por favor, revise sua requisição!')
        return;
    }
    const funcionario = { funcionarioID: parseInt(id), funcionarioNome: nome, funcionarioCargo: cargo, funcionarioSalario: parseFloat(salario), funcionarioContratacaoDia: parseInt(dia), funcionarioContratacaoMes: parseInt(mes), funcionarioContratacaoAno: parseInt(ano) }
    const metodo = modoEdicao ? 'PUT' : 'POST';
    const urlFinal = modoEdicao ? `${URL_API}/${id}` : URL_API;
    const response = await fetch(urlFinal, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(funcionario)
    });

    if (response.ok) {
        alert(modoEdicao ? "Funcionário atualizado!" : "Funcionário cadastrado com sucesso!");
        limpar();
        listar();
    } else {
        const erro = await response.json();
        alert("Erro: " + (erro.message || "Falha na operação"));
    }

}
function put(id, nome, cargo, salario, dia, mes, dia) {
    document.getElementById('id').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('cargo').value = cargo
    document.getElementById('salario').value = salario;
    document.getElementById('dia').value = dia;
    document.getElementById('mes').value = mes;
    document.getElementById('ano').value = ano;
    modoEdicao = true;
}
async function del(id, nome) {
    if (confirm(`Deseja realmente excluir o funcionário ${id}: ${nome}?`)) {
        const response = await fetch(`${URL_API}/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            listar();
            document.getElementById('id').value = 0;
            document.getElementById('nome').value = '';
            document.getElementById('cargo').value = ''
            document.getElementById('salario').value = null;
            document.getElementById('dia').value = null;
            document.getElementById('mes').value = null;
            document.getElementById('ano').value = null;
            modoEdicao = false;
        }
    }
}
function limpar() {
    document.getElementById('id').value = 0;
    document.getElementById('nome').value = '';
    document.getElementById('cargo').value = ''
    document.getElementById('salario').value = null;
    document.getElementById('dia').value = '';
    document.getElementById('mes').value = null;
    document.getElementById('ano').value = null;
    modoEdicao = false;
}