import logger from '../../src/utils/logger'

describe('Logger', () => {
  it('should log success message', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {})
    logger.success('Test success')
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('✅'))
    spy.mockRestore()
  })

  it('should log warning message', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    logger.warn('Test warn')
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('⚠️'))
    spy.mockRestore()
  })

  it('should log error message', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    logger.error('Test error')
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('❌'))
    spy.mockRestore()
  })

  it('should log info message', () => {
    const spy = jest.spyOn(console, 'info').mockImplementation(() => {})
    logger.info('Test info')
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('ℹ️'))
    spy.mockRestore()
  })
})
