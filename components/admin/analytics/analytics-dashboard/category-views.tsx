'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendLineChart } from '../trend-line-chart/trend-line-chart';
import { ComparisonBarChart } from '../comparison-bar-chart/comparison-bar-chart';
import { DistributionPieChart } from '../distribution-pie-chart/distribution-pie-chart';
import { ActivityHeatmap } from '../acitvity-heatmap/activity-heatmap';
import {
  gridStyles as grid,
  cardStyles as card,
  statStyles as stat,
} from '../shared/styles';

/* eslint-disable @typescript-eslint/no-explicit-any */

export function ReadingTrendsView({ data }: { data: any }) {
  return (
    <>
      <div className={grid.two}>
        <Card>
          <CardHeader>
            <CardTitle className={card.titleBase}>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLineChart
              data={data.salesTrend ?? []}
              xKey='date'
              lines={[
                { key: 'orders', color: '#6366f1', name: 'Orders' },
                { key: 'revenue', color: '#22c55e', name: 'Revenue ($)' },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={card.titleBase}>Reviews Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLineChart
              data={data.reviewsTrend ?? []}
              xKey='date'
              lines={[{ key: 'reviews', color: '#8b5cf6', name: 'Reviews' }]}
            />
          </CardContent>
        </Card>
      </div>

      <div className={grid.two}>
        <Card>
          <CardHeader>
            <CardTitle className={card.titleBase}>
              Top Categories by Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ComparisonBarChart
              data={data.topCategories ?? []}
              xKey='category'
              bars={[{ key: 'revenue', name: 'Revenue ($)', color: '#6366f1' }]}
              colorful
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={card.titleBase}>
              Rating Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionPieChart
              data={(data.ratingDistribution ?? []).map((r: any) => ({
                name: `${r.rating} Star${r.rating !== 1 ? 's' : ''}`,
                value: r.count,
              }))}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className={card.titleBase}>Top Selling Books</CardTitle>
        </CardHeader>
        <CardContent>
          <ComparisonBarChart
            data={data.topBooks ?? []}
            xKey='name'
            bars={[
              { key: 'quantity', name: 'Units Sold', color: '#6366f1' },
              { key: 'revenue', name: 'Revenue ($)', color: '#22c55e' },
            ]}
          />
        </CardContent>
      </Card>
    </>
  );
}

export function CommunityEngagementView({ data }: { data: any }) {
  return (
    <>
      <div className={grid.two}>
        <Card>
          <CardHeader>
            <CardTitle className={card.titleBase}>Reviews Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLineChart
              data={data.reviewsTrend ?? []}
              xKey='date'
              lines={[{ key: 'reviews', color: '#8b5cf6', name: 'Reviews' }]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={card.titleBase}>Follows Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLineChart
              data={data.followsTrend ?? []}
              xKey='date'
              lines={[
                { key: 'follows', color: '#ec4899', name: 'New Follows' },
              ]}
            />
          </CardContent>
        </Card>
      </div>

      <div className={grid.three}>
        <Card>
          <CardHeader>
            <CardTitle className={card.titleBase}>Vote Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionPieChart
              data={(data.voteStats ?? []).map((v: any) => ({
                name: v.label,
                value: v.count,
              }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={card.titleBase}>
              Submissions by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionPieChart
              data={(data.submissionsByStatus ?? []).map((s: any) => ({
                name: s.status,
                value: s.count,
              }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={card.titleBase}>Review Reports</CardTitle>
          </CardHeader>
          <CardContent className={stat.centeredContent}>
            <p className={stat.big}>{data.reportCount ?? 0}</p>
            <p className={stat.label}>Total Reports</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className={card.titleBase}>Top Reviewers</CardTitle>
        </CardHeader>
        <CardContent>
          <ComparisonBarChart
            data={data.topReviewers ?? []}
            xKey='name'
            bars={[
              { key: 'reviewCount', name: 'Reviews', color: '#6366f1' },
              { key: 'avgRating', name: 'Avg Rating', color: '#f97316' },
            ]}
          />
        </CardContent>
      </Card>
    </>
  );
}

export function EventsClubsView({ data }: { data: any }) {
  return (
    <>
      <div className={grid.four}>
        <Card>
          <CardHeader className={card.headerCompact}>
            <CardTitle className={card.titleSm}>Active Clubs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={stat.value}>{data.activeClubs ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className={card.headerCompact}>
            <CardTitle className={card.titleSm}>Active Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={stat.value}>{data.activeEvents ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className={card.headerCompact}>
            <CardTitle className={card.titleSm}>Request Status</CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionPieChart
              data={(data.requestsByStatus ?? []).map((s: any) => ({
                name: s.status,
                value: s.count,
              }))}
              height={220}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className={card.headerCompact}>
            <CardTitle className={card.titleSm}>Format Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionPieChart
              data={(data.formatDistribution ?? []).map((f: any) => ({
                name: f.format,
                value: f.count,
              }))}
              height={220}
            />
          </CardContent>
        </Card>
      </div>

      <div className={grid.two}>
        <Card>
          <CardHeader>
            <CardTitle className={card.titleBase}>
              Registrations Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLineChart
              data={data.registrationsTrend ?? []}
              xKey='date'
              lines={[
                {
                  key: 'registrations',
                  color: '#6366f1',
                  name: 'Registrations',
                },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={card.titleBase}>
              Attendance Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionPieChart
              data={(data.attendanceStats ?? []).map((a: any) => ({
                name: a.status,
                value: a.count,
              }))}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className={card.titleBase}>Top Clubs by Members</CardTitle>
        </CardHeader>
        <CardContent>
          <ComparisonBarChart
            data={data.topClubs ?? []}
            xKey='title'
            bars={[{ key: 'memberCount', name: 'Members', color: '#8b5cf6' }]}
            colorful
          />
        </CardContent>
      </Card>
    </>
  );
}

export function UserBehaviorView({ data }: { data: any }) {
  return (
    <>
      <div className={grid.three}>
        <Card>
          <CardHeader className={card.headerCompact}>
            <CardTitle className={card.titleSm}>
              Cart Abandonment Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={stat.value}>
              {data.cartAbandonment?.abandonmentRate ?? 0}%
            </p>
            <p className={stat.label}>
              {data.cartAbandonment?.totalCarts ?? 0} carts /{' '}
              {data.cartAbandonment?.totalOrders ?? 0} orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={card.headerCompact}>
            <CardTitle className={card.titleSm}>Buyer Types</CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionPieChart
              data={[
                { name: 'Repeat', value: data.buyerTypes?.repeat ?? 0 },
                { name: 'One-time', value: data.buyerTypes?.oneTime ?? 0 },
              ]}
              height={240}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={card.headerCompact}>
            <CardTitle className={card.titleSm}>User Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionPieChart
              data={(data.roleDistribution ?? []).map((r: any) => ({
                name: r.role,
                value: r.count,
              }))}
              height={240}
            />
          </CardContent>
        </Card>
      </div>

      <div className={grid.two}>
        <Card>
          <CardHeader>
            <CardTitle className={card.titleBase}>New User Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLineChart
              data={data.signupsTrend ?? []}
              xKey='date'
              lines={[{ key: 'signups', color: '#22c55e', name: 'Signups' }]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={card.titleBase}>Top Buyers</CardTitle>
          </CardHeader>
          <CardContent>
            <ComparisonBarChart
              data={data.topBuyers ?? []}
              xKey='name'
              bars={[
                {
                  key: 'totalSpent',
                  name: 'Total Spent ($)',
                  color: '#6366f1',
                },
                { key: 'orderCount', name: 'Orders', color: '#f97316' },
              ]}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className={card.titleBase}>
            Order Activity Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityHeatmap data={data.activityHeatmap ?? []} />
        </CardContent>
      </Card>
    </>
  );
}
