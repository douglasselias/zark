import ffi from 'ffi-napi'
import ref from 'ref-napi'
import StructType from 'ref-struct-napi'

const myFloat = ref.types.float
const myFloatPtr = ref.refType(myFloat)

const Vector2 = StructType()
Vector2.defineProperty('x', myFloatPtr)
Vector2.defineProperty('y', myFloatPtr)
const triangle = [
  new Vector2({ x: 0, y: 0 }),
  new Vector2({ x: 100, y: 100 }),
  new Vector2({ x: 0, y: 100 }),
]
const Vector2Ptr = ref.refType(Vector2)
// const Color = StructType({
//   r: myObj,
//   g: myObj,
//   b: myObj,
//   a: myObj,
// })

const raylib = ffi.Library('libraylib', {
  'InitWindow': ['void', ['int', 'int', 'string']],
  'CloseWindow': ['void', []],
  'BeginDrawing': ['void', []],
  'EndDrawing': ['void', []],
  'ClearBackground': ['void', ['int']],
  'WindowShouldClose': ['bool', []],
  'DrawText': ['void', ['string', 'int', 'int', 'int', 'int']],
  'SetTargetFPS': ['void', ['int']],
  'SetTraceLogLevel': ['void', ['int']],
  'DrawTriangle': ['void', [Vector2Ptr, Vector2Ptr, Vector2Ptr, 'int']]
  // void DrawTriangle(Vector2 v1, Vector2 v2, Vector2 v3, Color color);                                // Draw a color-filled triangle (vertex in counter-clockwise order!)
})

const rgba = (r, g, b, a) => (r) | (g << 8) | (b << 16) | (a << 24)
const vec2 = (x, y) => (x) | (y << 8)

raylib.InitWindow(800, 450, 'Hello Raylib from Node')
raylib.SetTargetFPS(60)
raylib.SetTraceLogLevel(7)

const withDrawing = (callback) => {
  raylib.BeginDrawing()
  callback()
  raylib.EndDrawing()
}

while (!raylib.WindowShouldClose()) {
  withDrawing(() => {
    raylib.ClearBackground(rgba(255, 0, 0, 255))
    raylib.DrawText('Hello World!', 0, 0, 20, rgba(255, 255, 255, 255))
    raylib.DrawTriangle(triangle[0], triangle[1], triangle[2], rgba(255, 255, 255, 255))
  })
}

raylib.CloseWindow()