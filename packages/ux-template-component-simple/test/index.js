import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
// import sinon from 'sinon'

import Component from '..'

describe('<Component />', () => {
  it('renders one <div /> components', () => {
    const wrapper = shallow(<Component />)

    expect(wrapper.find('div')).to.have.length(1)
  })
})
