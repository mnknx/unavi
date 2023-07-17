import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  char,
  mysqlTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

import {
  ETH_ADDRESS_LENGTH,
  ETH_AUTH_ID_LENGTH,
  ETH_AUTH_NONCE_LENGTH,
  FILE_KEY_LENGTH,
  MAX_PROFILE_BIO_LENGTH,
  MAX_USERNAME_LENGTH,
  USER_ID_LENGTH,
  WORLD_DESCRIPTION_LENGTH,
  WORLD_HOST_LENGTH,
  WORLD_ID_LENGTH,
  WORLD_TITLE_LENGTH,
} from "./constants";

// A glTF model located in S3.
// A world can only have a single model.
// World models are immutable, to help with caching.
export const worldModel = mysqlTable("world_model", {
  createdAt: timestamp("created_at").defaultNow(),
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 255 }).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  worldId: bigint("world_id", { mode: "number" }).notNull(),
});

export const world = mysqlTable(
  "world",
  {
    createdAt: timestamp("created_at").defaultNow(),
    description: varchar("description", {
      length: WORLD_DESCRIPTION_LENGTH,
    }),
    host: varchar("host", { length: WORLD_HOST_LENGTH }),
    id: serial("id").primaryKey(),
    ownerId: varchar("owner_id", { length: USER_ID_LENGTH }).notNull(),
    publicId: char("public_id", { length: WORLD_ID_LENGTH }).notNull(),
    title: varchar("title", { length: WORLD_TITLE_LENGTH }),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    publicIdNameIndex: uniqueIndex("publicId_ownerId").on(
      table.publicId,
      table.ownerId
    ),
  })
);

export const worldRelations = relations(world, ({ one }) => ({
  model: one(worldModel, {
    fields: [world.id],
    references: [worldModel.worldId],
  }),
}));

export const profile = mysqlTable("profile", {
  backgroundKey: char("background_key", { length: FILE_KEY_LENGTH }),
  bio: varchar("bio", { length: MAX_PROFILE_BIO_LENGTH }),
  createdAt: timestamp("created_at").defaultNow(),
  id: serial("id").primaryKey(),
  imageKey: char("image_key", { length: FILE_KEY_LENGTH }),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  userId: varchar("user_id", { length: 15 }).notNull(),
});

// Auth
export const user = mysqlTable("auth_user", {
  address: char("address", { length: ETH_ADDRESS_LENGTH }),
  id: varchar("id", { length: USER_ID_LENGTH }).primaryKey(),
  username: varchar("username", { length: MAX_USERNAME_LENGTH }).notNull(),
});

export const userRelations = relations(user, ({ one, many }) => ({
  profile: one(profile, {
    fields: [user.id],
    references: [profile.userId],
  }),
  worlds: many(world),
}));

export const session = mysqlTable("auth_session", {
  activeExpires: bigint("active_expires", { mode: "number" }).notNull(),
  id: varchar("id", { length: 128 }).primaryKey(),
  idleExpires: bigint("idle_expires", { mode: "number" }).notNull(),
  userId: varchar("user_id", { length: USER_ID_LENGTH }).notNull(),
});

export const key = mysqlTable("auth_key", {
  expires: bigint("expires", { mode: "number" }),
  hashedPassword: varchar("hashed_password", { length: 255 }),
  id: varchar("id", { length: 255 }).primaryKey(),
  primaryKey: boolean("primary_key").notNull(),
  userId: varchar("user_id", { length: USER_ID_LENGTH }).notNull(),
});

export const ethereumSession = mysqlTable(
  "auth_ethereum_session",
  {
    createdAt: timestamp("created_at").defaultNow(),
    id: serial("id").primaryKey(),
    nonce: char("nonce", { length: ETH_AUTH_NONCE_LENGTH }).notNull(),
    publicId: char("public_id", { length: ETH_AUTH_ID_LENGTH }).notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    publicIdIndex: uniqueIndex("publicId").on(table.publicId),
  })
);
