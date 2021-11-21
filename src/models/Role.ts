import mongoose from 'mongoose';

export interface Role {
  name: string;
  groupId: string;
  aliases?: Array<String>;
  participants?: Array<string>;
}

const RoleSchema = new mongoose.Schema<Role>({
  name: {
    type: String,
    required: true,
  },
  groupId: {
    type: String,
    required: true,
  },
  aliases: {
    type: [String],
  },
  participants: [String],
});

RoleSchema.index(
  {
    name: 1,
    groupId: 1,
  },
  { unique: true }
);

const RoleModel = mongoose.model('Role', RoleSchema);

export default RoleModel;
