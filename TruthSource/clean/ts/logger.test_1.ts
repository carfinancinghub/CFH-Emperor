// Converted from logger.test.js — 2025-08-22T18:13:09.524039+00:00
// Date: 062525 [1857], � 2025 CFH
const logger = require('@utils/logger');
describe('Logger Utility', () => {
  let infoSpy, warnSpy, errorSpy;
  beforeEach(() => {
    infoSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    infoSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });
  it('should log info messages', () => {
    logger.info('Test info');
    expect(infoSpy).toHaveBeenCalledWith('Test info');
  });
});


