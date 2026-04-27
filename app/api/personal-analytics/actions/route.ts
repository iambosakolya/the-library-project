import { NextRequest, NextResponse } from 'next/server';
import {
  upsertGoal,
  deleteGoal,
  updatePrivacySettings,
  saveDashboardLayout,
  updateReadingStreak,
} from '@/lib/actions/personal-analytics.actions';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case 'upsert-goal': {
        const { type, target } = body;
        if (!type || !target) {
          return NextResponse.json(
            { error: 'Type and target are required' },
            { status: 400 },
          );
        }
        const goal = await upsertGoal(type, parseInt(target));
        return NextResponse.json(goal);
      }

      case 'delete-goal': {
        const { goalId } = body;
        if (!goalId) {
          return NextResponse.json(
            { error: 'Goal ID is required' },
            { status: 400 },
          );
        }
        const result = await deleteGoal(goalId);
        return NextResponse.json(result);
      }

      case 'update-privacy': {
        const { settings } = body;
        if (!settings) {
          return NextResponse.json(
            { error: 'Settings are required' },
            { status: 400 },
          );
        }
        const updated = await updatePrivacySettings(settings);
        return NextResponse.json(updated);
      }

      case 'save-layout': {
        const { layout } = body;
        if (!layout) {
          return NextResponse.json(
            { error: 'Layout is required' },
            { status: 400 },
          );
        }
        const result = await saveDashboardLayout(layout);
        return NextResponse.json(result);
      }

      case 'update-streak': {
        const streak = await updateReadingStreak();
        return NextResponse.json(streak);
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
