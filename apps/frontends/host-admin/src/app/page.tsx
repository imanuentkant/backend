'use client';

import { useQuery } from '@tanstack/react-query';
import { getDashboardOverview } from '@/lib/api/dashboard';
import { Card, Statistic, Row, Col } from 'antd';
import { DollarOutlined, HomeOutlined, CalendarOutlined, StarOutlined } from '@ant-design/icons';

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardOverview,
  });

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Host Dashboard</h1>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Earnings"
              value={data?.totalEarnings || 0}
              prefix={<DollarOutlined />}
              suffix="USD"
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Properties"
              value={data?.activeProperties || 0}
              prefix={<HomeOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Occupancy Rate"
              value={data?.occupancyRate || 0}
              prefix={<CalendarOutlined />}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Average Rating"
              value={data?.averageRating || 0}
              prefix={<StarOutlined />}
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Bookings */}
      <Card title="Recent Bookings" className="mb-8">
        <div className="space-y-4">
          {data?.recentBookings?.map((booking: any) => (
            <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold">{booking.propertyTitle}</p>
                <p className="text-sm text-gray-600">
                  {booking.guestName} · {booking.checkInDate} - {booking.checkOutDate}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">${booking.totalAmount}</p>
                <p className="text-sm text-gray-600">{booking.status}</p>
              </div>
            </div>
          )) || <p className="text-gray-500">No recent bookings</p>}
        </div>
      </Card>
    </div>
  );
}