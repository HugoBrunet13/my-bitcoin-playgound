import * as Yup from 'yup';
import * as bip32 from 'bip32';
import styled from '@emotion/styled';
import * as bitcoin from 'bitcoinjs-lib';

import { useState } from 'react';
import { useFormik } from 'formik';
import { Button, Col, Row, InputGroup, FormControl } from 'react-bootstrap';

const H3Styled = styled.h3`
    margin-top: 1rem;
    margin-bottom: 2rem;
`
    
const H5Styled = styled.h5`
    margin-top: 1rem;
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

//Input styled component
interface IInputStyled {
    width?: number;
    marginTop?: number;
}

const InputStyled = styled(FormControl) <IInputStyled>`
    width: ${props => props.width ? props.width + 'rem' : "100%"};
    margin-top: ${props => props.marginTop ?? 1}rem;
`

// Button styled
interface IButtonStyled {
    marginTop?: number;
}

const ButtonStyled = styled(Button) <IButtonStyled>`
    margin-top: ${props => props.marginTop ?? 0}rem;
    cursor: pointer;
`

let validationSchema = Yup.object({
    seed: Yup.string()
      .required("Seed is a required field")
      .test('check-seed','Invalid Seed',
        function(value) {
          if (value) {
            try {
              const seed = Buffer.from(value, 'hex')
              bip32.fromSeed(seed)
            } catch (error) {
              return false
            }
            return true
          }
          return false
        }),
    purpose: Yup.number()
      .required("Purpose is a required field")
      .typeError("A number is required"),
    coin: Yup.number()
      .required("Coin is a required field")
      .typeError("A number is required"),
    account: Yup.number()
      .required("Account is a required field")
      .min(0, 'Please specify a number between 0 and 100')
      .max(100, 'Please specify a number between 0 and 100')
      .typeError("A number is required"),
    change: Yup.number()
      .required("Change is a required field")
      .min(0, 'Change must be etiher 0 (external) or 1 (internal)')
      .max(1, 'Change must be etiher 0 (external) or 1 (internal)')
      .typeError("A number is required"),
    addressIndex: Yup.number()
      .required("Address Index is a required field")
      .typeError("A number is required"),
})

interface ISeedPath {
    seed: string,
    purpose: number;
    coin: number;
    account: number;
    change: number;
    addressIndex: number;
  }

const Hierarchiral = () => {

    const formik = useFormik({
        initialValues: {
          seed: '',
          purpose: 44,
          coin: 0,
          account: 0,
          change: 0,
          addressIndex: 0
        },
        validationSchema,
        onSubmit: values => genSegWitBtcAddress(values)
      }) //
    
    const [path, setPath] = useState('')   //
    const [addressBtc, setaddressBtc] = useState('')   // Rename
    const [pubKey, setPubKey] = useState('')  // Rename
    const [privKey, setPrivKey] = useState('')  // Rename
    

    /**
     * Generate a Hierarchical Deterministic (HD) Segregated Witness (SegWit) bitcoin
     * address from a given seed and path
     * @param seedPath
     */
    function genSegWitBtcAddress(seedPath: ISeedPath) {
        let seedHex = seedPath.seed

        //compute path
        const path = "m/" + seedPath.purpose + "'/" + seedPath.coin + "'/" + seedPath.account + "'/" + seedPath.change + "/" + seedPath.addressIndex; //Can compute path automatically when one prop is updated?
        setPath(path)

        try {
            const seed = Buffer.from(seedHex, 'hex')
            const root = bip32.fromSeed(seed)
            const child = root.derivePath(path)
            const keyPair = bitcoin.ECPair.fromWIF(child.toWIF())
    
            const { address } = bitcoin.payments.p2sh({
            redeem: bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey }),
            });
    
            if (address) {
            setaddressBtc(address)
            setPubKey(keyPair.publicKey.toString('hex'))
            if (keyPair.privateKey)
                setPrivKey(keyPair.privateKey.toString('hex'))
            }
        } catch (error) {
            alert("Failed to generate SegWit BTC Address")
            console.log(error)
        }
    }

    return(
        <>
            <H3Styled>
                Generate a Hierarchical Deterministic (HD) Segregated Witness (SegWit) bitcoin
                address from a given seed and path
            </H3Styled>

            <form onSubmit={formik.handleSubmit}>
                <RowStyled>
                    <ColTextStyled xs={{ span: 2 }}>
                        <ParagraphStyled>
                            Seed:
                        </ParagraphStyled>
                    </ColTextStyled>
                    <ColInputStyled xs={{ span: 10 }}>
                    <InputStyled id="seed" placeholder="Enter a valid Seed" marginTop={0} onChange={(value: any) => formik.handleChange(value)} value={formik.values.seed} />
                        {
                        formik.errors.seed && formik.touched.seed ?
                            <ParagraphStyled color='error'>
                            {formik.errors.seed}
                            </ParagraphStyled>
                            :
                            null
                        }
                    </ColInputStyled>
                </RowStyled>

                <RowStyled>
                    <ColTextStyled xs={{ span: 2 }}>
                        <ParagraphStyled>
                            Purpose:
                        </ParagraphStyled>  
                    </ColTextStyled>
                    <ColInputStyled xs={{ span: 10 }}>
                    <InputStyled id="purpose" marginTop={0} onChange={(value: any) => formik.handleChange(value)} value={formik.values.purpose} disabled />
                        {
                        formik.errors.purpose && formik.touched.purpose ?
                            <ParagraphStyled color='error'>
                            {formik.errors.purpose}
                            </ParagraphStyled>
                            :
                            null
                        }
                    </ColInputStyled>
                </RowStyled>
                
                <RowStyled>
                    <ColTextStyled xs={{ span: 2 }}>
                        <ParagraphStyled>
                            Coin:
                        </ParagraphStyled>  
                    </ColTextStyled>
                    <ColInputStyled xs={{ span: 10 }}>
                    <InputStyled id="coin" marginTop={0} onChange={(value: any) => formik.handleChange(value)} value={formik.values.coin} disabled />
                        {
                        formik.errors.coin && formik.touched.coin ?
                            <ParagraphStyled color='error'>
                            {formik.errors.coin}
                            </ParagraphStyled>
                            :
                            null
                        }
                    </ColInputStyled>
                </RowStyled>

                <RowStyled>
                    <ColTextStyled xs={{ span: 2 }}>
                        <ParagraphStyled>
                        Account:
                        </ParagraphStyled>  
                    </ColTextStyled>
                    <ColInputStyled xs={{ span: 10 }}>
                    <InputStyled id="account" marginTop={0} onChange={(value: any) => formik.handleChange(value)} value={formik.values.account} />
                        {
                        formik.errors.account && formik.touched.account ?
                            <ParagraphStyled color='error'>
                            {formik.errors.account}
                            </ParagraphStyled>
                            :
                            null
                        }
                    </ColInputStyled>
                </RowStyled>

                <RowStyled>
                    <ColTextStyled xs={{ span: 2 }}>
                        <ParagraphStyled>
                        Change:
                        </ParagraphStyled>  
                    </ColTextStyled>
                    <ColInputStyled xs={{ span: 10 }}>
                     <InputStyled id="change" marginTop={0} onChange={(value: any) => formik.handleChange(value)} value={formik.values.change} />
                        {
                        formik.errors.change && formik.touched.change ?
                            <ParagraphStyled color='error'>
                            {formik.errors.change}
                            </ParagraphStyled>
                            :
                            null
                        }
                    </ColInputStyled>
                </RowStyled>

                <RowStyled>
                    <ColTextStyled xs={{ span: 2 }}>
                        <ParagraphStyled>
                        Address Index:
                        </ParagraphStyled>  
                    </ColTextStyled>
                    <ColInputStyled xs={{ span: 10 }}>
                    <InputGroup>
                        <InputStyled id="addressIndex" marginTop={0} onChange={(value: any) => formik.handleChange(value)} value={formik.values.addressIndex} disabled/>
                    {
                        formik.errors.addressIndex && formik.touched.addressIndex ?
                            <ParagraphStyled color='error'>
                            {formik.errors.addressIndex}
                            </ParagraphStyled>
                            :
                            null
                        }
                    </InputGroup>
                    </ColInputStyled>
                </RowStyled>

                <RowStyled>
                    <Col xs={{ span: 12 }}>
                    <ButtonStyled variant="outline-primary" type="submit">
                        Submit
                    </ButtonStyled>
                    </Col>
                </RowStyled>
            </form>

            <Row>
                <Col xs={{ span: 12 }}>
                    <H5Styled>
                        Path: {path} 
                    </H5Styled>
                </Col>
            </Row>

            <RowStyled>
                <InputGroup>
                    <InputGroup.Prepend>
                    <InputGroup.Text>Address: </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl as="textarea" aria-label="With textarea" value={addressBtc} disabled />
                </InputGroup>
                </RowStyled>
                <RowStyled>
                <InputGroup>
                    <InputGroup.Prepend>
                    <InputGroup.Text>Public Key: </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl as="textarea" aria-label="With textarea" value={pubKey} disabled />
                </InputGroup>
                </RowStyled>
                <RowStyled>
                <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>Private Key: </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl as="textarea" aria-label="With textarea" value={privKey} disabled />
                </InputGroup>
            </RowStyled>
        </>
    )
}

export default Hierarchiral;