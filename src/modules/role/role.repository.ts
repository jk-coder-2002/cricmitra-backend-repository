import { Role, IRole } from './role.schema';
import { RolePermission } from './role.permission.schema';

export class RoleRepository {
  async create(data: Partial<IRole>): Promise<IRole> {
    return Role.create(data);
  }

  async findAll(): Promise<IRole[]> {
    return Role.find().exec();
  }

  async assignPermission(roleId: string, permissionId: string) {
    return RolePermission.create({ roleId, permissionId });
  }
}

export const roleRepository = new RoleRepository();
