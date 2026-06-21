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

  // Alerte visible si le store détecte un écart entre ce qui devait être écrit et ce qui a été relu.
  window.NokoShowStorageWarning = function(expected, actual){
    const banner = document.createElement('div');
    banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:500;background:#b5651d;color:#fff;padding:14px 20px;text-align:center;font-family:monospace;font-size:13px;';
    banner.textContent = `Problème de stockage détecté : ${expected} titres attendus, ${actual} réellement enregistrés. Votre navigateur limite peut-être le stockage local sur ce site (mode privé strict, extension de blocage, ou stockage désactivé dans les réglages).`;
    document.body.prepend(banner);
  };

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

  function groupHoldings(holdings){
    // Regroupe les titres actifs identiques (même projet, même montant) avec un compteur.
    // Les titres en vente restent affichés individuellement (chacun peut avoir un prix différent).
    const groups = [];
    const onSaleItems = [];

    holdings.forEach(h => {
      if(h.status === 'en_vente'){
        onSaleItems.push(h);
        return;
      }
      const key = h.projectId + '|' + h.amount + '|' + h.type;
      let group = groups.find(g => g.key === key);
      if(!group){
        group = { key, ids: [], name: h.name, type: h.type, rate: h.rate, duration: h.duration, amount: h.amount };
        groups.push(group);
      }
      group.ids.push(h.id);
    });

    return { groups, onSaleItems };
  }

  function renderHoldings(){
    const holdings = window.NokoStore.getHoldings();

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

    const { groups, onSaleItems } = groupHoldings(holdings);

    const groupCards = groups.slice().reverse().map(g => {
      const qtyTag = g.ids.length > 1 ? `<span class="holding-qty-tag">× ${g.ids.length}</span> ` : '';
      return `
        <div class="holding-card" data-group-key="${g.key}">
          <div class="holding-main">
            <span class="holding-name">${qtyTag}${g.name}</span>
            <span class="holding-meta">${g.type}${g.rate ? ' · ' + g.rate + ' %' : ''}${g.duration ? ' · ' + g.duration : ''}</span>
          </div>
          <div class="holding-right">
            <span class="holding-amount">${g.ids.length > 1 ? formatEUR(g.amount) + ' / titre' : formatEUR(g.amount)}</span>
            <button class="btn btn-ghost btn-sm" data-action="sell-group" data-key="${g.key}">Mettre en vente</button>
          </div>
        </div>
      `;
    }).join('');

    const onSaleCards = onSaleItems.slice().reverse().map(h => `
      <div class="holding-card" data-id="${h.id}">
        <div class="holding-main">
          <span class="holding-name">${h.name}</span>
          <span class="holding-meta">${h.type}${h.rate ? ' · ' + h.rate + ' %' : ''}${h.duration ? ' · ' + h.duration : ''}</span>
        </div>
        <div class="holding-right">
          <span class="holding-amount">${formatEUR(h.amount)}</span>
          <div class="holding-sale-info">
            <span class="tag-en-vente-card">En vente · ${formatEUR(h.askPrice)}</span>
            <button class="btn-link-small" data-action="cancel" data-id="${h.id}">Retirer de la vente</button>
          </div>
        </div>
      </div>
    `).join('');

    holdingsList.innerHTML = onSaleCards + groupCards;

    holdingsList.querySelectorAll('[data-action="sell-group"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const group = groups.find(g => g.key === btn.dataset.key);
        if(group) openSellModal(group);
      });
    });
    holdingsList.querySelectorAll('[data-action="cancel"]').forEach(btn => {
      btn.addEventListener('click', () => {
        window.NokoStore.cancelSale(btn.dataset.id);
        renderHoldings();
        showToast('Titre retiré de la vente');
      });
    });
  }

  window.NokoRenderHoldings = renderHoldings; // appelable depuis demo.js après un investissement initial

  function openSellModal(group){
    renderSellStep(group);
    sellOverlay.classList.add('open');
  }

  function renderSellStep(group){
    const suggested = group.amount;
    const maxQty = group.ids.length;
    sellContent.innerHTML = `
      <h2 id="sell-modal-title">Mettre en vente</h2>
      <p class="modal-loc">${group.name}</p>
      <p class="modal-desc">Vous détenez ${maxQty > 1 ? maxQty + ' titres identiques' : '1 titre'} de ${formatEUR(group.amount)} sur ce projet. Choisissez combien en céder et fixez le prix unitaire demandé sur le marché secondaire.</p>

      <div class="invest-form">
        ${maxQty > 1 ? `
        <label for="sell-qty-input">Nombre de titres à vendre</label>
        <div class="qty-row">
          <button type="button" class="qty-btn" id="sell-qty-minus" aria-label="Diminuer">−</button>
          <input type="number" id="sell-qty-input" min="1" max="${maxQty}" step="1" value="1">
          <button type="button" class="qty-btn" id="sell-qty-plus" aria-label="Augmenter">+</button>
        </div>
        <p class="qty-hint">Sur les ${maxQty} titres identiques détenus.</p>
        ` : ''}

        <label for="sell-price-input">Prix de vente demandé (par titre)</label>
        <div class="sell-price-row">
          <input type="number" id="sell-price-input" min="1" step="1" value="${suggested}">
          <span class="sell-price-suffix">€</span>
        </div>
        <p class="sell-price-hint" id="sell-price-hint">Identique à votre montant investi.</p>

        <div class="invest-presets">
          <button class="preset-btn" data-pct="-10">−10 %</button>
          <button class="preset-btn active" data-pct="0">Prix initial</button>
          <button class="preset-btn" data-pct="10">+10 %</button>
          <button class="preset-btn" data-pct="20">+20 %</button>
        </div>

        <button class="btn btn-primary modal-confirm-btn" id="confirm-sell"><span id="confirm-sell-label">Mettre en vente à ${formatEUR(suggested)}</span></button>
      </div>
    `;

    const input = document.getElementById('sell-price-input');
    const hint = document.getElementById('sell-price-hint');
    const confirmLabel = document.getElementById('confirm-sell-label');
    const presets = sellContent.querySelectorAll('.preset-btn');
    const qtyInput = document.getElementById('sell-qty-input');
    const qtyMinus = document.getElementById('sell-qty-minus');
    const qtyPlus = document.getElementById('sell-qty-plus');

    function currentQty(){
      if(!qtyInput) return 1;
      let v = parseInt(qtyInput.value, 10);
      if(isNaN(v) || v < 1) v = 1;
      if(v > maxQty) v = maxQty;
      return v;
    }

    function updateLabel(){
      const price = parseFloat(input.value) || 0;
      const qty = currentQty();
      const diff = price - group.amount;
      const pct = (diff / group.amount) * 100;
      if(Math.abs(pct) < 0.5){
        hint.textContent = 'Identique à votre montant investi.';
      } else if(pct > 0){
        hint.textContent = `Prime de ${pct.toFixed(0)} % par rapport à votre investissement initial.`;
      } else {
        hint.textContent = `Décote de ${Math.abs(pct).toFixed(0)} % — vente plus rapide, mais à perte.`;
      }
      confirmLabel.textContent = qty > 1
        ? `Mettre en vente ${qty} titres à ${formatEUR(price)} chacun`
        : `Mettre en vente à ${formatEUR(price)}`;
    }

    input.addEventListener('input', () => {
      updateLabel();
      presets.forEach(b => b.classList.remove('active'));
    });

    presets.forEach(btn => {
      btn.addEventListener('click', () => {
        const pct = parseInt(btn.dataset.pct);
        const price = Math.round(group.amount * (1 + pct/100));
        input.value = price;
        updateLabel();
        presets.forEach(b => b.classList.toggle('active', b === btn));
      });
    });

    if(qtyInput){
      qtyMinus.addEventListener('click', () => { qtyInput.value = Math.max(1, currentQty() - 1); updateLabel(); });
      qtyPlus.addEventListener('click', () => { qtyInput.value = Math.min(maxQty, currentQty() + 1); updateLabel(); });
      qtyInput.addEventListener('input', updateLabel);
      qtyInput.addEventListener('blur', () => { qtyInput.value = currentQty(); updateLabel(); });
    }

    document.getElementById('confirm-sell').addEventListener('click', () => {
      const finalPrice = parseFloat(input.value);
      if(!finalPrice || finalPrice <= 0){
        hint.textContent = 'Indiquez un prix valide.';
        return;
      }
      const qty = currentQty();
      const idsToSell = group.ids.slice(0, qty);
      idsToSell.forEach(id => window.NokoStore.listForSale(id, finalPrice));
      renderSellSuccess(group, finalPrice, qty);
      renderHoldings();
    });
  }

  function renderSellSuccess(group, price, qty){
    sellContent.innerHTML = `
      <div class="modal-success">
        <div class="modal-success-icon">✓</div>
        <h2 id="sell-modal-title">${qty > 1 ? 'Titres mis en vente' : 'Titre mis en vente'}</h2>
        <p>${qty > 1 ? qty + ' titres' : 'Votre titre'} ${group.name} ${qty > 1 ? 'sont désormais proposés' : 'est désormais proposé'} à ${formatEUR(price)} ${qty > 1 ? 'chacun' : ''} sur le marché secondaire NoKo.</p>
        <button class="btn btn-primary" id="close-sell-success">Fermer</button>
      </div>
    `;
    document.getElementById('close-sell-success').addEventListener('click', closeSellModal);
    showToast(`${qty > 1 ? qty + ' titres mis' : 'Titre mis'} en vente à ${formatEUR(price)}`);
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

  function renderMarket(filter){
    const list = filter === 'tous' ? window.NOKO_MARKET_LISTINGS : window.NOKO_MARKET_LISTINGS.filter(l => l.projectType === filter);

    marketGrid.innerHTML = list.map(listing => {
      const isCapital = listing.projectType === 'capital';
      const progressPct = Math.round((listing.remainingMonths / listing.totalMonths) * 100);
      const remainingBlock = isCapital ? '' : `
            <div class="market-remaining">
              <div class="progress-bar"><div class="progress-fill" style="width:${progressPct}%"></div></div>
              <span class="progress-meta-single">${listing.remainingMonths} mois restants sur ${listing.totalMonths}</span>
            </div>`;
      return `
        <article class="market-card" data-id="${listing.id}">
          <div class="market-card-top">
            <span class="project-type">${listing.typeLabel}</span>
          </div>
          <div class="market-card-body">
            <span class="project-name">${listing.projectName}</span>
            <span class="project-loc">${listing.loc}</span>
            <p class="market-seller">Investissement initial ${formatEUR(listing.originalAmount)}</p>${remainingBlock}
            <div class="project-footer market-footer">
              <div>
                <span class="project-rate">${formatEUR(listing.askPrice)}</span>
                <span class="project-rate-label">prix demandé</span>
              </div>
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
    const listing = window.NOKO_MARKET_LISTINGS.find(l => l.id === listingId);
    if(!listing) return;
    renderBuyStep(listing);
    buyOverlay.classList.add('open');
  }

  function renderBuyStep(listing){
    const isCapital = listing.projectType === 'capital';
    buyContent.innerHTML = `
      <h2 id="buy-modal-title">${listing.projectName}</h2>
      <p class="modal-loc">${listing.loc}</p>
      <p class="modal-desc">Ce projet a déjà atteint son objectif de collecte ; il ne s'agit pas d'un nouvel investissement dans l'entreprise mais du rachat d'un titre existant auprès d'un autre investisseur.</p>
      <div class="modal-scores">${scoreBlock(listing.scores)}</div>

      <div class="invest-form">
        <label for="buy-qty-input">Nombre de titres à acheter</label>
        <div class="qty-row">
          <button type="button" class="qty-btn" id="qty-minus" aria-label="Diminuer">−</button>
          <input type="number" id="buy-qty-input" min="1" max="20" step="1" value="1">
          <button type="button" class="qty-btn" id="qty-plus" aria-label="Augmenter">+</button>
        </div>
        <p class="qty-hint">Plusieurs titres identiques sont proposés à ce prix unitaire.</p>

        <div class="invest-summary buy-summary">
          <div class="invest-summary-row"><span>Prix demandé (par titre)</span><span>${formatEUR(listing.askPrice)}</span></div>
          ${isCapital ? '' : `<div class="invest-summary-row"><span>Durée restante</span><span>${listing.remainingMonths} mois sur ${listing.totalMonths}</span></div>`}
          <div class="invest-summary-row invest-summary-total"><span>Total à payer</span><span id="buy-total-price">${formatEUR(listing.askPrice)}</span></div>
        </div>

        <p class="buy-disclaimer">En achetant ces titres, vous reprenez les droits de l'investisseur d'origine jusqu'à l'échéance du projet. Le prix de marché peut être supérieur ou inférieur au montant initial selon l'offre et la demande.</p>

        <button class="btn btn-primary modal-confirm-btn" id="confirm-buy"><span id="confirm-buy-label">Acheter 1 titre pour ${formatEUR(listing.askPrice)}</span></button>
      </div>
    `;

    const qtyInput = document.getElementById('buy-qty-input');
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');
    const totalPriceEl = document.getElementById('buy-total-price');
    const confirmLabel = document.getElementById('confirm-buy-label');
    const confirmBtn = document.getElementById('confirm-buy');

    function clampQty(val){
      val = parseInt(val, 10);
      if(isNaN(val) || val < 1) val = 1;
      if(val > 20) val = 20;
      return val;
    }

    function syncQty(qty){
      qty = clampQty(qty);
      qtyInput.value = qty;
      const total = qty * listing.askPrice;
      totalPriceEl.textContent = formatEUR(total);
      confirmLabel.textContent = `Acheter ${qty} ${qty > 1 ? 'titres' : 'titre'} pour ${formatEUR(total)}`;
    }

    qtyMinus.addEventListener('click', () => syncQty(parseInt(qtyInput.value, 10) - 1));
    qtyPlus.addEventListener('click', () => syncQty(parseInt(qtyInput.value, 10) + 1));
    qtyInput.addEventListener('input', () => syncQty(qtyInput.value));
    qtyInput.addEventListener('blur', () => syncQty(qtyInput.value));

    let purchaseInProgress = false;
    confirmBtn.addEventListener('click', () => {
      if(purchaseInProgress) return;
      purchaseInProgress = true;
      confirmBtn.disabled = true;

      const qty = clampQty(qtyInput.value);
      window.NokoStore.addMultipleHoldings({
        projectId: listing.id,
        name: listing.projectName,
        amount: listing.askPrice,
        rate: listing.rate,
        type: listing.typeLabel + ' (marché secondaire)',
        projectType: listing.projectType,
        duration: isCapital ? '' : `${listing.remainingMonths} mois restants`
      }, qty);

      renderBuySuccess(listing, qty);
      renderHoldings();
    });
  }

  function renderBuySuccess(listing, qty){
    const total = qty * listing.askPrice;
    const titreLabel = qty > 1 ? `${qty} titres` : 'le titre';
    buyContent.innerHTML = `
      <div class="modal-success">
        <div class="modal-success-icon">✓</div>
        <h2 id="buy-modal-title">Achat simulé</h2>
        <p>Vous avez racheté ${titreLabel} sur ${listing.projectName} pour ${formatEUR(total)} au total. ${qty > 1 ? 'Ils apparaissent' : 'Il apparaît'} maintenant dans vos titres, ci-dessus.</p>
        <button class="btn btn-primary" id="close-buy-success">Voir mes titres</button>
      </div>
    `;
    document.getElementById('close-buy-success').addEventListener('click', () => {
      closeBuyModal();
      document.getElementById('mes-titres').scrollIntoView({ behavior: 'smooth' });
    });
    showToast(`${qty > 1 ? qty + ' titres achetés' : 'Titre acheté'} pour ${formatEUR(total)}`);
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

  // Panneau de diagnostic discret en bas de page : aide à voir l'état réel du stockage
  // si jamais un titre attendu n'apparaît pas. Cliquer pour afficher/masquer le détail.
  renderDiagnosticPanel();

  function renderDiagnosticPanel(){
    const panel = document.createElement('div');
    panel.className = 'diag-panel';
    panel.innerHTML = `
      <button type="button" class="diag-toggle" id="diag-toggle">Diagnostic stockage</button>
      <pre class="diag-content" id="diag-content" hidden></pre>
    `;
    document.body.appendChild(panel);

    document.getElementById('diag-toggle').addEventListener('click', () => {
      const content = document.getElementById('diag-content');
      content.hidden = !content.hidden;
      if(!content.hidden){
        let raw = null;
        let storageError = null;
        try{
          raw = localStorage.getItem('noko_demo_portfolio_v1');
        }catch(e){
          storageError = e.message;
        }
        const lines = [
          'Origine : ' + window.location.origin,
          'Page : ' + window.location.pathname,
          'localStorage accessible : ' + (storageError ? 'NON (' + storageError + ')' : 'oui'),
          'Clé "noko_demo_portfolio_v1" brute :',
          raw || '(vide ou absente)',
          '',
          'NokoStore.getHoldings() :',
          JSON.stringify(window.NokoStore.getHoldings(), null, 2)
        ];
        content.textContent = lines.join('\n');
      }
    });
  }
})();
