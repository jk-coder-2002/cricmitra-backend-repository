import { Permission, IPermission } from './permission.schema';

export class PermissionRepository {
  async create(data: Partial<IPermission>): Promise<IPermission> {
    return Permission.create(data);
  }

  async findAll(): Promise<IPermission[]> {
    return Permission.find().exec();
  }
}

export const permissionRepository = new PermissionRepository();
