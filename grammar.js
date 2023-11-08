module.exports = grammar({
    name: 'hpi',
    extras: $ => [
        / |\n|\t|\r/,
        $.line_comment,
        $.block_comment,
    ],

    precedences: $ => [
        [
            'member',
            'call',
            'prefix',
            'infix_pow',
            'cast',
            'infix_product',
            'infix_sum',
            'infix_shift',
            'infix_relation',
            'infix_equality',
            'bitwise_and',
            'bitwise_xor',
            'bitwise_or',
            'logical_and',
            'logical_or',
            'assign',
        ],
        [
            'expr',
            'stmt',
        ],
        [
            'item',
            'stmt',
        ],
    ],

    rules: {
        program: $ =>
            choice(
                repeat($._item),
                seq(repeat($._statement), optional($._expression)),
            ),

        _item: $ =>
            prec(
                'item',
                choice(
                    $.function_definition,
                    $.import,
                    $.let_stmt,
                ),
            ),
        function_definition: $ =>
            seq(
                'funk',
                field('name', $.ident),
                '(',
                field('params', commaSep($.parameter)),
                ')',
                field('return_type', seq('ergibt', $.type)),
                field('body', $.block),
            ),
        parameter: $ =>
            seq(
                field('type', $.type),
                field('name', $.ident),
            ),
        import: $ => seq('beantrage', $.ident, 'von', $.ident, ';'),

        block: $ =>
            seq(
                '{',
                field('stmts', repeat($._statement)),
                optional(field('expr', $._expression)),
                '}',
            ),
        type: $ => choice($.ident, seq('Liste', 'von', $.type), seq('Zeiger', 'auf', $.type)),

        _statement: $ =>
            prec(
                'stmt',
                choice(
                    $.let_stmt,
                    $.return_stmt,
                    $.while_stmt,
                    $.break_stmt,
                    $.continue_stmt,
                    $.expr_stmt,
                ),
            ),
        let_stmt: $ =>
            seq(
                'setze',
                field('type', $.type),
                field('name', $.ident),
                'auf',
                field('expr', $._expression),
                ';',
            ),
        return_stmt: $ => seq('überweise', optional(field('expr', $._expression)), ';'),
        while_stmt: $ =>
            seq('solange', field('cond', $._expression), field('block', $.block), optional(';')),
        break_stmt: $ => seq('abbrechen', ';'),
        continue_stmt: $ => seq('weitermachen', ';'),
        expr_stmt: $ =>
            prec(
                'stmt',
                field(
                    'expr',
                    choice(
                        seq($._expr_without_block, ';'),
                        seq($._expr_with_block, optional(';')),
                    ),
                ),
            ),

        _expression: $ =>
            prec(
                'expr',
                choice(
                    $._expr_without_block,
                    $._expr_with_block,
                ),
            ),
        _expr_with_block: $ => choice($.block, $.if_expr),
        if_expr: $ =>
            seq(
                'falls',
                field('cond', $._expression),
                field('then_block', $.block),
                optional(
                    field(
                        'else_block',
                        seq('sonst', choice($.if_expr, $.block)),
                    ),
                ),
            ),
        _expr_without_block: $ =>
            choice(
                $.int,
                $.float,
                $.bool,
                $.char,
                $.string,
                $.ident,
                $.prefix_expr,
                $.infix_expr,
                $.list_expr,
                $.assign_expr,
                $.call_expr,
                $.index_expr,
                $.member_expr,
                $.cast_expr,
                seq('(', $._expression, ')'),
            ),
        prefix_expr: $ => prec('prefix', seq(choice('!', '-', '&', '*'), field('expr', $._expression))),
        infix_expr: $ =>
            choice(
                ...[
                    ['+', 'infix_sum'],
                    ['-', 'infix_sum'],
                    ['*', 'infix_product'],
                    [':', 'infix_product'],
                    ['%', 'infix_product'],
                    ['**', 'infix_pow', 'right'],
                    ['==', 'infix_equality'],
                    ['!=', 'infix_equality'],
                    ['<', 'infix_relation'],
                    ['>', 'infix_relation'],
                    ['<=', 'infix_relation'],
                    ['>=', 'infix_relation'],
                    ['<<', 'infix_shift'],
                    ['>>', 'infix_shift'],
                    ['|', 'bitwise_or'],
                    ['^', 'bitwise_xor'],
                    ['&', 'bitwise_and'],
                    ['&&', 'logical_and'],
                    ['||', 'logical_or'],
                ].map(([operator, precedence, associativity]) =>
                    (associativity === 'right' ? prec.right : prec.left)(
                        precedence,
                        seq(
                            field('lhs', $._expression),
                            field('op', operator),
                            field('rhs', $._expression),
                        ),
                    )
                ),
            ),
        list_expr: $ => seq('[', optional(commaSep($._expression)), ']'),
        assign_expr: $ =>
            prec.right(
                'assign',
                choice(
                    seq(
                        'ändere',
                        field('assignee', $._expression),
                        'auf',
                        field('expr', $._expression),
                    ),
                    ...[
                        '=',
                        '+=',
                        '-=',
                        '*=',
                        '/=',
                        '%=',
                        '**=',
                        '<<=',
                        '>>=',
                        '|=',
                        '&=',
                        '^=',
                    ].map(op =>
                        seq(
                            field('assignee', $._expression),
                            field('op', op),
                            field('expr', $._expression),
                        )
                    ),
                ),
            ),
        call_expr: $ =>
            prec.left(
                'call',
                seq(
                    field('func', $._expression),
                    '(',
                    field('args', commaSep($._expression)),
                    ')',
                ),
            ),
        index_expr: $ =>
            prec.left(
                'call',
                seq(
                    field('list', $._expression),
                    '[',
                    field('index', $._expression),
                    ']',
                ),
            ),
        member_expr: $ =>
            prec.right(
                'member',
                seq(
                    field('parent', $._expression),
                    '.',
                    field('member', $.ident),
                ),
            ),
        cast_expr: $ => prec('cast', seq($._expression, 'als', $.type)),

        ident: $ => /[a-zA-Zäöüß_][a-zA-Zäöüß_0-9]*/,
        int: $ => /[0-9][0-9_]*|0x[0-9A-Fa-f][0-9A-Fa-f_]*/,
        float: $ => /[0-9][0-9_]*(,[0-9][0-9_]*|F)/,
        char: $ =>
            token(seq(
                "'",
                optional(choice(
                    seq(
                        '\\',
                        choice(
                            /[\\bnrt']/,
                            /x[0-9a-fA-F]{2}/,
                        ),
                    ),
                    /[^\\']/,
                )),
                "'",
            )),
        string: $ =>
            token(seq(
                '"',
                repeat(choice(
                    seq(
                        '\\',
                        choice(
                            /[\\bnrt"]/,
                            /x[0-9a-fA-F]{2}/,
                        ),
                    ),
                    /[^\\"]/,
                )),
                '"',
            )),
        bool: $ => choice('ja', 'nein'),

        line_comment: $ => /\/\/.*/,
        block_comment: $ =>
            token(seq(
                '/*',
                /[^*]*\*+([^/*][^*]*\*+)*/,
                '/',
            )),
    },
})

function commaSep(rule) {
    return optional(seq(rule, repeat(seq('/', rule)), optional('/')))
}
