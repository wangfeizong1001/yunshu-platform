import { describe, it, expect } from 'vitest';
import { generators, toPascalCase, toCamelCase, toKebabCase } from '../../commands/generate';

describe('generate', () => {
  describe('命名转换工具函数', () => {
    it('should convert kebab-case to PascalCase', () => {
      expect(toPascalCase('user-list')).toBe('UserList');
      expect(toPascalCase('user-profile')).toBe('UserProfile');
      expect(toPascalCase('hello-world-test')).toBe('HelloWorldTest');
      expect(toPascalCase('a')).toBe('A');
      expect(toPascalCase('single')).toBe('Single');
    });

    it('should convert kebab-case to camelCase', () => {
      expect(toCamelCase('user-list')).toBe('userList');
      expect(toCamelCase('user-profile')).toBe('userProfile');
      expect(toCamelCase('hello-world-test')).toBe('helloWorldTest');
      expect(toCamelCase('a')).toBe('a');
      expect(toCamelCase('single')).toBe('single');
    });

    it('should convert to kebab-case', () => {
      expect(toKebabCase('UserList')).toBe('user-list');
      expect(toKebabCase('UserProfile')).toBe('user-profile');
      expect(toKebabCase('helloWorld')).toBe('hello-world');
      expect(toKebabCase('A')).toBe('a');
    });
  });

  describe('Page 生成器', () => {
    it('should generate Vue page with script setup', () => {
      const content = generators.page.generate('user-list');
      expect(content).toContain('<script setup lang="ts">');
      expect(content).toContain('</script>');
      expect(content).toContain('<template>');
      expect(content).toContain('</template>');
      expect(content).toContain('<style scoped lang="scss">');
      expect(content).toContain('</style>');
    });

    it('should include PascalCase component name', () => {
      const content = generators.page.generate('user-list');
      expect(content).toContain('UserList');
    });

    it('should include kebab-case style class', () => {
      const content = generators.page.generate('user-list');
      expect(content).toContain('user-list-page');
    });

    it('should include Element Plus components', () => {
      const content = generators.page.generate('user-list');
      expect(content).toContain('ElMessage');
      expect(content).toContain('el-table');
      expect(content).toContain('el-pagination');
    });

    it('should include Vue composition API', () => {
      const content = generators.page.generate('user-list');
      expect(content).toContain('ref(');
      expect(content).toContain('onMounted');
    });
  });

  describe('Component 生成器', () => {
    it('should generate Vue component with script setup', () => {
      const content = generators.component.generate('data-table');
      expect(content).toContain('<script setup lang="ts">');
      expect(content).toContain('</script>');
      expect(content).toContain('<template>');
      expect(content).toContain('</template>');
    });

    it('should include PascalCase name', () => {
      const content = generators.component.generate('data-table');
      expect(content).toContain('DataTable');
    });

    it('should include kebab-case style class', () => {
      const content = generators.component.generate('data-table');
      expect(content).toContain('data-table');
    });

    it('should have defineProps or withDefaults', () => {
      const content = generators.component.generate('data-table');
      expect(content).toContain('withDefaults');
      expect(content).toContain('defineProps');
    });

    it('should include emit definitions', () => {
      const content = generators.component.generate('data-table');
      expect(content).toContain('defineEmits');
    });
  });

  describe('API 生成器', () => {
    it('should generate TypeScript API module', () => {
      const content = generators.api.generate('user-list');
      expect(content).toContain('@/utils/request');
      expect(content).toContain('UserList');
      expect(content).toContain('userList');
    });

    it('should generate with axios request methods', () => {
      const content = generators.api.generate('user-list');
      expect(content).toContain('request');
      expect(content).toContain('url:');
      expect(content).toContain('method:');
    });

    it('should include CRUD operations', () => {
      const content = generators.api.generate('user-list');
      expect(content).toContain('getUserList');
      expect(content).toContain('getUserListDetail');
      expect(content).toContain('createUserList');
      expect(content).toContain('updateUserList');
      expect(content).toContain('deleteUserList');
    });

    it('should include TypeScript interfaces', () => {
      const content = generators.api.generate('user-list');
      expect(content).toContain('export interface UserListItem');
      expect(content).toContain('export interface UserListQuery');
      expect(content).toContain('export interface ApiResponse');
    });

    it('should support single name conversion', () => {
      const content = generators.api.generate('user');
      expect(content).toContain('User');
      expect(content).toContain('user');
    });
  });

  describe('Store 生成器', () => {
    it('should generate Pinia store with defineStore', () => {
      const content = generators.store.generate('user-list');
      expect(content).toContain('defineStore');
      expect(content).toContain('pinia');
      expect(content).toContain('useUserListStore');
    });

    it('should include Vue composition API', () => {
      const content = generators.store.generate('user-list');
      expect(content).toContain('ref(');
      expect(content).toContain('computed(');
    });

    it('should include state, getters and actions', () => {
      const content = generators.store.generate('user-list');
      expect(content).toContain('items');
      expect(content).toContain('activeItems');
      expect(content).toContain('fetchItems');
      expect(content).toContain('addItem');
      expect(content).toContain('removeItem');
    });

    it('should include store id using camelCase name', () => {
      const content = generators.store.generate('user-list');
      expect(content).toContain("'userList'");
    });
  });

  describe('Composable 生成器', () => {
    it('should generate Vue composable function', () => {
      const content = generators.composable.generate('user-list');
      expect(content).toContain('useUserList');
    });

    it('should include ref and onMounted', () => {
      const content = generators.composable.generate('user-list');
      expect(content).toContain('ref(');
      expect(content).toContain('onMounted');
    });

    it('should return data, loading, error and refresh', () => {
      const content = generators.composable.generate('user-list');
      expect(content).toContain('data');
      expect(content).toContain('loading');
      expect(content).toContain('error');
      expect(content).toContain('refresh');
      expect(content).toContain('clear');
    });

    it('should include derived state hasData', () => {
      const content = generators.composable.generate('user-list');
      expect(content).toContain('hasData');
    });

    it('should include TypeScript interfaces', () => {
      const content = generators.composable.generate('user-list');
      expect(content).toContain('interface UseUserListOptions');
    });

    it('should include list helper function', () => {
      const content = generators.composable.generate('user-list');
      expect(content).toContain('useUserListList');
    });
  });

  describe('所有生成器类型', () => {
    it('should have correct file extensions', () => {
      expect(generators.page.extension).toBe('vue');
      expect(generators.component.extension).toBe('vue');
      expect(generators.api.extension).toBe('ts');
      expect(generators.store.extension).toBe('ts');
      expect(generators.composable.extension).toBe('ts');
    });

    it('should have descriptions', () => {
      expect(generators.page.description).toBeTruthy();
      expect(generators.component.description).toBeTruthy();
      expect(generators.api.description).toBeTruthy();
      expect(generators.store.description).toBeTruthy();
      expect(generators.composable.description).toBeTruthy();
    });
  });
});
