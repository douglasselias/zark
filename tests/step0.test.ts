import { describe, expect, it, test } from '@jest/globals'

import { spawn, spawnSync, exec } from 'child_process'

// describe('Step 0 - repl', () => {
//   const child = spawn('npm', ['start'], { shell: true })

//   it('Testing basic string', () => {
//     return new Promise((resolve) => {
//       child.stdout.on('data', (data) => {
//         console.log(`OUTDATA: ${data}`)

//         if (!data.includes('user>')) {
//           expect(data.toString()).toBe('hello zark!')
//           resolve(true)
//         }
//       })

//       child.stdin.write('hello zark!\n')
//       child.stdin.end()
//     })
//   })
// })

test('myProgram returns expected output with input "hello zark!"', (done) => {
  // Spawn the child process
  const childProcess = spawn('npm', ['start']);

  // Set up event handlers for stdout and stderr
  let stdoutData = '';
  childProcess.stdout.on('data', (data) => {
    stdoutData += data.toString();
  });

  let stderrData = '';
  childProcess.stderr.on('data', (data) => {
    stderrData += data.toString();
  });

  // Send the input to stdin
  childProcess.stdin.write('hello zark!\n');
  childProcess.stdin.end();

  // Event handler for process exit
  childProcess.on('close', (code) => {
    expect(code).toBe(0); // Verify that the program exited successfully
    expect(stderrData).toBe(''); // Verify that there is no error output

    // Verify the expected output
    const expectedOutput = 'hello zark!\n';
    expect(stdoutData).toBe(expectedOutput);

    done(); // Signal that the test is complete
  });
});
