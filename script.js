// ================= CONFIGURAÇÃO =================
const config = {
  nomeBarbearia: "Barber-Pro",
  whatsappBarbearia: "5571991979419",

  barbeiros: [{ nome: "Alex" }, { nome: "Romario" }],

  servicos: [
    { nome: "Corte", preco: 60, icone: "✂️" },
    { nome: "Barba", preco: 30, icone: "🧔" },
    { nome: "Sobrancelha", preco: 30, icone: "👁️" },
    { nome: "Corte + Barba", preco: 75, icone: "✨" },
  ],

  horarios: [
    "09:00",
    "10:20",
    "11:00",
    "14:20",
    "15:00",
    "16:10",
    "17:00",
    "18:20",
  ],
};

// ================= ESTADO =================
let state = {
  barbeiro: "",
  servico: "",
  preco: 0,
  data: "",
  horario: "",
};

// ================= INICIALIZAÇÃO =================
document.addEventListener("DOMContentLoaded", () => {
  gerarBarbeiros();
  gerarServicos();
  gerarHorarios();
  configurarDataMinima();
});

// ================= GERADORES DINÂMICOS =================
function gerarBarbeiros() {
  const container = document.querySelector(".barbeiros-container");
  container.innerHTML = "";

  config.barbeiros.forEach((b) => {
    container.innerHTML += `
      <div class="barbeiro-card" onclick="selectBarbeiro(this, '${b.nome}')">
        <div class="barbeiro-avatar">${b.nome.charAt(0)}</div>
        <div class="barbeiro-nome">${b.nome}</div>
      </div>
    `;
  });
}

function gerarServicos() {
  const container = document.querySelector(".servicos-container");
  container.innerHTML = "";

  config.servicos.forEach((s) => {
    container.innerHTML += `
      <div class="servico-card" onclick="selectServico(this, '${s.nome}', ${s.preco})">
        <div class="servico-icon">${s.icone}</div>
        <div>${s.nome}</div>
        <div>R$ ${s.preco}</div>
      </div>
    `;
  });
}

function gerarHorarios() {
  const container = document.querySelector(".horarios-container");
  container.innerHTML = "";

  config.horarios.forEach((h) => {
    container.innerHTML += `
      <button class="horario-btn" onclick="selectHorario(this, '${h}')">
        ${h}
      </button>
    `;
  });
}

// ================= SELEÇÕES =================
function selectBarbeiro(element, nome) {
  document
    .querySelectorAll(".barbeiro-card")
    .forEach((e) => e.classList.remove("selected"));
  element.classList.add("selected");
  state.barbeiro = nome;
}

function selectServico(element, nome, preco) {
  document
    .querySelectorAll(".servico-card")
    .forEach((e) => e.classList.remove("selected"));
  element.classList.add("selected");
  state.servico = nome;
  state.preco = preco;
}

function selectHorario(element, horario) {
  document
    .querySelectorAll(".horario-btn")
    .forEach((e) => e.classList.remove("selected"));
  element.classList.add("selected");
  state.horario = horario;
}

// ================= DATA =================
function configurarDataMinima() {
  const hoje = new Date();
  const yyyy = hoje.getFullYear();
  const mm = String(hoje.getMonth() + 1).padStart(2, "0");
  const dd = String(hoje.getDate()).padStart(2, "0");
  const dataMinima = `${yyyy}-${mm}-${dd}`;

  document.getElementById("data").setAttribute("min", dataMinima);
}

function formatarDataBR(dataISO) {
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

// ================= ETAPAS =================
function nextStep(current) {
  if (current === "barbeiro" && !state.barbeiro)
    return alert("Selecione um barbeiro");
  if (current === "servico" && !state.servico)
    return alert("Selecione um serviço");

  if (current === "data") {
    const dataInput = document.getElementById("data").value;
    if (!dataInput) return alert("Escolha uma data");
    state.data = formatarDataBR(dataInput);
  }

  if (current === "horario" && !state.horario)
    return alert("Selecione um horário");

  const steps = ["barbeiro", "servico", "data", "horario", "confirm"];
  const index = steps.indexOf(current);

  document.querySelectorAll(".step").forEach((s) => s.classList.add("hidden"));
  document
    .getElementById(`step-${steps[index + 1]}`)
    .classList.remove("hidden");

  if (steps[index + 1] === "confirm") atualizarResumo();
}

function previousStep(current) {
  const steps = ["barbeiro", "servico", "data", "horario", "confirm"];
  const index = steps.indexOf(current);

  document.querySelectorAll(".step").forEach((s) => s.classList.add("hidden"));
  document
    .getElementById(`step-${steps[index - 1]}`)
    .classList.remove("hidden");
}

// ================= RESUMO =================
function atualizarResumo() {
  const nome = document.getElementById("nome").value.trim();
  const telefone = document.getElementById("telefone").value.trim();

  const resumo = `
  📆 AGENDAMENTO

  👤 Cliente: ${nome}
  📞 Telefone: ${telefone}

  📅 Data: ${state.data}
  ⏰ Horário: ${state.horario}

  💈 Profissional: ${state.barbeiro}
  ✂️ Serviço: ${state.servico} - R$${state.preco}
  `;

  document.getElementById("resumo").innerText = resumo;
}

// ================= FINALIZAR =================
function finalizar() {
  const nome = document.getElementById("nome").value.trim();
  const telefone = document.getElementById("telefone").value.trim();

  if (!nome || !telefone) return alert("Preencha nome e WhatsApp");

  if (!state.barbeiro || !state.servico || !state.data || !state.horario)
    return alert("Complete todas as etapas");

  // Mapeamento de emojis para códigos Unicode
  const emojis = {
    calendario: "\uD83D\uDCC6", // 📆
    cliente: "\uD83D\uDC64", // 👤
    telefone: "\uD83D\uDCDE", // 📞
    data: "\uD83D\uDCC5", // 📅
    horario: "\u23F0", // ⏰
    profissional: "\uD83D\uDC88", // 💈
    servico: "\u2702\uFE0F", // ✂️
    alerta: "\u26A0\uFE0F", // ⚠️
  };

  const mensagem = `${emojis.calendario} *AGENDAMENTO*

${emojis.cliente} CLIENTE: *${nome}*
${emojis.telefone} TELEFONE: ${telefone}
----------------------
${emojis.data} DATA: ${state.data}
${emojis.horario} HORÁRIO: ${state.horario}
----------------------
${emojis.profissional} PROFISSIONAL: ${state.barbeiro}
${emojis.servico} SERVIÇO: ${state.servico} - R$${state.preco}

${emojis.alerta} Após confirmação, aguarde validação do horário pela barbearia`;

  const link = `https://wa.me/${config.whatsappBarbearia}?text=${encodeURIComponent(mensagem)}`;

  window.open(link, "_blank");
}
