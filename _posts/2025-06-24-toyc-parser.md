---
layout: post
title: "ToyC Parser"
date: 2025-06-24
description: "A minimal compiler written in Python generating LLVM IR"
categories: [compilers, programming-languages]
tags: [compilers, programming-languages]
---

# Introduction

In the [last post](% post_url 2025-06-04-toyc-scanner %), we implemented a scanner for the ToyC programming language. We broke our source down into a stream of tokens. While tokens help us better understand what we're looking at, we still don't know how those pieces fit together. 

That's where the parser comes in.

In this post, we'll take that token stream and parse it into an abstract syntax tree (AST). We will also cover how to gracefully handle errors mid-parse, avoiding cascades of confusing errors. 

# The AST

An abstract syntax tree is a tree representation of the syntactic structure of source code. For ToyC the AST is the bridge between parsing and codegen.

For our ToyC AST the goal was to keep it simple while ensuring it maps well onto LLVM IR, which we will lower our AST to during codegen. In ToyC all AST nodes use `@dataclass(slots=True, frozen=True)`. This makes them immutable and memory-efficient. They cannot be modified after creation or extended with new fields, which helps keep codegen predictable and bug-free. Below is our base `AstNode` class. It extends `ABC` or [abstract base class](https://docs.python.org/3/library/abc.html).

``` python
from dataclasses import dataclass
from abc import ABC

@dataclass(slots=True, frozen=True)
class AstNode(ABC):
    line: int

```

We also define the `Stmt` and `Expr` classes. 

A **statement** is something executed for its effect, not its result — for example, a variable declaration, an `if` statement, or a `goto`.  
An **expression**, on the other hand, is something that *produces a value*, such as a binary operation or a literal.

Some constructs, like assignment (`x = b + a;`), are **both**. In this case, `x` is mutated (a side effect), but the assignment itself also evaluates to a value — the new value of `x`. ToyC models this by letting `Assign` inherit from both `Stmt` and `Expr`.

This distinction lets us reflect C-like semantics cleanly while still targeting LLVM IR, which also treats most operations as value-producing.

If you'd like to see the full list of node types, you can browse [the ToyC AST definition](https://github.com/eckertliam/toyc/blob/main/toyc/toycast.py) before diving into the parser.

