Sudoku!
=======

A CSS3-animated sudoku app

### Structure
This app uses Gulp, Browserify, Less, and Jade. I use autoprefixer for cross-browser support and Browserify and npm to load libraries and modules.

I store the board state in three arrays, one for the rows, columns, and regions of the board in the boardCache. This makes it easy to check whether or not there already exists a number in a given row/column/region.

Markup and styling is very minimal, but there is heavy use of CSS3 animations. I use the excellent (and fast) Velocity.js library for controlling the animations. It's a great substitute for $ngAnimate and is quite flexible.

### Trade-offs
#### Puzzle Generation
I initially generated puzzles using the root sudoku solution, applying transformations to the puzzle to randomize it, and then randomly removing entries. However, this can lead to puzzles with more than one solution. One can use a backtracking sudoku solving algorithm to ensure solutions are unique, but I decided to take a shortcut.

Instead, I use sudoku transformations to generate new puzzles from a seed puzzle. It's much simpler than implementing a solver and it's hard to tell because I permute everything possible without destroying the puzzle's validitiy. I use lots of lodash functional programming here.

#### Board State
It would have been much more efficient to store board state as dictionaries with keys 1-9, but I really wanted to animate the existing entry when the user inputs a duplicate in a given row, column, or region. This requires knowing the index of that entry, so I use plain, unsorted arrays to make it easy to find.

### Limitations

- No frameworks like Angular allowed.
- Libraries are okay.
