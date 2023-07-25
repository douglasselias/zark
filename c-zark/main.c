#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include <editline/readline.h>
#include <histedit.h>

int main(int argc, char** argv) {
  puts("Zark Version 0.0.0");
  puts("Press Ctrl+c to exit or type exit\n");

  int shouldLoop = 1;
  while (shouldLoop) {
    char* input = readline("zark > ");
    add_history(input);
    printf("Eval: %s\n", input);
    if(strcmp(input, "exit") == 0)
      shouldLoop = 0;
    free(input);
  }

  return 0;
}