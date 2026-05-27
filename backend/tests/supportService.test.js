import * as dbHandler from './setup.js';
import supportService from '../services/supportService.js';
import Support from '../models/Support.js';
import User from '../models/User.js';

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe('Support Service', () => {
  it('should return a valid bot response for keywords', async () => {
    const response = await supportService.processChatMessage('¿Cómo funcionan los pagos?', null, 'es');
    expect(response.text).toContain('Visa, Mastercard y Mercado Pago');
  });

  it('should return a fallback response for unknown messages', async () => {
    const response = await supportService.processChatMessage('asdfghjkl', null, 'es');
    expect(response.text).toContain('no entiendo tu consulta');
  });

  it('should create an automatic claim if keywords match and user is logged in', async () => {
    const user = await User.create({
      name: 'Claimant',
      email: 'claim@example.com',
      password: 'password'
    });

    const response = await supportService.processChatMessage('Mi producto llegó roto', user._id, 'es');
    
    expect(response.text).toContain('He generado un reporte automático');
    
    const claims = await Support.find({ user: user._id });
    expect(claims.length).toBe(1);
    expect(claims[0].subject).toBe('Reporte Automático Chat');
  });

  it('should fetch user claims correctly', async () => {
    const user = await User.create({
      name: 'Claimant',
      email: 'claim@example.com',
      password: 'password'
    });

    await Support.create({
      user: user._id,
      name: user.name,
      email: user.email,
      subject: 'Test Subject',
      message: 'Test Message',
      status: 'pending'
    });

    const claims = await supportService.getUserClaims(user._id.toString());
    expect(claims.length).toBe(1);
    expect(claims[0].subject).toBe('Test Subject');
  });
});
