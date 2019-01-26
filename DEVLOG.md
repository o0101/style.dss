# dynamic style sheets


Something like:

```
<div class=component stylist="styleMe()">
  ...
</div>

...

<script>
    function styleMe(...some relevant properties of view and element...) {
        // do some things to work out which styles
        // then return CSS rules
    }
</script>
```

The idea is these rules get updated when the element gets updated.
So for instance if we redraw a part of that component, then we recall the stylist function.
And the style rules in the DSS related to that component, are, if necessary, updated.

So the entire set of stylist functions, is like a giant 
"style function of state", that produces / and minimally diffs, 
a single dynamic style sheet.


Sort of like the way we produce markup as function of state, here we produce style.

## More ideas

We need to do something like, whenever we update state, call ALL the style functions to we can produce
ANY required changes. (Just like in Brutal).

But an optimization should also be possible as well, that we have recourse to, should it be desired.

So that I can call, such an such a stylist function in reaction to an action / state change.

But the thing is, how do I, as in ME, the AUTHOR, KNOW, which stylist function corresponds to the change?

Well, I GUESS, just in the same way we KNOW (and duplicate), the dependency between state and view markup render functions.

The final point is, given we have keyed, multiple instances of the one render for collections of data,

when I call a stylist function, HOW WILL IT KNOW, which particular KEYED style rules to update?

That is the interesting part.

The mapping, not between singleton views and style rules, but between keyed collection views and 

style rules?

Because we are avoiding CSS and any idea of classes (that is handled by DSS internally). 

And further, HOW are the stylist functions "BONDED" to a particular view ? 

Like how are the classes generated, how are they "printed" onto a keyed markup, and into the stylesheet?

Also, the stylesheet is updated dynamically (just like MARKUP in brutal), we replace stylerules

as they are not needed, but the newer versions (minimal diffing, just like Brutal with HTML).

## More ideas

So I like how the style function is declaratively "bonded" to the root HTML tree it will affect.

This bonding ensures that:

1) Correct random classes are applied to the root, and
2) The produced rules are prefixed by those random classes

Also the random class applies to 1 element.

So we have a couple of cases of maintaining this bond.

1. The element root never changes, and the random class persists, and there is only 1 element that this style function is bonded to, then
2. whenever that style function is called it will
3. 1. compute a new style
4. 2. get the random class from the element.
5. 3. find the corresponding rules in the sheet prefixed by that class.
6. 4. update those rules if necessary.
7. 

What if, on account of state change we rerender that element, and the "bond" is broken?

Well, then the style function, on the element being bonded into the DOM, is again
bound to that element. And so the process continues.

What if, that 1 element template, actually prints to multiple things, such as in a collection, and each view is keyed?

We obviously want there to be 1 set of style rules PER KEYED VIEW, not per style function

But each keyed view will have its own BOND event.

So actually because of this DSS does NOT need to know anything about any keys,
it can just handle everything from a bond event.

So random class exists for each BOND event. And that's how we keep it. 

OK, but when we call such a function, and we produce new rules, we have to pass in an element.
We can't just call functions by themselves. 

Right.

So there has to be a table where these functions are entered. along with their element in the DOM.

In other words, each style function can have more than one element, it needs to be called with. 

So as we call "EACH" style function, we must retrieve from this table the list of elements that it applies to, and call it ONCE, for each such element.
Passing in both the element, and the state each time.

On Bond, we both call the style function once for the bonded element, AND add that element to that table.

On UNBOND ( a new event, it seems we need it ), we will remove it from the table ( we could try to "get clever" with using a weak map, and relying on there
no longer being references to then somehow signal that we need to remove it from the list, but this gets complex and may not even be reliable)).

Simpler that an element can have an unbond event. 

Unbond BOTH, deletes the element from the list of its style function/s
AND removes the associated styles.

So, each ELEMENT <-> style function bond is LINKED by a random class.

So we basically have a table that is,

style function -> n element : 1 random class

for each style function, AND

to make it easier to LOOK things up, a reverse table

element -> n style functions

Or we could just have a table like

random class -> n (style function / element pair)

Maybe that's a good data structure.

Anyway, when elements leave the DOM, we remove the stlyes and the element style function bonds (we can search via random class, good idea).

When elements are ADDED to the DOM, we compute the styles, add the styles, and add the elements to the random class table. 


--- I actually think that I should use mutation observers, rather than "coupling" this to the Brutal framework and requiring a change to brutal
"unbond" event, and event hooks. I think I should just use mutation observers.

