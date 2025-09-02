import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUserServices = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const services = await ctx.db
      .query("services")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Buscar informações dos carros para cada serviço
    const servicesWithCars = await Promise.all(
      services.map(async (service) => {
        const car = await ctx.db.get(service.carId);
        return {
          ...service,
          car,
        };
      })
    );

    return servicesWithCars;
  },
});

export const scheduleService = mutation({
  args: {
    carId: v.id("cars"),
    serviceType: v.string(),
    deliveryDate: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    // Verificar se o carro pertence ao usuário
    const car = await ctx.db.get(args.carId);
    if (!car || car.userId !== userId) {
      throw new Error("Carro não encontrado");
    }

    return await ctx.db.insert("services", {
      userId,
      carId: args.carId,
      serviceType: args.serviceType,
      deliveryDate: args.deliveryDate,
      status: "agendado",
    });
  },
});

export const updateServiceStatus = mutation({
  args: {
    serviceId: v.id("services"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    const service = await ctx.db.get(args.serviceId);
    if (!service || service.userId !== userId) {
      throw new Error("Serviço não encontrado");
    }

    return await ctx.db.patch(args.serviceId, {
      status: args.status,
    });
  },
});

export const deleteService = mutation({
  args: {
    serviceId: v.id("services"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    const service = await ctx.db.get(args.serviceId);
    if (!service || service.userId !== userId) {
      throw new Error("Serviço não encontrado");
    }

    return await ctx.db.delete(args.serviceId);
  },
});
