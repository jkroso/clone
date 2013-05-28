
# clone

  Supported types:

+ date
+ regexp
+ array
+ arguments
+ object
+ element
+ string
+ number
+ boolean

## Example

```js
var obj = clone({
  a: 'b',
  c: [
    new Date(),
    'tobi',
    'jane'
  ]
})
```

## API

### clone(obj)

  Clones `obj` recursively and returns it.

## License

MIT
