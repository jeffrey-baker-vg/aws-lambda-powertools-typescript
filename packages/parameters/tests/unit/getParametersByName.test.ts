/**
 * Test getParametersByName function
 *
 * @group unit/parameters/ssm/getParametersByName/function
 */
import { DEFAULT_PROVIDERS } from '../../src/BaseProvider';
import { SSMProvider, getParametersByName } from '../../src/ssm';
import type { SSMGetParametersByNameOptionsInterface } from '../../src/types/SSMProvider';

describe('Function: getParametersByName', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('when called and a default provider doesn\'t exist, it instantiates one and returns the value', async () => {

    // Prepare
    const parameters: Record<string, SSMGetParametersByNameOptionsInterface> = {
      '/foo/bar': {
        maxAge: 1000,
      },
      '/foo/baz': {
        maxAge: 2000,
        transform: 'json',
      }
    };
    const getParametersByNameSpy = jest.spyOn(SSMProvider.prototype, 'getParametersByName').mockImplementation();

    // Act
    await getParametersByName(parameters);

    // Assess
    expect(getParametersByNameSpy).toHaveBeenCalledWith(parameters, undefined);

  });
  
  test('when called and a default provider exists, it uses it and returns the value', async () => {

    // Prepare
    const provider = new SSMProvider();
    DEFAULT_PROVIDERS.ssm = provider;
    const parameters = {
      '/foo/bar': {
        maxAge: 1000,
      },
      '/foo/baz': {
        maxAge: 2000,
      }
    };
    const getParametersByNameSpy = jest.spyOn(provider, 'getParametersByName').mockImplementation();

    // Act
    await getParametersByName(parameters);

    // Assess
    expect(getParametersByNameSpy).toHaveBeenCalledWith(parameters, undefined);
    expect(DEFAULT_PROVIDERS.ssm).toBe(provider);

  });

});