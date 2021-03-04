# super-stringify

## Introduction
`super-stringify` is like `JSON.stringify`'s superhero cousin. It converts a JavaScript object to a string, but unlike `JSON.stringify` it is not limited to
things that can be represented in JSON, which makes it much more useful.

Usage:

```
const superStringify = require('super-stringify');
console.log(superStringify(anyObject));
```

The `superStringify` function takes one input argument - a JavaScript object - plus an optional `space` formatter, that's treated the same way as the `space` formatter argument to `JSON.stringify`. If that object can be represented as JSON, then it produces
identical output to `JSON.stringify`. For example:

```
> let obj = { a: 1, b: 'two', c: [1, 2, 3] };
> JSON.stringify(obj)
"{"a":1,"b":"two","c":[1,2,3]}"
> superStringify(obj)
"{"a":1,"b":"two","c":[1,2,3]}"
```

But unlike `JSON.stringify`, we can super-stringify *any* JavaScript object:

```
> let obj = { a: 1 }; obj.b = obj; let c = [true, 2, () => { }]; delete c[1]; c.push(c[2]); obj.c = c;
> superStringify(obj, 2)
{
  "a": 1,
  "b": [ReferenceTo this],
  "c": [
    true,
    [Empty],
    [Function],
    [ReferenceTo this.c[2]]
  ]
}
> JSON.stringify(obj, null, 2)
Error
```

Yes, really anything! Try in your browser for example:

```angular2html
> superStringify(window, 2)
```

## JSON.stringify can go wrong in many subtle ways - super-stringify saves you

`JSON.stringify` is kind of a JavaScript Swiss Army knife. Use it to pretty-print objects for debugging:

`> console.log(JSON.stringify(obj, null, 2));`

Very commonly, it's used to clone objects:

`> let obj2 = JSON.parse(JSON.stringify(obj));`

The problem with using it to clone objects is that it does unexpected things without telling you sometimes. For example,
suppose we have `obj` as follows:

```
> let obj = { a: { b: 1 } };
> obj.b = obj.a;
```

Then we clone it, and check in two ways the clone represents the same data:

```
> let obj2 = JSON.parse(JSON.stringify(obj));
> obj
{ a: { b: 1 }, b: { b: 1 } }
> obj2
{ a: { b: 1 }, b: { b: 1 } }
> JSON.stringify(obj) === JSON.stringify(obj2)
true
```

So far so good. But then surprising stuff happens:

```
> obj.a.b = 2;    // Change something in obj
> obj2.a.b = 2;   // Make the same change on obj2
> JSON.stringify(obj) === JSON.stringify(obj2)
false   <-- huh?
> obj
{ a: { b: 2 }, b: { b: 2 } }
> obj2
{ a: { b: 2 }, b: { b: 1 } }
```

Of course, we can see why this happens, because we modified `obj` ourselves to include a reference to the same object twice. But when we're using objects created in other people's modules, we usually don't know
whether object properties that are themselves objects are uniquely referenced or not. And because JavaScript doesn't give us an easy way
to tell, it's very easy to introduce bugs which are nearly impossible to
find when things like this happen, and values in objects are not what you expect.

Whereas just looking at `obj` and `obj2` at this point leaves us mystified, `super-stringify` explains to us exactly why what happened, happened:

```
> superStringify(obj)
{"a":{"b":2},"b":[ReferenceTo this.a]}
> superStringify(obj2)
{"a":{"b":2},"b":{"b":1}}
```

Another problem: `JSON.stringify` usually errors out if the input is not JSON - but not always! For example:

```
> let obj = [null, null];  // this object is valid JSON
> let obj2 = Array(2);     // this object is not valid JSON
> JSON.stringify(obj)
[null,null]   <-- OK
> JSON.stringify(obj2)
[null,null]   <-- huh?
```

But again `super-stringify` actually tells you what's going on:

```angular2html
> superStringify(obj)
[null,null]
> superStringify(obj2)
[[Empty],[Empty]]
```
