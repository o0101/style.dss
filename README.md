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


