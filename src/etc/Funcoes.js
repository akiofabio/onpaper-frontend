import React from 'react'
import {cepMask} from '../etc/Mask'
export function separarParagrafo(texto){
    return texto.split("\n").map(txt => <p>{txt}</p>)
}

export function separarParagrafoSemMargem(texto){
    return texto.split("\n").map(txt => <p style={{ margin:0, padding:0}}>{txt}</p>)
}
export function separarParagrafoSemMargemFonte(texto,tamnhoFonte){
    return texto.split("\n").map(txt => <p style={{ margin:0, padding:0, fontSize:tamnhoFonte}}>{txt}</p>)
}
export function cartaoToString(cartao){
    return "Nome: " + cartao.nome + "\nNumero: " + cartao.numero + "\n" + cartao.bandeira
}

export function enderecoToString(endereco){
    return "Nome: " + endereco.nome + 
    "\n" + endereco.tipoLogradouro + " " + endereco.logradouro + ", nº " + endereco.numero +
    "\n" + cepMask(endereco.cep) + " - " + endereco.bairro + " - " + endereco.cidade + " - " + endereco.estado
}

export function dateToUTC (data) {
    var dataTemp = new Date(data)
    dataTemp.setMinutes(dataTemp.getMinutes() + dataTemp.getTimezoneOffset())
    return dataTemp;
}

export function getUltimoStatus(status){
    var ultimoStatus={
        data: new Date(0).getDate,
        status: "Status nao Encontrado"
    }
    if(status!==undefined && status.length>0){
        ultimoStatus = status[status.length - 1]
    }
    return ultimoStatus
};