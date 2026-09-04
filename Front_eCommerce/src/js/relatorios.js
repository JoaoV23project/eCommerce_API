
async function buscarClientes_Email() {
    const tabela = document.getElementById("pdf");
    tabela.innerHTML = "<tr><td colspan='2'>Carregando...</td></tr>";

    try {
        // 1. Busca os dados de ambas as APIs em paralelo para economizar tempo
        // Substitua as URLs abaixo pelas URLs reais das suas APIs
        const [resClientes, resEmails] = await Promise.all([
            fetch('http://localhost:5265/api/Clientes'),  // API de Clientes
            fetch('http://localhost:5265/api/Emails')       // API de Emails
        ]);

        const clientes = await resClientes.json();
        const emails = await resEmails.json();

        // 2. Mapeia os e-mails por 'clienteID' para busca rápida O(1)
        const emailMap = new Map();
        emails.forEach(item => {
            emailMap.set(item.clienteID, item.e_mail);
        });

        // 3. Simula o LEFT JOIN do SQL Server
        const resultadoJoin = clientes.map(cliente => {
            return {
                nome: cliente.clienteNome,
                email: emailMap.get(cliente.clienteID) || null
            };
        });

        // 4. Monta o HTML da tabela
        let html = `
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                </tr>
            </thead>
            <tbody>
        `;
        if (clientes.length === 0) {
            html += `
            <tr>
                <td><i>Sem nomes cadastrados</i></td>
                <td><i>Sem emails cadastrados</i></td>
            </tr>
            `;
        }
        else {
            resultadoJoin.forEach(item => {
                html += `
                <tr>
                    <td>${item.nome}</td>
                    <td>${item.email}</td>
                </tr>
            `;
            });
        }
        html += `</tbody>`;

        tabela.innerHTML = html;

    } catch (erro) {
        console.error("Erro ao buscar dados das APIs:", erro);
        tabela.innerHTML = "<tr><td colspan='2'>Erro ao carregar dados dos relatórios.</td></tr>";
    }
}
async function buscarProdutos_Quantidade() {
    const tabela = document.getElementById("pdf");
    tabela.innerHTML = "<tr><td colspan='2'>Carregando...</td></tr>";

    try {
        // 1. Busca os dados de ambas as APIs em paralelo para economizar tempo
        const [resProdutos, resEstoques] = await Promise.all([
            fetch('http://localhost:5265/api/Produtos'),
            fetch('http://localhost:5265/api/Estoques')
        ]);

        const produtos = await resProdutos.json();
        const estoques = await resEstoques.json();

        // 2. Mapeia os e-mails por 'cod_produto' para busca rápida O(1)
        const estoqueMap = new Map();
        estoques.forEach(item => {
            estoqueMap.set(item.produtoID, item.quantidade);
        });

        // 3. Simula o LEFT JOIN do SQL Server
        const resultadoJoin = produtos.map(produto => {
            return {
                nome: produto.produtoNome,
                estoque: estoqueMap.get(produto.produtoID) || null
            };
        });

        // 4. Monta o HTML da tabela
        let html = `
            <thead>
                <tr>
                    <th>Produto</th>
                    <th>Quantidade</th>
                </tr>
            </thead>
            <tbody>
        `;
        if(produtos.length === 0){
            html+=`
            <tr>
                <td><i>Sem Produtos cadastrados</i></td>
                <td><i>Sem Estoque cadastrado</i></td>
            </tr>
            `;
        }else{ 
            resultadoJoin.forEach(item => {
                html += `
                <tr>
                    <td>${item.nome}</td>
                    <td>${item.estoque ?? '<i>0</i>'}</td>
                </tr>
            `;
        });
    }

        html += `</tbody>`;

        tabela.innerHTML = html;

    } catch (erro) {
        console.error("Erro ao buscar dados das APIs:", erro);
        tabela.innerHTML = "<tr><td colspan='2'>Erro ao carregar dados dos relatórios.</td></tr>";
    }
}
async function buscarClientes_Atendimento() {
    const tabela = document.getElementById("pdf");
    tabela.innerHTML = "<tr><td colspan='2'>Carregando...</td></tr>";

    try {
        // 1. Busca os dados de ambas as APIs em paralelo para economizar tempo
        const [resClientes, resAtendimentos] = await Promise.all([
            fetch('http://localhost:5265/api/Clientes'),  // API de Clientes
            fetch('http://localhost:5265/api/Atendimentos')       // API de Atendimentos
        ]);

        const clientes = await resClientes.json();
        const atendimentos = await resAtendimentos.json();

        // 2. Mapeia os e-mails por 'clienteID' para busca rápida O(1)
        const atendimentoMap = new Map();
        atendimentos.forEach(item => {
            const dia = String(item.atendimentoDia).padStart(2, '0');
            const mes = String(item.atendimentoMes).padStart(2, '0');
            const ano = item.atendimentoAno;
            const dataFormatada = `${dia}/${mes}/${ano}`
            atendimentoMap.set(item.clienteID, dataFormatada);
        });

        // 3. Simula o LEFT JOIN do SQL Server
        const resultadoJoin = clientes.map(cliente => {
            return {
                id: cliente.clienteID,
                nome: cliente.clienteNome,
                atendimento: atendimentoMap.get(cliente.clienteID) || null
            };
        });

        // 4. Monta o HTML da tabela
        let html = `
            <thead>
                <tr>
                    <th>ID Cliente</th>
                    <th>Nome</th>
                    <th>Data do atendimento</th>
                </tr>
            </thead>
            <tbody>
        `;
        if(clientes.length === 0){
            html +=`
                <tr>
                    <td colspan="2"><i>Sem Clientes cadastrados</i></td>
                    <td><i>Sem Atendimentos cadastrados</i></td>
                </tr>
            `;
        }else{
        resultadoJoin.forEach(item => {
            html += `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.nome}</td>
                    <td>${item.atendimento ?? '<i>Sem atendimento cadastrado</i>'}</td>
                </tr>
            `;
        });
        }

        html += `</tbody>`;

        tabela.innerHTML = html;

    } catch (erro) {
        console.error("Erro ao buscar dados das APIs:", erro);
        tabela.innerHTML = "<tr><td colspan='2'>Erro ao carregar dados dos relatórios.</td></tr>";
    }
}
async function buscarMediaSalarial() {
    const tabela = document.getElementById('pdf');
    tabela.innerHTML = '<tr><td colspan="1">Carregando...</td></tr>';

    try {
        // 1. Busca os dados da API de funcionários
        const res = await fetch('http://localhost:5265/api/Funcionarios');
        const funcionarios = await res.json();

        // 2. Calcula a média salarial (equivalente ao AVG do SQL Server)
        const totalSalarios = funcionarios.reduce((acc, funcionario) => acc + (funcionario.funcionarioSalario || 0), 0);
        const mediaSalarial = funcionarios.length > 0 ? totalSalarios / funcionarios.length : 0;

        // 3. Formata o valor para o padrão de moeda brasileiro (R$)
        const mediaFormatada = mediaSalarial.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // 4. Monta o HTML da tabela
        let html = `<thead>
            <tr>
                <th>Média Salarial</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>${funcionarios.length > 0 ? mediaFormatada : '<i>Nenhum funcionário cadastrado</i>'}</td>
            </tr>
        </tbody>`;

        // 5. Injeta a tabela pronta no elemento
        tabela.innerHTML = html;

    } catch (erro) {
        console.error('Erro ao buscar dados da API:', erro);
        tabela.innerHTML = '<tr><td colspan="1">Erro ao carregar dados da média salarial.</td></tr>';
    }
}
async function buscarProdutos_Preco_Estoque() {
    const tabela = document.getElementById("pdf");
    tabela.innerHTML = "<tr><td colspan='2'>Carregando...</td></tr>";

    try {
        // 1. Busca os dados de ambas as APIs em paralelo para economizar tempo
        const [resProdutos, resEstoques] = await Promise.all([
            fetch('http://localhost:5265/api/Produtos'),
            fetch('http://localhost:5265/api/Estoques')
        ]);

        const produtos = await resProdutos.json();
        const estoques = await resEstoques.json();

        // 2. Mapeia os e-mails por 'cod_produto' para busca rápida O(1)
        const estoqueMap = new Map();
        estoques.forEach(item => {
            estoqueMap.set(item.produtoID, item.quantidade);
        });

        // 3. Simula o LEFT JOIN do SQL Server
        const resultadoJoin = produtos.map(produto => {
            return {
                nome: produto.produtoNome,
                preco: produto.produtoPreco,
                estoque: estoqueMap.get(produto.produtoID) || null
            };
        });

        // 4. Monta o HTML da tabela
        let html = `
        <thead>
                <tr>
                    <th>Produto</th>
                    <th>Preço</th>
                    <th>Quantidade</th>
                </tr>
            </thead>
            <tbody>
        `;
        if(produtos.length === 0){
            html += `
                <tr>
                    <td colspan="2"><i>Sem Produtos cadastrados</i></td>
                    <td><i>Sem Estoque cadastrado</i></td>
                </tr>
            `;
        }else{
            resultadoJoin.forEach(item => {
            const precoFormatado = item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            html += `
                <tr>
                    <td>${item.nome}</td>
                    <td>${precoFormatado}</td>
                    <td>${item.estoque ?? '<i>Sem estoque cadastrado</i>'}</td>
                    </tr>
                    `;
                });
            }   
        html += `</tbody>`;

        tabela.innerHTML = html;

    } catch (erro) {
        console.error("Erro ao buscar dados das APIs:", erro);
        tabela.innerHTML = "<tr><td colspan='2'>Erro ao carregar dados dos relatórios.</td></tr>";
    }
}
async function buscarClientes_Telefone() {
    const tabela = document.getElementById("pdf");
    tabela.innerHTML = "<tr><td colspan='2'>Carregando...</td></tr>";

    try {
        // 1. Busca os dados de ambas as APIs em paralelo para economizar tempo
        // Substitua as URLs abaixo pelas URLs reais das suas APIs
        const [resClientes, resTelefones] = await Promise.all([
            fetch('http://localhost:5265/api/Clientes'),  // API de Clientes
            fetch('http://localhost:5265/api/Telefones')       // API de Telefones
        ]);

        const clientes = await resClientes.json();
        const telefones = await resTelefones.json();

        // 2. Mapeia os e-mails por 'clienteID' para busca rápida O(1)
        const telefoneMap = new Map();
        telefones.forEach(item => {
            telefoneMap.set(item.clienteID, item.numero);
        });

        // 3. Simula o LEFT JOIN do SQL Server
        const resultadoJoin = clientes.map(cliente => {
            return {
                nome: cliente.clienteNome,
                telefone: telefoneMap.get(cliente.clienteID) || null
            };
        });

        // 4. Monta o HTML da tabela
        let html = `
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Número</th>
                </tr>
            </thead>
            <tbody>
        `;
        if(clientes.length === 0){
            html += `
                <tr>
                    <td><i>Sem Clientes cadastrados</i></td>
                    <td><i>Sem Telefones cadastrados</i></td>
                </tr>
            `;
        }else{
            resultadoJoin.forEach(item => {
                html += `
                <tr>
                    <td>${item.nome}</td>
                    <td>${item.telefone ?? '<i>Sem telefone cadastrado</i>'}</td>
                </tr>
            `;
        });
    }

        html += `</tbody>`;

        tabela.innerHTML = html;

    } catch (erro) {
        console.error("Erro ao buscar dados das APIs:", erro);
        tabela.innerHTML = "<tr><td colspan='2'>Erro ao carregar dados dos relatórios.</td></tr>";
    }
}
async function buscarFuncionarios_Atendimento() {
    const tabela = document.getElementById('pdf');
    tabela.innerHTML = `<tr><td colspan="3">Carregando...</td></tr>`;

    try {
        // 1. Busca os dados de ambas as APIs em paralelo
        const [resFuncionarios, resAtendimentos] = await Promise.all([
            fetch('http://localhost:5265/api/Funcionarios'),
            fetch('http://localhost:5265/api/Atendimentos')
        ]);

        const funcionarios = await resFuncionarios.json();
        const atendimentos = await resAtendimentos.json();

        // 2. Mapeia um array de datas por funcionarioID (evita sobrescrever)
        const atendimentoMap = new Map();
        atendimentos.forEach(item => {
            const dia = String(item.atendimentoDia).padStart(2, '0');
            const mes = String(item.atendimentoMes).padStart(2, '0');
            const ano = item.atendimentoAno;
            const dataFormatada = `${dia}/${mes}/${ano}`;

            if (!atendimentoMap.has(item.funcionarioID)) {
                atendimentoMap.set(item.funcionarioID, []);
            }
            atendimentoMap.get(item.funcionarioID).push(dataFormatada);
        });

        // 3. Simula o LEFT JOIN unindo com a lista de datas
        const resultadoJoin = funcionarios.map(funcionario => {
            return {
                id: funcionario.funcionarioID,
                nome: funcionario.funcionarioNome,
                atendimentos: atendimentoMap.get(funcionario.funcionarioID) || []
            };
        });

        // 4. Monta o HTML da tabela
        let html = `
            <thead>
                <tr>
                    <th>ID Funcionário</th>
                    <th>Nome</th>
                    <th>Data do atendimento</th>
                </tr>
            </thead>
            <tbody>
        `;
        if(funcionarios.length === 0){
            html += `
                <tr>
                    <td colspan="2"><i>Sem Funcionários cadastrados</i></td>
                    <td><i>Sem Atendimentos cadastrados</i></td>
                </tr>
            `;
        }else{}
        resultadoJoin.forEach(item => {
            let textoAtendimentos = '<i>Sem atendimento cadastrado</i>';

            if (item.atendimentos.length > 0) {
                // Junta todas as datas usando quebra de linha
                textoAtendimentos = item.atendimentos.join('<br>');
            }

            html += `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.nome}</td>
                    <td>${textoAtendimentos}</td>
                </tr>
            `;
        });

        html += `</tbody>`;
        tabela.innerHTML = html;

    } catch (erro) {
        console.error('Erro ao buscar dados das APIs:', erro);
        tabela.innerHTML = `<tr><td colspan="3">Erro ao carregar dados dos relatórios.</td></tr>`;
    }
}
async function buscarClientes_TotalGasto() {
    const tabela = document.getElementById("pdf");
    tabela.innerHTML = "<tr><td colspan='2'>Carregando...</td></tr>";

    try {
        // 1. Busca os dados de todas as APIs necessárias em paralelo
        const [resClientes, resAtendimentos, resCompras, resProdutos] = await Promise.all([
            fetch('http://localhost:5265/api/Clientes'),
            fetch('http://localhost:5265/api/Atendimentos'),
            fetch('http://localhost:5265/api/Compras'),
            fetch('http://localhost:5265/api/Produtos')
        ]);

        const clientes = await resClientes.json();
        const atendimentos = await resAtendimentos.json();
        const compras = await resCompras.json();
        const produtos = await resProdutos.json();
        // 2. Mapeia os produtos pelo 'prod_id' para buscar os preços rapidamente
        const produtoMap = new Map();
        produtos.forEach(p => {
            produtoMap.set(p.produtoID, parseFloat(p.produtoPreco) || 0);
        });
        
        // 3. Mapeia os atendimentos pelo 'ate_id' para descobrir qual cliente fez o atendimento
        const atendimentoMap = new Map();
        atendimentos.forEach(a => {
            atendimentoMap.set(a.atendimentoID, a.clienteID);
        });
        
        // 4. Mapeia os clientes pelo 'cod_cliente' para obter o nome facilmente
        const clienteMap = new Map();
        clientes.forEach(c => {
            clienteMap.set(c.clienteID, c.clienteNome);
        });
        
        // 5. Simula o INNER JOIN e o GROUP BY / SUM do SQL
        const acumuladorGasto = new Map();
        
        compras.forEach(co => {
            const codCliente = atendimentoMap.get(co.clienteID);
            const precoProduto = produtoMap.get(co.produtoID);
            
            // Se o atendimento e o produto existirem (Simulando INNER JOIN)
            if (codCliente !== undefined && precoProduto !== undefined) {
                const totalAtual = acumuladorGasto.get(codCliente) || 0;
                acumuladorGasto.set(codCliente, totalAtual + precoProduto);
            }
        });
        
        // 6. Monta o resultado final estruturado
        let resultadoFinal = [];
        acumuladorGasto.forEach((totalGasto, clienteID) => {
            const nomeCliente = clienteMap.get(clienteID);
            if (nomeCliente) { // Garante o INNER JOIN com a tabela de clientes
                resultadoFinal.push({
                    nome: nomeCliente,
                    totalGasto: totalGasto
                });
            }
        });
        // 7. Monta o HTML da tabela
        let html = `
        <thead>
        <tr>
        <th>Nome</th>
        <th>Total Gasto (R$)</th>
        </tr>
        </thead>
        <tbody>
        `;
        
        if (resultadoFinal.length === 0) {
            html += `
            <tr>
            <td colspan="2" style="text-align: center;"><i>Nenhum gasto registrado</i></td>
            </tr>
            `;
        } else {
            resultadoFinal.forEach(item => {
                html += `
                <tr>
                <td>${item.nome}</td>
                <td>${item.totalGasto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                </tr>
                `;
            });
        }
        
        html += `</tbody>`;
        
        tabela.innerHTML = html;

    } catch (erro) {
        console.error("Erro ao buscar dados das APIs:", erro);
        tabela.innerHTML = "<tr><td colspan='2'>Erro ao carregar dados dos relatórios.</td></tr>";
    }
}

