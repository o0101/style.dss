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


Sort of like the way we produce markup as function of state, here we produce styles.


