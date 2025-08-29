function pad(d) {
  return d < 10 ? "0" + d.toString() : d.toString();
}

function gerarMangueiral() {
  const corredores = [
    {
      letra: "G",
      numeroMaximo: 50,
    },
    {
      letra: "F",
      numeroMaximo: 50,
    },
  ];

  function gerarTodosOsLocais() {
    const maximoDeGanchos = 5;
    let locais = [];

    for (let corredor of corredores) {
      const numeroMaximo = corredor.numeroMaximo;
      for (let prateleira = 1; prateleira < numeroMaximo; prateleira++) {
        for (let gancho = 1; gancho <= maximoDeGanchos; gancho++) {
          locais.push(`${corredor.letra}-${pad(prateleira)}-${pad(gancho)}-00`);
        }
      }
    }

    return locais;
  }

  const locais = gerarTodosOsLocais();

  baixarCSV(locais);
}

function baixarCSV(locaisMaisCaixas) {
  // Cabeçalho: incluindo a coluna "codigo"
  const linhas = [["local", "corredor", "prateleira", "altura", "caixa"]];

  for (const linha of locaisMaisCaixas) {
    const partes = linha.split("-");
    if (partes.length === 4) {
      linhas.push([linha, ...partes]);
    }
  }

  const csvContent = linhas.map((linha) => linha.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "locais_com_caixas.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
