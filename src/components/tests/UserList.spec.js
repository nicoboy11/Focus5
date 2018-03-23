// External Depedencies
import React from 'react'; 
import faker from 'faker'
import { shallow, mount } from 'enzyme';
// Our dependencies
import { expect } from '../../utils/chai';
import { generarUserList } from '../../utils/testData';
//Componente
import { UserList } from '../';

describe('UserList', () => {
    let wrapper;
    const usuarios = generarUserList();

    beforeEach(() => {
        wrapper = mount(
            <UserList 
                participantes={usuarios}
                limit={5}
                size='small'
            />
        )
    });

    it('should render correctly', () => {
        expect(wrapper).to.be.present()
    })

    it('should render 5 items', () => {
        expect(wrapper.children()).to.have.length(5);
    })
});