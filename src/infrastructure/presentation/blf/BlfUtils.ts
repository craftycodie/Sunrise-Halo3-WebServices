export function toBytesUint32(num, littleEndian = false) {
  const arr = new ArrayBuffer(4); // an Int32 takes 4 bytes
  const view = new DataView(arr);
  view.setUint32(0, num, littleEndian); // byteOffset = 0; litteEndian = false
  return Buffer.from(arr);
}

export function toBytesInt32(num, littleEndian = false) {
  const arr = new ArrayBuffer(4); // an Int32 takes 4 bytes
  const view = new DataView(arr);
  view.setInt32(0, num, littleEndian); // byteOffset = 0; litteEndian = false
  return Buffer.from(arr);
}

export function toBytesFloat32(num, littleEndian = false) {
  const arr = new ArrayBuffer(4); // an Int32 takes 4 bytes
  const view = new DataView(arr);
  view.setFloat32(0, num, littleEndian); // byteOffset = 0; litteEndian = false
  return Buffer.from(arr);
}

export function toBytesInt64(num: bigint | number, littleEndian = false) {
  const arr = new ArrayBuffer(8); // an Int32 takes 4 bytes
  const view = new DataView(arr);
  view.setBigUint64(0, BigInt(num), littleEndian); // byteOffset = 0; litteEndian = false
  return Buffer.from(arr);
}

export function toBytesInt16(num, littleEndian = false) {
  const arr = new ArrayBuffer(2); // an Int32 takes 4 bytes
  const view = new DataView(arr);
  view.setUint16(0, num, littleEndian); // byteOffset = 0; litteEndian = false
  return Buffer.from(arr);
}

export function toBytesInt8(num) {
  const arr = new ArrayBuffer(1); // an Int32 takes 4 bytes
  const view = new DataView(arr);
  view.setUint8(0, num); // byteOffset = 0;
  return Buffer.from(arr);
}

export function toBigEndianUnicodeBytes(value: string, length: number) {
  value = value.substring(0, length);
  value.padEnd(length, '\u0000');

  return Buffer.from(value, 'utf16le').swap16();
}

export function toUtf8Bytes(value: string, length: number) {
  value = value.substring(0, length);
  value.padEnd(length, '\u0000');

  return Buffer.from(value, 'utf8');
}
