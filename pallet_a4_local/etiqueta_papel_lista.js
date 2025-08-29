function handleFileUpload() {
    const fileUpload = document.getElementById("fileUpload");
    const file = fileUpload.files[0];

    if (!file) {
        alert("Por favor, selecione um arquivo.");
        return;
    }

    const validExtensions = ['csv', 'txt'];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
        alert("Por favor, envie um arquivo CSV ou TXT válido.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const csvData = e.target.result;
        const linhas = parseCsvData(csvData);
        const locais = getItemsByLocation(linhas);

        gerarFolhasA4(locais);
    };
    reader.readAsText(file);
}

function getItemsByLocation(linhas){
    let locais = []; 
    for (let index = 0; index < linhas.length; index++) {
        const linha = linhas[index];
        const idx = localIndex(linha, locais);

        if(idx > -1){
            locais[idx].items.push({
                numeroDoItem: linha['Número do item'],
                nomeDoProduto: linha['Nome do produto']
            });
        } else {
            locais.push({
                nomeLocal: linha['Localização'],
                items: [
                    { 
                        numeroDoItem: linha['Número do item'], 
                        nomeDoProduto: linha['Nome do produto'] 
                    }
                ]
            });
        }
    }

    return locais;
}

function gerarFolhasA4(locais){
    console.log("Gerar A4 com os seguintes locais:", locais);
}

function localIndex(linha, locais){
    return locais.findIndex(local => local.nomeLocal === linha['Localização']);
}

function parseCsvData(csvData) {
    const lines = csvData.trim().split('\n');
    const headers = lines.shift().trim().split(";");
    const etiquetas = [];

    lines.forEach((line) => {
        if (line.trim() !== '') {
            const etiqueta = {};
            const values = line.trim().split(";");
            headers.forEach((header, index) => {
                etiqueta[header.trim()] = values[index]?.trim() ?? "";
            });
            etiquetas.push(etiqueta);
        }
    });

    return etiquetas;
}
