export function separarParagrafo(texto){
    return texto.split("\n").map(txt => <p>{txt}</p>)
}