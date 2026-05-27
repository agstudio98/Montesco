import * as dbHandler from './setup.js';
import userService from '../services/userService.js';
import User from '../models/User.js';

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe('User Service', () => {
  it('should register a new user successfully', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const user = await userService.register(userData);

    expect(user).toBeDefined();
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
    expect(user.token).toBeDefined();
    expect(user.password).toBeUndefined();
  });

  it('should throw an error if user already exists', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    await userService.register(userData);

    await expect(userService.register(userData))
      .rejects
      .toThrow('Este correo electrónico ya está registrado.');
  });

  it('should login successfully with correct credentials', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    await userService.register(userData);

    const loggedInUser = await userService.login(userData.email, userData.password);

    expect(loggedInUser).toBeDefined();
    expect(loggedInUser.email).toBe(userData.email);
    expect(loggedInUser.token).toBeDefined();
  });

  it('should throw error for incorrect credentials', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    await userService.register(userData);

    await expect(userService.login(userData.email, 'wrongpassword'))
      .rejects
      .toThrow('Credenciales inválidas. Por favor, revisa tu email y contraseña.');
  });
});