async function buscarFuncionarios_Estoque() {
    const tabela = document.getElementById("pdf");
    tabela.innerHTML = "<tr><td colspan='2'>Carregando...</td></tr>";

    try {
        // 1. Busca os dados de ambas as APIs em paralelo para economizar tempo
        const [resFuncionarios, resEstoque] = await Promise.all([
            fetch('http://localhost:5265/api/Funcionarios'),
            fetch('http://localhost:5265/api/Estoques')
        ]);

        const funcionarios = await resFuncionarios.json();
        const estoque = await resEstoque.json();

        // 2. Cria um mapa para contar os produtos agrupados por 'fuc_id'
        const estoqueContagemMap = new Map();

        // Inicializa o mapa para garantir que funcionários sem produtos comecem com 0
        funcionarios.forEach(f => {
            estoqueContagemMap.set(f.funcionarioID, 0);
        });

        // Incrementa a contagem para cada produto encontrado no estoque
        estoque.forEach(item => {
            if (item.produtoID && estoqueContagemMap.has(item.funcionarioID)) {
                estoqueContagemMap.set(item.funcionarioID, estoqueContagemMap.get(item.funcionarioID) + 1);
            }
        });

        // 3. Simula o LEFT JOIN e GROUP BY do SQL Server
        const resultadoJoin = funcionarios.map(funcionario => {
            return {
                nome: funcionario.funcionarioNome,
                num_produtos_em_estoque: estoqueContagemMap.get(funcionario.funcionarioID) || 0
            };
        });

        // 4. Monta o HTML da tabela
        let html = `
            <thead>
                <tr>
                    <th>Funcionário</th>
                    <th>Produtos em Estoque</th>
                </tr>
            </thead>
            <tbody>
        `;
        if(funcionarios.length === 0){
            html += `
                <tr>
                    <td><i>Sem Funcionários cadastrados</i></td>
                    <td><i>Sem Estoque cadastrado</i></td>
                </tr>
            `;
        }else{
        resultadoJoin.forEach(item => {
            html += `
                <tr>
                    <td>${item.nome}</td>
                    <td>${item.num_produtos_em_estoque}</td>
                </tr>
            `;
        });
    }
        html += `</tbody>`;

        tabela.innerHTML = html;

    } catch (erro) {
        console.error("Erro ao buscar dados das APIs:", erro);
        tabela.innerHTML = "<tr><td colspan='2'>Erro ao carregar dados dos relatórios.</td></tr>";
    }
}
function apagar() {
    const tabela = document.getElementById("pdf");
    tabela.innerHTML = "";
}