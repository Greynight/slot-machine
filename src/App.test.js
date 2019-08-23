import React from 'react';

import { configure, shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import App from './App';

configure({ adapter: new Adapter() });

let container = null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

// TESTS
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('randomSymbol returns random number from 0 to 4', () => {
  const wrapper = mount(<App />);
  const instance = wrapper.instance();
  const possibleValues = [0, 1, 2, 3, 4];

  expect(possibleValues).toContain(instance.randomSymbol);
});

describe('State changes on spin start', () => {
  it('Start button should be hidden', () => {
    const wrapper = mount(<App />);
    const instance = wrapper.instance();
    expect(wrapper.state('showStart')).toBe(true);
    instance.handleStart();
    expect(wrapper.state('showStart')).toBe(false);
  });
  it('Stop button should be shown', () => {
    const wrapper = mount(<App />);
    const instance = wrapper.instance();
    expect(wrapper.state('showStop')).toBe(false);
    instance.handleStart();
    expect(wrapper.state('showStop')).toBe(true);
  });
  it('Interval id should be a number', () => {
    const wrapper = mount(<App />);
    const instance = wrapper.instance();
    expect(instance.intervalId).toBeUndefined();
    instance.handleStart();
    expect(instance.intervalId).toEqual(expect.any(Number));
  });
});

describe('State changes on spin stop', () => {
  it('Stop button should be hidden', () => {
    const wrapper = mount(<App />);
    const instance = wrapper.instance();
    instance.handleStart();
    expect(wrapper.state('showStop')).toBe(true);
    instance.handleStop();
    expect(wrapper.state('showStop')).toBe(false);
  });
  it('Start button should be shown', () => {
    const wrapper = mount(<App />);
    const instance = wrapper.instance();
    instance.handleStart();
    expect(wrapper.state('showStart')).toBe(false);
    instance.handleStop();
    expect(wrapper.state('showStart')).toBe(true);
  });
  it('Interval id should be null', () => {
    const wrapper = mount(<App />);
    const instance = wrapper.instance();
    expect(instance.intervalId).toBeUndefined();
    instance.handleStart();
    expect(instance.intervalId).toEqual(expect.any(Number));
    instance.handleStop();
    expect(instance.intervalId).toBeNull();
  });
});

describe('Show appropriate award', () => {
  it('10$ for two equal pictures', () => {
    const wrapper = mount(<App/>);
    const instance = wrapper.instance();
    const initialValues = [2, 1, 2];
    const expectedResult = 'Your reward is 10$!';

    for (let i=0; i<initialValues.length; i++) {
      instance.setImage(instance.spinners[i], initialValues[i]);
    }

    instance.checkResult();
    expect(wrapper.state('text')).toBe(expectedResult);
  });
  it('20$ for two equal consecutive pictures', () => {
    const wrapper = mount(<App/>);
    const instance = wrapper.instance();
    const initialValues = [2, 2, 1];
    const expectedResult = 'Your reward is 20$!';

    for (let i=0; i<initialValues.length; i++) {
      instance.setImage(instance.spinners[i], initialValues[i]);
    }

    instance.checkResult();
    expect(wrapper.state('text')).toBe(expectedResult);
  });
  it('100$ for all equal pictures', () => {
    const wrapper = mount(<App/>);
    const instance = wrapper.instance();
    const initialValues = [2, 2, 2];
    const expectedResult = 'Your reward is 100$!';

    for (let i=0; i<initialValues.length; i++) {
      instance.setImage(instance.spinners[i], initialValues[i]);
    }

    instance.checkResult();
    expect(wrapper.state('text')).toBe(expectedResult);
  });
  it('Try again message for all different pictures', () => {
    const wrapper = mount(<App/>);
    const instance = wrapper.instance();
    const initialValues = [1, 2, 3];
    const expectedResult = 'Try again!';

    for (let i=0; i<initialValues.length; i++) {
      instance.setImage(instance.spinners[i], initialValues[i]);
    }

    instance.checkResult();
    expect(wrapper.state('text')).toBe(expectedResult);
  });
});
