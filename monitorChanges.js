const InsertListeners = [];
const RemovedListeners = [];

const inserted = new Set();
const removed = new Set();
let monitoring = false;

export function addInsertListener(listener) {
  if ( inserted.has( listener ) ) return;
  InsertListeners.push(listener);
  inserted.add(listener);
}

export function addRemovedListener(listener) {
  if ( removed.has(listener) ) return;
  RemovedListeners.push(listener);
  removed.add(listener);
}

export function monitorChanges() {
  if ( monitoring ) return;
  // demo of watching for any new nodes that declare stylists
  const mo = new MutationObserver((mutations)=> {
    let AddedElements = [];
    let RemovedElements = [];
    for ( const mutation of mutations ) {
      const addedElements = Array.from(mutation.addedNodes).filter(x => x.nodeType == Node.ELEMENT_NODE && x.hasAttribute('stylist'));
      const removedElements = Array.from(mutation.removedNodes).filter(x => x.nodeType == Node.ELEMENT_NODE && x.hasAttribute('stylist'));
      AddedElements.push(...addedElements);
      RemovedElements.push(...removedElements);
    }
    const AddedSet = new Set(AddedElements);
    const FilterOut = new Set();
    RemovedElements.forEach(el => AddedSet.has(el) && FilterOut.add(el));
    AddedElements = AddedElements.filter(el => !FilterOut.has(el));
    RemovedElements = RemovedElements.filter(el => !FilterOut.has(el));

    if ( RemovedElements.length ) {
      for ( const listener of RemovedListeners ) {
        try {
          listener(...RemovedElements);
        } catch(e) {
          console.warn("Removed listener error", e, listener);
        }
      }
    }
    if ( AddedElements.length ) {
      for ( const listener of InsertListeners ) {
        try {
          listener(...AddedElements);  
        } catch(e) {
          console.warn("Insert listener error", e, listener);
        }
      }
    } 
  });
  mo.observe(document.documentElement, {childList:true, subtree:true});
  monitoring = true;
}
