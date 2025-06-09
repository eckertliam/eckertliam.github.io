---
layout: post
title: "ToyC Scanner"
date: 2025-06-04
description: "A minimal compiler written in Python generating LLVM IR"
categories: [compilers, programming-languages]
tags: [compilers, programming-languages]
---

# Introduction

ToyC is a minimal C-like language designed to show how source code becomes an executable program. In this post, you will learn how to scan source into tokens. Before a compiler can reason about programs, it has to stop tripping over whitespace and comments. Scanning is the industrial vacuum that clears the floor.

Follow up posts will tackle parsing and IR. If you are interested in the code, you can find it [here](https://github.com/eckertliam/toyc).

# Syntax of ToyC

The syntax of ToyC is a fusion between TypeScript, C, and Rust. It is designed to feel familiar and also be easy to parse. 

``` c

fn main(): i32 {
    let x: i32 = 1;
    let y: i32 = 2;
    return x + y;
}

```

We will only support basic types such as integers (`i32`, `i64`), floats (`f32`, `f64`), booleans (`bool`), and `void`. This allows us to cheat a bit and represent types as strings internally.

# Scanning

The first step in most compilers is to convert the source code into a stream of tokens. This is typically called scanning or lexing. Scanning breaks the source code down into meaningful units (tokens) and discards the rest, making the next step easier. 

Our tokens are defined in `toyc/tokens.py`. It's a simple enum class defining types of tokens, called `TokenKind`. Then the dataclass `Token` is used to represent a token, this contains the `kind`, `lexeme` (the actual text of the token), and `line`.

For ToyC, I have implemented a simple table-dispatch-based greedy scanner. The `Scanner` class can be found in `toyc/scanner.py`. The basic fields are:

``` python

class Scanner:
    def __init__(self, source: str) -> None:
        """Initialize scanner state for the provided source string."""
        self.source = source
        self.line = 1
        self.start = 0
        self.current = 0

        # dispatch table for single-char tokens
        self.single_char_tokens: Dict[str, TokenKind] = {
            "(": TokenKind.LPAREN,
            ")": TokenKind.RPAREN,
            "{": TokenKind.LBRACE,
            "}": TokenKind.RBRACE,
            ";": TokenKind.SEMICOLON,
            ":": TokenKind.COLON,
            "+": TokenKind.PLUS,
            "-": TokenKind.MINUS,
            "*": TokenKind.STAR,
            "/": TokenKind.SLASH,
            "%": TokenKind.MOD,
            ",": TokenKind.COMMA,
        }

        # table for branching tokens key -> (match, then, else)
        self.branch_tokens: Dict[str, Tuple[str, TokenKind, TokenKind]] = {
            "=": ("=", TokenKind.EQEQ, TokenKind.EQ),
            "!": ("=", TokenKind.BANGEQ, TokenKind.BANG),
            "<": ("=", TokenKind.LTEQ, TokenKind.LT),
            ">": ("=", TokenKind.GTEQ, TokenKind.GT),
        }

        # funky two-char tokens with no single-char fallback
        self.two_char_tokens: Dict[str, Tuple[str, TokenKind]] = {
            "&": ("&", TokenKind.AMPAMP),
            "|": ("|", TokenKind.PIPEPIPE),
        }

        self.keywords: Dict[str, TokenKind] = {
            "if": TokenKind.IF,
            "else": TokenKind.ELSE,
            "goto": TokenKind.GOTO,
            "label": TokenKind.LABEL,
            "return": TokenKind.RETURN,
            "let": TokenKind.LET,
            "const": TokenKind.CONST,
            "fn": TokenKind.FN,
            "true": TokenKind.TRUE,
            "false": TokenKind.FALSE,
        }

```


The scanner relies on three tiny lookup tables:

* **single_char_tokens** — one‑to‑one mappings such as `(` → `LPAREN`.
* **branch_tokens** — tokens that may lengthen if a look‑ahead matches (`=` → `==` vs `=`).
* **two_char_tokens** — pairs that **must** come together (`&&`, `||`); otherwise we flag an error.

Before we meet `scan_token()`, the work‑horse, let's look at two helpers.

Sometimes the scanner wants to sneak a peek without stepping. That's `peek`:

``` python

def peek(self) -> str:
    if self.is_at_end():
        return "\0"
    return self.source[self.current]

```

`peek` looks ahead and returns the next char without advancing further. If we are at the end of source it returns `\0` to let us know we're done.

When the scanner does need to step over the current char that's what `advance` is for. It moves the current pointer forward, and returns the char it just advanced over. If the char was a newline it also increments the line to reflect our location in the source.

``` python

def advance(self) -> str:
    char = self.source[self.current]
    self.current += 1
    if char == "\n":
        self.line += 1
    return char

```


### scan_token at a glance

`scan_token()` proceeds like so:

1. **Skip trivia** — whitespace and comments.
2. **Mark** `start` and grab the next character with `advance()`.
3. **Dispatch**:
   - **Single‑char**: emit the mapped token.
   - **Branching**: peek for the expected second char; if present, emit the two‑char variant, otherwise the single‑char fallback.
   - **Mandatory pair**: require that second char or emit an error token.
   - **Digit**: consume a number literal.
   - **Letter / `_`**: consume an identifier or keyword.
   - **Everything else**: emit an error token.

That’s the whole scanner. The table‑driven style keeps the logic flat and readable. No mile‑long `if‑elif` ladder needed.

``` python

def scan_token(self) -> Token:
    """Scan and return the next `Token` from the source."""
    self.skip_whitespace()
    self.start = self.current
    c = self.advance()

    # check if c is a single-char token
    if c in self.single_char_tokens:
        # just return the kind with make token
        return self.make_token(self.single_char_tokens[c])

    # check if c is a branching token
    if c in self.branch_tokens:
        # unpack the match_char, then, else
        match_char, then_kind, else_kind = self.branch_tokens[c]
        # check if the next character matches the match_char
        if self.peek() == match_char:
            # if so skip over it and return the then kind
            self.advance()
            return self.make_token(then_kind)
        else:
            return self.make_token(else_kind)

    # check if c is a two-char token
    if c in self.two_char_tokens:
        # check if the next character is what we expect
        expected, kind = self.two_char_tokens[c]
        if self.peek() == expected:
            self.advance()
            return self.make_token(kind)
        else:
            return self.error_token(f"Expected {expected} after {c}")

    # check if c is a number
    if c.isdigit():
        return self.number()

    # check if c is a letter
    if c.isalpha() or c == "_":
        return self.identifier()

    # its an error
    return self.error_token(f"Unexpected character: {c}")
```


Notice how the lookup tables keep the function tight; without them you'd be staring at a wall of nested conditionals.

You might have noticed a few helper functions. `make_token` takes a token kind and returns a token with a lexeme that is just `source[start:current]` and the current line.

The `identifier` helper consumes chars while they are alphanumeric or underscores. It then checks if the identifier is a keyword. It returns a token with the kind of keyword or just ident kind. 

The `number` helper consumes digits, checks for a `.` and then keeps consuming digits. This does not handle exponents or anything complex but can be modified to easily handle more complex number types.

I have also implemented `__iter__` for the `Scanner` class. This just ends up being syntactic sugar for parsing, but it is nice to have.

``` python

def __iter__(self) -> Iterator[Token]:
    """Iterate lazily over tokens end-of-file."""
    while not self.is_at_end():
        yield self.scan_token()
    yield Token(TokenKind.EOF, "", self.line)

```

At this point if we entered `let a: i32 = 10;` we would get the following output:

```
Token(kind=LET, lexeme=let, line=1)
Token(kind=IDENT, lexeme=a, line=1)
Token(kind=COLON, lexeme=:, line=1)
Token(kind=IDENT, lexeme=i32, line=1)
Token(kind=EQ, lexeme==, line=1)
Token(kind=NUMBER, lexeme=10, line=1)
Token(kind=SEMICOLON, lexeme=;, line=1)
Token(kind=EOF, lexeme=, line=1)
```

With a tidy token list in-hand, we're ready to start thinking in trees, but that is a story for the next post.