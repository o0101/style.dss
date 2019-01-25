import {dss} from './dss.js';
import {generateUniquePrefix, prefixAllRules} from './c3s/c3s.js';
import {addInsertListener, addRemovedListener, monitorChanges} from './monitorChanges.js';

const stylistFunctions = new Map();

function associate(className, element, stylist, state) {
  const styleText = stylist(element, state) || '';
  const styleMarkup = `
    <style data-prefix="${className}">
      ${styleText}
    </style>
  `;
  document.head.insertAdjacentHTML('beforeEnd', styleMarkup);
  const styleElement = document.head.querySelector(`style[data-prefix="${className}"]`);
  const styleSheet = styleElement.sheet;
  prefixAllRules(styleSheet, "." + className);
  element.setAttribute('associated', 'true');
}

function disassociate(className, element) {
  const styleSheet = document.querySelector(`style[data-prefix="${className}"]`); 
  if ( !! styleSheet ) {
    element.classList.remove(className);
    styleSheet.remove();
  }
}

export function initializeDSS(functionsObject) {
  document.head.insertAdjacentHTML('afterBegin', `
    <style data-role="prevent-fouc">
      [stylist]:not([associated]) {
        display: none !important;
      }
    </style>
  `);
  addMoreStylistFunctions(functionsObject); 
  addInsertListener(associateStylistFunctions);
  addRemovedListener(unassociateStylistFunctions);
  monitorChanges();
  const initialEls = Array.from(document.querySelectorAll('[stylist]'));
  associateStylistFunctions(...initialEls);

  function associateStylistFunctions(...els) {
    els = els.filter(el => el.hasAttribute('stylist'));
    if ( els.length == 0 ) return;
    for ( const el of els ) {
      const stylistName = el.getAttribute('stylist');
      const stylist = stylistFunctions.get(stylistName);
      const className = randomClass();
      el.classList.add(className);
      associate(className, el, stylist);
    }
  }

  function unassociateStylistFunctions(...els) {
    els = els.filter(el => el.hasAttribute('stylist'));
    if ( els.length == 0 ) return;
    for ( const el of els ) {
      el.classList.forEach(className => className.startsWith('c3s') && disassociate(className, el));
    }
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

function randomClass() {
  const {prefix:className} = generateUniquePrefix();
  return className;
}
