// External Depedencies
import React from 'react'; 
import faker from 'faker'
import { shallow, mount } from 'enzyme';
// Our dependencies
import { expect } from '../../utils/chai';
import { generarUser } from '../../utils/testData';
//Componente
import { Avatar } from '../';

describe('Avatar', () => {
    let wrapper;
    const avatar = generarUser();

    beforeEach(() => {
        wrapper = mount(
            <Avatar 
                avatar={avatar.avatar} 
                color={avatar.color} 
                name={avatar.txt_usuario} 
                size={avatar.size}
                displayName={avatar.txt_usuario} 
                style={{position: 'absolute', left: 5}}
            />
        )
    });

    it('should render correctly', () => {
        expect(wrapper).to.be.present()
    })

    it('should render exactelly 1 component', () => {
        expect(wrapper).to.have.length(1)
    })    
});

