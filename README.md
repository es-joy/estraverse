### Estraverse [![Build Status](https://secure.travis-ci.org/es-joy/estraverse.svg)](http://travis-ci.org/es-joy/estraverse)

`@es-joy/estraverse` ([estraverse](http://github.com/es-joy/estraverse)) is
a fork of [estraverse](https://github.com/estools/estraverse).

[ECMAScript](http://www.ecma-international.org/publications/standards/Ecma-262.htm)
traversal functions from [esmangle project](http://github.com/estools/esmangle).

### Documentation

You can find usage docs at [wiki page](https://github.com/es-joy/estraverse/wiki/Usage).

### Example Usage

The following code will output all variables declared at the root of a file.

```js
estraverse.traverse(ast, {
    enter (node, parent) {
        if (node.type == 'FunctionExpression' || node.type == 'FunctionDeclaration')
            return estraverse.VisitorOption.Skip;
    },
    leave (node, parent) {
        if (node.type == 'VariableDeclarator')
          console.log(node.id.name);
    }
});
```

We can use `this.skip`, `this.remove` and `this.break` functions instead of using Skip, Remove and Break.

```js
estraverse.traverse(ast, {
    enter (node) {
        this.break();
    }
});
```

And estraverse provides `estraverse.replace` function. When returning node from `enter`/`leave`, current node is replaced with it.

```js
const result = estraverse.replace(tree, {
    enter (node) {
        // Replace it with replaced.
        if (node.type === 'Literal')
            return replaced;
    }
});
```

By passing `visitor.keys` mapping, we can extend estraverse traversing functionality.

```js
// This tree contains a user-defined `TestExpression` node.
const tree = {
    type: 'TestExpression',

    // This 'argument' is the property containing the other **node**.
    argument: {
        type: 'Literal',
        value: 20
    },

    // This 'extended' is the property not containing the other **node**.
    extended: true
};
estraverse.traverse(tree, {
    enter (node) { },

    // Extending the existing traversing rules.
    keys: {
        // TargetNodeName: [ 'keys', 'containing', 'the', 'other', '**node**' ]
        TestExpression: ['argument']
    }
});
```

By passing `visitor.fallback` option, we can control the behavior when encountering unknown nodes.

```js
// This tree contains a user-defined `TestExpression` node.
const tree = {
    type: 'TestExpression',

    // This 'argument' is the property containing the other **node**.
    argument: {
        type: 'Literal',
        value: 20
    },

    // This 'extended' is the property not containing the other **node**.
    extended: true
};
estraverse.traverse(tree, {
    enter (node) { },

    // Iterating the child **nodes** of unknown nodes.
    fallback: 'iteration'
});
```

When `visitor.fallback` is a function, we can determine which keys to visit on each node.

```js
// This tree contains a user-defined `TestExpression` node.
const tree = {
    type: 'TestExpression',

    // This 'argument' is the property containing the other **node**.
    argument: {
        type: 'Literal',
        value: 20
    },

    // This 'extended' is the property not containing the other **node**.
    extended: true
};
estraverse.traverse(tree, {
    enter (node) { },

    // Skip the `argument` property of each node
    fallback(node) {
        return Object.keys(node).filter((key) => {
            return key !== 'argument';
        });
    }
});
```

### License

Copyright (C) 2012-2016 [Yusuke Suzuki](http://github.com/Constellation)
 (twitter: [@Constellation](http://twitter.com/Constellation)) and other contributors.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright
    notice, this list of conditions and the following disclaimer.

  * Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
