	.file	"main.c"
# GNU C17 (GCC) version 13.1.1 20230429 (x86_64-pc-linux-gnu)
#	compiled by GNU C version 13.1.1 20230429, GMP version 6.2.1, MPFR version 4.2.0, MPC version 1.3.1, isl version isl-0.26-GMP

# warning: MPFR header version 4.2.0 differs from library version 4.2.0-p7.
# GGC heuristics: --param ggc-min-expand=100 --param ggc-min-heapsize=131072
# options passed: -mtune=generic -march=x86-64 -O2
	.text
	.section	.rodata.str1.1,"aMS",@progbits,1
.LC0:
	.string	"Hello, World!"
	.section	.text.startup,"ax",@progbits
	.p2align 4
	.globl	main
	.type	main, @function
main:
.LFB11:
	.cfi_startproc
	subq	$8, %rsp	#,
	.cfi_def_cfa_offset 16
# main.c:4:   printf("Hello, World!");
	leaq	.LC0(%rip), %rdi	#, tmp83
	xorl	%eax, %eax	#
	call	printf@PLT	#
# main.c:6: }
	xorl	%eax, %eax	#
	addq	$8, %rsp	#,
	.cfi_def_cfa_offset 8
	ret	
	.cfi_endproc
.LFE11:
	.size	main, .-main
	.ident	"GCC: (GNU) 13.1.1 20230429"
	.section	.note.GNU-stack,"",@progbits
