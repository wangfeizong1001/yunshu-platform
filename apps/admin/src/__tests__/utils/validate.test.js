import { describe, it, expect } from 'vitest';
import { validateUsername, validatePassword, validatePhone, validateEmail } from '@/utils/validate';
describe('validate utils', () => {
  describe('validateUsername', () => {
    it('should pass for valid username', () => {
      validateUsername({}, 'admin123', (error) => {
        expect(error).toBeUndefined();
      });
    });
    it('should fail for username too short', () => {
      validateUsername({}, 'adm', (error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('用户名必须是4-16位字母数字');
      });
    });
    it('should fail for username too long', () => {
      validateUsername({}, 'admin1234567890123', (error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('用户名必须是4-16位字母数字');
      });
    });
    it('should fail for username with special characters', () => {
      validateUsername({}, 'admin@123', (error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('用户名必须是4-16位字母数字');
      });
    });
  });
  describe('validatePassword', () => {
    it('should pass for valid password', () => {
      validatePassword({}, 'password123', (error) => {
        expect(error).toBeUndefined();
      });
    });
    it('should fail for password too short', () => {
      validatePassword({}, '12345', (error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('密码长度不能小于6位');
      });
    });
  });
  describe('validatePhone', () => {
    it('should pass for valid phone number', () => {
      validatePhone({}, '13812345678', (error) => {
        expect(error).toBeUndefined();
      });
    });
    it('should fail for invalid phone number format', () => {
      validatePhone({}, '12345678901', (error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('请输入正确的手机号');
      });
    });
    it('should fail for phone number too short', () => {
      validatePhone({}, '1381234567', (error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('请输入正确的手机号');
      });
    });
  });
  describe('validateEmail', () => {
    it('should pass for valid email', () => {
      validateEmail({}, 'test@example.com', (error) => {
        expect(error).toBeUndefined();
      });
    });
    it('should fail for invalid email format', () => {
      validateEmail({}, 'invalid-email', (error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('请输入正确的邮箱地址');
      });
    });
    it('should fail for email without @', () => {
      validateEmail({}, 'testexample.com', (error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('请输入正确的邮箱地址');
      });
    });
  });
});
//# sourceMappingURL=validate.test.js.map
