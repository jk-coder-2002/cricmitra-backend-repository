import { permissionRepository } from './permission.repository';

export class PermissionService {
  async createPermission(data: any) {
    return permissionRepository.create(data);
  }

  async getPermissions() {
    return permissionRepository.findAll();
  }
}

export const permissionService = new PermissionService();
