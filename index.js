import {dss} from './dss.js';
import {addInsertListener, addRemovedListener, monitorChanges} from './monitorChanges.js';

const stylistFunctions = new Map();

export function initializeDSS(functionsObject) {
  addMoreStylistFunctions(functionsObject); 
  addInsertListener(associateStylistFunctions);
  addRemovedListener(unassociateStylistFunctions);
  monitorChanges();
  const initialEls = Array.from(document.querySelectorAll('[stylist]'));
  associateStylistFunctions(...initialEls);

  function associateStylistFunctions(...els) {
    els = els.filter(el => el.hasAttribute('stylist'));
    if ( els.length == 0 ) return;
    console.log("Stylist els added", els);
  }

  function unassociateStylistFunctions(...els) {
    els = els.filter(el => el.hasAttribute('stylist'));
    if ( els.length == 0 ) return;
    console.log("Stylist els removed", els);
  }
}

// an object whose properties are functions that are stylist functions
export function addMoreStylistFunctions(functionsObject) {
  const toRegister = [];
  for ( const funcName of Object.keys(functionsObject) ) {
    const value = functionsObject[funcName];
    if ( typeof value !== "function" ) throw new TypeError("Functions object must only contain functions.");
    toRegister.push(() => stylistFunctions.set(funcName,value));
  }
  while(toRegister.length) toRegister.pop()();
}

