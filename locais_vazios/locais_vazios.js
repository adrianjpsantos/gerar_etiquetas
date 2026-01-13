function handleFileUpload() {
  const fileSaldoUpl = document.getElementById("fileSaldo");
  const fileLocaisUpl = document.getElementById("fileLocais");
  const fileFixosUpl =  document.getElementById("fileFixos");
  const fileSaldo = fileSaldoUpl.files[0];
  const fileLocais = fileLocaisUpl.files[0];
  const fileFixos = fileFixosUpl.files[0];
  if (!fileSaldo) {
    alert("Por favor, selecione um arquivo de saldo.");
    return;
  }

  if (!fileLocais) {
    alert("Por favor, selecione um arquivo de locais.");
    return;
  }
   if (!fileFixos) {
    alert("Por favor, selecione um arquivo de locais fixos.");
    return;
  }

  const file1Extension = fileLocais.name.split(".").pop().toLowerCase();
  const file2Extension = fileSaldo.name.split(".").pop().toLowerCase();
  const file3Extension = fileFixos.name.split(".").pop().toLowerCase();

  if (file1Extension !== "xlsx" || file2Extension !== "xlsx" || file3Extension !== "xlsx") {
    alert("Por favor, envie arquivos XLSX válidos.");
    return;
  }

  Promise.all([lerXLSX(fileSaldo), lerXLSX(fileLocais),lerXLSX(fileFixos)]).then(
    ([saldos, locais,fixos]) => {
      console.log("Array 1:", saldos);
      console.log("Array 2:", locais);
      console.log("Array 3:", fixos);

      const locaisRestantes = locais.filter(
        (local) =>
          !saldos.some((saldo) => saldo["Localização"] === local["Localização"])
      );

      const comHifen = locaisRestantes.filter((local) =>
        local["Localização"]?.includes("-")
      );

      const locaisSemFixo = comHifen.filter(
        (local) =>
          !fixos.some((fixo) => fixo["Localização"] === local["Localização"])
      );

      locaisFiltrados = filtrarLocais(locaisSemFixo);
      console.log(locaisFiltrados);

      gerarPDFPorClasseComBordas(locaisFiltrados)
    }
  );
}

