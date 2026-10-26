import styled from 'styled-components';
import React from 'react';
import VhashSearch from './address.v2';

interface Prop {
    address: string;
    id: string;
}

const BasenamesLanding: React.FC<Prop> = ({ address, id }) => {
    return <VhashSearch address={address} id={id} />
};
export default BasenamesLanding;


