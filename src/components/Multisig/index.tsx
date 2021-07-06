import * as Yup from 'yup';
import styled from '@emotion/styled';
import * as bitcoin from 'bitcoinjs-lib';

import { useState } from 'react';
import { FormikProvider, FieldArray, useFormik } from 'formik';
import { Col, InputGroup, Row, FormControl, Button } from 'react-bootstrap';

const H5Styled = styled.h5`
    margin-top: 1rem;
`

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

let validationSchema = Yup.object({
    pubkeys: Yup.array()
        .of(
            Yup.string()
            .required("Public Key is a required field")
            .test('check-pubkey','Invalid Public Key', 
                function(value) {
                    if (value) {
                        try {
                            const pubkeyBuff =  Buffer.from(value, 'hex');
                            const { address } = bitcoin.payments.p2sh({
                                redeem: bitcoin.payments.p2wpkh({ pubkey: pubkeyBuff }),
                            });
                            if (address && !address.startsWith("3")) //check if address is SegWit P2SH
                                return false
                        } catch (error) {
                            return false
                        }
                        return true
                    }
                    return false
                })
            )
        .required()
        .min(1),
    appRequired: Yup.number()
        .when('pubkeys', (pubkeys: string[]) => {
            return  Yup.number().max(pubkeys?.length, 'Approvals required must be lesser or equal than the number of specified Public Keys (' + pubkeys?.length+')')
                                .required("Approvals required is a requested field")
                                .min(1,'Approvals required must be greater than 0');
        })  
})  

// Button styled
interface IButtonStyled {
    marginTop?: number;
}

const ButtonStyled = styled(Button) <IButtonStyled>`
    margin-top: ${props => props.marginTop ?? 0}rem;
    cursor: pointer;
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

const Multisig = () => {

    const [addressMultiSig, setAddressMultiSig] = useState('')  
  
    const formik = useFormik({
      initialValues: {
        pubkeys: [''],
        appRequired: 1,
      },
      validationSchema,
      onSubmit: values => genMultiSigAddress(values.appRequired,values.pubkeys)
    }) 
  
    /**
     * Generate an n-out-of-m Multisignature (multi-sig) Pay-To-Script-Hash
     * (P2SH) bitcoin address,
     * @param m : Number of requested approvers
     * @param pubkeys: Array of public keys
     */
    function genMultiSigAddress(m: number, pubkeys: string[]) {
        try {
            const pubkeysBuff = pubkeys.map(hex => Buffer.from(hex, 'hex'));
            const { address } = bitcoin.payments.p2sh({
                redeem: bitcoin.payments.p2wsh({
                    redeem: bitcoin.payments.p2ms({ m: +m, pubkeys: pubkeysBuff }),
                    }),
                });
            if (address) {
                setAddressMultiSig(address)
            }
      } catch (error) {
          alert("Faild to generate MultiSig address")
          console.log(error)
      }

    }

    return (
        <>
            <H3Styled>
            Generate an n-out-of-m Multisignature (multi-sig) Pay-To-Script-Hash
            (P2SH) bitcoin address, where n, m and public keys can be specified
            </H3Styled>
            <form onSubmit={formik.handleSubmit}>
                <H5Styled>
                    Multi-Sig Approvers:
                </H5Styled>
                
                <FormikProvider value={formik}>
                    <FieldArray name="pubkeys">
                    {
                        ({insert, remove, push}) => (
                        <>
                            {
                            formik.values.pubkeys.length > 0 && 
                                formik.values.pubkeys.map((field, index) => {
                                return (
                                    <RowStyled>
                                        <ColTextStyled xs={{ span: 2 }}>
                                            <ParagraphStyled>
                                                Public Key:
                                            </ParagraphStyled>  
                                        </ColTextStyled>
                                        <ColInputStyled>
                                            <InputStyled marginTop={0} id={`pubkeys.${index}`} onChange={formik.handleChange} value={formik.values.pubkeys[index]}/>
                                            {
                                                formik.errors.pubkeys && formik.touched.pubkeys  ?
                                                    <ParagraphStyled color='error'>
                                                        {formik.errors.pubkeys ? formik.errors.pubkeys[index] : ''}
                                                    </ParagraphStyled>
                                                :
                                                    null
                                            } 
                                        </ColInputStyled>
                                        {
                                            index === 0 ?
                                            undefined
                                            :
                                            <ColInputStyled xs={{span: 1}}>
                                                <ButtonStyled variant="secondary" onClick={() => {  remove(index)}}>
                                                X
                                                </ButtonStyled>
                                            </ColInputStyled>
                                        }
                                        
                                    </RowStyled>
                                );
                                })
                            }
                            <ButtonStyled marginTop={1} variant="outline-success" size="sm" onClick={() => push('')}>
                                Add Public Key
                            </ButtonStyled>
                        </>
                        )
                    }
                    </FieldArray>
                </FormikProvider>

                <RowStyled>
                    <ColTextStyled xs={{ span: 2 }}>
                        <ParagraphStyled>
                        Approvals Required:
                        </ParagraphStyled>  
                    </ColTextStyled>
                    <ColInputStyled xs={{ span: 10 }}>
                        <InputStyled id="appRequired" marginTop={0} onChange={(value: any) => formik.handleChange(value)} value={formik.values.appRequired} />
                        {
                            formik.errors.appRequired && formik.touched.appRequired ?
                            <ParagraphStyled color='error'>
                                {formik.errors.appRequired}
                            </ParagraphStyled>
                            :
                            null
                        }
                    </ColInputStyled>
                </RowStyled>

                <RowStyled>
                    <Col xs={{ span: 12}}>
                        <ButtonStyled variant="outline-primary" type="submit">
                            Submit
                        </ButtonStyled>
                    </Col>
                </RowStyled>
            </form>

            <RowStyled>
                <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>Address: </InputGroup.Text>
                    </InputGroup.Prepend>
                <FormControl as="textarea" aria-label="With textarea" value={addressMultiSig} disabled />
                </InputGroup>
            </RowStyled>
        </>
    )
}

export default Multisig;