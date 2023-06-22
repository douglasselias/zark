const empty = " "
const number = ["1", "9"]
const letter = ["a", "z"]
// const atom_part = empty | letter atom_part | number atom_part
const atomic_symbol = letter atom_part

s_expression = atomic_symbol \
               / "(" s_expression "."s_expression ")" \
               / list 
list = "(" s_expression < s_expression > ")"