// tokenisation.js — schéma interactif du cycle de tokenisation NoKo
(function(){

  const STEPS = {
    '1': {
      title: 'Vous investissez 30 €',
      text: "Vous choisissez un projet sur NoKo — par exemple un prêt à une boulangerie en difficulté — et confirmez votre investissement. Cet argent est versé sur un compte de cantonnement, séparé des comptes de NoKo, en attendant que la collecte du projet soit bouclée.",
      meta: [
        ['Montant investi', '30 €'],
        ['Type de financement', 'Prêt rémunéré'],
        ['Destinataire des fonds', 'Compte de cantonnement']
      ]
    },
    '2': {
      title: 'Votre créance devient un token',
      text: "Une fois la collecte terminée, NoKo inscrit votre créance sur la blockchain sous forme de token : un identifiant numérique unique qui représente vos droits (montant, taux, durée). Ce token est adossé à une créance réelle en euros — ce n'est pas une cryptomonnaie spéculative, juste un registre infalsifiable de ce qui vous est dû.",
      meta: [
        ['Ce qui est inscrit', 'Montant, taux, durée'],
        ['Infrastructure', 'Ethereum / Polygon (couche 2)'],
        ['Coût de transaction', '< 0,01 €']
      ]
    },
    '3': {
      title: 'Vous détenez votre titre',
      text: "Le token reste associé à votre compte tant que vous ne le cédez pas. Vous percevez les remboursements prévus (intérêts, capital) directement sur votre espace NoKo. Le token ne change rien à votre expérience au quotidien — vous voyez un projet, un taux, une échéance, pas du code.",
      meta: [
        ['Remboursements', 'Versés automatiquement'],
        ['Visibilité', 'Suivi en temps réel'],
        ['Mobilité du token', 'Cessible à tout moment']
      ]
    },
    '4': {
      title: 'Vous revendez avant l\'échéance',
      text: "Besoin de récupérer votre argent avant la fin du prêt ? Vous mettez votre token en vente sur le marché secondaire NoKo, au prix de votre choix. Un autre investisseur peut l'acheter : le transfert de propriété est instantané et inscrit sur la blockchain, sans intermédiaire ni délai bancaire.",
      meta: [
        ['Prix de vente', 'Fixé librement par vous'],
        ['Acheteur', 'Un autre investisseur NoKo'],
        ['Délai de transfert', 'Instantané']
      ]
    }
  };

  const nodes = document.querySelectorAll('.token-node');
  const detailTitle = document.getElementById('token-detail-title');
  const detailText = document.getElementById('token-detail-text');
  const detailEyebrow = document.querySelector('.token-detail-eyebrow');
  const detailMeta = document.getElementById('token-detail-meta');

  const lines = document.querySelectorAll('.flow-line');
  const arrows = document.querySelectorAll('.flow-arrow');

  let currentStep = null;
  const visited = new Set();

  function activateLine(upToStep){
    lines.forEach(line => {
      const lineNum = parseInt(line.dataset.line, 10);
      line.style.stroke = lineNum < upToStep ? 'var(--green-vivid)' : '';
    });
    arrows.forEach(arrow => {
      const arrowNum = parseInt(arrow.dataset.arrow, 10);
      arrow.style.fill = arrowNum < upToStep ? 'var(--green-vivid)' : '';
    });
  }

  function selectStep(stepId){
    currentStep = stepId;
    visited.add(stepId);

    nodes.forEach(node => {
      const isActive = node.dataset.step === stepId;
      node.classList.toggle('active', isActive);
      node.classList.toggle('visited', visited.has(node.dataset.step));
      node.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    activateLine(parseInt(stepId, 10) + 1);

    const data = STEPS[stepId];
    detailEyebrow.textContent = `Étape ${stepId.padStart(2, '0')} sur 04`;
    detailTitle.textContent = data.title;
    detailText.textContent = data.text;

    detailMeta.innerHTML = data.meta.map(([label, value]) => `
      <div class="token-detail-meta-row"><span>${label}</span><span>${value}</span></div>
    `).join('');
    detailMeta.hidden = false;
  }

  nodes.forEach(node => {
    node.addEventListener('click', () => selectStep(node.dataset.step));
    node.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        selectStep(node.dataset.step);
      }
    });
  });

  // Activation automatique de la première étape pour amorcer la découverte
  selectStep('1');
})();
