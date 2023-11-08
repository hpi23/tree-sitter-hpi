; General Identifiers
(ident) @variable
(type [(ident) "Liste" "Zeiger"] @type.builtin)

; Function definitions
(function_definition
  name: (ident) @function)
(parameter
  name: (ident) @parameter)

; Function calls
(call_expr
  func: (ident) @function.call)
(call_expr
  func: (member_expr member: (ident) @method.call))
(call_expr
  func: (ident) @function.builtin
  (#any-of? @function.builtin "drucke"))

; Literals
[
  (line_comment)
  (block_comment)
] @comment

(bool) @boolean
(int) @number
(float) @float
(char) @character
(string) @string

; Keywords
[
  "setze"
  "ändere"
  "auf"
  "von"
  "beantrage"
] @keyword

"funk" @keyword.function
"überweise" @keyword.return
"als" @keyword.operator

[
  "falls"
  "sonst"
] @conditional

[
  "abbrechen"
  "weitermachen"
  "solange"
] @repeat

; Operators & Punctuation
[
  "!"
  "!="
  "%"
  "%="
  "&"
  "&&"
  "&="
  "*"
  "*="
  "+"
  "+="
  "-"
  "-="
  ":"
  "/="
  "<"
  "<<"
  "<<="
  "<="
  "="
  "=="
  ">"
  ">="
  ">>"
  ">>="
  "^"
  "^="
  "|"
  "|="
  "||"
] @operator

["(" ")" "[" "]" "{" "}"]  @punctuation.bracket

["/" "." ":" ";"] @punctuation.delimiter
