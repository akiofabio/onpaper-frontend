import React from 'react'

export function separarParagrafo(texto){
    return texto.split("\n").map(txt => <p>{txt}</p>)
}
export function separarParagrafoSemMargem(texto){
    return texto.split("\n").map(txt => <p style={{ margin:0, padding:0, fontSize:10}}>{txt}</p>)
}