
main64:     formato de ficheiro elf64-x86-64


Desmontagem da secção .text:

0000000000401000 <_start>:
  401000:	b8 04 00 00 00       	mov    $0x4,%eax
  401005:	bb 01 00 00 00       	mov    $0x1,%ebx
  40100a:	b9 00 20 40 00       	mov    $0x402000,%ecx
  40100f:	ba 0d 00 00 00       	mov    $0xd,%edx
  401014:	cd 80                	int    $0x80
  401016:	b8 01 00 00 00       	mov    $0x1,%eax
  40101b:	31 db                	xor    %ebx,%ebx
  40101d:	cd 80                	int    $0x80
