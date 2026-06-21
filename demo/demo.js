// Démo produit NoKo — données fictives, en mémoire uniquement (pas de persistance)
(function(){

  const PROJECTS = [
    {
      id: 'p1', name: 'Boulangerie Aux Trois Épis', loc: 'Lyon 7e · Boulangerie artisanale',
      type: 'pret', typeLabel: 'Prêt',
      desc: "Trésorerie tendue après une hausse du coût des matières premières. Le four principal doit être remplacé pour maintenir la production.",
      target: 18000, raised: 12400, rate: 9, duration: '18 mois',
      scores: { financier: 4, ecologique: 3, social: 4, gouvernance: 5 }
    },
    {
      id: 'p2', name: 'Garage Mécanique Lefort', loc: 'Reims · Réparation automobile',
      type: 'pret', typeLabel: 'Prêt',
      desc: "Perte d'un client majeur après la fermeture d'une flotte d'entreprise. Besoin de diversifier la clientèle et de financer un nouvel outillage diagnostic.",
      target: 32000, raised: 9800, rate: 8.5, duration: '24 mois',
      scores: { financier: 3, ecologique: 3, social: 4, gouvernance: 4 }
    },
    {
      id: 'p3', name: 'Épicerie Bonjour Quartier', loc: 'Toulouse · Commerce de proximité',
      type: 'pret', typeLabel: 'Prêt',
      desc: "Besoin de trésorerie rapide avant la période des fêtes pour financer un réassort fournisseur déjà commandé.",
      target: 9500, raised: 6200, rate: 10, duration: '3 mois',
      scores: { financier: 4, ecologique: 4, social: 5, gouvernance: 4 }
    },
    {
      id: 'p4', name: 'Ferme du Gers — maraîchage bio', loc: 'Gers · Exploitation agricole',
      type: 'capital', typeLabel: 'Apport en capital',
      desc: "Conversion en agriculture biologique nécessitant un investissement initial en matériel et en certification, avant la montée en rendement.",
      target: 45000, raised: 21000, rate: null, duration: 'Sortie 4-6 ans',
      scores: { financier: 3, ecologique: 5, social: 4, gouvernance: 4 }
    },
    {
      id: 'p5', name: "Atelier Bois & Sens", loc: 'Nantes · Menuiserie artisanale',
      type: 'pret', typeLabel: 'Prêt',
      desc: "Carnet de commandes plein mais trésorerie insuffisante pour financer les matériaux avant encaissement des acomptes clients.",
      target: 21000, raised: 14700, rate: 9, duration: '12 mois',
      scores: { financier: 4, ecologique: 4, social: 4, gouvernance: 5 }
    },
    {
      id: 'p6', name: 'Salon Lumière', loc: 'Brest · Coiffure & esthétique',
      type: 'pret', typeLabel: 'Prêt',
      desc: "Avance sur travaux de rénovation du local déjà engagés, en attente du remboursement par l'assurance dégât des eaux.",
      target: 7200, raised: 3100, rate: 10, duration: '4 mois',
      scores: { financier: 3, ecologique: 3, social: 4, gouvernance: 4 }
    },
    {
      id: 'p7', name: 'Imprimerie Solaire', loc: 'Montpellier · Imprimerie écoresponsable',
      type: 'capital', typeLabel: 'Apport en capital',
      desc: "Acquisition d'une nouvelle presse basse consommation pour réduire les coûts énergétiques et répondre à une demande croissante.",
      target: 38000, raised: 11400, rate: null, duration: 'Sortie 4-6 ans',
      scores: { financier: 4, ecologique: 5, social: 3, gouvernance: 5 }
    },
    {
      id: 'p8', name: 'Brasserie du Vieux Pont', loc: 'Strasbourg · Restauration', 
      type: 'pret', typeLabel: 'Prêt',
      desc: "Fermeture temporaire suite à un sinistre, besoin de trésorerie pour la réouverture et le maintien des 6 emplois de l'équipe.",
      target: 26000, raised: 5400, rate: 8, duration: '20 mois',
      scores: { financier: 3, ecologique: 3, social: 5, gouvernance: 4 }
    },
    {
      id: 'p9', name: 'Atelier Cuir Verlhac', loc: 'Limoges · Maroquinerie',
      type: 'pret', typeLabel: 'Prêt',
      desc: "Commande export confirmée, besoin d'une avance de trésorerie pour produire avant paiement à 60 jours du client.",
      target: 12000, raised: 8900, rate: 10, duration: '2 mois',
      scores: { financier: 4, ecologique: 3, social: 4, gouvernance: 4 }
    },
    {
      id: 'p10', name: 'Traiteur Au Bon Festin', loc: 'Dijon · Traiteur événementiel',
      type: 'escompte', typeLabel: 'Escompte',
      desc: "Facture émise à un comité d'entreprise pour un événement déjà réalisé, en attente de règlement à 45 jours.",
      target: 2400, raised: 1450, rate: 10, duration: 'Règlement en 1 fois',
      scores: { financier: 4, ecologique: 3, social: 4, gouvernance: 4 }
    },
    {
      id: 'p11', name: 'Plomberie Chauffage Renard', loc: 'Angers · Artisan plombier',
      type: 'escompte', typeLabel: 'Escompte',
      desc: "Facture de travaux validée par un syndic de copropriété, paiement attendu à 60 jours selon les délais habituels du secteur.",
      target: 4800, raised: 2900, rate: 10, duration: 'Règlement en 1 fois',
      scores: { financier: 4, ecologique: 3, social: 3, gouvernance: 4 }
    },
    {
      id: 'p12', name: 'Atelier Graphique Lemoine', loc: 'Rennes · Studio graphique', 
      type: 'escompte', typeLabel: 'Escompte',
      desc: "Facture de prestation pour une PME locale, validée et non contestée, en attente de règlement à 30 jours.",
      target: 1200, raised: 780, rate: 10, duration: 'Règlement en 1 fois',
      scores: { financier: 4, ecologique: 4, social: 3, gouvernance: 4 }
    },
    {
      id: 'p13', name: 'Transport Fret Occitan', loc: 'Béziers · Transport routier',
      type: 'escompte', typeLabel: 'Escompte',
      desc: "Facture de livraisons réalisées pour un client grossiste, paiement contractuel à 60 jours.",
      target: 5400, raised: 3100, rate: 10, duration: 'Règlement en 1 fois',
      scores: { financier: 3, ecologique: 2, social: 4, gouvernance: 4 }
    },
    {
      id: 'p14', name: 'Atelier Métal Design', loc: 'Saint-Étienne · Ferronnerie d\'art',
      type: 'escompte', typeLabel: 'Escompte',
      desc: "Facture de fabrication sur mesure pour un architecte, réglée habituellement à 45 jours fin de mois.",
      target: 3600, raised: 2000, rate: 10, duration: 'Règlement en 1 fois',
      scores: { financier: 4, ecologique: 3, social: 3, gouvernance: 5 }
    }
  ];

  const portfolio = []; // { projectId, name, amount, rate }

  const grid = document.getElementById('project-grid');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.getElementById('modal-close');

  function formatEUR(n){
    return Math.round(n).toLocaleString('fr-FR') + ' €';
  }

  function scoreBlock(scores){
    const labels = { financier: 'Financier', ecologique: 'Écologique', social: 'Social', gouvernance: 'Gouvernance' };
    return Object.keys(labels).map(k => `
      <div class="modal-score">
        <span class="modal-score-val">${scores[k]}/5</span>
        <span class="modal-score-label">${labels[k]}</span>
      </div>
    `).join('');
  }

  function renderProjects(filter){
    const list = filter === 'tous' ? PROJECTS : PROJECTS.filter(p => p.type === filter);
    grid.innerHTML = list.map(p => {
      const pct = Math.min(100, Math.round((p.raised / p.target) * 100));
      return `
        <article class="project-card" data-id="${p.id}">
          <div class="project-card-top">
            <span class="project-type">${p.typeLabel}</span>
            <span class="project-score">Note ${avgScore(p.scores)}/5</span>
          </div>
          <div class="project-body">
            <span class="project-name">${p.name}</span>
            <span class="project-loc">${p.loc}</span>
            <p class="project-desc">${p.desc}</p>
            <div class="project-progress">
              <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
              <div class="progress-meta"><span>${formatEUR(p.raised)} collectés</span><span>${pct}%</span></div>
            </div>
            <div class="project-footer">
              <div>
                <span class="project-rate">${p.rate ? p.rate + ' %' : '—'}</span>
                <span class="project-rate-label">${p.rate ? 'taux indicatif' : 'gain en capital'}</span>
              </div>
              <span class="project-rate-label">${p.duration}</span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    grid.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => openModal(card.dataset.id));
    });
  }

  function avgScore(scores){
    const vals = Object.values(scores);
    return (vals.reduce((a,b) => a+b, 0) / vals.length).toFixed(1);
  }

  function openModal(projectId){
    const p = PROJECTS.find(x => x.id === projectId);
    renderInvestStep(p, 30);
    modalOverlay.classList.add('open');
  }

  function renderInvestStep(p, amount){
    const isEscompte = p.type === 'escompte';
    const gainEstimate = p.rate ? Math.round(amount * (p.rate/100) * 100) / 100 : null;
    const yieldLabel = isEscompte ? 'Gain estimé au règlement' : (p.rate ? 'Rendement estimé / an' : 'Potentiel');

    modalContent.innerHTML = `
      <h2 id="modal-title">${p.name}</h2>
      <p class="modal-loc">${p.loc}</p>
      <p class="modal-desc">${p.desc}</p>
      <div class="modal-scores">${scoreBlock(p.scores)}</div>

      <div class="invest-form">
        <label for="invest-slider">Montant à investir</label>
        <div class="invest-amount-row">
          <input type="range" id="invest-slider" min="10" max="500" step="10" value="${amount}">
          <span class="invest-amount-display" id="invest-amount-display">${amount} €</span>
        </div>
        <div class="invest-presets">
          ${[10,30,50,100].map(v => `<button class="preset-btn${v===amount?' active':''}" data-val="${v}">${v} €</button>`).join('')}
        </div>

        <div class="invest-summary">
          <div class="invest-summary-row"><span>Type de financement</span><span>${p.typeLabel}</span></div>
          <div class="invest-summary-row"><span>${isEscompte ? 'Échéance du règlement' : 'Durée'}</span><span>${p.duration}</span></div>
          <div class="invest-summary-row"><span>${yieldLabel}</span><span>${p.rate ? formatEUR(gainEstimate) : 'Plus-value à la sortie'}</span></div>
        </div>

        <button class="btn btn-primary modal-confirm-btn" id="confirm-invest">Confirmer l'investissement de <span id="confirm-amount">${amount} €</span></button>
      </div>
    `;

    const slider = document.getElementById('invest-slider');
    const display = document.getElementById('invest-amount-display');
    const confirmAmount = document.getElementById('confirm-amount');
    const presets = modalContent.querySelectorAll('.preset-btn');

    function syncAmount(val){
      display.textContent = val + ' €';
      confirmAmount.textContent = val + ' €';
      presets.forEach(btn => btn.classList.toggle('active', parseInt(btn.dataset.val) === val));
      const yieldVal = p.rate ? Math.round(val * (p.rate/100) * 100) / 100 : null;
      const yieldRow = modalContent.querySelector('.invest-summary-row:last-child span:last-child');
      if(p.rate) yieldRow.textContent = formatEUR(yieldVal);
    }

    slider.addEventListener('input', (e) => syncAmount(parseInt(e.target.value)));
    presets.forEach(btn => {
      btn.addEventListener('click', () => {
        const v = parseInt(btn.dataset.val);
        slider.value = v;
        syncAmount(v);
      });
    });

    document.getElementById('confirm-invest').addEventListener('click', () => {
      const finalAmount = parseInt(slider.value);
      portfolio.push({ name: p.name, amount: finalAmount, rate: p.rate, type: p.typeLabel });
      renderSuccessStep(p, finalAmount);
      renderPortfolio();
    });
  }

  function renderSuccessStep(p, amount){
    modalContent.innerHTML = `
      <div class="modal-success">
        <div class="modal-success-icon">✓</div>
        <h2 id="modal-title">Investissement simulé</h2>
        <p>Vous avez "investi" ${formatEUR(amount)} dans ${p.name}. Retrouvez-le dans votre portefeuille de démonstration.</p>
        <button class="btn btn-primary" id="close-success">Voir mon portefeuille</button>
      </div>
    `;
    document.getElementById('close-success').addEventListener('click', () => {
      closeModal();
      document.getElementById('portefeuille').scrollIntoView({ behavior: 'smooth' });
    });
    showToast(`${formatEUR(amount)} investis dans ${p.name}`);
  }

  function closeModal(){
    modalOverlay.classList.remove('open');
  }

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if(e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') closeModal();
  });

  function renderPortfolio(){
    const empty = document.getElementById('portfolio-empty');
    const summary = document.getElementById('portfolio-summary');
    const list = document.getElementById('portfolio-list');

    if(portfolio.length === 0){
      empty.hidden = false;
      summary.hidden = true;
      list.innerHTML = '';
      return;
    }

    empty.hidden = true;
    summary.hidden = false;

    const total = portfolio.reduce((sum, item) => sum + item.amount, 0);
    const yearlyYield = portfolio.reduce((sum, item) => sum + (item.rate ? item.amount * (item.rate/100) : 0), 0);

    document.getElementById('summary-total').textContent = formatEUR(total);
    document.getElementById('summary-count').textContent = portfolio.length;
    document.getElementById('summary-yield').textContent = formatEUR(yearlyYield);

    list.innerHTML = portfolio.map(item => `
      <div class="portfolio-item">
        <div>
          <div class="portfolio-item-name">${item.name}</div>
          <div class="portfolio-item-meta">${item.type}${item.rate ? ' · ' + item.rate + ' %' : ''}</div>
        </div>
        <span class="portfolio-item-amount">${formatEUR(item.amount)}</span>
      </div>
    `).reverse().join('');
  }

  function showToast(msg){
    let toast = document.querySelector('.toast');
    if(!toast){
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // Filters
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderProjects(chip.dataset.filter);
    });
  });

  renderProjects('tous');
  renderPortfolio();
})();
