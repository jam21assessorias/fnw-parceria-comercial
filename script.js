// Renderiza dots de score
document.querySelectorAll('.dots').forEach(function(el) {
  var score = parseInt(el.getAttribute('data-score'), 10);
  var html = '';
  for (var i = 1; i <= 10; i++) {
    html += '<div class="dot' + (i <= score ? ' on' : '') + '"></div>';
  }
  el.innerHTML = html;
});

// Formatação de moeda BRL
function fmt(v) {
  return 'R$ ' + Math.round(v).toLocaleString('pt-BR');
}

// Calcula receita acumulada em 12 meses com efeito de carteira crescente
function calcAnual(ticket, parceiros, retencao, base) {
  var total = 0;
  var ativos = 0;
  for (var m = 1; m <= 12; m++) {
    ativos = Math.round(ativos * retencao + parceiros);
    var fech = parceiros * ticket * 0.20;
    var rec  = ativos * ticket * 0.15;
    total += base + fech + rec;
  }
  return Math.round(total);
}

function update() {
  var ticket    = +document.getElementById('ticket').value;
  var parceiros = +document.getElementById('parceiros').value;
  var retencao  = +document.getElementById('retencao').value / 100;
  var base      = +document.getElementById('base').value;

  // Atualiza labels dos sliders
  document.getElementById('ticket-out').textContent    = 'R$ ' + ticket.toLocaleString('pt-BR');
  document.getElementById('parceiros-out').textContent = parceiros + ' parceiro' + (parceiros > 1 ? 's' : '');
  document.getElementById('retencao-out').textContent  = Math.round(retencao * 100) + '%';
  document.getElementById('base-out').textContent      = 'R$ ' + base.toLocaleString('pt-BR');

  // Mês 1
  var fech  = parceiros * ticket * 0.20;
  var rec   = parceiros * ticket * 0.15;
  var total = base + fech + rec;

  document.getElementById('m-base').textContent  = fmt(base);
  document.getElementById('m-fech').textContent  = fmt(fech);
  document.getElementById('m-rec').textContent   = fmt(rec);
  document.getElementById('m-total').textContent = fmt(total);

  // 12 meses com slider
  var anual = calcAnual(ticket, parceiros, retencao, base);
  document.getElementById('m-anual').textContent = fmt(anual);
  document.getElementById('m-media').textContent = 'Média mensal: ' + fmt(anual / 12);

  // Cenários fixos
  var cons = calcAnual(3500, 1, 0.75, 2000);
  var mod  = calcAnual(6000, 2, 0.85, 2000);
  var agg  = calcAnual(9000, 4, 0.90, 2000);

  document.getElementById('s-cons').textContent = fmt(cons);
  document.getElementById('s-mod').textContent  = fmt(mod);
  document.getElementById('s-agg').textContent  = fmt(agg);

  var maxVal = agg;
  document.getElementById('b-cons').style.width = Math.round(cons / maxVal * 100) + '%';
  document.getElementById('b-mod').style.width  = Math.round(mod  / maxVal * 100) + '%';
  document.getElementById('b-agg').style.width  = '100%';
}

// Bind sliders
['ticket', 'parceiros', 'retencao', 'base'].forEach(function(id) {
  document.getElementById(id).addEventListener('input', update);
});

// Inicializa
update();
