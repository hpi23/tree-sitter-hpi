# tree-sitter-hpi

[tree-sitter](https://github.com/tree-sitter/tree-sitter)

## Usage in Neovim

### Parser Installation

The [nvim-treesitter plugin](https://github.com/nvim-treesitter/nvim-treesitter)
does not include this parser. To use it you must instead manually add it to your
tree-sitter config and then install it with `:TSInstall hpi` or by adding it to
your `ensure_installed` list:

```lua
require('nvim-treesitter.parsers').get_parser_configs().hpi = {
    install_info = {
        url = 'https://github.com/hpi23/tree-sitter-hpi.git',
        files = { 'src/parser.c' },
        branch = 'main',
    },
}
```

### File type detection

You will likely also have to add the `hpi` file type:

```lua
vim.filetype.add { extension = { hpi = 'hpi' } }
```

### Highlighting and Indentation

If you want to use this parser for highlighting and indentation, you will also
have to add this repository as a plugin, for example for packer.nvim add this:

```lua
use { 'hpi23/tree-sitter-hpi' }
```
# tree-sitter-hpi
