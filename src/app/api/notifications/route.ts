import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ notifications: [] });
    const tenantId = user.tenantId;
    const now = new Date();
    const in7Days = new Date(now.getTime() + 7*24*60*60*1000);
    const notifications = [];

    const expiring = await prisma.memberMembership.count({
      where: { tenantId, endDate: { gte: now, lte: in7Days }, status: 'active' }
    });
    if (expiring > 0) notifications.push({
      id: 'expiring', type: 'warning', read: false,
      text: `${expiring} membership${expiring>1?'s':''} expiring soon`,
      time: 'Within 7 days', link: '/members'
    });

    const payment = await prisma.payment.findFirst({
      where: { tenantId }, orderBy: { paidAt: 'desc' },
      include: { member: { select: { name: true } } }
    });
    if (payment) {
      const mins = Math.floor((now.getTime()-new Date(payment.paidAt).getTime())/60000);
      notifications.push({
        id: 'payment', type: 'success', read: false,
        text: `PKR ${Number(payment.amount).toLocaleString()} from ${payment.member?.name}`,
        time: mins<60?`${mins} min ago`:mins<1440?`${Math.floor(mins/60)} hr ago`:`${Math.floor(mins/1440)}d ago`,
        link: '/payments'
      });
    }

    const inactive = await prisma.member.count({
      where: { tenantId, status: 'inactive' }
    });
    if (inactive > 0) notifications.push({
      id: 'inactive', type: 'info', read: true,
      text: `${inactive} inactive member${inactive>1?'s':''}`,
      time: 'Check activity', link: '/members'
    });

    return NextResponse.json({ notifications });
  } catch(e) {
    return NextResponse.json({ notifications: [] });
  }
}
