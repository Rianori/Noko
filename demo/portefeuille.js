// portefeuille.js — page "Mon portefeuille" : mes titres + marché secondaire
(function(){

  if(typeof window.NokoStore === 'undefined' || typeof window.NOKO_MARKET_LISTINGS === 'undefined'){
    console.error('Dépendances manquantes : vérifiez que portfolio-store.js et secondary-market.js sont chargés avant portefeuille.js');
    const banner = document.createElement('div');
    banner.style.cssText = 'background:#b5651d;color:#fff;padding:14px 20px;text-align:center;font-family:monospace;font-size:13px;';
    banner.textContent = 'Erreur de chargement : le portefeuille ne peut pas fonctionner sur cette page (script manquant).';
    document.body.prepend(banner);
    return;
  }

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

  /* ============================================
     MES TITRES
     ============================================ */
  const holdingsEmpty = document.getElementById('holdings-empty');
  const holdingsSummary = document.getElementById('holdings-summary');
  const holdingsList = document.getElementById('holdings-list');

  const sellOverlay = document.getElementById('sell-modal-overlay');
  const sellContent = document.getElementById('sell-modal-content');
  const sellClose = document.getElementById('sell-modal-close');

  function renderHoldings(){
    const holdings = NokoStore.getHoldings();

    if(holdings.length === 0){
      holdingsEmpty.hidden = false;
      holdingsSummary.hidden = true;
      holdingsList.innerHTML = '';
      return;
    }

    holdingsEmpty.hidden = true;
    holdingsSummary.hidden = false;

    const total = holdings.reduce((sum, h) => sum + h.amount, 0);
    const onSale = holdings.filter(h => h.status === 'en_vente').length;

    document.getElementById('holdings-total').textContent = formatEUR(total);
    document.getElementById('holdings-count').textContent = holdings.length;
    document.getElementById('holdings-on-sale').textContent = onSale;

    holdingsList.innerHTML = holdings.slice().reverse().map(h => `
      <div class="holding-card" data-id="${h.id}">
        <div class="holding-main">
          <span class="holding-name">${h.name}</span>
          <span class="holding-meta">${h.type}${h.rate ? ' · ' + h.rate + ' %' : ''}${h.duration ? ' · ' + h.duration : ''}</span>
        </div>
        <div class="holding-right">
          <span class="holding-amount">${formatEUR(h.amount)}</span>
          ${h.status === 'en_vente'
            ? `<div class="holding-sale-info">
                 <span class="tag-en-vente-card">En vente · ${formatEUR(h.askPrice)}</span>
                 <button class="btn-link-small" data-action="cancel" data-id="${h.id}">Retirer de la vente</button>
               </div>`
            : `<button class="btn btn-ghost btn-sm" data-action="sell" data-id="${h.id}">Mettre en vente</button>`
          }
        </div>
      </div>
    `).join('');

    holdingsList.querySelectorAll('[data-action="sell"]').forEach(btn => {
      btn.addEventListener('click', () => openSellModal(btn.dataset.id));
    });
    holdingsList.querySelectorAll('[data-action="cancel"]').forEach(btn => {
      btn.addEventListener('click', () => {
        NokoStore.cancelSale(btn.dataset.id);
        renderHoldings();
        showToast('Titre retiré de la vente');
      });
    });
  }

  function openSellModal(holdingId){
    const holding = NokoStore.getHoldings().find(h => h.id === holdingId);
    if(!holding) return;
    renderSellStep(holding);
    sellOverlay.classList.add('open');
  }

  function renderSellStep(holding){
    const suggested = holding.amount;
    sellContent.innerHTML = `
      <h2 id="sell-modal-title">Mettre en vente</h2>
      <p class="modal-loc">${holding.name}</p>
      <p class="modal-desc">Vous avez investi ${formatEUR(holding.amount)} dans ce projet. Fixez le prix auquel vous souhaitez céder ce titre sur le marché secondaire — un autre investisseur pourra l'acheter à ce prix.</p>

      <div class="invest-form">
        <label for="sell-price-input">Prix de vente demandé</label>
        <div class="sell-price-row">
          <input type="number" id="sell-price-input" min="1" step="1" value="${suggested}">
          <span class="sell-price-suffix">€</span>
        </div>
        <p class="sell-price-hint" id="sell-price-hint">Identique à votre montant investi (vente au pair).</p>

        <div class="invest-presets">
          <button class="preset-btn" data-pct="-10">−10 %</button>
          <button class="preset-btn active" data-pct="0">Au pair</button>
          <button class="preset-btn" data-pct="10">+10 %</button>
          <button class="preset-btn" data-pct="20">+20 %</button>
        </div>

        <button class="btn btn-primary modal-confirm-btn" id="confirm-sell">Mettre en vente à <span id="confirm-sell-price">${formatEUR(suggested)}</span></button>
      </div>
    `;

    const input = document.getElementById('sell-price-input');
    const hint = document.getElementById('sell-price-hint');
    const confirmPrice = document.getElementById('confirm-sell-price');
    const presets = sellContent.querySelectorAll('.preset-btn');

    function updateHint(price){
      const diff = price - holding.amount;
      const pct = (diff / holding.amount) * 100;
      confirmPrice.textContent = formatEUR(price);
      if(Math.abs(pct) < 0.5){
        hint.textContent = 'Identique à votre montant investi (vente au pair).';
      } else if(pct > 0){
        hint.textContent = `Prime de ${pct.toFixed(0)} % par rapport à votre investissement initial.`;
      } else {
        hint.textContent = `Décote de ${Math.abs(pct).toFixed(0)} % — vente plus rapide, mais à perte.`;
      }
    }

    input.addEventListener('input', () => {
      const val = parseFloat(input.value) || 0;
      updateHint(val);
      presets.forEach(b => b.classList.remove('active'));
    });

    presets.forEach(btn => {
      btn.addEventListener('click', () => {
        const pct = parseInt(btn.dataset.pct);
        const price = Math.round(holding.amount * (1 + pct/100));
        input.value = price;
        updateHint(price);
        presets.forEach(b => b.classList.toggle('active', b === btn));
      });
    });

    document.getElementById('confirm-sell').addEventListener('click', () => {
      const finalPrice = parseFloat(input.value);
      if(!finalPrice || finalPrice <= 0){
        hint.textContent = 'Indiquez un prix valide.';
        return;
      }
      NokoStore.listForSale(holding.id, finalPrice);
      renderSellSuccess(holding, finalPrice);
      renderHoldings();
    });
  }

  function renderSellSuccess(holding, price){
    sellContent.innerHTML = `
      <div class="modal-success">
        <div class="modal-success-icon">✓</div>
        <h2 id="sell-modal-title">Titre mis en vente</h2>
        <p>Votre titre ${holding.name} est désormais proposé à ${formatEUR(price)} sur le marché secondaire NoKo.</p>
        <button class="btn btn-primary" id="close-sell-success">Fermer</button>
      </div>
    `;
    document.getElementById('close-sell-success').addEventListener('click', closeSellModal);
    showToast(`Titre mis en vente à ${formatEUR(price)}`);
  }

  function closeSellModal(){ sellOverlay.classList.remove('open'); }
  sellClose.addEventListener('click', closeSellModal);
  sellOverlay.addEventListener('click', (e) => { if(e.target === sellOverlay) closeSellModal(); });

  /* ============================================
     MARCHE SECONDAIRE
     ============================================ */
  const marketGrid = document.getElementById('market-grid');
  const buyOverlay = document.getElementById('buy-modal-overlay');
  const buyContent = document.getElementById('buy-modal-content');
  const buyClose = document.getElementById('buy-modal-close');

  function priceCategory(listing){
    const diffPct = ((listing.askPrice - listing.originalAmount) / listing.originalAmount) * 100;
    if(Math.abs(diffPct) < 1) return 'pair';
    return diffPct > 0 ? 'prime' : 'decote';
  }

  function priceDiffLabel(listing){
    const diffPct = ((listing.askPrice - listing.originalAmount) / listing.originalAmount) * 100;
    if(Math.abs(diffPct) < 1) return { text: 'Au pair', cls: 'diff-pair' };
    if(diffPct > 0) return { text: `+${diffPct.toFixed(0)} %`, cls: 'diff-prime' };
    return { text: `${diffPct.toFixed(0)} %`, cls: 'diff-decote' };
  }

  function renderMarket(filter){
    const list = filter === 'tous' ? NOKO_MARKET_LISTINGS : NOKO_MARKET_LISTINGS.filter(l => priceCategory(l) === filter);

    marketGrid.innerHTML = list.map(listing => {
      const diff = priceDiffLabel(listing);
      const progressPct = Math.round((listing.remainingMonths / listing.totalMonths) * 100);
      return `
        <article class="market-card" data-id="${listing.id}">
          <div class="market-card-top">
            <span class="project-type">${listing.typeLabel}</span>
            <span class="market-diff ${diff.cls}">${diff.text}</span>
          </div>
          <div class="market-card-body">
            <span class="project-name">${listing.projectName}</span>
            <span class="project-loc">${listing.loc}</span>
            <p class="market-seller">Vendu par <strong>${listing.seller}</strong> · investissement initial ${formatEUR(listing.originalAmount)}</p>
            <div class="market-remaining">
              <div class="progress-bar"><div class="progress-fill" style="width:${progressPct}%"></div></div>
              <span class="progress-meta-single">${listing.remainingMonths} mois restants sur ${listing.totalMonths}</span>
            </div>
            <div class="project-footer market-footer">
              <div>
                <span class="project-rate">${formatEUR(listing.askPrice)}</span>
                <span class="project-rate-label">prix demandé</span>
              </div>
              <span class="project-rate-label">${listing.rate ? listing.rate + ' % indicatif' : 'gain en capital'}</span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    marketGrid.querySelectorAll('.market-card').forEach(card => {
      card.addEventListener('click', () => openBuyModal(card.dataset.id));
    });
  }

  function openBuyModal(listingId){
    const listing = NOKO_MARKET_LISTINGS.find(l => l.id === listingId);
    if(!listing) return;
    renderBuyStep(listing);
    buyOverlay.classList.add('open');
  }

  function renderBuyStep(listing){
    const diff = priceDiffLabel(listing);
    buyContent.innerHTML = `
      <h2 id="buy-modal-title">${listing.projectName}</h2>
      <p class="modal-loc">${listing.loc}</p>
      <p class="modal-desc">Titre cédé par <strong>${listing.seller}</strong>, investisseur d'origine. Ce projet a déjà atteint son objectif de collecte ; il ne s'agit pas d'un nouvel investissement dans l'entreprise mais du rachat d'un titre existant.</p>
      <div class="modal-scores">${scoreBlock(listing.scores)}</div>

      <div class="invest-summary buy-summary">
        <div class="invest-summary-row"><span>Montant initialement investi</span><span>${formatEUR(listing.originalAmount)}</span></div>
        <div class="invest-summary-row"><span>Prix demandé aujourd'hui</span><span>${formatEUR(listing.askPrice)}</span></div>
        <div class="invest-summary-row"><span>Écart par rapport au nominal</span><span class="${diff.cls}">${diff.text}</span></div>
        <div class="invest-summary-row"><span>Durée restante</span><span>${listing.remainingMonths} mois sur ${listing.totalMonths}</span></div>
        <div class="invest-summary-row"><span>${listing.rate ? 'Taux indicatif restant' : 'Nature du gain'}</span><span>${listing.rate ? listing.rate + ' %' : 'Plus-value à la sortie'}</span></div>
      </div>

      <p class="buy-disclaimer">En achetant ce titre, vous reprenez les droits de l'investisseur d'origine jusqu'à l'échéance du projet. Le prix de marché peut être supérieur ou inférieur au montant initial selon l'offre et la demande.</p>

      <button class="btn btn-primary modal-confirm-btn" id="confirm-buy">Acheter ce titre pour ${formatEUR(listing.askPrice)}</button>
    `;

    document.getElementById('confirm-buy').addEventListener('click', () => {
      NokoStore.addHolding({
        projectId: listing.id,
        name: listing.projectName,
        amount: listing.askPrice,
        rate: listing.rate,
        type: listing.typeLabel + ' (marché secondaire)',
        projectType: listing.projectType,
        duration: `${listing.remainingMonths} mois restants`
      });
      renderBuySuccess(listing);
      renderHoldings();
    });
  }

  function renderBuySuccess(listing){
    buyContent.innerHTML = `
      <div class="modal-success">
        <div class="modal-success-icon">✓</div>
        <h2 id="buy-modal-title">Achat simulé</h2>
        <p>Vous avez racheté le titre de ${listing.seller} sur ${listing.projectName} pour ${formatEUR(listing.askPrice)}. Il apparaît maintenant dans vos titres, ci-dessus.</p>
        <button class="btn btn-primary" id="close-buy-success">Voir mes titres</button>
      </div>
    `;
    document.getElementById('close-buy-success').addEventListener('click', () => {
      closeBuyModal();
      document.getElementById('mes-titres').scrollIntoView({ behavior: 'smooth' });
    });
    showToast(`Titre acheté pour ${formatEUR(listing.askPrice)}`);
  }

  function closeBuyModal(){ buyOverlay.classList.remove('open'); }
  buyClose.addEventListener('click', closeBuyModal);
  buyOverlay.addEventListener('click', (e) => { if(e.target === buyOverlay) closeBuyModal(); });

  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape'){ closeSellModal(); closeBuyModal(); }
  });

  document.querySelectorAll('#market-filters .filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#market-filters .filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderMarket(chip.dataset.filter);
    });
  });

  renderHoldings();
  renderMarket('tous');
})();
