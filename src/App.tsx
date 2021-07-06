// CSS
import './App.css';
import React from 'react';
import { Container } from 'react-bootstrap';
import { FaGithub } from "@react-icons/all-files/fa/FaGithub";
import { FaBitcoin } from "@react-icons/all-files/fa/FaBitcoin";


import styled from '@emotion/styled';
import 'bootstrap/dist/css/bootstrap.min.css';

import Seed from './components/Seed';
import Multisig from './components/Multisig';
import Hierarchiral from './components/Hierarchiral';



const WrapperDivStyled = styled.div`
  
  #section {
    padding-top: 1rem;
    border-top: solid 1px grey;
  }
  
  #path {
    margin-top: 2rem;
  }
`
const H5Styled = styled.h5`
    margin-top: 1rem;
`


// Container styled component
const ContainerStyled = styled(Container)`
  text-align:center;
  
  width: 90%;
  margin-top: 4rem;
  margin-bottom: 2rem;
`


function App() {


  return (
    <WrapperDivStyled>
      
      <ContainerStyled>  
        <h1>
          My Bitcoin Playground <FaBitcoin size={50} color={"black"}/>
        </h1>
        
      </ContainerStyled>
      
      <ContainerStyled id="section">
        <Seed/>
      </ContainerStyled>

      <ContainerStyled id="section">
        <Hierarchiral/>
      </ContainerStyled>

      <ContainerStyled id='section'> 
        <Multisig/>          
      </ContainerStyled>

      <ContainerStyled>  
        <H5Styled>Hugo Brunet - Jul 2021 - Singapore</H5Styled>   
         <a target="_blanck" href="https://github.com/HugoBrunet13/my-bitcoin-playgound"><FaGithub size={40} color={"black"}/></a>
      </ContainerStyled>

    </WrapperDivStyled>

  );
}

export default App;
