import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUserCars = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("cars")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const addCar = mutation({
  args: {
    manufacturer: v.string(),
    model: v.string(),
    licensePlate: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    return await ctx.db.insert("cars", {
      userId,
      manufacturer: args.manufacturer,
      model: args.model,
      licensePlate: args.licensePlate,
    });
  },
});

export const updateCar = mutation({
  args: {
    carId: v.id("cars"),
    manufacturer: v.string(),
    model: v.string(),
    licensePlate: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    const car = await ctx.db.get(args.carId);
    if (!car || car.userId !== userId) {
      throw new Error("Carro não encontrado");
    }

    return await ctx.db.patch(args.carId, {
      manufacturer: args.manufacturer,
      model: args.model,
      licensePlate: args.licensePlate,
    });
  },
});

export const deleteCar = mutation({
  args: {
    carId: v.id("cars"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    const car = await ctx.db.get(args.carId);
    if (!car || car.userId !== userId) {
      throw new Error("Carro não encontrado");
    }

    // Deletar serviços relacionados ao carro
    const services = await ctx.db
      .query("services")
      .withIndex("by_car", (q) => q.eq("carId", args.carId))
      .collect();

    for (const service of services) {
      await ctx.db.delete(service._id);
    }

    return await ctx.db.delete(args.carId);
  },
});
