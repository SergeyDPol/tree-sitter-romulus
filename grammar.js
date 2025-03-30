/**
 * @file A simple language for integer computations with Latin-inspired syntax
 * @author Sergey Polukhin <sergeydpol@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "romulus",

  /*conflicts: $ => [
    [$.function_call],
  ],*/

  rules: {
    source_file: $ => repeat($._statement),

    identifier: $ => /[a-z]+/,
    //Number is decomposed into several types to prevent empty string matches. 
    //An identical effect can be acheived by concatenating the regulare expressions for each type with a |. 
    //The current representation was chosen for better readability.
    _number_thousands: $ => /M{1,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})/,
    _number_hundreds: $ => /(CM|CD|D?C{1,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})/,
    _number_tens: $ => /(XC|XL|L?X{1,3})(IX|IV|V?I{0,3})/,
    _number_ones: $ => /IX|IV|V?I{1,3}|N/,
    number: $ => choice($._number_thousands, $._number_hundreds, $._number_tens, $._number_ones),

    addition:       $ => prec.left(3, seq($._simple_expression, "+", $._simple_expression)),
    subtraction:    $ => prec.left(3, seq($._simple_expression, "-", $._simple_expression)),
    multiplication: $ => prec.left(4, seq($._simple_expression, "*", $._simple_expression)),
    division:       $ => prec.left(4, seq($._simple_expression, "/", $._simple_expression)),
    modulo:         $ => prec.left(4, seq($._simple_expression, "%", $._simple_expression)),
    _arithmetic_expression: $ => choice(
      $.multiplication,
      $.division,
      $.modulo,
      $.addition,
      $.subtraction
    ),

    branching: $ => seq(
      "Sinon", 
      field("condition", $._simple_expression),
      field("false_branch", $._simple_expression),
      field("true_branch", $._simple_expression)
    ),

    function_definition: $ => seq(
      "Munus",
      field("name", $.identifier),
      repeat1($.identifier),
      "=",
      field("body", $._expression)
    ),

    function_call: $ => prec.left(seq(
      field("function", $.identifier),
      repeat1($._parenthesized_expression)
    )),

    variable_definition: $ => seq(
      "As",
      field("variable", $.identifier),
      "=",
      field("value", choice($._expression, "Anagnosti",))
    ),

    assignment_statement: $ => seq(
      field("left", $.identifier),
      "=",
      field("right", choice($._expression, "Anagnosti"))
    ),

    print_statement: $ => seq(
      "Grafo",
      field("value", $._expression)
    ),

    _parenthesized_expression: $ => seq("(", $._expression, ")"),
    _simple_expression: $ => choice(
      $._parenthesized_expression,
      $._arithmetic_expression,
      $.branching,
      $.number,
      $.identifier
    ),
    _expression: $ => choice(
      $._simple_expression,
      $.function_call
    ),

    _statement: $ => choice(
      $.print_statement,
      $.assignment_statement,
      $.variable_definition,
      $.function_definition
    )
  }
});
