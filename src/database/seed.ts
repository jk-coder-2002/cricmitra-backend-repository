import mongoose from 'mongoose';
import config from '../config';
import { Role } from '../modules/role/role.schema';
import { Permission } from '../modules/permission/permission.schema';
import { RolePermission } from '../modules/role/role.permission.schema';
import logger from '../common/utils/logger';

const seedDatabase = async () => {
  try {
    await mongoose.connect(config.dbUri);
    logger.info('Connected to MongoDB for seeding');

    // 1. Create Permissions
    const permissions = [
      { name: 'create_match', description: 'Can create matches' },
      { name: 'update_score', description: 'Can update match score' },
      { name: 'manage_tournament', description: 'Can create and manage tournaments' },
      { name: 'manage_team', description: 'Can create and manage teams' },
      { name: 'join_match', description: 'Can join a match as a player' },
      { name: 'participate_auction', description: 'Can participate in auctions' }
    ];

    const insertedPermissions = await Permission.insertMany(permissions, { ordered: false }).catch((e) => {
        logger.info('Permissions already exist or partially exist');
        return Permission.find();
    });

    // 2. Create Roles
    const roles = [
      { name: 'SuperAdmin', description: 'Full access to system' },
      { name: 'Organizer', description: 'Can manage tournaments, teams and matches' },
      { name: 'Scorer', description: 'Can update scores' },
      { name: 'Player', description: 'Can join matches and view stats' },
      { name: 'Viewer', description: 'Can view matches and stats only' }
    ];

    const insertedRoles = await Role.insertMany(roles, { ordered: false }).catch((e) => {
        logger.info('Roles already exist or partially exist');
        return Role.find();
    });

    // 3. Map Roles to Permissions
    const getRole = (name: string) => insertedRoles.find((r: any) => r.name === name);
    const getPerm = (name: string) => insertedPermissions.find((p: any) => p.name === name);

    const rolePermMap = [
      { role: 'Organizer', perms: ['manage_tournament', 'manage_team', 'create_match'] },
      { role: 'Scorer', perms: ['update_score'] },
      { role: 'Player', perms: ['join_match', 'participate_auction'] }
      // SuperAdmin gets all implicitly in middleware, Viewer gets none
    ];

    for (const mapping of rolePermMap) {
      const role = getRole(mapping.role);
      if (role) {
        for (const permName of mapping.perms) {
          const perm = getPerm(permName);
          if (perm) {
            await RolePermission.updateOne(
              { roleId: role._id, permissionId: perm._id },
              { $setOnInsert: { roleId: role._id, permissionId: perm._id } },
              { upsert: true }
            );
          }
        }
      }
    }

    logger.info('Database seeded successfully with Roles and Permissions');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
