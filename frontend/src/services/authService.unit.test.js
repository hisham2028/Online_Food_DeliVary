import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockSignInWithPopup = vi.fn();
const mockSignOut = vi.fn();
const mockOnAuthStateChanged = vi.fn();
const mockAxiosPost = vi.fn();

vi.mock('firebase/auth', () => ({
  signInWithPopup: (...args) => mockSignInWithPopup(...args),
  signOut: (...args) => mockSignOut(...args),
  onAuthStateChanged: (...args) => mockOnAuthStateChanged(...args),
}));

vi.mock('../firebase/config', () => ({
  auth: { app: 'test-auth' },
  googleProvider: { providerId: 'google.com' },
  facebookProvider: { providerId: 'facebook.com' },
}));

vi.mock('axios', () => ({
  default: {
    post: (...args) => mockAxiosPost(...args),
  },
}));

describe('authService unit tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('signInWithGoogle stores token and returns success payload', async () => {
    const fakeUser = {
      displayName: 'Test User',
      email: 'user@example.com',
      uid: 'uid-1',
      photoURL: 'photo-url',
    };

    mockSignInWithPopup.mockResolvedValueOnce({ user: fakeUser });
    mockAxiosPost.mockResolvedValueOnce({
      data: {
        success: true,
        token: 'token-123',
        user: { id: 'u1', name: 'Test User' },
      },
    });

    const { default: authService } = await import('./authService');
    const result = await authService.signInWithGoogle();

    expect(result.success).toBe(true);
    expect(result.token).toBe('token-123');
    expect(localStorage.getItem('token')).toBe('token-123');
    expect(mockAxiosPost).toHaveBeenCalledTimes(1);
  });

  it('signInWithFacebook throws when backend responds with success false', async () => {
    const fakeUser = {
      displayName: 'Meta User',
      email: 'meta@example.com',
      uid: 'uid-2',
      photoURL: 'photo-url-2',
    };

    mockSignInWithPopup.mockResolvedValueOnce({ user: fakeUser });
    mockAxiosPost.mockResolvedValueOnce({
      data: {
        success: false,
        message: 'Social login failed',
      },
    });

    const { default: authService } = await import('./authService');

    await expect(authService.signInWithFacebook()).rejects.toThrow('Social login failed');
  });

  it('signOut removes token from localStorage', async () => {
    localStorage.setItem('token', 'token-123');
    mockSignOut.mockResolvedValueOnce(undefined);

    const { default: authService } = await import('./authService');
    const result = await authService.signOut();

    expect(result).toEqual({ success: true });
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('onAuthStateChange forwards callback and returns unsubscribe handler', async () => {
    const unsubscribe = vi.fn();
    const cb = vi.fn();
    mockOnAuthStateChanged.mockReturnValueOnce(unsubscribe);

    const { default: authService } = await import('./authService');
    const result = authService.onAuthStateChange(cb);

    expect(mockOnAuthStateChanged).toHaveBeenCalledTimes(1);
    expect(result).toBe(unsubscribe);
  });

  it('getCurrentToken reads token from localStorage', async () => {
    localStorage.setItem('token', 'abc-xyz');
    const { default: authService } = await import('./authService');

    expect(authService.getCurrentToken()).toBe('abc-xyz');
  });
});
