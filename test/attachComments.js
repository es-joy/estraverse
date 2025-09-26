// Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in the
//     documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
// DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
// THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

import * as esprima from 'esprima';
import { attachComments } from '../src/estraverse.js';

describe('`attachComments` API', function() {
    it('throws on missing range info', function() {
        const tree = {
            type: 'ObjectExpression',
            properties: [{
                type: 'Property',
                key: {
                    type: 'Identifier',
                    name: 'a'
                },
                value: {
                    type: 'Identifier',
                    name: 'a'
                }
            }]
        };

        expect(() => {
            attachComments(tree, [], []);
        }).to.throw('attachComments needs range information');
    });

    it('adds `leadingComments` with empty tokens array', function() {
        const options = {
            comment: true,
            range: true,
            loc: false,
            tokens: false,
            raw: false
        };

        let tree = esprima.parse(`
/**
 * @param {string} b
 */
function a (b) {}
`, options);
        tree = attachComments(tree, tree.comments, []);

        expect(tree).to.deep.equal({
            body: [
                {
                    async: false,
                    body: {
                        body: [],
                        range: [
                            45,
                            47
                        ],
                        type: 'BlockStatement'
                    },
                    expression: false,
                    generator: false,
                    id: {
                        name: 'a',
                        range: [
                            39,
                            40
                        ],
                        type: 'Identifier'
                    },
                    params: [
                        {
                            name: 'b',
                            range: [
                                42,
                                43
                            ],
                            type: 'Identifier'
                        },
                    ],
                    range: [
                        30,
                        47
                    ],
                    type: 'FunctionDeclaration'
                }
            ],
            comments: [
                {
                    range: [
                        1,
                        29
                    ],
                    type: 'Block',
                    value: '*\n * @param {string} b\n '
                }
            ],
            leadingComments: [
                {
                    extendedRange: [
                        0,
                        30
                    ],
                    range: {
                        0: 1,
                        1: 29
                    },
                    type: 'Block',
                    value: '*\n * @param {string} b\n '
                }
            ],
            range: [
                30,
                47
            ],
            sourceType: 'script',
            type: 'Program'
        });
    });

    it('attaches `leadingComments` with tokens array', function() {
        const options = {
            comment: true,
            range: true,
            loc: false,
            tokens: true,
            raw: false
        };

        let tree = esprima.parse(`
/**
 * @param {string} b
 */
function a (b) {}
`, options);
        tree = attachComments(tree, tree.comments, tree.tokens);

        expect(tree).to.deep.equal({
            body: [
                {
                    async: false,
                    body: {
                        body: [],
                        range: [
                            45,
                            47
                        ],
                        type: 'BlockStatement'
                    },
                    expression: false,
                    generator: false,
                    id: {
                        name: 'a',
                        range: [
                            39,
                            40
                        ],
                        type: 'Identifier'
                    },
                    params: [
                        {
                            name: 'b',
                            range: [
                                42,
                                43
                            ],
                            type: 'Identifier'
                        }
                    ],
                    range: [
                        30,
                        47
                    ],
                    type: 'FunctionDeclaration'
                }
            ],
            comments: [
                {
                    range: [
                        1,
                        29
                    ],
                    type: 'Block',
                    value: '*\n * @param {string} b\n '
                }
            ],
            leadingComments: [
                {
                    extendedRange: [
                        1,
                        30
                    ],
                    range: {
                        0: 1,
                        1: 29
                    },
                    type: 'Block',
                    value: '*\n * @param {string} b\n '
                }
            ],
            range: [
                30,
                47
            ],
            sourceType: 'script',
            tokens: [
                {
                    range: [
                        30,
                        38
                    ],
                    type: 'Keyword',
                    value: 'function'
                },
                {
                    range: [
                        39,
                        40
                    ],
                    type: 'Identifier',
                    value: 'a'
                },
                {
                    range: [
                        41,
                        42
                    ],
                    type: 'Punctuator',
                    value: '('
                },
                {
                    range: [
                        42,
                        43
                    ],
                    type: 'Identifier',
                    value: 'b'
                },
                {
                    range: [
                        43,
                        44
                    ],
                    type: 'Punctuator',
                    value: ')'
                },
                {
                    range: [
                        45,
                        46
                    ],
                    type: 'Punctuator',
                    value: '{'
                },
                {
                    range: [
                        46,
                        47
                    ],
                    type: 'Punctuator',
                    value: '}'
                }
            ],
            type: 'Program'
        });
    });

    it('attaches `trailingComments` with tokens array and comment range greater than existing token', function() {
        const options = {
            comment: true,
            range: true,
            loc: false,
            tokens: true,
            raw: false
        };

        let tree = esprima.parse(`
/**
 * @param {string} b
 */
function a (b) {}
`, options);
        tree = attachComments(tree, [
            {
                type: 'Line', value: ' Single comment', range: [100, 117]
            }
        ], tree.tokens);

        expect(tree).to.deep.equal({
            body: [
                {
                    async: false,
                    body: {
                        body: [],
                        range: [
                            45,
                            47
                        ],
                        trailingComments: [
                            {
                                extendedRange: [
                                    47,
                                    117
                                ],
                                range: {
                                    0: 100,
                                    1: 117
                                },
                                type: 'Line',
                                value: ' Single comment'
                            }
                        ],
                        type: 'BlockStatement'
                    },
                    expression: false,
                    generator: false,
                    id: {
                        name: 'a',
                        range: [
                            39,
                            40
                        ],
                        type: 'Identifier'
                    },
                    params: [
                        {
                            name: 'b',
                            range: [
                                42,
                                43
                            ],
                            type: 'Identifier'
                        }
                    ],
                    range: [
                        30,
                        47
                    ],
                    type: 'FunctionDeclaration'
                }
            ],
            comments: [
                {
                    range: [
                        1,
                        29
                    ],
                    type: 'Block',
                    value: '*\n * @param {string} b\n '
                }
            ],
            range: [
                30,
                47
            ],
            sourceType: 'script',
            tokens: [
                {
                    range: [
                        30,
                        38
                    ],
                    type: 'Keyword',
                    value: 'function'
                },
                {
                    range: [
                        39,
                        40
                    ],
                    type: 'Identifier',
                    value: 'a'
                },
                {
                    range: [
                        41,
                        42
                    ],
                    type: 'Punctuator',
                    value: '('
                },
                {
                    range: [
                        42,
                        43
                    ],
                    type: 'Identifier',
                    value: 'b'
                },
                {
                    range: [
                        43,
                        44
                    ],
                    type: 'Punctuator',
                    value: ')'
                },
                {
                    range: [
                        45,
                        46
                    ],
                    type: 'Punctuator',
                    value: '{'
                },
                {
                    range: [
                        46,
                        47
                    ],
                    type: 'Punctuator',
                    value: '}'
                }
            ],
            type: 'Program'
        });
    });

    it('attaches `trailingComments` with tokens array and comment range less than existing token', function() {
        const options = {
            comment: true,
            range: true,
            loc: false,
            tokens: true,
            raw: false
        };

        let tree = esprima.parse(`
/**
 * @param {string} b
 */
function a (b) {}
`, options);
        tree = attachComments(tree, [
            {
                type: 'Line', value: ' Single comment', range: [100, 17]
            }
        ], tree.tokens);

        expect(tree).to.deep.equal({
            body: [
                {
                    async: false,
                    body: {
                        body: [],
                        range: [
                            45,
                            47
                        ],
                        trailingComments: [
                            {
                                extendedRange: [
                                    47,
                                    17
                                ],
                                range: {
                                    0: 100,
                                    1: 17
                                },
                                type: 'Line',
                                value: ' Single comment'
                            }
                        ],
                        type: 'BlockStatement'
                    },
                    expression: false,
                    generator: false,
                    id: {
                        name: 'a',
                        range: [
                            39,
                            40
                        ],
                        type: 'Identifier'
                    },
                    params: [
                        {
                            name: 'b',
                            range: [
                                42,
                                43
                            ],
                            type: 'Identifier'
                        }
                    ],
                    range: [
                        30,
                        47
                    ],
                    type: 'FunctionDeclaration'
                }
            ],
            comments: [
                {
                    range: [
                        1,
                        29
                    ],
                    type: 'Block',
                    value: '*\n * @param {string} b\n '
                }
            ],
            range: [
                30,
                47
            ],
            sourceType: 'script',
            tokens: [
                {
                    range: [
                        30,
                        38
                    ],
                    type: 'Keyword',
                    value: 'function'
                },
                {
                    range: [
                        39,
                        40
                    ],
                    type: 'Identifier',
                    value: 'a'
                },
                {
                    range: [
                        41,
                        42
                    ],
                    type: 'Punctuator',
                    value: '('
                },
                {
                    range: [
                        42,
                        43
                    ],
                    type: 'Identifier',
                    value: 'b'
                },
                {
                    range: [
                        43,
                        44
                    ],
                    type: 'Punctuator',
                    value: ')'
                },
                {
                    range: [
                        45,
                        46
                    ],
                    type: 'Punctuator',
                    value: '{'
                },
                {
                    range: [
                        46,
                        47
                    ],
                    type: 'Punctuator',
                    value: '}'
                }
            ],
            type: 'Program'
        });
    });
});
