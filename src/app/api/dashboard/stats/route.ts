import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { employees, marbleInventory, productionOrders, clients, sales } from '@/db/schema';
import { sql, lt } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Employee Statistics
    const employeeCount = await db.select({ 
      count: sql<number>`COUNT(*)` 
    }).from(employees);
    
    const employeesByDept = await db.select({
      department: employees.department,
      count: sql<number>`COUNT(*)`
    }).from(employees).groupBy(employees.department);
    
    const avgPerformance = await db.select({
      avg: sql<number>`AVG(${employees.performanceScore})`
    }).from(employees);

    const employeesByDepartment: Record<string, number> = {};
    employeesByDept.forEach(dept => {
      employeesByDepartment[dept.department] = Number(dept.count);
    });

    // Inventory Statistics
    const inventoryCount = await db.select({
      count: sql<number>`COUNT(*)`
    }).from(marbleInventory);

    const inventoryValue = await db.select({
      total: sql<number>`SUM(${marbleInventory.quantity} * ${marbleInventory.pricePerUnit})`
    }).from(marbleInventory);

    const lowStockItemsData = await db.select()
      .from(marbleInventory)
      .where(lt(marbleInventory.quantity, 10));

    const inventoryByTypeData = await db.select({
      marbleType: marbleInventory.marbleType,
      totalQuantity: sql<number>`SUM(${marbleInventory.quantity})`
    }).from(marbleInventory).groupBy(marbleInventory.marbleType);

    const inventoryByType: Record<string, number> = {};
    inventoryByTypeData.forEach(item => {
      inventoryByType[item.marbleType] = Number(item.totalQuantity);
    });

    // Production Statistics
    const productionCount = await db.select({
      count: sql<number>`COUNT(*)`
    }).from(productionOrders);

    const ordersByStageData = await db.select({
      stage: productionOrders.stage,
      count: sql<number>`COUNT(*)`
    }).from(productionOrders).groupBy(productionOrders.stage);

    const ordersByStatusData = await db.select({
      status: productionOrders.status,
      count: sql<number>`COUNT(*)`
    }).from(productionOrders).groupBy(productionOrders.status);

    const avgProgressData = await db.select({
      avg: sql<number>`AVG(${productionOrders.progress})`
    }).from(productionOrders);

    const ordersByStage: Record<string, number> = {};
    ordersByStageData.forEach(item => {
      ordersByStage[item.stage] = Number(item.count);
    });

    const ordersByStatus: Record<string, number> = {};
    ordersByStatusData.forEach(item => {
      ordersByStatus[item.status] = Number(item.count);
    });

    // Client Statistics
    const clientCount = await db.select({
      count: sql<number>`COUNT(*)`
    }).from(clients);

    const clientRevenue = await db.select({
      total: sql<number>`SUM(${clients.totalRevenue})`
    }).from(clients);

    const clientProjects = await db.select({
      total: sql<number>`SUM(${clients.totalProjects})`
    }).from(clients);

    // Sales Statistics
    const salesCount = await db.select({
      count: sql<number>`COUNT(*)`
    }).from(sales);

    const salesAmount = await db.select({
      total: sql<number>`SUM(${sales.amount})`
    }).from(sales);

    const salesByStatusData = await db.select({
      status: sales.status,
      count: sql<number>`COUNT(*)`
    }).from(sales).groupBy(sales.status);

    const salesByPaymentStatusData = await db.select({
      paymentStatus: sales.paymentStatus,
      count: sql<number>`COUNT(*)`
    }).from(sales).groupBy(sales.paymentStatus);

    const recentSalesData = await db.select()
      .from(sales)
      .limit(5);

    const salesByStatus: Record<string, number> = {};
    salesByStatusData.forEach(item => {
      salesByStatus[item.status] = Number(item.count);
    });

    const salesByPaymentStatus: Record<string, number> = {};
    salesByPaymentStatusData.forEach(item => {
      salesByPaymentStatus[item.paymentStatus] = Number(item.count);
    });

    // Construct comprehensive dashboard statistics
    const dashboardStats = {
      employeeStats: {
        totalEmployees: Number(employeeCount[0]?.count || 0),
        employeesByDepartment,
        avgPerformanceScore: Number(avgPerformance[0]?.avg || 0)
      },
      inventoryStats: {
        totalInventoryItems: Number(inventoryCount[0]?.count || 0),
        totalInventoryValue: Number(inventoryValue[0]?.total || 0),
        lowStockItems: lowStockItemsData,
        inventoryByType
      },
      productionStats: {
        totalProductionOrders: Number(productionCount[0]?.count || 0),
        ordersByStage,
        ordersByStatus,
        avgProgress: Number(avgProgressData[0]?.avg || 0)
      },
      clientStats: {
        totalClients: Number(clientCount[0]?.count || 0),
        totalRevenue: Number(clientRevenue[0]?.total || 0),
        totalProjects: Number(clientProjects[0]?.total || 0)
      },
      salesStats: {
        totalSales: Number(salesCount[0]?.count || 0),
        totalSalesAmount: Number(salesAmount[0]?.total || 0),
        salesByStatus,
        salesByPaymentStatus,
        recentSales: recentSalesData
      }
    };

    return NextResponse.json(dashboardStats, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}