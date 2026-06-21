// Simulateur d'investissement — landing page NoKo
(function(){
  const slider = document.getElementById('amount-slider');
  const amountValue = document.getElementById('amount-value');
  const outTotal = document.getElementById('out-total');
  const outShare = document.getElementById('out-share');
  const outYield = document.getElementById('out-yield');

  const PROJECT_SIZE = 20000; // projet de référence, cf. dossier commercial
  const RATE = 0.09; // taux indicatif prêt rémunéré

  function formatEUR(n){
    return n.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + ' €';
  }

  function update(){
    const monthly = parseInt(slider.value, 10);
    const total = monthly * 12;
    const share = (monthly / PROJECT_SIZE) * 100;
    const yieldEstimate = total * RATE;

    amountValue.textContent = monthly;
    outTotal.textContent = formatEUR(total);
    outShare.textContent = share.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %';
    outYield.textContent = '≈ ' + formatEUR(Math.round(yieldEstimate * 100) / 100);

    // update slider fill gradient to track value
    const pct = ((monthly - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(to right, var(--green-vivid) 0%, var(--green-vivid) ${pct}%, rgba(11,43,31,0.15) ${pct}%)`;
  }

  if(slider){
    slider.addEventListener('input', update);
    update();
  }
})();
