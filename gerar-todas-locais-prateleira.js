function pad(d) {
  return d < 10 ? "0" + d.toString() : d.toString();
}
function gerarPrateleiras() {
  const corredores = [
    {
      letra: "A",
      maximoImpar: 23,
      maximoPar: 0,
    },
    {
      letra: "B",
      maximoImpar: 23,
      maximoPar: 24,
    },
    {
      letra: "C",
      maximoImpar: 35,
      maximoPar: 24,
    },
    {
      letra: "D",
      maximoImpar: 21,
      maximoPar: 36,
    },
    {
      letra: "E",
      maximoImpar: 25,
      maximoPar: 22,
    },
  ];

  function gerarTodosOsLocais() {
    const AlturaMaximaNormal = 6;
    const AlturaMaximaE = 7;
    let locais = [];

    for (let corredor of corredores) {
      const numeroMaximo =
        corredor.maximoImpar < corredor.maximoPar
          ? corredor.maximoPar
          : corredor.maximoImpar;
      for (let prateleira = 1; prateleira < numeroMaximo; prateleira++) {
        if (prateleira % 2 == 0) {
          const alturaMax =
            corredor.letra == "E" ? AlturaMaximaE : AlturaMaximaNormal;
          if (prateleira <= corredor.maximoPar) {
            for (let altura = 1; altura <= alturaMax; altura++) {
              locais.push(
                `${corredor.letra}-${pad(prateleira)}-${pad(altura)}-00`
              );
            }
          }
        } else {
          const alturaMax =
            corredor.letra == "E" ? AlturaMaximaE : AlturaMaximaNormal;
          if (prateleira <= corredor.maximoImpar) {
            for (let altura = 1; altura <= alturaMax; altura++) {
              locais.push(
                `${corredor.letra}-${pad(prateleira)}-${pad(altura)}-00`
              );
            }
          }
        }
      }
    }

    return locais;
  }

  const locais = gerarTodosOsLocais();
  const locaisMaisCaixas = [];

  for (let local of locais) {
    const locaisComCaixa = gerarCaixas(local);
    locaisMaisCaixas.push(local);
    locaisMaisCaixas.push(...locaisComCaixa);
  }

  baixarCSV(locaisMaisCaixas)

}

const caixasPadrao = [
  { altura: "01", maximoDeCaixas: 6 },
  { altura: "02", maximoDeCaixas: 6 },
  { altura: "03", maximoDeCaixas: 8 },
  { altura: "04", maximoDeCaixas: 15 },
  { altura: "05", maximoDeCaixas: 0 },
  { altura: "06", maximoDeCaixas: 0 },
];

const execoesCaixas = [
  { local: "B-17-04-00", maximoDeCaixas: 24 },
  { local: "B-19-04-00", maximoDeCaixas: 24 },
  { local: "C-01-04-00", maximoDeCaixas: 28 },
  { local: "C-03-04-00", maximoDeCaixas: 24 },
  { local: "C-05-04-00", maximoDeCaixas: 24 },
  { local: "C-07-04-00", maximoDeCaixas: 24 },
  { local: "D-02-01-00", maximoDeCaixas: 6 },
  { local: "D-02-02-00", maximoDeCaixas: 8 },
  { local: "D-02-03-00", maximoDeCaixas: 15 },
  { local: "D-02-04-00", maximoDeCaixas: 15 },
  { local: "D-04-01-00", maximoDeCaixas: 6 },
  { local: "D-04-02-00", maximoDeCaixas: 6 },
  { local: "D-04-02-00", maximoDeCaixas: 6 },
  { local: "D-04-03-00", maximoDeCaixas: 15 },
  { local: "D-04-04-00", maximoDeCaixas: 15 },
  { local: "D-06-01-00", maximoDeCaixas: 6 },
  { local: "D-06-02-00", maximoDeCaixas: 8 },
  { local: "D-06-03-00", maximoDeCaixas: 8 },
  { local: "D-06-04-00", maximoDeCaixas: 15 },
  { local: "D-08-01-00", maximoDeCaixas: 6 },
  { local: "D-08-02-00", maximoDeCaixas: 6 },
  { local: "D-08-03-00", maximoDeCaixas: 8 },
  { local: "D-08-04-00", maximoDeCaixas: 15 },
  { local: "D-10-01-00", maximoDeCaixas: 6 },
  { local: "D-10-02-00", maximoDeCaixas: 6 },
  { local: "D-10-03-00", maximoDeCaixas: 8 },
  { local: "D-09-05-00", maximoDeCaixas: 8 },
  { local: "D-11-05-00", maximoDeCaixas: 15 },
  { local: "D-13-02-00", maximoDeCaixas: 8 },
  { local: "D-13-04-00", maximoDeCaixas: 0 },
  { local: "D-15-01-00", maximoDeCaixas: 0 },
  { local: "D-15-02-00", maximoDeCaixas: 0 },
  { local: "D-15-03-00", maximoDeCaixas: 8 },
  { local: "D-15-04-00", maximoDeCaixas: 8 },
  { local: "D-15-05-00", maximoDeCaixas: 8 },
  { local: "D-19-01-00", maximoDeCaixas: 8 },
  { local: "D-19-02-00", maximoDeCaixas: 8 },
  { local: "D-19-03-00", maximoDeCaixas: 8 },
  { local: "D-19-04-00", maximoDeCaixas: 15 },
  { local: "D-19-05-00", maximoDeCaixas: 8 },
  { local: "D-21-05-00", maximoDeCaixas: 8 },
  { local: "D-21-04-00", maximoDeCaixas: 15 },
  { local: "E-02-01-00", maximoDeCaixas: 8 },
  { local: "E-02-02-00", maximoDeCaixas: 6 },
  { local: "E-02-03-00", maximoDeCaixas: 6 },
  { local: "E-02-04-00", maximoDeCaixas: 8 },
  { local: "E-02-05-00", maximoDeCaixas: 8 },
  { local: "E-04-02-00", maximoDeCaixas: 8 },
  { local: "E-04-03-00", maximoDeCaixas: 8 },
  { local: "E-21-02-00", maximoDeCaixas: 6 },
  { local: "E-25-03-00", maximoDeCaixas: 6 },
];

function gerarCaixas(codigolocal) {
    const [corredor, prateleiraStr, alturaStr] = codigolocal.split("-");
    const prateleira = Number(prateleiraStr);
    const altura = Number(alturaStr);
    const locaisComCaixa = [];
  
    // Verifica se é exceção
    const excecao = execoesCaixas.find((e) => e.local === codigolocal);
    if (excecao) {
      const maxCaixa = excecao.maximoDeCaixas;
      for (let caixa = 1; caixa <= maxCaixa; caixa++) {
        locaisComCaixa.push(
          `${corredor}-${pad(prateleira)}-${pad(altura)}-${pad(caixa)}`
        );
      }
      return locaisComCaixa;
    }
  
    // BLOQUEAR prateleiras ímpares no corredor E, se não forem exceção
    if (corredor === "E" && prateleira % 2 === 1) {
      return []; // Nada é gerado se não for exceção
    }
  
    // Aplica regra padrão
    const padrao = caixasPadrao.find((p) => p.altura === pad(altura));
    const maxCaixa = padrao ? padrao.maximoDeCaixas : 0;
  
    for (let caixa = 1; caixa <= maxCaixa; caixa++) {
      locaisComCaixa.push(
        `${corredor}-${pad(prateleira)}-${pad(altura)}-${pad(caixa)}`
      );
    }
  
    return locaisComCaixa;
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