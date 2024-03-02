import Users from './index';

import type { Meta, StoryObj } from '@storybook/react';
import { within, expect } from '@storybook/test';

export default {
  title: 'Compoments/Users',
  component: Users,
} as Meta<typeof Users>;

export const Primary: StoryObj<typeof Users> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.findByText('Name 1')).toBeTruthy();
  },
};