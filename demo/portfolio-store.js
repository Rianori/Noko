// portfolio-store.js — état partagé du portefeuille NoKo (démo)
// Persisté en localStorage pour rester cohérent au sein de demo/index.html (page unique).
// ATTENTION : ceci est une simulation pédagogique, aucune donnée ne sort du navigateur.

window.NokoStore = (function(){
  const KEY = 'noko_demo_portfolio_v1';
  const MARKET_KEY = 'noko_demo_market_v1';
  const instanceId = 'inst_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  console.log('NokoStore: nouvelle instance créée ->', instanceId);

  // Fallback mémoire si localStorage est inaccessible (navigation privée stricte, Safari avec
  // cookies/stockage bloqués, etc.). Le test vérifie une RELECTURE de la valeur écrite, pas
  // seulement l'absence d'exception : certains navigateurs (Safari notamment) peuvent accepter
  // un setItem() sans lever d'erreur tout en ne persistant rien réellement.
  let memoryFallback = [];
  let storageAvailable = true;
  try{
    const testKey = '__noko_test__';
    const testValue = 'probe_' + Date.now();
    localStorage.setItem(testKey, testValue);
    const readBack = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    if(readBack !== testValue){
      storageAvailable = false;
      console.warn('NokoStore: localStorage accepte l\'écriture mais ne persiste pas la valeur (écrit "' + testValue + '", relu "' + readBack + '"). Bascule en mémoire pour cette session.');
    }
  }catch(e){
    storageAvailable = false;
    console.warn('NokoStore: localStorage indisponible, le portefeuille ne persistera pas entre les pages dans cette session.', e);
  }

  if(!storageAvailable && typeof window.NokoShowStorageWarning === 'function'){
    window.NokoShowStorageWarning('stockage persistant', 'mémoire temporaire uniquement (le portefeuille se réinitialisera au rechargement)');
  }

  function load(){
    if(!storageAvailable) return memoryFallback;
    try{
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    }catch(e){
      console.warn('NokoStore: lecture portefeuille impossible', e);
      return memoryFallback;
    }
  }

  function save(items){
    if(!storageAvailable){
      memoryFallback = items;
      return;
    }
    try{
      localStorage.setItem(KEY, JSON.stringify(items));
    }catch(e){
      console.warn('NokoStore: écriture portefeuille impossible, bascule en mémoire pour cette session', e);
      storageAvailable = false;
      memoryFallback = items;
    }
  }

  function genId(){
    return 'h' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  return {
    /** Renvoie la liste complète des titres détenus (actifs + en vente) */
    getHoldings(){ return load(); },

    /** Ajoute un nouveau titre suite à un investissement (page Projets ou achat sur le marché) */
    addHolding(holding){
      const items = load();
      const countBefore = items.length;
      items.push(Object.assign({
        id: genId(),
        status: 'actif', // 'actif' | 'en_vente'
        askPrice: null,
        acquiredAt: Date.now()
      }, holding));
      save(items);

      const verify = load();
      console.log(`NokoStore[${instanceId}].addHolding: ${countBefore} titre(s) avant, ${verify.length} après ajout de "${holding.name}". memoryFallback.length=${memoryFallback.length}, storageAvailable=${storageAvailable}`);
      if(verify.length !== countBefore + 1){
        console.error(`NokoStore: écart de persistance détecté sur addHolding. Attendu ${countBefore + 1}, trouvé ${verify.length}.`);
        if(typeof window.NokoShowStorageWarning === 'function'){
          window.NokoShowStorageWarning(countBefore + 1, verify.length);
        }
      }
      return verify;
    },

    /** Ajoute plusieurs titres identiques en une seule opération atomique (achat groupé sur le marché secondaire) */
    addMultipleHoldings(holdingTemplate, qty){
      const items = load();
      const countBefore = items.length;
      for(let i = 0; i < qty; i++){
        items.push(Object.assign({
          id: genId() + '_' + i,
          status: 'actif',
          askPrice: null,
          acquiredAt: Date.now()
        }, holdingTemplate));
      }
      save(items);

      // Vérification post-écriture : relit immédiatement pour confirmer que tout a bien été persisté.
      const verify = load();
      const expectedCount = countBefore + qty;
      if(verify.length !== expectedCount){
        console.error(`NokoStore: écart de persistance détecté. Attendu ${expectedCount} titres, trouvé ${verify.length} après écriture.`);
        if(typeof window.NokoShowStorageWarning === 'function'){
          window.NokoShowStorageWarning(expectedCount, verify.length);
        }
      }
      return verify;
    },

    /** Met un titre en vente à un prix fixé par l'utilisateur */
    listForSale(holdingId, askPrice){
      const items = load();
      const item = items.find(h => h.id === holdingId);
      if(item){
        item.status = 'en_vente';
        item.askPrice = askPrice;
      }
      save(items);
      return items;
    },

    /** Retire un titre de la vente, le repasse actif */
    cancelSale(holdingId){
      const items = load();
      const item = items.find(h => h.id === holdingId);
      if(item){
        item.status = 'actif';
        item.askPrice = null;
      }
      save(items);
      return items;
    },

    /** Retire définitivement un titre du portefeuille (vendu) */
    removeHolding(holdingId){
      const items = load().filter(h => h.id !== holdingId);
      save(items);
      return items;
    },

    /** Vide tout le portefeuille (utilisé par le bouton de réinitialisation démo) */
    reset(){
      save([]);
    }
  };
})();
