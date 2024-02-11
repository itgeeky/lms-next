import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { Course, Purchase } from '@prisma/client';

type PurchaseWithCourse = Purchase & { course: Course };

const grupuByCourse = (purchases: PurchaseWithCourse[]) => {
  const grouped: { [couseTitle: string]: number } = {};

  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title;

    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }

    grouped[courseTitle] += purchase.course.price!;
  });

  return grouped;
};

export const getAnalytics = async (userId :string) => {
  try {
    const purchases = await db.purchase.findMany({
      where: {
        course:{
          userId
        }
      },
      include: {
        course: true,
      },
    });

    const groupEarnings = grupuByCourse(purchases);

    const data = Object.entries(groupEarnings).map(([courseTitle, total]) => ({
      name: courseTitle,
      total,
    }));

    const totalRevenue = purchases.reduce(
      (total, purchase) => total + purchase.course.price!,
      0
    );

    const totalSales = purchases.length;  

    return {
      totalRevenue,
      totalSales,
      data,
    };
  } catch (error) {
    console.log("Error getting analytics: ", error);
    return {
      totalRevenue: 0,
      totalSales: 0,
      data:[]
    };
  }
};
