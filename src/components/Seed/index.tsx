import * as bip39 from 'bip39';
import Select from 'react-select';
import styled from '@emotion/styled';

import React, { useState } from 'react';
import { Col, InputGroup, Row, FormControl } from 'react-bootstrap';

const Countries = [
    { label: "Chinese Simplified", value: "chinese_simplified" },
    { label: "Chinese Traditional", value: "chinese_traditional" },
    { label: "Czech", value: "czech" },
    { label: "English", value: "english" },
    { label: "French", value: "french" },
    { label: "Italian", value: "italian" },
    { label: "Japanese", value: "japanese" },
    { label: "Korean", value: "korean" },
    { label: "Portuguese", value: "portuguese" },
    { label: "Spanisg", value: "spanish" },
  ];
  
const EntropyLength = [
    { label: "128 bits (12 words) ", value: "128" },
    { label: "160 bits (15 words)", value: "160" },
    { label: "192 bits (18 words)", value: "192" },
    { label: "224 bits (21 words)", value: "224" },
    { label: "256 bits (24 words)", value: "256" },
];

const H3Styled = styled.h3`
  margin-top: 1rem;
  margin-bottom: 2rem;
`

const RowStyled = styled(Row) `
  margin-top: 1rem;
  
`
const ColTextStyled = styled(Col)`
  display: flex;
  justify-content: center;
  align-items: center;
`
const ColInputStyled = styled(Col)`
  display: flex;
  align-items: center;
`

// text styled
interface IParagraph {
    color?: 'error';
  }
  

const ParagraphStyled = styled.p<IParagraph>`
    color: ${props => props.color ? props.color === 'error' ? 'red' : 'black' : 'black'};
    min-width: 10rem;
    margin-bottom: 0;
`

const SelectStyled = styled(Select)`
    width: 100%;
`

const Seed = () => {

    const [strength, setStrength] = useState(160)
    const [language, setLanguage] = useState('english')
    const [mnemonic, setMnemonic] = useState('')
    const [seedHex, setSeedHex] = useState('')

    const handleChangeLanguage = (selectedLanguage: any) => { 
        setLanguage(selectedLanguage.value);
        generateSeed(strength, selectedLanguage.value) 
    }
    
    const handleChangeLength = (selectedStrength: any) => { 
        setStrength(selectedStrength.value);
        generateSeed(selectedStrength.value, language) 
    }
    

    /**
    * Generate mnemonic passphrase + seed
    * @param  strength : size of paasphrase word in Bits
    * @param language : prefered language for passphrase
    */
    function generateSeed(strength: number, language: string) {
        bip39.setDefaultWordlist(language)
        const myMnemonic = bip39.generateMnemonic(strength)
        setMnemonic(myMnemonic)
        const mySeed = bip39.mnemonicToSeedSync(myMnemonic)
        setSeedHex(mySeed.toString('hex'))
    }

    return ( 
        <>
            <H3Styled>Generate a random mnemonic words following BIP39 standard</H3Styled>
            
            <RowStyled >
                <ColTextStyled xs={{ span: 2 }}>
                    <ParagraphStyled>
                        Select Length:
                    </ParagraphStyled>  
                </ColTextStyled>
                    <ColInputStyled xs={{ span: 10 }}>
                        <SelectStyled options={EntropyLength}
                            width="100%"  
                            defaultValue={{ label: "160 bits (15 words)", value: "160" }}
                            onChange={handleChangeLength}
                        />
                </ColInputStyled>
            </RowStyled>
            <RowStyled >
                <ColTextStyled xs={{ span: 2 }}>
                    <ParagraphStyled>
                    Select Language:
                    </ParagraphStyled>  
                </ColTextStyled>
                    <ColInputStyled id="language" xs={{ span: 10 }}>
                        <SelectStyled classNamePrefix='list'
                            options={Countries} 
                            onChange={handleChangeLanguage} 
                        />
                </ColInputStyled>
            </RowStyled>
            <RowStyled>
                <Col xs={{span: 12}}>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon3" >Mnemonic: </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl id="basic-url" aria-describedby="basic-addon3" value={mnemonic} disabled />
                    </InputGroup>
                </Col>
            </RowStyled>
            <RowStyled>
                <Col xs={{span: 12}}>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>BIP-39 Seed: </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl as="textarea" aria-label="With textarea" value={seedHex} disabled />
                    </InputGroup>
                </Col>
            </RowStyled>
        </>
    )
}

export default Seed;