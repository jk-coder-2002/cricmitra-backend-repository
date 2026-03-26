import { roleRepository } from './role.repository';

export class RoleService {
  async createRole(data: any) {
    return roleRepository.create(data);
  }

  async getRoles() {
    return roleRepository.findAll();
  }
}

export const roleService = new RoleService();
