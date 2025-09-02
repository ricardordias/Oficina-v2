import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  cars: defineTable({
    userId: v.id("users"),
    manufacturer: v.string(),
    model: v.string(),
    licensePlate: v.string(),
  }).index("by_user", ["userId"]),

  services: defineTable({
    userId: v.id("users"),
    carId: v.id("cars"),
    serviceType: v.string(),
    deliveryDate: v.string(),
    status: v.string(), // "agendado", "em_andamento", "concluido"
  }).index("by_user", ["userId"])
    .index("by_car", ["carId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