function lerXLSX(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Primeira aba da planilha
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Converte para array de objetos
      const json = XLSX.utils.sheet_to_json(sheet);

      resolve(json);
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function filtrarLocais(locais = []) {
  const classes = [
    { classe: "Prateleira", letras: ["A", "B", "C", "D", "E"] },
    { classe: "Mangueiral", letras: ["F", "G", "H"] },
    { classe: "Pallets", letras: ["L", "M", "N"] },
  ];

  let locaisClassificados = [];
  for (let index = 0; index < locais.length; index++) {
    const local = locais[index];
    let localizacao = local["Localização"]; //ex: A-01-01-01
    const [letra, prateleira, altura, caixa] = localizacao.split("-");

    const c = classes.find((classe) => classe.letras.includes(letra));

    const localValido = validaLocalizacao(letra, altura, caixa);
    if (localValido) {
      locaisClassificados.push({
        classe: c?.classe ?? "Desconhecida",
        localização: localizacao,
      });
    }
  }

  return locaisClassificados;
}

function validaLocalizacao(letra, altura, caixa) {
  const prateleiras = ["A", "B", "C", "D", "E"];
  const letrasIgnorar = ["P","Z","O"];


  if (letrasIgnorar.includes(letra))
    return false

  if (prateleiras.includes(letra) && Number(altura) < 5 && Number(caixa) == 0)
    return false;

  if (Number(altura) < 3 && Number(caixa) > 5) return false;

  return true;
}

function gerarPDFPorClasseAprimorado(locaisFiltrados) {
  const { jsPDF } = window.jspdf;

  // Agrupar por classe
  const agrupados = locaisFiltrados.reduce((acc, local) => {
    const cls = local.classe || "Desconhecida";
    if (!acc[cls]) acc[cls] = [];
    acc[cls].push(local);
    return acc;
  }, {});

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  let primeiraPagina = true;

  for (const [classe, locais] of Object.entries(agrupados)) {
    if (!primeiraPagina) doc.addPage();
    primeiraPagina = false;

    // Cabeçalho
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text(`Classe: ${classe}`, 14, 20);

    // Preparar dados (apenas localização)
    const rows = locais.map(l => [l.localizacao]);

    // Cabeçalho da tabela
    const headers = [["Localização"]];

    // Gerar tabela estilizada
    doc.autoTable({
      startY: 30,
      head: headers,
      body: rows,
      styles: {
        fontSize: 12,
        cellPadding: 3,
        halign: "center"
      },
      headStyles: {
        fillColor: [100, 149, 237], // azul claro
        textColor: 255,
        fontStyle: "bold"
      },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      theme: "striped",
      didDrawPage: function (data) {
        // Número da página no rodapé
        const page = doc.getCurrentPageInfo().pageNumber;
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Página ${page}`, doc.internal.pageSize.getWidth() - 20, 290, { align: "right" });
      }
    });
  }

  // Salvar PDF
  doc.save("LocaisPorClasse.pdf");
}

function gerarPDFPorClasseSimples(locaisFiltrados) {
  const { jsPDF } = window.jspdf;

  // Agrupar por classe
  const agrupados = locaisFiltrados.reduce((acc, local) => {
    const cls = local.classe || "Desconhecida";
    if (!acc[cls]) acc[cls] = [];
    acc[cls].push(local);
    return acc;
  }, {});

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  let primeiraPagina = true;

  for (const [classe, locais] of Object.entries(agrupados)) {
    if (!primeiraPagina) doc.addPage();
    primeiraPagina = false;

    // Cabeçalho da página
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text(`Classe: ${classe}`, 14, 20);

    // Lista de locais
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    let y = 30; // posição inicial vertical
    const lineHeight = 7;

    locais.forEach((local, index) => {
      doc.text(`${index + 1}. ${local.localizacao}`, 14, y);
      y += lineHeight;

      // Se passar da página, cria nova página
      if (y > 280) {
        doc.addPage();
        y = 20; // topo da nova página
      }
    });

    // Rodapé com número da página
    const page = doc.getCurrentPageInfo().pageNumber;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Página ${page}`, doc.internal.pageSize.getWidth() - 20, 290, { align: "right" });
  }

  // Salvar PDF
  doc.save("LocaisPorClasse.pdf");
}

function gerarPDFPorClasse3Colunas(locaisFiltrados) {
  const { jsPDF } = window.jspdf;

  // Agrupar por classe
  const agrupados = locaisFiltrados.reduce((acc, local) => {
    const cls = local.classe || "Desconhecida";
    if (!acc[cls]) acc[cls] = [];
    acc[cls].push(local);
    return acc;
  }, {});

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  let primeiraPagina = true;

  for (const [classe, locais] of Object.entries(agrupados)) {
    if (!primeiraPagina) doc.addPage();
    primeiraPagina = false;

    // Cabeçalho
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text(`Classe: ${classe}`, 14, 20);

    // Configurações
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    const marginTop = 30;
    const marginLeft = 14;
    const pageWidth = doc.internal.pageSize.getWidth() - 2 * marginLeft;
    const colWidth = pageWidth / 3; // 3 colunas
    const lineHeight = 7;
    let y = marginTop;
    let col = 0;

    locais.forEach((local, index) => {
      const texto = `${index + 1}° ${local.localizacao || local.localização || local.Localização || "?"}`;
      const x = marginLeft + col * colWidth;

      doc.text(texto, x, y);

      col++;
      if (col >= 3) {
        col = 0;
        y += lineHeight;

        // Quebra de página se passar do limite
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
      }
    });

    // Rodapé
    const page = doc.getCurrentPageInfo().pageNumber;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Página ${page}`, doc.internal.pageSize.getWidth() - 20, 290, { align: "right" });
  }

  doc.save("LocaisPorClasse.pdf");
}

function gerarPDFPorClasseComBordas(locaisFiltrados) {
  const { jsPDF } = window.jspdf;

  // Agrupar por classe
  const agrupados = locaisFiltrados.reduce((acc, local) => {
    const cls = local.classe || "Desconhecida";
    if (!acc[cls]) acc[cls] = [];
    acc[cls].push(local);
    return acc;
  }, {});

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  let primeiraPagina = true;

  for (const [classe, locais] of Object.entries(agrupados)) {
    if (!primeiraPagina) doc.addPage();
    primeiraPagina = false;

    // Cabeçalho
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text(`Classe: ${classe}`, 14, 20);

    // Configurações
    const marginTop = 30;
    const marginLeft = 14;
    const pageWidth = doc.internal.pageSize.getWidth() - 2 * marginLeft;
    const colWidth = pageWidth / 3;
    const colHeight = 7; // altura de cada “linha”
    let y = marginTop;
    let col = 0;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    locais.forEach((local, index) => {
      const texto = `${index + 1}° ${local.localizacao || local.localização || local.Localização || "?"}`;

      const x = marginLeft + col * colWidth;

      // Desenha caixa
      doc.setDrawColor(150);
      doc.rect(x - 1, y - 5, colWidth - 2, colHeight, "S"); // S = stroke (borda)

      // Escreve texto dentro da caixa
      doc.text(texto, x + 1, y);

      col++;
      if (col >= 3) {
        col = 0;
        y += colHeight + 2;

        // Quebra de página se necessário
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
      }
    });

    // Rodapé com número da página
    const page = doc.getCurrentPageInfo().pageNumber;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Página ${page}`, doc.internal.pageSize.getWidth() - 20, 290, { align: "right" });
  }

  doc.save("LocaisPorClasse.pdf");
}
