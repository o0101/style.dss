# Dyanmic Style Sheets (DSS) 

*Current version:* 1.4.0

DSS aims to implement style as a function of state. Effectively it results in functionality similar to a cross between scoped style sheets, and CSS-in-JS.

```console
$ npm i --save style.dss
```

## Concept

`style = F(state)`

The basic idea is you have "stylist" functions that are pure functions of state, that produce valid CSS. 

To make this useful, markup tags can declare their stylist functions (space separated lists of function names) with the "stylist" attribute.

On initialization, DSS looks at each element with a "stylist" attribute, calls the stylists the element requests and applies their styles to that element. 

These styles are applied in a "scoped" way so that they do not bleed outside the component boundary.

## Using

Let's make a simple demo.

First, create your styling control file, `stylcon.js`

```javascript
  // import some useful functions
  import {initializeDSS, setState, restyleAll} from 'https://unpkg.com/style.dss';

  // create some application state
  const appState = {
    mode: 'delicious',
    level: 9
  };

  // create a stylist functions
  function linkColorizer(el, state) {
    return `
      a, a:visited, a:hover, a:link {
        color: ${state.mode == 'delicious' ? 'orange' : 'purple'};
        background: ${state.level < 9 ? 'transparent' : 'silver'};
      }
    `
  }

  // initialize DSS
  initializeDSS(appState, {linkColorizer});

  // make some globals for console play
  Object.assign(self, {setState, restyleAll});
```
  
then create some markup in your `index.html` file:

```html
  <script type=module src=style-control.js></script>
  <section stylist=linkColorizer>
    <p>
      <a href=#color>I should have some non-standard colorings</a>
  </section>
  <section>
    <p>
      <a href=#normal>I should be a totally normal hyperlink</a>
   </section>
```

load this file in your browser of choice, and you should see the first link with some non-standard colorings and the second link looking very normal.

Now open up a developer console, and play around with setting different values in the state using `setState` and calling `restyleAll` to propagate these state changes to the style functions.

For more examples, you may see the tests in "index.html".

I've also included the above demo in "demo.html".

## Usage

Overview of functions:

- `restyleAll`: restyles all elements that have stylist attributes
- `restyleElement`: restyles a single element
- `setState`: sets the copy of the state used by stylist functions to calculate style text

# FAQ

## How can I prevent FOUC?

Flash of unstyled content can be prevented by adding this stylesheet to the top of your head element:

```html
  <style data-role="prevent-fouc">
    [stylist]:not([associated]) {
      display: none !important;
    }
  </style>
```

## What about dynamically inserted and removed markup?

Don't worry. If you are adding or removing tags and components to your page that use stylist functions, DSS has you covered.

DSS monitors the changes to the DOM using mutation observers, keeping on the lookout for any tags bearing stylist attributes being added or removed, 
and it updates its tables accordingly.

## How can I contribute?

You're welcome to open issues and make PRs, but I don't want to have an OSS project with lots of commitments, so I will avoid making it into that.

## How can I develop?

I recommend you clone the repo and run `serve -p 8080` (or whatever port you like) on its directory.

# DSS in depth

## Style scoping and the cascade 

DSS styles are scoped to a component, meaning they will not affect DOM ancestors, or siblings, but it's important to realize that DSS can still cascade within the component subtree. 

For example:

```javascript
  function underlinePs(el, state) {
    return `
      article p {
        text-decoration: underline;
      }
    `;
  }
```

*will* cascade to all descendent `p` tags of the article that requests the `underlinePs` stylist, 
but *will not* affect any `p` tags anywhere else in the document. 

## Technical Deep-dive

Stylist functions are pure functions that optionally take a DOM element, and a state object, and produce a output string that is valid CSS.

DSS applies stylist functions to elements that request them by creating a unique class name for each such element-stylist pair, adding that class name to the requesting element's class list, calling the stylist function to generate some unprefixed CSS-as-a-function of state, creating a stylesheet from that CSS, and then prefixing that CSS with the unique classname representing the stylist-element pairing, before adding that stylesheet to the DOM, resulting in those scoped styles being applied to *only* that element.

DSS creates 1 style element (and stylesheet) for each element-stylist pairing. There is [an open issue](https://gitlab.com/dosycorp/dss/issues/1) to optimize style generation only using a single style element and stylesheet.

DSS relies on a CSSS library (Cascading Scoped Style Sheets) called "C3S" to provide random classes and prefix style rules. This library has some limitations currently. For example, media queries and their sub-rules are not supported. For more information about C3S limitations, see [the open issue](https://github.com/crislin2046/c3s/issues/4).

