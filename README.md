# waterline-params

`waterline-params` is designed to give you rails-like parameter helpers to secure your models.

Based on [mongoose-params](http://www.github.com/bradynpoulsen/mongoose-params) by Bradyn Poulsen.

## Installation

```
$ npm install --save waterline-params
```

## Synopsis

```js
var Waterline = require('waterline');

var User = Waterline.Collection.extend({
  attributes: {
    name: {
      type: 'string'
    },
    email: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true
    }
  }
});

require('waterline-params')(User, {
  permitted: 'name email'
});
```

## Methods

### #only(params)

Return only `params` properties for the document

```js
console.log(bob.only('name', 'email')); // {name: 'Bob', email: 'bob@example.com'}
```

### #except(params)

Return all properties except `params` for the document

```js
console.log(bob.except('password')); // {name: 'Bob', email: 'bob@example.com'}
```

### #assign(data, [override])

Filter and apply changes to the document

```js
bob.assign({
  name: 'Bob Perry',
  password: 'new password'
});
console.log(bob); // {name: 'Bob Perry', email: 'bob@example.com', password: 'still the old password'}
```

### #merge(data, [override])

Same as `#assign` but returns a copy of the document that the changes were made to

### #safeUpdate(data, [override], [done])

Update the document using only [permitted](#permitted-stringarraystring) properties. Use `override` to set properties not in [permitted](#permitted-stringarraystring).

```js
bob.safeUpdate({
  email: 'bob@newEmail.com',
  password: 'new password'
},function(err, updatedBob){
  console.log(updatedBob); // {name: 'Bob', email: 'bob@newEmail.com', password: 'still the old password'}
});
```

## Static Methods

### #only(object, [callback], [thisArg])

See [Lodash: \_.pick](https://lodash.com/docs#pick).

### #except(object, [callback], [thisArg])

See [Lodash: \_.omit](https://lodash.com/docs#omit).

### #safeCreate(data, [override], [done])

Create document(s) using only [permitted](#permitted-stringarraystring) properties. Use `override` to set properties not in [permitted](#permitted-stringarraystring).

```js
user.safeCreate({
  name: 'Bob',
  email: 'bob@example.com',
  password: 'this password'
}, function(err, bob){
  console.log(err); // Error: `password` cannot be blank
});

// versus

user.safeCreate({
  name: 'Bob',
  email: 'bob@example.com'
}, {
  password: 'this password'
}, function(err, bob){
  console.log(bob); // {name: 'Bob', email: 'bob@example.com', password: 'this password'}
});
```

## Configuration

### permitted: {String|Array&lt;String&gt;}

`String` or `Array<String>` that contains the permitted parameters

These both give the same result:

```js
var params = require('waterline-params');

params(Thing, {
  permitted: 'title description details'
});

params(Thing, {
  permitted: ['title', 'description', 'details']
});
```

## License

The MIT License (MIT)

Copyright (c) 2015 Bradyn Poulsen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
