#include <stdio.h>
#include <stdlib.h>

#include <editline/readline.h>
#include <histedit.h>

int main(int argc, char** argv) {
  puts("Zark Version 0.0.0");
  puts("Press Ctrl+c to Exit or type (exit)\n");

  while (1) {
    char* input = readline("zark > ");
    add_history(input);
    printf("Eval: %s\n", input);
    free(input);
  }

  return 0;
}