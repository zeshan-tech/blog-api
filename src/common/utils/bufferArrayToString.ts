export const onBufferArrayToString = (bufferArray: Buffer) => {
  const buffer = Buffer.from(bufferArray);
  return buffer.toString('utf8'); // Change 'utf8' to the appropriate encoding if needed
};
