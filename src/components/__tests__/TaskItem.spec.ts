import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import TaskItem from '../TaskItem.vue';

describe('TaskItem', () => {
  it('renders properly', () => {
    const props = {
      id: 1,
      title: 'Test Task',
      completed: false,
      onEdit: false,
    };
    const wrapper = mount(TaskItem, { props });
    expect(wrapper.text()).toContain('Test Task');
  });
});
