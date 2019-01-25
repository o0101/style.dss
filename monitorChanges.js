export function monitorChanges() {
  // demo of watching for any new nodes that declare stylists
  const mo = new MutationObserver((mutations)=> {
    const AddedElements = [];
    const RemovedElements = [];
    for ( const mutation of mutations ) {
      const addedElements = Array.from(mutation.addedNodes).filter(x => x.nodeType == Node.ELEMENT_NODE && x.hasAttribute('stylist'));
      const removedElements = Array.from(mutation.removedNodes).filter(x => x.nodeType == Node.ELEMENT_NODE && x.hasAttribute('stylist'));
      AddedElements.push(...addedElements);
      RemovedElements.push(...removedElements);
    }
    if ( AddedElements.length || RemovedElements.length ) {
      console.log({AddedElements,RemovedElements});
    }
  });
  mo.observe(document.documentElement, {childList:true, subtree:true});
}
