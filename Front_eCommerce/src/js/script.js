function abrir(screen) {
    window.location.href = `${screen}.html`;
}

function gerarPDF(screen) {
    const opcoes = {
        margin: 0.25,
        filename: `${screen}.pdf`,
        image: { type: 'png', quality: 10 },
        html2canvas: { scale: 2 },
        // Configuração da orientação aqui vvv
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    const elemento = document.getElementById('pdf');
    html2pdf().set(opcoes).from(elemento).save();
}