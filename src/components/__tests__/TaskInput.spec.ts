import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import TaskInput from '../TaskInput.vue';

describe('TaskInput', () => {
  it('renders properly', () => {
    const wrapper = mount(TaskInput, { props: { buttonText: 'Foo Bar' } });
    expect(wrapper.text()).toContain('Foo Bar');
  });
});
